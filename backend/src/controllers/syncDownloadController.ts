import { Request, Response } from 'express';
import { db } from '../db/drizzle';
import { users, vehicles, journeys, fuelSupplies, expenses } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const downloadInitialData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assumindo que o userId está disponível no req.user após autenticação

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const initialData = {
      users: await db.select().from(users).where(eq(users.id, userId)),
      vehicles: await db.select().from(vehicles).where(eq(vehicles.userId, userId)),
      journeys: await db.select().from(journeys).where(eq(journeys.userId, userId)),
      fuelSupplies: await db.select().from(fuelSupplies).where(eq(fuelSupplies.userId, userId)),
      expenses: await db.select().from(expenses).where(eq(expenses.userId, userId)),
    };

    res.status(200).json(initialData);
  } catch (error) {
    console.error('Erro ao baixar dados iniciais:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao baixar dados iniciais.' });
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
      vehicles: await db.select().from(vehicles).where(and(eq(vehicles.userId, userId), gt(vehicles.updatedAt, lastSyncDate))),
      journeys: await db.select().from(journeys).where(and(eq(journeys.userId, userId), gt(journeys.updatedAt, lastSyncDate))),
      fuelSupplies: await db.select().from(fuelSupplies).where(and(eq(fuelSupplies.userId, userId), gt(fuelSupplies.updatedAt, lastSyncDate))),
      expenses: await db.select().from(expenses).where(and(eq(expenses.userId, userId), gt(expenses.updatedAt, lastSyncDate))),
    };

    res.status(200).json(incrementalData);
  } catch (error) {
    console.error('Erro ao baixar dados incrementais:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao baixar dados incrementais.' });
  }
};

