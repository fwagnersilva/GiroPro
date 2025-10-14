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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
var zod_1 = require("zod");
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
// Enums para tipos de veículos e combustíveis
var TipoUso;
(function (TipoUso) {
    TipoUso["PROPRIO"] = "proprio";
    TipoUso["ALUGADO"] = "alugado";
    TipoUso["FINANCIADO"] = "financiado";
})(TipoUso || (TipoUso = {}));
var TipoCombustivel;
(function (TipoCombustivel) {
    TipoCombustivel["GASOLINA"] = "gasolina";
    TipoCombustivel["ETANOL"] = "etanol";
    TipoCombustivel["DIESEL"] = "diesel";
    TipoCombustivel["GNV"] = "gnv";
    TipoCombustivel["FLEX"] = "flex";
})(TipoCombustivel || (TipoCombustivel = {}));
// Schemas de validação
var createVehicleSchema = zod_1.z.object({
    marca: zod_1.z
        .string()
        .min(1, "Marca é obrigatória")
        .max(50, "Marca deve ter no máximo 50 caracteres")
        .trim(),
    modelo: zod_1.z
        .string()
        .min(1, "Modelo é obrigatório")
        .max(50, "Modelo deve ter no máximo 50 caracteres")
        .trim(),
    ano: zod_1.z
        .number()
        .int("Ano deve ser um número inteiro")
        .min(1900, "Ano deve ser maior que 1900")
        .max(new Date().getFullYear() + 1, "Ano não pode ser superior ao próximo ano"),
    placa: zod_1.z
        .string()
        .min(7, "Placa deve ter pelo menos 7 caracteres")
        .max(8, "Placa deve ter no máximo 8 caracteres")
        .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Formato de placa inválido (ex: ABC1234 ou ABC1D23)"),
    cor: zod_1.z.string().max(30, "Cor deve ter no máximo 30 caracteres").trim().optional(),
    tipoUso: zod_1.z.nativeEnum(TipoUso),
    tipoCombustivel: zod_1.z.nativeEnum(TipoCombustivel),
    mediaConsumo: zod_1.z
        .number()
        .positive("Consumo médio deve ser positivo")
        .max(50, "Consumo médio deve ser realista (máximo 50 km/l)")
        .optional(),
    valorAluguel: zod_1.z.number().positive("Valor do aluguel deve ser positivo").optional(),
    valorPrestacao: zod_1.z.number().positive("Valor da prestação deve ser positivo").optional(),
    kmAtual: zod_1.z
        .number()
        .min(0, "Quilometragem atual não pode ser negativa")
        .max(9999999, "Quilometragem atual muito alta")
        .optional(),
    observacoes: zod_1.z.string().max(500, "Observações devem ter no máximo 500 caracteres").trim().optional(),
});
var updateVehicleSchema = createVehicleSchema.partial();
var queryParamsSchema = zod_1.z.object({
    tipoUso: zod_1.z.nativeEnum(TipoUso).optional(),
    tipoCombustivel: zod_1.z.nativeEnum(TipoCombustivel).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(50),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
var VehiclesController = /** @class */ (function () {
    function VehiclesController() {
    }
    /**
     * Valida se o usuário está autenticado
     */
    VehiclesController.validateAuth = function (req) {
        var _a;
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    };
    /**
     * Retorna resposta de erro padronizada
     */
    VehiclesController.errorResponse = function (res, status, message, details) {
        return res.status(status).json({
            success: false,
            error: { message: message, details: details },
        });
    };
    /**
     * Retorna resposta de sucesso padronizada
     */
    VehiclesController.successResponse = function (res, data, message, status) {
        if (status === void 0) { status = 200; }
        var response = __assign(__assign({ success: true }, (data !== undefined && { data: data })), (message && { message: message }));
        return res.status(status).json(response);
    };
    /**
     * Busca e valida se o veículo pertence ao usuário
     */
    VehiclesController.findAndValidateVehicle = function (vehicleId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var vehicles, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, vehicleId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt) // Apenas veículos não deletados
                            ))];
                    case 1:
                        vehicles = _a.sent();
                        if (vehicles.length === 0) {
                            return [2 /*return*/, { vehicle: null, error: "Veículo não encontrado" }];
                        }
                        if (vehicles[0].idUsuario !== userId) {
                            return [2 /*return*/, { vehicle: null, error: "Acesso negado" }];
                        }
                        return [2 /*return*/, { vehicle: vehicles[0], error: null }];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, { vehicle: null, error: "Erro ao buscar veículo" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Listar todos os veículos do usuário
     */
    VehiclesController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, queryValidation, _a, tipoUso, tipoCombustivel, limit, offset, whereConditions, _b, userVehicles, totalCountResult, totalCount, responseData, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        queryValidation = queryParamsSchema.safeParse(req.query);
                        if (!queryValidation.success) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "Parâmetros de consulta inválidos", queryValidation.error.errors)];
                        }
                        _a = queryValidation.data, tipoUso = _a.tipoUso, tipoCombustivel = _a.tipoCombustivel, limit = _a.limit, offset = _a.offset;
                        whereConditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt) // Apenas veículos ativos (não deletados)
                        );
                        if (tipoUso) {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.tipoUso, tipoUso));
                        }
                        if (tipoCombustivel) {
                            whereConditions = (0, drizzle_orm_1.and)(whereConditions, (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.tipoCombustivel, tipoCombustivel));
                        }
                        return [4 /*yield*/, Promise.all([
                                db_1.db
                                    .select()
                                    .from(schema_postgres_1.veiculos)
                                    .where(whereConditions)
                                    .limit(limit)
                                    .offset(offset)
                                    .orderBy(schema_postgres_1.veiculos.dataCadastro),
                                db_1.db
                                    .select({ count: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)"], ["count(*)"]))) })
                                    .from(schema_postgres_1.veiculos)
                                    .where(whereConditions),
                            ])];
                    case 1:
                        _b = _c.sent(), userVehicles = _b[0], totalCountResult = _b[1];
                        totalCount = totalCountResult[0].count;
                        responseData = {
                            vehicles: userVehicles,
                            pagination: {
                                total: totalCount,
                                limit: limit,
                                offset: offset,
                                has_more: totalCount > offset + limit,
                            },
                            filters: {
                                tipoUso: tipoUso || null,
                                tipoCombustivel: tipoCombustivel || null,
                            },
                        };
                        return [2 /*return*/, VehiclesController.successResponse(res, responseData)];
                    case 2:
                        error_2 = _c.sent();
                        console.error("Erro ao buscar veículos:", error_2);
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Criar novo veículo
     */
    VehiclesController.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validation, existingVehicle, vehicleData, newVehicles, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        validation = createVehicleSchema.safeParse(req.body);
                        if (!validation.success) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "Dados inválidos", validation.error.errors)];
                        }
                        if (!validation.data.placa) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db
                                .select({ id: schema_postgres_1.veiculos.id })
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.placa, validation.data.placa), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))];
                    case 1:
                        existingVehicle = _a.sent();
                        if (existingVehicle.length > 0) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 409, "Já existe um veículo cadastrado com esta placa")];
                        }
                        ;
                        _a.label = 2;
                    case 2:
                        ;
                        vehicleData = __assign(__assign(__assign(__assign(__assign(__assign({ idUsuario: userId, marca: validation.data.marca, modelo: validation.data.modelo, ano: validation.data.ano, placa: validation.data.placa || "TEMP".concat(Date.now()), tipoCombustivel: validation.data.tipoCombustivel, tipoUso: validation.data.tipoUso, dataCadastro: new Date(), updatedAt: new Date() }, (validation.data.cor && { cor: validation.data.cor })), (validation.data.mediaConsumo && { mediaConsumo: validation.data.mediaConsumo })), (validation.data.valorAluguel && { valorAluguel: validation.data.valorAluguel })), (validation.data.valorPrestacao && { valorPrestacao: validation.data.valorPrestacao })), (validation.data.kmAtual && { kmAtual: validation.data.kmAtual })), (validation.data.observacoes && { observacoes: validation.data.observacoes }));
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.veiculos).values(vehicleData).returning()];
                    case 3:
                        newVehicles = _a.sent();
                        return [2 /*return*/, VehiclesController.successResponse(res, newVehicles[0], "Veículo criado com sucesso", 201)];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Erro ao criar veículo:", error_3);
                        // Tratar erros específicos do banco de dados
                        if (error_3.code === "23505") { // Unique constraint violation
                            return [2 /*return*/, VehiclesController.errorResponse(res, 409, "Já existe um veículo com estes dados")];
                        }
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Buscar veículo por ID
     */
    VehiclesController.getById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, _a, vehicle, error, status_1, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório")];
                        }
                        return [4 /*yield*/, VehiclesController.findAndValidateVehicle(id, userId)];
                    case 1:
                        _a = _b.sent(), vehicle = _a.vehicle, error = _a.error;
                        if (error) {
                            status_1 = error === "Veículo não encontrado" ? 404 : 403;
                            return [2 /*return*/, VehiclesController.errorResponse(res, status_1, error)];
                        }
                        return [2 /*return*/, VehiclesController.successResponse(res, vehicle)];
                    case 2:
                        error_4 = _b.sent();
                        console.error("Erro ao buscar veículo:", error_4);
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Atualizar veículo
     */
    VehiclesController.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, validation, _a, vehicle, error, status_2, existingVehicle, updateData, updatedVehicles, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório")];
                        }
                        validation = updateVehicleSchema.safeParse(req.body);
                        if (!validation.success) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "Dados inválidos", validation.error.errors)];
                        }
                        return [4 /*yield*/, VehiclesController.findAndValidateVehicle(id, userId)];
                    case 1:
                        _a = _b.sent(), vehicle = _a.vehicle, error = _a.error;
                        if (error) {
                            status_2 = error === "Veículo não encontrado" ? 404 : 403;
                            return [2 /*return*/, VehiclesController.errorResponse(res, status_2, error)];
                        }
                        if (!(validation.data.placa && validation.data.placa !== vehicle.placa)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db
                                .select({ id: schema_postgres_1.veiculos.id })
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.placa, validation.data.placa), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt)))];
                    case 2:
                        existingVehicle = _b.sent();
                        if (existingVehicle.length > 0) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 409, "Já existe um veículo cadastrado com esta placa")];
                        }
                        _b.label = 3;
                    case 3:
                        updateData = __assign(__assign({}, validation.data), { updatedAt: new Date() });
                        return [4 /*yield*/, db_1.db.update(schema_postgres_1.veiculos).set(updateData).where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, id)).returning()];
                    case 4:
                        updatedVehicles = _b.sent();
                        return [2 /*return*/, VehiclesController.successResponse(res, updatedVehicles[0], "Veículo atualizado com sucesso")];
                    case 5:
                        error_5 = _b.sent();
                        console.error("Erro ao atualizar veículo:", error_5);
                        if (error_5.code === "23505") { // Unique constraint violation
                            return [2 /*return*/, VehiclesController.errorResponse(res, 409, "Já existe um veículo com estes dados")];
                        }
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Excluir veículo (soft delete)
     */
    VehiclesController.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, _a, vehicle, error, status_3, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório")];
                        }
                        return [4 /*yield*/, VehiclesController.findAndValidateVehicle(id, userId)];
                    case 1:
                        _a = _b.sent(), vehicle = _a.vehicle, error = _a.error;
                        if (error) {
                            status_3 = error === "Veículo não encontrado" ? 404 : 403;
                            return [2 /*return*/, VehiclesController.errorResponse(res, status_3, error)];
                        }
                        // Soft delete
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.veiculos)
                                .set({
                                deletedAt: new Date(),
                                updatedAt: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, id))];
                    case 2:
                        // Soft delete
                        _b.sent();
                        return [2 /*return*/, VehiclesController.successResponse(res, undefined, "Veículo excluído com sucesso", 204)];
                    case 3:
                        error_6 = _b.sent();
                        console.error("Erro ao excluir veículo:", error_6);
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reativar veículo (reverter soft delete)
     */
    VehiclesController.activate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, vehicles, vehicleToActivate, updatedVehicles, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório")];
                        }
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.veiculos)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, id), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId) // Apenas veículos do usuário
                            ))];
                    case 1:
                        vehicles = _a.sent();
                        if (vehicles.length === 0) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 404, "Veículo não encontrado ou não pertence ao usuário")];
                        }
                        vehicleToActivate = vehicles[0];
                        if (vehicleToActivate.deletedAt === null) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "Veículo já está ativo")];
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.veiculos)
                                .set({
                                deletedAt: null, // Remove o soft delete
                                updatedAt: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, id))
                                .returning()];
                    case 2:
                        updatedVehicles = _a.sent();
                        return [2 /*return*/, VehiclesController.successResponse(res, updatedVehicles[0], "Veículo reativado com sucesso")];
                    case 3:
                        error_7 = _a.sent();
                        console.error("Erro ao reativar veículo:", error_7);
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Desativar veículo (soft delete)
     */
    VehiclesController.deactivate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, _a, vehicle, error, status_4, updatedVehicles, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = VehiclesController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 401, "Usuário não autenticado")];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório")];
                        }
                        return [4 /*yield*/, VehiclesController.findAndValidateVehicle(id, userId)];
                    case 1:
                        _a = _b.sent(), vehicle = _a.vehicle, error = _a.error;
                        if (error) {
                            status_4 = error === "Veículo não encontrado" ? 404 : 403;
                            return [2 /*return*/, VehiclesController.errorResponse(res, status_4, error)];
                        }
                        if (vehicle.deletedAt !== null) {
                            return [2 /*return*/, VehiclesController.errorResponse(res, 400, "Veículo já está inativo")];
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.veiculos)
                                .set({
                                deletedAt: new Date(),
                                updatedAt: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, id))
                                .returning()];
                    case 2:
                        updatedVehicles = _b.sent();
                        return [2 /*return*/, VehiclesController.successResponse(res, updatedVehicles[0], "Veículo desativado com sucesso")];
                    case 3:
                        error_8 = _b.sent();
                        console.error("Erro ao desativar veículo:", error_8);
                        return [2 /*return*/, VehiclesController.errorResponse(res, 500, "Erro interno do servidor")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return VehiclesController;
}());
exports.VehiclesController = VehiclesController;
var templateObject_1;
