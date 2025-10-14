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
exports.PlatformController = void 0;
var platformService_1 = require("../services/platformService");
var zod_1 = require("zod");
// Schemas de validação para plataformas
var createPlatformSchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome da plataforma é obrigatório").max(100, "Nome da plataforma deve ter no máximo 100 caracteres"),
    isPadrao: zod_1.z.boolean().optional(),
    ativa: zod_1.z.boolean().optional(),
});
var updatePlatformSchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome da plataforma é obrigatório").max(100, "Nome da plataforma deve ter no máximo 100 caracteres").optional(),
    ativa: zod_1.z.boolean().optional(),
});
var PlatformController = /** @class */ (function () {
    function PlatformController() {
    }
    PlatformController.createPlatform = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validatedData, newPlatform, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        validatedData = createPlatformSchema.parse(req.body);
                        return [4 /*yield*/, platformService_1.PlatformService.createPlatform(userId, validatedData)];
                    case 1:
                        newPlatform = _b.sent();
                        return [2 /*return*/, res.status(201).send({ success: true, message: 'Plataforma criada com sucesso.', platform: newPlatform })];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).send({ success: false, message: 'Dados de entrada inválidos.', errors: error_1.errors })];
                        }
                        console.error('Erro ao criar plataforma:', error_1);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_1.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformController.getPlatforms = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, platforms, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        return [4 /*yield*/, platformService_1.PlatformService.getPlatformsByUserId(userId)];
                    case 1:
                        platforms = _b.sent();
                        return [2 /*return*/, res.status(200).send({ success: true, platforms: platforms })];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Erro ao buscar plataformas:', error_2);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_2.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformController.getActivePlatforms = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, platforms, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        return [4 /*yield*/, platformService_1.PlatformService.getActivePlatforms(userId)];
                    case 1:
                        platforms = _b.sent();
                        return [2 /*return*/, res.status(200).send({ success: true, platforms: platforms })];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Erro ao buscar plataformas ativas:', error_3);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_3.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformController.getPlatformById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, platform, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        id = req.params.id;
                        return [4 /*yield*/, platformService_1.PlatformService.getPlatformById(userId, id)];
                    case 1:
                        platform = _b.sent();
                        if (!platform) {
                            return [2 /*return*/, res.status(404).send({ success: false, message: 'Plataforma não encontrada.' })];
                        }
                        return [2 /*return*/, res.status(200).send({ success: true, platform: platform })];
                    case 2:
                        error_4 = _b.sent();
                        console.error('Erro ao buscar plataforma por ID:', error_4);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_4.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformController.updatePlatform = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, updateData, updatedPlatform, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        id = req.params.id;
                        updateData = updatePlatformSchema.parse(req.body);
                        return [4 /*yield*/, platformService_1.PlatformService.updatePlatform(userId, id, updateData)];
                    case 1:
                        updatedPlatform = _b.sent();
                        if (!updatedPlatform) {
                            return [2 /*return*/, res.status(404).send({ success: false, message: 'Plataforma não encontrada ou não pertence ao usuário.' })];
                        }
                        return [2 /*return*/, res.status(200).send({ success: true, message: 'Plataforma atualizada com sucesso.', platform: updatedPlatform })];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).send({ success: false, message: 'Dados de entrada inválidos.', errors: error_5.errors })];
                        }
                        console.error('Erro ao atualizar plataforma:', error_5);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_5.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlatformController.deletePlatform = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, deleted, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).send({ success: false, message: 'Usuário não autenticado.' })];
                        }
                        id = req.params.id;
                        return [4 /*yield*/, platformService_1.PlatformService.deletePlatform(userId, id)];
                    case 1:
                        deleted = _b.sent();
                        if (!deleted) {
                            return [2 /*return*/, res.status(404).send({ success: false, message: 'Plataforma não encontrada ou não pertence ao usuário.' })];
                        }
                        return [2 /*return*/, res.status(200).send({ success: true, message: 'Plataforma excluída com sucesso.' })];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Erro ao deletar plataforma:', error_6);
                        return [2 /*return*/, res.status(500).send({ success: false, message: error_6.message || 'Ocorreu um erro interno no servidor.' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PlatformController;
}());
exports.PlatformController = PlatformController;
