import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth'; // Importação nomeada

const router = Router();

// POST /api/v1/auth/register
router.post('/register', AuthController.register);

// POST /api/v1/auth/login
router.post('/login', AuthController.login);

// GET /api/v1/auth/me
router.get('/me', authMiddleware, AuthController.me);

export { router as authRoutes };
