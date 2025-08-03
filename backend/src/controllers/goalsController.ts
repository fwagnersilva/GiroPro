import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { metas, progressoMetas, veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, isNull, desc, asc, gte, lte, sql, sum, count } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Schemas de validação
const createGoalSchema = z.object({
  id_veiculo: z.string().uuid().optional(),
  titulo: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  descricao: z.string().optional(),
  tipo_meta: z.enum(['Faturamento', 'Quilometragem', 'Jornadas', 'Economia', 'Lucro'], {
    errorMap: () => ({ message: 'Tipo de meta inválido' })
  }),
  periodo: z.enum(['Semanal', 'Mensal', 'Trimestral', 'Anual'], {
    errorMap: () => ({ message: 'Período inválido' })
  }),
  valor_objetivo: z.number().positive('Valor objetivo deve ser maior que zero'),
  data_inicio: z.string().datetime('Data de início deve estar no formato ISO 8601'),
  data_fim: z.string().datetime('Data de fim deve estar no formato ISO 8601')
});

const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(['Ativa', 'Pausada', 'Concluida', 'Expirada']).optional()
});

const goalsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  id_veiculo: z.string().uuid().optional(),
  tipo_meta: z.enum(['Faturamento', 'Quilometragem', 'Jornadas', 'Economia', 'Lucro']).optional(),
  status: z.enum(['Ativa', 'Pausada', 'Concluida', 'Expirada']).optional(),
  periodo: z.enum(['Semanal', 'Mensal', 'Trimestral', 'Anual']).optional(),
  sort_by: z.enum(['data_inicio', 'data_fim', 'percentual_concluido', 'valor_objetivo']).optional().default('data_inicio'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
});

