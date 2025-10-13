import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import logger from './utils/logger';

const app = express();

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

// Rotas (importar apenas as que existem)
try {
  const { authRoutes } = require('./routes/auth');
  app.use('/api/v1/auth', authRoutes);
} catch (e) {
  logger.warn('Auth routes não disponíveis');
}

try {
  const { vehicleRoutes } = require('./routes/vehicles');
  app.use('/api/v1/vehicles', vehicleRoutes);
} catch (e) {
  logger.warn('Vehicle routes não disponíveis');
}

try {
  const { journeyRoutes } = require('./routes/journeys');
  app.use('/api/v1/journeys', journeyRoutes);
} catch (e) {
  logger.warn('Journey routes não disponíveis');
}

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;
