import { db } from '../db';
import { metas } from '../db';
import { CreateGoalRequest } from "../controllers/goalsController";

interface CreateGoalResponse {
  id: string;
  titulo: string;
  desiredWeeklyFrequency: number;
  createdAt: Date;
}

export async function createGoal({
  titulo,
  desiredWeeklyFrequency,
}: CreateGoalRequest): Promise<CreateGoalResponse> {
  const result = await db
    .insert(metas)
    .values({
      titulo: titulo,
      valorObjetivo: desiredWeeklyFrequency, // Usando desiredWeeklyFrequency como valorObjetivo inicial
      tipoMeta: "quilometragem", // Exemplo: definir um tipo de meta padrão
      periodoMeta: "semanal", // Exemplo: definir um período padrão
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Uma semana a partir de agora
      idUsuario: "some-user-id", // TODO: Substituir por ID de usuário real
    })
    .returning();

  const goal = result[0];

  return {
    id: goal.id,
    titulo: goal.titulo,
    desiredWeeklyFrequency: goal.valorObjetivo, // Retornar valorObjetivo como desiredWeeklyFrequency
    createdAt: new Date(goal.createdAt), // Converter timestamp para Date
  };
}


