import { eq, gte, lte, and, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { metas, progressoMetas } from "../db/schema";
import { GetWeekPendingGoalsRequest } from "../controllers/goalsController";

interface PendingGoal {
  id: string;
  title: string;
  desiredWeeklyFrequency: number; // Representa o valor_objetivo para metas semanais
  currentProgress: number; // Representa o valor_atual
}

interface GetWeekPendingGoalsResponse {
  pendingGoals: PendingGoal[];
}

export async function getWeekPendingGoals({
  weekStartsAt,
}: GetWeekPendingGoalsRequest = {}): Promise<GetWeekPendingGoalsResponse> {
  const startOfWeek = weekStartsAt ? new Date(weekStartsAt) : getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(startOfWeek);

  const pendingGoals = await db
    .select({
      id: metas.id,
      title: metas.titulo,
      desiredWeeklyFrequency: metas.valor_objetivo,
      currentProgress: metas.valor_atual,
    })
    .from(metas)
    .where(
      and(
        eq(metas.periodo, "Semanal"), // Filtrar por metas semanais
        lte(metas.dataInicio, endOfWeek.toISOString()),
        gte(metas.dataFim, startOfWeek.toISOString()),
        eq(metas.status, "Ativa"), // Apenas metas ativas
        sql`${metas.valor_atual} < ${metas.valor_objetivo}` // Onde o valor atual é menor que o objetivo
      )
    );

  return {
    pendingGoals: pendingGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      currentProgress: goal.currentProgress,
    })),
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


