import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { dashboardCache } from '../middlewares/cache';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

// Todas as rotas do dashboard requerem autenticação
router.use(authMiddleware);

// GET /api/v1/dashboard/summary - Obter resumo de lucratividade
router.get('/summary', dashboardCache(1800), DashboardController.getSummary);

// GET /api/v1/dashboard/evolution - Obter dados de evolução temporal
router.get('/evolution', dashboardCache(3600), DashboardController.getEvolutionData);

// GET /api/v1/dashboard/vehicles - Obter comparativo entre veículos
router.get('/vehicles', dashboardCache(3600), DashboardController.getVehicleComparison);

export default router;

