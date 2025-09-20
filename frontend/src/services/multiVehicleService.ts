import api from './api';
import { ApiResponse } from '../types';

// Tipos específicos para múltiplos veículos
export interface VehicleWithStats {
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
    tipo_combustivel: string;
    tipo_uso: string;
    data_cadastro: string;
    status: 'Ativo' | 'Pouco Ativo' | 'Inativo';
  };
  estatisticas_30_dias: {
    faturamento_total: number;
    km_total: number;
    gasto_combustivel: number;
    outras_despesas: number;
    lucro_liquido: number;
    margem_lucro: number;
    numero_jornadas: number;
    numero_abastecimentos: number;
    numero_despesas: number;
    consumo_medio: number;
    ganho_por_km: number;
    ultima_jornada: string | null;
    ultimo_abastecimento: string | null;
  };
}

export interface VehiclesWithStatsResponse {
  veiculos: VehicleWithStats[];
  total_veiculos: number;
  resumo_geral: {
    total_veiculos: number;
    veiculos_ativos: number;
    veiculos_pouco_ativos: number;
    veiculos_inativos: number;
    faturamento_total_geral: number;
    km_total_geral: number;
    gasto_combustivel_geral: number;
    veiculo_mais_produtivo: any;
    veiculo_mais_eficiente: any;
  };
  periodo_analise: string;
}

export interface QuickSummaryResponse {
  total_veiculos: number;
  veiculos_com_jornadas_hoje: number;
  faturamento_total_hoje: number;
  km_total_hoje: number;
  numero_jornadas_hoje: number;
  data_referencia: string;
}

export interface VehicleUsageHistory {
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
  };
  historico_diario: Array<{
    data: string;
    jornadas: number;
    faturamento: number;
    km: number;
    tempo: number;
    abastecimentos: number;
    litros: number;
    gasto_combustivel: number;
  }>;
  periodo: {
    data_inicio: string;
    data_fim: string;
    total_dias: number;
  };
}

