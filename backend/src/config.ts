export const config = {
  // Configurações básicas do servidor
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // Configurações de banco de dados
  database: {
    url: process.env.DATABASE_URL || 'giropro.db',
    type: 'sqlite' as const,
  },
  
  // Configurações de autenticação
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Configurações específicas do SQLite para otimização
  sqlite: {
    // Configurações de performance
    pragmas: {
      journal_mode: 'WAL',        // Write-Ahead Logging para melhor concorrência
      synchronous: 'NORMAL',      // Balanceamento entre performance e segurança
      cache_size: 2000,           // Cache de 2MB (2000 páginas de 1KB)
      temp_store: 'MEMORY',       // Armazenar tabelas temporárias em memória
      mmap_size: 268435456,       // Memory-mapped I/O de 256MB
      optimize: true,             // Otimização automática
      foreign_keys: 'ON',         // Habilitar foreign keys
      busy_timeout: 30000,        // Timeout de 30 segundos para operações bloqueadas
    },
    
    // Configurações de conexão
    connection: {
      readonly: false,
      fileMustExist: false,
      timeout: 5000,
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    }
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

