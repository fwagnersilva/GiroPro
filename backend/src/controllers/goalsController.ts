import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

const completeGoalSchema = z.object({
  goalId: z.string().cuid2(),
})

const getWeekSummarySchema = z.object({
  weekStartsAt: z.string().optional(),
})

const getWeekPendingGoalsSchema = z.object({
  weekStartsAt: z.string().optional(),
})

export type CreateGoalRequest = z.infer<typeof createGoalSchema>
export type CompleteGoalRequest = z.infer<typeof completeGoalSchema>
export type GetWeekSummaryRequest = z.infer<typeof getWeekSummarySchema>
export type GetWeekPendingGoalsRequest = z.infer<typeof getWeekPendingGoalsSchema>

import { createGoal } from '../services/create_goal_service'
import { createGoalCompletion } from '../services/create_goal_completion_service'
import { getWeekPendingGoals } from '../services/get_week_pending_goals_service'
import { getWeekSummary } from '../services/get_week_summary_service'

export const goalsRoutes: FastifyPluginAsyncZod = async app => {
  // POST /goals - Criar nova meta
  app.post('/goals', {
    schema: {
      body: createGoalSchema,
    },
  }, async (request) => {
    const { title, desiredWeeklyFrequency } = request.body as CreateGoalRequest

    const result = await createGoal({
      title,
      desiredWeeklyFrequency,
    })

    return result
  })

  // POST /completions - Completar uma meta
  app.post('/completions', {
    schema: {
      body: completeGoalSchema,
    },
  }, async (request) => {
    const { goalId } = request.body as CompleteGoalRequest

    const result = await createGoalCompletion({
      goalId,
    })

    return result
  })

  // GET /pending-goals - Obter metas pendentes da semana
  app.get('/pending-goals', {
    schema: {
      querystring: getWeekPendingGoalsSchema,
    },
  }, async (request) => {
    const { weekStartsAt } = request.query as GetWeekPendingGoalsRequest

    const result = await getWeekPendingGoals({
      weekStartsAt: weekStartsAt ? new Date(weekStartsAt).toISOString() : undefined,
    })

    return result
  })

  // GET /summary - Obter resumo da semana
  app.get('/summary', {
    schema: {
      querystring: getWeekSummarySchema,
    },
  }, async (request) => {
    const { weekStartsAt } = request.query as GetWeekSummaryRequest

    const result = await getWeekSummary({
      weekStartsAt: weekStartsAt ? new Date(weekStartsAt).toISOString() : undefined,
    })

    return result
  })
}


