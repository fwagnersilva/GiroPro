import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cacheService';
import { Logger } from '../utils/logger';

interface CacheOptions {
  ttl?: number; // Time to live em segundos
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
  varyBy?: string[]; // Headers ou query params para variar o cache
}

export const cache = (options: CacheOptions = {}) => {
  const {
    ttl = 300, // 5 minutos por padrão
    keyGenerator,
    skipCache,
    varyBy = []
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica se deve pular o cache
      if (skipCache && skipCache(req)) {
        return next();
      }

      // Só faz cache para métodos GET
      if (req.method !== 'GET') {
        return next();
      }

      // Gera a chave do cache
      let cacheKey: string;
      if (keyGenerator) {
        cacheKey = keyGenerator(req);
      } else {
        const baseKey = `route:${req.originalUrl}`;
        const varyParts = varyBy.map(key => {
          if (req.headers[key]) {
            return `${key}:${req.headers[key]}`;
          }
          if (req.query[key]) {
            return `${key}:${req.query[key]}`;
          }
          return null;
        }).filter(Boolean);
        
        cacheKey = varyParts.length > 0 
          ? `${baseKey}:${varyParts.join(':')}`
          : baseKey;
      }

      // Tenta buscar no cache
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        Logger.debug(`Cache hit for key: ${cacheKey}`);
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Cache miss - intercepta a resposta
      Logger.debug(`Cache miss for key: ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');

      const originalJson = res.json;
      res.json = function(data: any) {
        // Só faz cache de respostas de sucesso
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService.set(cacheKey, data, ttl).catch(error => {
            Logger.error('Failed to cache response:', error);
          });
        }
        
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      Logger.error('Cache middleware error:', error);
      next();
    }
  };
};

// Middleware específico para cache de usuário
export const userCache = (ttl: number = 1800) => {
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.id || 'anonymous';
      return `user_data:${userId}:${req.originalUrl}`;
    },
    skipCache: (req: Request) => !req.user?.id
  });
};

// Middleware específico para cache de dashboard
export const dashboardCache = (ttl: number = 1800) => {
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.id || 'anonymous';
      const period = req.query.period || 'today';
      return `dashboard:${userId}:${period}`;
    },
    skipCache: (req: Request) => !req.user?.id,
    varyBy: ['period']
  });
};

// Middleware específico para cache de relatórios
export const reportCache = (ttl: number = 3600) => {
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.id || 'anonymous';
      const startDate = req.query.startDate || '';
      const endDate = req.query.endDate || '';
      const vehicleId = req.query.vehicleId || 'all';
      return `report:${userId}:${startDate}:${endDate}:${vehicleId}`;
    },
    skipCache: (req: Request) => !req.user?.id,
    varyBy: ['startDate', 'endDate', 'vehicleId']
  });
};

// Middleware para cache de preços de combustível
export const fuelPricesCache = (ttl: number = 7200) => {
  return cache({
    ttl,
    keyGenerator: () => 'fuel_prices:latest'
  });
};

// Middleware para invalidar cache
export const invalidateCache = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const originalJson = res.json;
      res.json = function(data: any) {
        // Só invalida cache em respostas de sucesso
        if (res.statusCode >= 200 && res.statusCode < 300) {
          patterns.forEach(pattern => {
            const resolvedPattern = pattern.replace(':userId', req.user?.id || '');
            cacheService.delPattern(resolvedPattern).catch(error => {
              Logger.error('Failed to invalidate cache:', error);
            });
          });
        }
        
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      Logger.error('Cache invalidation middleware error:', error);
      next();
    }
  };
};

// Middleware para invalidar cache de usuário específico
export const invalidateUserCache = () => {
  return invalidateCache(['user:*:userId*', 'dashboard:*:userId*', 'vehicles:*:userId*']);
};

