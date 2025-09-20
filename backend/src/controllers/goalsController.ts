import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

// 🚀 Schemas otimizados com validações mais robustas
const createGoalSchema = z.object({
  titulo: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .trim(),
  desiredWeeklyFrequency: z.number()
    .int('Frequência deve ser um número inteiro')
    .min(1, 'Frequência mínima é 1')
    .max(7, 'Frequência máxima é 7'),
})

const completeGoalSchema = z.object({
  goalId: z.string()
    .cuid2('ID da meta deve ser um CUID válido'),
})

// 🔧 Schema otimizado para datas com coerção automática
const weekDateQuerySchema = z.object({
  weekStartsAt: z.string()
    .datetime('Data deve estar no formato ISO 8601')
    .optional()
    .transform(val => val ? new Date(val).toISOString() : undefined),
})

// 📝 Tipos exportados
export type CreateGoalRequest = z.infer<typeof createGoalSchema>
export type CompleteGoalRequest = z.infer<typeof completeGoalSchema>
export type WeekDateQuery = z.infer<typeof weekDateQuerySchema>

// 🔧 Imports dos services
import { createGoal } from '../services/create_goal_service'
import { createGoalCompletion } from '../services/create_goal_completion_service'
import { getWeekPendingGoals } from '../services/get_week_pending_goals_service'
import { getWeekSummary } from '../services/get_week_summary_service'

// 🛡️ Utilitário para responses padronizados
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
})

const createErrorResponse = (error: string): ApiResponse => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
})

// 🛡️ Handler de erro padronizado
const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      // Log do erro para monitoramento
      console.error('[GoalsController]', error)
      throw error
    }
  }
}

export const goalsRoutes: FastifyPluginAsyncZod = async app => {
  // POST /goals - Criar nova meta
  app.post('/goals', {
    schema: {
      body: createGoalSchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            goalId: z.string().cuid2(),
          }),
          timestamp: z.string().datetime(),
        }),
        400: z.object({
          success: z.boolean(),
          error: z.string(),
          timestamp: z.string().datetime(),
        }),
      },
    },
  }, withErrorHandling(async (request, reply) => {
    const { titulo, desiredWeeklyFrequency } = request.body

    const result = await createGoal({
      titulo,
      desiredWeeklyFrequency,
    })

    // 🚀 Response padronizado
    return createSuccessResponse({
      goalId: result.id,
      titulo: result.titulo,
      desiredWeeklyFrequency: result.desiredWeeklyFrequency,
      createdAt: result.createdAt,
    })
  }))

  // POST /completions - Completar uma meta
  app.post('/completions', {
    schema: {
      body: completeGoalSchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            completionId: z.string().cuid2(),
          }),
          timestamp: z.string().datetime(),
        }),
        400: z.object({
          success: z.boolean(),
          error: z.string(),
          timestamp: z.string().datetime(),
        }),
        404: z.object({
          success: z.boolean(),
          error: z.string(),
          timestamp: z.string().datetime(),
        }),
      },
    },
  }, withErrorHandling(async (request, reply) => {
    const { goalId } = request.body

    const result = await createGoalCompletion({
      goalId,
    })

    // 🚀 Response com status codes apropriados
    return createSuccessResponse({
      completionId: result.id,
    })
  }))

  // GET /pending-goals - Obter metas pendentes da semana
  app.get('/pending-goals', {
    schema: {
      querystring: weekDateQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            pendingGoals: z.array(z.object({
              id: z.string().cuid2(),
              titulo: z.string(),
              desiredWeeklyFrequency: z.number(),
              completionCount: z.number(),
            })),
          }),
          timestamp: z.string().datetime(),
        }),
      },
    },
  }, withErrorHandling(async (request) => {
    const { weekStartsAt } = request.query

    const result = await getWeekPendingGoals({
      weekStartsAt,
    })

    return createSuccessResponse(result)
  }))

  // GET /summary - Obter resumo da semana
  app.get('/summary', {
    schema: {
      querystring: weekDateQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            completed: z.number(),
            total: z.number(),
            goalsPerDay: z.record(z.number()),
          }),
          timestamp: z.string().datetime(),
        }),
      },
    },
  }, withErrorHandling(async (request) => {
    const { weekStartsAt } = request.query

    const result = await getWeekSummary({
      weekStartsAt,
    })

    return createSuccessResponse(result)
  }))

  // 🔍 GET /goals/:id - Obter detalhes de uma meta específica (novo endpoint)
  app.get('/goals/:id', {
    schema: {
      params: z.object({
        id: z.string().cuid2('ID da meta deve ser um CUID válido'),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            id: z.string().cuid2(),
            titulo: z.string(),
            desiredWeeklyFrequency: z.number(),
            createdAt: z.string().datetime(),
          }),
          timestamp: z.string().datetime(),
        }),
        404: z.object({
          success: z.boolean(),
          error: z.string(),
          timestamp: z.string().datetime(),
        }),
      },
    },
  }, withErrorHandling(async (request, reply) => {
    const { id } = request.params
    
    // Este endpoint precisará ser implementado no service
    // const result = await getGoalById({ goalId: id })
    
    // Por enquanto, retorna erro não implementado
    return reply.status(501).send(createErrorResponse('Endpoint em desenvolvimento'))
  }))

  // 🔍 Health check específico para goals
  app.get('/goals/health', async () => {
    return {
      status: 'healthy',
      service: 'goals-controller',
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /goals',
        'POST /completions', 
        'GET /pending-goals',
        'GET /summary',
        'GET /goals/:id',
      ],
    }
  })
}
