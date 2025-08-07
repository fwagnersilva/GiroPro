import { db } from "../db";
import { metas } from "../db/schema";
import { CreateGoalRequest } from "../controllers/goalsController";

interface CreateGoalResponse {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  createdAt: Date;
}

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest): Promise<CreateGoalResponse> {
  const result = await db
    .insert(metas)
    .values({
      titulo: title,
      valor_objetivo: desiredWeeklyFrequency, // Usando desiredWeeklyFrequency como valor_objetivo inicial
      tipo_meta: "Quilometragem", // Exemplo: definir um tipo de meta padrão
      periodo: "Semanal", // Exemplo: definir um período padrão
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString(), // Definir uma data de fim razoável
      id_usuario: "some-user-id", // TODO: Substituir por ID de usuário real
    })
    .returning();

  const goal = result[0];

  return {
    id: goal.id,
    title: goal.titulo,
    desiredWeeklyFrequency: goal.valor_objetivo, // Retornar valor_objetivo como desiredWeeklyFrequency
    createdAt: new Date(goal.created_at),
  };
}


