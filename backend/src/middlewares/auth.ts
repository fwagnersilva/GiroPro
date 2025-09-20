import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Interface para o payload do JWT
interface JWTPayload {
  userId: string;
  email: string;
  nome: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Estende a interface Request do Express para incluir a propriedade 'user'


/**
 * Middleware de autenticação JWT
 * Verifica se o token fornecido no header Authorization é válido
 * e adiciona os dados do usuário ao objeto request
 */
import { AuthenticatedRequest } from "../types/auth";

const authMiddleware = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    // Extrai o header de autorização
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ 
        success: false,
        message: "Header de autorização não fornecido" 
      });
      return;
    }

    // Verifica se o formato está correto (Bearer TOKEN)
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401).json({ 
        success: false,
        message: "Formato do token inválido. Use: Bearer <token>" 
      });
      return;
    }

    const token = tokenParts[1];

    // Verifica se o JWT_SECRET está configurado adequadamente
    const jwtSecret = config.auth.jwtSecret;
    if (!jwtSecret || jwtSecret === 'supersecretjwtkey') {
      console.error("JWT_SECRET não configurado adequadamente nas variáveis de ambiente");
      res.status(500).json({ 
        success: false,
        message: "Erro interno do servidor" 
      });
      return;
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Valida se o payload contém os campos necessários
    if (!decoded.userId || !decoded.email) {
      res.status(403).json({ 
        success: false,
        message: "Token não contém dados válidos do usuário" 
      });
      return;
    }

    // Adiciona os dados do usuário ao request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      nome: decoded.nome,
      role: decoded.role
    };

    next();

  } catch (error) {
    // Log do erro para debugging (em produção, use um logger adequado)
    console.error("Erro na autenticação:", error);

    // Trata diferentes tipos de erro do JWT
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: "Token expirado" 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ 
        success: false,
        message: "Token inválido" 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "Erro interno do servidor" 
      });
    }
  }
};

export { authMiddleware };


