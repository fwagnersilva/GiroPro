import { Request, Response } from 'express';
import { JourneyService } from '../services/journeyService';
import { CreateJourneyRequest, UpdateJourneyRequest } from '../types';

export const createJourney = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const journeyData: CreateJourneyRequest = req.body;
    const newJourney = await JourneyService.createJourney(userId, journeyData);
    return res.status(201).json(newJourney);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getJourneys = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const journeys = await JourneyService.getJourneysByUserId(userId);
    return res.status(200).json(journeys);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getJourneyById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const journey = await JourneyService.getJourneyById(id, userId);
    if (!journey) {
      return res.status(404).json({ message: 'Jornada não encontrada.' });
    }
    return res.status(200).json(journey);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateJourney = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const journeyData: UpdateJourneyRequest = req.body;
    const updatedJourney = await JourneyService.updateJourney(id, userId, journeyData);
    if (!updatedJourney) {
      return res.status(404).json({ message: 'Jornada não encontrada ou você não tem permissão para atualizá-la.' });
    }
    return res.status(200).json(updatedJourney);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteJourney = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const deleted = await JourneyService.deleteJourney(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Jornada não encontrada ou você não tem permissão para excluí-la.' });
    }
    return res.status(204).send(); // No Content
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
