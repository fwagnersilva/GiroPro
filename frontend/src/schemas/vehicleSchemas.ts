import { z } from 'zod';

export const vehicleSchema = z.object({
  marca: z.string().min(1, "A marca é obrigatória.").max(50, "A marca deve ter no máximo 50 caracteres."),
  modelo: z.string().min(1, "O modelo é obrigatório.").max(50, "O modelo deve ter no máximo 50 caracteres."),
  ano: z.number().int("O ano deve ser um número inteiro.").min(1900, "O ano deve ser a partir de 1900.").max(new Date().getFullYear() + 1, "O ano não pode ser futuro."),
  placa: z.string().min(1, "A placa é obrigatória.").regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Formato de placa inválido. Use o formato ABC1234 ou ABC1D23."),
});

