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
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { DashboardCardSkeleton } from '../components/SkeletonLoader';
import LoadingSpinner from '../components/LoadingSpinner';
import { journeyService, vehicleService } from '../services/api';
import { lightTheme, spacing, typography, borderRadius, shadows } from '../theme/tokens';

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

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  visible: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isDesktop = screenWidth >= 1024;

const DashboardScreenImproved: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [activeJourney, setActiveJourney] = useState<any>(null);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [journeyKm, setJourneyKm] = useState('');
  const [journeyGanho, setJourneyGanho] = useState('');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  
  // Animações
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    loadDashboardData();
    checkActiveJourney();
    
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedPeriod]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, message, visible: true });
    
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
      setTimeout(() => setToast(null), 300);
    }, 3000);
  }, []);

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

      if (vehicles.length === 1) {
        setShowJourneyModal(true);
      } else {
        navigation.navigate('StartJourney');
      }
    } catch (error: any) {
      showToast('error', error.message || 'Não foi possível iniciar a jornada');
    } finally {
      setQuickActionLoading(null);
    }
  };

  const startJourneyWithKm = async () => {
    try {
      const km = parseInt(journeyKm);
      if (isNaN(km) || km < 0) {
        showToast('error', 'Quilometragem inválida');
        return;
      }

      const vehicles = await vehicleService.getVehicles();
      await journeyService.startJourney({
        id_veiculo: vehicles[0].id,
        km_inicio: km,
        observacoes: ''
      });

      showToast('success', 'Jornada iniciada com sucesso!');
      setShowJourneyModal(false);
      setJourneyKm('');
      checkActiveJourney();
      loadDashboardData();
    } catch (error: any) {
      showToast('error', error.message || 'Não foi possível iniciar a jornada');
    }
  };

  const handleEndJourney = async () => {
    if (!activeJourney) return;

    try {
      setQuickActionLoading('endJourney');
      setShowJourneyModal(true);
    } catch (error: any) {
      showToast('error', error.message || 'Não foi possível finalizar a jornada');
    } finally {
      setQuickActionLoading(null);
    }
  };

  const endJourneyWithData = async () => {
    try {
      const km = parseInt(journeyKm);
      const ganho = parseFloat(journeyGanho.replace(',', '.')) * 100;

      if (isNaN(km) || km < activeJourney.km_inicio) {
        showToast('error', 'Quilometragem final deve ser maior que a inicial');
        return;
      }

      if (isNaN(ganho) || ganho < 0) {
        showToast('error', 'Ganho bruto inválido');
        return;
      }

      await journeyService.endJourney(activeJourney.id, {
        km_fim: km,
        ganho_bruto: ganho
      });

      showToast('success', 'Jornada finalizada com sucesso!');
      setShowJourneyModal(false);
      setJourneyKm('');
      setJourneyGanho('');
      setActiveJourney(null);
      loadDashboardData();
    } catch (error: any) {
      showToast('error', error.message || 'Não foi possível finalizar a jornada');
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
      showToast('error', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getAuthToken = async () => {
    return 'mock_token_for_testing';
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

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

  const getPeriodIcon = useCallback((period: string): string => {
    const icons: { [key: string]: string } = {
      'hoje': 'today',
      'semana': 'calendar',
      'mes': 'calendar-outline',
      'ano': 'calendar-clear'
    };
    return icons[period] || 'calendar';
  }, []);

  const renderPeriodSelector = useMemo(() => (
    <View style={styles.periodSelector}>
      {(['hoje', 'semana', 'mes', 'ano'] as const).map((period, index) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive
          ]}
          onPress={() => setSelectedPeriod(period)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={getPeriodIcon(period) as any} 
            size={16} 
            color={selectedPeriod === period ? '#FFFFFF' : '#8E8E93'} 
          />
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.periodButtonTextActive
          ]}>
            {getPeriodLabel(period)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ), [selectedPeriod]);

  const renderMainCard = useMemo(() => {
    if (!dashboardData) return null;

    const lucro = dashboardData.metricas_principais.lucro_liquido;
    const margem = dashboardData.metricas_principais.margem_lucro;
    const isPositive = lucro >= 0;

    return (
      <Animated.View 
        style={[
          styles.mainCard,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim 
          }
        ]}
      >
        <View style={styles.mainCardHeader}>
          <View style={[styles.mainCardIcon, { backgroundColor: isPositive ? '#34C759' : '#FF3B30' }]}>
            <Ionicons 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.mainCardInfo}>
            <Text style={styles.mainCardLabel}>Lucro Líquido</Text>
            <Text style={styles.mainCardPeriod}>{getPeriodLabel(selectedPeriod)}</Text>
          </View>
        </View>
        
        <Text style={[styles.mainCardValue, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
          {formatCurrency(lucro)}
        </Text>
        
        <View style={styles.mainCardFooter}>
          <View style={styles.marginIndicator}>
            <Text style={styles.marginLabel}>Margem de Lucro</Text>
            <Text style={[styles.marginValue, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
              {margem.toFixed(1)}%
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }, [dashboardData, selectedPeriod, fadeAnim, scaleAnim]);

  const renderSecondaryCards = useMemo(() => {
    if (!dashboardData) return null;

    const cards = [
      {
        id: 'faturamento',
        icon: 'cash',
        label: 'Faturamento',
        value: formatCurrency(dashboardData.metricas_principais.faturamento_bruto),
        color: '#007AFF',
        trend: 'up'
      },
      {
        id: 'despesas',
        icon: 'card',
        label: 'Despesas',
        value: formatCurrency(dashboardData.metricas_principais.total_despesas),
        color: '#FF3B30',
        trend: 'down'
      },
      {
        id: 'km',
        icon: 'speedometer',
        label: 'KM Rodados',
        value: `${dashboardData.metricas_operacionais.km_total.toLocaleString('pt-BR')} km`,
        color: '#FF9500',
        subtext: `${formatCurrency(dashboardData.metricas_operacionais.custo_por_km)}/km`
      },
      {
        id: 'ganho_hora',
        icon: 'time',
        label: 'Ganho/Hora',
        value: formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora),
        color: '#AF52DE',
        subtext: formatTime(dashboardData.metricas_operacionais.tempo_total_trabalhado_minutos)
      }
    ];

    return (
      <View style={styles.secondaryCardsContainer}>
        {cards.map((card, index) => (
          <Animated.View
            key={card.id}
            style={[
              styles.secondaryCard,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              }
            ]}
          >
            <View style={styles.secondaryCardHeader}>
              <View style={[styles.secondaryCardIcon, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon as any} size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.secondaryCardLabel}>{card.label}</Text>
            </View>
            
            <Text style={styles.secondaryCardValue}>{card.value}</Text>
            
            {card.subtext && (
              <Text style={styles.secondaryCardSubtext}>{card.subtext}</Text>
            )}
          </Animated.View>
        ))}
      </View>
    );
  }, [dashboardData, fadeAnim, slideAnim]);

  const renderQuickActions = useMemo(() => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.quickActionsGrid}>
        {activeJourney ? (
          <TouchableOpacity
            style={[styles.quickActionButton, styles.endJourneyButton]}
            onPress={handleEndJourney}
            disabled={quickActionLoading === 'endJourney'}
            activeOpacity={0.8}
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
            activeOpacity={0.8}
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
          onPress={() => navigation.navigate('AddFueling')}
          activeOpacity={0.8}
        >
          <Ionicons name="car" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>Abastecimento</Text>
          <Text style={styles.quickActionSubtext}>Registrar combustível</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.expenseButton]}
          onPress={() => navigation.navigate('AddExpense')}
          activeOpacity={0.8}
        >
          <Ionicons name="receipt" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>Nova Despesa</Text>
          <Text style={styles.quickActionSubtext}>Adicionar gasto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.reportsButton]}
          onPress={() => navigation.navigate('Reports')}
          activeOpacity={0.8}
        >
          <Ionicons name="analytics" size={24} color="#FFF" />
          <Text style={styles.quickActionText}>Relatórios</Text>
          <Text style={styles.quickActionSubtext}>Ver análises</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [activeJourney, quickActionLoading]);

  const renderJourneyModal = () => (
    <Modal
      visible={showJourneyModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowJourneyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {activeJourney ? 'Finalizar Jornada' : 'Iniciar Jornada'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowJourneyModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {activeJourney ? 'Quilometragem Final' : 'Quilometragem Inicial'}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={journeyKm}
                onChangeText={setJourneyKm}
                placeholder="Ex: 12345"
                keyboardType="numeric"
                autoFocus
              />
            </View>

            {activeJourney && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ganho Bruto (R$)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={journeyGanho}
                  onChangeText={setJourneyGanho}
                  placeholder="Ex: 150,00"
                  keyboardType="numeric"
                />
              </View>
            )}

            {activeJourney && journeyKm && (
              <View style={styles.journeySummary}>
                <Text style={styles.summaryTitle}>Resumo da Jornada</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>KM Rodados:</Text>
                  <Text style={styles.summaryValue}>
                    {parseInt(journeyKm) - activeJourney.km_inicio} km
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tempo Trabalhado:</Text>
                  <Text style={styles.summaryValue}>
                    {Math.floor((Date.now() - new Date(activeJourney.data_inicio).getTime()) / (1000 * 60 * 60))}h
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowJourneyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={activeJourney ? endJourneyWithData : startJourneyWithKm}
              disabled={!journeyKm || (activeJourney && !journeyGanho)}
            >
              <Text style={styles.modalConfirmText}>
                {activeJourney ? 'Finalizar' : 'Iniciar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderToast = () => {
    if (!toast) return null;

    const toastColors = {
      success: '#34C759',
      error: '#FF3B30',
      info: '#007AFF'
    };

    const toastIcons = {
      success: 'checkmark-circle',
      error: 'alert-circle',
      info: 'information-circle'
    };

    return (
      <Animated.View
        style={[
          styles.toast,
          { 
            backgroundColor: toastColors[toast.type],
            opacity: toast.visible ? 1 : 0,
            transform: [{ translateY: toast.visible ? 0 : -100 }]
          }
        ]}
      >
        <Ionicons name={toastIcons[toast.type] as any} size={20} color="#FFFFFF" />
        <Text style={styles.toastText}>{toast.message}</Text>
      </Animated.View>
    );
  };

  if (loading && !dashboardData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={styles.subtitle}>Carregando...</Text>
        </View>

        <View style={styles.periodSelector}>
          {(['hoje', 'semana', 'mes', 'ano'] as const).map((period) => (
            <View key={period} style={styles.periodButton}>
              <Text style={styles.periodButtonText}>
                {getPeriodLabel(period)}
              </Text>
            </View>
          ))}
        </View>

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
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={styles.subtitle}>{getPeriodLabel(selectedPeriod)}</Text>
        </View>

        {renderPeriodSelector}
        {renderQuickActions}

        {dashboardData && (
          <View style={styles.metricsContainer}>
            {renderMainCard}
            {renderSecondaryCards}

            {/* Distribuição de Despesas */}
            {dashboardData.distribuicao_despesas.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distribuição de Despesas</Text>
                {dashboardData.distribuicao_despesas.map((item, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.expenseItem,
                      {
                        transform: [{ translateY: slideAnim }],
                        opacity: fadeAnim,
                      }
                    ]}
                  >
                    <Text style={styles.expenseCategory}>{item.categoria}</Text>
                    <Text style={styles.expenseValue}>{formatCurrency(item.valor)}</Text>
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {renderJourneyModal()}
      {renderToast()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    backgroundColor: lightTheme.colors.primary,
    padding: spacing[5],
    paddingTop: Platform.OS === 'ios' ? spacing[12] : spacing[8],
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  greeting: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: lightTheme.colors.surface,
    margin: spacing[4],
    borderRadius: borderRadius.md,
    padding: spacing[1],
    ...shadows.base,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
    gap: spacing[1],
  },
  periodButtonActive: {
    backgroundColor: lightTheme.colors.primary,
  },
  periodButtonText: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  quickActionsContainer: {
    margin: spacing[4],
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[3],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  quickActionButton: {
    width: isTablet ? '48%' : '48%',
    backgroundColor: lightTheme.colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    ...shadows.md,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  quickActionSubtext: {
    color: '#FFF',
    fontSize: typography.fontSize.xs,
    opacity: 0.8,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  metricsContainer: {
    margin: spacing[4],
    marginTop: 0,
  },
  mainCard: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    marginBottom: spacing[4],
    ...shadows.lg,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  mainCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  mainCardInfo: {
    flex: 1,
  },
  mainCardLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  mainCardPeriod: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[1],
  },
  mainCardValue: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[4],
  },
  mainCardFooter: {
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    paddingTop: spacing[4],
  },
  marginIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLabel: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  marginValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  secondaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  secondaryCard: {
    width: isTablet ? '48%' : '48%',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.base,
  },
  secondaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  secondaryCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  secondaryCardLabel: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  secondaryCardValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },
  secondaryCardSubtext: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textTertiary,
  },
  section: {
    marginTop: spacing[6],
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  expenseCategory: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  expenseValue: {
    fontSize: typography.fontSize.sm,
    color: '#FF3B30',
    fontWeight: typography.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  modalContent: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  modalCloseButton: {
    padding: spacing[1],
  },
  modalBody: {
    padding: spacing[5],
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.text,
    marginBottom: spacing[2],
  },
  modalInput: {
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.text,
  },
  journeySummary: {
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    marginTop: spacing[2],
  },
  summaryTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[2],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing[5],
    paddingTop: 0,
    gap: spacing[3],
  },
  modalCancelButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  modalConfirmButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    backgroundColor: lightTheme.colors.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.md,
    gap: spacing[2],
    zIndex: 1000,
    ...shadows.lg,
  },
  toastText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium,
  },
});

export default DashboardScreenImproved;

