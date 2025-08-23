import { eq, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { metas, progressoMetas } from "../db/schema";
import { CompleteGoalRequest } from "../controllers/goalsController";

interface CreateGoalCompletionResponse {
  id: string;
  goalId: string;
  createdAt: Date;
}

export async function createGoalCompletion({
  goalId,
}: CompleteGoalRequest): Promise<CreateGoalCompletionResponse> {
  // Verificar se a meta existe
  const [goal] = await db.select().from(metas).where(eq(metas.id, goalId)).limit(1);

  if (!goal) {
    throw new Error("Meta não encontrada");
  }

  // Atualizar o valor atual da meta e o percentual concluído
  const novoValorAtual = goal.valorAtual + 1; // Exemplo: incrementa em 1 para cada conclusão
  const novoPercentualConcluido = Math.min(
    100,
    (novoValorAtual / goal.valorObjetivo) * 100
  );

  const [updatedGoal] = await db
    .update(metas)
    .set({
      valorAtual: novoValorAtual,
      percentualConcluido: novoPercentualConcluido,
      dataConclusao: novoPercentualConcluido === 100 ? sql`${Math.floor(Date.now() / 1000)}` : undefined,
      updatedAt: sql`${Math.floor(Date.now() / 1000)}`,
    })
    .where(eq(metas.id, goalId))
    .returning();

  if (!updatedGoal) {
    throw new Error("Erro ao atualizar a meta");
  }

  // Registrar o progresso
  const [progresso] = await db
    .insert(progressoMetas)
    .values({
      idMeta: goalId,
      valorAnterior: goal.valorAtual,
      valorAtual: novoValorAtual,
      incremento: 1,
      percentualAnterior: goal.percentualConcluido,
      percentualAtual: novoPercentualConcluido,
      observacoes: "Conclusão de meta registrada",
    })
    .returning();

  if (!progresso) {
    throw new Error("Erro ao registrar o progresso da meta");
  }

  return {
    id: progresso.id,
    goalId: progresso.idMeta,
    createdAt: new Date(progresso.dataRegistro * 1000), // Converter timestamp Unix para Date
  };
}


