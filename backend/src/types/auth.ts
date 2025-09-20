import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    nome: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

