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
exports.ExpenseService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var crypto = require("crypto");
var ExpenseService = /** @class */ (function () {
    function ExpenseService() {
    }
    /**
     * Cria uma nova despesa
     */
    ExpenseService.createExpense = function (userId, expenseData) {
        return __awaiter(this, void 0, void 0, function () {
            var newExpense, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newExpense = {
                            id: crypto.randomUUID(),
                            idUsuario: userId,
                            idVeiculo: expenseData.vehicleId,
                            dataDespesa: new Date(expenseData.data),
                            tipoDespesa: expenseData.categoria, // Mapear categoria para tipoDespesa
                            valorDespesa: Math.round(expenseData.valor * 100), // Converter para centavos
                            descricao: expenseData.descricao,
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.despesas).values(newExpense).returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            throw new Error('Falha ao criar despesa');
                        }
                        return [2 /*return*/, this.mapToExpense(result[0])];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Erro ao criar despesa: ".concat(error_1 instanceof Error ? error_1.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca todas as despesas de um usuário
     */
    ExpenseService.getExpensesByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(this.mapToExpense)];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Erro ao buscar despesas: ".concat(error_2 instanceof Error ? error_2.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca uma despesa específica por ID
     */
    ExpenseService.getExpenseById = function (userId, expenseId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.id, expenseId), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.mapToExpense(result[0])];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Erro ao buscar despesa: ".concat(error_3 instanceof Error ? error_3.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Atualiza uma despesa
     */
    ExpenseService.updateExpense = function (userId, expenseId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updateFields, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateFields = {};
                        if (updateData.vehicleId !== undefined) {
                            updateFields.idVeiculo = updateData.vehicleId;
                        }
                        if (updateData.data !== undefined) {
                            updateFields.dataDespesa = new Date(updateData.data);
                        }
                        if (updateData.categoria !== undefined) {
                            updateFields.tipoDespesa = updateData.categoria;
                        }
                        if (updateData.valor !== undefined) {
                            updateFields.valorDespesa = Math.round(updateData.valor * 100);
                        }
                        if (updateData.descricao !== undefined) {
                            updateFields.descricao = updateData.descricao;
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.despesas)
                                .set(updateFields)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.id, expenseId), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.mapToExpense(result[0])];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("Erro ao atualizar despesa: ".concat(error_4 instanceof Error ? error_4.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove uma despesa (soft delete)
     */
    ExpenseService.deleteExpense = function (userId, expenseId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.despesas)
                                .set({ deletedAt: new Date() })
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.id, expenseId), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_5 = _a.sent();
                        throw new Error("Erro ao deletar despesa: ".concat(error_5 instanceof Error ? error_5.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtém estatísticas das despesas de um usuário
     */
    ExpenseService.getExpenseStats = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, total, count, average, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        total = result.reduce(function (sum, expense) { return sum + expense.valorDespesa; }, 0) / 100;
                        count = result.length;
                        average = count > 0 ? total / count : 0;
                        return [2 /*return*/, {
                                total: total,
                                count: count,
                                average: average,
                            }];
                    case 2:
                        error_6 = _a.sent();
                        throw new Error("Erro ao obter estat\u00EDsticas: ".concat(error_6 instanceof Error ? error_6.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca despesas por categoria
     */
    ExpenseService.getExpensesByCategory = function (userId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.despesas)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.tipoDespesa, category), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(this.mapToExpense)];
                    case 2:
                        error_7 = _a.sent();
                        throw new Error("Erro ao buscar despesas por categoria: ".concat(error_7 instanceof Error ? error_7.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mapeia dados do banco para o tipo Expense
     */
    ExpenseService.mapToExpense = function (dbExpense) {
        return {
            id: dbExpense.id,
            userId: dbExpense.idUsuario,
            vehicleId: dbExpense.idVeiculo,
            data: dbExpense.dataDespesa,
            valor: dbExpense.valorDespesa / 100, // Converter de centavos para reais
            descricao: dbExpense.descricao || '',
            categoria: dbExpense.tipoDespesa,
            createdAt: dbExpense.createdAt || dbExpense.dataDespesa,
            updatedAt: dbExpense.updatedAt || dbExpense.dataDespesa,
        };
    };
    return ExpenseService;
}());
exports.ExpenseService = ExpenseService;
