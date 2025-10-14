"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var insightsController_1 = require("../controllers/insightsController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Aplicar middleware de autenticação em todas as rotas
router.use(auth_1.authMiddleware);
/**
 * @route GET /api/v1/insights/generate
 * @desc Gerar insights completos para o usuário
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise (7-365)
 * @query {boolean} [incluir_tendencias=true] - Incluir análise de tendências
 * @query {boolean} [incluir_sazonalidade=true] - Incluir análise de sazonalidade
 * @query {boolean} [incluir_custos=true] - Incluir análise de custos
 */
router.get('/generate', insightsController_1.InsightsController.generateInsights);
/**
 * @route GET /api/v1/insights/summary
 * @desc Obter apenas insights e recomendações (sem dados detalhados)
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise (7-365)
 */
router.get('/summary', insightsController_1.InsightsController.getInsightsSummary);
/**
 * @route GET /api/v1/insights/efficiency
 * @desc Obter métricas de eficiência operacional
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise
 */
router.get('/efficiency', insightsController_1.InsightsController.getEfficiencyMetrics);
/**
 * @route GET /api/v1/insights/trends
 * @desc Obter análise de tendências
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=90] - Período em dias para análise
 */
router.get('/trends', insightsController_1.InsightsController.getTrends);
/**
 * @route GET /api/v1/insights/seasonality
 * @desc Obter análise de sazonalidade
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 */
router.get('/seasonality', insightsController_1.InsightsController.getSeasonality);
/**
 * @route GET /api/v1/insights/costs
 * @desc Obter análise de custos
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise
 */
router.get('/costs', insightsController_1.InsightsController.getCostAnalysis);
exports.default = router;
