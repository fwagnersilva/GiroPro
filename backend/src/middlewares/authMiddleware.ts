import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Token de acesso não fornecido", { ip: req.ip, userAgent: req.get("User-Agent") });
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  return jwt.verify(token, config.auth.jwtSecret, (err: any, user: any) => {
    if (err) {
      logger.warn("Token inválido ou expirado", { token: token.substring(0, 10) + "...", error: err.message });
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    (req as any).user = user;
    logger.info("Usuário autenticado com sucesso", { userId: user.id, role: user.role });
    return next();
  });
};

export const authorizeRoles = (...allowedRoles: Array<'admin' | 'user' | 'guest'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      logger.error('Tentativa de autorização sem autenticação prévia');
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!allowedRoles.includes((req as any).user.role)) {
      logger.warn('Acesso negado por falta de permissão', { 
        userId: (req as any).user.id, 
        userRole: (req as any).user.role, 
        requiredRoles: allowedRoles,
        route: req.path 
      });
      return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }

    logger.info("Autorização concedida", { 
      userId: (req as any).user.id, 
      userRole: (req as any).user.role, 
      route: req.path 
    });
    return next();
  };
};

// Middleware combinado para autenticação e autorização
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
};

export const requireAdmin = [
  authenticateToken,
  authorizeRoles("admin")
];

export const requireUserOrAdmin = [
  authenticateToken,
  authorizeRoles("user", "admin")
];

