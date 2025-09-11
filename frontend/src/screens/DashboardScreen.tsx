import React, { useState, useEffect } from 'react';
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
import SimpleNavigationMenu from '../components/SimpleNavigationMenu';

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

const DashboardScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [activeJourney, setActiveJourney] = useState<any>(null);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    checkActiveJourney();
  }, [selectedPeriod]);

  const checkActiveJourney = async () => {
    try {
      const journey = await journeyService.getActiveJourney();
      setActiveJourney(journey);
    } catch (error) {
      console.error('Erro ao verificar jornada ativa:', error);
    }
  };

  const handleStartJourney = async () => {
    try {
      setQuickActionLoading('startJourney');
      
      // Verificar se há veículos cadastrados
      const vehicles = await vehicleService.getVehicles();
      if (vehicles.length === 0) {
        Alert.alert(
          'Nenhum Veículo',
          'Você precisa cadastrar um veículo antes de iniciar uma jornada.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cadastrar', onPress: () => navigation.navigate('Vehicles') }
          ]
        );
        return;
      }

      // Se há apenas um veículo, usar automaticamente
      if (vehicles.length === 1) {
        const vehicle = vehicles[0];
        Alert.prompt(
          'Iniciar Jornada',
          `Quilometragem inicial do ${vehicle.marca} ${vehicle.modelo}:`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Iniciar', 
              onPress: (kmInicial) => startJourneyWithKm(vehicle.id, kmInicial || '0')
            }
          ],
          'plain-text',
          '',
          'numeric'
        );
      } else {
        // Navegar para tela de seleção de veículo
        navigation.navigate('StartJourney');
      }
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error);
      Alert.alert('Erro', error.message || 'Não foi possível iniciar a jornada');
    } finally {
      setQuickActionLoading(null);
    }
  };

  const startJourneyWithKm = async (vehicleId: string, kmInicial: string) => {
    try {
      const km = parseInt(kmInicial);
      if (isNaN(km) || km < 0) {
        Alert.alert('Erro', 'Quilometragem inválida');
        return;
      }

      await journeyService.startJourney({
        id_veiculo: vehicleId,
        km_inicio: km,
        observacoes: ''
      });

      Alert.alert('Sucesso', 'Jornada iniciada com sucesso!');
      checkActiveJourney();
      loadDashboardData();
    } catch (error: any) {
      console.error('Erro ao iniciar jornada:', error);
      Alert.alert('Erro', error.message || 'Não foi possível iniciar a jornada');
    }
  };

  const handleEndJourney = async () => {
    if (!activeJourney) return;

    try {
      setQuickActionLoading('endJourney');

      Alert.prompt(
        'Finalizar Jornada',
        'Informe a quilometragem final e o ganho bruto:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Finalizar', 
            onPress: (input) => {
              const parts = input?.split(',') || [];
              const kmFinal = parts[0]?.trim() || '0';
              const ganhoBruto = parts[1]?.trim() || '0';
              endJourneyWithData(kmFinal, ganhoBruto);
            }
          }
        ],
        'plain-text',
        'KM Final, Ganho (R$)',
        'numeric'
      );
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error);
      Alert.alert('Erro', error.message || 'Não foi possível finalizar a jornada');
    } finally {
      setQuickActionLoading(null);
    }
  };

  const endJourneyWithData = async (kmFinal: string, ganhoBruto: string) => {
    try {
      const km = parseInt(kmFinal);
      const ganho = parseFloat(ganhoBruto.replace(',', '.')) * 100; // Converter para centavos

      if (isNaN(km) || km < activeJourney.km_inicio) {
        Alert.alert('Erro', 'Quilometragem final deve ser maior que a inicial');
        return;
      }

      if (isNaN(ganho) || ganho < 0) {
        Alert.alert('Erro', 'Ganho bruto inválido');
        return;
      }

      await journeyService.endJourney(activeJourney.id, {
        km_fim: km,
        ganho_bruto: ganho
      });

      Alert.alert('Sucesso', 'Jornada finalizada com sucesso!');
      setActiveJourney(null);
      loadDashboardData();
    } catch (error: any) {
      console.error('Erro ao finalizar jornada:', error);
      Alert.alert('Erro', error.message || 'Não foi possível finalizar a jornada');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/dashboard/summary?periodo=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
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
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getAuthToken = async () => {
    // Implementar busca do token do AsyncStorage
    // Por enquanto, usar um token mock para testes
    return 'mock_token_for_testing';
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const formatCurrency = (centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos / 100);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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

  if (loading && !dashboardData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={styles.subtitle}>Carregando...</Text>
        </View>

        {/* Skeleton do seletor de período */}
        <View style={styles.periodSelector}>
          {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
            <View key={period} style={styles.periodButton}>
              <Text style={styles.periodButtonText}>
                {getPeriodLabel(period)}
              </Text>
            </View>
          ))}
        </View>

        {/* Skeleton dos cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          <View style={styles.cardContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
          <View style={styles.cardContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Operacionais</Text>
          <View style={styles.cardContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
          <View style={styles.cardContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SimpleNavigationMenu navigation={navigation} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
            <Text style={styles.subtitle}>{getPeriodLabel(selectedPeriod)}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('TestScreen')}
          >
            <Ionicons name="menu" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Seletor de Período */}
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

      {/* Atalhos Rápidos */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {activeJourney ? (
            <TouchableOpacity
              style={[styles.quickActionButton, styles.endJourneyButton]}
              onPress={handleEndJourney}
              disabled={quickActionLoading === 'endJourney'}
            >
              {quickActionLoading === 'endJourney' ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="stop-circle" size={24} color="#FFF" />
                  <Text style={styles.quickActionText}>Finalizar Jornada</Text>
                  <Text style={styles.quickActionSubtext}>
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
              style={[styles.quickActionButton, styles.startJourneyButton]}
              onPress={handleStartJourney}
              disabled={quickActionLoading === 'startJourney'}
            >
              {quickActionLoading === 'startJourney' ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={24} color="#FFF" />
                  <Text style={styles.quickActionText}>Iniciar Jornada</Text>
                  <Text style={styles.quickActionSubtext}>Começar a trabalhar</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.quickActionButton, styles.fuelingButton]}
            onPress={() => navigation.navigate(\'Fuelings\')}         >
            <Ionicons name="car" size={24} color="#FFF" />
            <Text style={styles.quickActionText}>Abastecimento</Text>
            <Text style={styles.quickActionSubtext}>Registrar combustível</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.expenseButton]}
           onPress={() => navigation.navigate(\'Expenses\')}          >
            <Ionicons name="receipt" size={24} color="#FFF" />
            <Text style={styles.quickActionText}>Nova Despesa</Text>
            <Text style={styles.quickActionSubtext}>Adicionar gasto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.reportsButton]}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="analytics" size={24} color="#FFF" />
            <Text style={styles.quickActionText}>Relatórios</Text>
            <Text style={styles.quickActionSubtext}>Ver análises</Text>
          </TouchableOpacity>
        </View>
      </View>

      {dashboardData && (
        <>
          {/* Resumo Financeiro */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
            <View style={styles.cardContainer}>
              <View style={[styles.card, styles.gainCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="trending-up" size={20} color="#34C759" />
                  <Text style={styles.cardLabel}>Faturamento</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.faturamento_bruto)}
                </Text>
              </View>
              <View style={[styles.card, styles.expenseCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="trending-down" size={20} color="#FF3B30" />
                  <Text style={styles.cardLabel}>Despesas</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.total_despesas)}
                </Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View style={[styles.card, styles.profitCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="wallet" size={20} color="#007AFF" />
                  <Text style={styles.cardLabel}>Lucro Líquido</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_principais.lucro_liquido)}
                </Text>
                <Text style={styles.cardSubtext}>
                  Margem: {dashboardData.metricas_principais.margem_lucro.toFixed(1)}%
                </Text>
              </View>
              <View style={[styles.card, styles.hourlyCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="time" size={20} color="#FF9500" />
                  <Text style={styles.cardLabel}>Ganho/Hora</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora)}
                </Text>
                <Text style={styles.cardSubtext}>
                  {formatTime(dashboardData.metricas_operacionais.tempo_total_trabalhado_minutos)} trabalhadas
                </Text>
              </View>
            </View>
          </View>

          {/* Métricas Operacionais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Métricas Operacionais</Text>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="speedometer" size={20} color="#8E8E93" />
                  <Text style={styles.cardLabel}>KM Rodados</Text>
                </View>
                <Text style={styles.cardValue}>
                  {dashboardData.metricas_operacionais.km_total.toLocaleString('pt-BR')} km
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="car" size={20} color="#8E8E93" />
                  <Text style={styles.cardLabel}>Jornadas</Text>
                </View>
                <Text style={styles.cardValue}>
                  {dashboardData.metricas_operacionais.numero_jornadas}
                </Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="calculator" size={20} color="#8E8E93" />
                  <Text style={styles.cardLabel}>Custo por KM</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.custo_por_km * 100)}
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="analytics" size={20} color="#8E8E93" />
                  <Text style={styles.cardLabel}>Média/Jornada</Text>
                </View>
                <Text style={styles.cardValue}>
                  {formatCurrency(dashboardData.metricas_operacionais.ganho_medio_por_jornada)}
                </Text>
              </View>
            </View>
          </View>

          {/* Distribuição de Despesas */}
          {dashboardData.distribuicao_despesas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distribuição de Despesas</Text>
              {dashboardData.distribuicao_despesas.map((item, index) => (
                <View key={index} style={styles.expenseItem}>
                  <Text style={styles.expenseCategory}>{item.categoria}</Text>
                  <Text style={styles.expenseValue}>{formatCurrency(item.valor)}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gainCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  profitCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  hourlyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 6,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  cardSubtext: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  expenseValue: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  quickActionsContainer: {
    margin: 16,
    marginTop: 0,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: '#AF52DE',
  },
  reportsButton: {
    backgroundColor: '#007AFF',
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionSubtext: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default DashboardScreen;

