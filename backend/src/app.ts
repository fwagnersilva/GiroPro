import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import { config } from './config';

// ===== IMPORTAÇÕES DE ROTAS =====
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { fuelingRoutes } from './routes/fuelings';
import { syncRoutes } from './routes/sync';
import { syncDownloadRoutes } from './routes/syncDownloadRoutes';
import { expenseRoutes } from './routes/expenses';
import { platformRoutes } from './routes/platforms';

// Importar rotas que estavam faltando
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import dashboardRoutes from './routes/dashboard';
import insightsRoutes from './routes/insights';
import notificationsRoutes from './routes/notifications';
import { reportRoutes } from './routes/reports';
import multiVehicleRoutes from './routes/multi-vehicle';

// ===== IMPORTAÇÕES DE MIDDLEWARES =====
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import logger from './utils/logger';
import { authRateLimit, generalRateLimit } from './middlewares/rateLimiter';

// Removido: asyncHandler não é usado neste arquivo

const app = express();

const PORT = Number(config.port);

// ===== MIDDLEWARES GLOBAIS =====
app.use(helmet(config.security.helmet));
app.disable('x-powered-by');
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(compression());

// Rate limiting geral
app.use(generalRateLimit.middleware);

// ===== ROTAS DE AUTENTICAÇÃO (com rate limit específico) =====
app.use('/api/v1/auth', authRateLimit.middleware, authRoutes);

// ===== ROTAS DE USUÁRIO =====
app.use('/api/v1/users', userRoutes);

// ===== ROTAS DE VEÍCULOS =====
app.use('/api/v1/vehicles', vehicleRoutes);

// ===== ROTAS DE JORNADAS =====
app.use('/api/v1/journeys', journeyRoutes);

// ===== ROTAS DE ABASTECIMENTOS =====
app.use('/api/v1/fuelings', fuelingRoutes);

// ===== ROTAS DE DESPESAS =====
app.use('/api/v1/expenses', expenseRoutes);

// ===== ROTAS DE PLATAFORMAS =====
app.use('/api/v1/platforms', platformRoutes);

// ===== ROTAS DE SINCRONIZAÇÃO =====
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/sync-download', syncDownloadRoutes);

// ===== ROTAS DE ADMIN (ANTES FALTANDO) =====
app.use('/api/v1/admin', adminRoutes);

// ===== ROTAS DE ANALYTICS (ANTES FALTANDO) =====
app.use('/api/v1/analytics', analyticsRoutes);

// ===== ROTAS DE DASHBOARD (ANTES FALTANDO) =====
app.use('/api/v1/dashboard', dashboardRoutes);

// ===== ROTAS DE INSIGHTS (ANTES FALTANDO) =====
app.use('/api/v1/insights', insightsRoutes);

// ===== ROTAS DE NOTIFICAÇÕES (ANTES FALTANDO) =====
app.use('/api/v1/notifications', notificationsRoutes);

// ===== ROTAS DE RELATÓRIOS (ANTES FALTANDO) =====
app.use('/api/v1/reports', reportRoutes);

// ===== ROTAS DE MULTI-VEÍCULOS (ANTES FALTANDO) =====
app.use('/api/v1/multi-vehicle', multiVehicleRoutes);

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'GiroPro Backend está funcionando!',
    database: config.database.type,
    environment: config.environment,
  });
});

// ===== ROTA DE INFO (Endpoints disponíveis) =====
app.get('/api/v1/info', (req, res) => {
  res.json({
    message: 'GiroPro API v1',
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/v1/auth/register',
        'POST /api/v1/auth/login',
        'POST /api/v1/auth/refresh-token',
        'POST /api/v1/auth/change-password',
        'POST /api/v1/auth/request-password-reset',
        'POST /api/v1/auth/reset-password',
      ],
      users: [
        'GET /api/v1/users/profile',
        'PUT /api/v1/users/profile',
        'GET /api/v1/users/backup',
        'POST /api/v1/users/restore',
      ],
      vehicles: [
        'GET /api/v1/vehicles',
        'POST /api/v1/vehicles',
        'GET /api/v1/vehicles/:id',
        'PUT /api/v1/vehicles/:id',
        'DELETE /api/v1/vehicles/:id',
      ],
      journeys: [
        'GET /api/v1/journeys',
        'POST /api/v1/journeys',
        'GET /api/v1/journeys/:id',
        'PUT /api/v1/journeys/:id',
        'DELETE /api/v1/journeys/:id',
      ],
      fuelings: [
        'GET /api/v1/fuelings',
        'POST /api/v1/fuelings',
        'GET /api/v1/fuelings/:id',
        'PUT /api/v1/fuelings/:id',
        'DELETE /api/v1/fuelings/:id',
      ],
      expenses: [
        'GET /api/v1/expenses',
        'POST /api/v1/expenses',
        'GET /api/v1/expenses/:id',
        'PUT /api/v1/expenses/:id',
        'DELETE /api/v1/expenses/:id',
      ],
      admin: 'GET /api/v1/admin/* (requer admin)',
      analytics: 'GET /api/v1/analytics/* (requer autenticação)',
      dashboard: 'GET /api/v1/dashboard/* (requer autenticação)',
      insights: 'GET /api/v1/insights/* (requer autenticação)',
      notifications: 'GET|POST /api/v1/notifications/* (requer autenticação)',
      reports: 'GET /api/v1/reports/* (requer autenticação)',
      multiVehicle: 'GET|POST /api/v1/multi-vehicle/* (requer autenticação)',
    },
    database: config.database.type,
    environment: config.environment,
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use(errorHandler);

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  logger.warn(`Endpoint não encontrado: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Endpoint não encontrado',
    method: req.method,
    path: req.originalUrl,
    suggestion: 'Verifique /api/v1/info para lista de endpoints disponíveis',
  });
});

export default app;