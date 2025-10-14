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
exports.backupService = void 0;
var child_process_1 = require("child_process");
var util_1 = require("util");
var fs = require("fs/promises");
var path = require("path");
var logger_1 = require("../utils/logger");
var cacheService_1 = require("./cacheService");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var BackupService = /** @class */ (function () {
    function BackupService() {
        this.isRunning = false;
        this.config = {
            enabled: process.env.BACKUP_ENABLED === 'true',
            schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // 2:00 AM diariamente
            retention: {
                daily: parseInt(process.env.BACKUP_RETENTION_DAILY || '7'),
                weekly: parseInt(process.env.BACKUP_RETENTION_WEEKLY || '4'),
                monthly: parseInt(process.env.BACKUP_RETENTION_MONTHLY || '12')
            },
            storage: {
                local: {
                    enabled: true,
                    path: process.env.BACKUP_LOCAL_PATH || './backups'
                },
                s3: process.env.BACKUP_S3_ENABLED === 'true' ? {
                    enabled: true,
                    bucket: process.env.BACKUP_S3_BUCKET || '',
                    region: process.env.BACKUP_S3_REGION || 'us-east-1',
                    accessKeyId: process.env.BACKUP_S3_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.BACKUP_S3_SECRET_ACCESS_KEY || ''
                } : undefined
            },
            compression: process.env.BACKUP_COMPRESSION !== 'false',
            encryption: process.env.BACKUP_ENCRYPTION === 'true'
        };
    }
    // Executar backup completo
    BackupService.prototype.performBackup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, timestamp, filename, filepath, finalFilepath, stats, fileSize, duration, error_1, duration;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isRunning) {
                            throw new Error('Backup já está em execução');
                        }
                        this.isRunning = true;
                        startTime = Date.now();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 17, 19, 20]);
                        logger_1.default.info('Iniciando backup automático');
                        // Criar diretório de backup se não existir
                        return [4 /*yield*/, this.ensureBackupDirectory()];
                    case 2:
                        // Criar diretório de backup se não existir
                        _b.sent();
                        timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        filename = "giropro-backup-".concat(timestamp, ".sql");
                        filepath = path.join(this.config.storage.local.path, filename);
                        // Executar backup do banco de dados
                        return [4 /*yield*/, this.backupDatabase(filepath)];
                    case 3:
                        // Executar backup do banco de dados
                        _b.sent();
                        finalFilepath = filepath;
                        if (!this.config.compression) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.compressBackup(filepath)];
                    case 4:
                        finalFilepath = _b.sent();
                        return [4 /*yield*/, fs.unlink(filepath)];
                    case 5:
                        _b.sent(); // Remover arquivo não comprimido
                        _b.label = 6;
                    case 6:
                        if (!this.config.encryption) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.encryptBackup(finalFilepath)];
                    case 7:
                        finalFilepath = _b.sent();
                        if (!this.config.compression) return [3 /*break*/, 9];
                        return [4 /*yield*/, fs.unlink(filepath.replace('.sql', '.sql.gz'))];
                    case 8:
                        _b.sent(); // Remover arquivo não criptografado
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, fs.unlink(filepath)];
                    case 10:
                        _b.sent(); // Remover arquivo não criptografado
                        _b.label = 11;
                    case 11: return [4 /*yield*/, fs.stat(finalFilepath)];
                    case 12:
                        stats = _b.sent();
                        fileSize = stats.size;
                        if (!((_a = this.config.storage.s3) === null || _a === void 0 ? void 0 : _a.enabled)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.uploadToS3(finalFilepath)];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: 
                    // Limpar backups antigos
                    return [4 /*yield*/, this.cleanupOldBackups()];
                    case 15:
                        // Limpar backups antigos
                        _b.sent();
                        duration = Date.now() - startTime;
                        // Salvar informações do backup no cache
                        return [4 /*yield*/, this.saveBackupInfo({
                                timestamp: Date.now(),
                                filename: path.basename(finalFilepath),
                                size: fileSize,
                                duration: duration,
                                success: true
                            })];
                    case 16:
                        // Salvar informações do backup no cache
                        _b.sent();
                        logger_1.default.info('Backup concluído com sucesso', {
                            filename: path.basename(finalFilepath),
                            size: "".concat((fileSize / 1024 / 1024).toFixed(2), "MB"),
                            duration: "".concat(duration, "ms")
                        });
                        return [2 /*return*/, {
                                success: true,
                                filename: path.basename(finalFilepath),
                                size: fileSize,
                                duration: duration
                            }];
                    case 17:
                        error_1 = _b.sent();
                        duration = Date.now() - startTime;
                        logger_1.default.error('Erro durante backup:', error_1);
                        return [4 /*yield*/, this.saveBackupInfo({
                                timestamp: Date.now(),
                                filename: '',
                                size: 0,
                                duration: duration,
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : 'Erro desconhecido'
                            })];
                    case 18:
                        _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                filename: '',
                                size: 0,
                                duration: duration,
                                error: error_1 instanceof Error ? error_1.message : 'Erro desconhecido'
                            }];
                    case 19:
                        this.isRunning = false;
                        return [7 /*endfinally*/];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    // Backup do banco de dados PostgreSQL
    BackupService.prototype.backupDatabase = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var dbUrl, url, host, port, database, username, password, command, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbUrl = process.env.DATABASE_URL;
                        if (!dbUrl) {
                            throw new Error('DATABASE_URL não configurada');
                        }
                        url = new URL(dbUrl);
                        host = url.hostname;
                        port = url.port || '5432';
                        database = url.pathname.slice(1);
                        username = url.username;
                        password = url.password;
                        command = "PGPASSWORD=\"".concat(password, "\" pg_dump -h ").concat(host, " -p ").concat(port, " -U ").concat(username, " -d ").concat(database, " --no-password --verbose --clean --if-exists --create > \"").concat(filepath, "\"");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, execAsync(command)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Erro no pg_dump: ".concat(error_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Comprimir backup
    BackupService.prototype.compressBackup = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var compressedPath, command, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        compressedPath = "".concat(filepath, ".gz");
                        command = "gzip \"".concat(filepath, "\"");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, execAsync(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, compressedPath];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Erro na compress\u00E3o: ".concat(error_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Criptografar backup
    BackupService.prototype.encryptBackup = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedPath, password, command, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encryptedPath = "".concat(filepath, ".enc");
                        password = process.env.BACKUP_ENCRYPTION_PASSWORD;
                        if (!password) {
                            throw new Error('BACKUP_ENCRYPTION_PASSWORD não configurada');
                        }
                        command = "openssl enc -aes-256-cbc -salt -in \"".concat(filepath, "\" -out \"").concat(encryptedPath, "\" -pass pass:\"").concat(password, "\"");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, execAsync(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, encryptedPath];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Erro na criptografia: ".concat(error_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Upload para S3 (implementação básica)
    BackupService.prototype.uploadToS3 = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.config.storage.s3) {
                    return [2 /*return*/];
                }
                // Aqui seria implementado o upload para S3
                // Por simplicidade, apenas logamos que seria feito
                logger_1.default.info('Upload para S3 seria executado aqui', {
                    bucket: this.config.storage.s3.bucket,
                    file: path.basename(filepath)
                });
                return [2 /*return*/];
            });
        });
    };
    // Garantir que o diretório de backup existe
    BackupService.prototype.ensureBackupDirectory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, fs.access(this.config.storage.local.path)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _a = _b.sent();
                        return [4 /*yield*/, fs.mkdir(this.config.storage.local.path, { recursive: true })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Limpar backups antigos
    BackupService.prototype.cleanupOldBackups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, backupFiles_1, now_1, oneDay_1, oneWeek_1, oneMonth_1, toDelete, _i, toDelete_1, file, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, fs.readdir(this.config.storage.local.path)];
                    case 1:
                        files = _a.sent();
                        backupFiles_1 = files
                            .filter(function (file) { return file.startsWith('giropro-backup-'); })
                            .map(function (file) { return ({
                            name: file,
                            path: path.join(_this.config.storage.local.path, file),
                            timestamp: _this.extractTimestampFromFilename(file)
                        }); })
                            .sort(function (a, b) { return b.timestamp - a.timestamp; });
                        now_1 = Date.now();
                        oneDay_1 = 24 * 60 * 60 * 1000;
                        oneWeek_1 = 7 * oneDay_1;
                        oneMonth_1 = 30 * oneDay_1;
                        toDelete = backupFiles_1.filter(function (file, index) {
                            var age = now_1 - file.timestamp;
                            if (age <= oneDay_1) {
                                // Backups do último dia: manter conforme retention.daily
                                return index >= _this.config.retention.daily;
                            }
                            else if (age <= oneWeek_1) {
                                // Backups da última semana: manter 1 por dia
                                var daysSinceBackup_1 = Math.floor(age / oneDay_1);
                                var sameDayBackups = backupFiles_1.filter(function (f) {
                                    var fAge = now_1 - f.timestamp;
                                    return Math.floor(fAge / oneDay_1) === daysSinceBackup_1;
                                });
                                return sameDayBackups.indexOf(file) > 0;
                            }
                            else if (age <= oneMonth_1) {
                                // Backups do último mês: manter conforme retention.weekly
                                var weeksSinceBackup_1 = Math.floor(age / oneWeek_1);
                                var sameWeekBackups = backupFiles_1.filter(function (f) {
                                    var fAge = now_1 - f.timestamp;
                                    return Math.floor(fAge / oneWeek_1) === weeksSinceBackup_1;
                                });
                                return sameWeekBackups.indexOf(file) >= _this.config.retention.weekly;
                            }
                            else {
                                // Backups mais antigos: manter conforme retention.monthly
                                var monthsSinceBackup_1 = Math.floor(age / oneMonth_1);
                                var sameMonthBackups = backupFiles_1.filter(function (f) {
                                    var fAge = now_1 - f.timestamp;
                                    return Math.floor(fAge / oneMonth_1) === monthsSinceBackup_1;
                                });
                                return sameMonthBackups.indexOf(file) >= _this.config.retention.monthly;
                            }
                        });
                        _i = 0, toDelete_1 = toDelete;
                        _a.label = 2;
                    case 2:
                        if (!(_i < toDelete_1.length)) return [3 /*break*/, 5];
                        file = toDelete_1[_i];
                        return [4 /*yield*/, fs.unlink(file.path)];
                    case 3:
                        _a.sent();
                        logger_1.default.info("Backup antigo removido: ".concat(file.name));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        logger_1.default.error('Erro ao limpar backups antigos:', error_5);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Extrair timestamp do nome do arquivo
    BackupService.prototype.extractTimestampFromFilename = function (filename) {
        var match = filename.match(/giropro-backup-(.+?)\./);
        if (match) {
            var timestampStr = match[1].replace(/-/g, ':').replace(/T/, 'T').replace(/Z$/, '.000Z');
            return new Date(timestampStr).getTime();
        }
        return 0;
    };
    // Salvar informações do backup no cache
    BackupService.prototype.saveBackupInfo = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var backupHistory, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, cacheService_1.cacheService.get("backup:history")];
                    case 1:
                        backupHistory = (_a.sent()) || [];
                        backupHistory.unshift(info);
                        // Manter apenas os últimos 50 registros
                        if (backupHistory.length > 50) {
                            backupHistory.splice(50);
                        }
                        return [4 /*yield*/, cacheService_1.cacheService.set('backup:history', backupHistory, 86400 * 30)];
                    case 2:
                        _a.sent(); // 30 dias
                        return [4 /*yield*/, cacheService_1.cacheService.set('backup:last', info, 86400 * 7)];
                    case 3:
                        _a.sent(); // 7 dias
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        logger_1.default.error('Erro ao salvar informações do backup:', error_6);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Obter histórico de backups
    BackupService.prototype.getBackupHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cacheService_1.cacheService.get('backup:history')];
                    case 1: return [2 /*return*/, (_a.sent()) || []];
                    case 2:
                        error_7 = _a.sent();
                        logger_1.default.error('Erro ao obter histórico de backups:', error_7);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Obter último backup
    BackupService.prototype.getLastBackup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cacheService_1.cacheService.get('backup:last')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        logger_1.default.error('Erro ao obter último backup:', error_8);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Verificar se backup está habilitado
    BackupService.prototype.isEnabled = function () {
        return this.config.enabled;
    };
    // Verificar se backup está em execução
    BackupService.prototype.isBackupRunning = function () {
        return this.isRunning;
    };
    // Obter configuração de backup
    BackupService.prototype.getConfig = function () {
        return __assign({}, this.config);
    };
    // Restaurar backup (implementação básica)
    BackupService.prototype.restoreBackup = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var filepath, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filepath = path.join(this.config.storage.local.path, filename);
                        // Verificar se arquivo existe
                        return [4 /*yield*/, fs.access(filepath)];
                    case 1:
                        // Verificar se arquivo existe
                        _a.sent();
                        logger_1.default.warn('Restauração de backup solicitada', { filename: filename });
                        // Aqui seria implementada a lógica de restauração
                        // Por segurança, apenas logamos a tentativa
                        return [2 /*return*/, true];
                    case 2:
                        error_9 = _a.sent();
                        logger_1.default.error('Erro ao restaurar backup:', error_9);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return BackupService;
}());
exports.backupService = new BackupService();
