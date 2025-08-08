import { db } from "../db";
import { abastecimentos, veiculos } from "../db/schema";
import { eq, and, desc, asc, count, between, sql } from "drizzle-orm";
import { CreateFuelingRequest, UpdateFuelingRequest } from "../types";
import crypto from 'crypto';
import type { FuelingFilters, PaginationParams, ServiceResult } from '../types/common';

// 🛡️ Interfaces para melhor tipagem
interface FuelingData {
  id: string;
  id_usuario: string;
  id_veiculo: string;
  data_abastecimento: Date;
  km_atual: number;
  quantidade_litros: number;
  valor_total: number;
  valor_litro: number;
  nome_posto: string | null;
  tipo_combustivel: "gasolina" | "etanol" | "diesel" | "gnv" | "flex";
  created_at: Date;
  updated_at: Date;
}

interface CreateFuelingData {
  id: string;
  id_usuario: string;
  id_veiculo: string;
  data_abastecimento: Date;
  km_atual: number;
  quantidade_litros: number;
  valor_total: number;
  valor_litro: number;
  nome_posto: string | null;
  tipo_combustivel: "gasolina" | "etanol" | "diesel" | "gnv" | "flex";
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
    
    if (!Number.isFinite(data.quantidade_litros) || data.quantidade_litros <= 0) {
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
      id_usuario: userId,
      id_veiculo: data.vehicleId,
      data_abastecimento: new Date(data.data),
      km_atual: data.quilometragem,
      quantidade_litros: data.quantidade_litros,
      valor_total: this.priceToCents(data.quantidade_litros * data.precoPorLitro),
      valor_litro: this.priceToCents(data.precoPorLitro),
      nome_posto: data.posto?.trim() || null,
      tipo_combustivel: this.validateFuelType(data.tipoCombustivel),
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
          eq(veiculos.id_usuario, userId)
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
            created_at: new Date(),
            updated_at: new Date(),
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
      let query = db.select().from(abastecimentos).where(eq(abastecimentos.id_usuario, userId));
      
      // Filtros
      const conditions = [eq(abastecimentos.id_usuario, userId)];
      
      if (filters.vehicleId) {
        conditions.push(eq(abastecimentos.id_veiculo, filters.vehicleId));
      }
      
      if (filters.startDate && filters.endDate) {
        conditions.push(
          between(
            abastecimentos.data_abastecimento,
            new Date(filters.startDate),
            new Date(filters.endDate)
          )
        );
      }
      
      if (filters.fuelType) {
        conditions.push(eq(abastecimentos.tipo_combustivel, filters.fuelType));
      }

      // Aplicar filtros
      query = query.where(and(...conditions));

      // Ordenação
      switch (orderBy) {
        case 'date_asc':
          query = query.orderBy(asc(abastecimentos.data_abastecimento));
          break;
        case 'date_desc':
          query = query.orderBy(desc(abastecimentos.data_abastecimento));
          break;
        case 'km_asc':
          query = query.orderBy(asc(abastecimentos.km_atual));
          break;
        case 'km_desc':
          query = query.orderBy(desc(abastecimentos.km_atual));
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
          eq(abastecimentos.id_usuario, userId)
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
        updated_at: new Date()
      };

      // Mapear campos com validação
      if (fuelingData.data !== undefined) {
        const date = new Date(fuelingData.data);
        if (isNaN(date.getTime())) {
          throw new Error('Data de abastecimento inválida');
        }
        updateData.data_abastecimento = date;
      }

      if (fuelingData.quilometragem !== undefined) {
        if (!Number.isFinite(fuelingData.quilometragem) || fuelingData.quilometragem < 0) {
          throw new Error('Quilometragem deve ser um número válido e positivo');
        }
        updateData.km_atual = fuelingData.quilometragem;
      }

      if (fuelingData.quantidade_litros !== undefined) {
        if (!Number.isFinite(fuelingData.quantidade_litros) || fuelingData.quantidade_litros <= 0) {
          throw new Error('Quantidade de litros deve ser um número válido e positivo');
        }
        updateData.quantidade_litros = fuelingData.quantidade_litros;
        
        // Recalcular valor total se temos preço
        if (fuelingData.precoPorLitro !== undefined) {
          updateData.valor_total = FuelingUtils.priceToCents(
            fuelingData.quantidade_litros * fuelingData.precoPorLitro
          );
        }
      }

      if (fuelingData.precoPorLitro !== undefined) {
        if (!Number.isFinite(fuelingData.precoPorLitro) || fuelingData.precoPorLitro <= 0) {
          throw new Error('Preço por litro deve ser um número válido e positivo');
        }
        updateData.valor_litro = FuelingUtils.priceToCents(fuelingData.precoPorLitro);
        
        // Recalcular valor total
        const litros = fuelingData.quantidade_litros ?? existingFueling.data.quantidade_litros;
        updateData.valor_total = FuelingUtils.priceToCents(litros * fuelingData.precoPorLitro);
      }

      if (fuelingData.posto !== undefined) {
        updateData.nome_posto = fuelingData.posto?.trim() || null;
      }

      if (fuelingData.tipoCombustivel !== undefined) {
        updateData.tipo_combustivel = FuelingUtils.validateFuelType(fuelingData.tipoCombustivel);
      }

      if (fuelingData.vehicleId !== undefined) {
        // Verificar se o veículo existe e pertence ao usuário
        const vehicleExists = await db
          .select({ id: veiculos.id })
          .from(veiculos)
          .where(and(
            eq(veiculos.id, fuelingData.vehicleId),
            eq(veiculos.id_usuario, userId)
          ))
          .limit(1);

        if (vehicleExists.length === 0) {
          return {
            success: false,
            error: 'Veículo não encontrado ou não pertence ao usuário'
          };
        }
        
        updateData.id_veiculo = fuelingData.vehicleId;
      }

      // Atualizar no banco
      const [updatedFueling] = await db
        .update(abastecimentos)
        .set(updateData)
        .where(and(
          eq(abastecimentos.id, id),
          eq(abastecimentos.id_usuario, userId)
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
          eq(abastecimentos.id_usuario, userId)
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
    lastFueling?: Date;
  }>> {
    try {
      const cacheKey = `stats:${userId}:${vehicleId || 'all'}`;
      const cached = FuelingCache.get(cacheKey);
      if (cached) return { success: true, data: cached };

      const conditions = [eq(abastecimentos.id_usuario, userId)];
      if (vehicleId) {
        conditions.push(eq(abastecimentos.id_veiculo, vehicleId));
      }

      const [stats] = await db
        .select({
          totalFuelings: count(),
          totalSpent: sql<number>`COALESCE(SUM(${abastecimentos.valor_total}), 0)`,
          totalLiters: sql<number>`COALESCE(SUM(${abastecimentos.quantidade_litros}), 0)`,
          averagePrice: sql<number>`COALESCE(AVG(${abastecimentos.valor_litro}), 0)`,
          lastFueling: sql<Date>`MAX(${abastecimentos.data_abastecimento})`,
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
