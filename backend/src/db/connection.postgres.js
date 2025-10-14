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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.db = void 0;
exports.closeConnection = closeConnection;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var schema = require("./schema.postgres");
// Verificar se DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL não está definida nas variáveis de ambiente');
}
console.log('🔌 Configurando conexão PostgreSQL...');
// Criar pool de conexão com SSL
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
exports.pool = pool;
// Criar instância do drizzle
var db = (0, node_postgres_1.drizzle)(pool, { schema: schema });
exports.db = db;
// Log de eventos do pool
pool.on('connect', function () {
    console.log('✅ Nova conexão ao PostgreSQL estabelecida');
});
pool.on('error', function (err) {
    console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
});
var maskedUrl = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/\/.*:.*@/, '//***:***@');
console.log("\uD83D\uDD17 Pool PostgreSQL configurado: ".concat(maskedUrl));
// Função para fechar conexão
function closeConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, pool.end()];
                case 1:
                    _a.sent();
                    console.log('✅ Pool PostgreSQL encerrado');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao fechar pool PostgreSQL:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Exportar usando CommonJS
module.exports = {
    db: db,
    pool: pool,
    closeConnection: closeConnection
};
