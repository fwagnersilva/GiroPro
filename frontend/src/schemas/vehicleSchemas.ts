import { z } from 'zod';

export const vehicleSchema = z.object({
  marca: z.string().min(1, "A marca é obrigatória.").max(50, "A marca deve ter no máximo 50 caracteres."),
  modelo: z.string().min(1, "O modelo é obrigatório.").max(50, "O modelo deve ter no máximo 50 caracteres."),
});

