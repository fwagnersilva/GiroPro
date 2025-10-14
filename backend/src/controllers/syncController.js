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
exports.getLastSyncTimestamp = exports.downloadIncrementalData = exports.downloadInitialData = exports.uploadOfflineData = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var logger_1 = require("../utils/logger");
// Upload de dados coletados offline
var uploadOfflineData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, _a, data_1, metadata, results, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId_1 = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId_1) {
                    return [2 /*return*/, res.status(401).json({ error: 'Usuário não autenticado' })];
                }
                _a = req.body, data_1 = _a.data, metadata = _a.metadata;
                if (!data_1 || !metadata) {
                    return [2 /*return*/, res.status(400).json({ error: 'Dados ou metadados ausentes' })];
                }
                return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var processedData, _i, _a, jornada, existing, existingItem, error_2, _b, _c, abastecimento, existing, existingItem, error_3, _d, _e, despesa, existing, existingItem, error_4, _f, _g, veiculo, existing, existingItem, error_5;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    processedData = {
                                        jornadas: 0,
                                        abastecimentos: 0,
                                        despesas: 0,
                                        veiculos: 0,
                                        conflicts: []
                                    };
                                    if (!(data_1.jornadas && data_1.jornadas.length > 0)) return [3 /*break*/, 11];
                                    _i = 0, _a = data_1.jornadas;
                                    _h.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                                    jornada = _a[_i];
                                    _h.label = 2;
                                case 2:
                                    _h.trys.push([2, 9, , 10]);
                                    return [4 /*yield*/, tx.select()
                                            .from(schema_postgres_1.jornadas)
                                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.id, jornada.id), (0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId_1)))
                                            .limit(1)];
                                case 3:
                                    existing = _h.sent();
                                    if (!(existing.length === 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, tx.insert(schema_postgres_1.jornadas).values(__assign(__assign({}, jornada), { idUsuario: userId_1, createdAt: new Date(jornada.createdAt || Date.now()), updatedAt: new Date() }))];
                                case 4:
                                    _h.sent();
                                    processedData.jornadas++;
                                    return [3 /*break*/, 8];
                                case 5:
                                    existingItem = existing[0];
                                    if (!(existingItem.updatedAt && new Date(jornada.updatedAt) < existingItem.updatedAt)) return [3 /*break*/, 6];
                                    processedData.conflicts.push({
                                        type: 'jornada',
                                        id: jornada.id,
                                        reason: 'server_newer'
                                    });
                                    return [3 /*break*/, 8];
                                case 6: 
                                // Atualizar com dados mais recentes
                                return [4 /*yield*/, tx.update(schema_postgres_1.jornadas)
                                        .set(__assign(__assign({}, jornada), { updatedAt: new Date() }))
                                        .where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.id, jornada.id))];
                                case 7:
                                    // Atualizar com dados mais recentes
                                    _h.sent();
                                    processedData.jornadas++;
                                    _h.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    error_2 = _h.sent();
                                    logger_1.default.error('Erro ao processar jornada:', error_2);
                                    processedData.conflicts.push({
                                        type: 'jornada',
                                        id: jornada.id,
                                        reason: 'processing_error'
                                    });
                                    return [3 /*break*/, 10];
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 11:
                                    if (!(data_1.abastecimentos && data_1.abastecimentos.length > 0)) return [3 /*break*/, 22];
                                    _b = 0, _c = data_1.abastecimentos;
                                    _h.label = 12;
                                case 12:
                                    if (!(_b < _c.length)) return [3 /*break*/, 22];
                                    abastecimento = _c[_b];
                                    _h.label = 13;
                                case 13:
                                    _h.trys.push([13, 20, , 21]);
                                    return [4 /*yield*/, tx.select()
                                            .from(schema_postgres_1.abastecimentos)
                                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.id, abastecimento.id), (0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId_1)))
                                            .limit(1)];
                                case 14:
                                    existing = _h.sent();
                                    if (!(existing.length === 0)) return [3 /*break*/, 16];
                                    return [4 /*yield*/, tx.insert(schema_postgres_1.abastecimentos).values(__assign(__assign({}, abastecimento), { idUsuario: userId_1, createdAt: new Date(abastecimento.createdAt || Date.now()), updatedAt: new Date() }))];
                                case 15:
                                    _h.sent();
                                    processedData.abastecimentos++;
                                    return [3 /*break*/, 19];
                                case 16:
                                    existingItem = existing[0];
                                    if (!(existingItem.updatedAt && new Date(abastecimento.updatedAt) < existingItem.updatedAt)) return [3 /*break*/, 17];
                                    processedData.conflicts.push({
                                        type: 'abastecimento',
                                        id: abastecimento.id,
                                        reason: 'server_newer'
                                    });
                                    return [3 /*break*/, 19];
                                case 17: return [4 /*yield*/, tx.update(schema_postgres_1.abastecimentos)
                                        .set(__assign(__assign({}, abastecimento), { updatedAt: new Date() }))
                                        .where((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.id, abastecimento.id))];
                                case 18:
                                    _h.sent();
                                    processedData.abastecimentos++;
                                    _h.label = 19;
                                case 19: return [3 /*break*/, 21];
                                case 20:
                                    error_3 = _h.sent();
                                    logger_1.default.error('Erro ao processar abastecimento:', error_3);
                                    processedData.conflicts.push({
                                        type: 'abastecimento',
                                        id: abastecimento.id,
                                        reason: 'processing_error'
                                    });
                                    return [3 /*break*/, 21];
                                case 21:
                                    _b++;
                                    return [3 /*break*/, 12];
                                case 22:
                                    if (!(data_1.despesas && data_1.despesas.length > 0)) return [3 /*break*/, 33];
                                    _d = 0, _e = data_1.despesas;
                                    _h.label = 23;
                                case 23:
                                    if (!(_d < _e.length)) return [3 /*break*/, 33];
                                    despesa = _e[_d];
                                    _h.label = 24;
                                case 24:
                                    _h.trys.push([24, 31, , 32]);
                                    return [4 /*yield*/, tx.select()
                                            .from(schema_postgres_1.despesas)
                                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.id, despesa.id), (0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId_1)))
                                            .limit(1)];
                                case 25:
                                    existing = _h.sent();
                                    if (!(existing.length === 0)) return [3 /*break*/, 27];
                                    return [4 /*yield*/, tx.insert(schema_postgres_1.despesas).values(__assign(__assign({}, despesa), { idUsuario: userId_1, createdAt: new Date(despesa.createdAt || Date.now()), updatedAt: new Date() }))];
                                case 26:
                                    _h.sent();
                                    processedData.despesas++;
                                    return [3 /*break*/, 30];
                                case 27:
                                    existingItem = existing[0];
                                    if (!(existingItem.updatedAt && new Date(despesa.updatedAt) < existingItem.updatedAt)) return [3 /*break*/, 28];
                                    processedData.conflicts.push({
                                        type: 'despesa',
                                        id: despesa.id,
                                        reason: 'server_newer'
                                    });
                                    return [3 /*break*/, 30];
                                case 28: return [4 /*yield*/, tx.update(schema_postgres_1.despesas)
                                        .set(__assign(__assign({}, despesa), { updatedAt: new Date() }))
                                        .where((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.id, despesa.id))];
                                case 29:
                                    _h.sent();
                                    processedData.despesas++;
                                    _h.label = 30;
                                case 30: return [3 /*break*/, 32];
                                case 31:
                                    error_4 = _h.sent();
                                    logger_1.default.error('Erro ao processar despesa:', error_4);
                                    processedData.conflicts.push({
                                        type: 'despesa',
                                        id: despesa.id,
                                        reason: 'processing_error'
                                    });
                                    return [3 /*break*/, 32];
                                case 32:
                                    _d++;
                                    return [3 /*break*/, 23];
                                case 33:
                                    if (!(data_1.veiculos && data_1.veiculos.length > 0)) return [3 /*break*/, 44];
                                    _f = 0, _g = data_1.veiculos;
                                    _h.label = 34;
                                case 34:
                                    if (!(_f < _g.length)) return [3 /*break*/, 44];
                                    veiculo = _g[_f];
                                    _h.label = 35;
                                case 35:
                                    _h.trys.push([35, 42, , 43]);
                                    return [4 /*yield*/, tx.select()
                                            .from(schema_postgres_1.veiculos)
                                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, veiculo.id), (0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId_1)))
                                            .limit(1)];
                                case 36:
                                    existing = _h.sent();
                                    if (!(existing.length === 0)) return [3 /*break*/, 38];
                                    return [4 /*yield*/, tx.insert(schema_postgres_1.veiculos).values(__assign(__assign({}, veiculo), { idUsuario: userId_1, createdAt: new Date(veiculo.createdAt || Date.now()), updatedAt: new Date() }))];
                                case 37:
                                    _h.sent();
                                    processedData.veiculos++;
                                    return [3 /*break*/, 41];
                                case 38:
                                    existingItem = existing[0];
                                    if (!(existingItem.updatedAt && new Date(veiculo.updatedAt) < existingItem.updatedAt)) return [3 /*break*/, 39];
                                    processedData.conflicts.push({
                                        type: 'veiculo',
                                        id: veiculo.id,
                                        reason: 'server_newer'
                                    });
                                    return [3 /*break*/, 41];
                                case 39: return [4 /*yield*/, tx.update(schema_postgres_1.veiculos)
                                        .set(__assign(__assign({}, veiculo), { updatedAt: new Date() }))
                                        .where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.id, veiculo.id))];
                                case 40:
                                    _h.sent();
                                    processedData.veiculos++;
                                    _h.label = 41;
                                case 41: return [3 /*break*/, 43];
                                case 42:
                                    error_5 = _h.sent();
                                    logger_1.default.error('Erro ao processar veículo:', error_5);
                                    processedData.conflicts.push({
                                        type: 'veiculo',
                                        id: veiculo.id,
                                        reason: 'processing_error'
                                    });
                                    return [3 /*break*/, 43];
                                case 43:
                                    _f++;
                                    return [3 /*break*/, 34];
                                case 44: return [2 /*return*/, processedData];
                            }
                        });
                    }); })];
            case 1:
                results = _c.sent();
                logger_1.default.info("Sincroniza\u00E7\u00E3o offline processada para usu\u00E1rio ".concat(userId_1, ":"), results);
                return [2 /*return*/, res.json({
                        success: true,
                        message: 'Dados sincronizados com sucesso',
                        processed: results,
                        timestamp: Date.now()
                    })];
            case 2:
                error_1 = _c.sent();
                logger_1.default.error('Erro no upload de dados offline:', error_1);
                return [2 /*return*/, res.status(500).json({
                        error: 'Erro interno do servidor',
                        message: 'Falha ao processar dados offline'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.uploadOfflineData = uploadOfflineData;
// Download de dados para sincronização inicial
var downloadInitialData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, userVeiculos, userJornadas, userAbastecimentos, userDespesas, syncData, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'Usuário não autenticado' })];
                }
                return [4 /*yield*/, Promise.all([
                        db_1.db.select()
                            .from(schema_postgres_1.veiculos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.veiculos.deletedAt))),
                        db_1.db.select()
                            .from(schema_postgres_1.jornadas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.jornadas.deletedAt))),
                        db_1.db.select()
                            .from(schema_postgres_1.abastecimentos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.abastecimentos.deletedAt))),
                        db_1.db.select()
                            .from(schema_postgres_1.despesas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.despesas.deletedAt)))
                    ])];
            case 1:
                _a = _c.sent(), userVeiculos = _a[0], userJornadas = _a[1], userAbastecimentos = _a[2], userDespesas = _a[3];
                syncData = {
                    veiculos: userVeiculos,
                    jornadas: userJornadas,
                    abastecimentos: userAbastecimentos,
                    despesas: userDespesas,
                    metadata: {
                        syncType: 'initial',
                        timestamp: Date.now(),
                        totalRecords: userVeiculos.length + userJornadas.length + userAbastecimentos.length + userDespesas.length
                    }
                };
                logger_1.default.info("Sincroniza\u00E7\u00E3o inicial para usu\u00E1rio ".concat(userId, ": ").concat(syncData.metadata.totalRecords, " registros"));
                return [2 /*return*/, res.json({
                        success: true,
                        data: syncData
                    })];
            case 2:
                error_6 = _c.sent();
                logger_1.default.error('Erro no download de dados iniciais:', error_6);
                return [2 /*return*/, res.status(500).json({
                        error: 'Erro interno do servidor',
                        message: 'Falha ao buscar dados para sincronização inicial'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.downloadInitialData = downloadInitialData;
// Download de dados para sincronização incremental
var downloadIncrementalData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, lastSync, lastSyncDate, _a, updatedVeiculos, updatedJornadas, updatedAbastecimentos, updatedDespesas, syncData, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'Usuário não autenticado' })];
                }
                lastSync = req.query.lastSync;
                if (!lastSync) {
                    return [2 /*return*/, res.status(400).json({ error: 'Timestamp da última sincronização é obrigatório' })];
                }
                lastSyncDate = new Date(Number(lastSync));
                return [4 /*yield*/, Promise.all([
                        db_1.db.select()
                            .from(schema_postgres_1.veiculos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId), (0, drizzle_orm_1.gt)(schema_postgres_1.veiculos.updatedAt, lastSyncDate))),
                        db_1.db.select()
                            .from(schema_postgres_1.jornadas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId), (0, drizzle_orm_1.gt)(schema_postgres_1.jornadas.updatedAt, lastSyncDate))),
                        db_1.db.select()
                            .from(schema_postgres_1.abastecimentos)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId), (0, drizzle_orm_1.gt)(schema_postgres_1.abastecimentos.updatedAt, lastSyncDate))),
                        db_1.db.select()
                            .from(schema_postgres_1.despesas)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId), (0, drizzle_orm_1.gt)(schema_postgres_1.despesas.updatedAt, lastSyncDate)))
                    ])];
            case 1:
                _a = _c.sent(), updatedVeiculos = _a[0], updatedJornadas = _a[1], updatedAbastecimentos = _a[2], updatedDespesas = _a[3];
                syncData = {
                    veiculos: updatedVeiculos,
                    jornadas: updatedJornadas,
                    abastecimentos: updatedAbastecimentos,
                    despesas: updatedDespesas,
                    metadata: {
                        syncType: 'incremental',
                        lastSync: lastSyncDate.toISOString(),
                        timestamp: Date.now(),
                        totalRecords: updatedVeiculos.length + updatedJornadas.length + updatedAbastecimentos.length + updatedDespesas.length
                    }
                };
                logger_1.default.info("Sincroniza\u00E7\u00E3o incremental para usu\u00E1rio ".concat(userId, ": ").concat(syncData.metadata.totalRecords, " registros atualizados"));
                return [2 /*return*/, res.json({
                        success: true,
                        data: syncData
                    })];
            case 2:
                error_7 = _c.sent();
                logger_1.default.error('Erro no download de dados incrementais:', error_7);
                return [2 /*return*/, res.status(500).json({
                        error: 'Erro interno do servidor',
                        message: 'Falha ao buscar dados para sincronização incremental'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.downloadIncrementalData = downloadIncrementalData;
// Obter timestamp da última sincronização
var getLastSyncTimestamp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, latestVeiculo, latestJornada, latestAbastecimento, latestDespesa, timestamps, lastSyncTimestamp, error_8;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'Usuário não autenticado' })];
                }
                return [4 /*yield*/, Promise.all([
                        db_1.db.select({ updatedAt: schema_postgres_1.veiculos.updatedAt })
                            .from(schema_postgres_1.veiculos)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.veiculos.idUsuario, userId))
                            .orderBy(schema_postgres_1.veiculos.updatedAt)
                            .limit(1),
                        db_1.db.select({ updatedAt: schema_postgres_1.jornadas.updatedAt })
                            .from(schema_postgres_1.jornadas)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.jornadas.idUsuario, userId))
                            .orderBy(schema_postgres_1.jornadas.updatedAt)
                            .limit(1),
                        db_1.db.select({ updatedAt: schema_postgres_1.abastecimentos.updatedAt })
                            .from(schema_postgres_1.abastecimentos)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.abastecimentos.idUsuario, userId))
                            .orderBy(schema_postgres_1.abastecimentos.updatedAt)
                            .limit(1),
                        db_1.db.select({ updatedAt: schema_postgres_1.despesas.updatedAt })
                            .from(schema_postgres_1.despesas)
                            .where((0, drizzle_orm_1.eq)(schema_postgres_1.despesas.idUsuario, userId))
                            .orderBy(schema_postgres_1.despesas.updatedAt)
                            .limit(1)
                    ])];
            case 1:
                _a = _g.sent(), latestVeiculo = _a[0], latestJornada = _a[1], latestAbastecimento = _a[2], latestDespesa = _a[3];
                timestamps = [
                    (_c = latestVeiculo[0]) === null || _c === void 0 ? void 0 : _c.updatedAt,
                    (_d = latestJornada[0]) === null || _d === void 0 ? void 0 : _d.updatedAt,
                    (_e = latestAbastecimento[0]) === null || _e === void 0 ? void 0 : _e.updatedAt,
                    (_f = latestDespesa[0]) === null || _f === void 0 ? void 0 : _f.updatedAt
                ].filter(Boolean);
                lastSyncTimestamp = timestamps.length > 0
                    ? Math.max.apply(Math, timestamps.map(function (t) { return new Date(t).getTime(); })) : Date.now();
                return [2 /*return*/, res.json({
                        success: true,
                        lastSyncTimestamp: lastSyncTimestamp,
                        lastSyncDate: new Date(lastSyncTimestamp).toISOString()
                    })];
            case 2:
                error_8 = _g.sent();
                logger_1.default.error('Erro ao obter timestamp da última sincronização:', error_8);
                return [2 /*return*/, res.status(500).json({
                        error: 'Erro interno do servidor',
                        message: 'Falha ao obter timestamp da última sincronização'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getLastSyncTimestamp = getLastSyncTimestamp;
