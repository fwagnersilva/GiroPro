"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
// Teste para funções utilitárias básicas
(0, globals_1.describe)('Utils Tests', function () {
    (0, globals_1.describe)('Date Utils', function () {
        (0, globals_1.it)('deve formatar data corretamente', function () {
            var date = new Date('2024-01-15T10:30:00Z');
            var formatted = date.toISOString().split('T')[0];
            (0, globals_1.expect)(formatted).toBe('2024-01-15');
        });
        (0, globals_1.it)('deve calcular diferença entre datas', function () {
            var date1 = new Date('2024-01-15');
            var date2 = new Date('2024-01-10');
            var diffInDays = Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
            (0, globals_1.expect)(diffInDays).toBe(5);
        });
    });
    (0, globals_1.describe)('String Utils', function () {
        (0, globals_1.it)('deve validar formato de email', function () {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            (0, globals_1.expect)(emailRegex.test('test@example.com')).toBe(true);
            (0, globals_1.expect)(emailRegex.test('invalid-email')).toBe(false);
        });
        (0, globals_1.it)('deve validar formato de telefone brasileiro', function () {
            var phoneRegex = /^\d{10,11}$/;
            (0, globals_1.expect)(phoneRegex.test('11999999999')).toBe(true);
            (0, globals_1.expect)(phoneRegex.test('1199999999')).toBe(true);
            (0, globals_1.expect)(phoneRegex.test('119999999')).toBe(false);
        });
    });
    (0, globals_1.describe)('Number Utils', function () {
        (0, globals_1.it)('deve calcular porcentagem corretamente', function () {
            var calculatePercentage = function (value, total) {
                return (value / total) * 100;
            };
            (0, globals_1.expect)(calculatePercentage(25, 100)).toBe(25);
            (0, globals_1.expect)(calculatePercentage(1, 4)).toBe(25);
        });
        (0, globals_1.it)('deve formatar valores monetários', function () {
            var formatCurrency = function (value) {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            };
            var result1 = formatCurrency(100.50);
            var result2 = formatCurrency(1000);
            (0, globals_1.expect)(result1).toContain('100,50');
            (0, globals_1.expect)(result2).toContain('1.000,00');
        });
    });
    (0, globals_1.describe)('Array Utils', function () {
        (0, globals_1.it)('deve remover duplicatas de array', function () {
            var removeDuplicates = function (arr) {
                return __spreadArray([], new Set(arr), true);
            };
            (0, globals_1.expect)(removeDuplicates([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
            (0, globals_1.expect)(removeDuplicates(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c']);
        });
        (0, globals_1.it)('deve agrupar elementos por propriedade', function () {
            var groupBy = function (arr, key) {
                return arr.reduce(function (groups, item) {
                    var group = item[key];
                    groups[group] = groups[group] || [];
                    groups[group].push(item);
                    return groups;
                }, {});
            };
            var data = [
                { type: 'A', value: 1 },
                { type: 'B', value: 2 },
                { type: 'A', value: 3 }
            ];
            var grouped = groupBy(data, 'type');
            (0, globals_1.expect)(grouped.A).toHaveLength(2);
            (0, globals_1.expect)(grouped.B).toHaveLength(1);
        });
    });
    (0, globals_1.describe)('Validation Utils', function () {
        (0, globals_1.it)('deve validar CPF básico', function () {
            var isValidCPF = function (cpf) {
                // Validação básica de formato
                var cleanCPF = cpf.replace(/\D/g, '');
                return cleanCPF.length === 11 && !/^(\d)\1{10}$/.test(cleanCPF);
            };
            (0, globals_1.expect)(isValidCPF('123.456.789-01')).toBe(true);
            (0, globals_1.expect)(isValidCPF('111.111.111-11')).toBe(false);
            (0, globals_1.expect)(isValidCPF('123456789')).toBe(false);
        });
        (0, globals_1.it)('deve validar senha forte', function () {
            var isStrongPassword = function (password) {
                return password.length >= 8 &&
                    /[A-Z]/.test(password) &&
                    /[a-z]/.test(password) &&
                    /\d/.test(password);
            };
            (0, globals_1.expect)(isStrongPassword('MinhaSenh@123')).toBe(true);
            (0, globals_1.expect)(isStrongPassword('senha123')).toBe(false);
            (0, globals_1.expect)(isStrongPassword('SENHA123')).toBe(false);
        });
    });
});
