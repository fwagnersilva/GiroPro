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
exports.SyncDownloadController = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var SyncDownloadController = /** @class */ (function () {
    function SyncDownloadController() {
    }
    SyncDownloadController.downloadAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, userVeiculos, userJornadas, userAbastecimentos, userDespesas, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: 'Usuário não autenticado' })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.usuarios).where((0, drizzle_orm_1.eq)(schema_postgres_1.usuarios.id, userId)).limit(1)];
                    case 2:
                        user = (_b.sent())[0];
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId))];
                    case 3:
                        userVeiculos = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.jornadas).where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId))];
                    case 4:
                        userJornadas = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.abastecimentos).where((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId))];
                    case 5:
                        userAbastecimentos = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.despesas).where((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId))];
                    case 6:
                        userDespesas = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: {
                                    user: user,
                                    veiculos: userVeiculos,
                                    jornadas: userJornadas,
                                    abastecimentos: userAbastecimentos,
                                    despesas: userDespesas,
                                },
                            })];
                    case 7:
                        error_1 = _b.sent();
                        console.error('Erro ao baixar dados:', error_1);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Erro ao baixar dados' })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SyncDownloadController.downloadSince = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, lastSync, lastSyncDate, userVeiculos, userJornadas, userAbastecimentos, userDespesas, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        lastSync = req.query.lastSync;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: 'Usuário não autenticado' })];
                        }
                        if (!lastSync || typeof lastSync !== 'string') {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'lastSync é obrigatório' })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        lastSyncDate = new Date(lastSync);
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.veiculos).where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId))];
                    case 2:
                        userVeiculos = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.jornadas).where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId))];
                    case 3:
                        userJornadas = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.abastecimentos).where((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId))];
                    case 4:
                        userAbastecimentos = _b.sent();
                        return [4 /*yield*/, db_1.db.select().from(schema_postgres_1.despesas).where((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId))];
                    case 5:
                        userDespesas = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: {
                                    veiculos: userVeiculos,
                                    jornadas: userJornadas,
                                    abastecimentos: userAbastecimentos,
                                    despesas: userDespesas,
                                },
                            })];
                    case 6:
                        error_2 = _b.sent();
                        console.error('Erro ao baixar dados incrementais:', error_2);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Erro ao baixar dados' })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return SyncDownloadController;
}());
exports.SyncDownloadController = SyncDownloadController;
