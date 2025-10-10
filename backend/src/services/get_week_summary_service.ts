import { eq, gte, lte, sql, count } from "drizzle-orm";
import { db } from '../db';
import { metas, progressoMetas } from '../db/schema.postgres';
import type { WeekDateQuery } from "../controllers/goalsController";

interface GoalSummary {
  id: string;
  titulo: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}

interface GetWeekSummaryResponse {
  summary: {
    completed: number;
    total: number;
    goalsPerDay: Record<string, GoalSummary[]>;
  };
}
export async function getWeekSummary({ weekStartsAt, }: WeekDateQuery = {}): Promise<GetWeekSummaryResponse> {
  const startOfWeek = weekStartsAt ? new Date(weekStartsAt) : getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(startOfWeek);

  // Buscar todas as metas com suas completações na semana
  const goalsWithCompletions = await db
    .select({
      id: metas.id,
      titulo: metas.titulo,
      desiredWeeklyFrequency: metas.valorObjetivo,
      completionCount: count(progressoMetas.id),
    })
    .from(metas)
    .leftJoin(
      progressoMetas,
      sql`${progressoMetas.idMeta} = ${metas.id} AND ${progressoMetas.dataRegistro} >= ${startOfWeek.getTime()} AND ${progressoMetas.dataRegistro} <= ${endOfWeek.getTime()}`
    )
    .groupBy(metas.id, metas.titulo, metas.valorObjetivo);

  // Buscar completações por dia para o goalsPerDay
  const completionsByDay = await db
    .select({
      goalId: progressoMetas.idMeta,
      day: sql<string>`DATE(${progressoMetas.dataRegistro})`.as("day"),
      goalTitle: metas.titulo,
      desiredWeeklyFrequency: metas.valorObjetivo,
    })
    .from(progressoMetas)
    .innerJoin(metas, eq(metas.id, progressoMetas.idMeta))
    .where(
      sql`${progressoMetas.dataRegistro} >= ${startOfWeek.getTime()} AND ${progressoMetas.dataRegistro} <= ${endOfWeek.getTime()}`
    );

  // Calcular estatísticas
  const totalGoals = goalsWithCompletions.length;
  const completedGoals = goalsWithCompletions.filter(
    (goal) => Number(goal.completionCount) >= goal.desiredWeeklyFrequency
  ).length;

  // Organizar completações por dia
  const goalsPerDay: Record<string, GoalSummary[]> = {};

  completionsByDay.forEach((completion) => {
    const day = completion.day;

    if (!goalsPerDay[day]) {
      goalsPerDay[day] = [];
    }

    // Verificar se a meta já está no dia
    const existingGoal = goalsPerDay[day].find((g) => g.id === completion.goalId);

    if (existingGoal) {
      existingGoal.completionCount++;
    } else {
      goalsPerDay[day].push({
        id: completion.goalId,
        titulo: completion.goalTitle,
        desiredWeeklyFrequency: completion.desiredWeeklyFrequency,
        completionCount: 1,
      });
    }
  });

  return {
    summary: {
      completed: completedGoals,
      total: totalGoals,
      goalsPerDay,
    },
  };
}

function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getEndOfWeek(startOfWeek: Date): Date {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}


