import { db } from '../db';
import { notificacoes, tipoNotificacaoEnum } from "../db/schema";
import { eq, and, desc, isNull, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface NotificationData {
  id?: string;
  idUsuario: string;
  tipo?: "sistema" | "alerta" | "promocao" | "suporte";
  titulo: string;
  mensagem: string;
  dados_extras?: any;
  lida?: boolean;
  dataEnvio?: Date; // Alterado para Date
}

export class NotificationService {
  /**
   * Criar uma nova notificação
   */
  static async createNotification(data: NotificationData): Promise<NotificationData> {
    const notification = {
      id: data.id || uuidv4(),
      idUsuario: data.idUsuario,
      tipo: data.tipo || "sistema" as "sistema" | "alerta" | "promocao" | "suporte",
      titulo: data.titulo,
      mensagem: data.mensagem,
      dados_extras: data.dados_extras ? JSON.stringify(data.dados_extras) : null,
      lida: false,
      dataEnvio: data.dataEnvio || new Date(), // Usar new Date() diretamente
    };

    await db.insert(notificacoes).values(notification);
    return {
      ...notification,
      lida: notification.lida
    };
  }

  /**
   * Buscar notificações do usuário
   */
  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      onlyUnread?: boolean;
      tipo?: string;
    } = {}
  ) {
    const { limit = 50, offset = 0, onlyUnread = false, tipo } = options;

    let whereCondition = and(
      eq(notificacoes.idUsuario, userId),
      isNull(notificacoes.deletedAt)
    );

    if (onlyUnread) {
      whereCondition = and(whereCondition, eq(notificacoes.lida, false));
    }

    if (tipo) {
      // Validar que o tipo é um dos valores permitidos do enum
      const validTypes = Object.values(tipoNotificacaoEnum);
      if (validTypes.includes(tipo as any)) {
        whereCondition = and(whereCondition, eq(notificacoes.tipo, tipo as any));
      } else {
        console.warn(`Tipo de notificação inválido fornecido: ${tipo}`);
      }
    }

    const notifications = await db
      .select()
      .from(notificacoes)
      .where(whereCondition)
      .orderBy(desc(notificacoes.dataEnvio))
      .limit(limit)
      .offset(offset);

    return notifications.map(notification => ({
      ...notification,
      dadosExtras: notification.dadosExtras ? JSON.parse(notification.dadosExtras) : null, // Corrigido para dadosExtras
    }));
  }

  /**
   * Marcar notificação como lida
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const result = await db
      .update(notificacoes)
      .set({
        lida: true,
        dataLeitura: new Date(), // Corrigido para dataLeitura
      })
      .where(
        and(
          eq(notificacoes.id, notificationId),
          eq(notificacoes.idUsuario, userId),
          isNull(notificacoes.deletedAt)
        )
      ).returning();

    return result.length > 0;
  }

  /**
   * Marcar todas as notificações como lidas
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await db
      .update(notificacoes)
      .set({
        lida: true,
        dataLeitura: new Date(), // Corrigido para dataLeitura
      })
      .where(
        and(
          eq(notificacoes.idUsuario, userId),
          eq(notificacoes.lida, false),
          isNull(notificacoes.deletedAt)
        )
      ).returning();

    return result.length;
  }

  /**
   * Contar notificações não lidas
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: notificacoes.id })
      .from(notificacoes)
      .where(
        and(
          eq(notificacoes.idUsuario, userId),
          eq(notificacoes.lida, false),
          isNull(notificacoes.deletedAt)
        )
      );

    return result.length;
  }

  /**
   * Deletar notificação
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const result = await db
      .update(notificacoes)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(notificacoes.id, notificationId),
          eq(notificacoes.idUsuario, userId),
          isNull(notificacoes.deletedAt)
        )
      ).returning();

    return result.length > 0;
  }

  /**
   * Limpar notificações antigas (mais de 30 dias)
   */
  static async cleanupOldNotifications(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await db
      .update(notificacoes)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          lte(notificacoes.dataEnvio, thirtyDaysAgo), 
          isNull(notificacoes.deletedAt)
        )
      ).returning();

    return result.length;
  }

  /**
   * Gerar notificações automáticas baseadas em insights
   */
  static async generateInsightNotifications(userId: string, insights: any[]): Promise<number> {
    let createdCount = 0;

    for (const insight of insights) {
      // Verificar se já existe uma notificação similar recente (últimas 24h)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const existingNotifications = await db
        .select()
        .from(notificacoes)
        .where(
          and(
            eq(notificacoes.idUsuario, userId),
            eq(notificacoes.tipo, 'sistema'),
            gte(notificacoes.dataEnvio, yesterday), 
            isNull(notificacoes.deletedAt)
          )
        );

      // Evitar duplicatas verificando o título
      const isDuplicate = existingNotifications.some(
        notification => notification.titulo === insight.titulo
      );

      if (!isDuplicate) {
        await this.createNotification({
          idUsuario: userId,
          tipo: 'sistema',
          titulo: insight.titulo,
          mensagem: insight.descricao,
          dados_extras: {
            insight_tipo: insight.tipo,
            impacto: insight.impacto,
            detalhes: insight.detalhes,
          },
        });
        createdCount++;
      }
    }

    return createdCount;
  }

  /**
   * Gerar notificações automáticas baseadas em recomendações
   */
  static async generateRecommendationNotifications(userId: string, recommendations: any[]): Promise<number> {
    let createdCount = 0;

    // Filtrar apenas recomendações de alta prioridade
    const highPriorityRecommendations = recommendations.filter(
      rec => rec.prioridade === 'alta'
    );

    for (const recommendation of highPriorityRecommendations) {
      // Verificar se já existe uma notificação similar recente (últimas 48h)
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      
      const existingNotifications = await db
        .select()
        .from(notificacoes)
        .where(
          and(
            eq(notificacoes.idUsuario, userId),
            eq(notificacoes.tipo, 'alerta'),
            gte(notificacoes.dataEnvio, twoDaysAgo), 
            isNull(notificacoes.deletedAt)
          )
        );

      // Evitar duplicatas verificando o título
      const isDuplicate = existingNotifications.some(
        notification => notification.titulo === recommendation.titulo
      );

      if (!isDuplicate) {
        await this.createNotification({
          idUsuario: userId,
          tipo: 'alerta',
          titulo: `🎯 ${recommendation.titulo}`,
          mensagem: recommendation.descricao,
          dados_extras: {
            categoria: recommendation.categoria,
            prioridade: recommendation.prioridade,
            acoes: recommendation.acoes,
          },
        });
        createdCount++;
      }
    }

    return createdCount;
  }

  /**
   * Gerar notificações de metas e objetivos
   */
  static async generateGoalNotifications(userId: string, goalData: any): Promise<void> {
    const { meta_atingida, progresso_percentual, meta_tipo, valor_atual, valor_meta } = goalData;

    if (meta_atingida) {
      await this.createNotification({
        idUsuario: userId,
        tipo: 'sistema',
        titulo: '🎉 Meta Atingida!',
        mensagem: `Parabéns! Você atingiu sua meta de ${meta_tipo}.`,
        dados_extras: {
          meta_tipo,
          valor_atual,
          valor_meta,
          progresso_percentual: 100,
        },
      });
    } else if (progresso_percentual >= 90) {
      await this.createNotification({
        idUsuario: userId,
        tipo: 'alerta',
        titulo: '🔥 Quase lá!',
        mensagem: `Você está a ${(100 - progresso_percentual).toFixed(1)}% de atingir sua meta de ${meta_tipo}.`,
        dados_extras: {
          meta_tipo,
          valor_atual,
          valor_meta,
          progresso_percentual,
        },
      });
    } else if (progresso_percentual >= 75) {
      await this.createNotification({
        idUsuario: userId,
        tipo: 'alerta',
        titulo: '💪 Bom progresso!',
        mensagem: `Você já completou ${progresso_percentual.toFixed(1)}% da sua meta de ${meta_tipo}.`,
        dados_extras: {
          meta_tipo,
          valor_atual,
          valor_meta,
          progresso_percentual,
        },
      });
    }
  }

  /**
   * Gerar notificações de alertas operacionais
   */
  static async generateOperationalAlerts(userId: string, alertData: any): Promise<void> {
    const { tipo_alerta, veiculo, dados } = alertData;

    switch (tipo_alerta) {
      case 'consumo_alto':
        await this.createNotification({
          idUsuario: userId,
          tipo: 'alerta',
          titulo: '⚠️ Consumo Elevado',
          mensagem: `O veículo ${veiculo.marca} ${veiculo.modelo} está com consumo acima do normal.`,
          dados_extras: {
            veiculo_id: veiculo.id,
            consumo_atual: dados.consumo_atual,
            consumo_medio: dados.consumo_medio,
            diferenca_percentual: dados.diferenca_percentual,
          },
        });
        break;

      case 'manutencao_preventiva':
        await this.createNotification({
          idUsuario: userId,
          tipo: 'sistema',
          titulo: '🔧 Manutenção Preventiva',
          mensagem: `O veículo ${veiculo.marca} ${veiculo.modelo} pode precisar de manutenção em breve.`,
          dados_extras: {
            veiculo_id: veiculo.id,
            kmAtual: dados.kmAtual,
            km_ultima_manutencao: dados.km_ultima_manutencao,
            km_recomendado: dados.km_recomendado,
          },
        });
        break;

      case 'eficiencia_baixa':
        await this.createNotification({
          idUsuario: userId,
          tipo: 'alerta',
          titulo: '📉 Eficiência Baixa',
          mensagem: `A eficiência do veículo ${veiculo.marca} ${veiculo.modelo} está abaixo do esperado.`,
          dados_extras: {
            veiculo_id: veiculo.id,
            ganho_por_kmAtual: dados.ganho_por_kmAtual,
            ganho_por_km_medio: dados.ganho_por_km_medio,
            diferenca_percentual: dados.diferenca_percentual,
          },
        });
        break;

      case 'meta_diaria_risco':
        await this.createNotification({
          idUsuario: userId,
          tipo: 'alerta',
          titulo: '⏰ Meta Diária em Risco',
          mensagem: 'Você pode não atingir sua meta diária se continuar no ritmo atual.',
          dados_extras: {
            meta_diaria: dados.meta_diaria,
            progresso_atual: dados.progresso_atual,
            tempo_restante_horas: dados.tempo_restante_horas,
            ritmo_necessario: dados.ritmo_necessario,
          },
        });
        break;
    }
  }

  /**
   * Processar notificações automáticas para um usuário
   */
  static async processAutomaticNotifications(userId: string): Promise<{
    insights_created: number;
    recommendations_created: number;
    total_created: number;
  }> {
    try {
      // Aqui você integraria com o serviço de insights para obter dados atualizados
      // Por enquanto, vamos simular alguns dados básicos
      
      const mockInsights = [
        {
          tipo: 'eficiencia',
          titulo: 'Oportunidade de Melhoria',
          descricao: 'Sua eficiência operacional pode ser otimizada',
          detalhes: 'Considere ajustar seus horários de trabalho',
          impacto: 'positivo',
        }
      ];

      const mockRecommendations = [
        {
          categoria: 'eficiencia',
          prioridade: 'alta',
          titulo: 'Otimizar Horários',
          descricao: 'Trabalhe mais nos horários de maior demanda',
          acoes: ['Focar nas manhãs', 'Evitar horários de baixa demanda'],
        }
      ];

      const insightsCreated = await this.generateInsightNotifications(userId, mockInsights);
      const recommendationsCreated = await this.generateRecommendationNotifications(userId, mockRecommendations);

      return {
        insights_created: insightsCreated,
        recommendations_created: recommendationsCreated,
        total_created: insightsCreated + recommendationsCreated,
      };

    } catch (error) {
      console.error('Erro ao processar notificações automáticas:', error);
      return {
        insights_created: 0,
        recommendations_created: 0,
        total_created: 0,
      };
    }
  }
}


