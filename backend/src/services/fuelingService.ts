import { db } from "../db";
import { abastecimentos, veiculos } from '../db';
import { eq, and, desc, asc, count, between, sql, gte, lte } from "drizzle-orm";
import { CreateFuelingRequest, UpdateFuelingRequest } from "../types";
import crypto from 'crypto';
import type { FuelingFilters, PaginationParams, ServiceResult } from '../types';

// 🛡️ Interfaces para melhor tipagem
interface FuelingData {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: Date;
  kmAtual: number | null;
  litros: number;
  valorTotal: number; // Em centavos
  valorLitro: number; // Em centavos
  nomePosto: string | null;
  tipoCombustivel: "gasolina" | "etanol" | "diesel" | "gnv" | "flex";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface CreateFuelingData {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: Date;
  kmAtual: number;
  litros: number;
  valorTotal: number; // Em centavos
  valorLitro: number; // Em centavos
  nomePosto: string | null;
  tipoCombustivel: "gasolina" | "etanol" | "diesel" | "gnv" | "flex";
}

// 🔧 Utilitários de conversão e validação
class FuelingUtils {
  /**
   * Converte preço por litro para centavos
   */
  static priceToCents(price: number): number {
    if (!Number.isFinite(price) || price < 0) {
      throw new Error('Preço deve ser um número válido e positivo');
    }
    return Math.round(price * 100);
  }

  /**
   * Converte centavos para preço
   */
  static centsToPrice(cents: number): number {
    return cents / 100;
  }

