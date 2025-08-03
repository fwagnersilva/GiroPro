import { db } from "../db";
import { jornadas } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateJourneyRequest, UpdateJourneyRequest } from "../types";
import crypto from 'crypto';

export class JourneyService {
  static async createJourney(userId: string, journeyData: CreateJourneyRequest) {
    const newJourneyData = {
      id: crypto.randomUUID(),
      id_usuario: userId,
      id_veiculo: journeyData.id_veiculo,
      data_inicio: journeyData.data_inicio,
      km_inicio: journeyData.km_inicio,
      data_fim: journeyData.data_fim || null,
      km_fim: journeyData.km_fim || null,
      ganho_bruto: journeyData.ganho_bruto || null,
      km_total: journeyData.km_total || null,
      tempo_total: journeyData.tempo_total || null,
      observacoes: journeyData.observacoes || null,
    };
    
    const [newJourney] = await db.insert(jornadas).values(newJourneyData).returning();
    return newJourney;
  }

  static async getJourneysByUserId(userId: string) {
    return await db.select().from(jornadas).where(eq(jornadas.id_usuario, userId));
  }

  static async getJourneyById(id: string, userId: string) {
    const [journey] = await db.select().from(jornadas).where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId)));
    return journey;
  }

  static async updateJourney(id: string, userId: string, journeyData: UpdateJourneyRequest) {
    const dataToUpdate: any = { ...journeyData };
    if (dataToUpdate.data_inicio) dataToUpdate.data_inicio = new Date(dataToUpdate.data_inicio);
    if (dataToUpdate.data_fim) dataToUpdate.data_fim = new Date(dataToUpdate.data_fim);
    const [updatedJourney] = await db.update(jornadas).set(dataToUpdate).where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId))).returning();
    return updatedJourney;
  }

  static async deleteJourney(id: string, userId: string) {
    const result = await db.delete(jornadas).where(and(eq(jornadas.id, id), eq(jornadas.id_usuario, userId))).returning();
    return result.length > 0;
  }
}


