"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.ReportsService = void 0;
// @ts-nocheck
// @ts-nocheck
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var dateUtils_1 = require("../utils/dateUtils");
var statisticsCalculator_1 = require("../utils/statisticsCalculator");
var logger_1 = require("../utils/logger");
var ReportsService = /** @class */ (function () {
    function ReportsService() {
    }
    /**
     * Gera relatório semanal otimizado
     */
    ReportsService.generateWeeklyReport = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, startDate, endDate, vehicleId, _a, includeDetails, _b, includeCharts, _c, dataInicio, dataFim, _d, financialData, dailyEvolution, expenseCategories, topJourneys, indicators, benchmarks, _e, _f;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        userId = params.userId, startDate = params.startDate, endDate = params.endDate, vehicleId = params.vehicleId, _a = params.includeDetails, includeDetails = _a === void 0 ? true : _a, _b = params.includeCharts, includeCharts = _b === void 0 ? false : _b;
                        _c = dateUtils_1.DateUtils.calculateWeeklyPeriod(startDate, endDate), dataInicio = _c.dataInicio, dataFim = _c.dataFim;
                        ReportsService.LoggerInstance.info("Gerando relatório semanal", {
                            userId: userId,
                            dataInicio: dataInicio,
                            dataFim: dataFim,
                            vehicleId: vehicleId
                        });
                        return [4 /*yield*/, Promise.all([
                                ReportsService.getFinancialSummary(userId, dataInicio, dataFim, vehicleId),
                                includeDetails ? ReportsService.getDailyEvolution(userId, dataInicio, dataFim, vehicleId) : null,
                                includeDetails ? ReportsService.getExpensesByCategory(userId, dataInicio, dataFim, vehicleId) : null,
                                includeDetails ? ReportsService.getTopJourneys(userId, vehicleId, 10, dataInicio, dataFim) : null
                            ])];
                    case 1:
                        _d = _h.sent(), financialData = _d[0], dailyEvolution = _d[1], expenseCategories = _d[2], topJourneys = _d[3];
                        indicators = statisticsCalculator_1.StatisticsCalculator.calculateIndicators(financialData);
                        return [4 /*yield*/, ReportsService.calculateBenchmarks(userId, vehicleId)];
                    case 2:
                        benchmarks = _h.sent();
                        _e = [__assign({ periodo: {
                                    tipo: "semanal",
                                    dataInicio: dataInicio.toISOString(),
                                    dataFim: dataFim.toISOString(),
                                    descricao: dateUtils_1.DateUtils.formatPeriod(dataInicio, dataFim)
                                }, filtros: { idVeiculo: vehicleId || null }, resumo_financeiro: financialData, indicadores: indicators, benchmarks: benchmarks }, (includeDetails && {
                                evolucao_diaria: dailyEvolution,
                                detalhamento_despesas: expenseCategories,
                                top_jornadas: topJourneys
                            }))];
                        _f = includeCharts;
                        if (!_f) return [3 /*break*/, 4];
                        _g = {};
                        return [4 /*yield*/, ReportsService.generateChartData(financialData, dailyEvolution)];
                    case 3:
                        _f = (_g.graficos = _h.sent(),
                            _g);
                        _h.label = 4;
                    case 4: return [2 /*return*/, __assign.apply(void 0, _e.concat([(_f)]))];
                }
            });
        });
    };
    /**
     * Gera relatório mensal otimizado
     */
    ReportsService.generateMonthlyReport = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, startDate, endDate, vehicleId, _a, includeDetails, _b, includeCharts, _c, dataInicio, dataFim, _d, financialData, weeklyBreakdown, expenseCategories, performanceMetrics, indicators, trends, _e, _f;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        userId = params.userId, startDate = params.startDate, endDate = params.endDate, vehicleId = params.vehicleId, _a = params.includeDetails, includeDetails = _a === void 0 ? true : _a, _b = params.includeCharts, includeCharts = _b === void 0 ? false : _b;
                        _c = dateUtils_1.DateUtils.calculateMonthlyPeriod(startDate, endDate), dataInicio = _c.dataInicio, dataFim = _c.dataFim;
                        ReportsService.LoggerInstance.info("Gerando relatório mensal", {
                            userId: userId,
                            dataInicio: dataInicio,
                            dataFim: dataFim,
                            vehicleId: vehicleId
                        });
                        return [4 /*yield*/, Promise.all([
                                ReportsService.getFinancialSummary(userId, dataInicio, dataFim, vehicleId),
                                includeDetails ? ReportsService.getWeeklyBreakdown(userId, dataInicio, dataFim, vehicleId) : null,
                                includeDetails ? ReportsService.getExpensesByCategory(userId, dataInicio, dataFim, vehicleId) : null,
                                includeDetails ? ReportsService.getPerformanceMetrics(userId, dataInicio, dataFim, vehicleId) : null
                            ])];
                    case 1:
                        _d = _h.sent(), financialData = _d[0], weeklyBreakdown = _d[1], expenseCategories = _d[2], performanceMetrics = _d[3];
                        indicators = statisticsCalculator_1.StatisticsCalculator.calculateIndicators(financialData);
                        trends = includeDetails ? statisticsCalculator_1.StatisticsCalculator.calculateTrends(weeklyBreakdown || []) : null;
                        _e = [__assign({ periodo: {
                                    tipo: "mensal",
                                    dataInicio: dataInicio.toISOString(),
                                    dataFim: dataFim.toISOString(),
                                    descricao: dateUtils_1.DateUtils.formatPeriod(dataInicio, dataFim)
                                }, filtros: { idVeiculo: vehicleId || null }, resumo_financeiro: financialData, indicadores: indicators, tendencias: trends }, (includeDetails && {
                                breakdown_semanal: weeklyBreakdown,
                                detalhamento_despesas: expenseCategories,
                                metricas_performance: performanceMetrics
                            }))];
                        _f = includeCharts;
                        if (!_f) return [3 /*break*/, 3];
                        _g = {};
                        return [4 /*yield*/, ReportsService.generateChartData(financialData, weeklyBreakdown)];
                    case 2:
                        _f = (_g.graficos = _h.sent(),
                            _g);
                        _h.label = 3;
                    case 3: return [2 /*return*/, __assign.apply(void 0, _e.concat([(_f)]))];
                }
            });
        });
    };
    /**
     * Gera comparativo semanal com análise avançada
     */
    ReportsService.generateWeeklyComparison = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, numberOfWeeks, vehicleId, _b, includeTrends, _c, includePredictions, periods, now, weekPromises, _loop_1, i, weeklyData, statistics, trends, predictions, insights;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = params.userId, _a = params.numberOfWeeks, numberOfWeeks = _a === void 0 ? 4 : _a, vehicleId = params.vehicleId, _b = params.includeTrends, includeTrends = _b === void 0 ? true : _b, _c = params.includePredictions, includePredictions = _c === void 0 ? false : _c;
                        periods = [];
                        now = new Date();
                        weekPromises = [];
                        _loop_1 = function (i) {
                            var _e = dateUtils_1.DateUtils.calculateWeekOffset(now, i), startDate = _e.startDate, endDate = _e.endDate;
                            weekPromises.push(ReportsService.getFinancialSummary(userId, startDate, endDate, vehicleId)
                                .then(function (data) { return (__assign({ numero_semana: i + 1, periodo: dateUtils_1.DateUtils.formatPeriod(startDate, endDate), dataInicio: startDate, dataFim: endDate }, data)); }));
                        };
                        for (i = 0; i < numberOfWeeks; i++) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, Promise.all(weekPromises)];
                    case 1:
                        weeklyData = _d.sent();
                        periods.push.apply(periods, weeklyData.reverse());
                        statistics = statisticsCalculator_1.StatisticsCalculator.calculateComparisonStatistics(periods);
                        trends = includeTrends ? statisticsCalculator_1.StatisticsCalculator.calculateTrends(periods) : null;
                        predictions = includePredictions ? statisticsCalculator_1.StatisticsCalculator.generatePredictions(periods) : null;
                        insights = statisticsCalculator_1.StatisticsCalculator.generateInsights(periods, statistics, trends);
                        return [2 /*return*/, {
                                periods: periods,
                                statistics: statistics,
                                trends: trends,
                                predictions: predictions,
                                insights: insights
                            }];
                }
            });
        });
    };
    /**
     * Gera comparativo mensal com sazonalidade
     */
    ReportsService.generateMonthlyComparison = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, numberOfMonths, vehicleId, _b, includeTrends, _c, includePredictions, periods, now, monthPromises, _loop_2, i, monthlyData, statistics, trends, seasonality, predictions, insights;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = params.userId, _a = params.numberOfMonths, numberOfMonths = _a === void 0 ? 6 : _a, vehicleId = params.vehicleId, _b = params.includeTrends, includeTrends = _b === void 0 ? true : _b, _c = params.includePredictions, includePredictions = _c === void 0 ? false : _c;
                        periods = [];
                        now = new Date();
                        monthPromises = [];
                        _loop_2 = function (i) {
                            var _e = dateUtils_1.DateUtils.calculateMonthOffset(now, i), startDate = _e.startDate, endDate = _e.endDate;
                            monthPromises.push(ReportsService.getFinancialSummary(userId, startDate, endDate, vehicleId)
                                .then(function (data) { return (__assign({ mes_ano: dateUtils_1.DateUtils.formatMonthYear(startDate), periodo: dateUtils_1.DateUtils.formatPeriod(startDate, endDate), dataInicio: startDate, dataFim: endDate }, data)); }));
                        };
                        for (i = 0; i < numberOfMonths; i++) {
                            _loop_2(i);
                        }
                        return [4 /*yield*/, Promise.all(monthPromises)];
                    case 1:
                        monthlyData = _d.sent();
                        periods.push.apply(periods, monthlyData.reverse());
                        statistics = statisticsCalculator_1.StatisticsCalculator.calculateComparisonStatistics(periods);
                        trends = includeTrends ? statisticsCalculator_1.StatisticsCalculator.calculateTrends(periods) : null;
                        seasonality = statisticsCalculator_1.StatisticsCalculator.analyzeSeasonality(periods);
                        predictions = includePredictions ? statisticsCalculator_1.StatisticsCalculator.generatePredictions(periods) : null;
                        insights = statisticsCalculator_1.StatisticsCalculator.generateInsights(periods, statistics, trends);
                        return [2 /*return*/, {
                                periods: periods,
                                statistics: statistics,
                                trends: trends,
                                seasonality: seasonality,
                                predictions: predictions,
                                insights: insights
                            }];
                }
            });
        });
    };
    /**
     * Resumo financeiro otimizado com consulta única
     */
    ReportsService.getFinancialSummary = function (userId, startDate, endDate, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, revenueResult, fuelResult, expensesResult, kmResult, journeysResult, faturamentoBruto, gastoCombustivel, outrasDespesas, totalDespesas, lucroLiquido, kmTotal, numeroJornadas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            db_1.db.select({ total: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto) }).from(schema_postgres_1.jornadas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataFim, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataFim, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt))).then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
                            db_1.db.select({ total: (0, drizzle_orm_1.sum)(schema_postgres_1.abastecimentos.valorTotal) }).from(schema_postgres_1.abastecimentos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.abastecimentos.dataAbastecimento, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.abastecimentos.dataAbastecimento, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt))).then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
                            db_1.db.select({ total: (0, drizzle_orm_1.sum)(schema_postgres_1.despesas.valorDespesa) }).from(schema_postgres_1.despesas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt))).then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
                            db_1.db.select({ total: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal) }).from(schema_postgres_1.jornadas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataFim, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataFim, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt))).then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
                            db_1.db.select({ count: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id) }).from(schema_postgres_1.jornadas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataFim, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataFim, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt))).then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.count) || 0; })
                        ])];
                    case 1:
                        _a = _b.sent(), revenueResult = _a[0], fuelResult = _a[1], expensesResult = _a[2], kmResult = _a[3], journeysResult = _a[4];
                        faturamentoBruto = Number(revenueResult || 0);
                        gastoCombustivel = Number(fuelResult || 0);
                        outrasDespesas = Number(expensesResult || 0);
                        totalDespesas = gastoCombustivel + outrasDespesas;
                        lucroLiquido = faturamentoBruto - totalDespesas;
                        kmTotal = Number(kmResult || 0);
                        numeroJornadas = Number(journeysResult || 0);
                        return [2 /*return*/, statisticsCalculator_1.StatisticsCalculator.calculateFinancialMetrics({
                                faturamentoBruto: faturamentoBruto,
                                gastoCombustivel: gastoCombustivel,
                                outrasDespesas: outrasDespesas,
                                totalDespesas: totalDespesas,
                                lucroLiquido: lucroLiquido,
                                kmTotal: kmTotal,
                                numeroJornadas: numeroJornadas
                            })];
                }
            });
        });
    };
    /**
     * Evolução diária otimizada
     */
    ReportsService.getDailyEvolution = function (userId, startDate, endDate, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var days, batchSize, batches, i, batch, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        days = dateUtils_1.DateUtils.getDaysBetween(startDate, endDate);
                        batchSize = 7;
                        batches = [];
                        for (i = 0; i < days.length; i += batchSize) {
                            batch = days.slice(i, i + batchSize);
                            batches.push(Promise.all(batch.map(function (day) { return __awaiter(_this, void 0, void 0, function () {
                                var dayEnd, summary;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            dayEnd = new Date(day);
                                            dayEnd.setHours(23, 59, 59, 999);
                                            return [4 /*yield*/, ReportsService.getFinancialSummary(userId, day, dayEnd, vehicleId)];
                                        case 1:
                                            summary = _a.sent();
                                            return [2 /*return*/, __assign({ data: day.toISOString().split("T")[0] }, summary)];
                                    }
                                });
                            }); })));
                        }
                        return [4 /*yield*/, Promise.all(batches)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.flat()];
                }
            });
        });
    };
    /**
     * Detalhamento semanal otimizado
     */
    ReportsService.getWeeklyBreakdown = function (userId, startDate, endDate, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var weeks, weeklyData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weeks = dateUtils_1.DateUtils.getWeeksBetween(startDate, endDate);
                        return [4 /*yield*/, Promise.all(weeks.map(function (week) { return __awaiter(_this, void 0, void 0, function () {
                                var summary;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ReportsService.getFinancialSummary(userId, week.startDate, week.endDate, vehicleId)];
                                        case 1:
                                            summary = _a.sent();
                                            return [2 /*return*/, __assign({ semana: week.weekNumber, dataInicio: week.startDate, dataFim: week.endDate }, summary)];
                                    }
                                });
                            }); }))];
                    case 1:
                        weeklyData = _a.sent();
                        return [2 /*return*/, weeklyData];
                }
            });
        });
    };
    /**
     * Despesas por categoria otimizadas
     */
    ReportsService.getExpensesByCategory = function (userId, startDate, endDate, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var conditions, expenses, groupedExpenses, totalExpenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conditions = [
                            (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId),
                            (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, startDate),
                            (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, endDate),
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt),
                        ];
                        if (vehicleId) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                                valorDespesa: schema_postgres_1.despesas.valorDespesa,
                            })
                                .from(schema_postgres_1.despesas)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))];
                    case 1:
                        expenses = _a.sent();
                        groupedExpenses = expenses.reduce(function (acc, expense) {
                            var category = expense.tipoDespesa;
                            acc[category] = (acc[category] || 0) + (Number(expense.valorDespesa) || 0);
                            return acc;
                        }, {});
                        totalExpenses = Object.values(groupedExpenses).reduce(function (sum, val) { return sum + val; }, 0);
                        return [2 /*return*/, Object.entries(groupedExpenses).map(function (_a) {
                                var category = _a[0], total = _a[1];
                                return ({
                                    categoria: category,
                                    total_gasto: Math.round(total),
                                    percentual: totalExpenses > 0 ? Math.round((total / totalExpenses) * 10000) / 100 : 0,
                                });
                            })];
                }
            });
        });
    };
    /**
     * Top jornadas por ganho
     */
    ReportsService.getTopJourneys = function (userId_1, vehicleId_1) {
        return __awaiter(this, arguments, void 0, function (userId, vehicleId, limit, startDate, endDate) {
            var conditions, topJourneys;
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conditions = [
                            (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId),
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt),
                        ];
                        if (vehicleId) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId));
                        }
                        if (startDate) {
                            conditions.push((0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate));
                        }
                        if (endDate) {
                            conditions.push((0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.jornadas.id,
                                dataInicio: schema_postgres_1.jornadas.dataInicio,
                                ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                                kmTotal: schema_postgres_1.jornadas.kmTotal,
                                observacoes: schema_postgres_1.jornadas.observacoes,
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.jornadas.ganhoBruto))
                                .limit(limit)];
                    case 1:
                        topJourneys = _a.sent();
                        return [2 /*return*/, topJourneys.map(function (j) { return (__assign(__assign({}, j), { ganhoBruto: Math.round(Number(j.ganhoBruto) || 0), kmTotal: Math.round(Number(j.kmTotal) || 0) })); })];
                }
            });
        });
    };
    /**
     * Métricas de performance de jornadas
     */
    ReportsService.getPerformanceMetrics = function (userId, startDate, endDate, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var conditions, result, metrics, totalGanhoBruto, totalKm, totalTempo, countJornadas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conditions = [
                            (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId),
                            (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate),
                            (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate),
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt),
                        ];
                        if (vehicleId) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                totalGanhoBruto: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                totalTempo: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.tempoTotal),
                                countJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))];
                    case 1:
                        result = _a.sent();
                        metrics = result[0];
                        totalGanhoBruto = Number(metrics.totalGanhoBruto) || 0;
                        totalKm = Number(metrics.totalKm) || 0;
                        totalTempo = Number(metrics.totalTempo) || 0;
                        countJornadas = Number(metrics.countJornadas) || 0;
                        return [2 /*return*/, {
                                total_ganhoBruto: Math.round(totalGanhoBruto),
                                total_km: Math.round(totalKm),
                                total_tempo_minutos: Math.round(totalTempo),
                                numero_jornadas: countJornadas,
                                ganho_medio_por_jornada: countJornadas > 0 ? Math.round(totalGanhoBruto / countJornadas) : 0,
                                ganho_medio_por_km: totalKm > 0 ? Math.round(totalGanhoBruto / totalKm) : 0,
                                velocidade_media_kmh: totalTempo > 0 ? Math.round((totalKm / totalTempo) * 60) : 0,
                            }];
                }
            });
        });
    };
    /**
     * Calcula benchmarks de performance
     */
    ReportsService.calculateBenchmarks = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var conditions, result, avgMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conditions = [
                            (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId),
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt),
                        ];
                        if (vehicleId) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                avgGanhoBruto: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.ganhoBruto),
                                avgKm: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.kmTotal),
                                avgTempo: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.tempoTotal),
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))];
                    case 1:
                        result = _a.sent();
                        avgMetrics = result[0];
                        return [2 /*return*/, {
                                media_ganhoBruto_jornada: Math.round(Number(avgMetrics.avgGanhoBruto) || 0),
                                media_km_jornada: Math.round(Number(avgMetrics.avgKm) || 0),
                                media_tempo_jornada_minutos: Math.round(Number(avgMetrics.avgTempo) || 0),
                                // Adicionar benchmarks de consumo de combustível, despesas, etc.
                            }];
                }
            });
        });
    };
    /**
     * Gera dados para gráficos
     */
    ReportsService.generateChartData = function (financialSummary, dailyEvolution) {
        return __awaiter(this, void 0, void 0, function () {
            var dailyRevenueChart, expenseCategoryChart;
            return __generator(this, function (_a) {
                dailyRevenueChart = dailyEvolution ? dailyEvolution.map(function (day) { return ({
                    data: day.data,
                    faturamento: day.faturamento_bruto,
                }); }) : [];
                expenseCategoryChart = financialSummary.detalhamento_despesas || [];
                return [2 /*return*/, {
                        dailyRevenue: dailyRevenueChart,
                        expenseCategories: expenseCategoryChart,
                    }];
            });
        });
    };
    /**
     * Validações de dados e consistência para relatórios.
     */
    ReportsService.validateReportData = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, incompleteJourneys, inconsistentFuelings, undefinedExpenses, ninetyDaysAgo, inactiveVehicles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        issues = [];
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.jornadas.id,
                                dataInicio: schema_postgres_1.jornadas.dataInicio,
                                kmInicio: schema_postgres_1.jornadas.kmInicio,
                                dataFim: schema_postgres_1.jornadas.dataFim,
                                kmFim: schema_postgres_1.jornadas.kmFim,
                            })
                                .from(schema_postgres_1.jornadas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt), ((0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.dataFim) || (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.kmFim) || (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " < ", ""], ["", " < ", ""])), schema_postgres_1.jornadas.kmFim, schema_postgres_1.jornadas.kmInicio))))];
                    case 1:
                        incompleteJourneys = _a.sent();
                        if (incompleteJourneys.length > 0) {
                            issues.push({
                                type: "Jornada Incompleta/Inválida",
                                description: "Jornadas com KM final ausente ou menor que o KM inicial.",
                                count: incompleteJourneys.length,
                                details: incompleteJourneys.map(function (j) { return ({
                                    id: j.id,
                                    dataInicio: j.dataInicio,
                                    kmInicio: j.kmInicio,
                                    kmFim: j.kmFim,
                                }); }),
                            });
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.abastecimentos.id,
                                dataAbastecimento: schema_postgres_1.abastecimentos.dataAbastecimento,
                                valorLitro: schema_postgres_1.abastecimentos.valorLitro,
                                litros: schema_postgres_1.abastecimentos.litros,
                                valorTotal: schema_postgres_1.abastecimentos.valorTotal,
                            })
                                .from(schema_postgres_1.abastecimentos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt), (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " <> ", " * ", ""], ["", " <> ", " * ", ""])), schema_postgres_1.abastecimentos.valorTotal, schema_postgres_1.abastecimentos.valorLitro, schema_postgres_1.abastecimentos.litros)))];
                    case 2:
                        inconsistentFuelings = _a.sent();
                        if (inconsistentFuelings.length > 0) {
                            issues.push({
                                type: "Abastecimento Inconsistente",
                                description: "Abastecimentos com valor total diferente do calculado (valorLitro * quantidadeLitros).",
                                count: inconsistentFuelings.length,
                                details: inconsistentFuelings.map(function (a) { return ({
                                    id: a.id,
                                    data: a.dataAbastecimento,
                                    valorCalculado: (Number(a.valorLitro) * Number(a.litros)).toFixed(2),
                                    valorRegistrado: Number(a.valorTotal).toFixed(2),
                                }); }),
                            });
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.despesas.id,
                                dataDespesa: schema_postgres_1.despesas.dataDespesa,
                                valorDespesa: schema_postgres_1.despesas.valorDespesa,
                                tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                            })
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.tipoDespesa) // Ou eq(despesas.tipoDespesa, "outros") se for um default
                            ))];
                    case 3:
                        undefinedExpenses = _a.sent();
                        if (undefinedExpenses.length > 0) {
                            issues.push({
                                type: "Despesa sem Tipo",
                                description: "Despesas registradas sem um tipo definido.",
                                count: undefinedExpenses.length,
                                details: undefinedExpenses.map(function (d) { return ({
                                    id: d.id,
                                    data: d.dataDespesa,
                                    valor: Number(d.valorDespesa).toFixed(2),
                                }); }),
                            });
                        }
                        ninetyDaysAgo = new Date();
                        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                        return [4 /*yield*/, db_1.db.all((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT v.id, v.marca, v.modelo\n      FROM veiculos v\n      WHERE v.idUsuario = ", "\n      AND v.deletedAt IS NULL\n      AND NOT EXISTS (\n        SELECT 1 FROM jornadas j\n        WHERE j.idVeiculo = v.id\n        AND j.deletedAt IS NULL\n        AND j.dataFim >= ", "\n      )\n      AND NOT EXISTS (\n        SELECT 1 FROM abastecimentos a\n        WHERE a.idVeiculo = v.id\n        AND a.deletedAt IS NULL\n        AND a.dataAbastecimento >= ", "\n      )\n    "], ["\n      SELECT v.id, v.marca, v.modelo\n      FROM veiculos v\n      WHERE v.idUsuario = ", "\n      AND v.deletedAt IS NULL\n      AND NOT EXISTS (\n        SELECT 1 FROM jornadas j\n        WHERE j.idVeiculo = v.id\n        AND j.deletedAt IS NULL\n        AND j.dataFim >= ", "\n      )\n      AND NOT EXISTS (\n        SELECT 1 FROM abastecimentos a\n        WHERE a.idVeiculo = v.id\n        AND a.deletedAt IS NULL\n        AND a.dataAbastecimento >= ", "\n      )\n    "])), userId, Math.floor(ninetyDaysAgo.getTime() / 1000), Math.floor(ninetyDaysAgo.getTime() / 1000)))];
                    case 4:
                        inactiveVehicles = _a.sent();
                        if (inactiveVehicles.length > 0) {
                            issues.push({
                                type: "Veículo Inativo",
                                description: "Veículos sem jornadas ou abastecimentos registrados nos últimos 90 dias.",
                                count: inactiveVehicles.length,
                                details: inactiveVehicles.map(function (v) { return ({
                                    id: v.id,
                                    marca: v.marca,
                                    modelo: v.modelo,
                                }); }),
                            });
                        }
                        return [2 /*return*/, issues];
                }
            });
        });
    };
    /**
     * Exporta dados para formato específico
     */
    ReportsService.exportToFormat = function (data, format) {
        return __awaiter(this, void 0, void 0, function () {
            var headers_1, csvContent;
            return __generator(this, function (_a) {
                ReportsService.LoggerInstance.info("Exportando dados", { format: format });
                switch (format.toLowerCase()) {
                    case 'json':
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                    case 'csv':
                        // Implementação básica de CSV
                        if (Array.isArray(data)) {
                            headers_1 = Object.keys(data[0] || {});
                            csvContent = __spreadArray([
                                headers_1.join(',')
                            ], data.map(function (row) { return headers_1.map(function (header) { return row[header] || ''; }).join(','); }), true).join('\n');
                            return [2 /*return*/, csvContent];
                        }
                        return [2 /*return*/, JSON.stringify(data)];
                    case 'xlsx':
                        // Para implementação futura com biblioteca específica
                        ReportsService.LoggerInstance.warn("Formato XLSX não implementado, retornando JSON");
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                    case 'pdf':
                        // Para implementação futura com biblioteca específica
                        ReportsService.LoggerInstance.warn("Formato PDF não implementado, retornando JSON");
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                    default:
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Obtém status de exportação em lote
     */
    ReportsService.getBatchExportStatus = function (batchId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ReportsService.LoggerInstance.info("Obtendo status de exportação em lote", { batchId: batchId });
                // Implementação básica - em produção seria conectado a um sistema de filas
                return [2 /*return*/, {
                        batchId: batchId,
                        status: 'completed',
                        progress: 100,
                        createdAt: new Date().toISOString(),
                        completedAt: new Date().toISOString(),
                        totalItems: 1,
                        processedItems: 1,
                        errors: []
                    }];
            });
        });
    };
    /**
     * Cria um job de exportação em lote
     */
    ReportsService.createBatchExportJob = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var jobId;
            return __generator(this, function (_a) {
                jobId = crypto.randomUUID();
                ReportsService.LoggerInstance.info("Criando job de exportação em lote", { jobId: jobId, params: params });
                // Implementação básica - em produção seria conectado a um sistema de filas
                return [2 /*return*/, jobId];
            });
        });
    };
    /**
     * Gera alertas para o usuário
     */
    ReportsService.generateAlerts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vehicleId;
            return __generator(this, function (_a) {
                userId = params.userId, vehicleId = params.vehicleId;
                ReportsService.LoggerInstance.info("Gerando alertas", { userId: userId, vehicleId: vehicleId });
                // Implementação básica de alertas
                return [2 /*return*/, {
                        alerts: [],
                        count: 0
                    }];
            });
        });
    };
    /**
     * Obtém progresso das metas
     */
    ReportsService.getGoalsProgress = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ReportsService.LoggerInstance.info("Obtendo progresso das metas", { userId: userId, vehicleId: vehicleId });
                // Implementação básica de progresso de metas
                return [2 /*return*/, {
                        goals: [],
                        progress: 0
                    }];
            });
        });
    };
    ReportsService.LoggerInstance = logger_1.default;
    return ReportsService;
}());
exports.ReportsService = ReportsService;
var templateObject_1, templateObject_2, templateObject_3;
