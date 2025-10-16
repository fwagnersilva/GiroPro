import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import logger from './utils/logger';
import { authRoutes } from './routes/auth';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';

const app = express();
app.set('trust proxy', 1);

// Middlewares globais
app.use(corsMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/journeys', journeyRoutes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;
