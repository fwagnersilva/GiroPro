const logger = new Logger();
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown, { Options } from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { cacheService } from '../services/cacheService';

// Configuração do Helmet para segurança
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting geral
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para autenticação (mais restritivo)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP por janela
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // não conta requests bem-sucedidos
});

// Slow down para requests frequentes
export const speedLimiter: ReturnType<typeof slowDown> = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // permitir 50 requests por janela sem delay
  delayMs: 500, // adicionar 500ms de delay para cada request adicional
  maxDelayMs: 20000, // máximo de 20 segundos de delay
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },

});

// Middleware para detectar ataques de força bruta por usuário
export const bruteForceProtection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body?.email;
    if (!email) {
      return next();
    }

    const key = `brute_force:${email}`;
    const attempts = await cacheService.increment(key, 3600); // 1 hora

    if (attempts > 10) {
      logger.warn(`Brute force attack detected for email: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        attempts
      });

      return res.status(429).json({
        error: 'Conta temporariamente bloqueada devido a muitas tentativas de login.',
        code: 'ACCOUNT_TEMPORARILY_LOCKED'
      });
    }

    // Adiciona informação ao request para uso posterior
    req.bruteForceAttempts = attempts;
    next();
  } catch (error) {
    logger.error('Brute force protection error:', error);
    next();
  }
};

// Middleware para limpar tentativas de força bruta em login bem-sucedido
export const clearBruteForceAttempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const originalJson = res.json;
    res.json = function(data: any) {
      // Se o login foi bem-sucedido (status 200 e tem token)
      if (res.statusCode === 200 && data.token && req.body?.email) {
        const key = `brute_force:${req.body.email}`;
        cacheService.del(key).catch(error => {
          logger.error('Failed to clear brute force attempts:', error);
        });
      }
      
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Clear brute force attempts error:', error);
    next();
  }
};

// Middleware para validar Content-Type em requests POST/PUT
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.get("Content-Type");
    
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({
        error: "Content-Type deve ser application/json",
        code: "INVALID_CONTENT_TYPE"
      });
    }
  }
  
  return next();
};

// Middleware para sanitizar headers perigosos
export const sanitizeHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove headers potencialmente perigosos
  delete req.headers['x-forwarded-host'];
  delete req.headers['x-original-host'];
  
  // Valida User-Agent
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.length > 500) {
    logger.warn(`Suspicious User-Agent from IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: userAgent?.substring(0, 100)
    });
  }
  
  next();
};

// Middleware para detectar tentativas de SQL injection
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|"|"|`)/,
    /(\bOR\b|\bAND\b).*(\b=\b|\bLIKE\b)/i
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === "string") {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const suspicious = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);

  if (suspicious) {
    logger.warn(`SQL injection attempt detected from IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      path: req.path,
      body: req.body,
      query: req.query
    });

    return res.status(400).json({
      error: 'Requisição inválida detectada',
      code: 'INVALID_REQUEST'
    });
  }

  return next();
};

// Middleware para detectar tentativas de XSS
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return xssPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const suspicious = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);

  if (suspicious) {
    logger.warn(`XSS attempt detected from IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      body: req.body,
      query: req.query
    });

    return res.status(400).json({
      error: 'Conteúdo perigoso detectado',
      code: 'DANGEROUS_CONTENT'
    });
  }

  return next();
};

// Middleware para log de segurança
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      ip: req.ip,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      userId: req.user?.id
    };

    // Log requests suspeitos
    if (res.statusCode >= 400 || duration > 5000) {
      logger.warn('Suspicious request detected', logData);
    } else {
      logger.info('Request processed', logData);
    }
  });

  next();
};

// Declaração de tipos para TypeScript
declare global {
  namespace Express {
    interface Request {
      bruteForceAttempts?: number;
    }
  }
}

