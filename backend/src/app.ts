import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { fuelingRoutes } from './routes/fuelings';
import { fuelPricesRoutes } from './routes/fuelPrices';
import { expenseRoutes } from './routes/expenses';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import compression from 'compression';
import { initializeTables } from './db/initTables';

import helmet from 'helmet';

dotenv.config({ path: __dirname + '/../.env' });

const app = express();

const rawPort = process.env.PORT;
let PORT: number;

if (rawPort && !isNaN(parseInt(rawPort))) {
  PORT = parseInt(rawPort);
} else {
  PORT = 3000;
  console.warn(`⚠️ Variável de ambiente PORT inválida ou não definida. Usando a porta padrão: ${PORT}`);
}

// Middlewares
app.use(helmet()); // Use Helmet para segurança
app.disable('x-powered-by'); // Desabilita o cabeçalho X-Powered-By
app.use(cors({
  origin: '*', // Permite qualquer origem para desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(requestLogger);
app.use(compression());

// Routes básicas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/journeys', journeyRoutes);
app.use('/api/v1/fuelings', fuelingRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'GiroPro Backend está funcionando!'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando corretamente',
    endpoints: [
      '/health',
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/vehicles',
      '/api/v1/journeys',
      '/api/v1/fuelings',
      '/api/v1/expenses'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Configurar para escutar em todas as interfaces
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Servidor GiroPro rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🌐 Acessível externamente em: http://0.0.0.0:${PORT}`);
  
  // Inicializar tabelas no banco em memória
  await initializeTables();
});

export default app;


