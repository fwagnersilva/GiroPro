import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import { config } from './config';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { fuelingRoutes } from './routes/fuelings';
import { syncRoutes } from './routes/sync';
import { syncDownloadRoutes } from './routes/syncDownloadRoutes';
import { expenseRoutes } from './routes/expenses';
import { platformRoutes } from './routes/platforms';

import asyncHandler from '../../src/middlewares/asyncHandler';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import logger from './utils/logger';
import { authRateLimit, generalRateLimit } from './middlewares/rateLimiter';



const app = express();

const PORT = Number(config.port);

// Middlewares
app.use(helmet(config.security.helmet)); // Use Helmet para segurança
app.disable('x-powered-by'); // Desabilita o cabeçalho X-Powered-By
app.use(cors(config.cors));
app.use(express.json());
app.use(requestLogger);
app.use(compression());

// Rate limiting geral
app.use(generalRateLimit.middleware);

// Routes básicas
app.use('/api/v1/auth', authRateLimit.middleware, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/journeys', journeyRoutes);
app.use('/api/v1/fuelings', fuelingRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/platforms", platformRoutes);
app.use("/api/v1/sync", syncRoutes);
app.use("/api/v1/sync", syncDownloadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'GiroPro Backend está funcionando!'
  });
});

// Test endpoint
// app.get("/api/test", (req, res) => {
//   res.json({
//     message: "API funcionando corretamente",
//     endpoints: [
//       "/health",
//       "/api/v1/auth",
//       "/api/v1/users",
//       "/api/v1/vehicles",
//       "/api/v1/journeys",
//       "/api/v1/fuelings",
//       "/api/v1/expenses"
//     ]
//   });
// });

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

export default app;


