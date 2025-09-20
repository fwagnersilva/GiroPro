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
  const novoValorAtual = goal.valor_atual + 1; // Exemplo: incrementa em 1 para cada conclusão
  const novoPercentualConcluido = Math.min(
    100,
    (novoValorAtual / goal.valor_objetivo) * 100
  );

  const [updatedGoal] = await db
    .update(metas)
    .set({
      valor_atual: novoValorAtual,
      percentual_concluido: novoPercentualConcluido,
      data_conclusao: novoPercentualConcluido === 100 ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
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
      id_meta: goalId,
      valor_anterior: goal.valor_atual,
      valor_atual: novoValorAtual,
      incremento: 1,
      percentual_anterior: goal.percentual_concluido,
      percentual_atual: novoPercentualConcluido,
      observacoes: "Conclusão de meta registrada",
    })
    .returning();

  if (!progresso) {
    throw new Error("Erro ao registrar o progresso da meta");
  }

  return {
    id: progresso.id,
    goalId: progresso.id_meta,
    createdAt: new Date(progresso.dataRegistro),
  };
}


