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
exports.AuthService = void 0;
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, senhaHash, newUser, token, refreshToken, PlatformService, error_1, EmailService, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({ id: schema_postgres_1.usuarios.id })
                            .from(schema_postgres_1.usuarios)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.email, data.email.toLowerCase()))
                            .limit(1)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser.length > 0) {
                            throw new Error("Email já está em uso");
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(data.senha, this.SALT_ROUNDS)];
                    case 2:
                        senhaHash = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .insert(schema_postgres_1.usuarios)
                                .values({
                                nome: data.nome,
                                email: data.email.toLowerCase(),
                                senhaHash: senhaHash,
                                statusConta: "ativo",
                                dataCadastro: new Date(),
                                ultimaAtividade: new Date(),
                            })
                                .returning({
                                id: schema_postgres_1.usuarios.id,
                                nome: schema_postgres_1.usuarios.nome,
                                email: schema_postgres_1.usuarios.email,
                                statusConta: schema_postgres_1.usuarios.statusConta,
                                role: schema_postgres_1.usuarios.role,
                            })];
                    case 3:
                        newUser = (_a.sent())[0];
                        token = this.generateToken(newUser.id, newUser.email, newUser.nome, newUser.role);
                        refreshToken = this.generateRefreshToken(newUser.id);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./platformService'); })];
                    case 5:
                        PlatformService = (_a.sent()).PlatformService;
                        return [4 /*yield*/, PlatformService.initializeDefaultPlatforms(newUser.id)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Erro ao inicializar plataformas padrão:', error_1);
                        return [3 /*break*/, 8];
                    case 8:
                        _a.trys.push([8, 11, , 12]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./emailService'); })];
                    case 9:
                        EmailService = (_a.sent()).EmailService;
                        return [4 /*yield*/, EmailService.sendWelcomeEmail(newUser.email, newUser.nome)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        error_2 = _a.sent();
                        console.error('Erro ao enviar email de boas-vindas:', error_2);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/, {
                            token: token,
                            refreshToken: refreshToken,
                            user: {
                                id: newUser.id,
                                nome: newUser.nome,
                                email: newUser.email,
                                statusConta: newUser.statusConta,
                                role: newUser.role,
                            },
                        }];
                }
            });
        });
    };
    AuthService.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, senhaValida, token, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_postgres_1.usuarios.id,
                            nome: schema_postgres_1.usuarios.nome,
                            email: schema_postgres_1.usuarios.email,
                            senhaHash: schema_postgres_1.usuarios.senhaHash,
                            role: schema_postgres_1.usuarios.role,
                            statusConta: schema_postgres_1.usuarios.statusConta,
                            tentativasLogin: schema_postgres_1.usuarios.tentativasLogin,
                            ultimoLoginFalhado: schema_postgres_1.usuarios.ultimoLoginFalhado,
                            ultimaAtividade: schema_postgres_1.usuarios.ultimaAtividade,
                        })
                            .from(schema_postgres_1.usuarios)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.email, data.email.toLowerCase().trim()))
                            .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        if (!user) {
                            throw new Error("Credenciais inválidas");
                        }
                        return [4 /*yield*/, this.isAccountLocked(user)];
                    case 2:
                        // Verificar se a conta está bloqueada
                        if (_a.sent()) {
                            throw new Error("Conta temporariamente bloqueada devido a muitas tentativas de login. Tente novamente em 15 minutos.");
                        }
                        // Verificar se a conta está ativa
                        if (user.statusConta !== "ativo") {
                            throw new Error("Conta inativa ou suspensa");
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(data.senha, user.senhaHash)];
                    case 3:
                        senhaValida = _a.sent();
                        if (!!senhaValida) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.incrementLoginAttempts(user.id)];
                    case 4:
                        _a.sent();
                        throw new Error("Credenciais inválidas");
                    case 5: 
                    // Reset das tentativas de login
                    return [4 /*yield*/, this.resetLoginAttempts(user.id)];
                    case 6:
                        // Reset das tentativas de login
                        _a.sent();
                        // Atualizar última atividade
                        return [4 /*yield*/, this.updateLastActivity(user.id)];
                    case 7:
                        // Atualizar última atividade
                        _a.sent();
                        token = this.generateToken(user.id, user.email, user.nome, user.role);
                        refreshToken = this.generateRefreshToken(user.id);
                        return [2 /*return*/, {
                                token: token,
                                refreshToken: refreshToken,
                                user: {
                                    id: user.id,
                                    nome: user.nome,
                                    email: user.email,
                                    statusConta: user.statusConta,
                                    role: user.role,
                                },
                            }];
                }
            });
        });
    };
    AuthService.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, user, newToken, newRefreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                        return [4 /*yield*/, this.getUserById(decoded.userId)];
                    case 1:
                        user = _a.sent();
                        if (user.statusConta !== 'ativo') {
                            throw new Error('Usuário inativo');
                        }
                        newToken = this.generateToken(user.id, user.email, user.nome, user.role);
                        newRefreshToken = this.generateRefreshToken(user.id);
                        return [2 /*return*/, {
                                token: newToken,
                                refreshToken: newRefreshToken,
                            }];
                }
            });
        });
    };
    AuthService.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_postgres_1.usuarios.id,
                            nome: schema_postgres_1.usuarios.nome,
                            email: schema_postgres_1.usuarios.email,
                            role: schema_postgres_1.usuarios.role,
                            statusConta: schema_postgres_1.usuarios.statusConta,
                            dataNascimento: schema_postgres_1.usuarios.dataNascimento,
                            cidade: schema_postgres_1.usuarios.cidade,
                            dataCadastro: schema_postgres_1.usuarios.dataCadastro,
                            ultimaAtividade: schema_postgres_1.usuarios.ultimaAtividade,
                        })
                            .from(schema_postgres_1.usuarios)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))
                            .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        if (!user) {
                            throw new Error("Usuário não encontrado");
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.changePassword = function (userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, senhaValida, novaSenhaHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({ senhaHash: schema_postgres_1.usuarios.senhaHash })
                            .from(schema_postgres_1.usuarios)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))
                            .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        if (!user) {
                            throw new Error("Usuário não encontrado");
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, user.senhaHash)];
                    case 2:
                        senhaValida = _a.sent();
                        if (!senhaValida) {
                            throw new Error("Senha atual inválida");
                        }
                        this.validatePassword(newPassword);
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, this.SALT_ROUNDS)];
                    case 3:
                        novaSenhaHash = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.usuarios)
                                .set({
                                senhaHash: novaSenhaHash,
                                ultimaAtividade: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.deactivateAccount = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.usuarios)
                            .set({
                            statusConta: 'inativo',
                            ultimaAtividade: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.requestPasswordReset = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken, EmailService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.usuarios).where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.email, email)).limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        if (!user) {
                            return [2 /*return*/];
                        }
                        resetToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./emailService'); })];
                    case 2:
                        EmailService = (_a.sent()).EmailService;
                        return [4 /*yield*/, EmailService.sendPasswordResetEmail(email, resetToken, user.nome)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, userId, novaSenhaHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                        userId = decoded.userId;
                        this.validatePassword(newPassword);
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, this.SALT_ROUNDS)];
                    case 1:
                        novaSenhaHash = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.usuarios)
                                .set({
                                senhaHash: novaSenhaHash,
                                ultimaAtividade: new Date(),
                            })
                                .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.generateToken = function (userId, email, nome, role) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não configurado');
        }
        return jsonwebtoken_1.default.sign({
            userId: userId,
            email: email,
            nome: nome,
            role: role,
            type: 'access',
            iat: Math.floor(Date.now() / 1000),
        }, process.env.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    };
    AuthService.generateRefreshToken = function (userId) {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET não configurado');
        }
        return jsonwebtoken_1.default.sign({
            userId: userId,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
    };
    AuthService.verifyToken = function (token) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não configurado");
        }
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== "access") {
            throw new Error("Tipo de token inválido");
        }
        return { userId: decoded.userId, email: decoded.email, nome: decoded.nome, role: decoded.role };
    };
    AuthService.isAccountLocked = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var lockoutTime;
            return __generator(this, function (_a) {
                if (user.tentativasLogin < this.MAX_LOGIN_ATTEMPTS) {
                    return [2 /*return*/, false];
                }
                if (!user.ultimoLoginFalhado) {
                    return [2 /*return*/, false];
                }
                lockoutTime = new Date(user.ultimoLoginFalhado);
                lockoutTime.setMinutes(lockoutTime.getMinutes() + this.LOCKOUT_TIME);
                return [2 /*return*/, new Date() < lockoutTime];
            });
        });
    };
    AuthService.incrementLoginAttempts = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.usuarios)
                            .set({
                            tentativasLogin: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " + 1"], ["", " + 1"])), schema_postgres_1.usuarios.tentativasLogin),
                            ultimoLoginFalhado: new Date(),
                        })
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.resetLoginAttempts = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.usuarios)
                            .set({
                            tentativasLogin: 0,
                            ultimoLoginFalhado: null,
                        })
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.updateLastActivity = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.usuarios)
                            .set({ ultimaAtividade: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.validatePassword = function (password) {
        if (!password || password.length < 8) {
            throw new Error('Senha deve ter pelo menos 8 caracteres');
        }
        if (!/(?=.*[a-z])/.test(password)) {
            throw new Error('Senha deve conter pelo menos uma letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            throw new Error('Senha deve conter pelo menos uma letra maiúscula');
        }
        if (!/(?=.*\d)/.test(password)) {
            throw new Error('Senha deve conter pelo menos um número');
        }
    };
    AuthService.SALT_ROUNDS = 12;
    AuthService.JWT_EXPIRES_IN = '7d';
    AuthService.REFRESH_TOKEN_EXPIRES_IN = '30d';
    AuthService.MAX_LOGIN_ATTEMPTS = 5;
    AuthService.LOCKOUT_TIME = 15; // minutos
    return AuthService;
}());
exports.AuthService = AuthService;
var templateObject_1;
