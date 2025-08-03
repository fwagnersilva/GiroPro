import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { DashboardCardSkeleton } from '../components/SkeletonLoader';
import LoadingSpinner from '../components/LoadingSpinner';
import { journeyService, vehicleService } from '../services/api';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

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

const DashboardScreenOptimized: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [activeJourney, setActiveJourney] = useState<any>(null);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);

  const getAuthToken = useCallback(async () => {
    // Implementar busca do token do AsyncStorage
    // Por enquanto, usar um token mock para testes
    return 'mock_token_for_testing';
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`http://localhost:3000/api/v1/dashboard/summary?periodo=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error?.message || 'Erro ao carregar dados');
        }
      } else {
        throw new Error('Erro na requisição');
      }
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      if (isWeb()) {
        alert('Não foi possível carregar os dados do dashboard');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod, getAuthToken]);

  useEffect(() => {
    loadDashboardData();
    checkActiveJourney();
  }, [selectedPeriod, loadDashboardData]);

  const checkActiveJourney = useCallback(async () => {
    try {
      const journey = await journeyService.getActiveJourney();
      setActiveJourney(journey);
    } catch (error) {
      console.error('Erro ao verificar jornada ativa:', error);
    }
  }, []);

  const handleStartJourney = useCallback(async () => {
    try {
      setQuickActionLoading('startJourney');
      
      const vehicles = await vehicleService.getVehicles();
      if (vehicles.length === 0) {
        if (isWeb()) {
          alert('Você precisa cadastrar um veículo antes de iniciar uma jornada.');
        } else {
          Alert.alert(
            'Nenhum Veículo',
            'Você precisa cadastrar um veículo antes de iniciar uma jornada.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Cadastrar', onPress: () => navigation.navigate('Vehicles') }
            ]
          );
        }
        return;
      }

      if (vehicles.length === 1) {
        const vehicle = vehicles[0];
        const kmInicial = prompt(`Quilometragem inicial do ${vehicle.marca} ${vehicle.modelo}:`);
        if (kmInicial !== null) {
          startJourneyWithKm(vehicle.id, kmInicial || '0');
        }
      } else {
        navigation.navigate('StartJourney');
      }
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error);
      if (isWeb()) {
        alert(error.message || 'Não foi possível iniciar a jornada');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível iniciar a jornada');
      }
    } finally {
      setQuickActionLoading(null);
    }
  }, [navigation]);

  const startJourneyWithKm = useCallback(async (vehicleId: string, kmInicial: string) => {
    try {
      const km = parseInt(kmInicial);
      if (isNaN(km) || km < 0) {
        if (isWeb()) {
          alert('Quilometragem inválida');
        } else {
          Alert.alert('Erro', 'Quilometragem inválida');
        }
        return;
      }

      await journeyService.startJourney({
        id_veiculo: vehicleId,
        km_inicio: km,
        observacoes: ''
      });

      if (isWeb()) {
        alert('Jornada iniciada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Jornada iniciada com sucesso!');
      }
      checkActiveJourney();
      loadDashboardData();
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error);
      if (isWeb()) {
        alert(error.message || 'Não foi possível iniciar a jornada');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível iniciar a jornada');
      }
    }
  }, [checkActiveJourney, loadDashboardData]);

  const handleEndJourney = useCallback(async () => {
    if (!activeJourney) return;

    try {
      setQuickActionLoading('endJourney');

      const input = prompt('Informe a quilometragem final e o ganho bruto (ex: 12345, 150.50):');
      if (input !== null) {
        const parts = input?.split(',') || [];
        const kmFinal = parts[0]?.trim() || '0';
        const ganhoBruto = parts[1]?.trim() || '0';
        endJourneyWithData(kmFinal, ganhoBruto);
      }
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error);
      if (isWeb()) {
        alert(error.message || 'Não foi possível finalizar a jornada');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível finalizar a jornada');
      }
    } finally {
      setQuickActionLoading(null);
    }
  }, [activeJourney]);

  const endJourneyWithData = useCallback(async (kmFinal: string, ganhoBruto: string) => {
    try {
      const km = parseInt(kmFinal);
      const ganho = parseFloat(ganhoBruto.replace(',', '.')) * 100; // Converter para centavos

      if (isNaN(km) || km < activeJourney.km_inicio) {
        if (isWeb()) {
          alert('Quilometragem final deve ser maior que a inicial');
        } else {
          Alert.alert('Erro', 'Quilometragem final deve ser maior que a inicial');
        }
        return;
      }

      if (isNaN(ganho) || ganho < 0) {
        if (isWeb()) {
          alert('Ganho bruto inválido');
        } else {
          Alert.alert('Erro', 'Ganho bruto inválido');
        }
        return;
      }

      await journeyService.endJourney(activeJourney.id, {
        km_fim: km,
        ganho_bruto: ganho
      });

      if (isWeb()) {
        alert('Jornada finalizada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Jornada finalizada com sucesso!');
      }
      setActiveJourney(null);
      loadDashboardData();
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error);
      if (isWeb()) {
        alert(error.message || 'Não foi possível finalizar a jornada');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível finalizar a jornada');
      }
    }
  }, [activeJourney, loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const formatCurrency = useCallback((centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos / 100);
  }, []);

  const formatTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  const getPeriodLabel = useCallback((period: string): string => {
    const labels: { [key: string]: string } = {
      'hoje': 'Hoje',
      'semana': 'Esta Semana',
      'mes': 'Este Mês',
      'ano': 'Este Ano'
    };
    return labels[period] || period;
  }, []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: components.container.backgroundColor,
      padding: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    header: {
      marginBottom: spacing.lg,
      paddingTop: getSafePadding().paddingTop,
    },
    greeting: {
      ...typography.h2,
      color: '#333333',
    },
    subtitle: {
      ...typography.body,
      color: '#8E8E93',
    },
    periodSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
      backgroundColor: '#F0F0F0',
      borderRadius: components.card.borderRadius,
      padding: spacing.xs,
    },
    periodButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: components.card.borderRadius,
      alignItems: 'center',
      ...platformStyles.web({
        cursor: 'pointer',
      }),
    },
    periodButtonActive: {
      backgroundColor: '#007AFF',
    },
    periodButtonText: {
      ...typography.caption,
      color: '#8E8E93',
      fontWeight: '600',
    },
    periodButtonTextActive: {
      color: '#FFFFFF',
    },
    quickActionsContainer: {
      marginBottom: spacing.lg,
    },
    quickActionsGrid: {
      ...grid.row,
      justifyContent: 'space-between',
    },
    quickActionButton: {
      ...components.button,
      ...grid.col(isDesktop() ? 3 : 6),
      height: 120,
      marginBottom: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...platformStyles.web({
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'scale(1.03)',
        },
      }),
    },
    startJourneyButton: {
      backgroundColor: '#34C759',
    },
    endJourneyButton: {
      backgroundColor: '#FF3B30',
    },
    fuelingButton: {
      backgroundColor: '#FF9500',
    },
    expenseButton: {
      backgroundColor: '#5856D6',
    },
    reportsButton: {
      backgroundColor: '#007AFF',
    },
    quickActionText: {
      ...typography.body,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    quickActionSubtext: {
      ...typography.small,
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'center',
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      marginBottom: spacing.md,
      color: '#333333',
    },
    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    card: {
      ...components.card,
      ...grid.col(isDesktop() ? 6 : 12),
      marginBottom: spacing.md,
      padding: spacing.md,
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E5EA',
      borderWidth: 1,
      ...platformStyles.web({
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-5px)',
        },
      }),
    },
    gainCard: {
      borderColor: '#34C759',
    },
    expenseCard: {
      borderColor: '#FF3B30',
    },
    profitCard: {
      borderColor: '#007AFF',
    },
    hourlyCard: {
      borderColor: '#FF9500',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    cardLabel: {
      ...typography.caption,
      color: '#8E8E93',
      marginLeft: spacing.xs,
    },
    cardValue: {
      ...typography.h2,
      color: '#333333',
      fontWeight: 'bold',
    },
    cardSubtext: {
      ...typography.small,
      color: '#8E8E93',
    },
    // Estilos para o esqueleto de carregamento
    skeletonContainer: {
      flex: 1,
      backgroundColor: components.container.backgroundColor,
      padding: spacing.md,
      paddingTop: getSafePadding().paddingTop,
    },
    skeletonPeriodSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
      backgroundColor: '#F0F0F0',
      borderRadius: components.card.borderRadius,
      padding: spacing.xs,
    },
    skeletonPeriodButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: components.card.borderRadius,
      alignItems: 'center',
    },
    skeletonSection: {
      marginBottom: spacing.lg,
    },
    skeletonSectionTitle: {
      height: typography.h3.fontSize,
      width: '60%',
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      marginBottom: spacing.md,
    },
    skeletonCardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    skeletonCard: {
      ...components.card,
      ...grid.col(isDesktop() ? 6 : 12),
      height: 100,
      marginBottom: spacing.md,
      backgroundColor: '#E0E0E0',
    },
  }), [getSafePadding]);

  if (loading && !dashboardData) {
    return (
      <View style={responsiveStyles.skeletonContainer}>
        <View style={responsiveStyles.header}>
          <Text style={responsiveStyles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={responsiveStyles.subtitle}>Carregando...</Text>
        </View>

        <View style={responsiveStyles.skeletonPeriodSelector}>
          {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
            <View key={period} style={responsiveStyles.skeletonPeriodButton}>
              <Text style={responsiveStyles.periodButtonText}>
                {getPeriodLabel(period)}
              </Text>
            </View>
          ))}
        </View>

        <View style={responsiveStyles.skeletonSection}>
          <View style={responsiveStyles.skeletonSectionTitle} />
          <View style={responsiveStyles.skeletonCardContainer}>
            <View style={responsiveStyles.skeletonCard} />
            <View style={responsiveStyles.skeletonCard} />
          </View>
          <View style={responsiveStyles.skeletonCardContainer}>
            <View style={responsiveStyles.skeletonCard} />
            <View style={responsiveStyles.skeletonCard} />
          </View>
        </View>

        <View style={responsiveStyles.skeletonSection}>
          <View style={responsiveStyles.skeletonSectionTitle} />
          <View style={responsiveStyles.skeletonCardContainer}>
            <View style={responsiveStyles.skeletonCard} />
            <View style={responsiveStyles.skeletonCard} />
          </View>
          <View style={responsiveStyles.skeletonCardContainer}>
            <View style={responsiveStyles.skeletonCard} />
            <View style={responsiveStyles.skeletonCard} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={responsiveStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      {...platformStyles.web({
        scrollBehavior: 'smooth',
      })}
    >
      <View style={responsiveStyles.header}>
        <Text style={responsiveStyles.greeting}>Olá, {user?.nome}!</Text>
        <Text style={responsiveStyles.subtitle}>{getPeriodLabel(selectedPeriod)}</Text>
      </View>

      <View style={responsiveStyles.periodSelector}>
        {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              responsiveStyles.periodButton,
              selectedPeriod === period && responsiveStyles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
            activeOpacity={0.7}
          >
            <Text style={[
              responsiveStyles.periodButtonText,
              selectedPeriod === period && responsiveStyles.periodButtonTextActive
            ]}>
              {getPeriodLabel(period)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={responsiveStyles.quickActionsContainer}>
        <Text style={responsiveStyles.sectionTitle}>Ações Rápidas</Text>
        <View style={responsiveStyles.quickActionsGrid}>
          {activeJourney ? (
            <TouchableOpacity
              style={[responsiveStyles.quickActionButton, responsiveStyles.endJourneyButton]}
              onPress={handleEndJourney}
              disabled={quickActionLoading === 'endJourney'}
              activeOpacity={0.7}
            >
              {quickActionLoading === 'endJourney' ? (
                <LoadingSpinner size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="stop-circle" size={24} color="#FFF" />
                  <Text style={responsiveStyles.quickActionText}>Finalizar Jornada</Text>
                  <Text style={responsiveStyles.quickActionSubtext}>
                    Iniciada às {new Date(activeJourney.data_inicio).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[responsiveStyles.quickActionButton, responsiveStyles.startJourneyButton]}
              onPress={handleStartJourney}
              disabled={quickActionLoading === 'startJourney'}
              activeOpacity={0.7}
            >
              {quickActionLoading === 'startJourney' ? (
                <LoadingSpinner size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={24} color="#FFF" />
                  <Text style={responsiveStyles.quickActionText}>Iniciar Jornada</Text>
                  <Text style={responsiveStyles.quickActionSubtext}>Começar a trabalhar</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[responsiveStyles.quickActionButton, responsiveStyles.fuelingButton]}
            onPress={() => navigation.navigate('AddFueling')}
            activeOpacity={0.7}
          >
            <Ionicons name="car" size={24} color="#FFF" />
            <Text style={responsiveStyles.quickActionText}>Abastecimento</Text>
            <Text style={responsiveStyles.quickActionSubtext}>Registrar combustível</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[responsiveStyles.quickActionButton, responsiveStyles.expenseButton]}
            onPress={() => navigation.navigate('AddExpense')}
            activeOpacity={0.7}
          >
            <Ionicons name="receipt" size={24} color="#FFF" />
            <Text style={responsiveStyles.quickActionText}>Nova Despesa</Text>
            <Text style={responsiveStyles.quickActionSubtext}>Adicionar gasto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[responsiveStyles.quickActionButton, responsiveStyles.reportsButton]}
            onPress={() => navigation.navigate('Reports')}
            activeOpacity={0.7}
          >
            <Ionicons name="analytics" size={24} color="#FFF" />
            <Text style={responsiveStyles.quickActionText}>Relatórios</Text>
            <Text style={responsiveStyles.quickActionSubtext}>Ver análises</Text>
          </TouchableOpacity>
        </View>
      </View>

      {dashboardData && (
        <>
          <View style={responsiveStyles.section}>
            <Text style={responsiveStyles.sectionTitle}>Resumo Financeiro</Text>
            <View style={responsiveStyles.cardContainer}>
              <View style={[responsiveStyles.card, responsiveStyles.gainCard]}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="trending-up" size={20} color="#34C759" />
                  <Text style={responsiveStyles.cardLabel}>Faturamento</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.faturamento_bruto)}
                </Text>
              </View>
              <View style={[responsiveStyles.card, responsiveStyles.expenseCard]}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="trending-down" size={20} color="#FF3B30" />
                  <Text style={responsiveStyles.cardLabel}>Despesas</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.total_despesas)}
                </Text>
              </View>
            </View>
            <View style={responsiveStyles.cardContainer}>
              <View style={[responsiveStyles.card, responsiveStyles.profitCard]}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="wallet" size={20} color="#007AFF" />
                  <Text style={responsiveStyles.cardLabel}>Lucro Líquido</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.lucro_liquido)}
                </Text>
                <Text style={responsiveStyles.cardSubtext}>
                  Margem: {dashboardData.metricas_principais.margem_lucro.toFixed(1)}%
                </Text>
              </View>
              <View style={[responsiveStyles.card, responsiveStyles.hourlyCard]}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="time" size={20} color="#FF9500" />
                  <Text style={responsiveStyles.cardLabel}>Ganho/Hora</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora)}
                </Text>
                <Text style={responsiveStyles.cardSubtext}>
                  {formatTime(dashboardData.metricas_operacionais.tempo_total_trabalhado_minutos)} trabalhadas
                </Text>
              </View>
            </View>
          </View>

          <View style={responsiveStyles.section}>
            <Text style={responsiveStyles.sectionTitle}>Métricas Operacionais</Text>
            <View style={responsiveStyles.cardContainer}>
              <View style={responsiveStyles.card}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="speedometer" size={20} color="#8E8E93" />
                  <Text style={responsiveStyles.cardLabel}>KM Rodados</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {dashboardData.metricas_operacionais.km_total} km
                </Text>
              </View>
              <View style={responsiveStyles.card}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="cash" size={20} color="#8E8E93" />
                  <Text style={responsiveStyles.cardLabel}>Custo por KM</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.custo_por_km)}
                </Text>
              </View>
            </View>
            <View style={responsiveStyles.cardContainer}>
              <View style={responsiveStyles.card}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="car" size={20} color="#8E8E93" />
                  <Text style={responsiveStyles.cardLabel}>Nº Jornadas</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {dashboardData.metricas_operacionais.numero_jornadas}
                </Text>
              </View>
              <View style={responsiveStyles.card}>
                <View style={responsiveStyles.cardHeader}>
                  <Ionicons name="trending-up" size={20} color="#8E8E93" />
                  <Text style={responsiveStyles.cardLabel}>Ganho Médio/Jornada</Text>
                </View>
                <Text style={responsiveStyles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.ganho_medio_por_jornada)}
                </Text>
              </View>
            </View>
          </View>

          {dashboardData.distribuicao_despesas && dashboardData.distribuicao_despesas.length > 0 && (
            <View style={responsiveStyles.section}>
              <Text style={responsiveStyles.sectionTitle}>Distribuição de Despesas</Text>
              {dashboardData.distribuicao_despesas.map((item, index) => (
                <View key={index} style={responsiveStyles.card}>
                  <Text style={responsiveStyles.cardLabel}>{item.categoria}</Text>
                  <Text style={responsiveStyles.cardValue}>{formatCurrency(item.valor)}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default DashboardScreenOptimized;


