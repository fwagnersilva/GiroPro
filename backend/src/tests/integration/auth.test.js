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
var supertest_1 = require("supertest");
var app_1 = require("../../app");
var db_1 = require("../../db");
var drizzle_orm_1 = require("drizzle-orm");
describe('Authentication Integration Tests', function () {
    var testUser = {
        nome: "Teste Usuario ".concat(Date.now()),
        email: "teste".concat(Date.now(), "@exemplo.com"),
        senha: 'senha123',
        telefone: '11999999999'
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Limpar usuários de teste
                return [4 /*yield*/, db_1.db.delete(db_1.usuarios).where((0, drizzle_orm_1.eq)(db_1.usuarios.email, testUser.email))];
                case 1:
                    // Limpar usuários de teste
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Limpar usuários de teste
                return [4 /*yield*/, db_1.db.delete(db_1.usuarios).where((0, drizzle_orm_1.eq)(db_1.usuarios.email, testUser.email))];
                case 1:
                    // Limpar usuários de teste
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('POST /api/v1/auth/register', function () {
        it('deve registrar um novo usuário com sucesso', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)];
                    case 1:
                        response = _a.sent();
                        // Debug: mostrar resposta se não for 201
                        if (response.status !== 201) {
                            console.log('❌ Erro no registro:', response.status, response.body);
                        }
                        expect(response.status).toBe(201);
                        expect(response.body).toHaveProperty('token');
                        expect(response.body).toHaveProperty('user');
                        expect(response.body.user.email).toBe(testUser.email);
                        expect(response.body.user.nome).toBe(testUser.nome);
                        expect(response.body.user).not.toHaveProperty('senha');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro para email já cadastrado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Primeiro registro
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)
                            .expect(201)];
                    case 1:
                        // Primeiro registro
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/register')
                                .send(testUser)
                                .expect(400)];
                    case 2:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        expect(response.body.error).toContain('já cadastrado');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro para dados inválidos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidUser, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidUser = {
                            nome: "Invalid User ".concat(Date.now()),
                            email: "invalid".concat(Date.now(), "@example.com"),
                            senha: "invalid-password-".concat(Date.now()),
                            telefone: "invalid-phone-".concat(Date.now())
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/register')
                                .send(invalidUser)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve aplicar rate limiting para muitas tentativas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var promises, i, responses, rateLimitedResponses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        // Fazer 10 tentativas rapidamente
                        for (i = 0; i < 10; i++) {
                            promises.push((0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/register')
                                .send(__assign(__assign({}, testUser), { email: "teste".concat(i, "@exemplo.com") })));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        responses = _a.sent();
                        rateLimitedResponses = responses.filter(function (r) { return r.status === 429; });
                        expect(rateLimitedResponses.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/v1/auth/login', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Registrar usuário para testes de login
                    return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)];
                    case 1:
                        // Registrar usuário para testes de login
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve fazer login com credenciais válidas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/login')
                            .send({
                            email: testUser.email,
                            senha: testUser.senha
                        })
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('token');
                        expect(response.body).toHaveProperty('user');
                        expect(response.body.user.email).toBe(testUser.email);
                        expect(response.body.user).not.toHaveProperty('senha');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro para credenciais inválidas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/login')
                            .send({
                            email: testUser.email,
                            senha: 'senha-errada'
                        })
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        expect(response.body.error).toContain('inválidas');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro para usuário não encontrado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/login')
                            .send({
                            email: "naoexiste".concat(Date.now(), "@exemplo.com"),
                            senha: 'qualquersenha'
                        })
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve aplicar proteção contra força bruta', function () { return __awaiter(void 0, void 0, void 0, function () {
            var promises, i, responses, blockedResponses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        // Fazer 15 tentativas de login com senha errada
                        for (i = 0; i < 15; i++) {
                            promises.push((0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/login')
                                .send({
                                email: testUser.email,
                                senha: 'senha-errada'
                            }));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        responses = _a.sent();
                        blockedResponses = responses.slice(-5).filter(function (r) { return r.status === 429; });
                        expect(blockedResponses.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('GET /api/v1/auth/me', function () {
        var authToken;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)];
                    case 1:
                        registerResponse = _a.sent();
                        authToken = registerResponse.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar dados do usuário autenticado', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/auth/me')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('user');
                        expect(response.body.user.email).toBe(testUser.email);
                        expect(response.body.user).not.toHaveProperty('senha');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro sem token de autenticação', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/auth/me')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        expect(response.body.error).toContain('Token');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro com token inválido', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/auth/me')
                            .set('Authorization', 'Bearer token-invalido')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/v1/auth/logout', function () {
        var authToken;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)];
                    case 1:
                        registerResponse = _a.sent();
                        authToken = registerResponse.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve fazer logout com sucesso', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/logout')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('message');
                        expect(response.body.message).toContain('sucesso');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve retornar erro sem token de autenticação', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/logout')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Security Headers', function () {
        it('deve incluir headers de segurança nas respostas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/auth/me')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.headers).toHaveProperty('x-content-type-options');
                        expect(response.headers).toHaveProperty('x-frame-options');
                        expect(response.headers).toHaveProperty('x-xss-protection');
                        expect(response.headers['x-content-type-options']).toBe('nosniff');
                        expect(response.headers['x-frame-options']).toBe('DENY');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve detectar tentativas de SQL injection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousPayload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousPayload = {
                            email: "admin@test.com'; DROP TABLE usuarios; --",
                            senha: 'password'
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/login')
                                .send(maliciousPayload)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        expect(response.body.code).toBe('INVALID_REQUEST');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve detectar tentativas de XSS', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousPayload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousPayload = {
                            nome: '<script>alert("xss")</script>',
                            email: "test".concat(Date.now(), "@test.com"),
                            senha: 'password',
                            telefone: '11999999999'
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/auth/register')
                                .send(maliciousPayload)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        expect(response.body.code).toBe('DANGEROUS_CONTENT');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
