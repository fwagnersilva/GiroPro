import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema, changePasswordSchema } from '../utils/validation';
import { UnauthorizedError, NotFoundError, ValidationError, ConflictError } from "../utils/customErrors";
import { AuthenticatedRequest } from "../types/common";
import { z } from 'zod';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, senha, nome } = registerSchema.parse(req.body);
      const { token, user, refreshToken } = await AuthService.register({ email, senha, nome });
      res.status(201).send({ success: true, message: 'Usuário registrado com sucesso', accessToken: token, user, refreshToken });
    } catch (error: any) {
   if (error instanceof ValidationError) {
     // Logar o erro completo para depuração interna (opcional, mas recomendado)
     console.error("Validation Error:", error);
     // Enviar uma mensagem de erro genérica e segura para o cliente
     res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
   } else {
     // Lidar com outros tipos de erros de forma segura
     console.error("Server Error:", error);
     res.status(500).send({ success: false, message: "Ocorreu um erro interno no servidor." });
   }
      } else if (error.message === 'Email já está em uso') {
        res.status(409).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro no registro:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      const { token: accessToken, refreshToken } = await AuthService.login({ email, senha });
      res.send({ success: true, message: 'Login bem-sucedido', accessToken, refreshToken });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        res.status(400).send({ success: false, error: error.message, details: error.details });
      } else if (error instanceof UnauthorizedError) {
        res.status(401).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro no login:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = requestPasswordResetSchema.parse(req.body);
      await AuthService.requestPasswordReset(email);
      res.send({ success: true, message: 'Se o email estiver registrado, um link de redefinição de senha foi enviado.' });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        res.status(400).send({ success: false, error: error.message, details: error.details });
      } else if (error instanceof NotFoundError) {
        res.status(404).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro ao solicitar redefinição de senha:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(token, newPassword);
      res.send({ success: true, message: 'Senha redefinida com sucesso.' });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        res.status(400).send({ success: false, error: error.message, details: error.details });
      } else if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
        res.status(401).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
      const { token: accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);
      res.send({ success: true, message: 'Token atualizado com sucesso', accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        res.status(401).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro ao atualizar token:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Usuário não autenticado');
      }
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.send({ success: true, message: 'Senha alterada com sucesso.' });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        res.status(400).send({ success: false, error: error.message, details: error.details });
      } else if (error instanceof UnauthorizedError) {
        res.status(401).send({ success: false, error: error.message });
      } else if (error instanceof z.ZodError) {
        res.status(400).send({ success: false, error: 'Erro de validação', details: error.errors });
      } else {
        console.error('Erro ao alterar senha:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Usuário não autenticado');
      }
      const user = await AuthService.getUserById(userId);
      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }
      res.send({ success: true, user });
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        res.status(401).send({ success: false, error: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(404).send({ success: false, error: error.message });
      } else {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  }
}


