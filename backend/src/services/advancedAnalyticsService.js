"use strict";
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
exports.AdvancedAnalyticsService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
// Preços médios de combustível (em centavos)
var FUEL_PRICES = {
    gasolina: 550, // R$ 5,50
    etanol: 400, // R$ 4,00
    diesel: 520, // R$ 5,20
    gnv: 350, // R$ 3,50
    flex: 550 // R$ 5,50 (padrão gasolina)
};
var AdvancedAnalyticsService = /** @class */ (function () {
    function AdvancedAnalyticsService() {
    }
    /**
     * Calcular métricas de eficiência operacional
     */
    AdvancedAnalyticsService.calculateOperationalEfficiency = function (userId, vehicleId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyDaysAgo, today, vehicleFilter, vehicles, efficiencyMetrics, _i, vehicles_1, vehicle, journeyMetrics, fuelMetrics, expenseMetrics, journey, fuel, expense, totalFaturamento, totalKm, totalTempo, totalLitros, totalGastoCombustivel, totalDespesas, consumoMedio, ganhoPorKm, ganhoPorHora, custoPorKm, lucroLiquido, margemLucro, eficienciaEnergetica, classificacaoEficiencia, classificacaoConsumo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        today = endDate || new Date();
                        vehicleFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt));
                        if (vehicleId) {
                            vehicleFilter = (0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where(vehicleFilter)];
                    case 1:
                        vehicles = _a.sent();
                        efficiencyMetrics = [];
                        _i = 0, vehicles_1 = vehicles;
                        _a.label = 2;
                    case 2:
                        if (!(_i < vehicles_1.length)) return [3 /*break*/, 7];
                        vehicle = vehicles_1[_i];
                        return [4 /*yield*/, db_1.db
                                .select({
                                totalJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                totalTempo: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                                mediaGanho: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.ganhoBruto),
                                mediaKm: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.kmTotal),
                                mediaTempo: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicle.id), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, today), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))];
                    case 3:
                        journeyMetrics = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .select({
                                totalAbastecimentos: (0, drizzle_orm_1.count)(schema_postgres_1.abastecimentos.id),
                                totalLitros: (0, drizzle_orm_1.sum)(schema_postgres_1.abastecimentos.litros),
                                totalGastoCombustivel: (0, drizzle_orm_1.sum)(schema_postgres_1.abastecimentos.valorTotal),
                                mediaValorLitro: (0, drizzle_orm_1.avg)(schema_postgres_1.abastecimentos.valorLitro),
                            })
                                .from(schema_postgres_1.abastecimentos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idVeiculo, vehicle.id), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.abastecimentos.dataAbastecimento, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.abastecimentos.dataAbastecimento, today), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt)))];
                    case 4:
                        fuelMetrics = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .select({
                                totalDespesas: (0, drizzle_orm_1.count)(schema_postgres_1.despesas.id),
                                totalValorDespesas: (0, drizzle_orm_1.sum)(schema_postgres_1.despesas.valorDespesa),
                                mediaDespesa: (0, drizzle_orm_1.avg)(schema_postgres_1.despesas.valorDespesa),
                            })
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, vehicle.id), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, today), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 5:
                        expenseMetrics = _a.sent();
                        journey = journeyMetrics[0];
                        fuel = fuelMetrics[0];
                        expense = expenseMetrics[0];
                        totalFaturamento = Number(journey.totalFaturamento) || 0;
                        totalKm = Number(journey.totalKm) || 0;
                        totalTempo = Number(journey.totalTempo) || 0;
                        totalLitros = Number(fuel.totalLitros) || 0;
                        totalGastoCombustivel = Number(fuel.totalGastoCombustivel) || 0;
                        totalDespesas = Number(expense.totalValorDespesas) || 0;
                        consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
                        ganhoPorKm = totalKm > 0 ? totalFaturamento / totalKm : 0;
                        ganhoPorHora = totalTempo > 0 ? (totalFaturamento / totalTempo) * 60 : 0;
                        custoPorKm = totalKm > 0 ? (totalGastoCombustivel + totalDespesas) / totalKm : 0;
                        lucroLiquido = totalFaturamento - totalGastoCombustivel - totalDespesas;
                        margemLucro = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;
                        eficienciaEnergetica = totalLitros > 0 ? totalFaturamento / totalLitros : 0;
                        classificacaoEficiencia = 'Baixa';
                        if (ganhoPorKm >= 100)
                            classificacaoEficiencia = 'Alta';
                        else if (ganhoPorKm >= 50)
                            classificacaoEficiencia = 'Média';
                        classificacaoConsumo = 'Ruim';
                        if (consumoMedio >= 12)
                            classificacaoConsumo = 'Excelente';
                        else if (consumoMedio >= 10)
                            classificacaoConsumo = 'Bom';
                        else if (consumoMedio >= 8)
                            classificacaoConsumo = 'Regular';
                        efficiencyMetrics.push({
                            veiculo: {
                                id: vehicle.id,
                                marca: vehicle.marca,
                                modelo: vehicle.modelo,
                                placa: vehicle.placa,
                                tipoCombustivel: vehicle.tipoCombustivel,
                            },
                            metricasOperacionais: {
                                totalJornadas: Number(journey.totalJornadas) || 0,
                                totalKm: totalKm,
                                totalTempoHoras: Math.round((totalTempo / 60) * 100) / 100,
                                totalAbastecimentos: Number(fuel.totalAbastecimentos) || 0,
                                totalDespesas: Number(expense.totalDespesas) || 0,
                            },
                            metricasFinanceiras: {
                                faturamentoTotal: totalFaturamento,
                                gastoCombustivel: totalGastoCombustivel,
                                outrasDespesas: totalDespesas,
                                lucroLiquido: lucroLiquido,
                                margemLucro: Math.round(margemLucro * 100) / 100,
                            },
                            metricasEficiencia: {
                                consumoMedio: Math.round(consumoMedio * 100) / 100,
                                ganhoPorKm: Math.round(ganhoPorKm),
                                ganhoPorHora: Math.round(ganhoPorHora),
                                custoPorKm: Math.round(custoPorKm),
                                eficienciaEnergetica: Math.round(eficienciaEnergetica),
                                classificacaoEficiencia: classificacaoEficiencia,
                                classificacaoConsumo: classificacaoConsumo,
                            },
                            indicadoresPerformance: {
                                jornadasPorDia: totalKm > 0 ? Math.round((Number(journey.totalJornadas) / 30) * 100) / 100 : 0,
                                kmPorDia: Math.round((totalKm / 30) * 100) / 100,
                                faturamentoPorDia: Math.round((totalFaturamento / 30)),
                                tempoMedioJornada: Number(journey.totalJornadas) > 0 ? Math.round((totalTempo / Number(journey.totalJornadas))) : 0,
                            }
                        });
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, efficiencyMetrics];
                }
            });
        });
    };
    /**
     * Análise de tendências temporais
     */
    AdvancedAnalyticsService.analyzeTrends = function (userId_1, vehicleId_1) {
        return __awaiter(this, arguments, void 0, function (userId, vehicleId, days) {
            var endDate, startDate, vehicleFilter, weeklyTrends, monthlyTrends, calculateTrend;
            if (days === void 0) { days = 90; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endDate = new Date();
                        startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
                        vehicleFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt));
                        if (vehicleId) {
                            vehicleFilter = (0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                semana: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["strftime('%Y-%W', ", " / 1000, 'unixepoch')"], ["strftime('%Y-%W', ", " / 1000, 'unixepoch')"])), schema_postgres_1.jornadas.dataInicio),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                tempoTotal: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .groupBy((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["DATE_TRUNC('week', ", ")"], ["DATE_TRUNC('week', ", ")"])), schema_postgres_1.jornadas.dataInicio))
                                .orderBy((0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DATE_TRUNC('week', ", ")"], ["DATE_TRUNC('week', ", ")"])), schema_postgres_1.jornadas.dataInicio))];
                    case 1:
                        weeklyTrends = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .select({
                                mes: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["strftime(\"%Y-%m\", ", " / 1000, \"unixepoch\")"], ["strftime(\"%Y-%m\", ", " / 1000, \"unixepoch\")"])), schema_postgres_1.jornadas.dataInicio),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                tempoTotal: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .groupBy((0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["DATE_TRUNC('month', ", ")"], ["DATE_TRUNC('month', ", ")"])), schema_postgres_1.jornadas.dataInicio))
                                .orderBy((0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["DATE_TRUNC('month', ", ")"], ["DATE_TRUNC('month', ", ")"])), schema_postgres_1.jornadas.dataInicio))];
                    case 2:
                        monthlyTrends = _a.sent();
                        calculateTrend = function (data, valueField) {
                            if (data.length < 2)
                                return { tendencia: 'Estável', variacao: 0 };
                            var values = data.map(function (item) { return Number(item[valueField]) || 0; });
                            var first = values[0];
                            var last = values[values.length - 1];
                            if (first === 0)
                                return { tendencia: 'Estável', variacao: 0 };
                            var variacao = ((last - first) / first) * 100;
                            var tendencia = 'Estável';
                            if (variacao > 5)
                                tendencia = 'Crescente';
                            else if (variacao < -5)
                                tendencia = 'Decrescente';
                            return { tendencia: tendencia, variacao: Math.round(variacao * 100) / 100 };
                        };
                        return [2 /*return*/, {
                                tendenciasSemanais: {
                                    dados: weeklyTrends.map(function (week) { return ({
                                        periodo: week.semana,
                                        faturamento: Number(week.totalFaturamento) || 0,
                                        km: Number(week.totalKm) || 0,
                                        jornadas: Number(week.numeroJornadas) || 0,
                                        tempoHoras: Math.round((Number(week.tempoTotal) / 60) * 100) / 100,
                                    }); }),
                                    analiseFaturamento: calculateTrend(weeklyTrends, 'totalFaturamento'),
                                    analiseKm: calculateTrend(weeklyTrends, 'totalKm'),
                                    analiseJornadas: calculateTrend(weeklyTrends, 'numeroJornadas'),
                                },
                                tendenciasMensais: {
                                    dados: monthlyTrends.map(function (month) { return ({
                                        periodo: month.mes,
                                        faturamento: Number(month.totalFaturamento) || 0,
                                        km: Number(month.totalKm) || 0,
                                        jornadas: Number(month.numeroJornadas) || 0,
                                        tempoHoras: Math.round((Number(month.tempoTotal) / 60) * 100) / 100,
                                    }); }),
                                    analiseFaturamento: calculateTrend(monthlyTrends, 'totalFaturamento'),
                                    analiseKm: calculateTrend(monthlyTrends, 'totalKm'),
                                    analiseJornadas: calculateTrend(monthlyTrends, 'numeroJornadas'),
                                },
                                periodoAnalise: {
                                    dataInicio: startDate.toISOString(),
                                    dataFim: endDate.toISOString(),
                                    totalDias: days,
                                }
                            }];
                }
            });
        });
    };
    /**
     * Análise de sazonalidade
     */
    AdvancedAnalyticsService.analyzeSeasonality = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var vehicleFilter, dayOfWeekAnalysis, hourAnalysis, monthAnalysis, getDayName, getMonthName, bestDayOfWeek, bestHour, bestMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vehicleFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt));
                        if (vehicleId) {
                            vehicleFilter = (0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                diaSemana: (0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["strftime(\"%w\", ", " / 1000, \"unixepoch\")"], ["strftime(\"%w\", ", " / 1000, \"unixepoch\")"])), schema_postgres_1.jornadas.dataInicio),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                tempoTotal: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .groupBy((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["EXTRACT(DOW FROM ", ")"], ["EXTRACT(DOW FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))
                                .orderBy((0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["EXTRACT(DOW FROM ", ")"], ["EXTRACT(DOW FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))];
                    case 1:
                        dayOfWeekAnalysis = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .select({
                                hora: (0, drizzle_orm_1.sql)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["strftime(\"%H\", ", " / 1000, \"unixepoch\")"], ["strftime(\"%H\", ", " / 1000, \"unixepoch\")"])), schema_postgres_1.jornadas.dataInicio),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                tempoTotal: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .groupBy((0, drizzle_orm_1.sql)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["EXTRACT(HOUR FROM ", ")"], ["EXTRACT(HOUR FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))
                                .orderBy((0, drizzle_orm_1.sql)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["EXTRACT(HOUR FROM ", ")"], ["EXTRACT(HOUR FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))];
                    case 2:
                        hourAnalysis = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .select({
                                mes: (0, drizzle_orm_1.sql)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["strftime(\"%m\", ", " / 1000, \"unixepoch\")"], ["strftime(\"%m\", ", " / 1000, \"unixepoch\")"])), schema_postgres_1.jornadas.dataInicio),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                numeroJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                tempoTotal: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.duracaoMinutos),
                            })
                                .from(schema_postgres_1.jornadas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .groupBy((0, drizzle_orm_1.sql)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["EXTRACT(MONTH FROM ", ")"], ["EXTRACT(MONTH FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))
                                .orderBy((0, drizzle_orm_1.sql)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["EXTRACT(MONTH FROM ", ")"], ["EXTRACT(MONTH FROM ", ")"])), schema_postgres_1.jornadas.dataInicio))];
                    case 3:
                        monthAnalysis = _a.sent();
                        getDayName = function (dayNum) {
                            var days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                            return days[dayNum] || 'Desconhecido';
                        };
                        getMonthName = function (monthNum) {
                            var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                            return months[monthNum - 1] || 'Desconhecido';
                        };
                        bestDayOfWeek = dayOfWeekAnalysis.reduce(function (best, current) {
                            return (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best;
                        });
                        bestHour = hourAnalysis.reduce(function (best, current) {
                            return (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best;
                        });
                        bestMonth = monthAnalysis.reduce(function (best, current) {
                            return (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best;
                        });
                        return [2 /*return*/, {
                                analiseDiaSemana: dayOfWeekAnalysis.map(function (day) { return ({
                                    diaSemana: getDayName(day.diaSemana),
                                    diaNumero: day.diaSemana,
                                    faturamentoTotal: Number(day.totalFaturamento) || 0,
                                    kmTotal: Number(day.totalKm) || 0,
                                    numeroJornadas: Number(day.numeroJornadas) || 0,
                                    faturamentoMedio: Number(day.numeroJornadas) > 0 ? Math.round((Number(day.totalFaturamento) || 0) / Number(day.numeroJornadas)) : 0,
                                }); }),
                                analiseHorario: hourAnalysis.map(function (hour) { return ({
                                    hora: hour.hora,
                                    faturamentoTotal: Number(hour.totalFaturamento) || 0,
                                    kmTotal: Number(hour.totalKm) || 0,
                                    numeroJornadas: Number(hour.numeroJornadas) || 0,
                                    faturamentoMedio: Number(hour.numeroJornadas) > 0 ? Math.round((Number(hour.totalFaturamento) || 0) / Number(hour.numeroJornadas)) : 0,
                                }); }),
                                analiseMensal: monthAnalysis.map(function (month) { return ({
                                    mes: getMonthName(month.mes),
                                    mesNumero: month.mes,
                                    faturamentoTotal: Number(month.totalFaturamento) || 0,
                                    kmTotal: Number(month.totalKm) || 0,
                                    numeroJornadas: Number(month.numeroJornadas) || 0,
                                    faturamentoMedio: Number(month.numeroJornadas) > 0 ? Math.round((Number(month.totalFaturamento) || 0) / Number(month.numeroJornadas)) : 0,
                                }); }),
                                padroesIdentificados: {
                                    melhorDiaSemana: {
                                        dia: getDayName(bestDayOfWeek.diaSemana),
                                        faturamentoTotal: Number(bestDayOfWeek.totalFaturamento) || 0,
                                        numeroJornadas: Number(bestDayOfWeek.numeroJornadas) || 0,
                                    },
                                    melhorHorario: {
                                        hora: bestHour.hora,
                                        faturamentoTotal: Number(bestHour.totalFaturamento) || 0,
                                        numeroJornadas: Number(bestHour.numeroJornadas) || 0,
                                    },
                                    melhorMes: {
                                        mes: getMonthName(bestMonth.mes),
                                        faturamentoTotal: Number(bestMonth.totalFaturamento) || 0,
                                        numeroJornadas: Number(bestMonth.numeroJornadas) || 0,
                                    },
                                }
                            }];
                }
            });
        });
    };
    /**
     * Análise de custos detalhada
     */
    AdvancedAnalyticsService.analyzeCosts = function (userId, vehicleId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyDaysAgo, today, vehicleFilter, costAnalysis, totalGasto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        today = endDate || new Date();
                        vehicleFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt));
                        if (vehicleId) {
                            vehicleFilter = (0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                                totalValor: (0, drizzle_orm_1.sum)(schema_postgres_1.despesas.valorDespesa),
                                quantidade: (0, drizzle_orm_1.count)(schema_postgres_1.despesas.id),
                            })
                                .from(schema_postgres_1.despesas)
                                .innerJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)(vehicleFilter, (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, today), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))
                                .groupBy(schema_postgres_1.despesas.tipoDespesa)];
                    case 1:
                        costAnalysis = _a.sent();
                        totalGasto = costAnalysis.reduce(function (sum, item) { return sum + (Number(item.totalValor) || 0); }, 0);
                        return [2 /*return*/, {
                                custosPorCategoria: costAnalysis.map(function (item) { return ({
                                    categoria: item.tipoDespesa,
                                    totalGasto: Number(item.totalValor) || 0,
                                    quantidade: Number(item.quantidade) || 0,
                                    percentual: totalGasto > 0 ? Math.round(((Number(item.totalValor) || 0) / totalGasto) * 10000) / 100 : 0,
                                }); }),
                                totalGasto: totalGasto,
                            }];
                }
            });
        });
    };
    /**
     * Análise de rentabilidade por jornada
     */
    AdvancedAnalyticsService.analyzeJourneyProfitability = function (userId, vehicleId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyDaysAgo, today, journeyFilter, journeysData, profitabilityMetrics, _i, journeysData_1, journey, veiculoInfo, tipoCombustivel, precoLitro, consumoEstimadoLitros, custoCombustivelEstimado, outrasDespesas, totalOutrasDespesas, lucroLiquido, margemLucro;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        today = endDate || new Date();
                        journeyFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, today));
                        if (vehicleId) {
                            journeyFilter = (0, drizzle_orm_1.and)(journeyFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.jornadas.id,
                                ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                                kmTotal: schema_postgres_1.jornadas.kmTotal,
                                dataInicio: schema_postgres_1.jornadas.dataInicio,
                                idVeiculo: schema_postgres_1.jornadas.idVeiculo,
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(journeyFilter)];
                    case 1:
                        journeysData = _c.sent();
                        profitabilityMetrics = [];
                        _i = 0, journeysData_1 = journeysData;
                        _c.label = 2;
                    case 2:
                        if (!(_i < journeysData_1.length)) return [3 /*break*/, 6];
                        journey = journeysData_1[_i];
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, journey.idVeiculo)).limit(1)];
                    case 3:
                        veiculoInfo = _c.sent();
                        tipoCombustivel = ((_a = veiculoInfo[0]) === null || _a === void 0 ? void 0 : _a.tipoCombustivel) || 'Gasolina';
                        precoLitro = FUEL_PRICES[tipoCombustivel] || 0;
                        consumoEstimadoLitros = (Number(journey.kmTotal) || 0) / 12;
                        custoCombustivelEstimado = consumoEstimadoLitros * precoLitro;
                        return [4 /*yield*/, db_1.db
                                .select({ total: (0, drizzle_orm_1.sum)(schema_postgres_1.despesas.valorDespesa) })
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, journey.idVeiculo), (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, journey.dataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, new Date(journey.dataInicio.getTime() + (journey.kmTotal || 0) * 1000 * 60 * 60 / 60)), // Estimativa de duração
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 4:
                        outrasDespesas = _c.sent();
                        totalOutrasDespesas = Number((_b = outrasDespesas[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
                        lucroLiquido = (Number(journey.ganhoBruto) || 0) - custoCombustivelEstimado - totalOutrasDespesas;
                        margemLucro = (Number(journey.ganhoBruto) || 0) > 0 ? (lucroLiquido / (Number(journey.ganhoBruto) || 0)) * 100 : 0;
                        profitabilityMetrics.push({
                            idJornada: journey.id,
                            dataInicio: new Date(journey.dataInicio).toISOString(),
                            ganhoBruto: Number(journey.ganhoBruto) || 0,
                            kmTotal: Number(journey.kmTotal) || 0,
                            custoCombustivelEstimado: Math.round(custoCombustivelEstimado),
                            outrasDespesas: totalOutrasDespesas,
                            lucroLiquido: Math.round(lucroLiquido),
                            margemLucro: Math.round(margemLucro * 100) / 100,
                        });
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, profitabilityMetrics];
                }
            });
        });
    };
    /**
     * Previsão de faturamento (simplificada)
     */
    AdvancedAnalyticsService.predictRevenue = function (userId_1, vehicleId_1) {
        return __awaiter(this, arguments, void 0, function (userId, vehicleId, daysToPredict) {
            var today, thirtyDaysAgo, journeyFilter, recentJourneys, totalGanhoBrutoRecente, mediaDiaria, predictedRevenue;
            if (daysToPredict === void 0) { daysToPredict = 30; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        journeyFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, thirtyDaysAgo), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, today));
                        if (vehicleId) {
                            journeyFilter = (0, drizzle_orm_1.and)(journeyFilter, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                            })
                                .from(schema_postgres_1.jornadas)
                                .where(journeyFilter)];
                    case 1:
                        recentJourneys = _a.sent();
                        totalGanhoBrutoRecente = recentJourneys.reduce(function (sum, j) { return sum + (Number(j.ganhoBruto) || 0); }, 0);
                        mediaDiaria = recentJourneys.length > 0 ? totalGanhoBrutoRecente / 30 : 0;
                        predictedRevenue = mediaDiaria * daysToPredict;
                        return [2 /*return*/, {
                                mediaDiariaRecente: Math.round(mediaDiaria),
                                diasPrevistos: daysToPredict,
                                faturamentoPrevisto: Math.round(predictedRevenue),
                            }];
                }
            });
        });
    };
    /**
     * Gerar insights e recomendações baseados nos dados fornecidos
     */
    AdvancedAnalyticsService.generateInsights = function (efficiencyMetrics, trends, seasonality, costs) {
        var insights = [];
        var recommendations = [];
        // Análise de eficiência
        if (efficiencyMetrics && efficiencyMetrics.length > 0) {
            var avgEfficiency = efficiencyMetrics.reduce(function (sum, metric) {
                return sum + (metric.eficienciaOperacional || 0);
            }, 0) / efficiencyMetrics.length;
            if (avgEfficiency < 70) {
                insights.push({
                    type: 'warning',
                    title: 'Eficiência Operacional Baixa',
                    description: "Sua efici\u00EAncia operacional m\u00E9dia est\u00E1 em ".concat(avgEfficiency.toFixed(1), "%")
                });
                recommendations.push({
                    priority: 'high',
                    action: 'Revisar rotas e horários para otimizar a eficiência operacional'
                });
            }
        }
        // Análise de tendências
        if (trends && trends.faturamento) {
            if (trends.faturamento.tendencia === 'decrescente') {
                insights.push({
                    type: 'alert',
                    title: 'Tendência de Queda no Faturamento',
                    description: 'Faturamento apresenta tendência de queda nos últimos períodos'
                });
                recommendations.push({
                    priority: 'high',
                    action: 'Implementar estratégias para aumentar o faturamento'
                });
            }
        }
        // Análise de custos
        if (costs && costs.custoTotal) {
            var margem = ((costs.faturamentoTotal - costs.custoTotal) / costs.faturamentoTotal) * 100;
            if (margem < 20) {
                insights.push({
                    type: 'warning',
                    title: 'Margem de Lucro Baixa',
                    description: "Margem de lucro atual: ".concat(margem.toFixed(1), "%")
                });
                recommendations.push({
                    priority: 'medium',
                    action: 'Revisar custos operacionais para melhorar a margem de lucro'
                });
            }
        }
        return {
            insights: insights,
            recommendations: recommendations,
            summary: {
                totalInsights: insights.length,
                highPriorityRecommendations: recommendations.filter(function (r) { return r.priority === 'high'; }).length
            }
        };
    };
    return AdvancedAnalyticsService;
}());
exports.AdvancedAnalyticsService = AdvancedAnalyticsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
