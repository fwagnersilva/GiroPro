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
exports.AuthController = void 0;
var authService_1 = require("../services/authService");
var validation_1 = require("../utils/validation");
var customErrors_1 = require("../utils/customErrors");
var zod_1 = require("zod");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, senha, nome, dataNascimento, cidade, _b, token, user, refreshToken, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = validation_1.registerSchema.parse(req.body), email = _a.email, senha = _a.senha, nome = _a.nome, dataNascimento = _a.dataNascimento, cidade = _a.cidade;
                        return [4 /*yield*/, authService_1.AuthService.register({ email: email, senha: senha, nome: nome, dataNascimento: dataNascimento, cidade: cidade })];
                    case 1:
                        _b = _c.sent(), token = _b.token, user = _b.user, refreshToken = _b.refreshToken;
                        res.status(201).send({ success: true, message: 'Usuário registrado com sucesso', accessToken: token, user: __assign(__assign({}, user), { role: 'user' }), refreshToken: refreshToken });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _c.sent();
                        if (error_1 instanceof customErrors_1.ValidationError) {
                            console.error("Validation Error:", error_1);
                            res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
                        }
                        else if (error_1 instanceof customErrors_1.ConflictError) {
                            console.error("Conflict Error:", error_1);
                            res.status(409).send({ success: false, message: "Email já está em uso." });
                        }
                        else if (error_1 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_1);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro no registro:', error_1);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, senha, _b, accessToken, refreshToken, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = validation_1.loginSchema.parse(req.body), email = _a.email, senha = _a.senha;
                        return [4 /*yield*/, authService_1.AuthService.login({ email: email, senha: senha })];
                    case 1:
                        _b = _c.sent(), accessToken = _b.token, refreshToken = _b.refreshToken;
                        res.send({ success: true, message: 'Login bem-sucedido', accessToken: accessToken, refreshToken: refreshToken });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        if (error_2 instanceof customErrors_1.ValidationError) {
                            console.error("Validation Error:", error_2);
                            res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
                        }
                        else if (error_2 instanceof customErrors_1.UnauthorizedError) {
                            console.error("Unauthorized Error:", error_2);
                            res.status(401).send({ success: false, message: "Credenciais inválidas." });
                        }
                        else if (error_2 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_2);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro no login:', error_2);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.requestPasswordReset = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = validation_1.requestPasswordResetSchema.parse(req.body).email;
                        return [4 /*yield*/, authService_1.AuthService.requestPasswordReset(email)];
                    case 1:
                        _a.sent();
                        res.send({ success: true, message: 'Se o email estiver registrado, um link de redefinição de senha foi enviado.' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof customErrors_1.ValidationError) {
                            console.error("Validation Error:", error_3);
                            res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
                        }
                        else if (error_3 instanceof customErrors_1.NotFoundError) {
                            console.error("Not Found Error:", error_3);
                            res.status(404).send({ success: false, message: "Email não encontrado." });
                        }
                        else if (error_3 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_3);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro ao solicitar redefinição de senha:', error_3);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, token, newPassword, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = validation_1.resetPasswordSchema.parse(req.body), token = _a.token, newPassword = _a.newPassword;
                        return [4 /*yield*/, authService_1.AuthService.resetPassword(token, newPassword)];
                    case 1:
                        _b.sent();
                        res.send({ success: true, message: 'Senha redefinida com sucesso.' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        if (error_4 instanceof customErrors_1.ValidationError) {
                            console.error("Validation Error:", error_4);
                            res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
                        }
                        else if (error_4 instanceof customErrors_1.UnauthorizedError || error_4 instanceof customErrors_1.NotFoundError) {
                            console.error("Authentication/Not Found Error:", error_4);
                            res.status(401).send({ success: false, message: "Token inválido ou expirado." });
                        }
                        else if (error_4 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_4);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro ao redefinir senha:', error_4);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.refreshToken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, _a, accessToken, newRefreshToken, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        refreshToken = zod_1.z.object({ refreshToken: zod_1.z.string() }).parse(req.body).refreshToken;
                        return [4 /*yield*/, authService_1.AuthService.refreshToken(refreshToken)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.token, newRefreshToken = _a.refreshToken;
                        res.send({ success: true, message: 'Token atualizado com sucesso', accessToken: accessToken, refreshToken: newRefreshToken });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5 instanceof customErrors_1.UnauthorizedError) {
                            console.error("Unauthorized Error:", error_5);
                            res.status(401).send({ success: false, message: "Token de atualização inválido." });
                        }
                        else if (error_5 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_5);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro ao atualizar token:', error_5);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, currentPassword, newPassword, error_6;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        if (!userId) {
                            throw new customErrors_1.UnauthorizedError('Usuário não autenticado');
                        }
                        _a = validation_1.changePasswordSchema.parse(req.body), currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                        return [4 /*yield*/, authService_1.AuthService.changePassword(userId, currentPassword, newPassword)];
                    case 1:
                        _c.sent();
                        res.send({ success: true, message: 'Senha alterada com sucesso.' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _c.sent();
                        if (error_6 instanceof customErrors_1.ValidationError) {
                            console.error("Validation Error:", error_6);
                            res.status(400).send({ success: false, message: "Dados de entrada inválidos." });
                        }
                        else if (error_6 instanceof customErrors_1.UnauthorizedError) {
                            console.error("Unauthorized Error:", error_6);
                            res.status(401).send({ success: false, message: "Credenciais inválidas ou usuário não autorizado." });
                        }
                        else if (error_6 instanceof zod_1.z.ZodError) {
                            console.error("Zod Validation Error:", error_6);
                            res.status(400).send({ success: false, message: "Erro de validação dos dados." });
                        }
                        else {
                            console.error('Erro ao alterar senha:', error_6);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.me = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            throw new customErrors_1.UnauthorizedError('Usuário não autenticado');
                        }
                        return [4 /*yield*/, authService_1.AuthService.getUserById(userId)];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new customErrors_1.NotFoundError('Usuário não encontrado');
                        }
                        res.send({ success: true, user: user });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        if (error_7 instanceof customErrors_1.UnauthorizedError) {
                            console.error("Unauthorized Error:", error_7);
                            res.status(401).send({ success: false, message: "Usuário não autenticado." });
                        }
                        else if (error_7 instanceof customErrors_1.NotFoundError) {
                            console.error("Not Found Error:", error_7);
                            res.status(404).send({ success: false, message: "Usuário não encontrado." });
                        }
                        else {
                            console.error('Erro ao buscar dados do usuário:', error_7);
                            res.status(500).send({ success: false, message: 'Ocorreu um erro interno no servidor.' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
