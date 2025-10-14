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
exports.PlatformService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("crypto");
var PlatformService = /** @class */ (function () {
    function PlatformService() {
    }
    /**
     * Inicializa as plataformas padrão (Uber e 99) para um novo usuário
     */
    PlatformService.initializeDefaultPlatforms = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultPlatforms, _i, defaultPlatforms_1, platformName, existing, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        defaultPlatforms = ['Uber', '99'];
                        _i = 0, defaultPlatforms_1 = defaultPlatforms;
                        _a.label = 1;
                    case 1:
                        if (!(_i < defaultPlatforms_1.length)) return [3 /*break*/, 5];
                        platformName = defaultPlatforms_1[_i];
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.plataformas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.nome, platformName), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt)))];
                    case 2:
                        existing = _a.sent();
                        if (!(existing.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.plataformas).values({
                                id: crypto_1.default.randomUUID(),
                                idUsuario: userId,
                                nome: platformName,
                                isPadrao: true,
                                ativa: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                deletedAt: null,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Erro ao inicializar plataformas padrão:", error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.createPlatform = function (userId, platformData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPlatform, newPlatform, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.plataformas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.nome, platformData.nome), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt)))];
                    case 1:
                        existingPlatform = _a.sent();
                        if (existingPlatform.length > 0) {
                            throw new Error("Já existe uma plataforma com este nome para este usuário.");
                        }
                        newPlatform = {
                            id: crypto_1.default.randomUUID(),
                            idUsuario: userId,
                            nome: platformData.nome,
                            isPadrao: platformData.isPadrao || false,
                            ativa: platformData.ativa !== undefined ? platformData.ativa : true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null,
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.plataformas).values(newPlatform).returning()];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, this.mapToPlatform(result)];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Erro ao criar plataforma:", error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.getPlatformsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.plataformas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(this.mapToPlatform)];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Erro ao buscar plataformas:", error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.getPlatformById = function (userId, platformId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.plataformas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.id, platformId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt)))];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result ? this.mapToPlatform(result) : null];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Erro ao buscar plataforma por ID:", error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.updatePlatform = function (userId, platformId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPlatform, dataToUpdate, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getPlatformById(userId, platformId)];
                    case 1:
                        existingPlatform = _a.sent();
                        if (!existingPlatform) {
                            throw new Error("Plataforma não encontrada ou não pertence ao usuário.");
                        }
                        // Não permitir alterar nome de plataforma padrão
                        if (existingPlatform.isPadrao && updateData.nome && updateData.nome !== existingPlatform.nome) {
                            throw new Error("Não é permitido alterar o nome de plataformas padrão.");
                        }
                        dataToUpdate = {
                            updatedAt: new Date(),
                        };
                        if (updateData.nome !== undefined)
                            dataToUpdate.nome = updateData.nome;
                        if (updateData.ativa !== undefined)
                            dataToUpdate.ativa = updateData.ativa;
                        return [4 /*yield*/, db_1.db.update(schema_postgres_1.plataformas).set(dataToUpdate).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.id, platformId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt))).returning()];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result ? this.mapToPlatform(result) : null];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Erro ao atualizar plataforma:", error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.deletePlatform = function (userId, platformId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPlatform, references, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getPlatformById(userId, platformId)];
                    case 1:
                        existingPlatform = _a.sent();
                        if (!existingPlatform) {
                            throw new Error("Plataforma não encontrada ou não pertence ao usuário.");
                        }
                        // Não permitir deletar plataformas padrão
                        if (existingPlatform.isPadrao) {
                            throw new Error("Não é permitido deletar plataformas padrão. Apenas desativá-las.");
                        }
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.jornadasFaturamentoPorPlataforma).where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadasFaturamentoPorPlataforma.idPlataforma, platformId))];
                    case 2:
                        references = _a.sent();
                        if (references.length > 0) {
                            throw new Error("Não é possível excluir esta plataforma pois existem jornadas associadas a ela. Você pode desativá-la.");
                        }
                        return [4 /*yield*/, db_1.db.update(schema_postgres_1.plataformas).set({
                                deletedAt: new Date(),
                                updatedAt: new Date(),
                            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.id, platformId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt))).returning()];
                    case 3:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result !== undefined];
                    case 4:
                        error_6 = _a.sent();
                        console.error("Erro ao deletar plataforma:", error_6);
                        throw error_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retorna apenas as plataformas ativas do usuário
     */
    PlatformService.getActivePlatforms = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.plataformas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.idUsuario, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.plataformas.ativa, true), (0, drizzle_orm_1.isNull)(schema_postgres_1.plataformas.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(this.mapToPlatform)];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Erro ao buscar plataformas ativas:", error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformService.mapToPlatform = function (dbPlatform) {
        return {
            id: dbPlatform.id,
            idUsuario: dbPlatform.idUsuario,
            nome: dbPlatform.nome,
            isPadrao: Boolean(dbPlatform.isPadrao), // Converter para boolean
            ativa: Boolean(dbPlatform.ativa), // Converter para boolean
            createdAt: new Date(dbPlatform.createdAt),
            updatedAt: new Date(dbPlatform.updatedAt),
            deletedAt: dbPlatform.deletedAt ? new Date(dbPlatform.deletedAt) : null,
        };
    };
    return PlatformService;
}());
exports.PlatformService = PlatformService;
