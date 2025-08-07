import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

// Drizzle enums
export const goalFrequencyEnum = pgEnum('goal_frequency', ['daily', 'weekly', 'monthly'])

// Zod enums (sincronizados com Drizzle)
export const goalFrequencySchema = z.enum(['daily', 'weekly', 'monthly'])
export type GoalFrequency = z.infer<typeof goalFrequencySchema>

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const goalCompletions = pgTable('goal_completions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text('goal_id')
    .references(() => goals.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Zod schemas para validação
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})

export const completeGoalSchema = z.object({
  goalId: z.string().cuid2(),
})

export const getWeekSummarySchema = z.object({
  weekStartsAt: z.string().optional(),
})

export const getWeekPendingGoalsSchema = z.object({
  weekStartsAt: z.string().optional(),
})

// Types
export type CreateGoalRequest = z.infer<typeof createGoalSchema>
export type CompleteGoalRequest = z.infer<typeof completeGoalSchema>
export type GetWeekSummaryRequest = z.infer<typeof getWeekSummarySchema>
export type GetWeekPendingGoalsRequest = z.infer<typeof getWeekPendingGoalsSchema>
