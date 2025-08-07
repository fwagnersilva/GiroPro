import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { 
  createGoalSchema,
  completeGoalSchema,
  getWeekSummarySchema,
  getWeekPendingGoalsSchema,
  type CreateGoalRequest,
  type CompleteGoalRequest,
  type GetWeekSummaryRequest,
  type GetWeekPendingGoalsRequest
} from '../db/schema'
import { createGoal } from '../services/create-goal'
import { createGoalCompletion } from '../services/create-goal-completion'
import { getWeekPendingGoals } from '../services/get-week-pending-goals'
import { getWeekSummary } from '../services/get-week-summary'

export const goalsRoutes: FastifyPluginAsyncZod = async app => {
  // POST /goals - Criar nova meta
  app.post('/goals', {
    schema: {
      body: createGoalSchema,
    },
  }, async (request) => {
    const { title, desiredWeeklyFrequency } = request.body

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
    const { goalId } = request.body

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
    const { weekStartsAt } = request.query

    const result = await getWeekPendingGoals({
      weekStartsAt: weekStartsAt ? new Date(weekStartsAt) : undefined,
    })

    return result
  })

  // GET /summary - Obter resumo da semana
  app.get('/summary', {
    schema: {
      querystring: getWeekSummarySchema,
    },
  }, async (request) => {
    const { weekStartsAt } = request.query

    const result = await getWeekSummary({
      weekStartsAt: weekStartsAt ? new Date(weekStartsAt) : undefined,
    })

    return result
  })
}
