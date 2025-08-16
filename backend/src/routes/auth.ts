import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { AuthenticatedRequest } from '../types/common';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', AuthController.register);

// POST /api/v1/auth/login
router.post('/login', AuthController.login);

// POST /api/v1/auth/request-password-reset
router.post('/request-password-reset', AuthController.requestPasswordReset);

// POST /api/v1/auth/reset-password
router.post('/reset-password', AuthController.resetPassword);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', AuthController.refreshToken);

// POST /api/v1/auth/change-password
router.post('/change-password', authMiddleware, (req, res) => AuthController.changePassword(req as unknown as AuthenticatedRequest, res));

// GET /api/v1/auth/me
router.get('/me', authMiddleware, (req, res) => AuthController.me(req as unknown as AuthenticatedRequest, res));

export { router as authRoutes };


