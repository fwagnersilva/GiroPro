import { Router } from 'express';
import { InsightsController } from '../controllers/insightsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

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
router.get('/generate', InsightsController.generateInsights);

/**
 * @route GET /api/v1/insights/summary
 * @desc Obter apenas insights e recomendações (sem dados detalhados)
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise (7-365)
 */
router.get('/summary', InsightsController.getInsightsSummary);

/**
 * @route GET /api/v1/insights/efficiency
 * @desc Obter métricas de eficiência operacional
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise
 */
router.get('/efficiency', InsightsController.getEfficiencyMetrics);

/**
 * @route GET /api/v1/insights/trends
 * @desc Obter análise de tendências
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=90] - Período em dias para análise
 */
router.get('/trends', InsightsController.getTrends);

/**
 * @route GET /api/v1/insights/seasonality
 * @desc Obter análise de sazonalidade
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 */
router.get('/seasonality', InsightsController.getSeasonality);

/**
 * @route GET /api/v1/insights/costs
 * @desc Obter análise de custos
 * @access Private
 * @query {string} [idVeiculo] - UUID do veículo específico
 * @query {number} [periodo_dias=30] - Período em dias para análise
 */
router.get('/costs', InsightsController.getCostAnalysis);

export default router;

