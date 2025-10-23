import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth';

import { validate } from '../middlewares/validateRequest';
import { 
  registerSchema, 
  loginSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema, 
  changePasswordSchema 
} from '../utils/validation';

const router = Router();

// POST /api/v1/auth/register
router.options('/register', (req, res) => {
  res.sendStatus(204); // Responde 204 No Content para preflight OPTIONS
});
router.post('/register', validate(registerSchema), AuthController.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// POST /api/v1/auth/request-password-reset
router.post('/request-password-reset', validate(requestPasswordResetSchema), AuthController.requestPasswordReset);

// POST /api/v1/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', AuthController.refreshToken);

// POST /api/v1/auth/change-password
router.post("/change-password", authMiddleware, validate(changePasswordSchema), AuthController.changePassword);

// GET /api/v1/auth/me
router.get("/me", authMiddleware, roleMiddleware(["admin"]), AuthController.me);

export { router as authRoutes };


