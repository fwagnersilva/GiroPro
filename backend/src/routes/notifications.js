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
var express_1 = require("express");
var notificationsController_1 = require("../controllers/notificationsController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Aplicar middleware de autenticação em todas as rotas
router.use(auth_1.authMiddleware);
// Wrapper functions para converter métodos estáticos para RequestHandler
var createNotificationWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.createNotification(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getNotificationsWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.getNotifications(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var markAsReadWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.markAsRead(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var markAllAsReadWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.markAllAsRead(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var deleteNotificationWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.deleteNotification(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUnreadCountWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.getUnreadCount(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var generateInsightNotificationWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.generateTestNotification(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var generateTestNotificationWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.generateTestNotification(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var processAutomaticNotificationsWrapper = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationsController_1.NotificationsController.processAutomaticNotifications(req, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * @route POST /api/v1/notifications
 * @desc Criar uma nova notificação
 * @access Private
 * @body {string} tipo - Tipo da notificação (info, warning, success, error, insight, recommendation)
 * @body {string} titulo - Título da notificação (max 100 chars)
 * @body {string} mensagem - Mensagem da notificação (max 500 chars)
 * @body {object} [dados_extras] - Dados extras opcionais
 */
router.post('/', createNotificationWrapper);
/**
 * @route GET /api/v1/notifications
 * @desc Buscar notificações do usuário
 * @access Private
 * @query {number} [limit=20] - Limite de notificações por página (1-100)
 * @query {number} [offset=0] - Offset para paginação
 * @query {boolean} [onlyUnread=false] - Buscar apenas notificações não lidas
 * @query {string} [tipo] - Filtrar por tipo de notificação
 */
router.get('/', getNotificationsWrapper);
/**
 * @route PUT /api/v1/notifications/:id/read
 * @desc Marcar notificação como lida
 * @access Private
 * @param {string} id - ID da notificação
 */
router.put('/:id/read', markAsReadWrapper);
/**
 * @route PUT /api/v1/notifications/read-all
 * @desc Marcar todas as notificações como lidas
 * @access Private
 */
router.put('/read-all', markAllAsReadWrapper);
/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Obter contagem de notificações não lidas
 * @access Private
 */
router.get('/unread-count', getUnreadCountWrapper);
/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Deletar notificação
 * @access Private
 * @param {string} id - ID da notificação
 */
router.delete('/:id', deleteNotificationWrapper);
/**
 * @route POST /api/v1/notifications/process-automatic
 * @desc Processar notificações automáticas baseadas em insights
 * @access Private
 */
router.post('/process-automatic', processAutomaticNotificationsWrapper);
/**
 * @route POST /api/v1/notifications/test
 * @desc Gerar notificação de teste
 * @access Private
 */
router.post('/test', generateTestNotificationWrapper);
exports.default = router;
