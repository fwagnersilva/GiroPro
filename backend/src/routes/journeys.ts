import { Router } from 'express';
import { createJourney, getJourneys, getJourneyById, updateJourney, deleteJourney } from '../controllers/journeysController';
import { authMiddleware } from '../middlewares/auth'; // Importação nomeada

const router = Router();

router.post('/', authMiddleware, createJourney);
router.get('/', authMiddleware, getJourneys);
router.get('/:id', authMiddleware, getJourneyById);
router.put('/:id', authMiddleware, updateJourney);
router.delete('/:id', authMiddleware, deleteJourney);

export const journeyRoutes = router;
