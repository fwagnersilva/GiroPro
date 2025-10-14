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
// Carregar variáveis de ambiente de teste PRIMEIRO
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env.test' });
// Configurar variáveis de ambiente para testes ANTES de qualquer importação de DB
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
// Desabilitar cache e backup durante testes
process.env.CACHE_ENABLED = 'false';
process.env.BACKUP_ENABLED = 'false';
// Configurar rate limiting mais permissivo para testes
process.env.RATE_LIMIT_WINDOW_MS = '1000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
// AGORA importar as dependências do banco
var db_1 = require("../db");
// Configurar timeout global para testes
jest.setTimeout(30000);
// Mock do console para reduzir ruído nos testes
var originalConsole = console;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var initTables, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // NÃO silenciar logs durante setup para debug
                console.log("=== INICIANDO SETUP DE TESTES ===");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                console.log("Initializing tables for tests...");
                console.log("NODE_ENV:", process.env.NODE_ENV);
                console.log("SQLITE_DB_PATH:", process.env.SQLITE_DB_PATH);
                return [4 /*yield*/, Promise.resolve().then(function () { return require("../db"); })];
            case 2:
                initTables = (_a.sent()).initTables;
                return [4 /*yield*/, initTables()];
            case 3:
                _a.sent();
                console.log("Tables initialized successfully.");
                // Manter logs visíveis para debug
                // console.log = jest.fn();
                // console.info = jest.fn();
                // console.warn = jest.fn();
                console.error = originalConsole.error; // Manter erros visíveis
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Error in test setup:", error_1);
                throw error_1;
            case 5: return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Restaurar console original
        console.log = originalConsole.log;
        console.info = originalConsole.info;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        (0, db_1.closeConnection)();
        return [2 /*return*/];
    });
}); });
// Configurar timeout para operações assíncronas
// Limpar timers após cada teste
afterEach(function () {
    jest.clearAllTimers();
    jest.useRealTimers();
});
// Handler para promises rejeitadas não capturadas
process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handler para exceções não capturadas
process.on('uncaughtException', function (error) {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