  /**
   * Valida tipo de combustível
   */
  static validateFuelType(type: string): "gasolina" | "etanol" | "diesel" | "gnv" | "flex" {
    const validTypes = ["gasolina", "etanol", "diesel", "gnv", "flex"];
    const normalizedType = type.toLowerCase();
    
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Tipo de combustível inválido. Valores aceitos: ${validTypes.join(', ')}`);
    }
    
    return normalizedType as any;
  }

  /**
   * Valida dados de abastecimento
   */
  static validateFuelingData(data: CreateFuelingRequest): void {
    if (!data.vehicleId || typeof data.vehicleId !== 'string') {
      throw new Error('ID do veículo é obrigatório');
    }
    
    if (!data.data || isNaN(new Date(data.data).getTime())) {
      throw new Error('Data de abastecimento é obrigatória e deve ser válida');
    }
    
    if (!Number.isFinite(data.quilometragem) || data.quilometragem < 0) {
      throw new Error('Quilometragem deve ser um número válido e positivo');
    }
    
    if (!Number.isFinite(data.litros) || data.litros <= 0) {
      throw new Error('Quantidade de litros deve ser um número válido e positivo');
    }
    
    if (!Number.isFinite(data.precoPorLitro) || data.precoPorLitro <= 0) {
      throw new Error('Preço por litro deve ser um número válido e positivo');
    }
  }

  /**
   * Converte dados de entrada para formato do banco
   */
  static mapToDatabase(userId: string, data: CreateFuelingRequest): CreateFuelingData {
    return {
      id: crypto.randomUUID(),
      idUsuario: userId,
      idVeiculo: data.vehicleId,
      dataAbastecimento: new Date(data.data),
      kmAtual: data.quilometragem,
      litros: data.litros,
      valorTotal: this.priceToCents(data.litros * data.precoPorLitro),
      valorLitro: this.priceToCents(data.precoPorLitro),
      nomePosto: data.posto?.trim() || null,
      tipoCombustivel: this.validateFuelType(data.tipoCombustivel),
    };
  }
}

export class FuelingService {
  /**
   * 🚀 Criar novo abastecimento com validação completa
   */
  static async createFueling(
    userId: string, 
    fuelingData: CreateFuelingRequest
  ): Promise<ServiceResult<FuelingData>> {
    try {
      // Validação de entrada
      FuelingUtils.validateFuelingData(fuelingData);

      // Verificar se o veículo existe e pertence ao usuário
      const vehicleExists = await db
        .select({ id: veiculos.id })
        .from(veiculos)
        .where(and(
          eq(veiculos.id, fuelingData.vehicleId),
          eq(veiculos.idUsuario, userId)
        ))
        .limit(1);

      if (vehicleExists.length === 0) {
        return {
          success: false,
          error: 'Veículo não encontrado ou não pertence ao usuário'
        };
      }

      // Converter dados
      const newFuelingData = FuelingUtils.mapToDatabase(userId, fuelingData);
      
      // Inserir com transação
      const [newFueling] = await db.transaction(async (tx) => {
        return await tx.insert(abastecimentos)
          .values({
            ...newFuelingData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
      });

      return {
        success: true,
        data: newFueling as FuelingData
      };

    } catch (error) {
      console.error('[FuelingService.createFueling]', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      };
    }
  }

  /**
   * 📋 Obter abastecimentos por usuário com paginação e filtros
   */
  static async getFuelingsByUserId(
    userId: string,
    options: {
      pagination?: PaginationParams;
      filters?: FuelingFilters;
      orderBy?: 'date_asc' | 'date_desc' | 'km_asc' | 'km_desc';
    } = {}
  ): Promise<ServiceResult<{ fuelings: FuelingData[]; total: number; hasMore: boolean }>> {
    try {
      const { pagination = { page: 1, limit: 50 }, filters = {}, orderBy = 'date_desc' } = options;
      
      // Base query com filtros
      const conditions = [eq(abastecimentos.idUsuario, userId)];
      
      if (filters.vehicleId) {
        conditions.push(eq(abastecimentos.idVeiculo, filters.vehicleId));
      }
      
      if (filters.startDate && filters.endDate) {
        conditions.push(
          between(
            abastecimentos.dataAbastecimento,
            new Date(filters.startDate),
            new Date(filters.endDate)
          )
        );
      }
      
      if (filters.fuelType) {
        conditions.push(eq(abastecimentos.tipoCombustivel, FuelingUtils.validateFuelType(filters.fuelType)));
      }

      // Construir query com condições aplicadas
      const query = db.select().from(abastecimentos)
        .where(and(...conditions));

      // Ordenação
      let orderedQuery;
      switch (orderBy) {
        case 'date_asc':
          orderedQuery = query.orderBy(asc(abastecimentos.dataAbastecimento));
          break;
        case 'date_desc':
          orderedQuery = query.orderBy(desc(abastecimentos.dataAbastecimento));
          break;
        case 'km_asc':
          orderedQuery = query.orderBy(asc(abastecimentos.kmAtual));
          break;
        case 'km_desc':
          orderedQuery = query.orderBy(desc(abastecimentos.kmAtual));
          break;
        default:
          orderedQuery = query;
          break;
      }

      // Paginação
      const offset = (pagination.page - 1) * pagination.limit;
      const results = await orderedQuery.limit(pagination.limit + 1).offset(offset);
      const hasMore = results.length > pagination.limit;
      const fuelings = hasMore ? results.slice(0, -1) : results;

      // Contar total (só se necessário para primeira página)
      let total = 0;
      if (pagination.page === 1) {
        const [countResult] = await db
          .select({ count: count() })
          .from(abastecimentos)
          .where(and(...conditions));
        total = countResult.count;
      }

      const result = { fuelings: fuelings as FuelingData[], total, hasMore };

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('[FuelingService.getFuelingsByUserId]', error);
      return {
        success: false,
        error: 'Erro ao buscar abastecimentos'
      };
    }
  }

  /**
   * 🔍 Obter abastecimento por ID com validação de propriedade
   */
  static async getFuelingById(
    id: string, 
    userId: string
  ): Promise<ServiceResult<FuelingData | null>> {
    try {
      const [fueling] = await db
        .select()
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.idUsuario, userId)
        ))
        .limit(1);

      return {
        success: true,
        data: fueling ? (fueling as FuelingData) : null
      };

    } catch (error) {
      console.error('[FuelingService.getFuelingById]', error);
      return {
        success: false,
        error: 'Erro ao buscar abastecimento'
      };
    }
  }

  /**
   * 🗑️ Deletar abastecimento com confirmação
   */
  static async deleteFueling(
    id: string, 
    userId: string
  ): Promise<ServiceResult<boolean>> {
    try {
      const result = await db
        .delete(abastecimentos)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.idUsuario, userId)
        ))
        .returning({ id: abastecimentos.id });

      const deleted = result.length > 0;

      return {
        success: true,
        data: deleted
      };

    } catch (error) {
      console.error('[FuelingService.deleteFueling]', error);
      return {
        success: false,
        error: 'Erro ao deletar abastecimento'
      };
    }
  }

  /**
   * 📊 Obter estatísticas de abastecimento para o dashboard
   */
  static async getFuelingStatistics(userId: string, periodo: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'): Promise<ServiceResult<any>> {
    try {
      let startDate: Date;
      const endDate = new Date();

      switch (periodo) {
        case 'day':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1);
          break;
        case 'week':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
          break;
        case 'quarter':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
          break;
        case 'year':
          startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
          break;
        case 'all':
        default:
          startDate = new Date(0);
          break;
      }

      const fuelings = await db.select()
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.idUsuario, userId),
          gte(abastecimentos.dataAbastecimento, startDate),
          lte(abastecimentos.dataAbastecimento, endDate)
        ));

      const totalFuelings = fuelings.length;
      const totalSpent = fuelings.reduce((sum, f) => sum + f.valorTotal, 0);
      const totalLiters = fuelings.reduce((sum, f) => sum + f.litros, 0);
      const averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;
      const lastFueling = fuelings.length > 0 ? Math.max(...fuelings.map(f => f.dataAbastecimento.getTime())) : undefined;

      const result = {
        totalFuelings,
        totalSpent: FuelingUtils.centsToPrice(totalSpent),
        totalLiters,
        averagePrice: FuelingUtils.centsToPrice(averagePrice),
        lastFueling: lastFueling ? new Date(lastFueling).toISOString() : undefined,
      };

      return { success: true, data: result };

    } catch (error) {
      console.error('[FuelingService.getFuelingStatistics]', error);
      return {
        success: false,
        error: 'Erro ao obter estatísticas de abastecimento'
      };
    }
  }

  /**
   * ✏️ Atualizar abastecimento existente
   */
  static async updateFueling(
    id: string,
    userId: string,
    updateData: UpdateFuelingRequest
  ): Promise<ServiceResult<FuelingData | null>> {
    try {
      // Verificar se o abastecimento existe e pertence ao usuário
      const existingFueling = await this.getFuelingById(id, userId);
      
      if (!existingFueling.success || !existingFueling.data) {
        return {
          success: false,
          error: 'Abastecimento não encontrado ou não pertence ao usuário'
        };
      }

      // Preparar dados para atualização
      const updateFields: any = {
        updatedAt: new Date()
      };

      if (updateData.vehicleId) {
        // Verificar se o veículo existe e pertence ao usuário
        const vehicleExists = await db
          .select({ id: veiculos.id })
          .from(veiculos)
          .where(and(
            eq(veiculos.id, updateData.vehicleId),
            eq(veiculos.idUsuario, userId)
          ))
          .limit(1);

        if (vehicleExists.length === 0) {
          return {
            success: false,
            error: 'Veículo não encontrado ou não pertence ao usuário'
          };
        }
        updateFields.idVeiculo = updateData.vehicleId;
      }

      if (updateData.data) {
        updateFields.dataAbastecimento = new Date(updateData.data);
      }

      if (updateData.quilometragem !== undefined) {
        if (!Number.isFinite(updateData.quilometragem) || updateData.quilometragem < 0) {
          return {
            success: false,
            error: 'Quilometragem deve ser um número válido e positivo'
          };
        }
        updateFields.kmAtual = updateData.quilometragem;
      }

      if (updateData.litros !== undefined) {
        if (!Number.isFinite(updateData.litros) || updateData.litros <= 0) {
          return {
            success: false,
            error: 'Quantidade de litros deve ser um número válido e positivo'
          };
        }
        updateFields.litros = updateData.litros;
      }

      if (updateData.precoPorLitro !== undefined) {
        if (!Number.isFinite(updateData.precoPorLitro) || updateData.precoPorLitro <= 0) {
          return {
            success: false,
            error: 'Preço por litro deve ser um número válido e positivo'
          };
        }
        updateFields.valorLitro = FuelingUtils.priceToCents(updateData.precoPorLitro);
        
        // Recalcular valor total se quantidade de litros também foi fornecida ou usar a existente
        const litros = updateData.litros || existingFueling.data.litros;
        updateFields.valorTotal = FuelingUtils.priceToCents(litros * updateData.precoPorLitro);
      }

      if (updateData.posto !== undefined) {
        updateFields.nomePosto = updateData.posto?.trim() || null;
      }

      if (updateData.tipoCombustivel) {
        updateFields.tipoCombustivel = FuelingUtils.validateFuelType(updateData.tipoCombustivel);
      }

      // Atualizar no banco
      const [updatedFueling] = await db
        .update(abastecimentos)
        .set(updateFields)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.idUsuario, userId)
        ))
        .returning();

      return {
        success: true,
        data: updatedFueling ? (updatedFueling as FuelingData) : null
      };

    } catch (error) {
      console.error('[FuelingService.updateFueling]', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar abastecimento'
      };
    }
  }
}