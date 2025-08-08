import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { validateData, registerSchema, loginSchema, changePasswordSchema, refreshTokenSchema } from '../utils/validation';
import { UnauthorizedError, NotFoundError, ValidationError, ConflictError, TooManyRequestsError } from '../utils/customErrors';

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = validateData(registerSchema, req.body);
      const result = await AuthService.register(validatedData);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/api/auth/refresh'
      });

      // Don't send refresh token in response body
      const { refreshToken, ...responseData } = result;
      
      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: responseData,
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.name === 'ZodError') {
        throw new ValidationError('Dados de entrada inválidos', error.errors);
      }
      
      if (error.message === 'Email já está em uso') {
        throw new ConflictError('Email já está em uso');
      }
      
      throw error;
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = validateData(loginSchema, req.body);
      const result = await AuthService.login(validatedData);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/api/auth/refresh'
      });

      // Don't send refresh token in response body
      const { refreshToken, ...responseData } = result;
      
      return res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: responseData,
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.name === 'ZodError') {
        throw new ValidationError('Dados de entrada inválidos', error.errors);
      }
      
      if (error.message.includes('bloqueada')) {
        throw new TooManyRequestsError(error.message);
      }
      
      if (error.message === 'Credenciais inválidas' || 
          error.message === 'Conta inativa ou suspensa') {
        throw new UnauthorizedError(error.message);
      }
      
      throw error;
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token não fornecido');
      }

      const result = await AuthService.refreshToken(refreshToken);
      
      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/api/auth/refresh'
      });
      
      return res.json({
        success: true,
        message: 'Token renovado com sucesso',
        data: {
          token: result.token
        },
      });
    } catch (error: any) {
      console.error('Erro ao renovar token:', error);
      
      // Clear invalid refresh token cookie
      res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
      
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const user = await AuthService.getUserById(req.user.id);
      
      return res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        throw new NotFoundError('Usuário não encontrado');
      }
      
      throw error;
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validatedData = validateData(changePasswordSchema, req.body);
      
      await AuthService.changePassword(
        req.user.id,
        validatedData.currentPassword,
        validatedData.newPassword
      );
      
      return res.json({
        success: true,
        message: 'Senha alterada com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      if (error.name === 'ZodError') {
        throw new ValidationError('Dados de entrada inválidos', error.errors);
      }
      
      if (error.message === 'Senha atual inválida') {
        throw new UnauthorizedError('Senha atual inválida');
      }
      
      throw error;
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken', { 
        path: '/api/auth/refresh',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return res.json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  static async deactivateAccount(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      await AuthService.deactivateAccount(req.user.id);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken', { 
        path: '/api/auth/refresh',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return res.json({
        success: true,
        message: 'Conta desativada com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao desativar conta:', error);
      throw error;
    }
  }

  // Endpoint para verificar se o token ainda é válido
  static async verifyToken(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Token inválido');
      }

      // Se chegou até aqui, o token é válido (verificado pelo middleware)
      return res.json({
        success: true,
        message: 'Token válido',
        data: {
          userId: req.user.id,
          valid: true
        }
      });
    } catch (error: any) {
      console.error('Erro ao verificar token:', error);
      throw new UnauthorizedError('Token inválido');
    }
  }

  // Endpoint para listar sessões ativas (futuro)
  static async getActiveSessions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      // TODO: Implementar sistema de sessões ativas
      // Por enquanto, retorna informação básica
      return res.json({
        success: true,
        message: 'Funcionalidade em desenvolvimento',
        data: {
          sessions: [],
          message: 'Sistema de sessões ativas será implementado em breve'
        }
      });
    } catch (error: any) {
      console.error('Erro ao buscar sessões ativas:', error);
      throw error;
    }
  }

  // Endpoint para invalidar todas as sessões (futuro)
  static async logoutAllSessions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken', { 
        path: '/api/auth/refresh',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // TODO: Implementar invalidação de todas as sessões
      // Por enquanto, apenas limpa o cookie atual
      
      return res.json({
        success: true,
        message: 'Logout realizado em todas as sessões',
        data: {
          message: 'Sistema completo de sessões será implementado em breve'
        }
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout de todas as sessões:', error);
      throw error;
    }
  }
}
