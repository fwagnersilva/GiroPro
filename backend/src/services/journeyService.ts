import { db } from "../db";
import { jornadas } from "../db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { CreateJourneyRequest, UpdateJourneyRequest, JourneyFilters } from "../types";
import crypto from 'crypto';

export class JourneyService {
  static async createJourney(userId: string, journeyData: CreateJourneyRequest) {
    const newJourneyData = {
      id: crypto.randomUUID(),
      id_usuario: userId,
      id_veiculo: journeyData.id_veiculo,
      data_inicio: new Date(journeyData.data_inicio),
      km_inicio: journeyData.km_inicio,
      data_fim: null,
      km_fim: null,
      ganho_bruto: null,
      km_total: null,
      tempo_total: null,
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
    let query = db.select().from(jornadas).where(eq(jornadas.id_usuario, userId));
    
    if (filters) {
      const conditions = [eq(jornadas.id_usuario, userId)];
      
      // Filtro por status
      if (filters.status === 'em_andamento') {
        conditions.push(eq(jornadas.data_fim, null));
      } else if (filters.status === 'concluida') {
        conditions.push(ne(jornadas.data_fim, null));
      }
      
      // Filtro por data de início
      if (filters.data_inicio) {
        conditions.push(gte(jornadas.data_inicio, new Date(filters.data_inicio)));
      }
      
      // Filtro por data de fim
      if (filters.data_fim) {
        conditions.push(lte(jornadas.data_inicio, new Date(filters.data_fim)));
      }
      
      // Filtro por veículo
      if (filters.veiculo_id) {
        conditions.push(eq(jornadas.id_veiculo, filters.veiculo_id));
      }
      
      return await db.select().from(jornadas).where(and(...conditions));
    }
    
    return await db.select().from(jornadas).where(eq(jornadas.id_usuario, userId));
  }

  static async getJourneyById(id: string, userId: string) {
    try {
      const [journey] = await db.select()
        .from(jornadas)
        .where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId)));
      
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
      if (journeyData.data_fim !== undefined) {
        dataToUpdate.data_fim = journeyData.data_fim ? new Date(journeyData.data_fim) : null;
      }
      
      if (journeyData.km_fim !== undefined) {
        dataToUpdate.km_fim = journeyData.km_fim;
        // Calcular km_total se tivermos km_inicio e km_fim
        if (journeyData.km_fim && existingJourney.km_inicio) {
          dataToUpdate.km_total = journeyData.km_fim - existingJourney.km_inicio;
        }
      }
      
      if (journeyData.ganho_bruto !== undefined) {
        dataToUpdate.ganho_bruto = journeyData.ganho_bruto;
      }
      
      if (journeyData.observacoes !== undefined) {
        dataToUpdate.observacoes = journeyData.observacoes;
      }

      // Calcular tempo total se a jornada estiver sendo finalizada
      if (dataToUpdate.data_fim && existingJourney.data_inicio) {
        const inicio = new Date(existingJourney.data_inicio);
        const fim = new Date(dataToUpdate.data_fim);
        const diffMs = fim.getTime() - inicio.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        dataToUpdate.tempo_total = `${hours}:${minutes.toString().padStart(2, '0')}`;
      }

      const [updatedJourney] = await db.update(jornadas)
        .set(dataToUpdate)
        .where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId)))
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
        .where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId)))
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
        eq(jornadas.id_usuario, userId),
        eq(jornadas.data_fim, null)
      ));
  }

  // Método adicional para finalizar uma jornada
  static async finishJourney(id: string, userId: string, km_fim: number, ganho_bruto?: number, observacoes?: string) {
    return await this.updateJourney(id, userId, {
      data_fim: new Date().toISOString(),
      km_fim,
      ganho_bruto,
      observacoes
    });
  }
}
