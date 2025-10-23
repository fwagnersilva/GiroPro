import dotenv from 'dotenv';

// Carregar variáveis de ambiente
if (!process.env.DATABASE_URL) {
  console.log('📁 Carregando .env (desenvolvimento local)');
  dotenv.config();
} else {
  console.log('☁️ Usando variáveis de ambiente da plataforma');
}

export const config = {
  // Servidor
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',

  // Banco de dados
  database: {
    url: process.env.DATABASE_URL || '',
    type: process.env.DB_TYPE || process.env.DATABASE_TYPE || (process.env.DATABASE_URL ? 'postgres' : 'sqlite'),
  },

  // Autenticação
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },

  // Rate limiting
  rateLimit: {
    general: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    },
    api: {
      windowMs: 1 * 60 * 1000,
      maxRequests: 60,
    },
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Segurança
  security: {
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    },
  },

  // Email
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

// Ambientes
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isTest = config.environment === 'test';

// Validações
if (isProduction && config.auth.jwtSecret === 'supersecretjwtkey') {
  console.warn('⚠️  AVISO: Usando JWT secret padrão em produção!');
}

if (isProduction && !config.database.url) {
  console.error('❌ DATABASE_URL não configurada em produção!');
}

export default config;
