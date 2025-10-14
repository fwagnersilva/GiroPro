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
exports.createDatabaseConnection = createDatabaseConnection;
exports.checkDatabaseConnection = checkDatabaseConnection;
var postgres_js_1 = require("drizzle-orm/postgres-js");
var postgres_1 = require("postgres");
var schema = require("./schema.postgres");
var better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
var better_sqlite3_2 = require("better-sqlite3");
function createDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var connectionString, sqlite, db_1, client, db;
        return __generator(this, function (_a) {
            connectionString = process.env.DATABASE_URL;
            if (!connectionString) {
                // Use SQLite for local development if DATABASE_URL is not set
                console.log('⚠️ DATABASE_URL não definida, usando SQLite para desenvolvimento local.');
                sqlite = new better_sqlite3_2.default('sqlite.db');
                db_1 = (0, better_sqlite3_1.drizzle)(sqlite, { schema: schema });
                return [2 /*return*/, { db: db_1, client: null }]; // client is not applicable for SQLite
            }
            client = (0, postgres_1.default)(connectionString, {
                max: 10,
                idle_timeout: 20,
                connect_timeout: 10,
            });
            db = (0, postgres_js_1.drizzle)(client, { schema: schema });
            return [2 /*return*/, { db: db, client: client }];
        });
    });
}
function checkDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var connectionString, sqlite, client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    connectionString = process.env.DATABASE_URL;
                    if (!connectionString) {
                        sqlite = new better_sqlite3_2.default('sqlite.db');
                        sqlite.close();
                        console.log('✅ Conexão SQLite verificada com sucesso');
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, createDatabaseConnection()];
                case 1:
                    client = (_a.sent()).client;
                    return [4 /*yield*/, client(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.end()];
                case 3:
                    _a.sent();
                    console.log('✅ Conexão PostgreSQL verificada com sucesso');
                    return [2 /*return*/, true];
                case 4:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao conectar ao banco de dados:', error_1);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var templateObject_1;
