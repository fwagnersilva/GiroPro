import { db } from "../db";
import { plataformas, usuarios, jornadasFaturamentoPorPlataforma } from "../db/schema";
import { eq, and, isNull } from "drizzle-orm";
import crypto from 'crypto';

export interface CreatePlatformRequest {
  nome: string;
  isPadrao?: boolean;
  ativa?: boolean;
}

export interface UpdatePlatformRequest {
  nome?: string;
  ativa?: boolean;
}

export interface Platform {
  id: string;
  idUsuario: string;
  nome: string;
  isPadrao: boolean;
  ativa: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PlatformService {
  /**
   * Inicializa as plataformas padrão (Uber e 99) para um novo usuário
   */
  static async initializeDefaultPlatforms(userId: string): Promise<void> {
    try {
      const defaultPlatforms = ['Uber', '99'];
      
      for (const platformName of defaultPlatforms) {
        // Verificar se já existe
        const existing = await db.select().from(plataformas).where(
          and(
            eq(plataformas.idUsuario, userId),
            eq(plataformas.nome, platformName),
            isNull(plataformas.deletedAt)
          )
        );

        if (existing.length === 0) {
          await db.insert(plataformas).values({
            id: crypto.randomUUID(),
            idUsuario: userId,
            nome: platformName,
            isPadrao: true,
            ativa: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao inicializar plataformas padrão:", error);
      throw error;
    }
  }

  static async createPlatform(userId: string, platformData: CreatePlatformRequest): Promise<Platform> {
    try {
      // Verificar se o nome da plataforma já existe para este usuário
      const existingPlatform = await db.select().from(plataformas).where(
        and(
          eq(plataformas.idUsuario, userId),
          eq(plataformas.nome, platformData.nome),
          isNull(plataformas.deletedAt)
        )
      );

      if (existingPlatform.length > 0) {
        throw new Error("Já existe uma plataforma com este nome para este usuário.");
      }

      const newPlatform = {
        id: crypto.randomUUID(),
        idUsuario: userId,
        nome: platformData.nome,
        isPadrao: platformData.isPadrao || false,
        ativa: platformData.ativa !== undefined ? platformData.ativa : true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const [result] = await db.insert(plataformas).values(newPlatform).returning();
      return this.mapToPlatform(result);
    } catch (error) {
      console.error("Erro ao criar plataforma:", error);
      throw error;
    }
  }

  static async getPlatformsByUserId(userId: string): Promise<Platform[]> {
    try {
      const result = await db.select().from(plataformas).where(
        and(
          eq(plataformas.idUsuario, userId),
          isNull(plataformas.deletedAt)
        )
      );
      return result.map(this.mapToPlatform);
    } catch (error) {
      console.error("Erro ao buscar plataformas:", error);
      throw error;
    }
  }

  static async getPlatformById(userId: string, platformId: string): Promise<Platform | null> {
    try {
      const [result] = await db.select().from(plataformas).where(
        and(
          eq(plataformas.id, platformId),
          eq(plataformas.idUsuario, userId),
          isNull(plataformas.deletedAt)
        )
      );
      return result ? this.mapToPlatform(result) : null;
    } catch (error) {
      console.error("Erro ao buscar plataforma por ID:", error);
      throw error;
    }
  }

  static async updatePlatform(userId: string, platformId: string, updateData: UpdatePlatformRequest): Promise<Platform | null> {
    try {
      const existingPlatform = await this.getPlatformById(userId, platformId);
      if (!existingPlatform) {
        throw new Error("Plataforma não encontrada ou não pertence ao usuário.");
      }

      // Não permitir alterar nome de plataforma padrão
      if (existingPlatform.isPadrao && updateData.nome && updateData.nome !== existingPlatform.nome) {
        throw new Error("Não é permitido alterar o nome de plataformas padrão.");
      }

      const dataToUpdate: Partial<typeof plataformas.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (updateData.nome !== undefined) dataToUpdate.nome = updateData.nome;
      if (updateData.ativa !== undefined) dataToUpdate.ativa = updateData.ativa;

      const [result] = await db.update(plataformas).set(dataToUpdate).where(
        and(
          eq(plataformas.id, platformId),
          eq(plataformas.idUsuario, userId),
          isNull(plataformas.deletedAt)
        )
      ).returning();

      return result ? this.mapToPlatform(result) : null;
    } catch (error) {
      console.error("Erro ao atualizar plataforma:", error);
      throw error;
    }
  }

  static async deletePlatform(userId: string, platformId: string): Promise<boolean> {
    try {
      const existingPlatform = await this.getPlatformById(userId, platformId);
      if (!existingPlatform) {
        throw new Error("Plataforma não encontrada ou não pertence ao usuário.");
      }

      // Não permitir deletar plataformas padrão
      if (existingPlatform.isPadrao) {
        throw new Error("Não é permitido deletar plataformas padrão. Apenas desativá-las.");
      }

      // Verificar se existem referências em jornadas
      const references = await db.select().from(jornadasFaturamentoPorPlataforma).where(
        eq(jornadasFaturamentoPorPlataforma.idPlataforma, platformId)
      );

      if (references.length > 0) {
        throw new Error("Não é possível excluir esta plataforma pois existem jornadas associadas a ela. Você pode desativá-la.");
      }

      const [result] = await db.update(plataformas).set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      }).where(
        and(
          eq(plataformas.id, platformId),
          eq(plataformas.idUsuario, userId),
          isNull(plataformas.deletedAt)
        )
      ).returning();

      return result !== undefined;
    } catch (error) {
      console.error("Erro ao deletar plataforma:", error);
      throw error;
    }
  }

  /**
   * Retorna apenas as plataformas ativas do usuário
   */
  static async getActivePlatforms(userId: string): Promise<Platform[]> {
    try {
      const result = await db.select().from(plataformas).where(
        and(
          eq(plataformas.idUsuario, userId),
          eq(plataformas.ativa, true),
          isNull(plataformas.deletedAt)
        )
      );
      return result.map(this.mapToPlatform);
    } catch (error) {
      console.error("Erro ao buscar plataformas ativas:", error);
      throw error;
    }
  }

  private static mapToPlatform(dbPlatform: typeof plataformas.$inferSelect): Platform {
    return {
      id: dbPlatform.id,
      idUsuario: dbPlatform.idUsuario,
      nome: dbPlatform.nome,
      isPadrao: Boolean(dbPlatform.isPadrao), // Converter para boolean
      ativa: Boolean(dbPlatform.ativa), // Converter para boolean
      createdAt: new Date(dbPlatform.createdAt),
      updatedAt: new Date(dbPlatform.updatedAt),
      deletedAt: dbPlatform.deletedAt ? new Date(dbPlatform.deletedAt) : null,
    };
  }
}

