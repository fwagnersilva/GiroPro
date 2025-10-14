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
exports.NotificationService = void 0;
var db_1 = require("../db");
var schema_postgres_1 = require("../db/schema.postgres");
var drizzle_orm_1 = require("drizzle-orm");
var uuid_1 = require("uuid");
var NotificationService = /** @class */ (function () {
    function NotificationService() {
    }
    /**
     * Criar uma nova notificação
     */
    NotificationService.createNotification = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = {
                            id: data.id || (0, uuid_1.v4)(),
                            userId: data.userId,
                            tipo: data.tipo || "sistema",
                            titulo: data.titulo,
                            mensagem: data.mensagem,
                            dados_extras: data.dados_extras ? JSON.stringify(data.dados_extras) : null,
                            lida: false,
                            dataEnvio: data.dataEnvio || new Date(), // Usar new Date() diretamente
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_postgres_1.notificacoes).values(notification)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, notification), { lida: notification.lida })];
                }
            });
        });
    };
    /**
     * Buscar notificações do usuário
     */
    NotificationService.getUserNotifications = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, options) {
            var _a, limit, _b, offset, _c, onlyUnread, tipo, whereCondition, validTypes, notifications;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = options.limit, limit = _a === void 0 ? 50 : _a, _b = options.offset, offset = _b === void 0 ? 0 : _b, _c = options.onlyUnread, onlyUnread = _c === void 0 ? false : _c, tipo = options.tipo;
                        whereCondition = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt));
                        if (onlyUnread) {
                            whereCondition = (0, drizzle_orm_1.and)(whereCondition, (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.lida, false));
                        }
                        if (tipo) {
                            validTypes = Object.values(schema_postgres_1.tipoNotificacao);
                            if (validTypes.includes(tipo)) {
                                whereCondition = (0, drizzle_orm_1.and)(whereCondition, (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.tipo, tipo));
                            }
                            else {
                                console.warn("Tipo de notifica\u00E7\u00E3o inv\u00E1lido fornecido: ".concat(tipo));
                            }
                        }
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_postgres_1.notificacoes)
                                .where(whereCondition)
                                .orderBy((0, drizzle_orm_1.desc)(schema_postgres_1.notificacoes.dataEnvio))
                                .limit(limit)
                                .offset(offset)];
                    case 1:
                        notifications = _d.sent();
                        return [2 /*return*/, notifications.map(function (notification) { return (__assign(__assign({}, notification), { dadosExtras: notification.dadosExtras ? JSON.parse(notification.dadosExtras) : null })); })];
                }
            });
        });
    };
    /**
     * Marcar notificação como lida
     */
    NotificationService.markAsRead = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.notificacoes)
                            .set({
                            lida: true,
                            dataLeitura: new Date(), // Corrigido para dataLeitura
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.id, notificationId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt))).returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                }
            });
        });
    };
    /**
     * Marcar todas as notificações como lidas
     */
    NotificationService.markAllAsRead = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.notificacoes)
                            .set({
                            lida: true,
                            dataLeitura: new Date(), // Corrigido para dataLeitura
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.lida, false), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt))).returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length];
                }
            });
        });
    };
    /**
     * Contar notificações não lidas
     */
    NotificationService.getUnreadCount = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select({ count: schema_postgres_1.notificacoes.id })
                            .from(schema_postgres_1.notificacoes)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.lida, false), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt)))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length];
                }
            });
        });
    };
    /**
     * Deletar notificação
     */
    NotificationService.deleteNotification = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_postgres_1.notificacoes)
                            .set({
                            deletedAt: new Date(),
                        })
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.id, notificationId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt))).returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                }
            });
        });
    };
    /**
     * Limpar notificações antigas (mais de 30 dias)
     */
    NotificationService.cleanupOldNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyDaysAgo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, db_1.db
                                .update(schema_postgres_1.notificacoes)
                                .set({
                                deletedAt: new Date(),
                            })
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_postgres_1.notificacoes.dataEnvio, thirtyDaysAgo), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt))).returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length];
                }
            });
        });
    };
    /**
     * Gerar notificações automáticas baseadas em insights
     */
    NotificationService.generateInsightNotifications = function (userId, insights) {
        return __awaiter(this, void 0, void 0, function () {
            var createdCount, _loop_1, this_1, _i, insights_1, insight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createdCount = 0;
                        _loop_1 = function (insight) {
                            var yesterday, existingNotifications, isDuplicate;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                                        return [4 /*yield*/, db_1.db
                                                .select()
                                                .from(schema_postgres_1.notificacoes)
                                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.tipo, 'sistema'), (0, drizzle_orm_1.gte)(schema_postgres_1.notificacoes.dataEnvio, yesterday), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt)))];
                                    case 1:
                                        existingNotifications = _b.sent();
                                        isDuplicate = existingNotifications.some(function (notification) { return notification.titulo === insight.titulo; });
                                        if (!!isDuplicate) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this_1.createNotification({
                                                userId: userId,
                                                tipo: 'sistema',
                                                titulo: insight.titulo,
                                                mensagem: insight.descricao,
                                                dados_extras: {
                                                    insight_tipo: insight.tipo,
                                                    impacto: insight.impacto,
                                                    detalhes: insight.detalhes,
                                                },
                                            })];
                                    case 2:
                                        _b.sent();
                                        createdCount++;
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, insights_1 = insights;
                        _a.label = 1;
                    case 1:
                        if (!(_i < insights_1.length)) return [3 /*break*/, 4];
                        insight = insights_1[_i];
                        return [5 /*yield**/, _loop_1(insight)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, createdCount];
                }
            });
        });
    };
    /**
     * Gerar notificações automáticas baseadas em recomendações
     */
    NotificationService.generateRecommendationNotifications = function (userId, recommendations) {
        return __awaiter(this, void 0, void 0, function () {
            var createdCount, highPriorityRecommendations, _loop_2, this_2, _i, highPriorityRecommendations_1, recommendation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createdCount = 0;
                        highPriorityRecommendations = recommendations.filter(function (rec) { return rec.prioridade === 'alta'; });
                        _loop_2 = function (recommendation) {
                            var twoDaysAgo, existingNotifications, isDuplicate;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
                                        return [4 /*yield*/, db_1.db
                                                .select()
                                                .from(schema_postgres_1.notificacoes)
                                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.userId, userId), (0, drizzle_orm_1.eq)(schema_postgres_1.notificacoes.tipo, 'alerta'), (0, drizzle_orm_1.gte)(schema_postgres_1.notificacoes.dataEnvio, twoDaysAgo), (0, drizzle_orm_1.isNull)(schema_postgres_1.notificacoes.deletedAt)))];
                                    case 1:
                                        existingNotifications = _b.sent();
                                        isDuplicate = existingNotifications.some(function (notification) { return notification.titulo === recommendation.titulo; });
                                        if (!!isDuplicate) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this_2.createNotification({
                                                userId: userId,
                                                tipo: 'alerta',
                                                titulo: "\uD83C\uDFAF ".concat(recommendation.titulo),
                                                mensagem: recommendation.descricao,
                                                dados_extras: {
                                                    categoria: recommendation.categoria,
                                                    prioridade: recommendation.prioridade,
                                                    acoes: recommendation.acoes,
                                                },
                                            })];
                                    case 2:
                                        _b.sent();
                                        createdCount++;
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, highPriorityRecommendations_1 = highPriorityRecommendations;
                        _a.label = 1;
                    case 1:
                        if (!(_i < highPriorityRecommendations_1.length)) return [3 /*break*/, 4];
                        recommendation = highPriorityRecommendations_1[_i];
                        return [5 /*yield**/, _loop_2(recommendation)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, createdCount];
                }
            });
        });
    };
    /**
     * Gerar notificações de metas e objetivos
     */
    NotificationService.generateGoalNotifications = function (userId, goalData) {
        return __awaiter(this, void 0, void 0, function () {
            var meta_atingida, progresso_percentual, meta_tipo, valor_atual, valor_meta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        meta_atingida = goalData.meta_atingida, progresso_percentual = goalData.progresso_percentual, meta_tipo = goalData.meta_tipo, valor_atual = goalData.valor_atual, valor_meta = goalData.valor_meta;
                        if (!meta_atingida) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createNotification({
                                userId: userId,
                                tipo: 'sistema',
                                titulo: '🎉 Meta Atingida!',
                                mensagem: "Parab\u00E9ns! Voc\u00EA atingiu sua meta de ".concat(meta_tipo, "."),
                                dados_extras: {
                                    meta_tipo: meta_tipo,
                                    valor_atual: valor_atual,
                                    valor_meta: valor_meta,
                                    progresso_percentual: 100,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(progresso_percentual >= 90)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createNotification({
                                userId: userId,
                                tipo: 'alerta',
                                titulo: '🔥 Quase lá!',
                                mensagem: "Voc\u00EA est\u00E1 a ".concat((100 - progresso_percentual).toFixed(1), "% de atingir sua meta de ").concat(meta_tipo, "."),
                                dados_extras: {
                                    meta_tipo: meta_tipo,
                                    valor_atual: valor_atual,
                                    valor_meta: valor_meta,
                                    progresso_percentual: progresso_percentual,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(progresso_percentual >= 75)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createNotification({
                                userId: userId,
                                tipo: 'alerta',
                                titulo: '💪 Bom progresso!',
                                mensagem: "Voc\u00EA j\u00E1 completou ".concat(progresso_percentual.toFixed(1), "% da sua meta de ").concat(meta_tipo, "."),
                                dados_extras: {
                                    meta_tipo: meta_tipo,
                                    valor_atual: valor_atual,
                                    valor_meta: valor_meta,
                                    progresso_percentual: progresso_percentual,
                                },
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gerar notificações de alertas operacionais
     */
    NotificationService.generateOperationalAlerts = function (userId, alertData) {
        return __awaiter(this, void 0, void 0, function () {
            var tipo_alerta, veiculo, dados, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tipo_alerta = alertData.tipo_alerta, veiculo = alertData.veiculo, dados = alertData.dados;
                        _a = tipo_alerta;
                        switch (_a) {
                            case 'consumo_alto': return [3 /*break*/, 1];
                            case 'manutencao_preventiva': return [3 /*break*/, 3];
                            case 'eficiencia_baixa': return [3 /*break*/, 5];
                            case 'meta_diaria_risco': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.createNotification({
                            userId: userId,
                            tipo: 'alerta',
                            titulo: '⚠️ Consumo Elevado',
                            mensagem: "O ve\u00EDculo ".concat(veiculo.marca, " ").concat(veiculo.modelo, " est\u00E1 com consumo acima do normal."),
                            dados_extras: {
                                veiculo_id: veiculo.id,
                                consumo_atual: dados.consumo_atual,
                                consumo_medio: dados.consumo_medio,
                                diferenca_percentual: dados.diferenca_percentual,
                            },
                        })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.createNotification({
                            userId: userId,
                            tipo: 'sistema',
                            titulo: '🔧 Manutenção Preventiva',
                            mensagem: "O ve\u00EDculo ".concat(veiculo.marca, " ").concat(veiculo.modelo, " pode precisar de manuten\u00E7\u00E3o em breve."),
                            dados_extras: {
                                veiculo_id: veiculo.id,
                                kmAtual: dados.kmAtual,
                                km_ultima_manutencao: dados.km_ultima_manutencao,
                                km_recomendado: dados.km_recomendado,
                            },
                        })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.createNotification({
                            userId: userId,
                            tipo: 'alerta',
                            titulo: '📉 Eficiência Baixa',
                            mensagem: "A efici\u00EAncia do ve\u00EDculo ".concat(veiculo.marca, " ").concat(veiculo.modelo, " est\u00E1 abaixo do esperado."),
                            dados_extras: {
                                veiculo_id: veiculo.id,
                                ganho_por_kmAtual: dados.ganho_por_kmAtual,
                                ganho_por_km_medio: dados.ganho_por_km_medio,
                                diferenca_percentual: dados.diferenca_percentual,
                            },
                        })];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.createNotification({
                            userId: userId,
                            tipo: 'alerta',
                            titulo: '⏰ Meta Diária em Risco',
                            mensagem: 'Você pode não atingir sua meta diária se continuar no ritmo atual.',
                            dados_extras: {
                                meta_diaria: dados.meta_diaria,
                                progresso_atual: dados.progresso_atual,
                                tempo_restante_horas: dados.tempo_restante_horas,
                                ritmo_necessario: dados.ritmo_necessario,
                            },
                        })];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processar notificações automáticas para um usuário
     */
    NotificationService.processAutomaticNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var mockInsights, mockRecommendations, insightsCreated, recommendationsCreated, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        mockInsights = [
                            {
                                tipo: 'eficiencia',
                                titulo: 'Oportunidade de Melhoria',
                                descricao: 'Sua eficiência operacional pode ser otimizada',
                                detalhes: 'Considere ajustar seus horários de trabalho',
                                impacto: 'positivo',
                            }
                        ];
                        mockRecommendations = [
                            {
                                categoria: 'eficiencia',
                                prioridade: 'alta',
                                titulo: 'Otimizar Horários',
                                descricao: 'Trabalhe mais nos horários de maior demanda',
                                acoes: ['Focar nas manhãs', 'Evitar horários de baixa demanda'],
                            }
                        ];
                        return [4 /*yield*/, this.generateInsightNotifications(userId, mockInsights)];
                    case 1:
                        insightsCreated = _a.sent();
                        return [4 /*yield*/, this.generateRecommendationNotifications(userId, mockRecommendations)];
                    case 2:
                        recommendationsCreated = _a.sent();
                        return [2 /*return*/, {
                                insights_created: insightsCreated,
                                recommendations_created: recommendationsCreated,
                                total_created: insightsCreated + recommendationsCreated,
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Erro ao processar notificações automáticas:', error_1);
                        return [2 /*return*/, {
                                insights_created: 0,
                                recommendations_created: 0,
                                total_created: 0,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
