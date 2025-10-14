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
var db_2 = require("../../db");
var drizzle_orm_1 = require("drizzle-orm");
describe('User Journey E2E Tests', function () {
    var testUser = {
        nome: 'João Motorista',
        email: process.env.TEST_USER_EMAIL,
        senha: process.env.TEST_USER_PASSWORD,
        telefone: '11987654321'
    };
    var testVehicle = {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2019,
        placa: 'XYZ9876',
        combustivel: 'flex',
        capacidadeTanque: 47
    };
    var authToken;
    var userId;
    var vehicleId;
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userId) return [3 /*break*/, 6];
                    return [4 /*yield*/, db_1.db.delete(db_2.despesas).where((0, drizzle_orm_1.eq)(db_2.despesas.idUsuario, userId))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(db_2.abastecimentos).where((0, drizzle_orm_1.eq)(db_2.abastecimentos.idUsuario, userId))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(db_2.jornadas).where((0, drizzle_orm_1.eq)(db_2.jornadas.idUsuario, userId))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(db_2.veiculos).where((0, drizzle_orm_1.eq)(db_2.veiculos.idUsuario, userId))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(db_2.usuarios).where((0, drizzle_orm_1.eq)(db_2.usuarios.id, userId))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); });
    describe('Jornada Completa do Usuário', function () {
        it('1. Deve registrar um novo usuário', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/register')
                            .send(testUser)
                            .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('token');
                        expect(response.body).toHaveProperty('user');
                        expect(response.body.user.email).toBe(testUser.email);
                        expect(response.body.user.nome).toBe(testUser.nome);
                        authToken = response.body.token;
                        userId = response.body.user.id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('2. Deve fazer login com as credenciais criadas', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        expect(response.body.user.email).toBe(testUser.email);
                        // Atualizar token para garantir que está válido
                        authToken = response.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it('3. Deve acessar o perfil do usuário', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/auth/me')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.user.id).toBe(userId);
                        expect(response.body.user.email).toBe(testUser.email);
                        return [2 /*return*/];
                }
            });
        }); });
        it('4. Deve cadastrar um veículo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/veiculos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(testVehicle)
                            .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('id');
                        expect(response.body.marca).toBe(testVehicle.marca);
                        expect(response.body.modelo).toBe(testVehicle.modelo);
                        expect(response.body.placa).toBe(testVehicle.placa);
                        vehicleId = response.body.id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('5. Deve listar os veículos do usuário', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/veiculos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(Array.isArray(response.body)).toBe(true);
                        expect(response.body.length).toBe(1);
                        expect(response.body[0].id).toBe(vehicleId);
                        return [2 /*return*/];
                }
            });
        }); });
        it('6. Deve registrar um abastecimento', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fuelingData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fuelingData = {
                            veiculoId: vehicleId,
                            data: new Date().toISOString(),
                            quantidadeLitros: 35,
                            valorTotal: 210.00,
                            valorLitro: 6.00,
                            posto: 'Shell Centro',
                            kmAtual: 15000,
                            tanqueCheio: true
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/abastecimentos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(fuelingData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('id');
                        expect(response.body.quantidadeLitros).toBe(fuelingData.quantidadeLitros);
                        expect(response.body.valorTotal).toBe(fuelingData.valorTotal);
                        expect(response.body.posto).toBe(fuelingData.posto);
                        return [2 /*return*/];
                }
            });
        }); });
        it('7. Deve registrar uma jornada de trabalho', function () { return __awaiter(void 0, void 0, void 0, function () {
            var journeyData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        journeyData = {
                            veiculoId: vehicleId,
                            dataInicio: new Date().toISOString(),
                            dataFim: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas depois
                            kmInicial: 15000,
                            kmFinal: 15200,
                            ganhoBruto: 280.50,
                            plataforma: 'uber',
                            observacoes: 'Dia de trabalho normal'
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/jornadas')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(journeyData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('id');
                        expect(response.body.ganhoBruto).toBe(journeyData.ganhoBruto);
                        expect(response.body.plataforma).toBe(journeyData.plataforma);
                        expect(response.body.km_inicio).toBe(journeyData.kmInicial);
                        expect(response.body.km_fim).toBe(journeyData.kmFinal);
                        return [2 /*return*/];
                }
            });
        }); });
        it('8. Deve registrar uma despesa', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expenseData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expenseData = {
                            veiculoId: vehicleId,
                            data: new Date().toISOString(),
                            categoria: 'manutencao',
                            descricao: 'Troca de óleo e filtros',
                            valorDespesa: 120.00,
                            observacoes: 'Manutenção preventiva aos 15.000 km'
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/despesas')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(expenseData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('id');
                        expect(response.body.categoria).toBe(expenseData.categoria);
                        expect(response.body.descricao).toBe(expenseData.descricao);
                        expect(response.body.valorDespesa).toBe(expenseData.valorDespesa);
                        return [2 /*return*/];
                }
            });
        }); });
        it('9. Deve acessar o dashboard com dados calculados', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/dashboard/summary')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('receita');
                        expect(response.body).toHaveProperty('despesas');
                        expect(response.body).toHaveProperty('lucro');
                        expect(response.body).toHaveProperty('kmRodados');
                        // Verificar se os valores fazem sentido
                        expect(response.body.receita).toBeGreaterThan(0);
                        expect(response.body.despesas).toBeGreaterThan(0);
                        expect(response.body.kmRodados).toBeGreaterThan(0);
                        expect(response.body.lucro).toBe(response.body.receita - response.body.despesas);
                        return [2 /*return*/];
                }
            });
        }); });
        it('10. Deve acessar dados de evolução temporal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/dashboard/evolution')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('dados');
                        expect(Array.isArray(response.body.dados)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('11. Deve acessar comparativo de veículos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/dashboard/veiculos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('veiculos');
                        expect(Array.isArray(response.body.veiculos)).toBe(true);
                        expect(response.body.veiculos.length).toBe(1);
                        expect(response.body.veiculos[0].id).toBe(vehicleId);
                        return [2 /*return*/];
                }
            });
        }); });
        it('12. Deve listar histórico de abastecimentos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/abastecimentos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(Array.isArray(response.body)).toBe(true);
                        expect(response.body.length).toBe(1);
                        expect(response.body[0].posto).toBe('Shell Centro');
                        return [2 /*return*/];
                }
            });
        }); });
        it('13. Deve listar histórico de jornadas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/jornadas')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(Array.isArray(response.body)).toBe(true);
                        expect(response.body.length).toBe(1);
                        expect(response.body[0].plataforma).toBe('uber');
                        return [2 /*return*/];
                }
            });
        }); });
        it('14. Deve listar histórico de despesas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/despesas')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(Array.isArray(response.body)).toBe(true);
                        expect(response.body.length).toBe(1);
                        expect(response.body[0].categoria).toBe('manutencao');
                        return [2 /*return*/];
                }
            });
        }); });
        it('15. Deve acessar preços de combustível', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/fuel-prices')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('precos');
                        return [2 /*return*/];
                }
            });
        }); });
        it('16. Deve fazer logout com sucesso', function () { return __awaiter(void 0, void 0, void 0, function () {
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
        it('17. Não deve acessar recursos protegidos após logout', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/dashboard/summary')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Fluxo de Erro e Recuperação', function () {
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/login')
                            .send({
                            email: testUser.email,
                            senha: testUser.senha
                        })];
                    case 1:
                        loginResponse = _a.sent();
                        authToken = loginResponse.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve validar dados obrigatórios ao criar veículo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidVehicle, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidVehicle = {
                            marca: '',
                            modelo: '',
                            ano: 'invalid',
                            placa: '',
                            combustivel: 'invalid'
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/veiculos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidVehicle)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve validar dados obrigatórios ao criar abastecimento', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidFueling, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidFueling = {
                            veiculoId: 'invalid-id',
                            quantidadeLitros: -10,
                            valorTotal: -100,
                            valorLitro: 0
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/abastecimentos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidFueling)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve validar dados obrigatórios ao criar jornada', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidJourney, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidJourney = {
                            veiculoId: 'invalid-id',
                            kmInicial: 'invalid',
                            kmFinal: 'invalid',
                            valorGanho: -100
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/jornadas')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidJourney)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve validar dados obrigatórios ao criar despesa', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidExpense, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidExpense = {
                            veiculoId: 'invalid-id',
                            categoria: 'invalid-category',
                            valor: -50
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                                .post('/api/v1/despesas')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidExpense)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Performance e Segurança', function () {
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .post('/api/v1/auth/login')
                            .send({
                            email: testUser.email,
                            senha: testUser.senha
                        })];
                    case 1:
                        loginResponse = _a.sent();
                        authToken = loginResponse.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve aplicar rate limiting em endpoints sensíveis', function () { return __awaiter(void 0, void 0, void 0, function () {
            var promises, i, responses, rateLimitedResponses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        // Fazer muitas tentativas de criação de veículo
                        for (i = 0; i < 20; i++) {
                            promises.push((0, supertest_1.default)(app_1.default)
                                .post('/api/v1/veiculos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testVehicle), { placa: "TEST".concat(i.toString().padStart(3, '0')) })));
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
        it('deve incluir headers de segurança em todas as respostas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                            .get('/api/v1/dashboard/summary')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.headers).toHaveProperty('x-content-type-options');
                        expect(response.headers).toHaveProperty('x-frame-options');
                        expect(response.headers).toHaveProperty('x-xss-protection');
                        return [2 /*return*/];
                }
            });
        }); });
        it('deve responder rapidamente mesmo com múltiplas requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var startTime, promises, i, responses, duration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        promises = [];
                        for (i = 0; i < 5; i++) {
                            promises.push((0, supertest_1.default)(app_1.default)
                                .get('/api/v1/dashboard/summary')
                                .set('Authorization', "Bearer ".concat(authToken)));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        responses = _a.sent();
                        duration = Date.now() - startTime;
                        // Todas as respostas devem ser bem-sucedidas
                        responses.forEach(function (response) {
                            expect(response.status).toBe(200);
                        });
                        // Deve responder em menos de 5 segundos para 5 requests
                        expect(duration).toBeLessThan(5000);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
