import { z } from 'zod';

export const vehicleSchema = z.object({
  marca: z.string().min(1, "A marca é obrigatória.").max(50, "A marca deve ter no máximo 50 caracteres."),
});

