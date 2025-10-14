"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var advancedAnalyticsController_1 = require("../controllers/advancedAnalyticsController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Aplicar middleware de autenticação em todas as rotas
router.use(auth_1.authMiddleware);
/**
 * @route GET /api/v1/analytics/consumption
 * @desc Análise de consumo por veículo
 * @access Private
 * @query {string} [dataInicio] - Data de início (ISO 8601)
 * @query {string} [dataFim] - Data de fim (ISO 8601)
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/consumption', advancedAnalyticsController_1.AdvancedAnalyticsController.getConsumptionAnalysis);
/**
 * @route GET /api/v1/analytics/productivity
 * @desc Análise de produtividade por veículo
 * @access Private
 * @query {string} [dataInicio] - Data de início (ISO 8601)
 * @query {string} [dataFim] - Data de fim (ISO 8601)
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/productivity', advancedAnalyticsController_1.AdvancedAnalyticsController.getProductivityAnalysis);
/**
 * @route GET /api/v1/analytics/patterns
 * @desc Identificação de padrões temporais
 * @access Private
 * @query {string} [dataInicio] - Data de início (ISO 8601)
 * @query {string} [dataFim] - Data de fim (ISO 8601)
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
// router.get('/patterns', AdvancedAnalyticsController.getTemporalPatterns);
/**
 * @route GET /api/v1/analytics/vehicle-comparison
 * @desc Comparação entre veículos
 * @access Private
 * @query {string} [dataInicio] - Data de início (ISO 8601)
 * @query {string} [dataFim] - Data de fim (ISO 8601)
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
// router.get('/vehicle-comparison', AdvancedAnalyticsController.getVehicleComparison);
exports.default = router;
