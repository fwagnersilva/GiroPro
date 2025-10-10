export const config = {
  // Configurações básicas do servidor
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',

  // Configurações de banco de dados - AGORA POSTGRESQL
  database: {
    url: process.env.DATABASE_URL || 'postgresql://giropro:giropro123@localhost:5432/giropro_dev',
    type: process.env.DB_TYPE || 'postgres',
  },

  // Configurações de autenticação
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },

  // Configurações de rate limiting
  rateLimit: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 100,
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 5,
    },
    api: {
      windowMs: 1 * 60 * 1000, // 1 minuto
      maxRequests: 60,
    },
  },

  // Configurações de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Configurações de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Configurações de segurança
  security: {
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    },
  },

  // Configurações de email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@giropro.com',
  },

  // URLs
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};

// Configurações derivadas
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isTest = config.environment === 'test';

// Validação de configurações críticas
if (isProduction && config.auth.jwtSecret === 'supersecretjwtkey') {
  console.warn('⚠️  AVISO: Usando JWT secret padrão em produção. Configure JWT_SECRET!');
}

if (isProduction && config.cors.origin === '*') {
  console.warn('⚠️  AVISO: CORS configurado para aceitar qualquer origem em produção. Configure CORS_ORIGIN!');
}

if (!config.database.url) {
  throw new Error('❌ DATABASE_URL não está configurada no .env');
}

if (config.database.type !== 'postgres') {
  console.warn('⚠️  AVISO: Esperando PostgreSQL, mas DB_TYPE está configurado como:', config.database.type);
}