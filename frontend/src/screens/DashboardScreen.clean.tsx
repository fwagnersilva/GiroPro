import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/Icon';
import Alert from '../utils/alert';
import { platformStyles, platformValue } from '../utils/platform';

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

// Mock data for demonstration (similar to DashboardScreen.web.tsx)
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

const getPeriodLabel = (period: string): string => {
  const labels: { [key: string]: string } = {
    'hoje': 'Hoje',
    'semana': 'Esta Semana',
    'mes': 'Este Mês',
    'ano': 'Este Ano'
  };
  return labels[period] || period;
};

const DashboardScreenClean: React.FC = ({ navigation }: any) => {
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
      // Simulate API call or fetch from backend
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: async () => await signOut() },
      ]
    );
  }, [signOut]);

  if (loading && !dashboardData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Erro ao carregar dados</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.nome || 'Motorista'} 👋</Text>
        <Text style={styles.subtitle}>Aqui está o resumo da sua performance financeira</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}>
              {getPeriodLabel(period)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="trending-up-outline" size={20} color="#34C759" />
            <Text style={styles.cardLabel}>Faturamento Bruto</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.metricas_principais.faturamento_bruto)}
          </Text>
          <Text style={styles.cardSubtext}>+12% vs período anterior</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="trending-down-outline" size={20} color="#FF3B30" />
            <Text style={styles.cardLabel}>Total de Despesas</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.metricas_principais.total_despesas)}
          </Text>
          <Text style={styles.cardSubtext}>-5% vs período anterior</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="cash-outline" size={20} color="#007AFF" />
            <Text style={styles.cardLabel}>Lucro Líquido</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.metricas_principais.lucro_liquido)}
          </Text>
          <Text style={styles.cardSubtext}>
            Margem: {dashboardData.metricas_principais.margem_lucro.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="time-outline" size={20} color="#FF9500" />
            <Text style={styles.cardLabel}>Ganho por Hora</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora)}
          </Text>
          <Text style={styles.cardSubtext}>
            {formatTime(dashboardData.metricas_operacionais.tempo_total_trabalhado_minutos)} trabalhadas
          </Text>
        </View>
      </View>

      {/* Operational Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="speedometer-outline" size={20} color="#8E8E93" />
            <Text style={styles.cardLabel}>KM Rodados</Text>
          </View>
          <Text style={styles.cardValue}>
            {dashboardData.metricas_operacionais.km_total.toLocaleString()} km
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.cardHeader}>
            <Icon name="person-outline" size={20} color="#8E8E93" />
            <Text style={styles.cardLabel}>Número de Viagens</Text>
          </View>
          <Text style={styles.cardValue}>
            {dashboardData.metricas_operacionais.numero_jornadas}
          </Text>
        </View>
      </View>

      {/* Expense Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribuição de Despesas</Text>
        {dashboardData.distribuicao_despesas.map((expense, index) => (
          <View key={index} style={styles.expenseItem}>
            <Text style={styles.expenseCategory}>{expense.categoria}</Text>
            <Text style={styles.expenseValue}>
              {formatCurrency(expense.valor)}
            </Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Em breve', 'Funcionalidade de Nova Despesa em desenvolvimento')}>
          <Icon name="add-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Nova Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Em breve', 'Funcionalidade de Novo Abastecimento em desenvolvimento')}>
          <Icon name="car-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Novo Abastecimento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={() => Alert.alert('Em breve', 'Funcionalidade de Relatórios em desenvolvimento')}>
          <Icon name="analytics-outline" size={20} color="#007AFF" />
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Ver Relatórios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={handleLogout}>
          <Icon name="close-outline" size={20} color="#007AFF" />
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 24,
    ...platformStyles({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: platformValue({ web: '400px', default: 400 }),
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
    ...platformStyles({
      web: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    ...platformStyles({
      web: {
        gap: 12,
      },
    }),
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...platformStyles({
      web: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      },
    }),
  },
  metricCard: {
    width: '48%', // For mobile layout
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16, // For mobile layout
    ...platformStyles({
      web: {
        width: 'auto', // Override for web grid
        marginBottom: 0,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    boxShadow: platformValue({ web: '0 2px 4px rgba(0, 0, 0, 0.1)', default: 'none' }),
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  expenseCategory: {
    fontSize: 16,
    color: '#000000',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 150, // Ensure buttons don't get too small
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
  },
});

export default DashboardScreenClean;

