"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var auth_1 = require("../middleware/auth");
var validateRequest_1 = require("../middlewares/validateRequest");
var validation_1 = require("../utils/validation");
var router = (0, express_1.Router)();
exports.authRoutes = router;
// POST /api/v1/auth/register
router.post('/register', (0, validateRequest_1.validate)(validation_1.registerSchema), authController_1.AuthController.register);
// POST /api/v1/auth/login
router.post('/login', (0, validateRequest_1.validate)(validation_1.loginSchema), authController_1.AuthController.login);
// POST /api/v1/auth/request-password-reset
router.post('/request-password-reset', (0, validateRequest_1.validate)(validation_1.requestPasswordResetSchema), authController_1.AuthController.requestPasswordReset);
// POST /api/v1/auth/reset-password
router.post('/reset-password', (0, validateRequest_1.validate)(validation_1.resetPasswordSchema), authController_1.AuthController.resetPassword);
// POST /api/v1/auth/refresh-token
router.post('/refresh-token', authController_1.AuthController.refreshToken);
// POST /api/v1/auth/change-password
router.post("/change-password", auth_1.authMiddleware, (0, validateRequest_1.validate)(validation_1.changePasswordSchema), authController_1.AuthController.changePassword);
// GET /api/v1/auth/me
router.get("/me", auth_1.authMiddleware, (0, auth_1.roleMiddleware)(["admin"]), authController_1.AuthController.me);
