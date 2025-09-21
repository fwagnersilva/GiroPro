import AsyncStorage from '../utils/AsyncStorage.web';

interface DashboardData {
  periodo: {
    tipo: string;
    data_inicio: string;
    data_fim: string;
  };
  metricas_principais: {
    faturamento_bruto: number;
    total_despesas: number;
    lucro_liquido: number;
    margem_lucro: number;
  };
  metricas_operacionais: {
    km_total: number;
    custo_por_km: number;
    numero_jornadas: number;
    ganho_medio_por_jornada: number;
    tempo_total_trabalhado_minutos: number;
    ganho_por_hora: number;
  };
  distribuicao_despesas: Array<{
    categoria: string;
    valor: number;
  }>;
}

export const fetchDashboardSummary = async (periodo: 'hoje' | 'semana' | 'mes' | 'ano' = 'mes'): Promise<DashboardData> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    
    const response = await fetch(`http://localhost:3000/api/v1/dashboard/summary?periodo=${periodo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Erro ao carregar dados do dashboard');
    }

    return result.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
};

export const dashboardService = {
  fetchSummary: fetchDashboardSummary,
};
