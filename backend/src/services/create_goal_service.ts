import { db } from "../db/connection";
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
      title: title,
      valorObjetivo: desiredWeeklyFrequency, // Usando desiredWeeklyFrequency como valorObjetivo inicial
      tipoMeta: "quilometragem", // Exemplo: definir um tipo de meta padrão
      periodo: "semanal", // Exemplo: definir um período padrão
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Uma semana a partir de agora
      idUsuario: "some-user-id", // TODO: Substituir por ID de usuário real
    })
    .returning();

  const goal = result[0];

  return {
    id: goal.id,
    title: goal.title,
    desiredWeeklyFrequency: goal.valorObjetivo, // Retornar valorObjetivo como desiredWeeklyFrequency
    createdAt: new Date(goal.createdAt), // Converter timestamp para Date
  };
}


