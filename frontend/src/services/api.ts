import axios from 'axios';
import AsyncStorage from '../utils/AsyncStorage.web';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  Vehicle,
  Journey,
  Fueling,
  Expense,
  DashboardData,
  ApiResponse 
} from '../types';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    console.error("Response Error:", error.response || error);
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      // Opcional: Redirecionar para a tela de login
    }
    // Centraliza a extração da mensagem de erro
    const errorMessage = error.response?.data?.error?.message || error.message || "Ocorreu um erro inesperado.";
    return Promise.reject(new Error(errorMessage));
  }
);

// Serviços de autenticação
export const authService = {
  async login(credentials: LoginRequest, rememberMe: boolean = false): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      // Armazenar token com configuração de persistência baseada em "Lembrar-me"
      if (rememberMe) {
        // Para "Lembrar-me", usar localStorage (persistente)
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        await AsyncStorage.setItem('rememberMe', 'true');
        
        // Armazenar refresh token para sessões estendidas
        if (response.data.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
      } else {
        // Para sessão normal, usar sessionStorage (temporário)
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('refreshToken');
      }
      return response.data.data;
    }
    throw new Error('Erro no login'); },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    if (response.data.success && response.data.data) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      return response.data.data;
    }
    throw new Error('Erro no cadastro');  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('rememberMe');
    await AsyncStorage.removeItem('refreshToken');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await api.post<ApiResponse<void>>('/auth/request-password-reset', { email });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao solicitar recuperação de senha');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao redefinir senha');
    }
  },
};

// Serviços de veículos
export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await api.get<ApiResponse<Vehicle[]>>('/vehicles');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar veículos');
  },

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles', vehicleData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao criar veículo');
  },

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, vehicleData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao atualizar veículo');
  },

  async deleteVehicle(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/vehicles/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao excluir veículo');
    }
  },
};

