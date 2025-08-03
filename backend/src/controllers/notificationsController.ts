import { Request, Response } from 'express';
import { NotificationService, NotificationData } from '../services/notificationService';
import { z } from 'zod';

// Schema de validação para criação de notificação
const createNotificationSchema = z.object({
  tipo: z.string().default('Sistema'),
  titulo: z.string().min(1).max(100),
  mensagem: z.string().min(1).max(500),
  dados_extras: z.any().optional(),
});

// Schema de validação para busca de notificações
const getNotificationsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  onlyUnread: z.boolean().default(false),
  tipo: z.string().optional(),
});

export class NotificationsController {
  /**
   * Criar uma nova notificação
   */
  static async createNotification(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = createNotificationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Dados inválidos', details: validation.error.errors } 
        });
      }

      const notificationData: NotificationData = {
        id_usuario: req.user?.id!,
        tipo: validation.data.tipo,
        titulo: validation.data.titulo,
        mensagem: validation.data.mensagem,
        dados_extras: validation.data.dados_extras,
      };

      const notification = await NotificationService.createNotification(notificationData);

      return res.status(201).json({
        success: true,
        data: notification,
        message: 'Notificação criada com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar notificação:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Buscar notificações do usuário
   */
  static async getNotifications(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = getNotificationsSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { limit, offset, onlyUnread, tipo } = validation.data;

      const notifications = await NotificationService.getUserNotifications(req.user?.id, {
        limit: Number(limit),
        offset: Number(offset),
        onlyUnread: Boolean(onlyUnread),
        tipo,
      });

      const unreadCount = await NotificationService.getUnreadCount(req.user?.id);

      return res.json({
        success: true,
        data: {
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
        }
      });

    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Marcar notificação como lida
   */
  static async markAsRead(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'ID da notificação é obrigatório' } 
        });
      }

      const success = await NotificationService.markAsRead(id, req.user?.id);

      if (!success) {
        return res.status(404).json({ 
          success: false, 
          error: { message: 'Notificação não encontrada' } 
        });
      }

      return res.json({
        success: true,
        message: 'Notificação marcada como lida'
      });

    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  static async markAllAsRead(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const updatedCount = await NotificationService.markAllAsRead(req.user?.id);

      return res.json({
        success: true,
        data: {
          updated_count: updatedCount,
        },
        message: `${updatedCount} notificações marcadas como lidas`
      });

    } catch (error: any) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter contagem de notificações não lidas
   */
  static async getUnreadCount(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const unreadCount = await NotificationService.getUnreadCount(req.user?.id);

      return res.json({
        success: true,
        data: {
          unread_count: unreadCount,
        }
      });

    } catch (error: any) {
      console.error('Erro ao obter contagem de notificações não lidas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Deletar notificação
   */
  static async deleteNotification(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'ID da notificação é obrigatório' } 
        });
      }

      const success = await NotificationService.deleteNotification(id, req.user?.id);

      if (!success) {
        return res.status(404).json({ 
          success: false, 
          error: { message: 'Notificação não encontrada' } 
        });
      }

      return res.json({
        success: true,
        message: 'Notificação deletada com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar notificação:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Processar notificações automáticas
   */
  static async processAutomaticNotifications(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const result = await NotificationService.processAutomaticNotifications(req.user?.id);

      return res.json({
        success: true,
        data: result,
        message: `${result.total_created} notificações automáticas criadas`
      });

    } catch (error: any) {
      console.error('Erro ao processar notificações automáticas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Gerar notificação de teste
   */
  static async generateTestNotification(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const testNotification = await NotificationService.createNotification({
        id_usuario: req.user?.id,
        tipo: 'Sistema', // Alterado para um tipo válido do enum
        titulo: '🧪 Notificação de Teste',
        mensagem: 'Esta é uma notificação de teste para verificar o funcionamento do sistema.',
        dados_extras: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      });

      return res.json({
        success: true,
        data: testNotification,
        message: 'Notificação de teste criada com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao gerar notificação de teste:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }
}


