import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { appConfig } from './config/app';

// Carregamento imediato das rotas críticas
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';

dotenv.config();

interface RouteConfig {
  path: string;
  loader: () => Promise<any>;
  critical: boolean;
}

// Configuração de rotas com carregamento otimizado
const routeConfigs: RouteConfig[] = [
  // Rotas críticas (carregadas imediatamente)
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/auth`, loader: async () => authRoutes, critical: true },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/users`, loader: async () => userRoutes, critical: true },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/vehicles`, loader: async () => vehicleRoutes, critical: true },
  
  // Rotas secundárias (lazy loading)
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/journeys`, loader: async () => (await import('./routes/journeys')).journeyRoutes, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/fuelings`, loader: async () => (await import('./routes/fuelings')).fuelingRoutes, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/expenses`, loader: async () => (await import('./routes/expenses')).expenseRoutes, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/reports`, loader: async () => (await import('./routes/reports')).reportRoutes, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/dashboard`, loader: async () => (await import('./routes/dashboard')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/fuel-prices`, loader: async () => (await import('./routes/fuel-prices')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/analytics`, loader: async () => (await import('./routes/analytics')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/multi-vehicle`, loader: async () => (await import('./routes/multi-vehicle')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/insights`, loader: async () => (await import('./routes/insights')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/notifications`, loader: async () => (await import('./routes/notifications')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/goals`, loader: async () => (await import('./routes/goals')).default, critical: false },
  { path: `${appConfig.api.prefix}/${appConfig.api.version}/gamification`, loader: async () => (await import('./routes/gamification')).default, critical: false }
];

// Função para configurar middlewares de segurança
const setupSecurityMiddlewares = (app: Express): void => {
  // Helmet para headers de segurança
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting diferenciado
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: {
      error: 'Muitas requisições',
      message: 'Tente novamente em 15 minutos',
      retryAfter: 900 // segundos
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limite mais restritivo para auth
    message: {
      error: 'Muitas tentativas de login',
      message: 'Tente novamente em 15 minutos'
    }
  });

  app.use(`${appConfig.api.prefix}/`, generalLimiter);
  app.use(`${appConfig.api.prefix}/${appConfig.api.version}/auth`, authLimiter);

  // CORS configurado adequadamente
  app.use(cors({
    origin: appConfig.security.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 horas de cache para preflight
  }));
};

// Função para configurar middlewares básicos
const setupBasicMiddlewares = (app: Express): void => {
  // Compressão de resposta
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
    threshold: 1024
  }));

  // Body parser com limites
  app.use(express.json({ 
    limit: appConfig.server.maxPayloadSize,
    verify: (req, res, buf) => {
      // Verificação adicional do payload se necessário
      if (buf.length === 0) {
        throw new Error('Payload vazio');
      }
    }
  }));
  
  app.use(express.urlencoded({ 
    extended: true, 
    limit: appConfig.server.maxPayloadSize 
  }));

  // Request logging
  app.use(requestLogger);
};

// Função para registrar rotas de forma otimizada
const registerRoutes = async (app: Express): Promise<void> => {
  console.log('📂 Registrando rotas...');
  
  // Registrar rotas críticas primeiro (já carregadas)
  const criticalRoutes = routeConfigs.filter(route => route.critical);
  for (const route of criticalRoutes) {
    try {
      const handler = await route.loader();
      app.use(route.path, handler);
      console.log(`✅ Rota crítica registrada: ${route.path}`);
    } catch (error) {
      console.error(`❌ Erro ao carregar rota crítica ${route.path}:`, error);
      throw error;
    }
  }

  // Registrar rotas secundárias com lazy loading
  const secondaryRoutes = routeConfigs.filter(route => !route.critical);
  const routePromises = secondaryRoutes.map(async (route) => {
    try {
      const handler = await route.loader();
      app.use(route.path, handler);
      console.log(`✅ Rota secundária registrada: ${route.path}`);
    } catch (error) {
      console.error(`❌ Erro ao carregar rota ${route.path}:`, error);
      // Não quebra a aplicação por rotas secundárias
    }
  });

  await Promise.allSettled(routePromises);
};

