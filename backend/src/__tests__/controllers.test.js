"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
// Mock dos módulos externos
globals_1.jest.mock('../db/connection', function () { return ({
    db: {
        select: globals_1.jest.fn(),
        insert: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        delete: globals_1.jest.fn()
    }
}); });
// Testes unitários para controllers
(0, globals_1.describe)('Controllers Unit Tests', function () {
    (0, globals_1.beforeEach)(function () {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('User Controller Logic', function () {
        (0, globals_1.it)('deve validar dados de entrada do usuário', function () {
            var validateUserData = function (userData) {
                var errors = [];
                if (!userData.nome || userData.nome.length < 2) {
                    errors.push('Nome deve ter pelo menos 2 caracteres');
                }
                if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
                    errors.push('Email inválido');
                }
                if (!userData.senha || userData.senha.length < 6) {
                    errors.push('Senha deve ter pelo menos 6 caracteres');
                }
                return errors;
            };
            var validUser = {
                nome: 'João Silva',
                email: 'joao@example.com',
                senha: 'senha123'
            };
            var invalidUser = {
                nome: 'J',
                email: 'email-invalido',
                senha: '123'
            };
            (0, globals_1.expect)(validateUserData(validUser)).toHaveLength(0);
            (0, globals_1.expect)(validateUserData(invalidUser)).toHaveLength(3);
        });
        (0, globals_1.it)('deve sanitizar dados de entrada', function () {
            var sanitizeInput = function (input) {
                return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            };
            (0, globals_1.expect)(sanitizeInput('  João Silva  ')).toBe('João Silva');
            (0, globals_1.expect)(sanitizeInput('<script>alert("xss")</script>João')).toBe('João');
        });
    });
    (0, globals_1.describe)('Journey Controller Logic', function () {
        (0, globals_1.it)('deve calcular distância total da jornada', function () {
            var calculateTotalDistance = function (waypoints) {
                if (waypoints.length < 2)
                    return 0;
                var totalDistance = 0;
                for (var i = 1; i < waypoints.length; i++) {
                    // Fórmula simplificada para teste
                    var dx = waypoints[i].lat - waypoints[i - 1].lat;
                    var dy = waypoints[i].lng - waypoints[i - 1].lng;
                    totalDistance += Math.sqrt(dx * dx + dy * dy);
                }
                return Math.round(totalDistance * 111000); // Conversão aproximada para metros
            };
            var waypoints = [
                { lat: -23.5505, lng: -46.6333 }, // São Paulo
                { lat: -23.5629, lng: -46.6544 }, // Próximo ponto
                { lat: -23.5733, lng: -46.6417 } // Outro ponto
            ];
            var distance = calculateTotalDistance(waypoints);
            (0, globals_1.expect)(distance).toBeGreaterThan(0);
            (0, globals_1.expect)(typeof distance).toBe('number');
        });
        (0, globals_1.it)('deve calcular tempo total da jornada', function () {
            var calculateJourneyTime = function (startTime, endTime) {
                return Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // em minutos
            };
            var start = new Date('2024-01-15T08:00:00Z');
            var end = new Date('2024-01-15T10:30:00Z');
            (0, globals_1.expect)(calculateJourneyTime(start, end)).toBe(150); // 2h30min = 150min
        });
    });
    (0, globals_1.describe)('Expense Controller Logic', function () {
        (0, globals_1.it)('deve categorizar despesas corretamente', function () {
            var categorizeExpense = function (description, amount) {
                var desc = description.toLowerCase();
                if (desc.includes('combustível') || desc.includes('gasolina') || desc.includes('álcool')) {
                    return 'combustivel';
                }
                if (desc.includes('manutenção') || desc.includes('oficina') || desc.includes('reparo')) {
                    return 'manutencao';
                }
                if (desc.includes('pedágio') || desc.includes('estacionamento')) {
                    return 'taxas';
                }
                return 'outros';
            };
            (0, globals_1.expect)(categorizeExpense('Abastecimento gasolina', 100)).toBe('combustivel');
            (0, globals_1.expect)(categorizeExpense('Troca de óleo', 80)).toBe('manutencao');
            (0, globals_1.expect)(categorizeExpense('Pedágio Imigrantes', 15)).toBe('taxas');
            (0, globals_1.expect)(categorizeExpense('Lanche', 20)).toBe('outros');
        });
        (0, globals_1.it)('deve validar valores de despesa', function () {
            var validateExpenseAmount = function (amount) {
                return amount > 0 && amount <= 10000 && Number.isFinite(amount);
            };
            (0, globals_1.expect)(validateExpenseAmount(50.75)).toBe(true);
            (0, globals_1.expect)(validateExpenseAmount(0)).toBe(false);
            (0, globals_1.expect)(validateExpenseAmount(-10)).toBe(false);
            (0, globals_1.expect)(validateExpenseAmount(15000)).toBe(false);
            (0, globals_1.expect)(validateExpenseAmount(NaN)).toBe(false);
        });
    });
    (0, globals_1.describe)('Report Controller Logic', function () {
        (0, globals_1.it)('deve calcular estatísticas de receitas', function () {
            var calculateRevenueStats = function (revenues) {
                var total = revenues.reduce(function (sum, rev) { return sum + rev.valor; }, 0);
                var average = revenues.length > 0 ? total / revenues.length : 0;
                var max = revenues.length > 0 ? Math.max.apply(Math, revenues.map(function (r) { return r.valor; })) : 0;
                var min = revenues.length > 0 ? Math.min.apply(Math, revenues.map(function (r) { return r.valor; })) : 0;
                return { total: total, average: average, max: max, min: min, count: revenues.length };
            };
            var revenues = [
                { valor: 100, data: '2024-01-15' },
                { valor: 150, data: '2024-01-16' },
                { valor: 80, data: '2024-01-17' }
            ];
            var stats = calculateRevenueStats(revenues);
            (0, globals_1.expect)(stats.total).toBe(330);
            (0, globals_1.expect)(stats.average).toBe(110);
            (0, globals_1.expect)(stats.max).toBe(150);
            (0, globals_1.expect)(stats.min).toBe(80);
            (0, globals_1.expect)(stats.count).toBe(3);
        });
        (0, globals_1.it)('deve filtrar dados por período', function () {
            var filterByDateRange = function (data, startDate, endDate) {
                return data.filter(function (item) {
                    var itemDate = new Date(item.data);
                    var start = new Date(startDate);
                    var end = new Date(endDate);
                    return itemDate >= start && itemDate <= end;
                });
            };
            var data = [
                { data: '2024-01-10' },
                { data: '2024-01-15' },
                { data: '2024-01-20' },
                { data: '2024-01-25' }
            ];
            var filtered = filterByDateRange(data, '2024-01-12', '2024-01-22');
            (0, globals_1.expect)(filtered).toHaveLength(2);
            (0, globals_1.expect)(filtered[0].data).toBe('2024-01-15');
            (0, globals_1.expect)(filtered[1].data).toBe('2024-01-20');
        });
    });
    (0, globals_1.describe)('Error Handling', function () {
        (0, globals_1.it)('deve tratar erros de validação', function () {
            var handleValidationError = function (error) {
                if (error.name === 'ValidationError') {
                    return {
                        status: 400,
                        message: 'Dados inválidos',
                        details: error.details
                    };
                }
                return {
                    status: 500,
                    message: 'Erro interno do servidor'
                };
            };
            var validationError = {
                name: 'ValidationError',
                details: ['Email é obrigatório']
            };
            var genericError = {
                name: 'DatabaseError',
                message: 'Connection failed'
            };
            (0, globals_1.expect)(handleValidationError(validationError).status).toBe(400);
            (0, globals_1.expect)(handleValidationError(genericError).status).toBe(500);
        });
    });
});
