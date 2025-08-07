import { db } from '../db'
import { goals, goalCompletions } from '../db/schema'
import { eq, gte, lte, sql, count } from 'drizzle-orm'
import type { GetWeekSummaryRequest } from '../db/schema'

interface GoalSummary {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

interface GetWeekSummaryResponse {
  summary: {
    completed: number
    total: number
    goalsPerDay: Record<string, GoalSummary[]>
  }
}

export async function getWeekSummary({
  weekStartsAt
}: GetWeekSummaryRequest = {}): Promise<GetWeekSummaryResponse> {
  // Se não informado, usar o início da semana atual (domingo)
  const startOfWeek = weekStartsAt || getStartOfWeek(new Date())
  const endOfWeek = getEndOfWeek(startOfWeek)

  // Buscar todas as metas com suas completações na semana
  const goalsWithCompletions = await db
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

  // Buscar completações por dia para o goalsPerDay
  const completionsByDay = await db
    .select({
      goalId: goalCompletions.goalId,
      day: sql<string>`DATE(${goalCompletions.createdAt})`.as('day'),
      goalTitle: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    })
    .from(goalCompletions)
    .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
    .where(
      sql`${goalCompletions.createdAt} >= ${startOfWeek} AND ${goalCompletions.createdAt} <= ${endOfWeek}`
    )

  // Calcular estatísticas
  const totalGoals = goalsWithCompletions.length
  const completedGoals = goalsWithCompletions.filter(
    goal => Number(goal.completionCount) >= goal.desiredWeeklyFrequency
  ).length

  // Organizar completações por dia
  const goalsPerDay: Record<string, GoalSummary[]> = {}
  
  completionsByDay.forEach(completion => {
    const day = completion.day
    
    if (!goalsPerDay[day]) {
      goalsPerDay[day] = []
    }

    // Verificar se a meta já está no dia
    const existingGoal = goalsPerDay[day].find(g => g.id === completion.goalId)
    
    if (existingGoal) {
      existingGoal.completionCount++
    } else {
      goalsPerDay[day].push({
        id: completion.goalId,
        title: completion.goalTitle,
        desiredWeeklyFrequency: completion.desiredWeeklyFrequency,
        completionCount: 1,
      })
    }
  })

  return {
    summary: {
      completed: completedGoals,
      total: totalGoals,
      goalsPerDay,
    },
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