import { db } from "../db";
import { jornadas, jornadasFaturamentoPorPlataforma, plataformas } from "../db/schema";
import { eq, and, gte, lte, or, ne, sql, isNull } from "drizzle-orm";
import { CreateJourneyRequest, UpdateJourneyRequest, JourneyFilters } from "../types";
import crypto from 'crypto';

export interface PlatformEarning {
  platformId: string;
  value: number; // Em centavos
}

export interface UpdateJourneyRequestWithPlatforms extends UpdateJourneyRequest {
  faturamentoPorPlataforma?: PlatformEarning[];
}

export class JourneyService {
  static async createJourney(userId: string, journeyData: CreateJourneyRequest) {
    const newJourneyData = {
      id: crypto.randomUUID(),
      idUsuario: userId,
      idVeiculo: journeyData.idVeiculo,
      dataInicio: new Date(journeyData.dataInicio),
      kmInicio: journeyData.kmInicio,
      dataFim: null,
      kmFim: null,
      ganhoBruto: null,
      kmTotal: null,
      tempoTotal: null,
      observacoes: journeyData.observacoes || null,
    };
    
    try {
      const [newJourney] = await db.insert(jornadas).values(newJourneyData).returning();
      return newJourney;
    } catch (error) {
      console.error("Erro ao criar jornada:", error);
      throw new Error("Falha ao criar jornada");
    }
  }

