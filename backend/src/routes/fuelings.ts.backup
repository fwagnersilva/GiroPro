import { Router } from 'express';
import { createFueling, getFuelings, getFuelingById, updateFueling, deleteFueling } from '../controllers/fuelingsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, createFueling);
router.get('/', authMiddleware, getFuelings);
router.get('/:id', authMiddleware, getFuelingById);
router.put('/:id', authMiddleware, updateFueling);
router.delete('/:id', authMiddleware, deleteFueling);

export const fuelingRoutes = router;
