"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
// Classes de erro
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        if (message === void 0) { message = 'Não autorizado'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'UnauthorizedError';
        return _this;
    }
    return UnauthorizedError;
}(Error));
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = 'Não encontrado'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'NotFoundError';
        return _this;
    }
    return NotFoundError;
}(Error));
// Schemas de validação otimizados
var dashboardQuerySchema = zod_1.z.object({
    periodo: zod_1.z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
    dataInicio: zod_1.z.string().datetime().optional(),
    dataFim: zod_1.z.string().datetime().optional(),
    idVeiculo: zod_1.z.string().uuid().optional(),
    includeCache: zod_1.z.boolean().default(true),
});
var evolutionQuerySchema = zod_1.z.object({
    periodo: zod_1.z.enum(['semana', 'mes', 'ano']).default('mes'),
    idVeiculo: zod_1.z.string().uuid().optional(),
    granularidade: zod_1.z.enum(['diario', 'semanal', 'mensal']).optional(),
});
var comparisonQuerySchema = zod_1.z.object({
    periodo: zod_1.z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
    dataInicio: zod_1.z.string().datetime().optional(),
    dataFim: zod_1.z.string().datetime().optional(),
    incluirInativos: zod_1.z.boolean().default(false),
});
// Sistema de cache otimizado para dashboards
var DashboardCache = /** @class */ (function () {
    function DashboardCache() {
    }
    DashboardCache.get = function (key) {
        var cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    };
    DashboardCache.set = function (key, data, type) {
        if (type === void 0) { type = 'summaryMonth'; }
        var ttl = DashboardCache.TTL_CONFIG[type] || DashboardCache.TTL_CONFIG.summaryMonth;
        this.cache.set(key, { data: data, timestamp: Date.now(), ttl: ttl });
    };
    DashboardCache.invalidateUser = function (userId) {
        var _this = this;
        var keys = Array.from(this.cache.keys());
        keys.forEach(function (key) {
            if (key.includes(userId)) {
                _this.cache.delete(key);
            }
        });
    };
    DashboardCache.clear = function () {
        this.cache.clear();
    };
    DashboardCache.cache = new Map();
    // TTL diferentes baseados no tipo de consulta
    DashboardCache.TTL_CONFIG = {
        summaryToday: 5 * 60 * 1000, // 5 minutos para dados de hoje
        summaryWeek: 15 * 60 * 1000, // 15 minutos para semana
        summaryMonth: 30 * 60 * 1000, // 30 minutos para mês
        summaryYear: 60 * 60 * 1000, // 1 hora para ano
        evolution: 20 * 60 * 1000, // 20 minutos para evolução
        comparison: 25 * 60 * 1000, // 25 minutos para comparação
    };
    return DashboardCache;
}());
// Utilitários para cálculos otimizados
var DashboardUtils = /** @class */ (function () {
    function DashboardUtils() {
    }
    /**
     * Calcula período com validação robusta
     */
    DashboardUtils.calcularPeriodo = function (periodo, dataInicio, dataFim) {
        var agora = new Date();
        var dataInicioObj;
        var dataFimObj = new Date(agora);
        if (periodo === 'personalizado') {
            if (!dataInicio || !dataFim) {
                throw new Error('Datas de início e fim são obrigatórias para período personalizado');
            }
            dataInicioObj = new Date(dataInicio);
            dataFimObj = new Date(dataFim);
            if (isNaN(dataInicioObj.getTime()) || isNaN(dataFimObj.getTime())) {
                throw new Error('Datas fornecidas são inválidas');
            }
            if (dataInicioObj > dataFimObj) {
                throw new Error('Data de início não pode ser posterior à data de fim');
            }
            // Limit para evitar queries muito pesadas (máx 2 anos)
            var diffDays = (dataFimObj.getTime() - dataInicioObj.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays > 730) {
                throw new Error('Período máximo permitido é de 2 anos');
            }
        }
        else {
            switch (periodo) {
                case 'hoje':
                    dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
                    dataFimObj = new Date(dataInicioObj);
                    dataFimObj.setDate(dataFimObj.getDate() + 1);
                    break;
                case 'semana':
                    dataInicioObj = new Date(agora);
                    dataInicioObj.setDate(agora.getDate() - 7);
                    break;
                case 'mes':
                    dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1);
                    break;
                case 'ano':
                    dataInicioObj = new Date(agora.getFullYear(), 0, 1);
                    break;
                default:
                    dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1);
            }
        }
        return { dataInicio: dataInicioObj, dataFim: dataFimObj };
    };
    /**
     * Constrói condições WHERE base otimizadas
     */
    DashboardUtils.buildBaseConditions = function (userId, dataInicio, dataFim, idVeiculo, tableName) {
        if (tableName === void 0) { tableName = 'jornadas'; }
        var table = tableName === 'jornadas' ? schema_postgres_1.jornadas :
            tableName === 'abastecimentos' ? schema_postgres_1.abastecimentos : schema_postgres_1.despesas;
        var dateField = tableName === 'jornadas' ? schema_postgres_1.jornadas.dataFim :
            tableName === 'abastecimentos' ? schema_postgres_1.abastecimentos.dataAbastecimento :
                schema_postgres_1.despesas.dataDespesa;
        var conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(table.idUsuario, userId), (0, drizzle_orm_1.gte)(dateField, dataInicio), (0, drizzle_orm_1.lte)(dateField, dataFim), (0, drizzle_orm_1.isNull)(table.deletedAt));
        if (tableName === 'jornadas') {
            conditions = (0, drizzle_orm_1.and)(conditions, (0, drizzle_orm_1.isNotNull)(schema_postgres_1.jornadas.dataFim));
        }
        if (idVeiculo) {
            conditions = (0, drizzle_orm_1.and)(conditions, (0, drizzle_orm_1.eq)(table.idVeiculo, idVeiculo));
        }
        return conditions;
    };
    /**
     * Formata valores monetários
     */
    DashboardUtils.formatCurrency = function (value) {
        return Math.round(value * 100) / 100;
    };
    /**
     * Calcula performance score baseado em métricas
     */
    DashboardUtils.calculatePerformanceScore = function (metrics) {
        var score = 0;
        // Margem de lucro (40% do score)
        if (metrics.margemLucro > 30)
            score += 40;
        else if (metrics.margemLucro > 20)
            score += 30;
        else if (metrics.margemLucro > 10)
            score += 20;
        else if (metrics.margemLucro > 0)
            score += 10;
        // Ganho por hora (30% do score)
        if (metrics.ganhoPorHora > 30)
            score += 30;
        else if (metrics.ganhoPorHora > 20)
            score += 25;
        else if (metrics.ganhoPorHora > 15)
            score += 20;
        else if (metrics.ganhoPorHora > 10)
            score += 15;
        // Custo por KM (20% do score - inverso)
        if (metrics.custoPorKm < 0.5)
            score += 20;
        else if (metrics.custoPorKm < 1.0)
            score += 15;
        else if (metrics.custoPorKm < 1.5)
            score += 10;
        else if (metrics.custoPorKm < 2.0)
            score += 5;
        // Número de jornadas (10% do score)
        if (metrics.numeroJornadas > 50)
            score += 10;
        else if (metrics.numeroJornadas > 30)
            score += 8;
        else if (metrics.numeroJornadas > 10)
            score += 5;
        return Math.min(score, 100);
    };
    return DashboardUtils;
}());
// Serviço otimizado para cálculos agregados
var DashboardCalculations = /** @class */ (function () {
    function DashboardCalculations() {
    }
    /**
     * Calcula todas as métricas em uma única query otimizada
     */
    DashboardCalculations.calcularTodasMetricas = function (userId, dataInicio, dataFim, idVeiculo) {
        return __awaiter(this, void 0, void 0, function () {
            var jornadasConditions, jornadasResult, abastecimentosConditions, despesasConditions, _a, abastecimentosResult, despesasResult, faturamentoBruto, totalCombustivel, totalOutrasDespesas, totalDespesas, lucroLiquido, kmTotal, numeroJornadas, tempoTotalTrabalhadoMinutos;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        jornadasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'jornadas');
                        return [4 /*yield*/, db_1.db
                                .select({
                                faturamentoBruto: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.jornadas.ganhoBruto),
                                kmTotal: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["COUNT(*)"], ["COUNT(*)"]))),
                                tempoTotal: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          COALESCE(\n            SUM(\n              CASE \n                WHEN ", " IS NOT NULL AND ", " IS NOT NULL\n                THEN (CAST(strftime('%s', ", ") AS INTEGER) - CAST(strftime('%s', ", ") AS INTEGER)) / 60\n                ELSE 0 \n              END\n            ), \n            0\n          )\n        "], ["\n          COALESCE(\n            SUM(\n              CASE \n                WHEN ", " IS NOT NULL AND ", " IS NOT NULL\n                THEN (CAST(strftime('%s', ", ") AS INTEGER) - CAST(strftime('%s', ", ") AS INTEGER)) / 60\n                ELSE 0 \n              END\n            ), \n            0\n          )\n        "])), schema_postgres_1.jornadas.dataFim, schema_postgres_1.jornadas.dataInicio, schema_postgres_1.jornadas.dataFim, schema_postgres_1.jornadas.dataInicio)
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(jornadasConditions)];
                    case 1:
                        jornadasResult = (_d.sent())[0];
                        abastecimentosConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'abastecimentos');
                        despesasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'despesas');
                        return [4 /*yield*/, Promise.all([
                                db_1.db.select({ total: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.abastecimentos.valorTotal) })
                                    .from(schema_postgres_1.abastecimentos)
                                    .where(abastecimentosConditions),
                                db_1.db.select({
                                    tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                                    total: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.despesas.valorDespesa)
                                })
                                    .from(schema_postgres_1.despesas)
                                    .where(despesasConditions)
                                    .groupBy(schema_postgres_1.despesas.tipoDespesa)
                            ])];
                    case 2:
                        _a = _d.sent(), abastecimentosResult = _a[0], despesasResult = _a[1];
                        faturamentoBruto = Number(jornadasResult.faturamentoBruto);
                        totalCombustivel = Number(((_b = abastecimentosResult[0]) === null || _b === void 0 ? void 0 : _b.total) || 0);
                        totalOutrasDespesas = Number(((_c = despesasResult[0]) === null || _c === void 0 ? void 0 : _c.total) || 0);
                        totalDespesas = totalCombustivel + totalOutrasDespesas;
                        lucroLiquido = faturamentoBruto - totalDespesas;
                        kmTotal = Number(jornadasResult.kmTotal);
                        numeroJornadas = Number(jornadasResult.numeroJornadas);
                        tempoTotalTrabalhadoMinutos = Number(jornadasResult.tempoTotal);
                        return [2 /*return*/, {
                                faturamentoBruto: DashboardUtils.formatCurrency(faturamentoBruto),
                                totalDespesas: DashboardUtils.formatCurrency(totalDespesas),
                                lucroLiquido: DashboardUtils.formatCurrency(lucroLiquido),
                                margemLucro: faturamentoBruto > 0 ? DashboardUtils.formatCurrency((lucroLiquido / faturamentoBruto) * 100) : 0,
                                kmTotal: DashboardUtils.formatCurrency(kmTotal),
                                custoPorKm: kmTotal > 0 ? DashboardUtils.formatCurrency(totalDespesas / kmTotal) : 0,
                                numeroJornadas: numeroJornadas,
                                ganhoMedioPorJornada: numeroJornadas > 0 ? DashboardUtils.formatCurrency(faturamentoBruto / numeroJornadas) : 0,
                                tempoTotalTrabalhadoMinutos: tempoTotalTrabalhadoMinutos,
                                ganhoPorHora: tempoTotalTrabalhadoMinutos > 0 ? DashboardUtils.formatCurrency(faturamentoBruto / (tempoTotalTrabalhadoMinutos / 60)) : 0,
                            }];
                }
            });
        });
    };
    /**
     * Calcula distribuição de despesas otimizada
     */
    DashboardCalculations.calcularDistribuicaoDespesas = function (userId, dataInicio, dataFim, idVeiculo) {
        return __awaiter(this, void 0, void 0, function () {
            var abastecimentosConditions, despesasConditions, _a, combustivelResult, despesasResult, distribuicao;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        abastecimentosConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'abastecimentos');
                        despesasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'despesas');
                        return [4 /*yield*/, Promise.all([
                                db_1.db.select({ total: (0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.abastecimentos.valorTotal) })
                                    .from(schema_postgres_1.abastecimentos)
                                    .where(abastecimentosConditions),
                                db_1.db.select({
                                    tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                                    total: (0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["COALESCE(SUM(", "), 0)"], ["COALESCE(SUM(", "), 0)"])), schema_postgres_1.despesas.valorDespesa)
                                })
                                    .from(schema_postgres_1.despesas)
                                    .where(despesasConditions)
                                    .groupBy(schema_postgres_1.despesas.tipoDespesa)
                            ])];
                    case 1:
                        _a = _c.sent(), combustivelResult = _a[0], despesasResult = _a[1];
                        distribuicao = [
                            {
                                categoria: 'Combustível',
                                valor: DashboardUtils.formatCurrency(Number(((_b = combustivelResult[0]) === null || _b === void 0 ? void 0 : _b.total) || 0))
                            }
                        ];
                        despesasResult.forEach(function (categoria) {
                            distribuicao.push({
                                categoria: categoria.tipoDespesa || 'Outros',
                                valor: DashboardUtils.formatCurrency(Number(categoria.total || 0))
                            });
                        });
                        return [2 /*return*/, distribuicao];
                }
            });
        });
    };
    /**
     * Calcula dados de evolução otimizada com granularidade
     */
    DashboardCalculations.calcularDadosEvolucao = function (userId_1, periodo_1, idVeiculo_1) {
        return __awaiter(this, arguments, void 0, function (userId, periodo, idVeiculo, granularidade) {
            var agora, dadosEvolucao, numeroPeriodos, intervaloDias, batchSize, batchStart, batchEnd, batchPromises, _loop_1, this_1, i, batchResults;
            if (granularidade === void 0) { granularidade = 'diario'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        agora = new Date();
                        dadosEvolucao = [];
                        switch (periodo) {
                            case 'semana':
                                numeroPeriodos = granularidade === 'diario' ? 7 : 1;
                                intervaloDias = granularidade === 'diario' ? 1 : 7;
                                break;
                            case 'mes':
                                numeroPeriodos = granularidade === 'diario' ? 30 : (granularidade === 'semanal' ? 4 : 1);
                                intervaloDias = granularidade === 'diario' ? 1 : (granularidade === 'semanal' ? 7 : 30);
                                break;
                            case 'ano':
                                numeroPeriodos = 12;
                                intervaloDias = 30;
                                break;
                            default:
                                numeroPeriodos = 30;
                                intervaloDias = 1;
                        }
                        batchSize = 10;
                        batchStart = 0;
                        _a.label = 1;
                    case 1:
                        if (!(batchStart < numeroPeriodos)) return [3 /*break*/, 4];
                        batchEnd = Math.min(batchStart + batchSize, numeroPeriodos);
                        batchPromises = [];
                        _loop_1 = function (i) {
                            var periodIndex = numeroPeriodos - 1 - i;
                            var dataFim = new Date(agora);
                            dataFim.setDate(agora.getDate() - (periodIndex * intervaloDias));
                            var dataInicio = new Date(dataFim);
                            dataInicio.setDate(dataFim.getDate() - intervaloDias + 1);
                            batchPromises.push(this_1.calcularTodasMetricas(userId, dataInicio, dataFim, idVeiculo)
                                .then(function (metrics) { return ({
                                data: dataFim.toISOString().split('T')[0],
                                faturamentoBruto: metrics.faturamentoBruto,
                                totalDespesas: metrics.totalDespesas,
                                lucroLiquido: metrics.lucroLiquido,
                                numeroJornadas: metrics.numeroJornadas,
                                kmTotal: metrics.kmTotal,
                            }); }));
                        };
                        this_1 = this;
                        for (i = batchStart; i < batchEnd; i++) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, Promise.all(batchPromises)];
                    case 2:
                        batchResults = _a.sent();
                        dadosEvolucao.push.apply(dadosEvolucao, batchResults);
                        _a.label = 3;
                    case 3:
                        batchStart += batchSize;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, dadosEvolucao.sort(function (a, b) { return a.data.localeCompare(b.data); })];
                }
            });
        });
    };
    return DashboardCalculations;
}());
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
