import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema, changePasswordSchema } from '../utils/validation';
import { UnauthorizedError, NotFoundError, ValidationError, ConflictError } from "../utils/customErrors";
import { AuthenticatedRequest } from "../types/common";



export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  // Rota de registro de usuário
  app.post(
    '/auth/register',
    {
      schema: {
        body: registerSchema,
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
            userId: z.string().uuid(),
          }),
          400: z.object({
            success: z.boolean(),
            error: z.string(),
            details: z.array(z.object({ message: z.string() })).optional(),
          }),
          409: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, senha, nome } = request.body;
        const { userId } = await AuthService.register({ email, senha, nome });
        reply.status(201).send({ success: true, message: 'Usuário registrado com sucesso', userId });
      } catch (error: any) {
        if (error instanceof ValidationError) {
          reply.status(400).send({ success: false, error: error.message, details: error.details });
        } else if (error.message === 'Email já está em uso') {
          reply.status(409).send({ success: false, error: error.message });
        } else {
          console.error('Erro no registro:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );

  // Rota de login de usuário
  app.post(
    '/auth/login',
    {
      schema: {
        body: loginSchema,
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
          400: z.object({
            success: z.boolean(),
            error: z.string(),
            details: z.array(z.object({ message: z.string() })).optional(),
          }),
          401: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, senha } = request.body;
        const { token: accessToken, refreshToken } = await AuthService.login({ email, senha });
        reply.send({ success: true, message: 'Login bem-sucedido', accessToken, refreshToken });
      } catch (error: any) {
        if (error instanceof ValidationError) {
          reply.status(400).send({ success: false, error: error.message, details: error.details });
        } else if (error instanceof UnauthorizedError) {
          reply.status(401).send({ success: false, error: error.message });
        } else {
          console.error('Erro no login:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );

  // Rota para solicitar redefinição de senha
  app.post(
    '/auth/request-password-reset',
    {
      schema: {
        body: requestPasswordResetSchema,
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
          400: z.object({
            success: z.boolean(),
            error: z.string(),
            details: z.array(z.object({ message: z.string() })).optional(),
          }),
          404: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body;
        await AuthService.requestPasswordReset(email);
        reply.send({ success: true, message: 'Se o email estiver registrado, um link de redefinição de senha foi enviado.' });
      } catch (error: any) {
        if (error instanceof ValidationError) {
          reply.status(400).send({ success: false, error: error.message, details: error.details });
        } else if (error instanceof NotFoundError) {
          reply.status(404).send({ success: false, error: error.message });
        } else {
          console.error('Erro ao solicitar redefinição de senha:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );

  // Rota para redefinir senha
  app.post(
    '/auth/reset-password',
    {
      schema: {
        body: resetPasswordSchema,
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
          400: z.object({
            success: z.boolean(),
            error: z.string(),
            details: z.array(z.object({ message: z.string() })).optional(),
          }),
          401: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          404: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { token, newPassword } = request.body;
        await AuthService.resetPassword(token, newPassword);
        reply.send({ success: true, message: 'Senha redefinida com sucesso.' });
      } catch (error: any) {
        if (error instanceof ValidationError) {
          reply.status(400).send({ success: false, error: error.message, details: error.details });
        } else if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
          reply.status(401).send({ success: false, error: error.message });
        } else {
          console.error('Erro ao redefinir senha:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );

  // Rota para refresh de token
  app.post(
    '/auth/refresh-token',
    {
      schema: {
        body: z.object({ refreshToken: z.string() }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
          401: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { refreshToken } = request.body;
        const { token: accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);
        reply.send({ success: true, message: 'Token atualizado com sucesso', accessToken, refreshToken: newRefreshToken });
      } catch (error: any) {
        if (error instanceof UnauthorizedError) {
          reply.status(401).send({ success: false, error: error.message });
        } else {
          console.error('Erro ao atualizar token:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );

  // Rota para alterar senha (autenticada)
  app.post(
    '/auth/change-password',
    {
      preHandler: app.authenticate, // Middleware de autenticação
      schema: {
        body: changePasswordSchema,
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
          400: z.object({
            success: z.boolean(),
            error: z.string(),
            details: z.array(z.object({ message: z.string() })).optional(),
          }),
          401: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    async (request: AuthenticatedRequest, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          throw new UnauthorizedError('Usuário não autenticado');
        }
        const { currentPassword, newPassword } = request.body;
        await AuthService.changePassword(userId, currentPassword, newPassword);
        reply.send({ success: true, message: 'Senha alterada com sucesso.' });
      } catch (error: any) {
        if (error instanceof ValidationError) {
          reply.status(400).send({ success: false, error: error.message, details: error.details });
        } else if (error instanceof UnauthorizedError) {
          reply.status(401).send({ success: false, error: error.message });
        } else {
          console.error('Erro ao alterar senha:', error);
          reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
        }
      }
    }
  );
};



