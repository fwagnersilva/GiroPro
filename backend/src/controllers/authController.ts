import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      const result = await AuthService.login({ email, senha });

      return res.json({
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user
      });

    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(401).json({
        error: error.message || 'Credenciais inválidas'
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      const result = await AuthService.register({ nome, email, senha });

      return res.status(201).json({
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user
      });

    } catch (error: any) {
      console.error('Register error:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao registrar usuário'
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token obrigatório' });
      }

      const result = await AuthService.refreshToken(refreshToken);

      return res.json(result);

    } catch (error: any) {
      console.error('Refresh token error:', error);
      return res.status(401).json({
        error: error.message || 'Token inválido'
      });
    }
  }

  static async requestPasswordReset(req: Request, res: Response) {
    try {
      return res.status(501).json({ error: 'Não implementado' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      return res.status(501).json({ error: 'Não implementado' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      return res.status(501).json({ error: 'Não implementado' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      return res.json(req.user);
    } catch (error: any) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        error: 'Erro ao buscar perfil'
      });
    }
  }
}
