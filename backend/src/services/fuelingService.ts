import { db } from "../db";
import { abastecimentos, veiculos } from "../db/schema";
import { eq, and, desc, asc, count, between, sql } from "drizzle-orm";
import { CreateFuelingRequest, UpdateFuelingRequest } from "../types";
import crypto from 'crypto';
import type { FuelingFilters, PaginationParams, ServiceResult } from '../types/common';

// 🛡️ Interfaces para melhor tipagem
interface FuelingData {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: number; // Unix timestamp
  kmAtual: number;
  quantidadeLitros: number;
  valorTotal: number; // Em centavos
  valorLitro: number; // Em centavos
  nomePosto: string | null;
  tipoCombustivel: "gasolina" | "etanol" | "diesel" | "gnv" | "flex";
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

interface CreateFuelingData {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: number; // Unix timestamp
  kmAtual: number;
  quantidadeLitros: number;
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
    
    if (!Number.isFinite(data.quantidadeLitros) || data.quantidadeLitros <= 0) {
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
      dataAbastecimento: new Date(data.data).getTime(), // Convert Date to timestamp
      kmAtual: data.quilometragem,
      quantidadeLitros: data.quantidadeLitros,
      valorTotal: this.priceToCents(data.quantidadeLitros * data.precoPorLitro),
      valorLitro: this.priceToCents(data.precoPorLitro),
      nomePosto: data.posto?.trim() || null,
      tipoCombustivel: this.validateFuelType(data.tipoCombustivel),
    };
  }
}

