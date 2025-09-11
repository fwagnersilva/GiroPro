import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (e: any) {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: e.errors 
      });
    }
  };

