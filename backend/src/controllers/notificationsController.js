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
exports.NotificationsController = void 0;
var notificationService_1 = require("../services/notificationService");
var zod_1 = require("zod");
// Schemas de validação
var createNotificationSchema = zod_1.z.object({
    tipo: zod_1.z.enum(['sistema', 'alerta', 'promocao', 'suporte']).default('sistema'),
    titulo: zod_1.z.string()
        .min(1, 'Título é obrigatório')
        .max(100, 'Título deve ter no máximo 100 caracteres'),
    mensagem: zod_1.z.string()
        .min(1, 'Mensagem é obrigatória')
        .max(500, 'Mensagem deve ter no máximo 500 caracteres'),
    dados_extras: zod_1.z.any().optional(),
});
var getNotificationsSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number()
        .min(1, 'Limite mínimo é 1')
        .max(100, 'Limite máximo é 100')
        .default(20),
    offset: zod_1.z.coerce.number()
        .min(0, 'Offset deve ser maior ou igual a 0')
        .default(0),
    onlyUnread: zod_1.z.coerce.boolean().default(false),
    tipo: zod_1.z.string().optional(),
});
var NotificationsController = /** @class */ (function () {
    function NotificationsController() {
    }
    /**
     * Valida se o usuário está autenticado
     */
    NotificationsController.validateAuth = function (req) {
        var _a;
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    };
    /**
     * Retorna resposta de erro padronizada
     */
    NotificationsController.errorResponse = function (res, status, message, details) {
        return res.status(status).json({
            success: false,
            error: { message: message, details: details }
        });
    };
    /**
     * Retorna resposta de sucesso padronizada
     */
    NotificationsController.successResponse = function (res, data, message, status) {
        if (status === void 0) { status = 200; }
        var response = __assign(__assign({ success: true }, (data !== undefined && { data: data })), (message && { message: message }));
        return res.status(status).json(response);
    };
    /**
     * Criar uma nova notificação
     */
    NotificationsController.createNotification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validation, notificationData, notification, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        validation = createNotificationSchema.safeParse(req.body);
                        if (!validation.success) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 400, 'Dados inválidos', validation.error.errors)];
                        }
                        notificationData = {
                            userId: userId,
                            tipo: validation.data.tipo,
                            titulo: validation.data.titulo,
                            mensagem: validation.data.mensagem,
                            dados_extras: validation.data.dados_extras,
                        };
                        return [4 /*yield*/, notificationService_1.NotificationService.createNotification(notificationData)];
                    case 1:
                        notification = _a.sent();
                        return [2 /*return*/, NotificationsController.successResponse(res, notification, 'Notificação criada com sucesso', 201)];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Erro ao criar notificação:', error_1);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Buscar notificações do usuário
     */
    NotificationsController.getNotifications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validation, _a, limit, offset, onlyUnread, tipo, _b, notifications, unreadCount, responseData, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        validation = getNotificationsSchema.safeParse(req.query);
                        if (!validation.success) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 400, 'Parâmetros inválidos', validation.error.errors)];
                        }
                        _a = validation.data, limit = _a.limit, offset = _a.offset, onlyUnread = _a.onlyUnread, tipo = _a.tipo;
                        return [4 /*yield*/, Promise.all([
                                notificationService_1.NotificationService.getUserNotifications(userId, {
                                    limit: limit,
                                    offset: offset,
                                    onlyUnread: onlyUnread,
                                    tipo: tipo,
                                }),
                                notificationService_1.NotificationService.getUnreadCount(userId)
                            ])];
                    case 1:
                        _b = _c.sent(), notifications = _b[0], unreadCount = _b[1];
                        responseData = {
                            notifications: notifications,
                            pagination: {
                                limit: limit,
                                offset: offset,
                                total_unread: unreadCount,
                            },
                            filters: {
                                only_unread: onlyUnread,
                                tipo: tipo || null,
                            }
                        };
                        return [2 /*return*/, NotificationsController.successResponse(res, responseData)];
                    case 2:
                        error_2 = _c.sent();
                        console.error('Erro ao buscar notificações:', error_2);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Marcar notificação como lida
     */
    NotificationsController.markAsRead = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, success, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 400, 'ID da notificação é obrigatório')];
                        }
                        return [4 /*yield*/, notificationService_1.NotificationService.markAsRead(id, userId)];
                    case 1:
                        success = _a.sent();
                        if (!success) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 404, 'Notificação não encontrada')];
                        }
                        return [2 /*return*/, NotificationsController.successResponse(res, undefined, 'Notificação marcada como lida')];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Erro ao marcar notificação como lida:', error_3);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Marcar todas as notificações como lidas
     */
    NotificationsController.markAllAsRead = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, updatedCount, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        return [4 /*yield*/, notificationService_1.NotificationService.markAllAsRead(userId)];
                    case 1:
                        updatedCount = _a.sent();
                        return [2 /*return*/, NotificationsController.successResponse(res, { updated_count: updatedCount }, "".concat(updatedCount, " notifica\u00E7\u00F5es marcadas como lidas"))];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Erro ao marcar todas as notificações como lidas:', error_4);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obter contagem de notificações não lidas
     */
    NotificationsController.getUnreadCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, unreadCount, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        return [4 /*yield*/, notificationService_1.NotificationService.getUnreadCount(userId)];
                    case 1:
                        unreadCount = _a.sent();
                        return [2 /*return*/, NotificationsController.successResponse(res, { unread_count: unreadCount })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Erro ao obter contagem de notificações não lidas:', error_5);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletar notificação
     */
    NotificationsController.deleteNotification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, success, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 400, 'ID da notificação é obrigatório')];
                        }
                        return [4 /*yield*/, notificationService_1.NotificationService.deleteNotification(id, userId)];
                    case 1:
                        success = _a.sent();
                        if (!success) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 404, 'Notificação não encontrada')];
                        }
                        return [2 /*return*/, NotificationsController.successResponse(res, undefined, 'Notificação deletada com sucesso')];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Erro ao deletar notificação:', error_6);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processar notificações automáticas
     */
    NotificationsController.processAutomaticNotifications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        return [4 /*yield*/, notificationService_1.NotificationService.processAutomaticNotifications(userId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, NotificationsController.successResponse(res, result, "".concat(result.total_created, " notifica\u00E7\u00F5es autom\u00E1ticas criadas"))];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Erro ao processar notificações automáticas:', error_7);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gerar notificação de teste
     */
    NotificationsController.generateTestNotification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, testNotificationData, testNotification, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = NotificationsController.validateAuth(req);
                        if (!userId) {
                            return [2 /*return*/, NotificationsController.errorResponse(res, 401, 'Usuário não autenticado')];
                        }
                        testNotificationData = {
                            userId: userId,
                            tipo: 'sistema',
                            titulo: '🧪 Notificação de Teste',
                            mensagem: 'Esta é uma notificação de teste para verificar o funcionamento do sistema.',
                            dados_extras: {
                                test: true,
                                timestamp: new Date().toISOString(),
                                environment: process.env.NODE_ENV || 'development',
                            },
                        };
                        return [4 /*yield*/, notificationService_1.NotificationService.createNotification(testNotificationData)];
                    case 1:
                        testNotification = _a.sent();
                        return [2 /*return*/, NotificationsController.successResponse(res, testNotification, 'Notificação de teste criada com sucesso')];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Erro ao gerar notificação de teste:', error_8);
                        return [2 /*return*/, NotificationsController.errorResponse(res, 500, 'Erro interno do servidor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationsController;
}());
exports.NotificationsController = NotificationsController;
