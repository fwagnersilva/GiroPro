"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.requestPasswordResetSchema = exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    senha: zod_1.z.string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/\d/, 'Senha deve conter pelo menos um número')
        .regex(/[@$!%*?&#]/, 'Senha deve conter pelo menos um caractere especial'),
    dataNascimento: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    senha: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
exports.requestPasswordResetSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token é obrigatório'),
    newPassword: zod_1.z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6, 'Senha antiga deve ter pelo menos 6 caracteres'),
    newPassword: zod_1.z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});
