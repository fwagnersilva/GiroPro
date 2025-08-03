import api from './api';
import { ApiResponse } from '../types';

// Tipos para insights e recomendações
export interface Insight {
  tipo: 'eficiencia' | 'tendencia' | 'sazonalidade' | 'custos';
  titulo: string;
  descricao: string;
  detalhes: string;
  impacto: 'positivo' | 'neutro' | 'negativo';
}

export interface Recommendation {
  categoria: string;
  prioridade: 'alta' | 'media' | 'baixa';
  titulo: string;
  descricao: string;
  acoes: string[];
}

export interface EfficiencyMetric {
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
    tipo_combustivel: string;
  };
  metricas_operacionais: {
    total_jornadas: number;
    total_km: number;
    total_tempo_horas: number;
    total_abastecimentos: number;
    total_despesas: number;
  };
  metricas_financeiras: {
    faturamento_total: number;
    gasto_combustivel: number;
    outras_despesas: number;
    lucro_liquido: number;
    margem_lucro: number;
  };
  metricas_eficiencia: {
    consumo_medio: number;
    ganho_por_km: number;
    ganho_por_hora: number;
    custo_por_km: number;
    eficiencia_energetica: number;
    classificacao_eficiencia: 'Alta' | 'Média' | 'Baixa';
    classificacao_consumo: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  };
  indicadores_performance: {
    jornadas_por_dia: number;
    km_por_dia: number;
    faturamento_por_dia: number;
    tempo_medio_jornada: number;
  };
}

export interface TrendAnalysis {
  tendencias_semanais: {
    dados: Array<{
      periodo: string;
      faturamento: number;
      km: number;
      jornadas: number;
      tempo_horas: number;
    }>;
    analise_faturamento: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
    analise_km: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
    analise_jornadas: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
  };
  tendencias_mensais: {
    dados: Array<{
      periodo: string;
      faturamento: number;
      km: number;
      jornadas: number;
      tempo_horas: number;
    }>;
    analise_faturamento: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
    analise_km: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
    analise_jornadas: {
      tendencia: 'Crescente' | 'Estável' | 'Decrescente';
      variacao: number;
    };
  };
  periodo_analise: {
    data_inicio: string;
    data_fim: string;
    total_dias: number;
  };
}

export interface SeasonalityAnalysis {
  analise_dia_semana: Array<{
    dia_semana: string;
    dia_numero: number;
    faturamento_total: number;
    km_total: number;
    numero_jornadas: number;
    faturamento_medio: number;
  }>;
  analise_horario: Array<{
    hora: number;
    faturamento_total: number;
    km_total: number;
    numero_jornadas: number;
    faturamento_medio: number;
  }>;
  analise_mensal: Array<{
    mes: string;
    mes_numero: number;
    faturamento_total: number;
    km_total: number;
    numero_jornadas: number;
    faturamento_medio: number;
  }>;
  padroes_identificados: {
    melhor_dia_semana: {
      dia: string;
      faturamento_total: number;
      numero_jornadas: number;
    };
    melhor_horario: {
      hora: number;
      faturamento_total: number;
      numero_jornadas: number;
    };
    melhor_mes: {
      mes: string;
      faturamento_total: number;
      numero_jornadas: number;
    };
  };
}

export interface CostAnalysis {
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
    tipo_combustivel: string;
  };
  analise_combustivel: Array<{
    tipo: string;
    total_litros: number;
    total_gasto: number;
    numero_abastecimentos: number;
    valor_medio_litro: number;
    valor_min_litro: number;
    valor_max_litro: number;
    variacao_preco: number;
  }>;
  analise_despesas: Array<{
    categoria: string;
    total_valor: number;
    numero_despesas: number;
    valor_medio: number;
    valor_min: number;
    valor_max: number;
    percentual_total: number;
  }>;
  resumo_custos: {
    custo_total_operacional: number;
    gasto_combustivel: number;
    outras_despesas: number;
    custos_fixos: number;
    custos_variaveis: number;
    percentual_combustivel: number;
    percentual_despesas: number;
  };
  periodo: {
    data_inicio: string;
    data_fim: string;
    total_dias: number;
  };
}

export interface InsightsResponse {
  insights: Insight[];
  recommendations: Recommendation[];
  resumo_geral: {
    total_insights: number;
    total_recomendacoes: number;
    prioridade_alta: number;
    areas_atencao: string[];
  };
  metricas_eficiencia?: EfficiencyMetric[];
  analise_tendencias?: TrendAnalysis;
  analise_sazonalidade?: SeasonalityAnalysis;
  analise_custos?: CostAnalysis[];
  configuracao: {
    periodo_dias: number;
    data_inicio: string;
    data_fim: string;
    veiculo_especifico: string | null;
    analises_incluidas: {
      tendencias: boolean;
      sazonalidade: boolean;
      custos: boolean;
    };
  };
}

export interface InsightsSummaryResponse {
  insights: Insight[];
  recommendations: Recommendation[];
  resumo_geral: {
    total_insights: number;
    total_recomendacoes: number;
    prioridade_alta: number;
    areas_atencao: string[];
  };
  periodo: {
    data_inicio: string;
    data_fim: string;
    total_dias: number;
  };
}

// Serviços de insights
export const insightsService = {
  /**
   * Gerar insights completos
   */
  async generateInsights(params?: {
    id_veiculo?: string;
    periodo_dias?: number;
    incluir_tendencias?: boolean;
    incluir_sazonalidade?: boolean;
    incluir_custos?: boolean;
  }): Promise<InsightsResponse> {
    const response = await api.get<ApiResponse<InsightsResponse>>('/insights/generate', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao gerar insights');
  },

  /**
   * Obter resumo de insights
   */
  async getInsightsSummary(params?: {
    id_veiculo?: string;
    periodo_dias?: number;
  }): Promise<InsightsSummaryResponse> {
    const response = await api.get<ApiResponse<InsightsSummaryResponse>>('/insights/summary', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter resumo de insights');
  },

  /**
   * Obter métricas de eficiência
   */
  async getEfficiencyMetrics(params?: {
    id_veiculo?: string;
    periodo_dias?: number;
  }): Promise<{
    metricas_eficiencia: EfficiencyMetric[];
    periodo: {
      data_inicio: string;
      data_fim: string;
      total_dias: number;
    };
  }> {
    const response = await api.get<ApiResponse<any>>('/insights/efficiency', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter métricas de eficiência');
  },

  /**
   * Obter análise de tendências
   */
  async getTrends(params?: {
    id_veiculo?: string;
    periodo_dias?: number;
  }): Promise<TrendAnalysis> {
    const response = await api.get<ApiResponse<TrendAnalysis>>('/insights/trends', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter análise de tendências');
  },

  /**
   * Obter análise de sazonalidade
   */
  async getSeasonality(params?: {
    id_veiculo?: string;
  }): Promise<SeasonalityAnalysis> {
    const response = await api.get<ApiResponse<SeasonalityAnalysis>>('/insights/seasonality', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter análise de sazonalidade');
  },

  /**
   * Obter análise de custos
   */
  async getCostAnalysis(params?: {
    id_veiculo?: string;
    periodo_dias?: number;
  }): Promise<{
    analise_custos: CostAnalysis[];
    periodo: {
      data_inicio: string;
      data_fim: string;
      total_dias: number;
    };
  }> {
    const response = await api.get<ApiResponse<any>>('/insights/costs', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Erro ao obter análise de custos');
  },
};

