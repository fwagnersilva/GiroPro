"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weeklyMonthlyReportResponseSchema = exports.reportResponseSchema = exports.notificationsListResponseSchema = exports.notificationResponseSchema = exports.goalsListResponseSchema = exports.goalResponseSchema = exports.gamificationResponseSchema = exports.advancedAnalyticsResponseSchema = exports.dashboardStatsResponseSchema = exports.fuelPricesListResponseSchema = exports.fuelPriceResponseSchema = exports.expensesListResponseSchema = exports.expenseResponseSchema = exports.fuelingsListResponseSchema = exports.fuelingResponseSchema = exports.journeyStatsResponseSchema = exports.journeysListResponseSchema = exports.journeyResponseSchema = exports.vehiclesListResponseSchema = exports.vehicleResponseSchema = exports.errorResponseSchema = exports.successResponseSchema = void 0;
var zod_1 = require("zod");
exports.successResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
exports.errorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    error: zod_1.z.string(),
    details: zod_1.z.array(zod_1.z.object({ message: zod_1.z.string() })).optional(),
});
exports.vehicleResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    marca: zod_1.z.string(),
    modelo: zod_1.z.string(),
    ano: zod_1.z.number(),
    placa: zod_1.z.string(),
    cor: zod_1.z.string(),
    tipoCombustivel: zod_1.z.string(),
    capacidadeTanque: zod_1.z.number(),
    consumoMedio: zod_1.z.number(),
    quilometragemAtual: zod_1.z.number(),
    usuarioId: zod_1.z.string().uuid(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.vehiclesListResponseSchema = zod_1.z.array(exports.vehicleResponseSchema);
exports.journeyResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    veiculoId: zod_1.z.string().uuid(),
    data: zod_1.z.string().datetime(),
    quilometragemInicial: zod_1.z.number(),
    quilometragemFinal: zod_1.z.number(),
    distanciaPercorrida: zod_1.z.number(),
    tipo: zod_1.z.string(),
    finalidade: zod_1.z.string(),
    observacoes: zod_1.z.string().nullable(),
    custoTotal: zod_1.z.number(),
    mediaConsumo: zod_1.z.number(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.journeysListResponseSchema = zod_1.z.array(exports.journeyResponseSchema);
exports.journeyStatsResponseSchema = zod_1.z.object({
    totalJourneys: zod_1.z.number(),
    totalDistance: zod_1.z.number(),
    totalCost: zod_1.z.number(),
    averageConsumption: zod_1.z.number(),
});
exports.fuelingResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    veiculoId: zod_1.z.string().uuid(),
    data: zod_1.z.string().datetime(),
    quilometragem: zod_1.z.number(),
    quantidadeLitros: zod_1.z.number(),
    precoPorLitro: zod_1.z.number(),
    valorTotal: zod_1.z.number(),
    tipoCombustivel: zod_1.z.string(),
    postoCombustivel: zod_1.z.string().nullable(),
    observacoes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.fuelingsListResponseSchema = zod_1.z.array(exports.fuelingResponseSchema);
exports.expenseResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    veiculoId: zod_1.z.string().uuid(),
    data: zod_1.z.string().datetime(),
    tipo: zod_1.z.string(),
    descricao: zod_1.z.string(),
    valor: zod_1.z.number(),
    observacoes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.expensesListResponseSchema = zod_1.z.array(exports.expenseResponseSchema);
exports.fuelPriceResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    tipoCombustivel: zod_1.z.string(),
    precoPorLitro: zod_1.z.number(),
    dataAtualizacao: zod_1.z.string().datetime(),
    postoCombustivel: zod_1.z.string().nullable(),
    localizacao: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.fuelPricesListResponseSchema = zod_1.z.array(exports.fuelPriceResponseSchema);
exports.dashboardStatsResponseSchema = zod_1.z.object({
    totalVeiculos: zod_1.z.number(),
    totalDespesas: zod_1.z.number(),
    totalAbastecimentos: zod_1.z.number(),
    totalPercursos: zod_1.z.number(),
    quilometragemTotal: zod_1.z.number(),
    gastoTotalCombustivel: zod_1.z.number(),
    mediaConsumoGeral: zod_1.z.number(),
});
exports.advancedAnalyticsResponseSchema = zod_1.z.object({
// TODO: Definir schema para análises avançadas
});
exports.gamificationResponseSchema = zod_1.z.object({
// TODO: Definir schema para gamificação
});
exports.goalResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    tipo: zod_1.z.string(),
    meta: zod_1.z.number(),
    progresso: zod_1.z.number(),
    unidade: zod_1.z.string(),
    periodo: zod_1.z.string(),
    dataInicio: zod_1.z.string().datetime(),
    dataFim: zod_1.z.string().datetime(),
    concluida: zod_1.z.boolean(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.goalsListResponseSchema = zod_1.z.array(exports.goalResponseSchema);
exports.notificationResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    usuarioId: zod_1.z.string().uuid(),
    titulo: zod_1.z.string(),
    mensagem: zod_1.z.string(),
    lida: zod_1.z.boolean(),
    dataEnvio: zod_1.z.string().datetime(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.notificationsListResponseSchema = zod_1.z.array(exports.notificationResponseSchema);
exports.reportResponseSchema = zod_1.z.object({
// TODO: Definir schema para relatórios
});
exports.weeklyMonthlyReportResponseSchema = zod_1.z.object({
// TODO: Definir schema para relatórios semanais/mensais
});
