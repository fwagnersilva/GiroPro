import { Request, Response } from 'express';
import { NotificationService, NotificationData } from '../services/notificationService';
import { z } from 'zod';

// Interfaces
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

// Schemas de validação
const createNotificationSchema = z.object({
  tipo: z.string().default('Sistema'),
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  mensagem: z.string()
    .min(1, 'Mensagem é obrigatória')
    .max(500, 'Mensagem deve ter no máximo 500 caracteres'),
  dados_extras: z.any().optional(),
});

const getNotificationsSchema = z.object({
  limit: z.coerce.number()
    .min(1, 'Limite mínimo é 1')
    .max(100, 'Limite máximo é 100')
    .default(20),
  offset: z.coerce.number()
    .min(0, 'Offset deve ser maior ou igual a 0')
    .default(0),
  onlyUnread: z.coerce.boolean().default(false),
  tipo: z.string().optional(),
});

export class NotificationsController {
  /**
   * Valida se o usuário está autenticado
   */
  private static validateAuth(req: AuthenticatedRequest): string | null {
    return req.user?.id || null;
  }

  /**
   * Retorna resposta de erro padronizada
   */
  private static errorResponse(res: Response, status: number, message: string, details?: any): Response {
    return res.status(status).json({
      success: false,
      error: { message, details }
    });
  }

  /**
   * Retorna resposta de sucesso padronizada
   */
  private static successResponse<T>(res: Response, data?: T, message?: string, status: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message })
    };
    return res.status(status).json(response);
  }

  /**
   * Criar uma nova notificação
   */
  static async createNotification(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const validation = createNotificationSchema.safeParse(req.body);
      if (!validation.success) {
        return NotificationsController.errorResponse(
          res, 
          400, 
          'Dados inválidos', 
          validation.error.errors
        );
      }

      const notificationData: NotificationData = {
        idUsuario: userId,
        tipo: validation.data.tipo,
        titulo: validation.data.titulo,
        mensagem: validation.data.mensagem,
        dados_extras: validation.data.dados_extras,
      };

      const notification = await NotificationService.createNotification(notificationData);

      return NotificationsController.successResponse(
        res,
        notification,
        'Notificação criada com sucesso',
        201
      );

    } catch (error: any) {
      console.error('Erro ao criar notificação:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Buscar notificações do usuário
   */
  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const validation = getNotificationsSchema.safeParse(req.query);
      if (!validation.success) {
        return NotificationsController.errorResponse(
          res,
          400,
          'Parâmetros inválidos',
          validation.error.errors
        );
      }

      const { limit, offset, onlyUnread, tipo } = validation.data;

      const [notifications, unreadCount] = await Promise.all([
        NotificationService.getUserNotifications(userId, {
          limit,
          offset,
          onlyUnread,
          tipo,
        }),
        NotificationService.getUnreadCount(userId)
      ]);

      const responseData = {
        notifications,
        pagination: {
          limit,
          offset,
          total_unread: unreadCount,
        },
        filters: {
          only_unread: onlyUnread,
          tipo: tipo || null,
        }
      };

      return NotificationsController.successResponse(res, responseData);

    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Marcar notificação como lida
   */
  static async markAsRead(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return NotificationsController.errorResponse(res, 400, 'ID da notificação é obrigatório');
      }

      const success = await NotificationService.markAsRead(id, userId);
      if (!success) {
        return NotificationsController.errorResponse(res, 404, 'Notificação não encontrada');
      }

      return NotificationsController.successResponse(
        res,
        undefined,
        'Notificação marcada como lida'
      );

    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  static async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const updatedCount = await NotificationService.markAllAsRead(userId);

      return NotificationsController.successResponse(
        res,
        { updated_count: updatedCount },
        `${updatedCount} notificações marcadas como lidas`
      );

    } catch (error: any) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Obter contagem de notificações não lidas
   */
  static async getUnreadCount(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const unreadCount = await NotificationService.getUnreadCount(userId);

      return NotificationsController.successResponse(
        res,
        { unread_count: unreadCount }
      );

    } catch (error: any) {
      console.error('Erro ao obter contagem de notificações não lidas:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Deletar notificação
   */
  static async deleteNotification(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return NotificationsController.errorResponse(res, 400, 'ID da notificação é obrigatório');
      }

      const success = await NotificationService.deleteNotification(id, userId);
      if (!success) {
        return NotificationsController.errorResponse(res, 404, 'Notificação não encontrada');
      }

      return NotificationsController.successResponse(
        res,
        undefined,
        'Notificação deletada com sucesso'
      );

    } catch (error: any) {
      console.error('Erro ao deletar notificação:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Processar notificações automáticas
   */
  static async processAutomaticNotifications(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const result = await NotificationService.processAutomaticNotifications(userId);

      return NotificationsController.successResponse(
        res,
        result,
        `${result.total_created} notificações automáticas criadas`
      );

    } catch (error: any) {
      console.error('Erro ao processar notificações automáticas:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Gerar notificação de teste
   */
  static async generateTestNotification(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = NotificationsController.validateAuth(req);
      if (!userId) {
        return NotificationsController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const testNotificationData: NotificationData = {
        idUsuario: userId,
        tipo: 'Sistema',
        titulo: '🧪 Notificação de Teste',
        mensagem: 'Esta é uma notificação de teste para verificar o funcionamento do sistema.',
        dados_extras: {
          test: true,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
        },
      };

      const testNotification = await NotificationService.createNotification(testNotificationData);

      return NotificationsController.successResponse(
        res,
        testNotification,
        'Notificação de teste criada com sucesso'
      );

    } catch (error: any) {
      console.error('Erro ao gerar notificação de teste:', error);
      return NotificationsController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }
}
