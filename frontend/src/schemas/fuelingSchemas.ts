import { z } from 'zod';

export const fuelingSchema = z.object({
  quantidadeLitros: z.number().positive("A quantidade de litros deve ser um número positivo."),
});


