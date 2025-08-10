import { db } from "../db";
import { jornadas } from "../db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { CreateJourneyRequest, UpdateJourneyRequest, JourneyFilters } from "../types";
import crypto from 'crypto';

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
      console.error('Erro ao criar jornada:', error);
      throw new Error('Falha ao criar jornada');
    }
  }

  static async getJourneysByUserId(userId: string, filters?: JourneyFilters) {
    let query = db.select().from(jornadas).where(eq(jornadas.idUsuario, userId));
    
    if (filters) {
      const conditions = [eq(jornadas.idUsuario, userId)];
      
      // Filtro por status
      if (filters.status === 'em_andamento') {
        conditions.push(eq(jornadas.dataFim, null));
      } else if (filters.status === 'concluida') {
        conditions.push(ne(jornadas.dataFim, null));
      }
      
      // Filtro por data de início
      if (filters.dataInicio) {
        conditions.push(gte(jornadas.dataInicio, new Date(filters.dataInicio)));
      }
      
      // Filtro por data de fim
      if (filters.dataFim) {
        conditions.push(lte(jornadas.dataInicio, new Date(filters.dataFim)));
      }
      
      // Filtro por veículo
      if (filters.veiculo_id) {
        conditions.push(eq(jornadas.idVeiculo, filters.veiculo_id));
      }
      
      return await db.select().from(jornadas).where(and(...conditions));
    }
    
    return await db.select().from(jornadas).where(eq(jornadas.idUsuario, userId));
  }

  static async getJourneyById(id: string, userId: string) {
    try {
      const [journey] = await db.select()
        .from(jornadas)
        .where(and(eq(jornadas.id, id), eq(jornadas.idUsuario, userId)));
      
      return journey || null;
    } catch (error) {
      console.error('Erro ao buscar jornada:', error);
      throw new Error('Falha ao buscar jornada');
    }
  }

  static async updateJourney(id: string, userId: string, journeyData: UpdateJourneyRequest) {
    try {
      // Verificar se a jornada existe primeiro
      const existingJourney = await this.getJourneyById(id, userId);
      if (!existingJourney) {
        throw new Error('Jornada não encontrada');
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
      
      if (journeyData.ganhoBruto !== undefined) {
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
        dataToUpdate.tempoTotal = `${hours}:${minutes.toString().padStart(2, '0')}`;
      }

      const [updatedJourney] = await db.update(jornadas)
        .set(dataToUpdate)
        .where(and(eq(jornadas.id, id), eq(jornadas.idUsuario, userId)))
        .returning();
      
      return updatedJourney;
    } catch (error) {
      console.error('Erro ao atualizar jornada:', error);
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
      console.error('Erro ao deletar jornada:', error);
      throw new Error('Falha ao deletar jornada');
    }
  }

  // Método adicional para obter jornadas em andamento
  static async getActiveJourneys(userId: string) {
    return await db.select()
      .from(jornadas)
      .where(and(
        eq(jornadas.idUsuario, userId),
        eq(jornadas.dataFim, null)
      ));
  }

  // Método adicional para finalizar uma jornada
  static async finishJourney(id: string, userId: string, kmFim: number, ganhoBruto?: number, observacoes?: string) {
    return await this.updateJourney(id, userId, {
      dataFim: new Date().toISOString(),
      kmFim,
      ganhoBruto,
      observacoes
    });
  }
}