// Serviços de múltiplos veículos
export const multiVehicleService = {
  /**
   * Buscar todos os veículos com estatísticas
   */
  async getVehiclesWithStats(params?: {
    ids_veiculos?: string[];
    incluir_inativos?: boolean;
    ordenar_por?: 'marca' | 'modelo' | 'ano' | 'data_cadastro';
    ordem?: 'asc' | 'desc';
  }): Promise<VehiclesWithStatsResponse> {
    const response = await api.get<ApiResponse<VehiclesWithStatsResponse>>('/multi-vehicle/vehicles-with-stats', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar veículos com estatísticas');
  },

  /**
   * Definir veículo ativo/padrão
   */
  async setActiveVehicle(id_veiculo: string): Promise<{
    veiculo_ativo: {
      id: string;
      marca: string;
      modelo: string;
      placa: string;
    };
    message: string;
  }> {
    const response = await api.post<ApiResponse<any>>('/multi-vehicle/set-active-vehicle', { id_veiculo });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao definir veículo ativo');
  },

  /**
   * Obter resumo rápido de todos os veículos
   */
  async getQuickSummary(): Promise<QuickSummaryResponse> {
    const response = await api.get<ApiResponse<QuickSummaryResponse>>('/multi-vehicle/quick-summary');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar resumo rápido');
  },

  /**
   * Obter histórico de uso de um veículo específico
   */
  async getVehicleUsageHistory(id_veiculo: string): Promise<VehicleUsageHistory> {
    const response = await api.get<ApiResponse<VehicleUsageHistory>>(`/multi-vehicle/vehicle-usage/${id_veiculo}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar histórico de uso do veículo');
  },
};

// Tipos para análises avançadas
export interface ConsumptionAnalysis {
  analise_consumo: Array<{
    veiculo: {
      id: string;
      marca: string;
      modelo: string;
      ano: number;
      placa: string;
      tipo_combustivel: string;
    };
    metricas_periodo: {
      total_litros: number;
      total_km: number;
      total_gasto_combustivel: number;
      consumo_medio: number;
      custo_medio_por_km: number;
      custo_medio_por_litro: number;
      numero_abastecimentos: number;
      numero_jornadas: number;
    };
    historico_eficiencia: Array<{
      data_abastecimento: string;
      quantidade_litros: number;
      valor_total: number;
      km_atual: number;
      consumo_periodo: number | null;
      km_percorridos: number;
      eficiencia: 'Eficiente' | 'Ineficiente' | null;
    }>;
    periodo: {
      data_inicio: string;
      data_fim: string;
      descricao: string;
    };
  }>;
  resumo_geral: any;
  periodo: {
    data_inicio: string;
    data_fim: string;
    descricao: string;
  };
}

export interface ProductivityAnalysis {
  analise_produtividade: Array<{
    veiculo: {
      id: string;
      marca: string;
      modelo: string;
      placa: string;
    };
    metricas_totais: {
      faturamento_total: number;
      km_total: number;
      tempo_total_minutos: number;
      tempo_total_horas: number;
      numero_jornadas: number;
    };
    metricas_medias: {
      ganho_medio_jornada: number;
      km_medio_jornada: number;
      tempo_medio_jornada_minutos: number;
      tempo_medio_jornada_horas: number;
    };
    produtividade: {
      ganho_por_km: number;
      ganho_por_hora: number;
      km_por_hora: number;
      classificacao_eficiencia: 'Alta' | 'Média' | 'Baixa';
    };
  }>;
  rankings: {
    ganho_por_km: Array<{
      posicao: number;
      veiculo: any;
      ganho_por_km: number;
    }>;
    ganho_por_hora: Array<{
      posicao: number;
      veiculo: any;
      ganho_por_hora: number;
    }>;
  };
  periodo: {
    data_inicio: string;
    data_fim: string;
    descricao: string;
  };
}

export interface TemporalPatterns {
  analise_por_dia_semana: Array<{
    dia_semana: string;
    numero_jornadas: number;
    faturamento_total: number;
    km_total: number;
    tempo_total: number;
    faturamento_medio: number;
    km_medio: number;
    tempo_medio: number;
  }>;
  analise_por_horario: Array<{
    hora: number;
    numero_jornadas: number;
    faturamento_total: number;
    km_total: number;
    tempo_total: number;
    faturamento_medio: number;
    km_medio: number;
    tempo_medio: number;
  }>;
  padroes_identificados: {
    melhor_dia_semana: any;
    melhor_horario: any;
    horarios_mais_produtivos: any[];
  };
  recomendacoes: string[];
  periodo: {
    data_inicio: string;
    data_fim: string;
    descricao: string;
  };
}

export interface VehicleComparison {
  comparacao_veiculos: Array<{
    veiculo: {
      id: string;
      marca: string;
      modelo: string;
      ano: number;
      placa: string;
      tipo_combustivel: string;
      tipo_uso: string;
    };
    metricas_financeiras: {
      faturamento_total: number;
      gasto_combustivel: number;
      outras_despesas: number;
      lucro_liquido: number;
      margem_lucro: number;
    };
    metricas_operacionais: {
      km_total: number;
      numero_jornadas: number;
      numero_abastecimentos: number;
      numero_despesas: number;
      ganho_medio_jornada: number;
      km_medio_jornada: number;
    };
    metricas_eficiencia: {
      consumo_medio: number;
      ganho_por_km: number;
      custo_por_km: number;
      valor_medio_litro: number;
    };
  }>;
  rankings: {
    melhor_faturamento: any[];
    melhor_lucro: any[];
    melhor_margem: any[];
    melhor_consumo: any[];
    melhor_ganho_por_km: any[];
  };
  resumo_comparativo: any;
  periodo: {
    data_inicio: string;
    data_fim: string;
    descricao: string;
  };
}

// Serviços de análises avançadas
export const advancedAnalyticsService = {
  /**
   * Análise de consumo por veículo
   */
  async getConsumptionAnalysis(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    periodo?: '7d' | '30d' | '90d' | '1y';
    incluir_comparacao?: boolean;
  }): Promise<ConsumptionAnalysis> {
    const response = await api.get<ApiResponse<ConsumptionAnalysis>>('/analytics/consumption', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar análise de consumo');
  },

  /**
   * Análise de produtividade por veículo
   */
  async getProductivityAnalysis(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    periodo?: '7d' | '30d' | '90d' | '1y';
    incluir_comparacao?: boolean;
  }): Promise<ProductivityAnalysis> {
    const response = await api.get<ApiResponse<ProductivityAnalysis>>('/analytics/productivity', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar análise de produtividade');
  },

  /**
   * Identificação de padrões temporais
   */
  async getTemporalPatterns(params?: {
    data_inicio?: string;
    data_fim?: string;
    id_veiculo?: string;
    periodo?: '7d' | '30d' | '90d' | '1y';
    incluir_comparacao?: boolean;
  }): Promise<TemporalPatterns> {
    const response = await api.get<ApiResponse<TemporalPatterns>>('/analytics/patterns', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar padrões temporais');
  },

  /**
   * Comparação entre veículos
   */
  async getVehicleComparison(params?: {
    data_inicio?: string;
    data_fim?: string;
    periodo?: '7d' | '30d' | '90d' | '1y';
  }): Promise<VehicleComparison> {
    const response = await api.get<ApiResponse<VehicleComparison>>('/analytics/vehicle-comparison', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao buscar comparação entre veículos');
  },
};

