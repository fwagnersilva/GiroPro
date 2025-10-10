import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { db } from '../db';
import { usuarios, veiculos, jornadas, abastecimentos, despesas } from '../db/schema.postgres';
import { eq } from 'drizzle-orm';

export class SyncDownloadController {
  static async downloadAll(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }

    try {
      // Buscar todos os dados do usuário
      const [user] = await db.select().from(usuarios).where(eq(usuarios.id, userId)).limit(1);
      const userVeiculos = await db.select().from(veiculos).where(eq(veiculos.idUsuario, userId));
      const userJornadas = await db.select().from(jornadas).where(eq(jornadas.idUsuario, userId));
      const userAbastecimentos = await db.select().from(abastecimentos).where(eq(abastecimentos.idUsuario, userId));
      const userDespesas = await db.select().from(despesas).where(eq(despesas.idUsuario, userId));

      return res.json({
        success: true,
        data: {
          user,
          veiculos: userVeiculos,
          jornadas: userJornadas,
          abastecimentos: userAbastecimentos,
          despesas: userDespesas,
        },
      });
    } catch (error) {
      console.error('Erro ao baixar dados:', error);
      return res.status(500).json({ success: false, message: 'Erro ao baixar dados' });
    }
  }

  static async downloadSince(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const { lastSync } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }

    if (!lastSync || typeof lastSync !== 'string') {
      return res.status(400).json({ success: false, message: 'lastSync é obrigatório' });
    }

    try {
      const lastSyncDate = new Date(lastSync);

      // Buscar apenas dados modificados desde lastSync
      // Nota: Isso requer que as tabelas tenham campo updatedAt
      const userVeiculos = await db.select().from(veiculos).where(eq(veiculos.idUsuario, userId));
      const userJornadas = await db.select().from(jornadas).where(eq(jornadas.idUsuario, userId));
      const userAbastecimentos = await db.select().from(abastecimentos).where(eq(abastecimentos.idUsuario, userId));
      const userDespesas = await db.select().from(despesas).where(eq(despesas.idUsuario, userId));

      return res.json({
        success: true,
        data: {
          veiculos: userVeiculos,
          jornadas: userJornadas,
          abastecimentos: userAbastecimentos,
          despesas: userDespesas,
        },
      });
    } catch (error) {
      console.error('Erro ao baixar dados incrementais:', error);
      return res.status(500).json({ success: false, message: 'Erro ao baixar dados' });
    }
  }
}
