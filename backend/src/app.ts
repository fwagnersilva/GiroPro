import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { authRoutes } from './routes/auth';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { authMiddleware } from './middlewares/auth';

const app = express();
app.set('trust proxy', 1);

// Middlewares básicos
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Logger
app.use(requestLogger);

// Health check (sem autenticação)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas públicas
app.use('/api/v1/auth', authRoutes);

// Rotas protegidas (COM autenticação)
app.use('/api/v1/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/v1/journeys', authMiddleware, journeyRoutes);

// Error handler
app.use(errorHandler);

export default app;
