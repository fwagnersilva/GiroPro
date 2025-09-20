import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    nome: string;
    role: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  nome: string;
  role: string;
  iat?: number;
  exp?: number;
}

