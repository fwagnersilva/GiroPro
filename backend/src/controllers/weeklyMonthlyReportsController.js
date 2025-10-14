"use strict";
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
exports.WeeklyMonthlyReportsController = void 0;
var zod_1 = require("zod");
var logger_1 = require("../utils/logger");
var cache_1 = require("../utils/cache");
var customErrors_1 = require("../utils/customErrors");
var asyncHandler_1 = require("../utils/asyncHandler");
var reportsService_1 = require("../services/reportsService");
var dateUtils_1 = require("../utils/dateUtils");
// Schemas de validação aprimorados
var baseReportSchema = zod_1.z.object({
    dataInicio: zod_1.z.string().datetime().optional(),
    dataFim: zod_1.z.string().datetime().optional(),
    idVeiculo: zod_1.z.string().uuid().optional(),
    formato: zod_1.z.enum(['json', 'csv', 'xlsx', 'pdf']).default('json'),
    incluir_detalhes: zod_1.z.boolean().default(true),
    incluir_graficos: zod_1.z.boolean().default(false)
});
var comparisonSchema = zod_1.z.object({
    idVeiculo: zod_1.z.string().uuid().optional(),
    numero_periodos: zod_1.z.coerce.number().int().min(1).max(24).default(4),
    incluir_tendencias: zod_1.z.boolean().default(true),
    incluir_previsoes: zod_1.z.boolean().default(false)
});
var weeklyReportSchema = baseReportSchema.extend({
    tipo_periodo: zod_1.z.literal('semanal').default('semanal')
});
var monthlyReportSchema = baseReportSchema.extend({
    tipo_periodo: zod_1.z.literal('mensal').default('mensal')
});
var WeeklyMonthlyReportsController = /** @class */ (function () {
    function WeeklyMonthlyReportsController() {
    }
    // Métodos auxiliares privados
    WeeklyMonthlyReportsController.extractUserId = function (req) {
        var _b;
        if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new customErrors_1.AppError('Usuário não autenticado', 401);
        }
        return req.user.id;
    };
    WeeklyMonthlyReportsController.validateQuery = function (query, schema) {
        var result = schema.safeParse(query);
        if (!result.success) {
            logger_1.default.warn('Validação falhou', {
                errors: result.error.errors,
                query: query
            });
            throw new customErrors_1.AppError('Parâmetros inválidos', 400, 'VALIDATION_ERROR', result.error.errors.map(function (err) { return ({
                field: err.path.join('.'),
                message: err.message
            }); }));
        }
        return result.data;
    };
    WeeklyMonthlyReportsController.handleFileExport = function (res, data, format, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var exportData, contentTypes, extensions, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, reportsService_1.ReportsService.exportToFormat(data, format)];
                    case 1:
                        exportData = _b.sent();
                        contentTypes = {
                            csv: 'text/csv; charset=utf-8',
                            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            pdf: 'application/pdf'
                        };
                        extensions = { csv: 'csv', xlsx: 'xlsx', pdf: 'pdf' };
                        res.setHeader('Content-Type', contentTypes[format]);
                        res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, ".").concat(extensions[format], "\""));
                        res.setHeader('Cache-Control', 'no-cache');
                        res.setHeader('Content-Length', exportData.length);
                        if (format === 'csv') {
                            // BOM para UTF-8 no Excel
                            res.send('\uFEFF' + exportData);
                        }
                        else {
                            res.send(exportData);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        logger_1.default.error('Erro na exportação', { format: format, filename: filename, error: error_1 });
                        throw new customErrors_1.AppError('Erro ao gerar arquivo de exportação', 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var _a;
    _a = WeeklyMonthlyReportsController;
    WeeklyMonthlyReportsController.CACHE_TTL = 300; // 5 minutos
    /**
     * Relatório Semanal com cache e otimizações
     */
    WeeklyMonthlyReportsController.getWeeklyReport = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, relatorio, _b, _c;
        var _d;
        return __generator(_a, function (_e) {
            switch (_e.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, weeklyReportSchema);
                    cacheKey = "weekly_report:".concat(userId, ":").concat(JSON.stringify(params));
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 1:
                    relatorio = _e.sent();
                    if (!!relatorio) return [3 /*break*/, 4];
                    logger_1.default.info('Gerando relatório semanal', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.generateWeeklyReport({
                            userId: userId,
                            startDate: params.dataInicio,
                            endDate: params.dataFim,
                            vehicleId: params.idVeiculo,
                            includeDetails: params.incluir_detalhes,
                            includeCharts: params.incluir_graficos
                        })];
                case 2:
                    relatorio = _e.sent();
                    // Cache por 5 minutos
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, relatorio, _a.CACHE_TTL)];
                case 3:
                    // Cache por 5 minutos
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (params.formato !== 'json') {
                        return [2 /*return*/, _a.handleFileExport(res, relatorio, params.formato, 'relatorio_semanal')];
                    }
                    _c = (_b = res).json;
                    _d = {
                        success: true,
                        data: relatorio
                    };
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 5:
                    _c.apply(_b, [(_d.cached = !!(_e.sent()),
                            _d.generated_at = new Date().toISOString(),
                            _d.message = 'Relatório semanal gerado com sucesso',
                            _d)]);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Relatório Mensal com cache e otimizações
     */
    WeeklyMonthlyReportsController.getMonthlyReport = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, relatorio, _b, _c;
        var _d;
        return __generator(_a, function (_e) {
            switch (_e.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, monthlyReportSchema);
                    cacheKey = "monthly_report:".concat(userId, ":").concat(JSON.stringify(params));
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 1:
                    relatorio = _e.sent();
                    if (!!relatorio) return [3 /*break*/, 4];
                    logger_1.default.info('Gerando relatório mensal', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.generateMonthlyReport({
                            userId: userId,
                            startDate: params.dataInicio,
                            endDate: params.dataFim,
                            vehicleId: params.idVeiculo,
                            includeDetails: params.incluir_detalhes,
                            includeCharts: params.incluir_graficos
                        })];
                case 2:
                    relatorio = _e.sent();
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, relatorio, _a.CACHE_TTL)];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (params.formato !== 'json') {
                        return [2 /*return*/, _a.handleFileExport(res, relatorio, params.formato, 'relatorio_mensal')];
                    }
                    _c = (_b = res).json;
                    _d = {
                        success: true,
                        data: relatorio
                    };
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 5:
                    _c.apply(_b, [(_d.cached = !!(_e.sent()),
                            _d.generated_at = new Date().toISOString(),
                            _d.message = 'Relatório mensal gerado com sucesso',
                            _d)]);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Comparativo Semanal com análise avançada
     */
    WeeklyMonthlyReportsController.getWeeklyComparison = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, comparativo;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, comparisonSchema);
                    cacheKey = "weekly_comparison:".concat(userId, ":").concat(JSON.stringify(params));
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 1:
                    comparativo = _b.sent();
                    if (!!comparativo) return [3 /*break*/, 4];
                    logger_1.default.info('Gerando comparativo semanal', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.generateWeeklyComparison({
                            userId: userId,
                            numberOfWeeks: params.numero_periodos,
                            vehicleId: params.idVeiculo,
                            includeTrends: params.incluir_tendencias,
                            includePredictions: params.incluir_previsoes
                        })];
                case 2:
                    comparativo = _b.sent();
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, comparativo, _a.CACHE_TTL)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    res.json({
                        success: true,
                        data: {
                            comparativo_semanas: comparativo.periods,
                            estatisticas: comparativo.statistics,
                            tendencias: comparativo.trends,
                            insights: comparativo.insights,
                            filtros: {
                                idVeiculo: params.idVeiculo || null,
                                numero_semanas: params.numero_periodos
                            }
                        },
                        message: 'Comparativo semanal gerado com sucesso'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Comparativo Mensal com análise avançada
     */
    WeeklyMonthlyReportsController.getMonthlyComparison = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, comparativo;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, comparisonSchema);
                    cacheKey = "monthly_comparison:".concat(userId, ":").concat(JSON.stringify(params));
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 1:
                    comparativo = _b.sent();
                    if (!!comparativo) return [3 /*break*/, 4];
                    logger_1.default.info('Gerando comparativo mensal', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.generateMonthlyComparison({
                            userId: userId,
                            numberOfMonths: params.numero_periodos,
                            vehicleId: params.idVeiculo,
                            includeTrends: params.incluir_tendencias,
                            includePredictions: params.incluir_previsoes
                        })];
                case 2:
                    comparativo = _b.sent();
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, comparativo, _a.CACHE_TTL)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    res.json({
                        success: true,
                        data: {
                            comparativo_meses: comparativo.periods,
                            estatisticas: comparativo.statistics,
                            tendencias: comparativo.trends,
                            sazonalidade: comparativo.seasonality,
                            previsoes: comparativo.predictions,
                            insights: comparativo.insights,
                            filtros: {
                                idVeiculo: params.idVeiculo || null,
                                numero_meses: params.numero_periodos
                            }
                        },
                        message: 'Comparativo mensal gerado com sucesso'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Dashboard consolidado com KPIs e alertas
     */
    WeeklyMonthlyReportsController.getDashboard = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, dashboard, _b, currentWeek, currentMonth, comparison, alerts, goals;
        var _c, _d;
        var _e, _f;
        return __generator(_a, function (_g) {
            switch (_g.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, zod_1.z.object({
                        idVeiculo: zod_1.z.string().uuid().optional(),
                        incluir_alertas: zod_1.z.boolean().default(true),
                        incluir_metas: zod_1.z.boolean().default(true)
                    }));
                    cacheKey = "dashboard:".concat(userId, ":").concat(JSON.stringify(params));
                    return [4 /*yield*/, cache_1.cacheService.get(cacheKey)];
                case 1:
                    dashboard = _g.sent();
                    if (!!dashboard) return [3 /*break*/, 5];
                    logger_1.default.info('Gerando dashboard', { userId: userId, params: params });
                    return [4 /*yield*/, Promise.all([
                            reportsService_1.ReportsService.generateWeeklyReport({ userId: userId, vehicleId: params.idVeiculo }),
                            reportsService_1.ReportsService.generateMonthlyReport({ userId: userId, vehicleId: params.idVeiculo }),
                            reportsService_1.ReportsService.generateWeeklyComparison({ userId: userId, vehicleId: params.idVeiculo }),
                            params.incluir_alertas ? reportsService_1.ReportsService.generateAlerts({ userId: userId, vehicleId: params.idVeiculo }) : null,
                            params.incluir_metas ? reportsService_1.ReportsService.getGoalsProgress(userId, params.idVeiculo) : null
                        ])];
                case 2:
                    _b = _g.sent(), currentWeek = _b[0], currentMonth = _b[1], comparison = _b[2], alerts = _b[3], goals = _b[4];
                    _c = {
                        kpis_principais: {
                            semana_atual: currentWeek,
                            mes_atual: currentMonth,
                            comparacoes: comparison
                        },
                        alertas: alerts,
                        metas: goals
                    };
                    _d = {
                        grafico_evolucao: ((_e = currentMonth.graficos) === null || _e === void 0 ? void 0 : _e.dailyRevenue) || null,
                        distribuicao_despesas: currentMonth.detalhamento_despesas || ((_f = currentMonth.graficos) === null || _f === void 0 ? void 0 : _f.expenseCategories) || null
                    };
                    return [4 /*yield*/, reportsService_1.ReportsService.getTopJourneys(userId, params.idVeiculo, 5)];
                case 3:
                    dashboard = (_c.resumo_visual = (_d.top_jornadas = _g.sent(),
                        _d),
                        _c);
                    // Cache por 2 minutos (dashboard precisa de dados mais frescos)
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, dashboard, 120)];
                case 4:
                    // Cache por 2 minutos (dashboard precisa de dados mais frescos)
                    _g.sent();
                    _g.label = 5;
                case 5:
                    res.json({
                        success: true,
                        data: dashboard,
                        last_updated: new Date().toISOString(),
                        message: 'Dashboard gerado com sucesso'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Análise de performance e eficiência
     */
    WeeklyMonthlyReportsController.getPerformanceAnalysis = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, cacheKey, _b, dataInicio, dataFim, analise;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.query, zod_1.z.object({
                        idVeiculo: zod_1.z.string().uuid().optional(),
                        periodo_analise: zod_1.z.enum(['trimestre', 'semestre', 'ano']).default('trimestre'),
                        incluir_benchmarks: zod_1.z.boolean().default(true)
                    }));
                    cacheKey = "performance:".concat(userId, ":").concat(JSON.stringify(params));
                    _b = dateUtils_1.DateUtils.calculatePeriod(params.periodo_analise), dataInicio = _b.dataInicio, dataFim = _b.dataFim;
                    if (!!analise) return [3 /*break*/, 3];
                    logger_1.default.info('Gerando análise de performance', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.getPerformanceMetrics(userId, dataInicio, dataFim, params.idVeiculo)];
                case 1:
                    analise = _c.sent();
                    // Cache por 1 hora (análise de performance muda menos frequentemente)
                    return [4 /*yield*/, cache_1.cacheService.set(cacheKey, analise, 3600)];
                case 2:
                    // Cache por 1 hora (análise de performance muda menos frequentemente)
                    _c.sent();
                    _c.label = 3;
                case 3:
                    res.json({
                        success: true,
                        data: analise,
                        message: 'Análise de performance gerada com sucesso'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Exportação em lote otimizada
     */
    WeeklyMonthlyReportsController.exportBatchReports = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, params, jobId;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    params = _a.validateQuery(req.body, zod_1.z.object({
                        tipos_relatorio: zod_1.z.array(zod_1.z.enum(['semanal', 'mensal', 'comparativo_semanal', 'comparativo_mensal', 'dashboard'])).min(1),
                        dataInicio: zod_1.z.string().datetime().optional(),
                        dataFim: zod_1.z.string().datetime().optional(),
                        idVeiculo: zod_1.z.string().uuid().optional(),
                        formato: zod_1.z.enum(['xlsx', 'pdf', 'zip']).default('xlsx'),
                        incluir_graficos: zod_1.z.boolean().default(true)
                    }));
                    logger_1.default.info('Iniciando exportação em lote', { userId: userId, params: params });
                    return [4 /*yield*/, reportsService_1.ReportsService.createBatchExportJob({
                            userId: userId,
                            reportTypes: params.tipos_relatorio,
                            startDate: params.dataInicio,
                            endDate: params.dataFim,
                            vehicleId: params.idVeiculo,
                            format: params.formato,
                            includeCharts: params.incluir_graficos
                        })];
                case 1:
                    jobId = _b.sent();
                    res.json({
                        success: true,
                        data: {
                            job_id: jobId,
                            status: 'processing',
                            estimated_completion: new Date(Date.now() + 30000).toISOString() // 30 segundos
                        },
                        message: 'Exportação iniciada. Use o job_id para verificar o status.'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Verificar status de exportação em lote
     */
    WeeklyMonthlyReportsController.getBatchExportStatus = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, jobId, status;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    jobId = req.params.jobId;
                    if (!jobId) {
                        throw new customErrors_1.AppError('Job ID é obrigatório', 400);
                    }
                    return [4 /*yield*/, reportsService_1.ReportsService.getBatchExportStatus(jobId)];
                case 1:
                    status = _b.sent();
                    if (!status) {
                        throw new customErrors_1.AppError('Job não encontrado', 404);
                    }
                    if (status.status === 'completed' && status.downloadUrl) {
                        res.json({
                            success: true,
                            data: {
                                status: status.status,
                                download_url: status.downloadUrl,
                                expires_at: status.expiresAt
                            },
                            message: 'Exportação concluída'
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            data: {
                                status: status.status,
                                progress: status.progress,
                                estimated_completion: status.estimatedCompletion
                            },
                            message: "Status: ".concat(status.status)
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Limpar cache de relatórios
     */
    WeeklyMonthlyReportsController.clearReportsCache = (0, asyncHandler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, patterns, clearedCount, _i, patterns_1, pattern, count;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = _a.extractUserId(req);
                    patterns = [
                        "weekly_report:".concat(userId, ":*"),
                        "monthly_report:".concat(userId, ":*"),
                        "weekly_comparison:".concat(userId, ":*"),
                        "monthly_comparison:".concat(userId, ":*"),
                        "dashboard:".concat(userId, ":*"),
                        "performance:".concat(userId, ":*")
                    ];
                    clearedCount = 0;
                    _i = 0, patterns_1 = patterns;
                    _b.label = 1;
                case 1:
                    if (!(_i < patterns_1.length)) return [3 /*break*/, 4];
                    pattern = patterns_1[_i];
                    return [4 /*yield*/, cache_1.cacheService.clearByPattern(pattern)];
                case 2:
                    count = _b.sent();
                    clearedCount += count;
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    logger_1.default.info('Cache limpo', { userId: userId, clearedCount: clearedCount });
                    res.json({
                        success: true,
                        data: { cleared_entries: clearedCount },
                        message: 'Cache de relatórios limpo com sucesso'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    return WeeklyMonthlyReportsController;
}());
exports.WeeklyMonthlyReportsController = WeeklyMonthlyReportsController;
