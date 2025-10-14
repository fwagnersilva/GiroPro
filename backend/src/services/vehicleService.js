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
exports.VehicleService = void 0;
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var VehicleService = /** @class */ (function () {
    function VehicleService() {
    }
    /**
     * Cria um novo veículo
     */
    VehicleService.createVehicle = function (userId, vehicleData) {
        return __awaiter(this, void 0, void 0, function () {
            var newVehicle, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newVehicle = {
                            id: crypto.randomUUID(),
                            idUsuario: userId,
                            marca: vehicleData.marca,
                            modelo: vehicleData.modelo,
                            ano: vehicleData.ano,
                            placa: vehicleData.placa,
                            tipoCombustivel: vehicleData.tipoCombustivel.toLowerCase(),
                            tipoUso: vehicleData.tipo_uso.toLowerCase(),
                            dataCadastro: new Date(),
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.veiculos).values(newVehicle).returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            throw new Error('Falha ao criar veículo');
                        }
                        return [2 /*return*/, this.mapToVehicle(result[0])];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Erro ao criar ve\u00EDculo: ".concat(error_1 instanceof Error ? error_1.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca todos os veículos de um usuário
     */
    VehicleService.getVehiclesByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(this.mapToVehicle)];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Erro ao buscar ve\u00EDculos: ".concat(error_2 instanceof Error ? error_2.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca um veículo específico por ID
     */
    VehicleService.getVehicleById = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.mapToVehicle(result[0])];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Erro ao buscar ve\u00EDculo: ".concat(error_3 instanceof Error ? error_3.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Atualiza um veículo
     */
    VehicleService.updateVehicle = function (userId, vehicleId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updateFields, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateFields = {};
                        if (updateData.marca !== undefined) {
                            updateFields.marca = updateData.marca;
                        }
                        if (updateData.modelo !== undefined) {
                            updateFields.modelo = updateData.modelo;
                        }
                        if (updateData.ano !== undefined) {
                            updateFields.ano = updateData.ano;
                        }
                        if (updateData.placa !== undefined) {
                            updateFields.placa = updateData.placa;
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.veiculos)
                                .set(updateFields)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.mapToVehicle(result[0])];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("Erro ao atualizar ve\u00EDculo: ".concat(error_4 instanceof Error ? error_4.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove um veículo (soft delete)
     */
    VehicleService.deleteVehicle = function (userId, vehicleId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.veiculos)
                                .set({ deletedAt: new Date() })
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_5 = _a.sent();
                        throw new Error("Erro ao deletar ve\u00EDculo: ".concat(error_5 instanceof Error ? error_5.message : 'Erro desconhecido'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mapeia dados do banco para o tipo Vehicle
     */
    VehicleService.mapToVehicle = function (dbVehicle) {
        return {
            id: dbVehicle.id,
            idUsuario: dbVehicle.idUsuario,
            marca: dbVehicle.marca,
            modelo: dbVehicle.modelo,
            ano: dbVehicle.ano,
            placa: dbVehicle.placa,
            tipoCombustivel: dbVehicle.tipoCombustivel,
            tipo_uso: dbVehicle.tipo_uso,
            valor_aluguel: dbVehicle.valor_aluguel,
            valor_prestacao: dbVehicle.valor_prestacao,
            media_consumo: dbVehicle.media_consumo,
            data_cadastro: dbVehicle.data_cadastro,
            deletedAt: dbVehicle.deletedAt,
        };
    };
    return VehicleService;
}());
exports.VehicleService = VehicleService;
