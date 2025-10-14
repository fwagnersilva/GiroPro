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
exports.JourneyService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("crypto");
var JourneyService = /** @class */ (function () {
    function JourneyService() {
    }
    JourneyService.createJourney = function (userId, journeyData) {
        return __awaiter(this, void 0, void 0, function () {
            var newJourneyData, newJourney, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newJourneyData = {
                            id: crypto_1.default.randomUUID(),
                            idUsuario: userId,
                            idVeiculo: journeyData.idVeiculo,
                            dataInicio: new Date(journeyData.dataInicio),
                            kmInicio: journeyData.kmInicio,
                            dataFim: null,
                            kmFim: null,
                            ganhoBruto: null,
                            kmTotal: null,
                            duracaoMinutos: null, // ✅ Corrigido: era tempoTotal
                            observacoes: journeyData.observacoes || null,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.jornadas).values(newJourneyData).returning()];
                    case 2:
                        newJourney = (_a.sent())[0];
                        return [2 /*return*/, newJourney];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Erro ao criar jornada:", error_1);
                        throw new Error("Falha ao criar jornada");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    JourneyService.getJourneysByUserId = function (userId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, sortBy, _d, sortOrder, filters, whereConditions, totalCountResult, total, totalPages, journeys, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 10 : _b, _c = options.sortBy, sortBy = _c === void 0 ? 'dataInicio' : _c, _d = options.sortOrder, sortOrder = _d === void 0 ? 'desc' : _d, filters = options.filters;
                        whereConditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId));
                        // Filtro por status
                        if ((filters === null || filters === void 0 ? void 0 : filters.status) === 'em_andamento') {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.dataFim));
                        }
                        else if ((filters === null || filters === void 0 ? void 0 : filters.status) === 'concluida') {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.ne)(schema_postgres_1.jornadas.dataFim, null));
                        }
                        // Filtro por data de início
                        if (filters === null || filters === void 0 ? void 0 : filters.dataInicio) {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, new Date(filters.dataInicio)));
                        }
                        // Filtro por data de fim
                        if (filters === null || filters === void 0 ? void 0 : filters.dataFim) {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, new Date(filters.dataFim)));
                        }
                        // Filtro por veículo
                        if (filters === null || filters === void 0 ? void 0 : filters.veiculoId) {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idVeiculo, filters.veiculoId));
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, db_1.db.select({ count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)"], ["count(*)"]))) }).from(schema_postgres_1.jornadas).where(whereConditions)];
                    case 2:
                        totalCountResult = (_e.sent())[0];
                        total = totalCountResult.count;
                        totalPages = Math.ceil(total / limit);
                        return [4 /*yield*/, db_1.db.select()
                                .from(schema_postgres_1.jornadas)
                                .where(whereConditions)
                                .orderBy(sortOrder === 'asc' ? (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " ASC"], ["", " ASC"])), schema_postgres_1.jornadas[sortBy]) : (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", " DESC"], ["", " DESC"])), schema_postgres_1.jornadas[sortBy]))
                                .limit(limit)
                                .offset((page - 1) * limit)];
                    case 3:
                        journeys = _e.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: journeys,
                                meta: {
                                    pagination: {
                                        page: page,
                                        limit: limit,
                                        total: total,
                                        totalPages: totalPages,
                                        hasNext: page < totalPages,
                                        hasPrev: page > 1,
                                    },
                                },
                            }];
                    case 4:
                        error_2 = _e.sent();
                        console.error("Erro ao buscar jornadas:", error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: "Falha ao buscar jornadas",
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    JourneyService.getJourneyById = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var journey, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select()
                                .from(schema_postgres_1.jornadas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId)))];
                    case 1:
                        journey = (_a.sent())[0];
                        return [2 /*return*/, journey || null];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Erro ao buscar jornada:", error_3);
                        throw new Error("Falha ao buscar jornada");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JourneyService.updateJourney = function (id, userId, journeyData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingJourney, dataToUpdate, totalGanhoBruto_1, faturamentoInserts, inicio, fim, diffMs, updatedJourney, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getJourneyById(id, userId)];
                    case 1:
                        existingJourney = _a.sent();
                        if (!existingJourney) {
                            throw new Error("Jornada não encontrada");
                        }
                        dataToUpdate = {};
                        // Processar cada campo com validação
                        if (journeyData.dataFim !== undefined) {
                            dataToUpdate.dataFim = journeyData.dataFim ? new Date(journeyData.dataFim) : null;
                        }
                        if (journeyData.kmFim !== undefined) {
                            dataToUpdate.kmFim = journeyData.kmFim;
                            // Calcular kmTotal se tivermos km_inicio e km_fim
                            if (journeyData.kmFim && existingJourney.kmInicio) {
                                dataToUpdate.kmTotal = journeyData.kmFim - existingJourney.kmInicio;
                            }
                        }
                        if (!(journeyData.faturamentoPorPlataforma && journeyData.faturamentoPorPlataforma.length > 0)) return [3 /*break*/, 5];
                        totalGanhoBruto_1 = 0;
                        faturamentoInserts = journeyData.faturamentoPorPlataforma.map(function (item) {
                            var valorTotalPlataforma = (item.valueBeforeCutoff || 0) + (item.valueAfterCutoff || 0);
                            totalGanhoBruto_1 += valorTotalPlataforma;
                            return {
                                id: crypto_1.default.randomUUID(),
                                idJornada: id,
                                idPlataforma: item.platformId,
                                valor: Math.round(valorTotalPlataforma),
                                valorAntesCorte: item.valueBeforeCutoff ? Math.round(item.valueBeforeCutoff) : null,
                                valorDepoisCorte: item.valueAfterCutoff ? Math.round(item.valueAfterCutoff) : null,
                                createdAt: new Date(),
                            };
                        });
                        // Primeiro, deletar faturamentos existentes para esta jornada para evitar duplicatas
                        return [4 /*yield*/, db_1.db.delete(schema_postgres_1.jornadasFaturamentoPorPlataforma).where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadasFaturamentoPorPlataforma.idJornada, id))];
                    case 2:
                        // Primeiro, deletar faturamentos existentes para esta jornada para evitar duplicatas
                        _a.sent();
                        if (!(faturamentoInserts.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.jornadasFaturamentoPorPlataforma).values(faturamentoInserts)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        dataToUpdate.ganhoBruto = Math.round(totalGanhoBruto_1);
                        return [3 /*break*/, 6];
                    case 5:
                        if (journeyData.ganhoBruto !== undefined) {
                            // Manter compatibilidade se faturamentoPorPlataforma não for fornecido
                            dataToUpdate.ganhoBruto = journeyData.ganhoBruto;
                        }
                        _a.label = 6;
                    case 6:
                        if (journeyData.observacoes !== undefined) {
                            dataToUpdate.observacoes = journeyData.observacoes;
                        }
                        // ✅ CORRIGIDO: Calcular duração em minutos se a jornada estiver sendo finalizada
                        if (dataToUpdate.dataFim && existingJourney.dataInicio) {
                            inicio = new Date(existingJourney.dataInicio);
                            fim = new Date(dataToUpdate.dataFim);
                            diffMs = fim.getTime() - inicio.getTime();
                            dataToUpdate.duracaoMinutos = Math.floor(diffMs / (1000 * 60)); // Duração em minutos
                        }
                        return [4 /*yield*/, db_1.db.update(schema_postgres_1.jornadas)
                                .set(dataToUpdate)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId)))
                                .returning()];
                    case 7:
                        updatedJourney = (_a.sent())[0];
                        return [2 /*return*/, updatedJourney];
                    case 8:
                        error_4 = _a.sent();
                        console.error("Erro ao atualizar jornada:", error_4);
                        throw error_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    JourneyService.deleteJourney = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.delete(schema_postgres_1.jornadas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId)))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Erro ao deletar jornada:", error_5);
                        throw new Error("Falha ao deletar jornada");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Método adicional para obter jornadas em andamento
    JourneyService.getActiveJourneys = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select()
                            .from(schema_postgres_1.jornadas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.dataFim)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Método adicional para finalizar uma jornada
    JourneyService.finishJourney = function (id, userId, kmFim, faturamentoPorPlataforma, observacoes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateJourney(id, userId, {
                            dataFim: new Date().toISOString(),
                            kmFim: kmFim,
                            faturamentoPorPlataforma: faturamentoPorPlataforma,
                            observacoes: observacoes
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JourneyService.getJourneyStatistics = function (userId, periodo) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endDate = new Date();
                        switch (periodo) {
                            case 'semana':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
                                break;
                            case 'mes':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
                                break;
                            case 'trimestre':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
                                break;
                            case 'ano':
                                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                                break;
                            default:
                                startDate = new Date(0); // Desde o início dos tempos
                                break;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select({
                                totalJourneys: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["count(", ")"], ["count(", ")"])), schema_postgres_1.jornadas.id),
                                totalKm: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["sum(", ")"], ["sum(", ")"])), schema_postgres_1.jornadas.kmTotal),
                                totalGanhoBruto: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["sum(", ")"], ["sum(", ")"])), schema_postgres_1.jornadas.ganhoBruto),
                            })
                                .from(schema_postgres_1.jornadas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.jornadas.dataInicio, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.jornadas.dataInicio, endDate), (0, drizzle_orm_1.ne)(schema_postgres_1.jornadas.dataFim, null) // Apenas jornadas concluídas
                            ))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 3:
                        error_6 = _a.sent();
                        console.error("Erro ao buscar estatísticas de jornada:", error_6);
                        throw new Error("Falha ao buscar estatísticas de jornada");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return JourneyService;
}());
exports.JourneyService = JourneyService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
