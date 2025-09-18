import { z } from 'zod';

export const journeySchema = z.object({
  kmInicio: z.number().int().positive("A quilometragem inicial deve ser um número positivo."),
  dataInicio: z.string().datetime("A data de início deve ser uma data e hora válidas."),
});


