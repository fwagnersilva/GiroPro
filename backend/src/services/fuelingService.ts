import { db } from "../db";
import { abastecimentos } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateFuelingRequest, UpdateFuelingRequest } from "../types";
import crypto from 'crypto';

export class FuelingService {
  static async createFueling(userId: string, fuelingData: CreateFuelingRequest) {
    const newFuelingData = {
      id: crypto.randomUUID(),
      id_usuario: userId,
      id_veiculo: fuelingData.vehicleId,
      data_abastecimento: fuelingData.data,
      km_atual: fuelingData.quilometragem,
      litros: fuelingData.litros,
      valor_total: Math.round(fuelingData.litros * fuelingData.precoPorLitro * 100), // em centavos
      preco_litro: Math.round(fuelingData.precoPorLitro * 100), // em centavos
      posto: fuelingData.posto || null,
      tipo_combustivel: fuelingData.tipoCombustivel,
    };
    
    const [newFueling] = await db.insert(abastecimentos).values(newFuelingData).returning();
    return newFueling;
  }

  static async getFuelingsByUserId(userId: string) {
    return await db.select().from(abastecimentos).where(eq(abastecimentos.id_usuario, userId));
  }

  static async getFuelingById(id: string, userId: string) {
    const [fueling] = await db.select().from(abastecimentos).where(and(eq(abastecimentos.id, id), eq(abastecimentos.id_usuario, userId)));
    return fueling;
  }

  static async updateFueling(id: string, userId: string, fuelingData: UpdateFuelingRequest) {
    const dataToUpdate: any = { ...fuelingData };
    if (dataToUpdate.data) dataToUpdate.data_abastecimento = new Date(dataToUpdate.data);
    if (dataToUpdate.litros) dataToUpdate.quantidade_litros = dataToUpdate.litros;
    if (dataToUpdate.precoPorLitro) dataToUpdate.valor_litro = dataToUpdate.precoPorLitro;
    if (dataToUpdate.quilometragem) dataToUpdate.km_atual = dataToUpdate.quilometragem;
    if (dataToUpdate.posto) dataToUpdate.nome_posto = dataToUpdate.posto;
    if (dataToUpdate.tipoCombustivel) dataToUpdate.tipo_combustivel = dataToUpdate.tipoCombustivel;
    if (dataToUpdate.vehicleId) dataToUpdate.id_veiculo = dataToUpdate.vehicleId;
    
    // Remove old field names
    delete dataToUpdate.data;
    delete dataToUpdate.litros;
    delete dataToUpdate.precoPorLitro;
    delete dataToUpdate.quilometragem;
    delete dataToUpdate.posto;
    delete dataToUpdate.tipoCombustivel;
    delete dataToUpdate.vehicleId;
    
    const [updatedFueling] = await db.update(abastecimentos).set(dataToUpdate).where(and(eq(abastecimentos.id, id), eq(abastecimentos.id_usuario, userId))).returning();
    return updatedFueling;
  }

  static async deleteFueling(id: string, userId: string) {
    const result = await db.delete(abastecimentos).where(and(eq(abastecimentos.id, id), eq(abastecimentos.id_usuario, userId))).returning();
    return result.length > 0;
  }
}

