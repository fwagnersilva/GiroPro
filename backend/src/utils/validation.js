"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.expenseSchema = exports.fuelingSchema = exports.endJourneySchema = exports.startJourneySchema = exports.vehicleSchema = exports.changePasswordSchema = exports.resetPasswordSchema = exports.requestPasswordResetSchema = exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
// Schemas de validação para autenticação
exports.registerSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255),
    email: zod_1.z.string().email('Email inválido'),
    senha: zod_1.z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
    dataNascimento: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento deve estar no formato YYYY-MM-DD').optional(),
    cidade: zod_1.z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(100).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    senha: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
exports.requestPasswordResetSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token é obrigatório'),
    newPassword: zod_1.z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: zod_1.z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'),
});
// Schemas de validação para veículos
exports.vehicleSchema = zod_1.z.object({
    marca: zod_1.z.string().min(1, 'Marca é obrigatória').max(100),
    modelo: zod_1.z.string().min(1, 'Modelo é obrigatório').max(100),
    ano: zod_1.z.number().int().min(1950, 'Ano deve ser maior ou igual a 1950').max(new Date().getFullYear() + 1),
    placa: zod_1.z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/, 'Formato de placa inválido'),
    tipoCombustivel: zod_1.z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex']),
    tipo_uso: zod_1.z.enum(['Proprio', 'Alugado', 'Financiado']),
    valor_aluguel: zod_1.z.number().int().positive().optional(),
    valor_prestacao: zod_1.z.number().int().positive().optional(),
});
// Schemas de validação para jornadas
exports.startJourneySchema = zod_1.z.object({
    idVeiculo: zod_1.z.string().uuid('ID do veículo deve ser um UUID válido'),
    km_inicio: zod_1.z.number().int().min(0, 'Quilometragem inicial deve ser positiva'),
    observacoes: zod_1.z.string().optional(),
});
exports.endJourneySchema = zod_1.z.object({
    km_fim: zod_1.z.number().int().min(0, 'Quilometragem final deve ser positiva'),
    ganhoBruto: zod_1.z.number().int().positive('Ganho bruto deve ser positivo'),
});
// Schemas de validação para abastecimentos
exports.fuelingSchema = zod_1.z.object({
    idVeiculo: zod_1.z.string().uuid('ID do veículo deve ser um UUID válido'),
    dataAbastecimento: zod_1.z.string().datetime('Data de abastecimento inválida'),
    tipoCombustivel: zod_1.z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex']),
    quantidadeLitros: zod_1.z.number().int().positive('Quantidade de litros deve ser positiva'),
    valorLitro: zod_1.z.number().int().positive('Valor por litro deve ser positivo'),
    kmAtual: zod_1.z.number().int().min(0).optional(),
    nomePosto: zod_1.z.string().max(255).optional(),
});
// Schemas de validação para despesas
exports.expenseSchema = zod_1.z.object({
    idVeiculo: zod_1.z.string().uuid('ID do veículo deve ser um UUID válido').optional(),
    dataDespesa: zod_1.z.string().datetime('Data da despesa inválida'),
    tipoDespesa: zod_1.z.enum(['Manutencao', 'Pneus', 'Seguro', 'Outros']),
    valorDespesa: zod_1.z.number().int().positive('Valor da despesa deve ser positivo'),
    descricao: zod_1.z.string().optional(),
});
// Utilitário para validar dados
var validateData = function (schema, data) {
    return schema.parse(data);
};
exports.validateData = validateData;
