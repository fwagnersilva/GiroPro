import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema, changePasswordSchema } from '../utils/validation';
import { UnauthorizedError, NotFoundError, ValidationError, ConflictError } from "../utils/customErrors";


import { AuthenticatedRequest } from "../middleware/auth";
import { z } from 'zod';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, dateOfBirth, city } = registerSchema.parse(req.body);
      const { token, user, refreshToken } = await AuthService.register({ email, password, name, dateOfBirth, city });
      res.status(201).send({ success: true, message: 'Usuário registrado com sucesso', accessToken: token, user: { ...user, role: 'user' }, refreshToken });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        console.error("Validation Error:", error);
        res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
      } else if (error instanceof ConflictError) {
        console.error("Conflict Error:", error);
        res.status(409).send({ success: false, message: "Email já está em uso." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro no registro:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Validation Error:", error);
        res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
      } else if (error instanceof UnauthorizedError) {
        console.error("Unauthorized Error:", error);
        res.status(401).send({ success: false, message: "Credenciais inválidas." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro no login:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Validation Error:", error);
        res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
      } else if (error instanceof NotFoundError) {
        console.error("Not Found Error:", error);
        res.status(404).send({ success: false, message: "Email não encontrado." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro ao solicitar redefinição de senha:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Validation Error:", error);
        res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
      } else if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
        console.error("Authentication/Not Found Error:", error);
        res.status(401).send({ success: false, message: "Token inválido ou expirado." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Unauthorized Error:", error);
        res.status(401).send({ success: false, message: "Token de atualização inválido." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro ao atualizar token:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Validation Error:", error);
        res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
      } else if (error instanceof UnauthorizedError) {
        console.error("Unauthorized Error:", error);
        res.status(401).send({ success: false, message: "Credenciais inválidas ou usuário não autorizado." });
      } else if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(400).send({ success: false, message: "Erro de validação dos dados." });
      } else {
        console.error('Erro ao alterar senha:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
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
        console.error("Unauthorized Error:", error);
        res.status(401).send({ success: false, message: "Usuário não autenticado." });
      } else if (error instanceof NotFoundError) {
        console.error("Not Found Error:", error);
        res.status(404).send({ success: false, message: "Usuário não encontrado." });
      } else {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
      }
    }
  }
}
