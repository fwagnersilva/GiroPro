import { db } from '../db'
import { goals } from '../db/schema'
import type { CreateGoalRequest } from '../db/schema'

interface CreateGoalResponse {
  id: string
  title: string
  desiredWeeklyFrequency: number
  createdAt: Date
}

export async function createGoal({ 
  title, 
  desiredWeeklyFrequency 
}: CreateGoalRequest): Promise<CreateGoalResponse> {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const goal = result[0]

  return {
    id: goal.id,
    title: goal.title,
    desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
    createdAt: goal.createdAt,
  }
}