// Serviços de jornadas
export const journeyService = {
  async getJourneys(): Promise<Journey[]> {
    const response = await api.get<ApiResponse<Journey[]>>('/journeys');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar jornadas');
  },

  async startJourney(journeyData: { id_veiculo: string; km_inicio: number; observacoes?: string }): Promise<Journey> {
    const response = await api.post<ApiResponse<Journey>>('/journeys/start', journeyData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao iniciar jornada');
  },

  async endJourney(id: string, endData: { km_fim: number; ganho_bruto: number }): Promise<Journey> {
    const response = await api.put<ApiResponse<Journey>>(`/journeys/${id}/end`, endData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao finalizar jornada');
  },

  async getActiveJourney(): Promise<Journey | null> {
    const response = await api.get<ApiResponse<Journey>>('/journeys/active');
    if (response.data.success) {
      return response.data.data || null;
    }
    return null;
  },
};

// Serviços de abastecimentos
export const fuelingService = {
  async getFuelings(params?: {
    page?: number;
    limit?: number;
    id_veiculo?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<{ data: Fueling[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ data: Fueling[]; pagination: any }>>('/fuelings', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar abastecimentos');
  },

  async createFueling(fuelingData: {
    id_veiculo: string;
    data_abastecimento: string;
    tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
    quantidade_litros: number;
    valor_litro: number;
    km_atual?: number;
    nome_posto?: string;
  }): Promise<Fueling> {
    const response = await api.post<ApiResponse<Fueling>>('/fuelings', fuelingData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao registrar abastecimento');
  },

  async getFuelingById(id: string): Promise<Fueling> {
    const response = await api.get<ApiResponse<Fueling>>(`/fuelings/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar abastecimento');
  },

  async updateFueling(id: string, fuelingData: Partial<{
    id_veiculo: string;
    data_abastecimento: string;
    tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
    quantidade_litros: number;
    valor_litro: number;
    km_atual?: number;
    nome_posto?: string;
  }>): Promise<Fueling> {
    const response = await api.put<ApiResponse<Fueling>>(`/fuelings/${id}`, fuelingData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao atualizar abastecimento');
  },

  async deleteFueling(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/fuelings/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao excluir abastecimento');
    }
  },
};

// Serviços de despesas
export const expenseService = {
  async getExpenses(params?: {
    page?: number;
    limit?: number;
    id_veiculo?: string;
    tipo_despesa?: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
    data_inicio?: string;
    data_fim?: string;
  }): Promise<{ data: Expense[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ data: Expense[]; pagination: any }>>('/expenses', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar despesas');
  },

  async createExpense(expenseData: {
    id_veiculo?: string;
    data_despesa: string;
    tipo_despesa: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
    valor_despesa: number;
    descricao?: string;
  }): Promise<Expense> {
    const response = await api.post<ApiResponse<Expense>>('/expenses', expenseData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao registrar despesa');
  },

  async getExpenseById(id: string): Promise<Expense> {
    const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar despesa');
  },

  async getExpensesByCategory(params?: {
    data_inicio?: string;
    data_fim?: string;
  }): Promise<Array<{
    tipo_despesa: string;
    total_valor: number;
    quantidade: number;
  }>> {
    const response = await api.get<ApiResponse<Array<{
      tipo_despesa: string;
      total_valor: number;
      quantidade: number;
    }>>>('/expenses/by-category', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar despesas por categoria');
  },

  async updateExpense(id: string, expenseData: Partial<{
    id_veiculo?: string;
    data_despesa: string;
    tipo_despesa: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
    valor_despesa: number;
    descricao?: string;
  }>): Promise<Expense> {
    const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, expenseData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao atualizar despesa');
  },

  async deleteExpense(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/expenses/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Erro ao excluir despesa');
    }
  },
};

// Serviços de preços de combustível
export const fuelPricesService = {
  async getPrices(params?: {
    estado?: string;
    cidade?: string;
    tipo_combustivel?: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
  }): Promise<{
    precos: Array<{
      tipo_combustivel: string;
      preco_medio: number;
      preco_minimo: number;
      preco_maximo: number;
      estado: string;
      cidade: string;
      numero_postos: number;
      data_coleta: string;
    }>;
    filtros: any;
    ultima_atualizacao: string;
    fonte: string;
  }> {
    const response = await api.get<ApiResponse<any>>('/fuel-prices', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar preços de combustível');
  },

  async getPriceHistory(params: {
    estado: string;
    cidade: string;
    tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
    periodo_dias?: number;
  }): Promise<{
    historico: Array<{
      data: string;
      preco: number;
      fonte: string;
    }>;
    parametros: any;
    estatisticas: {
      preco_minimo: number;
      preco_maximo: number;
      preco_medio: number;
      variacao_percentual: number;
    };
  }> {
    const response = await api.get<ApiResponse<any>>('/fuel-prices/history', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar histórico de preços');
  },

  async getRegionalComparison(params?: {
    tipo_combustivel?: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
    estados?: string;
  }): Promise<{
    tipo_combustivel: string;
    comparativo: Array<{
      estado: string;
      preco_medio: number;
      variacao_semanal: number;
      numero_postos: number;
      ultima_atualizacao: string;
    }>;
    estatisticas: {
      menor_preco: any;
      maior_preco: any;
      diferenca_maxima: number;
    };
  }> {
    const response = await api.get<ApiResponse<any>>('/fuel-prices/comparison', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar comparativo regional');
  },

  async reportPrice(priceData: {
    estado: string;
    cidade: string;
    tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
    preco_medio: number;
    data_coleta: string;
    fonte?: string;
  }): Promise<any> {
    const response = await api.post<ApiResponse<any>>('/fuel-prices/report', priceData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao reportar preço');
  },
};

// Serviços do dashboard
export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar dados do dashboard');
  },

  async getSummary(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/dashboard/summary', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar resumo do dashboard');
  },
};

export default api;
export { api };

// Alias para compatibilidade
export const userService = authService;


// Serviços de relatórios
export const reportService = {
  async getJourneyEarningsReport(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    formato?: 'json' | 'csv';
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/journey-earnings', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar relatório de jornadas');
  },

  async getExpenseAnalysisReport(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    formato?: 'json' | 'csv';
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/expense-analysis', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar relatório de despesas');
  },

  async getFuelConsumptionReport(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    formato?: 'json' | 'csv';
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/fuel-consumption', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar relatório de combustível');
  },

  async downloadJourneyEarningsCSV(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<Blob> {
    const response = await api.get('/reports/journey-earnings', { 
      params: { ...params, formato: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  async downloadExpenseAnalysisCSV(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<Blob> {
    const response = await api.get('/reports/expense-analysis', { 
      params: { ...params, formato: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  async downloadFuelConsumptionCSV(params?: {
    periodo?: 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<Blob> {
    const response = await api.get('/reports/fuel-consumption', { 
      params: { ...params, formato: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  // Novos relatórios semanais e mensais
  async getWeeklyReport(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    formato?: 'json' | 'csv';
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/weekly', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar relatório semanal');
  },

  async getMonthlyReport(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    formato?: 'json' | 'csv';
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/monthly', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar relatório mensal');
  },

  async getWeeklyComparison(params?: {
    id_veiculo?: string;
    numero_semanas?: number;
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/weekly-comparison', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar comparativo semanal');
  },

  async getMonthlyComparison(params?: {
    id_veiculo?: string;
    numero_meses?: number;
  }): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/reports/monthly-comparison', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar comparativo mensal');
  },

  async downloadWeeklyReportCSV(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<Blob> {
    const response = await api.get('/reports/weekly', { 
      params: { ...params, formato: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  async downloadMonthlyReportCSV(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
  }): Promise<Blob> {
    const response = await api.get('/reports/monthly', { 
      params: { ...params, formato: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },
};



  async createJourney(journeyData: { idVeiculo: string; dataInicio: string; kmInicio: number; observacoes?: string }): Promise<Journey> {
    const response = await api.post<ApiResponse<Journey>>("/journeys", journeyData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || "Erro ao criar jornada");
  },

  async getJourneyById(id: string): Promise<Journey> {
    const response = await api.get<ApiResponse<Journey>>(`/journeys/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || "Erro ao buscar jornada");
  },

  async updateJourney(id: string, journeyData: Partial<{ dataFim: string; kmFim: number; ganhoBruto: number; observacoes?: string }>): Promise<Journey> {
    const response = await api.put<ApiResponse<Journey>>(`/journeys/${id}`, journeyData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || "Erro ao atualizar jornada");
  },

  async deleteJourney(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/journeys/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "Erro ao excluir jornada");
    }
  },


