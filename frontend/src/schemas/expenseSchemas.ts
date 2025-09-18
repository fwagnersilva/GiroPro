import { z } from 'zod';

export const expenseSchema = z.object({
  valorDespesa: z.number().positive("O valor da despesa deve ser um número positivo."),
});


