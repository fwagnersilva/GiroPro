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
var config_1 = require("./config");
var app_1 = require("./app");
var logger_1 = require("./utils/logger");
var db_1 = require("./db");
var PORT = Number(config_1.config.port);
// Função assíncrona para inicializar servidor
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server_1, shutdown_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Primeiro inicializa o banco de dados
                    console.log('🔄 Inicializando conexão com o banco de dados...');
                    return [4 /*yield*/, (0, db_1.initializeDatabase)()];
                case 1:
                    _a.sent();
                    // Em seguida, inicializa as tabelas
                    // console.log('🔄 Inicializando tabelas do banco de dados...');
                    return [4 /*yield*/, (0, db_1.initTables)()];
                case 2:
                    // Em seguida, inicializa as tabelas
                    // console.log('🔄 Inicializando tabelas do banco de dados...');
                    _a.sent();
                    server_1 = app_1.default.listen(PORT, '0.0.0.0', function () {
                        logger_1.default.info("\uD83D\uDE80 Servidor GiroPro rodando na porta ".concat(PORT));
                        logger_1.default.info("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/health"));
                        logger_1.default.info("\uD83C\uDF10 Acess\u00EDvel externamente em: http://0.0.0.0:".concat(PORT));
                    });
                    shutdown_1 = function (signal) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            logger_1.default.info("\uD83D\uDED1 ".concat(signal, " recebido, encerrando servidor..."));
                            server_1.close(function () { return __awaiter(_this, void 0, void 0, function () {
                                var client, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            logger_1.default.info('✅ Servidor HTTP encerrado');
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 5, , 6]);
                                            client = (0, db_1.getClient)();
                                            if (!(client && typeof client.end === 'function')) return [3 /*break*/, 3];
                                            return [4 /*yield*/, client.end()];
                                        case 2:
                                            _a.sent();
                                            logger_1.default.info('✅ Conexão com banco encerrada');
                                            return [3 /*break*/, 4];
                                        case 3:
                                            logger_1.default.info('✅ Nenhuma conexão de banco de dados para encerrar (SQLite ou cliente não disponível).');
                                            _a.label = 4;
                                        case 4:
                                            process.exit(0);
                                            return [3 /*break*/, 6];
                                        case 5:
                                            error_2 = _a.sent();
                                            logger_1.default.error('❌ Erro ao encerrar conexão:', error_2);
                                            process.exit(1);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); });
                            // Força encerramento após 10 segundos
                            setTimeout(function () {
                                logger_1.default.error('⏰ Tempo limite excedido, forçando encerramento...');
                                process.exit(1);
                            }, 10000);
                            return [2 /*return*/];
                        });
                    }); };
                    process.on('SIGTERM', function () { return shutdown_1('SIGTERM'); });
                    process.on('SIGINT', function () { return shutdown_1('SIGINT'); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.default.error('❌ Erro ao iniciar servidor:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Iniciar servidor
startServer();
