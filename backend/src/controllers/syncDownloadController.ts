import { Request, Response } from 'express';
import { db, usuarios, veiculos, jornadas, abastecimentos, despesas } from '../db';
import { eq, and, gt } from 'drizzle-orm';

export const downloadInitialData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assumindo que o userId está disponível no req.user após autenticação

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const initialData = {
      users: await db.select().from(usuarios).where(eq(usuarios.id, userId)),
      vehicles: await db.select().from(veiculos).where(eq(veiculos.idUsuario, userId)),
      journeys: await db.select().from(jornadas).where(eq(jornadas.idUsuario, userId)),
      fuelSupplies: await db.select().from(abastecimentos).where(eq(abastecimentos.idUsuario, userId)),
      expenses: await db.select().from(despesas).where(eq(despesas.idUsuario, userId)),
    };

    return res.status(200).json(initialData);
  } catch (error) {
    console.error('Erro ao baixar dados iniciais:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao baixar dados iniciais.' });
  }
};

export const downloadIncrementalData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assumindo que o userId está disponível no req.user após autenticação
    const { lastSyncTimestamp } = req.query; // Timestamp da última sincronização enviado pelo cliente

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if (!lastSyncTimestamp || isNaN(Number(lastSyncTimestamp))) {
      return res.status(400).json({ message: 'lastSyncTimestamp inválido ou ausente.' });
    }

    const lastSyncDate = new Date(Number(lastSyncTimestamp));

    // Busca dados que foram criados ou atualizados após o lastSyncTimestamp
    const incrementalData = {
      vehicles: await db.select().from(veiculos).where(and(eq(veiculos.idUsuario, userId), gt(veiculos.updatedAt, lastSyncDate))),
      journeys: await db.select().from(jornadas).where(and(eq(jornadas.idUsuario, userId), gt(jornadas.updatedAt, lastSyncDate))),
      fuelSupplies: await db.select().from(abastecimentos).where(and(eq(abastecimentos.idUsuario, userId), gt(abastecimentos.updatedAt, lastSyncDate))),
      expenses: await db.select().from(despesas).where(and(eq(despesas.idUsuario, userId), gt(despesas.updatedAt, lastSyncDate))),
    };

    return res.status(200).json(incrementalData);
  } catch (error) {
    console.error('Erro ao baixar dados incrementais:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao baixar dados incrementais.' });
  }
};