  static async getJourneysByUserId(userId: string, options: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; filters?: JourneyFilters }) {
    const { page = 1, limit = 10, sortBy = 'dataInicio', sortOrder = 'desc', filters } = options;

    let whereConditions = and(
      eq(jornadas.idUsuario, userId)
    );

    // Filtro por status
    if (filters?.status === 'em_andamento') {
      whereConditions = and(whereConditions, isNull(jornadas.dataFim));
    } else if (filters?.status === 'concluida') {
      whereConditions = and(whereConditions, ne(jornadas.dataFim, null));
    }
    
    // Filtro por data de início
    if (filters?.dataInicio) {
      whereConditions = and(whereConditions, gte(jornadas.dataInicio, new Date(filters.dataInicio)));
    }
    
    // Filtro por data de fim
    if (filters?.dataFim) {
      whereConditions = and(whereConditions, lte(jornadas.dataInicio, new Date(filters.dataFim)));
    }
    
    // Filtro por veículo
    if (filters?.veiculoId) {
      whereConditions = and(whereConditions, eq(jornadas.idVeiculo, filters.veiculoId));
    }

    try {
      const [totalCountResult] = await db.select({ count: sql<number>`count(*)` }).from(jornadas).where(whereConditions);
      const total = totalCountResult.count;
      const totalPages = Math.ceil(total / limit);

      const journeys = await db.select()
        .from(jornadas)
        .where(whereConditions)
        .orderBy(sortOrder === 'asc' ? sql`${jornadas[sortBy]} ASC` : sql`${jornadas[sortBy]} DESC`)
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        success: true,
        data: journeys,
        meta: {
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      };
    } catch (error) {
      console.error("Erro ao buscar jornadas:", error);
      return {
        success: false,
        error: "Falha ao buscar jornadas",
      };
    }
  }

  static async getJourneyById(id: string, userId: string) {
    try {
      const [journey] = await db.select()
        .from(jornadas)
        .where(and(eq(jornadas.id, id), eq(jornadas.idUsuario, userId)));
      
      return journey || null;
    } catch (error) {
      console.error("Erro ao buscar jornada:", error);
      throw new Error("Falha ao buscar jornada");
    }
  }

  static async updateJourney(id: string, userId: string, journeyData: UpdateJourneyRequestWithPlatforms) {
    try {
      // Verificar se a jornada existe primeiro
      const existingJourney = await this.getJourneyById(id, userId);
      if (!existingJourney) {
        throw new Error("Jornada não encontrada");
      }

      const dataToUpdate: Partial<typeof jornadas.$inferInsert> = {};
      
      // Processar cada campo com validação
      if (journeyData.dataFim !== undefined) {
        dataToUpdate.dataFim = journeyData.dataFim ? new Date(journeyData.dataFim) : null;
      }
      
      if (journeyData.kmFim !== undefined) {
        dataToUpdate.kmFim = journeyData.kmFim;
        // Calcular kmTotal se tivermos km_inicio e km_fim
        if (journeyData.kmFim && existingJourney.kmInicio) {
          dataToUpdate.kmTotal = journeyData.kmFim - existingJourney.kmInicio;
        }
      }
      
      // Processar faturamento por plataforma
      if (journeyData.faturamentoPorPlataforma && journeyData.faturamentoPorPlataforma.length > 0) {
        let totalGanhoBruto = 0;
        const faturamentoInserts = journeyData.faturamentoPorPlataforma.map(item => {
          totalGanhoBruto += item.value;
          return {
            id: crypto.randomUUID(),
            idJornada: id,
            idPlataforma: item.platformId,
            valor: item.value,
            createdAt: new Date(),
          };
        });

        // Inserir os faturamentos por plataforma
        await db.insert(jornadasFaturamentoPorPlataforma).values(faturamentoInserts);
        dataToUpdate.ganhoBruto = totalGanhoBruto;
      } else if (journeyData.ganhoBruto !== undefined) {
        // Manter compatibilidade se faturamentoPorPlataforma não for fornecido
        dataToUpdate.ganhoBruto = journeyData.ganhoBruto;
      }
      
      if (journeyData.observacoes !== undefined) {
        dataToUpdate.observacoes = journeyData.observacoes;
      }

      // Calcular tempo total se a jornada estiver sendo finalizada
      if (dataToUpdate.dataFim && existingJourney.dataInicio) {
        const inicio = new Date(existingJourney.dataInicio);
        const fim = new Date(dataToUpdate.dataFim);
        const diffMs = fim.getTime() - inicio.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        dataToUpdate.tempoTotal = Math.floor(diffMs / (1000 * 60));
      }

      const [updatedJourney] = await db.update(jornadas)
        .set(dataToUpdate)
        .where(and(eq(jornadas.id, id), eq(jornadas.idUsuario, userId)))
        .returning();
      
      return updatedJourney;
    } catch (error) {
      console.error("Erro ao atualizar jornada:", error);
      throw error;
    }
  }

  static async deleteJourney(id: string, userId: string) {
    try {
      const result = await db.delete(jornadas)
        .where(and(eq(jornadas.id, id), eq(jornadas.idUsuario, userId)))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Erro ao deletar jornada:", error);
      throw new Error("Falha ao deletar jornada");
    }
  }

  // Método adicional para obter jornadas em andamento
  static async getActiveJourneys(userId: string) {
    return await db.select()
      .from(jornadas)
      .where(and(
        eq(jornadas.idUsuario, userId),
        isNull(jornadas.dataFim)
      ));
  }

  // Método adicional para finalizar uma jornada
  static async finishJourney(id: string, userId: string, kmFim: number, faturamentoPorPlataforma?: PlatformEarning[], observacoes?: string) {
    return await this.updateJourney(id, userId, {
      dataFim: new Date().toISOString(),
      kmFim,
      faturamentoPorPlataforma,
      observacoes
    });
  }

  static async getJourneyStatistics(userId: string, periodo?: 'semana' | 'mes' | 'trimestre' | 'ano') {
    let startDate: Date;
    const endDate = new Date();

    switch (periodo) {
      case 'semana':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
        break;
      case 'mes':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
        break;
      case 'trimestre':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
        break;
      case 'ano':
        startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
        break;
      default:
        startDate = new Date(0); // Desde o início dos tempos
        break;
    }

    try {
      const result = await db.select({
        totalJourneys: sql<number>`count(${jornadas.id})`,
        totalKm: sql<number>`sum(${jornadas.kmTotal})`,
        totalGanhoBruto: sql<number>`sum(${jornadas.ganhoBruto})`,
      })
      .from(jornadas)
      .where(and(
        eq(jornadas.idUsuario, userId),
        gte(jornadas.dataInicio, startDate),
        lte(jornadas.dataInicio, endDate),
        ne(jornadas.dataFim, null) // Apenas jornadas concluídas
      ));

      return result[0];
    } catch (error) {
      console.error("Erro ao buscar estatísticas de jornada:", error);
      throw new Error("Falha ao buscar estatísticas de jornada");
    }
  }
}

