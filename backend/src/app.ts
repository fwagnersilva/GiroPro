import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';
import { journeyRoutes } from './routes/journeys';
import { fuelingRoutes } from './routes/fuelings';
import { expenseRoutes } from './routes/expenses';
import { reportRoutes } from './routes/reports';
import dashboardRoutes from './routes/dashboard';
import fuelPriceRoutes from './routes/fuel-prices';
import analyticsRoutes from './routes/analytics';
import multiVehicleRoutes from './routes/multi-vehicle';
import insightsRoutes from './routes/insights';
import notificationsRoutes from './routes/notifications';
import goalsRoutes from './routes/goals';
import gamificationRoutes from './routes/gamification';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/journeys', journeyRoutes);
app.use('/api/v1/fuelings', fuelingRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/fuel-prices', fuelPriceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/multi-vehicle', multiVehicleRoutes);
app.use('/api/v1/insights', insightsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/goals', goalsRoutes);
app.use('/api/v1/gamification', gamificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;

