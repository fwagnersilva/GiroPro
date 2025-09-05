import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

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

const webStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F2F2F7',
    padding: '24px',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '8px',
  },
  headerSubtitle: {
    fontSize: '18px',
    color: '#8E8E93',
  },
  periodSelector: {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    marginTop: '16px',
  },
  periodButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #E5E5EA',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#000000',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    borderColor: '#007AFF',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  metricTitle: {
    fontSize: '16px',
    color: '#8E8E93',
    marginBottom: '8px',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '4px',
  },
  metricChange: {
    fontSize: '14px',
    color: '#34C759',
  },
  metricChangeNegative: {
    color: '#FF3B30',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '16px',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #F2F2F7',
  },
  expenseCategory: {
    fontSize: '16px',
    color: '#000000',
  },
  expenseValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#8E8E93',
    marginTop: '16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    color: '#007AFF',
    border: '2px solid #007AFF',
  },
};

// Mock data for demonstration
const mockDashboardData: DashboardData = {
  periodo: {
    tipo: 'mes',
    data_inicio: '2025-09-01',
    data_fim: '2025-09-30',
  },
  metricas_principais: {
    faturamento_bruto: 450000, // R$ 4.500,00 em centavos
    total_despesas: 180000,    // R$ 1.800,00 em centavos
    lucro_liquido: 270000,     // R$ 2.700,00 em centavos
    margem_lucro: 60,          // 60%
  },
  metricas_operacionais: {
    km_total: 1250,
    custo_por_km: 144,         // R$ 1,44 em centavos
    numero_jornadas: 85,
    ganho_medio_por_jornada: 5294, // R$ 52,94 em centavos
    tempo_total_trabalhado_minutos: 6000, // 100 horas
    ganho_por_hora: 4500,      // R$ 45,00 em centavos
  },
  distribuicao_despesas: [
    { categoria: 'Combustível', valor: 120000 },
    { categoria: 'Manutenção', valor: 35000 },
    { categoria: 'Alimentação', valor: 15000 },
    { categoria: 'Outros', valor: 10000 },
  ],
};

const formatCurrency = (centavos: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
};

const formatTime = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  return `${horas}h`;
};

const DashboardScreenWeb: React.FC = () => {
  const { user, signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await signOut();
    }
  };

  if (loading) {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.loadingContainer}>
          <div>Carregando dashboard...</div>
          <div style={webStyles.loadingText}>Aguarde um momento</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.loadingContainer}>
          <div>Erro ao carregar dados</div>
        </div>
      </div>
    );
  }

  return (
    <div style={webStyles.container}>
      {/* Header */}
      <div style={webStyles.header}>
        <h1 style={webStyles.headerTitle}>
          Olá, {user?.nome || 'Motorista'}! 👋
        </h1>
        <p style={webStyles.headerSubtitle}>
          Aqui está o resumo da sua performance financeira
        </p>
        
        {/* Period Selector */}
        <div style={webStyles.periodSelector}>
          {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
            <button
              key={period}
              style={{
                ...webStyles.periodButton,
                ...(selectedPeriod === period && webStyles.periodButtonActive),
              }}
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div style={webStyles.metricsGrid}>
        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Faturamento Bruto</div>
          <div style={webStyles.metricValue}>
            {formatCurrency(dashboardData.metricas_principais.faturamento_bruto)}
          </div>
          <div style={webStyles.metricChange}>+12% vs período anterior</div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Total de Despesas</div>
          <div style={webStyles.metricValue}>
            {formatCurrency(dashboardData.metricas_principais.total_despesas)}
          </div>
          <div style={webStyles.metricChange}>-5% vs período anterior</div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Lucro Líquido</div>
          <div style={webStyles.metricValue}>
            {formatCurrency(dashboardData.metricas_principais.lucro_liquido)}
          </div>
          <div style={webStyles.metricChange}>+18% vs período anterior</div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Margem de Lucro</div>
          <div style={webStyles.metricValue}>
            {dashboardData.metricas_principais.margem_lucro}%
          </div>
          <div style={webStyles.metricChange}>+3% vs período anterior</div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div style={webStyles.metricsGrid}>
        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Quilometragem Total</div>
          <div style={webStyles.metricValue}>
            {dashboardData.metricas_operacionais.km_total.toLocaleString()} km
          </div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Ganho por Hora</div>
          <div style={webStyles.metricValue}>
            {formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora)}
          </div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Número de Viagens</div>
          <div style={webStyles.metricValue}>
            {dashboardData.metricas_operacionais.numero_jornadas}
          </div>
        </div>

        <div style={webStyles.metricCard}>
          <div style={webStyles.metricTitle}>Tempo Trabalhado</div>
          <div style={webStyles.metricValue}>
            {formatTime(dashboardData.metricas_operacionais.tempo_total_trabalhado_minutos)}
          </div>
        </div>
      </div>

      {/* Expense Distribution */}
      <div style={webStyles.chartContainer}>
        <h2 style={webStyles.chartTitle}>Distribuição de Despesas</h2>
        {dashboardData.distribuicao_despesas.map((expense, index) => (
          <div key={index} style={webStyles.expenseItem}>
            <span style={webStyles.expenseCategory}>{expense.categoria}</span>
            <span style={webStyles.expenseValue}>
              {formatCurrency(expense.valor)}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={webStyles.actionButtons}>
        <button style={webStyles.actionButton}>
          ➕ Nova Despesa
        </button>
        <button style={webStyles.actionButton}>
          ⛽ Novo Abastecimento
        </button>
        <button style={{...webStyles.actionButton, ...webStyles.actionButtonSecondary}}>
          📊 Ver Relatórios
        </button>
        <button 
          style={{...webStyles.actionButton, ...webStyles.actionButtonSecondary}}
          onClick={handleLogout}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
};

export default DashboardScreenWeb;

