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
exports.initTables = initTables;
var index_1 = require("./index");
var drizzle_orm_1 = require("drizzle-orm");
function initTables() {
    return __awaiter(this, void 0, void 0, function () {
        var db, client, poolClient, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Inicializando tabelas (PostgreSQL)...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    db = (0, index_1.getDb)();
                    client = (0, index_1.getClient)();
                    if (!db) {
                        throw new Error('❌ Database instance (db) não está definido');
                    }
                    if (!client) {
                        throw new Error('❌ Client não está definido');
                    }
                    if (!client.connect) return [3 /*break*/, 4];
                    return [4 /*yield*/, client.connect()];
                case 2:
                    poolClient = _a.sent();
                    return [4 /*yield*/, poolClient.query('SELECT 1 as test')];
                case 3:
                    _a.sent();
                    poolClient.release();
                    console.log('✅ Conexão PostgreSQL ativa (pool)');
                    _a.label = 4;
                case 4: return [4 /*yield*/, db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT current_database() as db_name"], ["SELECT current_database() as db_name"]))))];
                case 5:
                    result = _a.sent();
                    console.log('✅ Conexão PostgreSQL ativa (drizzle)');
                    return [4 /*yield*/, db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""], ["CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""]))))];
                case 6:
                    _a.sent();
                    console.log('✅ Extensão uuid-ossp verificada');
                    console.log('📊 Use "pnpm run db:push" para criar/atualizar tabelas');
                    return [2 /*return*/, true];
                case 7:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao inicializar PostgreSQL:', error_1);
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
var templateObject_1, templateObject_2;