// 🎯 Cache simples para consultas frequentes
class FuelingCache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static TTL = 5 * 60 * 1000; // 5 minutos

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  static set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clear(): void {
    this.cache.clear();
  }

  static invalidateUser(userId: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    });
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
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          })
          .returning();
      });

      // Invalidar cache do usuário
      FuelingCache.invalidateUser(userId);

      return {
        success: true,
        data: newFueling
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
   * 🔍 Obter abastecimentos por usuário com paginação e filtros
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
      
      // Cache key
      const cacheKey = `fuelings:${userId}:${JSON.stringify({ pagination, filters, orderBy })}`;
      const cached = FuelingCache.get(cacheKey);
      if (cached) return { success: true, data: cached };

      // Base query
      let query = db.select().from(abastecimentos).where(eq(abastecimentos.idUsuario, userId));
      
      // Filtros
      const conditions = [eq(abastecimentos.idUsuario, userId)];
      
      if (filters.vehicleId) {
        conditions.push(eq(abastecimentos.idVeiculo, filters.vehicleId));
      }
      
      if (filters.startDate && filters.endDate) {
        conditions.push(
          between(
            abastecimentos.dataAbastecimento,
            new Date(filters.startDate).getTime(),
            new Date(filters.endDate).getTime()
          )
        );
      }
      
      if (filters.fuelType) {
        conditions.push(eq(abastecimentos.tipoCombustivel, filters.fuelType));
      }

      // Aplicar filtros
      query = query.where(and(...conditions));

      // Ordenação
      switch (orderBy) {
        case 'date_asc':
          query = query.orderBy(asc(abastecimentos.dataAbastecimento));
          break;
        case 'date_desc':
          query = query.orderBy(desc(abastecimentos.dataAbastecimento));
          break;
        case 'km_asc':
          query = query.orderBy(asc(abastecimentos.kmAtual));
          break;
        case 'km_desc':
          query = query.orderBy(desc(abastecimentos.kmAtual));
          break;
      }

      // Paginação
      const offset = (pagination.page - 1) * pagination.limit;
      query = query.limit(pagination.limit + 1).offset(offset); // +1 para verificar hasMore

      // Executar query
      const results = await query;
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

      const result = { fuelings, total, hasMore };
      
      // Cache resultado
      FuelingCache.set(cacheKey, result);

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
      const cacheKey = `fueling:${id}:${userId}`;
      const cached = FuelingCache.get<FuelingData>(cacheKey);
      if (cached) return { success: true, data: cached };

      const [fueling] = await db
        .select()
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.idUsuario, userId)
        ))
        .limit(1);

      if (fueling) {
        FuelingCache.set(cacheKey, fueling);
      }

      return {
        success: true,
        data: fueling || null
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
   * ✏️ Atualizar abastecimento com validação completa
   */
  static async updateFueling(
    id: string,
    userId: string,
    fuelingData: UpdateFuelingRequest
  ): Promise<ServiceResult<FuelingData | null>> {
    try {
      // Verificar se o abastecimento existe
      const existingFueling = await this.getFuelingById(id, userId);
      if (!existingFueling.success) {
        return existingFueling;
      }
      
      if (!existingFueling.data) {
        return {
          success: false,
          error: 'Abastecimento não encontrado'
        };
      }

      // Preparar dados para atualização
      const updateData: Partial<FuelingData> = {
        updatedAt: new Date().getTime()
      };

      // Mapear campos com validação
      if (fuelingData.data !== undefined) {
        const date = new Date(fuelingData.data);
        if (isNaN(date.getTime())) {
          throw new Error('Data de abastecimento inválida');
        }
        updateData.dataAbastecimento = date.getTime();
      }

      if (fuelingData.quilometragem !== undefined) {
        if (!Number.isFinite(fuelingData.quilometragem) || fuelingData.quilometragem < 0) {
          throw new Error('Quilometragem deve ser um número válido e positivo');
        }
        updateData.kmAtual = fuelingData.quilometragem;
      }

      if (fuelingData.quantidadeLitros !== undefined) {
        if (!Number.isFinite(fuelingData.quantidadeLitros) || fuelingData.quantidadeLitros <= 0) {
          throw new Error('Quantidade de litros deve ser um número válido e positivo');
        }
        updateData.quantidadeLitros = fuelingData.quantidadeLitros;
        
        // Recalcular valor total se temos preço
        if (fuelingData.precoPorLitro !== undefined) {
          updateData.valorTotal = FuelingUtils.priceToCents(
            fuelingData.quantidadeLitros * fuelingData.precoPorLitro
          );
        }
      }

      if (fuelingData.precoPorLitro !== undefined) {
        if (!Number.isFinite(fuelingData.precoPorLitro) || fuelingData.precoPorLitro <= 0) {
          throw new Error('Preço por litro deve ser um número válido e positivo');
        }
        updateData.valorLitro = FuelingUtils.priceToCents(fuelingData.precoPorLitro);
        
        // Recalcular valor total
        const litros = fuelingData.quantidadeLitros ?? existingFueling.data.quantidadeLitros;
        updateData.valorTotal = FuelingUtils.priceToCents(litros * fuelingData.precoPorLitro);
      }

      if (fuelingData.posto !== undefined) {
        updateData.nomePosto = fuelingData.posto?.trim() || null;
      }

      if (fuelingData.tipoCombustivel !== undefined) {
        updateData.tipoCombustivel = FuelingUtils.validateFuelType(fuelingData.tipoCombustivel);
      }

      if (fuelingData.vehicleId !== undefined) {
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
        
        updateData.idVeiculo = fuelingData.vehicleId;
      }

      // Atualizar no banco
      const [updatedFueling] = await db
        .update(abastecimentos)
        .set(updateData)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.idUsuario, userId)
        ))
        .returning();

      // Invalidar cache
      FuelingCache.invalidateUser(userId);

      return {
        success: true,
        data: updatedFueling || null
      };

    } catch (error) {
      console.error('[FuelingService.updateFueling]', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar abastecimento'
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
      
      if (deleted) {
        // Invalidar cache
        FuelingCache.invalidateUser(userId);
      }

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
   * 📊 Estatísticas de abastecimento
   */
  static async getFuelingStats(
    userId: string,
    vehicleId?: string
  ): Promise<ServiceResult<{
    totalFuelings: number;
    totalSpent: number;
    totalLiters: number;
    averagePrice: number;
    lastFueling?: number; // Unix timestamp
  }>> {
    try {
      const cacheKey = `stats:${userId}:${vehicleId || 'all'}`;
      const cached = FuelingCache.get(cacheKey);
      if (cached) return { success: true, data: cached };

      const conditions = [eq(abastecimentos.idUsuario, userId)];
      if (vehicleId) {
        conditions.push(eq(abastecimentos.idVeiculo, vehicleId));
      }

      const [stats] = await db
        .select({
          totalFuelings: count(),
          totalSpent: sql<number>`COALESCE(SUM(${abastecimentos.valorTotal}), 0)`,
          totalLiters: sql<number>`COALESCE(SUM(${abastecimentos.quantidadeLitros}), 0)`,
          averagePrice: sql<number>`COALESCE(AVG(${abastecimentos.valorLitro}), 0)`,
          lastFueling: sql<number>`MAX(${abastecimentos.dataAbastecimento})`,
        })
        .from(abastecimentos)
        .where(and(...conditions));

      const result = {
        totalFuelings: stats.totalFuelings,
        totalSpent: FuelingUtils.centsToPrice(stats.totalSpent),
        totalLiters: stats.totalLiters,
        averagePrice: FuelingUtils.centsToPrice(stats.averagePrice),
        lastFueling: stats.lastFueling,
      };

      // Cache por 10 minutos
      FuelingCache.set(cacheKey, result);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('[FuelingService.getFuelingStats]', error);
      return {
        success: false,
        error: 'Erro ao buscar estatísticas'
      };
    }
  }
}


