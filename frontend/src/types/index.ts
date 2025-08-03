// Tipos para autenticação
export interface User {
  id: string;
  nome: string;
  email: string;
  status_conta: 'Ativo' | 'Inativo' | 'Suspenso';
  data_cadastro: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

// Tipos para veículos
export interface Vehicle {
  id: string;
  id_usuario: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
  tipo_uso: 'Proprio' | 'Alugado' | 'Financiado';
  valor_aluguel?: number;
  valor_prestacao?: number;
  media_consumo?: number;
  data_cadastro: string;
}

// Tipos para jornadas
export interface Journey {
  id: string;
  id_usuario: string;
  id_veiculo: string;
  data_inicio: string;
  km_inicio: number;
  data_fim?: string;
  km_fim?: number;
  ganho_bruto?: number;
  km_total?: number;
  tempo_total?: number;
  observacoes?: string;
}

// Tipos para abastecimentos
export interface Fueling {
  id: string;
  id_usuario: string;
  id_veiculo: string;
  data_abastecimento: string;
  tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
  quantidade_litros: number;
  valor_litro: number;
  valor_total: number;
  km_atual?: number;
  nome_posto?: string;
}

// Tipos para despesas
export interface Expense {
  id: string;
  id_usuario: string;
  id_veiculo?: string;
  data_despesa: string;
  tipo_despesa: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
  valor_despesa: number;
  descricao?: string;
}

// Tipos para dashboard
export interface DashboardData {
  resumoFinanceiro: {
    ganhoTotalMes: number;
    gastoTotalMes: number;
    lucroLiquidoMes: number;
    ganhoPorHora: number;
  };
  estatisticasVeiculo: {
    kmTotalMes: number;
    consumoMedio: number;
    custoPorKm: number;
    litrosConsumidosMes: number;
  };
  jornadasRecentes: Journey[];
}

// Tipos para navegação
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Vehicles: undefined;
  AddVehicle: undefined;
  Journeys: undefined;
  StartJourney: undefined;
  Fuelings: undefined;
  AddFueling: undefined;
  Expenses: undefined;
  AddExpense: undefined;
  Profile: undefined;
};

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

