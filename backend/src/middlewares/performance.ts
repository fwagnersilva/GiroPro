import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { performanceService } from '../services/performanceService';
import { logger } from '../utils/logger';

// Middleware de compressão
export const compressionMiddleware = compression({
  filter: (req: Request, res: Response) => {
    // Não comprimir se o cliente não suporta
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Usar compressão padrão do compression
    return compression.filter(req, res);
  },
  level: 6, // Nível de compressão balanceado
  threshold: 1024, // Só comprimir arquivos > 1KB
});

// Middleware para monitorar performance de requests
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const startCpuUsage = process.cpuUsage();

  // Interceptar o final da resposta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const endCpuUsage = process.cpuUsage(startCpuUsage);
    const memoryUsage = process.memoryUsage();

    // Adicionar métrica ao serviço de performance
    performanceService.addMetric({
      timestamp: Date.now(),
      endpoint: req.route?.path || req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      memoryUsage,
      cpuUsage: endCpuUsage
    });

    // Adicionar headers de performance para debug
    if (process.env.NODE_ENV === 'development') {
      res.setHeader('X-Response-Time', `${duration}ms`);
      res.setHeader('X-Memory-Usage', `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    }
  });

  next();
};

// Middleware para timeout de requests
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn(`Request timeout for ${req.method} ${req.path}`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timeout: timeoutMs
        });

        res.status(408).json({
          error: 'Request timeout',
          code: 'REQUEST_TIMEOUT'
        });
      }
    }, timeoutMs);

    // Limpar timeout quando a resposta for enviada
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

// Middleware para limitar tamanho do payload
export const payloadSizeLimit = (maxSizeBytes: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSizeBytes) {
      logger.warn(`Payload too large: ${contentLength} bytes`, {
        ip: req.ip,
        path: req.path,
        maxSize: maxSizeBytes
      });

      return res.status(413).json({
        error: 'Payload muito grande',
        code: 'PAYLOAD_TOO_LARGE',
        maxSize: maxSizeBytes
      });
    }

    next();
  };
};

// Middleware para adicionar headers de cache
export const cacheHeaders = (maxAge: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      res.setHeader('ETag', `"${Date.now()}"`);
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    
    next();
  };
};

// Middleware para otimizar headers de resposta
export const optimizeHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remover headers desnecessários
  res.removeHeader('X-Powered-By');
  
  // Adicionar headers de performance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Headers para melhor performance
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  
  next();
};

// Middleware para detectar memory leaks
export const memoryLeakDetector = (req: Request, res: Response, next: NextFunction) => {
  const memoryBefore = process.memoryUsage();
  
  res.on('finish', () => {
    const memoryAfter = process.memoryUsage();
    const heapDiff = memoryAfter.heapUsed - memoryBefore.heapUsed;
    
    // Se o heap cresceu mais que 50MB em uma request, pode ser um leak
    if (heapDiff > 50 * 1024 * 1024) {
      logger.warn('Potential memory leak detected', {
        endpoint: req.path,
        method: req.method,
        heapDiff: `${(heapDiff / 1024 / 1024).toFixed(2)}MB`,
        memoryBefore: `${(memoryBefore.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        memoryAfter: `${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)}MB`
      });
    }
  });
  
  next();
};

// Middleware para health check
export const healthCheck = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health' || req.path === '/api/health') {
    try {
      const health = await performanceService.getSystemHealth();
      const alerts = performanceService.getPerformanceAlerts();
      
      res.status(health.status === 'critical' ? 503 : 200).json({
        status: health.status,
        timestamp: new Date().toISOString(),
        uptime: health.uptime,
        memory: health.memory,
        cache: health.cache,
        database: health.database,
        metrics: health.metrics,
        alerts
      });
    } catch (error) {
      logger.error('Health check error:', error);
      res.status(503).json({
        status: 'error',
        message: 'Health check failed'
      });
    }
  } else {
    next();
  }
};

// Middleware para métricas detalhadas (apenas em desenvolvimento)
export const detailedMetrics = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && req.path === '/metrics') {
    const stats = performanceService.getAggregatedStats(60);
    const slowestEndpoints = performanceService.getSlowestEndpoints(10);
    const alerts = performanceService.getPerformanceAlerts();
    
    res.json({
      stats,
      slowestEndpoints,
      alerts,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } else {
    next();
  }
};

