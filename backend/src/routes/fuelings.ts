import { Router } from 'express';
import { getPrices, getPriceHistory, getRegionalComparison, reportPrice, getPriceStats, getNearbyPrices } from '../controllers/fuelingsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Rotas para preços de combustível
router.get('/prices', authMiddleware, getPrices);
router.get('/prices/history', authMiddleware, getPriceHistory);
router.get('/prices/comparison', authMiddleware, getRegionalComparison);
router.post('/prices/report', authMiddleware, reportPrice);
router.get('/prices/stats', authMiddleware, getPriceStats);
router.get('/prices/nearby', authMiddleware, getNearbyPrices);

export const fuelingRoutes = router;