// Função para configurar rotas especiais
const setupSpecialRoutes = (app: Express): void => {
  // Health check melhorado
  app.get('/health', (req, res) => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      }
    };

    res.json(healthData);
  });

  // Readiness check para Kubernetes
  app.get('/ready', (req, res) => {
    res.json({ 
      status: 'READY',
      timestamp: new Date().toISOString()
    });
  });

  // API info endpoint
  app.get(`${appConfig.api.prefix}/${appConfig.api.version}`, (req, res) => {
    res.json({
      name: 'GiroPro API',
      version: appConfig.api.version,
      description: 'API para gerenciamento de veículos e combustível',
      endpoints: routeConfigs.map(route => route.path),
      timestamp: new Date().toISOString()
    });
  });
};

// Função para configurar tratamento de erros
const setupErrorHandling = (app: Express): void => {
  // 404 handler mais informativo
  app.use('*', (req, res) => {
    const availableEndpoints = routeConfigs.map(route => route.path);
    availableEndpoints.push('/health', '/ready');

    res.status(404).json({ 
      error: 'Endpoint não encontrado',
      message: `Rota ${req.method} ${req.originalUrl} não existe`,
      suggestion: 'Verifique a documentação da API',
      availableEndpoints: availableEndpoints.sort(),
      timestamp: new Date().toISOString()
    });
  });

  // Error handler deve ser o último middleware
  app.use(errorHandler);
};

// Função principal para criar a aplicação
export const createApp = async (): Promise<Express> => {
  const app = express();

  console.log('🚀 Inicializando GiroPro API...');

  try {
    // Configurar middlewares na ordem correta
    setupSecurityMiddlewares(app);
    setupBasicMiddlewares(app);
    
    // Registrar rotas
    await registerRoutes(app);
    
    // Configurar rotas especiais
    setupSpecialRoutes(app);
    
    // Configurar tratamento de erros (deve ser por último)
    setupErrorHandling(app);

    console.log('✅ Aplicação configurada com sucesso');
    return app;

  } catch (error) {
    console.error('❌ Erro ao configurar aplicação:', error);
    throw error;
  }
};

// Export da app para compatibilidade
export default createApp;

// Instância do servidor para controle
let serverInstance: any;

// Função para iniciar o servidor
export const startServer = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('🧪 Modo de teste detectado, servidor não será iniciado automaticamente');
    return null;
  }

  try {
    const app = await createApp();
    
    serverInstance = app.listen(appConfig.server.port, appConfig.server.host, () => {
      console.log(`🚀 Servidor GiroPro rodando na porta ${appConfig.server.port}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://${appConfig.server.host}:${appConfig.server.port}/health`);
      console.log(`📖 API Info: http://${appConfig.server.host}:${appConfig.server.port}${appConfig.api.prefix}/${appConfig.api.version}`);
    });

    // Configurar graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`\n${signal} recebido, iniciando graceful shutdown...`);
      
      serverInstance.close((err: any) => {
        if (err) {
          console.error('❌ Erro durante o shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Servidor encerrado com sucesso');
        process.exit(0);
      });

      // Força o shutdown após 10 segundos
      setTimeout(() => {
        console.log('⏰ Forçando encerramento após timeout');
        process.exit(1);
      }, 10000);
    };

    // Listeners para sinais de encerramento
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Tratamento de erros não capturados
    process.on('uncaughtException', (error) => {
      console.error('❌ Exceção não capturada:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promise rejeitada não tratada:', reason, 'em', promise);
      process.exit(1);
    });

    return serverInstance;

  } catch (error) {
    console.error('❌ Erro fatal ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Inicialização automática se não estiver em modo de teste
if (require.main === module) {
  startServer();
}

// Export da instância do servidor para compatibilidade
export const server = serverInstance;
