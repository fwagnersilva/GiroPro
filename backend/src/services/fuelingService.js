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
exports.FuelingService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("crypto");
// 🔧 Utilitários de conversão e validação
var FuelingUtils = /** @class */ (function () {
    function FuelingUtils() {
    }
    /**
     * Converte preço por litro para centavos
     */
    FuelingUtils.priceToCents = function (price) {
        if (!Number.isFinite(price) || price < 0) {
            throw new Error('Preço deve ser um número válido e positivo');
        }
        return Math.round(price * 100);
    };
    /**
     * Converte centavos para preço
     */
    FuelingUtils.centsToPrice = function (cents) {
        return cents / 100;
    };
    /**
     * Valida tipo de combustível
     */
    FuelingUtils.validateFuelType = function (type) {
        var validTypes = ["gasolina", "etanol", "diesel", "gnv", "flex"];
        var normalizedType = type.toLowerCase();
        if (!validTypes.includes(normalizedType)) {
            throw new Error("Tipo de combust\u00EDvel inv\u00E1lido. Valores aceitos: ".concat(validTypes.join(', ')));
        }
        return normalizedType;
    };
    /**
     * Valida dados de abastecimento
     */
    FuelingUtils.validateFuelingData = function (data) {
        if (!data.vehicleId || typeof data.vehicleId !== 'string') {
            throw new Error('ID do veículo é obrigatório');
        }
        if (!data.data || isNaN(new Date(data.data).getTime())) {
            throw new Error('Data de abastecimento é obrigatória e deve ser válida');
        }
        if (!Number.isFinite(data.quilometragem) || data.quilometragem < 0) {
            throw new Error('Quilometragem deve ser um número válido e positivo');
        }
        if (!Number.isFinite(data.litros) || data.litros <= 0) {
            throw new Error('Quantidade de litros deve ser um número válido e positivo');
        }
        if (!Number.isFinite(data.precoPorLitro) || data.precoPorLitro <= 0) {
            throw new Error('Preço por litro deve ser um número válido e positivo');
        }
    };
    /**
     * Converte dados de entrada para formato do banco
     */
    FuelingUtils.mapToDatabase = function (userId, data) {
        var _a;
        return {
            id: crypto_1.default.randomUUID(),
            idUsuario: userId,
            idVeiculo: data.vehicleId,
            dataAbastecimento: new Date(data.data),
            kmAtual: data.quilometragem,
            litros: data.litros,
            valorTotal: this.priceToCents(data.litros * data.precoPorLitro),
            valorLitro: this.priceToCents(data.precoPorLitro),
            nomePosto: ((_a = data.posto) === null || _a === void 0 ? void 0 : _a.trim()) || null,
            tipoCombustivel: this.validateFuelType(data.tipoCombustivel),
        };
    };
    return FuelingUtils;
}());
var FuelingService = /** @class */ (function () {
    function FuelingService() {
    }
    /**
     * 🚀 Criar novo abastecimento com validação completa
     */
    FuelingService.createFueling = function (userId, fuelingData) {
        return __awaiter(this, void 0, void 0, function () {
            var vehicleExists, newFuelingData_1, newFueling, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Validação de entrada
                        FuelingUtils.validateFuelingData(fuelingData);
                        return [4 /*yield*/, db_1.db
                                .select({ id: schema_postgres_1.veiculos.id })
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, fuelingData.vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId)))
                                .limit(1)];
                    case 1:
                        vehicleExists = _a.sent();
                        if (vehicleExists.length === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Veículo não encontrado ou não pertence ao usuário'
                                }];
                        }
                        newFuelingData_1 = FuelingUtils.mapToDatabase(userId, fuelingData);
                        return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.insert(schema_postgres_1.abastecimentos)
                                                .values(__assign(__assign({}, newFuelingData_1), { createdAt: new Date(), updatedAt: new Date() }))
                                                .returning()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 2:
                        newFueling = (_a.sent())[0];
                        return [2 /*return*/, {
                                success: true,
                                data: newFueling
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('[FuelingService.createFueling]', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : 'Erro interno do servidor'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 📋 Obter abastecimentos por usuário com paginação e filtros
     */
    FuelingService.getFuelingsByUserId = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, options) {
            var _a, pagination, _b, filters, _c, orderBy, conditions, query, orderedQuery, offset, results, hasMore, fuelings, total, countResult, result, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = options.pagination, pagination = _a === void 0 ? { page: 1, limit: 50 } : _a, _b = options.filters, filters = _b === void 0 ? {} : _b, _c = options.orderBy, orderBy = _c === void 0 ? 'date_desc' : _c;
                        conditions = [(0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId)];
                        if (filters.vehicleId) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idVeiculo, filters.vehicleId));
                        }
                        if (filters.startDate && filters.endDate) {
                            conditions.push((0, drizzle_orm_1.between)(schema_postgres_1.abastecimentos.dataAbastecimento, new Date(filters.startDate), new Date(filters.endDate)));
                        }
                        if (filters.fuelType) {
                            conditions.push((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.tipoCombustivel, FuelingUtils.validateFuelType(filters.fuelType)));
                        }
                        query = db_1.db.select().from(schema_postgres_1.abastecimentos)
                            .where(drizzle_orm_1.and.apply(void 0, conditions));
                        orderedQuery = void 0;
                        switch (orderBy) {
                            case 'date_asc':
                                orderedQuery = query.orderBy((0, drizzle_orm_1.asc)(schema_postgres_1.abastecimentos.dataAbastecimento));
                                break;
                            case 'date_desc':
                                orderedQuery = query.orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.abastecimentos.dataAbastecimento));
                                break;
                            case 'km_asc':
                                orderedQuery = query.orderBy((0, drizzle_orm_1.asc)(schema_postgres_1.abastecimentos.kmAtual));
                                break;
                            case 'km_desc':
                                orderedQuery = query.orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.abastecimentos.kmAtual));
                                break;
                            default:
                                orderedQuery = query;
                                break;
                        }
                        offset = (pagination.page - 1) * pagination.limit;
                        return [4 /*yield*/, orderedQuery.limit(pagination.limit + 1).offset(offset)];
                    case 1:
                        results = _d.sent();
                        hasMore = results.length > pagination.limit;
                        fuelings = hasMore ? results.slice(0, -1) : results;
                        total = 0;
                        if (!(pagination.page === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db
                                .select({ count: (0, drizzle_orm_1.count)() })
                                .from(schema_postgres_1.abastecimentos)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))];
                    case 2:
                        countResult = (_d.sent())[0];
                        total = countResult.count;
                        _d.label = 3;
                    case 3:
                        result = { fuelings: fuelings, total: total, hasMore: hasMore };
                        return [2 /*return*/, {
                                success: true,
                                data: result
                            }];
                    case 4:
                        error_2 = _d.sent();
                        console.error('[FuelingService.getFuelingsByUserId]', error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Erro ao buscar abastecimentos'
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 🔍 Obter abastecimento por ID com validação de propriedade
     */
    FuelingService.getFuelingById = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var fueling, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.abastecimentos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId)))
                                .limit(1)];
                    case 1:
                        fueling = (_a.sent())[0];
                        return [2 /*return*/, {
                                success: true,
                                data: fueling ? fueling : null
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('[FuelingService.getFuelingById]', error_3);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Erro ao buscar abastecimento'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 🗑️ Deletar abastecimento com confirmação
     */
    FuelingService.deleteFueling = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, deleted, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .delete(schema_postgres_1.abastecimentos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId)))
                                .returning({ id: schema_postgres_1.abastecimentos.id })];
                    case 1:
                        result = _a.sent();
                        deleted = result.length > 0;
                        return [2 /*return*/, {
                                success: true,
                                data: deleted
                            }];
                    case 2:
                        error_4 = _a.sent();
                        console.error('[FuelingService.deleteFueling]', error_4);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Erro ao deletar abastecimento'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 📊 Obter estatísticas de abastecimento para o dashboard
     */
    FuelingService.getFuelingStatistics = function (userId, periodo) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, fuelings, totalFuelings, totalSpent, totalLiters, averagePrice, lastFueling, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startDate = void 0;
                        endDate = new Date();
                        switch (periodo) {
                            case 'day':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 1);
                                break;
                            case 'week':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
                                break;
                            case 'month':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
                                break;
                            case 'quarter':
                                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
                                break;
                            case 'year':
                                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                                break;
                            case 'all':
                            default:
                                startDate = new Date(0);
                                break;
                        }
                        return [4 /*yield*/, db_1.db.select()
                                .from(schema_postgres_1.abastecimentos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.gte)(schema_postgres_1.abastecimentos.dataAbastecimento, startDate), (0, drizzle_orm_1.lte)(schema_postgres_1.abastecimentos.dataAbastecimento, endDate)))];
                    case 1:
                        fuelings = _a.sent();
                        totalFuelings = fuelings.length;
                        totalSpent = fuelings.reduce(function (sum, f) { return sum + f.valorTotal; }, 0);
                        totalLiters = fuelings.reduce(function (sum, f) { return sum + f.litros; }, 0);
                        averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;
                        lastFueling = fuelings.length > 0 ? Math.max.apply(Math, fuelings.map(function (f) { return f.dataAbastecimento.getTime(); })) : undefined;
                        result = {
                            totalFuelings: totalFuelings,
                            totalSpent: FuelingUtils.centsToPrice(totalSpent),
                            totalLiters: totalLiters,
                            averagePrice: FuelingUtils.centsToPrice(averagePrice),
                            lastFueling: lastFueling ? new Date(lastFueling).toISOString() : undefined,
                        };
                        return [2 /*return*/, { success: true, data: result }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('[FuelingService.getFuelingStatistics]', error_5);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Erro ao obter estatísticas de abastecimento'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ✏️ Atualizar abastecimento existente
     */
    FuelingService.updateFueling = function (id, userId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingFueling, updateFields, vehicleExists, litros, updatedFueling, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getFuelingById(id, userId)];
                    case 1:
                        existingFueling = _b.sent();
                        if (!existingFueling.success || !existingFueling.data) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Abastecimento não encontrado ou não pertence ao usuário'
                                }];
                        }
                        updateFields = {
                            updatedAt: new Date()
                        };
                        if (!updateData.vehicleId) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db
                                .select({ id: schema_postgres_1.veiculos.id })
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, updateData.vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId)))
                                .limit(1)];
                    case 2:
                        vehicleExists = _b.sent();
                        if (vehicleExists.length === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Veículo não encontrado ou não pertence ao usuário'
                                }];
                        }
                        updateFields.idVeiculo = updateData.vehicleId;
                        _b.label = 3;
                    case 3:
                        if (updateData.data) {
                            updateFields.dataAbastecimento = new Date(updateData.data);
                        }
                        if (updateData.quilometragem !== undefined) {
                            if (!Number.isFinite(updateData.quilometragem) || updateData.quilometragem < 0) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Quilometragem deve ser um número válido e positivo'
                                    }];
                            }
                            updateFields.kmAtual = updateData.quilometragem;
                        }
                        if (updateData.litros !== undefined) {
                            if (!Number.isFinite(updateData.litros) || updateData.litros <= 0) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Quantidade de litros deve ser um número válido e positivo'
                                    }];
                            }
                            updateFields.litros = updateData.litros;
                        }
                        if (updateData.precoPorLitro !== undefined) {
                            if (!Number.isFinite(updateData.precoPorLitro) || updateData.precoPorLitro <= 0) {
                                return [2 /*return*/, {
                                        success: false,
                                        error: 'Preço por litro deve ser um número válido e positivo'
                                    }];
                            }
                            updateFields.valorLitro = FuelingUtils.priceToCents(updateData.precoPorLitro);
                            litros = updateData.litros || existingFueling.data.litros;
                            updateFields.valorTotal = FuelingUtils.priceToCents(litros * updateData.precoPorLitro);
                        }
                        if (updateData.posto !== undefined) {
                            updateFields.nomePosto = ((_a = updateData.posto) === null || _a === void 0 ? void 0 : _a.trim()) || null;
                        }
                        if (updateData.tipoCombustivel) {
                            updateFields.tipoCombustivel = FuelingUtils.validateFuelType(updateData.tipoCombustivel);
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.abastecimentos)
                                .set(updateFields)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId)))
                                .returning()];
                    case 4:
                        updatedFueling = (_b.sent())[0];
                        return [2 /*return*/, {
                                success: true,
                                data: updatedFueling ? updatedFueling : null
                            }];
                    case 5:
                        error_6 = _b.sent();
                        console.error('[FuelingService.updateFueling]', error_6);
                        return [2 /*return*/, {
                                success: false,
                                error: error_6 instanceof Error ? error_6.message : 'Erro ao atualizar abastecimento'
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return FuelingService;
}());
exports.FuelingService = FuelingService;