export class GoalsController {
  /**
   * Listar metas do usuário com paginação e filtros
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const queryValidation = goalsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Parâmetros de consulta inválidos',
            details: queryValidation.error.errors
          }
        });
      }

      const {
        page,
        limit,
        id_veiculo,
        tipo_meta,
        status,
        periodo,
        sort_by,
        sort_order
      } = queryValidation.data;

      // Construir condições de filtro
      let whereConditions = and(
        eq(metas.id_usuario, req.user?.id),
        isNull(metas.deleted_at)
      );

      if (id_veiculo) {
        whereConditions = and(whereConditions, eq(metas.id_veiculo, id_veiculo));
      }

      if (tipo_meta) {
        whereConditions = and(whereConditions, eq(metas.tipo_meta, tipo_meta));
      }

      if (status) {
        whereConditions = and(whereConditions, eq(metas.status, status));
      }

      if (periodo) {
        whereConditions = and(whereConditions, eq(metas.periodo, periodo));
      }

      // Calcular offset para paginação
      const offset = (page - 1) * limit;

      // Definir ordenação
      const orderBy = sort_order === 'asc' 
        ? asc(metas[sort_by])
        : desc(metas[sort_by]);

      // Buscar metas com informações do veículo (se associado)
      const goals = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          descricao: metas.descricao,
          tipo_meta: metas.tipo_meta,
          periodo: metas.periodo,
          valor_objetivo: metas.valor_objetivo,
          data_inicio: metas.data_inicio,
          data_fim: metas.data_fim,
          status: metas.status,
          valor_atual: metas.valor_atual,
          percentual_concluido: metas.percentual_concluido,
          data_conclusao: metas.data_conclusao,
          created_at: metas.created_at,
          updated_at: metas.updated_at,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(whereConditions)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Contar total de registros para paginação
      const [totalResult] = await db
        .select({ count: count() })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(whereConditions);

      const total = totalResult.count;
      const totalPages = Math.ceil(total / limit);

      // Atualizar progresso das metas ativas antes de retornar
      const metasAtivas = goals.filter(meta => meta.status === 'Ativa');
      for (const meta of metasAtivas) {
        await GoalsController.updateGoalProgress(meta.id, req.user?.id);
      }

      // Buscar metas atualizadas
      const updatedGoals = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          descricao: metas.descricao,
          tipo_meta: metas.tipo_meta,
          periodo: metas.periodo,
          valor_objetivo: metas.valor_objetivo,
          data_inicio: metas.data_inicio,
          data_fim: metas.data_fim,
          status: metas.status,
          valor_atual: metas.valor_atual,
          percentual_concluido: metas.percentual_concluido,
          data_conclusao: metas.data_conclusao,
          created_at: metas.created_at,
          updated_at: metas.updated_at,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(whereConditions)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return res.json({
        success: true,
        data: {
          goals: updatedGoals.map(goal => ({
            ...goal,
            valor_objetivo_formatado: GoalsController.formatGoalValue(goal.tipo_meta, goal.valor_objetivo),
            valor_atual_formatado: GoalsController.formatGoalValue(goal.tipo_meta, goal.valor_atual),
            dias_restantes: GoalsController.calculateDaysRemaining(goal.data_fim),
            tempo_decorrido: GoalsController.calculateElapsedTime(goal.data_inicio, goal.data_fim)
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao buscar metas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Criar nova meta
   */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const validationResult = createGoalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Dados de meta inválidos',
            details: validationResult.error.errors
          }
        });
      }

      const goalData = validationResult.data;

      // Verificar se o veículo pertence ao usuário (se especificado)
      if (goalData.id_veiculo) {
        const [vehicle] = await db
          .select()
          .from(veiculos)
          .where(and(
            eq(veiculos.id, goalData.id_veiculo),
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at)
          ))
          .limit(1);

        if (!vehicle) {
          return res.status(404).json({
            success: false,
            error: { message: 'Veículo não encontrado ou não pertence ao usuário' }
          });
        }
      }

      // Validar datas
      const dataInicio = new Date(goalData.data_inicio);
      const dataFim = new Date(goalData.data_fim);

      if (dataFim <= dataInicio) {
        return res.status(400).json({
          success: false,
          error: { message: 'Data de fim deve ser posterior à data de início' }
        });
      }

      // Converter valor objetivo baseado no tipo de meta
      const valorObjetivo = GoalsController.convertGoalValue(goalData.tipo_meta, goalData.valor_objetivo);

      // Criar meta
      const [newGoal] = await db
        .insert(metas)
        .values({
          id_usuario: req.user?.id!,
          id_veiculo: goalData.id_veiculo || null,
          titulo: goalData.titulo,
          descricao: goalData.descricao,
          tipo_meta: goalData.tipo_meta,
          periodo: goalData.periodo,
          valor_objetivo: valorObjetivo,
          valor_atual: 0,
          percentual_concluido: 0,
          data_inicio: dataInicio,
          data_fim: dataFim,
          data_conclusao: null,
          status: 'Ativa',
          data_criacao: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .returning();

      // Calcular progresso inicial
      await GoalsController.updateGoalProgress(newGoal.id, req.user?.id);

      // Buscar meta criada com informações do veículo
      const [goalWithVehicle] = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          descricao: metas.descricao,
          tipo_meta: metas.tipo_meta,
          periodo: metas.periodo,
          valor_objetivo: metas.valor_objetivo,
          data_inicio: metas.data_inicio,
          data_fim: metas.data_fim,
          status: metas.status,
          valor_atual: metas.valor_atual,
          percentual_concluido: metas.percentual_concluido,
          created_at: metas.created_at,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(eq(metas.id, newGoal.id))
        .limit(1);

      return res.status(201).json({
        success: true,
        message: 'Meta criada com sucesso',
        data: {
          ...goalWithVehicle,
          valor_objetivo_formatado: GoalsController.formatGoalValue(goalWithVehicle.tipo_meta, goalWithVehicle.valor_objetivo),
          valor_atual_formatado: GoalsController.formatGoalValue(goalWithVehicle.tipo_meta, goalWithVehicle.valor_atual),
          dias_restantes: GoalsController.calculateDaysRemaining(goalWithVehicle.data_fim),
          tempo_decorrido: GoalsController.calculateElapsedTime(goalWithVehicle.data_inicio, goalWithVehicle.data_fim)
        }
      });

    } catch (error: any) {
      console.error('Erro ao criar meta:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter meta específica por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const goalId = req.params.id;

      // Validar UUID
      if (!z.string().uuid().safeParse(goalId).success) {
        return res.status(400).json({
          success: false,
          error: { message: 'ID da meta deve ser um UUID válido' }
        });
      }

      // Atualizar progresso antes de buscar
      await GoalsController.updateGoalProgress(goalId, req.user?.id);

      // Buscar meta com informações do veículo e histórico de progresso
      const [goal] = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          descricao: metas.descricao,
          tipo_meta: metas.tipo_meta,
          periodo: metas.periodo,
          valor_objetivo: metas.valor_objetivo,
          data_inicio: metas.data_inicio,
          data_fim: metas.data_fim,
          status: metas.status,
          valor_atual: metas.valor_atual,
          percentual_concluido: metas.percentual_concluido,
          data_conclusao: metas.data_conclusao,
          created_at: metas.created_at,
          updated_at: metas.updated_at,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(and(
          eq(metas.id, goalId),
          eq(metas.id_usuario, req.user?.id),
          isNull(metas.deleted_at)
        ))
        .limit(1);

      if (!goal) {
        return res.status(404).json({
          success: false,
          error: { message: 'Meta não encontrada' }
        });
      }

      // Buscar histórico de progresso
      const progressHistory = await db
        .select()
        .from(progressoMetas)
        .where(eq(progressoMetas.id_meta, goalId))
        .orderBy(desc(progressoMetas.data_registro))
        .limit(50);

      return res.json({
        success: true,
        data: {
          ...goal,
          valor_objetivo_formatado: GoalsController.formatGoalValue(goal.tipo_meta, goal.valor_objetivo),
          valor_atual_formatado: GoalsController.formatGoalValue(goal.tipo_meta, goal.valor_atual),
          dias_restantes: GoalsController.calculateDaysRemaining(goal.data_fim),
          tempo_decorrido: GoalsController.calculateElapsedTime(goal.data_inicio, goal.data_fim),
          historico_progresso: progressHistory.map(progress => ({
            ...progress,
            valor_anterior_formatado: GoalsController.formatGoalValue(goal.tipo_meta, progress.valor_anterior),
            valor_atual_formatado: GoalsController.formatGoalValue(goal.tipo_meta, progress.valor_atual),
            incremento_formatado: GoalsController.formatGoalValue(goal.tipo_meta, progress.incremento)
          }))
        }
      });

    } catch (error: any) {
      console.error('Erro ao buscar meta:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Atualizar meta
   */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const goalId = req.params.id;

      // Validar UUID
      if (!z.string().uuid().safeParse(goalId).success) {
        return res.status(400).json({
          success: false,
          error: { message: 'ID da meta deve ser um UUID válido' }
        });
      }

      const validationResult = updateGoalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Dados de atualização inválidos',
            details: validationResult.error.errors
          }
        });
      }

      const updateData = validationResult.data;

      // Verificar se a meta existe e pertence ao usuário
      const [existingGoal] = await db
        .select()
        .from(metas)
        .where(and(
          eq(metas.id, goalId),
          eq(metas.id_usuario, req.user?.id),
          isNull(metas.deleted_at)
        ))
        .limit(1);

      if (!existingGoal) {
        return res.status(404).json({
          success: false,
          error: { message: 'Meta não encontrada' }
        });
      }

      // Verificar se o veículo pertence ao usuário (se especificado)
      if (updateData.id_veiculo) {
        const [vehicle] = await db
          .select()
          .from(veiculos)
          .where(and(
            eq(veiculos.id, updateData.id_veiculo),
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at)
          ))
          .limit(1);

        if (!vehicle) {
          return res.status(404).json({
            success: false,
            error: { message: 'Veículo não encontrado ou não pertence ao usuário' }
          });
        }
      }

      // Preparar dados para atualização
      const updateFields: any = {
        updated_at: new Date().toISOString()
      };

      if (updateData.titulo) updateFields.titulo = updateData.titulo;
      if (updateData.descricao !== undefined) updateFields.descricao = updateData.descricao;
      if (updateData.tipo_meta) updateFields.tipo_meta = updateData.tipo_meta;
      if (updateData.periodo) updateFields.periodo = updateData.periodo;
      if (updateData.status) updateFields.status = updateData.status;
      if (updateData.id_veiculo !== undefined) updateFields.id_veiculo = updateData.id_veiculo;

      if (updateData.valor_objetivo) {
        updateFields.valor_objetivo = GoalsController.convertGoalValue(
          updateData.tipo_meta || existingGoal.tipo_meta, 
          updateData.valor_objetivo
        );
      }

      if (updateData.data_inicio) {
        updateFields.data_inicio = new Date(updateData.data_inicio);
      }

      if (updateData.data_fim) {
        updateFields.data_fim = new Date(updateData.data_fim);
      }

      // Validar datas se ambas foram fornecidas
      if (updateFields.data_inicio && updateFields.data_fim) {
        if (updateFields.data_fim <= updateFields.data_inicio) {
          return res.status(400).json({
            success: false,
            error: { message: 'Data de fim deve ser posterior à data de início' }
          });
        }
      }

      // Atualizar meta
      await db
        .update(metas)
        .set(updateFields)
        .where(eq(metas.id, goalId));

      // Recalcular progresso se necessário
      if (updateData.tipo_meta || updateData.valor_objetivo || updateData.id_veiculo !== undefined) {
        await GoalsController.updateGoalProgress(goalId, req.user?.id);
      }

      // Buscar meta atualizada
      const [updatedGoal] = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          descricao: metas.descricao,
          tipo_meta: metas.tipo_meta,
          periodo: metas.periodo,
          valor_objetivo: metas.valor_objetivo,
          data_inicio: metas.data_inicio,
          data_fim: metas.data_fim,
          status: metas.status,
          valor_atual: metas.valor_atual,
          percentual_concluido: metas.percentual_concluido,
          data_conclusao: metas.data_conclusao,
          created_at: metas.created_at,
          updated_at: metas.updated_at,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(metas)
        .leftJoin(veiculos, eq(metas.id_veiculo, veiculos.id))
        .where(eq(metas.id, goalId))
        .limit(1);

      return res.json({
        success: true,
        message: 'Meta atualizada com sucesso',
        data: {
          ...updatedGoal,
          valor_objetivo_formatado: GoalsController.formatGoalValue(updatedGoal.tipo_meta, updatedGoal.valor_objetivo),
          valor_atual_formatado: GoalsController.formatGoalValue(updatedGoal.tipo_meta, updatedGoal.valor_atual),
          dias_restantes: GoalsController.calculateDaysRemaining(updatedGoal.data_fim),
          tempo_decorrido: GoalsController.calculateElapsedTime(updatedGoal.data_inicio, updatedGoal.data_fim)
        }
      });

    } catch (error: any) {
      console.error('Erro ao atualizar meta:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Excluir meta (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      const goalId = req.params.id;

      // Validar UUID
      if (!z.string().uuid().safeParse(goalId).success) {
        return res.status(400).json({
          success: false,
          error: { message: 'ID da meta deve ser um UUID válido' }
        });
      }

      // Verificar se a meta existe e pertence ao usuário
      const [existingGoal] = await db
        .select()
        .from(metas)
        .where(and(
          eq(metas.id, goalId),
          eq(metas.id_usuario, req.user?.id),
          isNull(metas.deleted_at)
        ))
        .limit(1);

      if (!existingGoal) {
        return res.status(404).json({
          success: false,
          error: { message: 'Meta não encontrada' }
        });
      }

      // Soft delete
      await db
        .update(metas)
        .set({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .where(eq(metas.id, goalId));

      return res.json({
        success: true,
        message: 'Meta excluída com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao excluir meta:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter estatísticas das metas
   */
  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: { message: 'Usuário não autenticado' } 
        });
      }

      // Estatísticas gerais
      const statsQuery = await db
        .select({
          status: metas.status,
          tipo_meta: metas.tipo_meta,
          count: count(),
          avg_percentual: sql<number>`AVG(${metas.percentual_concluido})`,
          total_valor_objetivo: sum(metas.valor_objetivo),
          total_valor_atual: sum(metas.valor_atual)
        })
        .from(metas)
        .where(and(
          eq(metas.id_usuario, req.user?.id),
          isNull(metas.deleted_at)
        ))
        .groupBy(metas.status, metas.tipo_meta);

      // Metas próximas do vencimento (próximos 7 dias)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 7);
      const dataLimiteStr = dataLimite.toISOString();
      const dataAtualStr = new Date().toISOString();

      const metasVencendo = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          data_fim: metas.data_fim,
          percentual_concluido: metas.percentual_concluido,
          dias_restantes: sql<number>`EXTRACT(DAY FROM ${metas.data_fim} - NOW())`
        })
        .from(metas)
        .where(and(
          eq(metas.id_usuario, req.user?.id),
          eq(metas.status, 'Ativa'),
          lte(metas.data_fim, dataLimiteStr),
          gte(metas.data_fim, dataAtualStr),
          isNull(metas.deleted_at)
        ))
        .orderBy(asc(metas.data_fim));

      // Metas concluídas recentemente (últimos 30 dias)
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - 30);

      const metasConcluidas = await db
        .select({
          id: metas.id,
          titulo: metas.titulo,
          data_conclusao: metas.data_conclusao,
          valor_objetivo: metas.valor_objetivo,
          valor_atual: metas.valor_atual,
          tipo_meta: metas.tipo_meta
        })
        .from(metas)
        .where(and(
          eq(metas.id_usuario, req.user?.id),
          eq(metas.status, 'Concluida'),
          gte(metas.data_conclusao, dataInicio),
          isNull(metas.deleted_at)
        ))
        .orderBy(desc(metas.data_conclusao));

      return res.json({
        success: true,
        data: {
          estatisticas_por_status: statsQuery.reduce((acc, stat) => {
            if (!acc[stat.status]) {
              acc[stat.status] = {
                total: 0,
                percentual_medio: 0,
                tipos: {}
              };
            }
            acc[stat.status].total += Number(stat.count);
            acc[stat.status].percentual_medio = Number(stat.avg_percentual || 0);
            acc[stat.status].tipos[stat.tipo_meta] = Number(stat.count);
            return acc;
          }, {} as any),
          metas_vencendo: metasVencendo.map(meta => ({
            ...meta,
            dias_restantes: Number(meta.dias_restantes || 0)
          })),
          metas_concluidas_recentes: metasConcluidas.map(meta => ({
            ...meta,
            valor_objetivo_formatado: GoalsController.formatGoalValue(meta.tipo_meta, meta.valor_objetivo),
            valor_atual_formatado: GoalsController.formatGoalValue(meta.tipo_meta, meta.valor_atual)
          })),
          resumo: {
            total_metas: statsQuery.reduce((sum, stat) => sum + Number(stat.count), 0),
            metas_ativas: statsQuery.filter(s => s.status === 'Ativa').reduce((sum, stat) => sum + Number(stat.count), 0),
            metas_concluidas: statsQuery.filter(s => s.status === 'Concluida').reduce((sum, stat) => sum + Number(stat.count), 0),
            taxa_conclusao: statsQuery.length > 0 ? 
              (statsQuery.filter(s => s.status === 'Concluida').reduce((sum, stat) => sum + Number(stat.count), 0) / 
               statsQuery.reduce((sum, stat) => sum + Number(stat.count), 0)) * 100 : 0
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao buscar estatísticas das metas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Atualizar progresso de uma meta específica
   */
  static async updateGoalProgress(goalId: string, userId: string): Promise<void> {
    try {
      // Buscar meta
      const [goal] = await db
        .select()
        .from(metas)
        .where(and(
          eq(metas.id, goalId),
          eq(metas.id_usuario, userId),
          isNull(metas.deleted_at)
        ))
        .limit(1);

      if (!goal || goal.status !== 'Ativa') {
        return;
      }

      // Calcular valor atual baseado no tipo de meta
      let valorAtual = 0;

      switch (goal.tipo_meta) {
        case 'Faturamento':
          const faturamentoQuery = await db
            .select({
              total: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`
            })
            .from(jornadas)
            .where(and(
              eq(jornadas.id_usuario, userId),
              goal.id_veiculo ? eq(jornadas.id_veiculo, goal.id_veiculo) : sql`true`,
              gte(jornadas.data_inicio, goal.data_inicio),
              lte(jornadas.data_inicio, goal.data_fim),
              isNull(jornadas.deleted_at)
            ));
          valorAtual = Number(faturamentoQuery[0]?.total || 0);
          break;

        case 'Quilometragem':
          const kmQuery = await db
            .select({
              total: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`
            })
            .from(jornadas)
            .where(and(
              eq(jornadas.id_usuario, userId),
              goal.id_veiculo ? eq(jornadas.id_veiculo, goal.id_veiculo) : sql`true`,
              gte(jornadas.data_inicio, goal.data_inicio),
              lte(jornadas.data_inicio, goal.data_fim),
              isNull(jornadas.deleted_at)
            ));
          valorAtual = Number(kmQuery[0]?.total || 0);
          break;

        case 'Jornadas':
          const jornadasQuery = await db
            .select({
              total: count()
            })
            .from(jornadas)
            .where(and(
              eq(jornadas.id_usuario, userId),
              goal.id_veiculo ? eq(jornadas.id_veiculo, goal.id_veiculo) : sql`true`,
              gte(jornadas.data_inicio, goal.data_inicio),
              lte(jornadas.data_inicio, goal.data_fim),
              isNull(jornadas.deleted_at)
            ));
          valorAtual = Number(jornadasQuery[0]?.total || 0);
          break;

        case 'Economia':
          // Economia = Faturamento - Despesas
          const [faturamentoEcon, despesasEcon] = await Promise.all([
            db
              .select({
                total: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`
              })
              .from(jornadas)
              .where(and(
                eq(jornadas.id_usuario, userId),
                goal.id_veiculo ? eq(jornadas.id_veiculo, goal.id_veiculo) : sql`true`,
                gte(jornadas.data_inicio, goal.data_inicio),
                lte(jornadas.data_inicio, goal.data_fim),
                isNull(jornadas.deleted_at)
              )),
            db
              .select({
                total: sql<number>`COALESCE(SUM(${despesas.valor_despesa}), 0)`
              })
              .from(despesas)
              .where(and(
                eq(despesas.id_usuario, userId),
                goal.id_veiculo ? eq(despesas.id_veiculo, goal.id_veiculo) : sql`true`,
                gte(despesas.data_despesa, goal.data_inicio),
                lte(despesas.data_despesa, goal.data_fim),
                isNull(despesas.deleted_at)
              ))
          ]);
          
          const totalFaturamento = Number(faturamentoEcon[0]?.total || 0);
          const totalDespesas = Number(despesasEcon[0]?.total || 0);
          valorAtual = totalFaturamento - totalDespesas;
          break;

        case 'Lucro':
          // Lucro = Faturamento - (Despesas + Abastecimentos)
          const [faturamentoLucro, despesasLucro, abastecimentosLucro] = await Promise.all([
            db
              .select({
                total: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`
              })
              .from(jornadas)
              .where(and(
                eq(jornadas.id_usuario, userId),
                goal.id_veiculo ? eq(jornadas.id_veiculo, goal.id_veiculo) : sql`true`,
                gte(jornadas.data_inicio, goal.data_inicio),
                lte(jornadas.data_inicio, goal.data_fim),
                isNull(jornadas.deleted_at)
              )),
            db
              .select({
                total: sql<number>`COALESCE(SUM(${despesas.valor_despesa}), 0)`
              })
              .from(despesas)
              .where(and(
                eq(despesas.id_usuario, userId),
                goal.id_veiculo ? eq(despesas.id_veiculo, goal.id_veiculo) : sql`true`,
                gte(despesas.data_despesa, goal.data_inicio),
                lte(despesas.data_despesa, goal.data_fim),
                isNull(despesas.deleted_at)
              )),
            db
              .select({
                total: sql<number>`COALESCE(SUM(${abastecimentos.valor_total}), 0)`
              })
              .from(abastecimentos)
              .where(and(
                eq(abastecimentos.id_usuario, userId),
                goal.id_veiculo ? eq(abastecimentos.id_veiculo, goal.id_veiculo) : sql`true`,
                gte(abastecimentos.data_abastecimento, goal.data_inicio),
                lte(abastecimentos.data_abastecimento, goal.data_fim),
                isNull(abastecimentos.deleted_at)
              ))
          ]);
          
          const totalFaturamentoLucro = Number(faturamentoLucro[0]?.total || 0);
          const totalDespesasLucro = Number(despesasLucro[0]?.total || 0);
          const totalAbastecimentos = Number(abastecimentosLucro[0]?.total || 0);
          valorAtual = totalFaturamentoLucro - (totalDespesasLucro + totalAbastecimentos);
          break;
      }

      // Calcular percentual
      const percentualConcluido = goal.valor_objetivo > 0 ? 
        Math.min(Math.round((valorAtual / goal.valor_objetivo) * 100), 100) : 0;

      // Verificar se houve mudança significativa
      const mudancaSignificativa = Math.abs(valorAtual - goal.valor_atual) > 0 || 
                                   Math.abs(percentualConcluido - goal.percentual_concluido) >= 1;

      if (mudancaSignificativa) {
        // Registrar progresso
        await db
          .insert(progressoMetas)
          .values({
            id_meta: goalId,
            valor_anterior: goal.valor_atual,
            valor_atual: valorAtual,
            incremento: valorAtual - goal.valor_atual,
            percentual_anterior: goal.percentual_concluido,
            percentual_atual: percentualConcluido
          });
      }

      // Determinar status
      let novoStatus: 'Ativa' | 'Pausada' | 'Concluida' | 'Expirada' = goal.status;
      let dataConclusao = goal.data_conclusao;

      if (percentualConcluido >= 100 && goal.status === 'Ativa') {
        novoStatus = 'Concluida';
        dataConclusao = new Date();
      } else if (new Date() > goal.data_fim && goal.status === 'Ativa') {
        novoStatus = 'Expirada';
      }

      // Atualizar meta
      await db
        .update(metas)
        .set({
          valor_atual: valorAtual,
          percentual_concluido: percentualConcluido,
          status: novoStatus,
          data_conclusao: dataConclusao,
          updated_at: new Date().toISOString()
        })
        .where(eq(metas.id, goalId));

    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
    }
  }

  /**
   * Converter valor da meta baseado no tipo
   */
  private static convertGoalValue(tipoMeta: string, valor: number): number {
    switch (tipoMeta) {
      case 'Faturamento':
      case 'Economia':
      case 'Lucro':
        return Math.round(valor * 100); // Converter para centavos
      case 'Quilometragem':
      case 'Jornadas':
      default:
        return Math.round(valor);
    }
  }

  /**
   * Formatar valor da meta para exibição
   */
  private static formatGoalValue(tipoMeta: string, valor: number): string {
    switch (tipoMeta) {
      case 'Faturamento':
      case 'Economia':
      case 'Lucro':
        return `R$ ${(valor / 100).toFixed(2)}`;
      case 'Quilometragem':
        return `${valor} km`;
      case 'Jornadas':
        return `${valor} jornadas`;
      default:
        return valor.toString();
    }
  }

  /**
   * Calcular dias restantes
   */
  private static calculateDaysRemaining(dataFim: string): number {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcular tempo decorrido (percentual)
   */
  private static calculateElapsedTime(dataInicio: string, dataFim: string): number {
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    const tempoTotal = fim.getTime() - inicio.getTime();
    const tempoDecorrido = hoje.getTime() - inicio.getTime();
    
    if (tempoTotal <= 0) return 0;
    
    return Math.min(Math.max(Math.round((tempoDecorrido / tempoTotal) * 100), 0), 100);
  }
}

