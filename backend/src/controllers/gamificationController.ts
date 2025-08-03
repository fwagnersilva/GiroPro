import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { 
  conquistas, 
  usuarioConquistas, 
  nivelUsuario, 
  usuarios, 
  jornadas, 
  abastecimentos, 
  despesas, 
  metas 
} from '../db/schema_original';
import { eq, and, isNull, desc, asc, gte, lte, sql, sum, count } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';

// Schemas de validação
const unlockAchievementSchema = z.object({
  id_conquista: z.string().uuid('ID da conquista deve ser um UUID válido'),
  valor_atingido: z.number().optional()
});

const gamificationQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  tipo_conquista: z.enum(['Faturamento', 'Quilometragem', 'Jornadas', 'Eficiencia', 'Consistencia', 'Metas', 'Especial']).optional(),
  raridade: z.enum(['Comum', 'Raro', 'Epico', 'Lendario']).optional(),
  desbloqueada: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
});

export class GamificationController {
  /**
   * Listar todas as conquistas disponíveis com status de desbloqueio do usuário
   */
  static async getAllAchievements(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const validation = gamificationQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: { 
            message: 'Parâmetros de consulta inválidos',
            details: validation.error.errors
          }
        });
      }

      const { page, limit, tipo_conquista, raridade, desbloqueada } = validation.data;
      const offset = (page - 1) * limit;

      // Query base para conquistas
      let whereConditions = [eq(conquistas.ativa, true)];
      
      if (tipo_conquista) {
        whereConditions.push(eq(conquistas.tipo_conquista, tipo_conquista));
      }
      
      if (raridade) {
        whereConditions.push(eq(conquistas.raridade, raridade));
      }

      // Buscar conquistas com informações de desbloqueio do usuário
      const conquistasResult = await db
        .select({
          id: conquistas.id,
          nome: conquistas.nome,
          descricao: conquistas.descricao,
          tipo_conquista: conquistas.tipo_conquista,
          raridade: conquistas.raridade,
          icone: conquistas.icone,
          cor: conquistas.cor,
          criterio_valor: conquistas.criterio_valor,
          criterio_descricao: conquistas.criterio_descricao,
          pontos_recompensa: conquistas.pontos_recompensa,
          ordem_exibicao: conquistas.ordem_exibicao,
          desbloqueada: sql<boolean>`CASE WHEN ${usuarioConquistas.id} IS NOT NULL THEN true ELSE false END`,
          data_desbloqueio: usuarioConquistas.data_desbloqueio,
          valor_atingido: usuarioConquistas.valor_atingido
        })
        .from(conquistas)
        .leftJoin(
          usuarioConquistas, 
          and(
            eq(usuarioConquistas.id_conquista, conquistas.id),
            eq(usuarioConquistas.id_usuario, req.user?.id)
          )
        )
        .where(and(...whereConditions))
        .orderBy(asc(conquistas.ordem_exibicao), asc(conquistas.nome))
        .limit(limit)
        .offset(offset);

      const totalCountResult = await db.select({ count: count() }).from(conquistas).where(and(...whereConditions));

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return res.json({
        success: true,
        data: {
          conquistas: conquistasResult,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro interno do servidor' }
      });
    }
  }

  /**
   * Obter conquistas desbloqueadas pelo usuário
   */
  static async getUserAchievements(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const validation = gamificationQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: { 
            message: 'Parâmetros de consulta inválidos',
            details: validation.error.errors
          }
        });
      }

      const { page, limit, tipo_conquista, raridade } = validation.data;
      const offset = (page - 1) * limit;

      let whereConditions = [eq(usuarioConquistas.id_usuario, req.user?.id)];
      
      if (tipo_conquista) {
        whereConditions.push(eq(conquistas.tipo_conquista, tipo_conquista));
      }
      
      if (raridade) {
        whereConditions.push(eq(conquistas.raridade, raridade));
      }

      const [conquistasResult, totalCountResult] = await Promise.all([
        db
          .select({
            id: usuarioConquistas.id,
            conquista: {
              id: conquistas.id,
              nome: conquistas.nome,
              descricao: conquistas.descricao,
              tipo_conquista: conquistas.tipo_conquista,
              raridade: conquistas.raridade,
              icone: conquistas.icone,
              cor: conquistas.cor,
              pontos_recompensa: conquistas.pontos_recompensa
            },
            data_desbloqueio: usuarioConquistas.data_desbloqueio,
            valor_atingido: usuarioConquistas.valor_atingido
          })
          .from(usuarioConquistas)
          .innerJoin(conquistas, eq(conquistas.id, usuarioConquistas.id_conquista))
          .where(and(...whereConditions))
          .orderBy(desc(usuarioConquistas.data_desbloqueio))
          .limit(limit)
          .offset(offset),
        
        db
          .select({ count: count() })
          .from(usuarioConquistas)
          .innerJoin(conquistas, eq(conquistas.id, usuarioConquistas.id_conquista))
          .where(and(...whereConditions))
      ]);

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return res.json({
        success: true,
        data: {
          conquistas: conquistasResult,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Erro ao buscar conquistas do usuário:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro interno do servidor' }
      });
    }
  }

  /**
   * Obter estatísticas de gamificação do usuário
   */
  static async getUserStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      // Buscar dados do usuário
      const [usuario] = await db
        .select({
          pontos_total: usuarios.pontos_total,
          nivel_usuario: usuarios.nivel_usuario,
          conquistas_desbloqueadas: usuarios.conquistas_desbloqueadas
        })
        .from(usuarios)
        .where(eq(usuarios.id, req.user?.id));

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: { message: 'Usuário não encontrado' }
        });
      }

      // Buscar informações do nível atual
      const [nivelAtual] = await db
        .select()
        .from(nivelUsuario)
        .where(eq(nivelUsuario.nivel, usuario.nivel_usuario || 'Iniciante'));

      // Buscar próximo nível
      const [proximoNivel] = await db
        .select()
        .from(nivelUsuario)
        .where(gte(nivelUsuario.pontos_necessarios, usuario.pontos_total || 0))
        .orderBy(asc(nivelUsuario.pontos_necessarios))
        .limit(1);

      // Estatísticas de conquistas por tipo
      const conquistasPorTipo = await db
        .select({
          tipo_conquista: conquistas.tipo_conquista,
          total: count(),
          desbloqueadas: sql<number>`COUNT(CASE WHEN ${usuarioConquistas.id} IS NOT NULL THEN 1 END)`
        })
        .from(conquistas)
        .leftJoin(
          usuarioConquistas,
          and(
            eq(usuarioConquistas.id_conquista, conquistas.id),
            eq(usuarioConquistas.id_usuario, req.user?.id)
          )
        )
        .where(eq(conquistas.ativa, true))
        .groupBy(conquistas.tipo_conquista);

      // Conquistas recentes (últimas 5)
      const conquistasRecentes = await db
        .select({
          conquista: {
            nome: conquistas.nome,
            icone: conquistas.icone,
            cor: conquistas.cor,
            pontos_recompensa: conquistas.pontos_recompensa
          },
          data_desbloqueio: usuarioConquistas.data_desbloqueio
        })
        .from(usuarioConquistas)
        .innerJoin(conquistas, eq(conquistas.id, usuarioConquistas.id_conquista))
        .where(eq(usuarioConquistas.id_usuario, req.user?.id))
        .orderBy(desc(usuarioConquistas.data_desbloqueio))
        .limit(5);

      // Calcular progresso para o próximo nível
      const pontosParaProximoNivel = proximoNivel 
        ? proximoNivel.pontos_necessarios - (usuario.pontos_total || 0)
        : 0;

      const progressoNivel = proximoNivel && nivelAtual
        ? Math.round(((usuario.pontos_total || 0) - nivelAtual.pontos_necessarios) / 
          (proximoNivel.pontos_necessarios - nivelAtual.pontos_necessarios) * 100)
        : 100;

      return res.json({
        success: true,
        data: {
          pontos_total: usuario.pontos_total || 0,
          nivel_atual: nivelAtual,
          proximo_nivel: proximoNivel,
          pontos_para_proximo_nivel: pontosParaProximoNivel,
          progresso_nivel: Math.max(0, Math.min(100, progressoNivel)),
          total_conquistas_desbloqueadas: usuario.conquistas_desbloqueadas || 0,
          conquistas_por_tipo: conquistasPorTipo,
          conquistas_recentes: conquistasRecentes
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas de gamificação:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro interno do servidor' }
      });
    }
  }

  /**
   * Verificar e desbloquear conquistas automaticamente
   */
  static async checkAndUnlockAchievements(userId: string) {
    try {
      // Buscar todas as conquistas ativas que o usuário ainda não desbloqueou
      const conquistasDisponiveis = await db
        .select()
        .from(conquistas)
        .leftJoin(
          usuarioConquistas,
          and(
            eq(usuarioConquistas.id_conquista, conquistas.id),
            eq(usuarioConquistas.id_usuario, userId)
          )
        )
        .where(
          and(
            eq(conquistas.ativa, true),
            sql`${usuarioConquistas.id} IS NULL`
          )
        );

      const conquistasDesbloqueadas = [];

      for (const { conquistas: conquista } of conquistasDisponiveis) {
        const desbloqueou = await GamificationController.checkAchievementCriteria(userId, conquista);
        
        if (desbloqueou.unlocked) {
          // Desbloquear conquista
          await db.insert(usuarioConquistas).values({
            id_usuario: userId,
            id_conquista: conquista.id,
            valor_atingido: desbloqueou.value,
            data_desbloqueio: new Date()
          });

          // Atualizar pontos do usuário
          await db
            .update(usuarios)
            .set({
              pontos_total: sql`${usuarios.pontos_total} + ${conquista.pontos_recompensa}`,
              conquistas_desbloqueadas: sql`${usuarios.conquistas_desbloqueadas} + 1`,
            })
            .where(eq(usuarios.id, userId));

          conquistasDesbloqueadas.push({
            conquista,
            valor_atingido: desbloqueou.value
          });
        }
      }

      // Verificar se o usuário subiu de nível
      if (conquistasDesbloqueadas.length > 0) {
        await GamificationController.checkLevelUp(userId);
      }

      return conquistasDesbloqueadas;

    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
      return [];
    }
  }

  /**
   * Verificar critérios de uma conquista específica
   */
  private static async checkAchievementCriteria(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    try {
      switch (conquista.tipo_conquista) {
        case 'Faturamento':
          return await GamificationController.checkFaturamentoAchievement(userId, conquista);
        
        case 'Quilometragem':
          return await GamificationController.checkQuilometragemAchievement(userId, conquista);
        
        case 'Jornadas':
          return await GamificationController.checkJornadasAchievement(userId, conquista);
        
        case 'Eficiencia':
          return await GamificationController.checkEficienciaAchievement(userId, conquista);
        
        case 'Consistencia':
          return await GamificationController.checkConsistenciaAchievement(userId, conquista);
        
        case 'Metas':
          return await GamificationController.checkMetasAchievement(userId, conquista);
        
        default:
          return { unlocked: false };
      }
    } catch (error) {
      console.error(`Erro ao verificar critério da conquista ${conquista.id}:`, error);
      return { unlocked: false };
    }
  }

  /**
   * Verificar conquistas de faturamento
   */
  private static async checkFaturamentoAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    const [resultado] = await db
      .select({
        total_faturamento: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.id_usuario, userId),
          isNull(jornadas.deleted_at)
        )
      );

    const faturamentoTotal = resultado?.total_faturamento || 0;
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: faturamentoTotal >= criterio,
      value: faturamentoTotal
    };
  }

  /**
   * Verificar conquistas de quilometragem
   */
  private static async checkQuilometragemAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    const [resultado] = await db
      .select({
        total_km: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.id_usuario, userId),
          isNull(jornadas.deleted_at)
        )
      );

    const kmTotal = resultado?.total_km || 0;
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: kmTotal >= criterio,
      value: kmTotal
    };
  }

  /**
   * Verificar conquistas de jornadas
   */
  private static async checkJornadasAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    const [resultado] = await db
      .select({
        total_jornadas: count()
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.id_usuario, userId),
          isNull(jornadas.deleted_at)
        )
      );

    const totalJornadas = resultado?.total_jornadas || 0;
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: totalJornadas >= criterio,
      value: totalJornadas
    };
  }

  /**
   * Verificar conquistas de eficiência
   */
  private static async checkEficienciaAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    // Exemplo: Eficiência baseada em ganho por km
    const [resultado] = await db
      .select({
        total_faturamento: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`,
        total_km: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.id_usuario, userId),
          isNull(jornadas.deleted_at)
        )
      );

    const faturamento = resultado?.total_faturamento || 0;
    const km = resultado?.total_km || 0;
    const eficiencia = km > 0 ? Math.round((faturamento / km) * 100) : 0; // Centavos por km
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: eficiencia >= criterio,
      value: eficiencia
    };
  }

  /**
   * Verificar conquistas de consistência
   */
  private static async checkConsistenciaAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    // Exemplo: Dias consecutivos com jornadas
    const jornadasPorDia = await db
      .select({
        data: sql<string>`DATE(${jornadas.data_inicio})`,
        total: count()
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.id_usuario, userId),
          isNull(jornadas.deleted_at),
          gte(jornadas.data_inicio, sql`NOW() - INTERVAL '30 days'`)
        )
      )
      .groupBy(sql`DATE(${jornadas.data_inicio})`)
      .orderBy(sql`DATE(${jornadas.data_inicio})`);

    // Calcular sequência máxima de dias consecutivos
    let maxSequencia = 0;
    let sequenciaAtual = 0;
    let dataAnterior: Date | null = null;

    for (const dia of jornadasPorDia) {
      const dataAtual = new Date(dia.data);
      
      if (dataAnterior) {
        const diffDias = Math.floor((dataAtual.getTime() - dataAnterior.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDias === 1) {
          sequenciaAtual++;
        } else {
          maxSequencia = Math.max(maxSequencia, sequenciaAtual);
          sequenciaAtual = 1;
        }
      } else {
        sequenciaAtual = 1;
      }
      
      dataAnterior = dataAtual;
    }
    
    maxSequencia = Math.max(maxSequencia, sequenciaAtual);
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: maxSequencia >= criterio,
      value: maxSequencia
    };
  }

  /**
   * Verificar conquistas de metas
   */
  private static async checkMetasAchievement(userId: string, conquista: any): Promise<{ unlocked: boolean; value?: number }> {
    const [resultado] = await db
      .select({
        metas_concluidas: count()
      })
      .from(metas)
      .where(
        and(
          eq(metas.id_usuario, userId),
          eq(metas.status, 'Concluida'),
          isNull(metas.deleted_at)
        )
      );

    const metasConcluidas = resultado?.metas_concluidas || 0;
    const criterio = conquista.criterio_valor || 0;

    return {
      unlocked: metasConcluidas >= criterio,
      value: metasConcluidas
    };
  }

  /**
   * Verificar se o usuário subiu de nível
   */
  private static async checkLevelUp(userId: string) {
    try {
      // Buscar pontos atuais do usuário
      const [usuario] = await db
        .select({
          pontos_total: usuarios.pontos_total,
          nivel_usuario: usuarios.nivel_usuario
        })
        .from(usuarios)
        .where(eq(usuarios.id, userId));

      if (!usuario) return;

      // Buscar o nível adequado para os pontos atuais
      const [novoNivel] = await db
        .select()
        .from(nivelUsuario)
        .where(lte(nivelUsuario.pontos_necessarios, usuario.pontos_total || 0))
        .orderBy(desc(nivelUsuario.pontos_necessarios))
        .limit(1);

      // Se encontrou um nível diferente do atual, atualizar
      if (novoNivel && novoNivel.nivel !== usuario.nivel_usuario) {
        await db
          .update(usuarios)
          .set({
            nivel_usuario: novoNivel.nivel,
          })
          .where(eq(usuarios.id, userId));
      }

    } catch (error) {
      console.error('Erro ao verificar level up:', error);
    }
  }

  /**
   * Desbloquear conquista manualmente (para testes ou casos especiais)
   */
  static async unlockAchievement(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const validation = unlockAchievementSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: { 
            message: 'Dados inválidos',
            details: validation.error.errors
          }
        });
      }

      const { id_conquista, valor_atingido } = validation.data;

      // Verificar se a conquista existe
      const [conquista] = await db
        .select()
        .from(conquistas)
        .where(eq(conquistas.id, id_conquista));

      if (!conquista) {
        return res.status(404).json({
          success: false,
          error: { message: 'Conquista não encontrada' }
        });
      }

      // Verificar se já foi desbloqueada
      const [conquistaExistente] = await db
        .select()
        .from(usuarioConquistas)
        .where(
          and(
            eq(usuarioConquistas.id_usuario, req.user?.id),
            eq(usuarioConquistas.id_conquista, id_conquista)
          )
        );

      if (conquistaExistente) {
        return res.status(400).json({
          success: false,
          error: { message: 'Conquista já foi desbloqueada' }
        });
      }

      // Desbloquear conquista
      await db.insert(usuarioConquistas).values({
        id_usuario: req.user?.id,
        id_conquista,
        valor_atingido,
        data_desbloqueio: new Date()
      });

      // Atualizar pontos do usuário
      await db
        .update(usuarios)
        .set({
          pontos_total: sql`${usuarios.pontos_total} + ${conquista.pontos_recompensa}`,
          conquistas_desbloqueadas: sql`${usuarios.conquistas_desbloqueadas} + 1`,
        })
        .where(eq(usuarios.id, req.user?.id));

      // Verificar level up
      await GamificationController.checkLevelUp(req.user?.id);

      return res.status(201).json({
        success: true,
        data: {
          message: 'Conquista desbloqueada com sucesso!',
          conquista: {
            nome: conquista.nome,
            pontos_recompensa: conquista.pontos_recompensa
          }
        }
      });

    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro interno do servidor' }
      });
    }
  }
}

