import { veiculos } from '../db/schema';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle } from '../types';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../db/connection';

export class VehicleService {
  /**
   * Cria um novo veículo
   */
  static async createVehicle(userId: string, vehicleData: CreateVehicleRequest): Promise<Vehicle> {
    try {
      const newVehicle = {
        id: crypto.randomUUID(),
        idUsuario: userId,
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        ano: vehicleData.ano,
        placa: vehicleData.placa,
        tipoCombustivel: vehicleData.tipoCombustivel as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex' || 'Gasolina',
        tipo_uso: vehicleData.tipo_uso as 'Proprio' | 'Alugado' | 'Financiado' || 'Proprio',
        data_cadastro: new Date().toISOString(),
      };

      const result = await db.insert(veiculos).values(newVehicle).returning();
      
      if (result.length === 0) {
        throw new Error('Falha ao criar veículo');
      }

      return this.mapToVehicle(result[0]);
    } catch (error) {
      throw new Error(`Erro ao criar veículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Busca todos os veículos de um usuário
   */
  static async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    try {
      const result = await db
        .select()
        .from(veiculos)
        .where(and(eq(veiculos.idUsuario, userId), isNull(veiculos.deletedAt)));

      return result.map(this.mapToVehicle);
    } catch (error) {
      throw new Error(`Erro ao buscar veículos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Busca um veículo específico por ID
   */
  static async getVehicleById(userId: string, vehicleId: string): Promise<Vehicle | null> {
    try {
      const result = await db
        .select()
        .from(veiculos)
        .where(and(
          eq(veiculos.id, vehicleId),
          eq(veiculos.idUsuario, userId),
          isNull(veiculos.deletedAt)
        ));

      if (result.length === 0) {
        return null;
      }

      return this.mapToVehicle(result[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar veículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualiza um veículo
   */
  static async updateVehicle(userId: string, vehicleId: string, updateData: UpdateVehicleRequest): Promise<Vehicle | null> {
    try {
      const updateFields: any = {};

      if (updateData.marca !== undefined) {
        updateFields.marca = updateData.marca;
      }
      if (updateData.modelo !== undefined) {
        updateFields.modelo = updateData.modelo;
      }
      if (updateData.ano !== undefined) {
        updateFields.ano = updateData.ano;
      }
      if (updateData.placa !== undefined) {
        updateFields.placa = updateData.placa;
      }

      const result = await db
        .update(veiculos)
        .set(updateFields)
        .where(and(
          eq(veiculos.id, vehicleId),
          eq(veiculos.idUsuario, userId),
          isNull(veiculos.deletedAt)
        ))
        .returning();

      if (result.length === 0) {
        return null;
      }

      return this.mapToVehicle(result[0]);
    } catch (error) {
      throw new Error(`Erro ao atualizar veículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Remove um veículo (soft delete)
   */
  static async deleteVehicle(userId: string, vehicleId: string): Promise<boolean> {
    try {
      const result = await db
        .update(veiculos)
        .set({ deletedAt: new Date().toISOString() })
        .where(and(
          eq(veiculos.id, vehicleId),
          eq(veiculos.idUsuario, userId),
          isNull(veiculos.deletedAt)
        ))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar veículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Mapeia dados do banco para o tipo Vehicle
   */
  private static mapToVehicle(dbVehicle: any): Vehicle {
    return {
      id: dbVehicle.id,
      idUsuario: dbVehicle.idUsuario,
      marca: dbVehicle.marca,
      modelo: dbVehicle.modelo,
      ano: dbVehicle.ano,
      placa: dbVehicle.placa,
      tipoCombustivel: dbVehicle.tipoCombustivel,
      tipo_uso: dbVehicle.tipo_uso,
      valor_aluguel: dbVehicle.valor_aluguel,
      valor_prestacao: dbVehicle.valor_prestacao,
      media_consumo: dbVehicle.media_consumo,
      data_cadastro: dbVehicle.data_cadastro,
      deletedAt: dbVehicle.deletedAt,
    };
  }
}

