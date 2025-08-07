import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import type { CompleteGoalRequest } from '../db/schema'
import { eq } from 'drizzle-orm'

interface CreateGoalCompletionResponse {
  id: string
  goalId: string
  createdAt: Date
}

export async function createGoalCompletion({ 
  goalId 
}: CompleteGoalRequest): Promise<CreateGoalCompletionResponse> {
  // Verificar se a meta existe
  const goal = await db
    .select()
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1)

  if (goal.length === 0) {
    throw new Error('Meta não encontrada')
  }

  // Criar a completação
  const result = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  const completion = result[0]

  return {
    id: completion.id,
    goalId: completion.goalId,
    createdAt: completion.createdAt,
  }
}