import { z } from 'zod';

export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  details: z.array(z.object({ message: z.string() })).optional(),
});

export const vehicleResponseSchema = z.object({
  id: z.string().uuid(),
  marca: z.string(),
  modelo: z.string(),
  ano: z.number(),
  placa: z.string(),
  cor: z.string(),
  tipoCombustivel: z.string(),
  capacidadeTanque: z.number(),
  consumoMedio: z.number(),
  quilometragemAtual: z.number(),
  usuarioId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const vehiclesListResponseSchema = z.array(vehicleResponseSchema);

export const journeyResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  veiculoId: z.string().uuid(),
  data: z.string().datetime(),
  quilometragemInicial: z.number(),
  quilometragemFinal: z.number(),
  distanciaPercorrida: z.number(),
  tipo: z.string(),
  finalidade: z.string(),
  observacoes: z.string().nullable(),
  custoTotal: z.number(),
  mediaConsumo: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const journeysListResponseSchema = z.array(journeyResponseSchema);

export const journeyStatsResponseSchema = z.object({
  totalJourneys: z.number(),
  totalDistance: z.number(),
  totalCost: z.number(),
  averageConsumption: z.number(),
});

export const fuelingResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  veiculoId: z.string().uuid(),
  data: z.string().datetime(),
  quilometragem: z.number(),
  quantidadeLitros: z.number(),
  precoPorLitro: z.number(),
  valorTotal: z.number(),
  tipoCombustivel: z.string(),
  postoCombustivel: z.string().nullable(),
  observacoes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const fuelingsListResponseSchema = z.array(fuelingResponseSchema);

export const expenseResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  veiculoId: z.string().uuid(),
  data: z.string().datetime(),
  tipo: z.string(),
  descricao: z.string(),
  valor: z.number(),
  observacoes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const expensesListResponseSchema = z.array(expenseResponseSchema);

export const fuelPriceResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  tipoCombustivel: z.string(),
  precoPorLitro: z.number(),
  dataAtualizacao: z.string().datetime(),
  postoCombustivel: z.string().nullable(),
  localizacao: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const fuelPricesListResponseSchema = z.array(fuelPriceResponseSchema);

export const dashboardStatsResponseSchema = z.object({
  totalVeiculos: z.number(),
  totalDespesas: z.number(),
  totalAbastecimentos: z.number(),
  totalPercursos: z.number(),
  quilometragemTotal: z.number(),
  gastoTotalCombustivel: z.number(),
  mediaConsumoGeral: z.number(),
});

export const advancedAnalyticsResponseSchema = z.object({
  // TODO: Definir schema para análises avançadas
});

export const gamificationResponseSchema = z.object({
  // TODO: Definir schema para gamificação
});

export const goalResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  tipo: z.string(),
  meta: z.number(),
  progresso: z.number(),
  unidade: z.string(),
  periodo: z.string(),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  concluida: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const goalsListResponseSchema = z.array(goalResponseSchema);

export const notificationResponseSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  titulo: z.string(),
  mensagem: z.string(),
  lida: z.boolean(),
  dataEnvio: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const notificationsListResponseSchema = z.array(notificationResponseSchema);

export const reportResponseSchema = z.object({
  // TODO: Definir schema para relatórios
});

export const weeklyMonthlyReportResponseSchema = z.object({
  // TODO: Definir schema para relatórios semanais/mensais
});


