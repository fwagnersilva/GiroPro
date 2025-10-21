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
import { logger } from './config/logger';

const app = express();
app.set('trust proxy', 1);

// Middlewares básicos
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Configuração específica por ambiente
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : [
      'http://localhost:19006',
      'http://localhost:3000',
      'http://localhost:8081'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger
app.use(requestLogger);

// Health check (sem autenticação) - COM LOGS DETALHADOS
app.get('/health', (req, res) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000',
    host: req.hostname,
    path: req.path,
    ip: req.ip
  };
  
  logger.info('🏥 Health check acessado', healthData);
  console.log('🏥 HEALTH CHECK:', JSON.stringify(healthData, null, 2));
  
  res.json(healthData);
});

// Root endpoint - para verificar se o servidor está respondendo
app.get('/', (req, res) => {
  logger.info('🏠 Root endpoint acessado');
  console.log('🏠 ROOT ENDPOINT acessado');
  
  res.json({
    message: 'GiroPro API - Servidor rodando',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      journeys: '/api/journeys'
    }
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/journeys', authMiddleware, journeyRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`❌ Rota não encontrada: ${req.method} ${req.path}`);
  console.log(`❌ 404: ${req.method} ${req.path}`);
  
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export { app };