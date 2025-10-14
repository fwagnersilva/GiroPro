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
exports.ReportsController = void 0;
var zod_1 = require("zod");
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var csv_utils_1 = require("../utils/csv_utils");
var pdf_utils_1 = require("../utils/pdf_utils");
// ====================== SCHEMAS ======================
var reportsQuerySchema = zod_1.z.object({
    periodo: zod_1.z.enum(['hoje', 'semana', 'mes', 'trimestre', 'semestre', 'ano', 'personalizado']).default('mes'),
    dataInicio: zod_1.z.string().optional(),
    dataFim: zod_1.z.string().optional(),
    idVeiculo: zod_1.z.string().optional()
});
// ====================== HELPERS ======================
var DateHelper = /** @class */ (function () {
    function DateHelper() {
    }
    DateHelper.calcularPeriodo = function (periodo, dataInicio, dataFim) {
        var hoje = new Date();
        var inicio;
        var fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
        switch (periodo) {
            case 'hoje':
                inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
                break;
            case 'semana':
                var diaSemana = hoje.getDay();
                inicio = new Date(hoje);
                inicio.setDate(hoje.getDate() - diaSemana);
                inicio.setHours(0, 0, 0, 0);
                break;
            case 'mes':
                inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);
                break;
            case 'trimestre':
                var mesAtual = hoje.getMonth();
                var inicioTrimestre = Math.floor(mesAtual / 3) * 3;
                inicio = new Date(hoje.getFullYear(), inicioTrimestre, 1, 0, 0, 0);
                break;
            case 'semestre':
                var inicioSemestre = hoje.getMonth() < 6 ? 0 : 6;
                inicio = new Date(hoje.getFullYear(), inicioSemestre, 1, 0, 0, 0);
                break;
            case 'ano':
                inicio = new Date(hoje.getFullYear(), 0, 1, 0, 0, 0);
                break;
            case 'personalizado':
                if (!dataInicio || !dataFim) {
                    throw new Error('Para período personalizado, dataInicio e dataFim são obrigatórios');
                }
                inicio = new Date(dataInicio + 'T00:00:00');
                fim = new Date(dataFim + 'T23:59:59');
                break;
            default:
                inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);
        }
        return { dataInicio: inicio, dataFim: fim };
    };
    return DateHelper;
}());
// ====================== CONTROLLER ======================
var ReportsController = /** @class */ (function () {
    function ReportsController() {
    }
    /**
     * Valida autenticação do usuário
     */
    ReportsController.validateAuth = function (req) {
        var _a;
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    };
    /**
     * Resposta de erro padronizada
     */
    ReportsController.errorResponse = function (res, status, message, details) {
        console.error("[ReportsController] Error ".concat(status, ": ").concat(message), details);
        return res.status(status).json({
            success: false,
            message: message,
            details: details,
            timestamp: new Date().toISOString()
        });
    };
    /**
     * Resposta de sucesso padronizada
     */
    ReportsController.successResponse = function (res, message, data) {
        return res.status(200).json({
            success: true,
            message: message,
            data: data
        });
    };
    /**
     * Valida parâmetros de consulta comuns
     */
    ReportsController.validateQueryParams = function (req) {
        var userId = this.validateAuth(req);
        if (!userId) {
            return {
                userId: null,
                error: 'Usuário não autenticado'
            };
        }
        var queryValidation = reportsQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            return {
                userId: null,
                error: 'Parâmetros de consulta inválidos',
                details: queryValidation.error.errors
            };
        }
        return {
            userId: userId,
            queryData: queryValidation.data,
            error: null
        };
    };
    /**
     * Exportar relatório de jornadas em CSV
     */
    ReportsController.getJourneysCsvReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, userId, queryData, _a, periodo, dataInicio, dataFim, idVeiculo, _b, parsedDataInicio, parsedDataFim, jornadasDetalhadas, csvContent, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        validation = ReportsController.validateQueryParams(req);
                        if (validation.error) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 401, validation.error, validation.details)];
                        }
                        userId = validation.userId, queryData = validation.queryData;
                        _a = queryData, periodo = _a.periodo, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo;
                        _b = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim), parsedDataInicio = _b.dataInicio, parsedDataFim = _b.dataFim;
                        console.log("[ReportsController] Gerando CSV de jornadas - Usu\u00E1rio: ".concat(userId, ", Per\u00EDodo: ").concat(periodo));
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.jornadas.id,
                                dataInicio: schema_postgres_1.jornadas.dataInicio,
                                dataFim: schema_postgres_1.jornadas.dataFim,
                                duracaoMinutos: schema_postgres_1.jornadas.duracaoMinutos,
                                kmInicio: schema_postgres_1.jornadas.kmInicio,
                                kmFim: schema_postgres_1.jornadas.kmFim,
                                ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                                custoCombustivelEstimado: schema_postgres_1.jornadas.custoCombustivelEstimado,
                                outrasDespesas: schema_postgres_1.jornadas.outrasDespesas,
                                lucroLiquidoEstimado: schema_postgres_1.jornadas.lucroLiquidoEstimado,
                                margemLucro: schema_postgres_1.jornadas.margemLucro,
                                veiculo: {
                                    id: schema_postgres_1.veiculos.id,
                                    marca: schema_postgres_1.veiculos.marca,
                                    modelo: schema_postgres_1.veiculos.modelo,
                                    placa: schema_postgres_1.veiculos.placa,
                                    tipoCombustivel: schema_postgres_1.veiculos.tipoCombustivel
                                }
                            })
                                .from(schema_postgres_1.jornadas)
                                .leftJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, parsedDataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, parsedDataFim), idVeiculo ? (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, idVeiculo) : undefined))
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.jornadas.dataInicio))];
                    case 1:
                        jornadasDetalhadas = _c.sent();
                        csvContent = (0, csv_utils_1.generateJourneysCsv)(jornadasDetalhadas);
                        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                        res.setHeader('Content-Disposition', 'attachment; filename="jornadas.csv"');
                        return [2 /*return*/, res.status(200).send(csvContent)];
                    case 2:
                        error_1 = _c.sent();
                        return [2 /*return*/, ReportsController.errorResponse(res, 500, "Erro ao gerar CSV de jornadas", error_1.message)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exportar relatório de despesas em PDF
     */
    ReportsController.getExpensesPdfReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, userId, queryData, _a, periodo, dataInicio, dataFim, idVeiculo, _b, parsedDataInicio, parsedDataFim, despesasDetalhadas, pdfBuffer, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        validation = ReportsController.validateQueryParams(req);
                        if (validation.error) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 401, validation.error, validation.details)];
                        }
                        userId = validation.userId, queryData = validation.queryData;
                        _a = queryData, periodo = _a.periodo, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo;
                        _b = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim), parsedDataInicio = _b.dataInicio, parsedDataFim = _b.dataFim;
                        console.log("[ReportsController] Gerando PDF de despesas - Usu\u00E1rio: ".concat(userId, ", Per\u00EDodo: ").concat(periodo));
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.despesas.id,
                                dataDespesa: schema_postgres_1.despesas.dataDespesa,
                                descricao: schema_postgres_1.despesas.descricao,
                                valorDespesa: schema_postgres_1.despesas.valorDespesa,
                                tipoDespesa: schema_postgres_1.despesas.tipoDespesa,
                                veiculo: {
                                    id: schema_postgres_1.veiculos.id,
                                    marca: schema_postgres_1.veiculos.marca,
                                    modelo: schema_postgres_1.veiculos.modelo,
                                    placa: schema_postgres_1.veiculos.placa
                                }
                            })
                                .from(schema_postgres_1.despesas)
                                .leftJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, parsedDataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, parsedDataFim), idVeiculo ? (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, idVeiculo) : undefined))
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.despesas.dataDespesa))];
                    case 1:
                        despesasDetalhadas = _c.sent();
                        return [4 /*yield*/, (0, pdf_utils_1.generateExpensesPdf)(despesasDetalhadas)];
                    case 2:
                        pdfBuffer = _c.sent();
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename="despesas.pdf"');
                        return [2 /*return*/, res.status(200).send(pdfBuffer)];
                    case 3:
                        error_2 = _c.sent();
                        return [2 /*return*/, ReportsController.errorResponse(res, 500, "Erro ao gerar PDF de despesas", error_2.message)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ====================== MÉTODOS FALTANTES ======================
    ReportsController.getJourneyEarningsReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, dataInicio, dataFim, idVeiculo, parsedDataInicio, parsedDataFim, jornadasGanhos, error_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        if (!userId) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        _a = req.query, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo;
                        // Validação de parâmetros
                        if (!dataInicio || !dataFim) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios")];
                        }
                        parsedDataInicio = new Date(dataInicio);
                        parsedDataFim = new Date(dataFim);
                        if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Formato de data inválido")];
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.jornadas.id,
                                dataInicio: schema_postgres_1.jornadas.dataInicio,
                                dataFim: schema_postgres_1.jornadas.dataFim,
                                ganhoBruto: schema_postgres_1.jornadas.ganhoBruto,
                                lucroLiquidoEstimado: schema_postgres_1.jornadas.lucroLiquidoEstimado,
                                margemLucro: schema_postgres_1.jornadas.margemLucro,
                                veiculo: {
                                    marca: schema_postgres_1.veiculos.marca,
                                    modelo: schema_postgres_1.veiculos.modelo,
                                    placa: schema_postgres_1.veiculos.placa
                                }
                            })
                                .from(schema_postgres_1.jornadas)
                                .leftJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, parsedDataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataFim, parsedDataFim), idVeiculo ? (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, idVeiculo) : undefined))
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.jornadas.dataInicio))];
                    case 1:
                        jornadasGanhos = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: jornadasGanhos,
                                message: "Relatório de ganhos por jornada gerado com sucesso"
                            })];
                    case 2:
                        error_3 = _c.sent();
                        return [2 /*return*/, ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de ganhos", error_3.message)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReportsController.getExpenseAnalysisReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, dataInicio, dataFim, idVeiculo, parsedDataInicio, parsedDataFim, analiseDesp, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        if (!userId) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        _a = req.query, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo;
                        // Validação de parâmetros
                        if (!dataInicio || !dataFim) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios")];
                        }
                        parsedDataInicio = new Date(dataInicio);
                        parsedDataFim = new Date(dataFim);
                        if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Formato de data inválido")];
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                categoria: schema_postgres_1.despesas.tipoDespesa,
                                totalGasto: (0, drizzle_orm_1.sum)(schema_postgres_1.despesas.valorDespesa),
                                quantidadeTransacoes: (0, drizzle_orm_1.count)(schema_postgres_1.despesas.id),
                                mediaGasto: (0, drizzle_orm_1.avg)(schema_postgres_1.despesas.valorDespesa)
                            })
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.despesas.dataDespesa, parsedDataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.despesas.dataDespesa, parsedDataFim), idVeiculo ? (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idVeiculo, idVeiculo) : undefined))
                                .groupBy(schema_postgres_1.despesas.tipoDespesa)];
                    case 1:
                        analiseDesp = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: analiseDesp,
                                message: "Análise de despesas gerada com sucesso"
                            })];
                    case 2:
                        error_4 = _c.sent();
                        return [2 /*return*/, ReportsController.errorResponse(res, 500, "Erro ao gerar análise de despesas", error_4.message)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReportsController.getFuelConsumptionReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, dataInicio, dataFim, idVeiculo, parsedDataInicio, parsedDataFim, consumoCombustivel, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        if (!userId) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        _a = req.query, dataInicio = _a.dataInicio, dataFim = _a.dataFim, idVeiculo = _a.idVeiculo;
                        // Validação de parâmetros
                        if (!dataInicio || !dataFim) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios")];
                        }
                        parsedDataInicio = new Date(dataInicio);
                        parsedDataFim = new Date(dataFim);
                        if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
                            return [2 /*return*/, ReportsController.errorResponse(res, 400, "Formato de data inválido")];
                        }
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_postgres_1.abastecimentos.id,
                                dataAbastecimento: schema_postgres_1.abastecimentos.dataAbastecimento,
                                litros: schema_postgres_1.abastecimentos.litros,
                                valorTotal: schema_postgres_1.abastecimentos.valorTotal,
                                // precoPorLitro: abastecimentos.precoPorLitro, // Campo não encontrado na tabela
                                kmAtual: schema_postgres_1.abastecimentos.kmAtual,
                                veiculo: {
                                    marca: schema_postgres_1.veiculos.marca,
                                    modelo: schema_postgres_1.veiculos.modelo,
                                    placa: schema_postgres_1.veiculos.placa
                                }
                            })
                                .from(schema_postgres_1.abastecimentos)
                                .leftJoin(schema_postgres_1.veiculos, (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idVeiculo, schema_postgres_1.veiculos.id))
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt), (0, drizzle_orm_1.gte)(schema_postgres_1.abastecimentos.dataAbastecimento, parsedDataInicio), (0, drizzle_orm_1.lte)(schema_postgres_1.abastecimentos.dataAbastecimento, parsedDataFim), idVeiculo ? (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idVeiculo, idVeiculo) : undefined))
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.abastecimentos.dataAbastecimento))];
                    case 1:
                        consumoCombustivel = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: consumoCombustivel,
                                message: "Relatório de consumo de combustível gerado com sucesso"
                            })];
                    case 2:
                        error_5 = _c.sent();
                        return [2 /*return*/, ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de consumo", error_5.message)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ReportsController;
}());
exports.ReportsController = ReportsController;
