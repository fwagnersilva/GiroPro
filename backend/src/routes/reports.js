"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoutes = void 0;
var express_1 = require("express");
var auth_1 = require("../middlewares/auth");
var reportsController_1 = require("../controllers/reportsController");
var weeklyMonthlyReportsController_1 = require("../controllers/weeklyMonthlyReportsController");
var router = (0, express_1.Router)();
exports.reportRoutes = router;
// Todas as rotas de relatórios requerem autenticação
router.use(auth_1.authMiddleware);
// GET /api/v1/reports/journey-earnings - Relatório detalhado de ganhos por jornada
router.get("/journey-earnings", function (req, res) { return reportsController_1.ReportsController.getJourneyEarningsReport(req, res); });
// GET /api/v1/reports/expense-analysis - Relatório de análise de despesas
router.get("/expense-analysis", function (req, res) { return reportsController_1.ReportsController.getExpenseAnalysisReport(req, res); });
// GET /api/v1/reports/fuel-consumption - Relatório de consumo de combustível
router.get("/fuel-consumption", function (req, res) { return reportsController_1.ReportsController.getFuelConsumptionReport(req, res); });
// GET /api/v1/reports/weekly - Relatório semanal de faturamento, despesas e lucro
router.get("/weekly", function (req, res, next) { return weeklyMonthlyReportsController_1.WeeklyMonthlyReportsController.getWeeklyReport(req, res, next); });
// GET /api/v1/reports/monthly - Relatório mensal de faturamento, despesas e lucro
router.get("/monthly", function (req, res, next) { return weeklyMonthlyReportsController_1.WeeklyMonthlyReportsController.getMonthlyReport(req, res, next); });
// GET /api/v1/reports/weekly-comparison - Comparativo de múltiplas semanas
router.get("/weekly-comparison", function (req, res, next) { return weeklyMonthlyReportsController_1.WeeklyMonthlyReportsController.getWeeklyComparison(req, res, next); });
// GET /api/v1/reports/monthly-comparison - Comparativo de múltiplos meses
router.get("/monthly-comparison", function (req, res, next) { return weeklyMonthlyReportsController_1.WeeklyMonthlyReportsController.getMonthlyComparison(req, res, next); });
// GET /api/v1/reports/journeys/csv - Exportar relatório de jornadas em CSV
router.get("/journeys/csv", function (req, res) { return reportsController_1.ReportsController.getJourneysCsvReport(req, res); });
// GET /api/v1/reports/expenses/pdf - Exportar relatório de despesas em PDF
router.get("/expenses/pdf", function (req, res) { return reportsController_1.ReportsController.getExpensesPdfReport(req, res); });
