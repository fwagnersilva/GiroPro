"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAnalyticsController = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var customErrors_1 = require("../utils/customErrors");
// Schema de validação aprimorado
var analyticsQuerySchema = zod_1.z.object({
    dataInicio: zod_1.z.string().datetime().optional(),
    dataFim: zod_1.z.string().datetime().optional(),
    idVeiculo: zod_1.z.string().uuid().optional(),
    periodo: zod_1.z.enum(['7d', '30d', '90d', '6m', '1y']).default('30d'),
    incluirComparacao: zod_1.z.boolean().default(false),
    timezone: zod_1.z.string().default('America/Sao_Paulo'),
});
var vehicleIdsSchema = zod_1.z.object({
    vehicleIds: zod_1.z.array(zod_1.z.string().uuid()).min(2).max(5),
});
var AdvancedAnalyticsController = /** @class */ (function () {
    function AdvancedAnalyticsController() {
    }
    /**
     * Função auxiliar para calcular o período de datas com timezone
     */
    AdvancedAnalyticsController.calculatePeriod = function (periodo, dataInicio, dataFim, timezone) {
        if (timezone === void 0) { timezone = 'America/Sao_Paulo'; }
        var startDate;
        var endDate = new Date();
        if (dataInicio && dataFim) {
            startDate = new Date(dataInicio);
            endDate = new Date(dataFim);
        }
        else {
            var now = new Date();
            switch (periodo) {
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '90d':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                case '6m':
                    startDate = new Date();
                    startDate.setMonth(now.getMonth() - 6);
                    break;
                case '1y':
                    startDate = new Date();
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }
        }
        // Validar se o período não é muito longo (máximo 2 anos)
        var maxPeriod = 2 * 365 * 24 * 60 * 60 * 1000; // 2 anos em ms
        if (endDate.getTime() - startDate.getTime() > maxPeriod) {
            throw new customErrors_1.ValidationError('Período muito longo. Máximo permitido: 2 anos');
        }
        return { startDate: startDate, endDate: endDate };
    };
    /**
     * Função auxiliar para obter a descrição do período
     */
    AdvancedAnalyticsController.getPeriodDescription = function (startDate, endDate) {
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Sao_Paulo'
        };
        return "".concat(startDate.toLocaleDateString('pt-BR', options), " - ").concat(endDate.toLocaleDateString('pt-BR', options));
    };
    /**
     * Função auxiliar para calcular o resumo geral com validação
     */
    AdvancedAnalyticsController.calculateGeneralSummary = function (analysisData) {
        if (!analysisData || analysisData.length === 0) {
            return {
                totalLitros: 0,
                totalKm: 0,
                totalGastoCombustivel: 0,
                consumoMedio: 0,
                custoMedioPorKm: 0,
                custoMedioPorLitro: 0,
                numeroAbastecimentos: 0,
                numeroJornadas: 0,
            };
        }
        var totalLitros = 0;
        var totalKm = 0;
        var totalGastoCombustivel = 0;
        var numeroAbastecimentos = 0;
        var numeroJornadas = 0;
        analysisData.forEach(function (analysis) {
            var metricas = analysis.metricasPeriodo || {};
            totalLitros += Number(metricas.totalLitros) || 0;
            totalKm += Number(metricas.totalKm) || 0;
            totalGastoCombustivel += Number(metricas.totalGastoCombustivel) || 0;
            numeroAbastecimentos += Number(metricas.numeroAbastecimentos) || 0;
            numeroJornadas += Number(metricas.numeroJornadas) || 0;
        });
        var consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
        var custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
        var custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;
        return {
            totalLitros: Math.round(totalLitros * 100) / 100,
            totalKm: Math.round(totalKm * 100) / 100,
            totalGastoCombustivel: Math.round(totalGastoCombustivel),
            consumoMedio: Math.round(consumoMedio * 100) / 100,
            custoMedioPorKm: Math.round(custoMedioPorKm),
            custoMedioPorLitro: Math.round(custoMedioPorLitro),
            numeroAbastecimentos: numeroAbastecimentos,
            numeroJornadas: numeroJornadas,
        };
    };
    /**
     * Função auxiliar para obter o nome do dia da semana
     */
    AdvancedAnalyticsController.getDayOfWeekName = function (dayIndex) {
        var days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return days[dayIndex] || 'Desconhecido';
    };
    /**
     * Validar se o usuário tem acesso ao veículo
     */
    AdvancedAnalyticsController.validateVehicleAccess = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var vehicle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({ id: schema_postgres_1.veiculos.id })
                            .from(schema_postgres_1.veiculos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))
                            .limit(1)];
                    case 1:
                        vehicle = (_a.sent())[0];
                        return [2 /*return*/, !!vehicle];
                }
            });
        });
    };
    AdvancedAnalyticsController.fetchVehicleData = function (userId, vehicleId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all([
                        db_1.db
                            .select({
                            dataAbastecimento: schema_postgres_1.abastecimentos.dataAbastecimento,
                            litros: schema_postgres_1.abastecimentos.litros,
                            valorTotal: schema_postgres_1.abastecimentos.valorTotal,
                            kmAtual: schema_postgres_1.abastecimentos.kmAtual,
                        })
                            .from(schema_postgres_1.abastecimentos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idVeiculo, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.abastecimentos.dataAbastecimento, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.abastecimentos.dataAbastecimento, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt)))
                            .orderBy((0, drizzle_orm_1.asc)(schema_postgres_1.abastecimentos.dataAbastecimento)),
                        db_1.db
                            .select({
                            kmTotal: schema_postgres_1.jornadas.kmTotal,
                            dataInicio: schema_postgres_1.jornadas.dataInicio,
                            dataFim: schema_postgres_1.jornadas.dataFim,
                            ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                        })
                            .from(schema_postgres_1.jornadas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt))),
                    ])];
            });
        });
    };
    AdvancedAnalyticsController.calculateVehicleMetrics = function (fuelings, journeys) {
        var totalLitros = fuelings.reduce(function (sum, f) { return sum + (Number(f.quantidadeLitros) || 0); }, 0);
        var totalGastoCombustivel = fuelings.reduce(function (sum, f) { return sum + (Number(f.valorTotal) || 0); }, 0);
        var totalKm = journeys.reduce(function (sum, j) { return sum + (Number(j.kmTotal) || 0); }, 0);
        var totalFaturamento = journeys.reduce(function (sum, j) { return sum + (Number(j.ganhoBruto) || 0); }, 0);
        var consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
        var custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
        var custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;
        return {
            totalLitros: Math.round(totalLitros * 100) / 100,
            totalKm: Math.round(totalKm * 100) / 100,
            totalGastoCombustivel: Math.round(totalGastoCombustivel),
            consumoMedio: Math.round(consumoMedio * 100) / 100,
            custoMedioPorKm: Math.round(custoMedioPorKm),
            custoMedioPorLitro: Math.round(custoMedioPorLitro),
            numeroAbastecimentos: fuelings.length,
            numeroJornadas: journeys.length,
        };
    };
    AdvancedAnalyticsController.calculateEfficiencyHistory = function (fuelings, consumoMedio) {
        return fuelings.map(function (fueling, index) {
            if (index === 0 || !fueling.kmAtual) {
                return __assign(__assign({}, fueling), { consumoPeriodo: null, eficiencia: null, kmPercorridos: null });
            }
            var prevFueling = fuelings[index - 1];
            if (!prevFueling.kmAtual) {
                return __assign(__assign({}, fueling), { consumoPeriodo: null, eficiencia: null, kmPercorridos: null });
            }
            var kmPercorridos = Number(fueling.kmAtual) - Number(prevFueling.kmAtual);
            var litrosConsumidos = Number(fueling.quantidadeLitros) || 0;
            var consumoPeriodo = litrosConsumidos > 0 && kmPercorridos > 0 ? kmPercorridos / litrosConsumidos : 0;
            var eficiencia = 'Sem dados';
            if (consumoPeriodo > 0 && consumoMedio > 0) {
                var percentualEficiencia = (consumoPeriodo / consumoMedio) * 100;
                if (percentualEficiencia >= 110)
                    eficiencia = 'Excelente';
                else if (percentualEficiencia >= 100)
                    eficiencia = 'Boa';
                else if (percentualEficiencia >= 90)
                    eficiencia = 'Regular';
                else
                    eficiencia = 'Baixa';
            }
            return __assign(__assign({}, fueling), { consumoPeriodo: Math.round(consumoPeriodo * 100) / 100, kmPercorridos: kmPercorridos, eficiencia: eficiencia, percentualEficiencia: consumoPeriodo > 0 && consumoMedio > 0 ? Math.round((consumoPeriodo / consumoMedio) * 100) : null });
        });
    };
    /**
     * Análise de consumo por veículo
     */
    AdvancedAnalyticsController.getConsumptionAnalysis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, _a, dataInicio, dataFim, idVeiculo, periodo, timezone, _b, _c, startDate, endDate, userVehicles, consumptionAnalysis, _i, userVehicles_1, vehicle, _d, fuelings, journeys, metricasPeriodo, historicoEficiencia, tendenciaConsumo, estatisticasComparativas, error_1;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 8, , 9]);
                        if (!((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
                            throw new customErrors_1.UnauthorizedError('Usuário não autenticado');
                        }
                        validation = analyticsQuerySchema.safeParse(req.query);
                        if (!validation.success) {
                            throw new customErrors_1.ValidationError('Parâmetros inválidos', validation.error.errors);
                        }
                        _a = validation.data, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo, periodo = _a.periodo, timezone = _a.timezone;
                        _b = idVeiculo;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateVehicleAccess(req.user.id, idVeiculo)];
                    case 1:
                        _b = !(_f.sent());
                        _f.label = 2;
                    case 2:
                        if (_b) {
                            throw new customErrors_1.NotFoundError('Veículo não encontrado ou sem acesso');
                        }
                        _c = this.calculatePeriod(periodo, dataInicio, dataFim, timezone), startDate = _c.startDate, endDate = _c.endDate;
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, req.user.id), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))];
                    case 3:
                        userVehicles = _f.sent();
                        if (userVehicles.length === 0) {
                            throw new customErrors_1.NotFoundError('Nenhum veículo encontrado');
                        }
                        consumptionAnalysis = [];
                        _i = 0, userVehicles_1 = userVehicles;
                        _f.label = 4;
                    case 4:
                        if (!(_i < userVehicles_1.length)) return [3 /*break*/, 7];
                        vehicle = userVehicles_1[_i];
                        return [4 /*yield*/, this.fetchVehicleData(req.user.id, vehicle.id, startDate, endDate)];
                    case 5:
                        _d = _f.sent(), fuelings = _d[0], journeys = _d[1];
                        metricasPeriodo = this.calculateVehicleMetrics(fuelings, journeys);
                        historicoEficiencia = this.calculateEfficiencyHistory(fuelings, metricasPeriodo.consumoMedio);
                        tendenciaConsumo = this.calculateConsumptionTrend(historicoEficiencia);
                        consumptionAnalysis.push({
                            veiculo: vehicle,
                            metricasPeriodo: metricasPeriodo,
                            historicoEficiencia: historicoEficiencia.slice(1),
                            tendenciaConsumo: tendenciaConsumo,
                            periodo: {
                                dataInicio: startDate.toISOString(),
                                dataFim: endDate.toISOString(),
                                descricao: this.getPeriodDescription(startDate, endDate),
                                diasAnalisados: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
                            },
                        });
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        estatisticasComparativas = consumptionAnalysis.length > 1 ? this.calculateComparativeStats(consumptionAnalysis) : null;
                        return [2 /*return*/, res.json({
                                success: true,
                                data: {
                                    analiseConsumo: consumptionAnalysis,
                                    resumoGeral: this.calculateGeneralSummary(consumptionAnalysis),
                                    estatisticasComparativas: estatisticasComparativas,
                                    periodo: {
                                        dataInicio: startDate.toISOString(),
                                        dataFim: endDate.toISOString(),
                                        descricao: this.getPeriodDescription(startDate, endDate),
                                        timezone: timezone,
                                    },
                                    metadata: {
                                        totalVeiculosAnalisados: consumptionAnalysis.length,
                                        periodoDias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
                                        dataProcessamento: new Date().toISOString(),
                                    },
                                },
                            })];
                    case 8:
                        error_1 = _f.sent();
                        console.error('Erro ao gerar análise de consumo:', error_1);
                        if (error_1 instanceof customErrors_1.ValidationError || error_1 instanceof customErrors_1.UnauthorizedError || error_1 instanceof customErrors_1.NotFoundError) {
                            throw error_1;
                        }
                        throw new Error('Erro interno do servidor ao processar análise de consumo');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calcular tendência de consumo
     */
    AdvancedAnalyticsController.calculateConsumptionTrend = function (fuelingsWithEfficiency) {
        var validConsumptions = fuelingsWithEfficiency
            .filter(function (f) { return f.consumoPeriodo && f.consumoPeriodo > 0; })
            .map(function (f) { return f.consumoPeriodo; });
        if (validConsumptions.length < 2) {
            return { tendencia: 'Dados insuficientes', variacaoPercentual: 0 };
        }
        var firstHalf = validConsumptions.slice(0, Math.ceil(validConsumptions.length / 2));
        var secondHalf = validConsumptions.slice(Math.floor(validConsumptions.length / 2));
        var avgFirst = firstHalf.reduce(function (sum, val) { return sum + val; }, 0) / firstHalf.length;
        var avgSecond = secondHalf.reduce(function (sum, val) { return sum + val; }, 0) / secondHalf.length;
        var variacao = ((avgSecond - avgFirst) / avgFirst) * 100;
        var tendencia = 'Estável';
        if (variacao > 5)
            tendencia = 'Melhorando';
        else if (variacao < -5)
            tendencia = 'Piorando';
        return {
            tendencia: tendencia,
            variacaoPercentual: Math.round(variacao * 100) / 100,
            consumoMedioInicial: Math.round(avgFirst * 100) / 100,
            consumoMedioRecente: Math.round(avgSecond * 100) / 100
        };
    };
    /**
     * Calcular estatísticas comparativas
     */
    AdvancedAnalyticsController.calculateComparativeStats = function (analysisData) {
        var metricas = analysisData.map(function (item) { return item.metricasPeriodo; });
        var consumoMedios = metricas.map(function (m) { return m.consumoMedio; }).filter(function (c) { return c > 0; });
        var custosPorKm = metricas.map(function (m) { return m.custoMedioPorKm; }).filter(function (c) { return c > 0; });
        var rois = metricas.map(function (m) { return m.roiCombustivel; }).filter(function (r) { return r !== null; });
        return {
            consumo: {
                melhor: Math.max.apply(Math, consumoMedios),
                pior: Math.min.apply(Math, consumoMedios),
                media: Math.round((consumoMedios.reduce(function (sum, val) { return sum + val; }, 0) / consumoMedios.length) * 100) / 100
            },
            custoPorKm: {
                menor: Math.min.apply(Math, custosPorKm),
                maior: Math.max.apply(Math, custosPorKm),
                media: Math.round(custosPorKm.reduce(function (sum, val) { return sum + val; }, 0) / custosPorKm.length)
            },
            roi: {
                maior: Math.max.apply(Math, rois),
                menor: Math.min.apply(Math, rois),
                media: Math.round(rois.reduce(function (sum, val) { return sum + val; }, 0) / rois.length)
            }
        };
    };
    /**
     * Análise de produtividade - NOVO MÉTODO
     */
    AdvancedAnalyticsController.getProductivityAnalysis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, _a, dataInicio, dataFim, idVeiculo, periodo, timezone, _b, startDate, endDate, vehicleConditions, productivityData, error_2;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
                            throw new customErrors_1.UnauthorizedError('Usuário não autenticado');
                        }
                        validation = analyticsQuerySchema.safeParse(req.query);
                        if (!validation.success) {
                            throw new customErrors_1.ValidationError('Parâmetros inválidos', validation.error.errors);
                        }
                        _a = validation.data, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo, periodo = _a.periodo, timezone = _a.timezone;
                        _b = this.calculatePeriod(periodo, dataInicio, dataFim, timezone), startDate = _b.startDate, endDate = _b.endDate;
                        vehicleConditions = [
                            (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, req.user.id),
                            (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)
                        ];
                        if (idVeiculo) {
                            vehicleConditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, idVeiculo));
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                vehicleId: schema_postgres_1.veiculos.id,
                                marca: schema_postgres_1.veiculos.marca,
                                modelo: schema_postgres_1.veiculos.modelo,
                                totalJornadas: (0, drizzle_orm_1.count)(schema_postgres_1.jornadas.id),
                                totalKm: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.kmTotal),
                                totalFaturamento: (0, drizzle_orm_1.sum)(schema_postgres_1.jornadas.ganhoBruto),
                                mediaKmPorJornada: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.kmTotal),
                                mediaFaturamentoPorJornada: (0, drizzle_orm_1.avg)(schema_postgres_1.jornadas.ganhoBruto)
                            })
                                .from(schema_postgres_1.veiculos)
                                .leftJoin(schema_postgres_1.jornadas, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt)))
                                .where(drizzle_orm_1.and.apply(void 0, vehicleConditions))
                                .groupBy(schema_postgres_1.veiculos.id, schema_postgres_1.veiculos.marca, schema_postgres_1.veiculos.modelo)];
                    case 1:
                        productivityData = _d.sent();
                        if (productivityData.length === 0) {
                            throw new customErrors_1.NotFoundError('Nenhum dado de produtividade encontrado para os filtros selecionados');
                        }
                        return [2 /*return*/, res.json({
                                success: true,
                                data: {
                                    produtividade: productivityData,
                                    periodo: {
                                        dataInicio: startDate.toISOString(),
                                        dataFim: endDate.toISOString(),
                                        descricao: this.getPeriodDescription(startDate, endDate),
                                        timezone: timezone
                                    }
                                }
                            })];
                    case 2:
                        error_2 = _d.sent();
                        console.error('Erro na análise de produtividade:', error_2);
                        if (error_2 instanceof customErrors_1.ValidationError || error_2 instanceof customErrors_1.UnauthorizedError || error_2 instanceof customErrors_1.NotFoundError) {
                            throw error_2;
                        }
                        throw new Error('Erro interno do servidor ao processar análise de produtividade');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Comparativo entre veículos - NOVO MÉTODO
    */
    AdvancedAnalyticsController.compareVehicles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, vehicleIds, userId, comparisonData, _i, vehicleIds_1, vehicleId, _a, fuelings, journeys, metrics, vehicle, error_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
                            throw new customErrors_1.UnauthorizedError('Usuário não autenticado');
                        }
                        validation = vehicleIdsSchema.safeParse(req.body);
                        if (!validation.success) {
                            throw new customErrors_1.ValidationError('Parâmetros inválidos', validation.error.errors);
                        }
                        vehicleIds = validation.data.vehicleIds;
                        userId = req.user.id;
                        comparisonData = [];
                        _i = 0, vehicleIds_1 = vehicleIds;
                        _c.label = 1;
                    case 1:
                        if (!(_i < vehicleIds_1.length)) return [3 /*break*/, 6];
                        vehicleId = vehicleIds_1[_i];
                        return [4 /*yield*/, this.validateVehicleAccess(userId, vehicleId)];
                    case 2:
                        if (!(_c.sent())) {
                            throw new customErrors_1.NotFoundError("Ve\u00EDculo com ID ".concat(vehicleId, " n\u00E3o encontrado ou sem acesso"));
                        }
                        return [4 /*yield*/, this.fetchVehicleData(userId, vehicleId, new Date(0), new Date())];
                    case 3:
                        _a = _c.sent(), fuelings = _a[0], journeys = _a[1];
                        metrics = this.calculateVehicleMetrics(fuelings, journeys);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId))];
                    case 4:
                        vehicle = _c.sent();
                        comparisonData.push(__assign(__assign({}, vehicle[0]), metrics));
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, res.json({
                            success: true,
                            data: comparisonData,
                        })];
                    case 7:
                        error_3 = _c.sent();
                        console.error('Erro ao comparar veículos:', error_3);
                        if (error_3 instanceof customErrors_1.ValidationError || error_3 instanceof customErrors_1.UnauthorizedError || error_3 instanceof customErrors_1.NotFoundError) {
                            throw error_3;
                        }
                        throw new Error('Erro interno do servidor ao comparar veículos');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return AdvancedAnalyticsController;
}());
exports.AdvancedAnalyticsController = AdvancedAnalyticsController;
