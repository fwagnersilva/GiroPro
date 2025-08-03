import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { validateData, registerSchema, loginSchema } from '../utils/validation';
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/customErrors';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = validateData(registerSchema, req.body);
      const result = await AuthService.register(validatedData);
      
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Dados de entrada inválidos', error.errors);
      }
      throw error; // Re-throw other errors to be handled by the errorHandler middleware
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = validateData(loginSchema, req.body);
      const result = await AuthService.login(validatedData);
      
      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Dados de entrada inválidos', error.errors);
      }
      throw new UnauthorizedError(error.message); // Assume login errors are unauthorized
    }
  }

  static async me(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const user = await AuthService.getUserById(req.user?.id);
      
      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      return res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      throw error; // Re-throw errors to be handled by the errorHandler middleware
    }
  }
}


