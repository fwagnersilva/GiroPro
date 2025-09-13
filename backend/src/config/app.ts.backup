// config/app.ts
export const appConfig = {
  // Configurações da API
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api'
  },

  // Configurações do servidor
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '10mb',
    keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT || '65000', 10),
    headersTimeout: parseInt(process.env.HEADERS_TIMEOUT || '66000', 10)
  },

  // Configurações de segurança
  security: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173' // Vite dev server
    ],
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutos
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5', 10)
  },

  // Configurações de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined'
  },

  // Configurações de cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hora
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100', 10)
  },

  // Configurações de compressão
  compression: {
    enabled: process.env.COMPRESSION_ENABLED !== 'false',
    level: parseInt(process.env.COMPRESSION_LEVEL || '6', 10),
    threshold: parseInt(process.env.COMPRESSION_THRESHOLD || '1024', 10)
  },

  // Informações da aplicação
  app: {
    name: 'GiroPro API',
    description: 'API para gerenciamento de veículos e combustível',
    version: process.env.npm_package_version || '1.0.0',
    author: 'GiroPro Team'
  }
} as const;
