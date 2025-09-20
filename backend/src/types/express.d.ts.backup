import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        // Adicione outras propriedades do objeto user aqui, se houver
      };
    }
  }
}


