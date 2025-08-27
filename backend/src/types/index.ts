// src/types/index.ts
import { Request } from 'express';

// Interface para requisições autenticadas
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Tipos para autenticação
export interface RegisterRequest {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface LoginRequest {
  email?: string;
  senha?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    nome: string;
    email: string;
    accountStatus: string;
  };
}

// Tipos para usuários
export interface User {
  id: string;
  nome: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para veículos
export interface Vehicle {
  id: string;
  idUsuario: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  tipo_uso: 'proprio' | 'alugado' | 'financiado';
  valor_aluguel?: number;
  valor_prestacao?: number;
  media_consumo?: number;
  data_cadastro: string;
  deletedAt?: string;
}

export interface CreateVehicleRequest {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel?: string;
  tipo_uso?: string;
  valor_aluguel?: number;
  valor_prestacao?: number;
}

export interface UpdateVehicleRequest {
  marca?: string;
  modelo?: string;
  ano?: number;
  placa?: string;
  cor?: string;
  quilometragemInicial?: number;
}

// Tipos para jornadas
export interface Journey {
  id: string;
  userId: string;
  vehicleId: string;
  data: Date;
  quilometragemInicio: number;
  quilometragemFim: number;
  origem: string;
  destino: string;
  finalidade: string;
  valorRecebido: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJourneyRequest {
  idVeiculo: string;
  dataInicio: string;
  kmInicio: number;
  dataFim?: string;
  kmFim?: number;
  ganhoBruto?: number;
  kmTotal?: number;
  tempoTotal?: number;
  observacoes?: string;
}

export interface UpdateJourneyRequest {
  idVeiculo?: string;
  dataInicio?: string;
  kmInicio?: number;
  dataFim?: string;
  kmFim?: number;
  ganhoBruto?: number;
  kmTotal?: number;
  tempoTotal?: number;
  observacoes?: string;
}

export interface JourneyFilters {
  status?: 'em_andamento' | 'concluida' | 'todas';
  dataInicio?: string;
  dataFim?: string;
  veiculoId?: string;
}

// Tipos para abastecimentos
export interface Fueling {
  id: string;
  userId: string;
  vehicleId: string;
  data: Date;
  quilometragem: number;
  quantidadeLitros: number;
  precoPorLitro: number;
  posto: string;
  tipoCombustivel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFuelingRequest {
  vehicleId: string;
  data: string;
  quilometragem: number;
  quantidadeLitros: number;
  precoPorLitro: number;
  posto: string;
  tipoCombustivel: string;
}

export interface UpdateFuelingRequest {
  vehicleId?: string;
  data?: string;
  quilometragem?: number;
  litros?: number;
  precoPorLitro?: number;
  posto?: string;
  tipoCombustivel?: string;
}

// Tipos para despesas
export interface Expense {
  id: string;
  userId: string;
  vehicleId: string;
  data: Date;
  valor: number;
  descricao: string;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseRequest {
  vehicleId: string;
  data: string;
  valor: number;
  descricao: string;
  categoria: string;
}

export interface UpdateExpenseRequest {
  vehicleId?: string;
  data?: string;
  valor?: number;
  descricao?: string;
  categoria?: string;
}

// Tipos para relatórios
export interface ReportSummary {
  totalJourneys: number;
  totalFuelings: number;
  totalExpenses: number;
  totalRevenue: number;
  totalFuelCost: number;
  totalExpenseCost: number;
  netProfit: number;
  averageFuelConsumption: number; // km/l
}

// Tipos para dashboard
export interface DashboardData {
  totalRevenueLast30Days: number;
  totalExpensesLast30Days: number;
  netProfitLast30Days: number;
  averageFuelConsumptionLast30Days: number;
  recentJourneys: Journey[];
  recentFuelings: Fueling[];
  recentExpenses: Expense[];
}

// Tipos para preços de combustível
export interface FuelPrice {
  id: string;
  userId: string;
  posto: string;
  tipoCombustivel: string;
  preco: number;
  dataRegistro: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFuelPriceRequest {
  posto: string;
  tipoCombustivel: string;
  preco: number;
}

export interface UpdateFuelPriceRequest {
  posto?: string;
  tipoCombustivel?: string;
  preco?: number;
}

// Tipos para analytics
export interface AnalyticsData {
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyExpenses: { month: string; expense: number }[];
  fuelConsumptionTrend: { month: string; consumption: number }[];
}

// Tipos para multi-veículo
export interface MultiVehicleSummary {
  vehicleId: string;
  placa: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

// Tipos para insights
export interface Insight {
  id: string;
  userId: string;
  type: string; // e.g., "economy", "efficiency", "maintenance"
  message: string;
  createdAt: Date;
}

// Tipos para notificações
export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Tipos para metas
export interface Goal {
  id: string;
  userId: string;
  descricao: string;
  valorAlvo: number;
  valorAtual: number;
  dataAlvo: Date;
  concluida: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalRequest {
  descricao: string;
  valorAlvo: number;
  dataAlvo: string;
}

export interface UpdateGoalRequest {
  descricao?: string;
  valorAlvo?: number;
  valorAtual?: number;
  dataAlvo?: string;
  concluida?: boolean;
}

// Tipos para gamificação/conquistas
export interface Achievement {
  id: string;
  userId: string;
  nome: string;
  descricao: string;
  dataConquista: Date;
  createdAt: Date;
}

// Tipos genéricos para paginação e respostas de API
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Tipos para requisições com filtros e paginação
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any; // Para filtros adicionais
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}




export interface FuelingFilters {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  fuelType?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}


