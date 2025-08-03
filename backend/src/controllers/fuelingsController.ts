import { Request, Response } from 'express';
import { FuelingService } from '../services/fuelingService';
import { CreateFuelingRequest, UpdateFuelingRequest } from '../types';
import { authMiddleware } from '../middlewares/auth'; // Importação nomeada

export const createFueling = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const fuelingData: CreateFuelingRequest = req.body;
    const newFueling = await FuelingService.createFueling(userId, fuelingData);
    return res.status(201).json(newFueling);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getFuelings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const fuelings = await FuelingService.getFuelingsByUserId(userId);
    return res.status(200).json(fuelings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFuelingById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const fueling = await FuelingService.getFuelingById(id, userId);
    if (!fueling) {
      return res.status(404).json({ message: 'Abastecimento não encontrado.' });
    }
    return res.status(200).json(fueling);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateFueling = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const fuelingData: UpdateFuelingRequest = req.body;
    const updatedFueling = await FuelingService.updateFueling(id, userId, fuelingData);
    if (!updatedFueling) {
      return res.status(404).json({ message: 'Abastecimento não encontrado ou você não tem permissão para atualizá-lo.' });
    }
    return res.status(200).json(updatedFueling);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteFueling = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const deleted = await FuelingService.deleteFueling(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Abastecimento não encontrado ou você não tem permissão para excluí-lo.' });
    }
    return res.status(204).send(); // No Content
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
