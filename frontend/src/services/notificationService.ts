import api from './api';
import { ApiResponse } from '../types';

// Tipos para notificações
export interface Notification {
  id: string;
  id_usuario: string;
  tipo: 'info' | 'warning' | 'success' | 'error' | 'insight' | 'recommendation';
  titulo: string;
  mensagem: string;
  dados_extras?: any;
  lida: boolean;
  data_criacao: string;
  data_leitura?: string | null;
}

export interface CreateNotificationData {
  tipo: 'info' | 'warning' | 'success' | 'error' | 'insight' | 'recommendation';
  titulo: string;
  mensagem: string;
  dados_extras?: any;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    limit: number;
    offset: number;
    total_unread: number;
  };
  filters: {
    only_unread: boolean;
    tipo: string | null;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface ProcessAutomaticResponse {
  insights_created: number;
  recommendations_created: number;
  total_created: number;
}

// Serviços de notificações
export const notificationService = {
  /**
   * Criar uma nova notificação
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await api.post<ApiResponse<Notification>>('/notifications', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao criar notificação');
  },

  /**
   * Buscar notificações do usuário
   */
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
    onlyUnread?: boolean;
    tipo?: 'info' | 'warning' | 'success' | 'error' | 'insight' | 'recommendation';
  }): Promise<NotificationsResponse> {
    const response = await api.get<ApiResponse<NotificationsResponse>>('/notifications', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar notificações');
  },

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await api.put<ApiResponse<void>>(`/notifications/${notificationId}/read`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao marcar notificação como lida');
    }
  },

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(): Promise<{ updated_count: number }> {
    const response = await api.put<ApiResponse<{ updated_count: number }>>('/notifications/read-all');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao marcar todas as notificações como lidas');
  },

  /**
   * Obter contagem de notificações não lidas
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter contagem de notificações não lidas');
  },

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/notifications/${notificationId}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao deletar notificação');
    }
  },

  /**
   * Processar notificações automáticas
   */
  async processAutomaticNotifications(): Promise<ProcessAutomaticResponse> {
    const response = await api.post<ApiResponse<ProcessAutomaticResponse>>('/notifications/process-automatic');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao processar notificações automáticas');
  },

  /**
   * Gerar notificação de teste
   */
  async generateTestNotification(): Promise<Notification> {
    const response = await api.post<ApiResponse<Notification>>('/notifications/test');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar notificação de teste');
  },
};

