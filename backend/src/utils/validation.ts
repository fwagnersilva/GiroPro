import { z } from 'zod';

// Schemas de validação para autenticação
export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
           'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato YYYY-MM-DD').optional(),
  cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
           'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
           'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
});

// Schemas de validação para veículos
export const vehicleSchema = z.object({
  marca: z.string().min(1, 'Marca é obrigatória').max(100),
  modelo: z.string().min(1, 'Modelo é obrigatório').max(100),
  ano: z.number().int().min(1950, 'Ano deve ser maior ou igual a 1950').max(new Date().getFullYear() + 1),
  placa: z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/, 'Formato de placa inválido'),
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex']),
  tipo_uso: z.enum(['Proprio', 'Alugado', 'Financiado']),
  valor_aluguel: z.number().int().positive().optional(),
  valor_prestacao: z.number().int().positive().optional(),
});

// Schemas de validação para jornadas
export const startJourneySchema = z.object({
  idVeiculo: z.string().uuid('ID do veículo deve ser um UUID válido'),
  km_inicio: z.number().int().min(0, 'Quilometragem inicial deve ser positiva'),
  observacoes: z.string().optional(),
});

export const endJourneySchema = z.object({
  km_fim: z.number().int().min(0, 'Quilometragem final deve ser positiva'),
  ganhoBruto: z.number().int().positive('Ganho bruto deve ser positivo'),
});

// Schemas de validação para abastecimentos
export const fuelingSchema = z.object({
  idVeiculo: z.string().uuid('ID do veículo deve ser um UUID válido'),
  dataAbastecimento: z.string().datetime('Data de abastecimento inválida'),
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex']),
  quantidadeLitros: z.number().int().positive('Quantidade de litros deve ser positiva'),
  valorLitro: z.number().int().positive('Valor por litro deve ser positivo'),
  kmAtual: z.number().int().min(0).optional(),
  nomePosto: z.string().max(255).optional(),
});

// Schemas de validação para despesas
export const expenseSchema = z.object({
  idVeiculo: z.string().uuid('ID do veículo deve ser um UUID válido').optional(),
  dataDespesa: z.string().datetime('Data da despesa inválida'),
  tipoDespesa: z.enum(['Manutencao', 'Pneus', 'Seguro', 'Outros']),
  valorDespesa: z.number().int().positive('Valor da despesa deve ser positivo'),
  descricao: z.string().optional(),
});

// Utilitário para validar dados
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
