import express from 'express';
import { corsMiddleware } from './middlewares/cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { authRoutes } from './routes/auth';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { fuelingRoutes } from './routes/fuelings';
import { expenseRoutes } from './routes/expenses';
import { reportRoutes } from './routes/reports';
import { platformRoutes } from './routes/platforms';
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/journeys', journeyRoutes);
app.use('/api/v1/fuelings', fuelingRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/platforms', platformRoutes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;
