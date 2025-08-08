import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Dados de entrada inválidos',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Parâmetros de consulta inválidos',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Parâmetros de rota inválidos',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
};

// Schemas comuns para validação
import { z } from 'zod';

export const uuidSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Página deve ser um número inteiro maior que 0').default(1),
  limit: z.coerce.number().int().min(1, 'Limite deve ser um número inteiro maior que 0').max(100, 'Limite máximo é 100').default(10)
});

export const dateRangeSchema = z.object({
  dataInicio: z.string().datetime('Data de início deve estar no formato ISO 8601').optional(),
  dataFim: z.string().datetime('Data de fim deve estar no formato ISO 8601').optional()
}).refine(data => {
  if (data.dataInicio && data.dataFim) {
    return new Date(data.dataInicio) <= new Date(data.dataFim);
  }
  return true;
}, {
  message: 'Data de início deve ser anterior à data de fim'
});

