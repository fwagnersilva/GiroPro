import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private message: string;

  constructor(options: {
    windowMs: number;
    maxRequests: number;
    message?: string;
  }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.message = options.message || 'Muitas requisições. Tente novamente mais tarde.';
  }

  middleware = (req: Request, res: Response, next: NextFunction): void => {
    const key = this.getKey(req);
    const now = Date.now();
    
    // Limpar entradas expiradas
    this.cleanup(now);
    
    // Verificar se a chave existe no store
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return next();
    }

    const record = this.store[key];
    
    // Se o tempo de reset passou, reiniciar o contador
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return next();
    }

    // Incrementar contador
    record.count++;

    // Verificar se excedeu o limite
    if (record.count > this.maxRequests) {
      const timeUntilReset = Math.ceil((record.resetTime - now) / 1000);
      
      res.status(429).json({
        success: false,
        error: {
          message: this.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: timeUntilReset
        }
      });
      return;
    }

    // Adicionar headers informativos
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': (this.maxRequests - record.count).toString(),
      'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
    });

    next();
  };

  private getKey(req: Request): string {
    // Usar IP do usuário como chave
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Se houver usuário autenticado, usar o ID do usuário
    const userId = (req as any).userId;
    if (userId) {
      return `user:${userId}`;
    }
    
    return `ip:${ip}`;
  }

  private cleanup(now: number): void {
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Rate limiters pré-configurados
export const generalRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // 100 requisições por 15 minutos
  message: 'Muitas requisições. Limite de 100 requisições por 15 minutos.'
});

export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 tentativas de login por 15 minutos
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

export const apiRateLimit = new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minuto
  maxRequests: 60, // 60 requisições por minuto
  message: 'Muitas requisições à API. Limite de 60 requisições por minuto.'
});

export const dashboardRateLimit = new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minuto
  maxRequests: 30, // 30 requisições por minuto para dashboard
  message: 'Muitas requisições ao dashboard. Limite de 30 requisições por minuto.'
});

export { RateLimiter };

