import { db } from '../db'
import { goals, goalCompletions } from '../db/schema'
import { eq, gte, lte, sql, count } from 'drizzle-orm'
import type { GetWeekPendingGoalsRequest } from '../db/schema'

interface PendingGoal {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

interface GetWeekPendingGoalsResponse {
  pendingGoals: PendingGoal[]
}

export async function getWeekPendingGoals({
  weekStartsAt
}: GetWeekPendingGoalsRequest = {}): Promise<GetWeekPendingGoalsResponse> {
  // Se não informado, usar o início da semana atual (domingo)
  const startOfWeek = weekStartsAt || getStartOfWeek(new Date())
  const endOfWeek = getEndOfWeek(startOfWeek)

  const pendingGoals = await db
    .select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: count(goalCompletions.id),
    })
    .from(goals)
    .leftJoin(
      goalCompletions,
      sql`${goalCompletions.goalId} = ${goals.id} AND ${goalCompletions.createdAt} >= ${startOfWeek} AND ${goalCompletions.createdAt} <= ${endOfWeek}`
    )
    .groupBy(goals.id, goals.title, goals.desiredWeeklyFrequency)
    .having(sql`count(${goalCompletions.id}) < ${goals.desiredWeeklyFrequency}`)

  return {
    pendingGoals: pendingGoals.map(goal => ({
      id: goal.id,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      completionCount: Number(goal.completionCount),
    })),
  }
}

function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)
  return startOfWeek
}

function getEndOfWeek(startOfWeek: Date): Date {
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return endOfWeek
}