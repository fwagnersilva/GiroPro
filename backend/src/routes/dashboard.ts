import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { dashboardCache } from '../middlewares/cache';

const router = Router();

// Todas as rotas do dashboard requerem autenticação
router.use(authMiddleware);

// Rotas do dashboard serão implementadas via dashboardRoutes
// TODO: Integrar dashboardRoutes com Express Router

export default router;

