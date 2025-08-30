import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layouts, typography, spacing, useResponsiveStyles } from '../styles/responsive';
import { lightTheme, components } from '../theme/tokens';
import { getSafePadding } from '../utils/platformUtils';

// Interfaces para tipagem
interface Journey {
  id: string;
  title: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  fuelConsumption: number;
  cost: number;
  status: 'completed' | 'in_progress' | 'paused' | 'cancelled';
  date: string;
  vehicleId: string;
  driverId?: string;
}

interface JourneyCardProps {
  journey: Journey;
  onPress: () => void;
}

// Componente JourneyCard reutilizável
const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onPress }) => {
  const getStatusColor = (status: Journey['status']) => {
    switch (status) {
      case 'completed':
        return lightTheme.colors.success;
      case 'in_progress':
        return lightTheme.colors.primary;
      case 'paused':
        return lightTheme.colors.warning;
      case 'cancelled':
        return lightTheme.colors.error;
      default:
        return lightTheme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Journey['status']) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in_progress':
        return 'play-circle';
      case 'paused':
        return 'pause-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusText = (status: Journey['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em andamento';
      case 'paused':
        return 'Pausada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <TouchableOpacity style={styles.journeyCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.routeInfo}>
          <Ionicons name="car-outline" size={20} color={lightTheme.colors.primary} />
          <Text style={styles.routeText} numberOfLines={1}>
            {journey.origin} → {journey.destination}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(journey.status) }]}>
          <Ionicons 
            name={getStatusIcon(journey.status) as any} 
            size={12} 
            color={lightTheme.colors.surface} 
          />
          <Text style={styles.statusText}>{getStatusText(journey.status)}</Text>
        </View>
      </View>

      <View style={styles.cardMetrics}>
        <View style={styles.metric}>
          <Ionicons name="time-outline" size={16} color={lightTheme.colors.textSecondary} />
          <Text style={styles.metricText}>{journey.duration}</Text>
        </View>
        <View style={styles.metric}>
          <Ionicons name="speedometer-outline" size={16} color={lightTheme.colors.textSecondary} />
          <Text style={styles.metricText}>{journey.distance} km</Text>
        </View>
        <View style={styles.metric}>
          <Ionicons name="water-outline" size={16} color={lightTheme.colors.textSecondary} />
          <Text style={styles.metricText}>{journey.fuelConsumption.toFixed(1)} L/100km</Text>
        </View>
        <View style={styles.metric}>
          <Ionicons name="cash-outline" size={16} color={lightTheme.colors.textSecondary} />
          <Text style={styles.metricText}>R$ {journey.cost.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.cardDate}>{journey.date}</Text>
    </TouchableOpacity>
  );
};

// Componente de Estado Vazio
const EmptyState: React.FC<{ onNewJourney: () => void }> = ({ onNewJourney }) => (
  <View style={styles.emptyState}>
    <Ionicons name="map-outline" size={80} color={lightTheme.colors.textTertiary} />
    <Text style={styles.emptyTitle}>Nenhuma jornada registrada</Text>
    <Text style={styles.emptySubtitle}>
      Comece a rastrear suas viagens para obter insights sobre eficiência e custos
    </Text>
    <TouchableOpacity style={styles.emptyButton} onPress={onNewJourney}>
      <Ionicons name="add-circle-outline" size={20} color={lightTheme.colors.surface} />
      <Text style={styles.emptyButtonText}>Iniciar primeira jornada</Text>
    </TouchableOpacity>
  </View>
);

// Componente de Filtros Rápidos
const QuickFilters: React.FC<{
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'Todas', icon: 'list-outline' },
    { key: 'today', label: 'Hoje', icon: 'today-outline' },
    { key: 'week', label: 'Semana', icon: 'calendar-outline' },
    { key: 'month', label: 'Mês', icon: 'calendar-outline' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterChip,
            selectedFilter === filter.key && styles.filterChipActive
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Ionicons 
            name={filter.icon as any} 
            size={16} 
            color={selectedFilter === filter.key ? lightTheme.colors.surface : lightTheme.colors.textSecondary} 
          />
          <Text style={[
            styles.filterChipText,
            selectedFilter === filter.key && styles.filterChipTextActive
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Componente Principal
const JourneysScreenImproved: React.FC = ({ navigation }: any) => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isDesktop, isTablet } = useResponsiveStyles();

  // Dados mockados para demonstração
  const mockJourneys: Journey[] = [
    {
      id: '1',
      title: 'Viagem de Negócios',
      origin: 'São Paulo',
      destination: 'Rio de Janeiro',
      distance: 485,
      duration: '6h 30min',
      fuelConsumption: 8.2,
      cost: 245.50,
      status: 'completed',
      date: '28/08/2025 14:30',
      vehicleId: 'vehicle-1',
      driverId: 'driver-1',
    },
    {
      id: '2',
      title: 'Entrega Local',
      origin: 'Centro',
      destination: 'Zona Sul',
      distance: 25,
      duration: '45min',
      fuelConsumption: 12.5,
      cost: 18.75,
      status: 'in_progress',
      date: '30/08/2025 09:15',
      vehicleId: 'vehicle-2',
    },
    {
      id: '3',
      title: 'Rota de Distribuição',
      origin: 'Depósito',
      destination: 'Múltiplos pontos',
      distance: 120,
      duration: '3h 20min',
      fuelConsumption: 9.8,
      cost: 89.40,
      status: 'paused',
      date: '29/08/2025 16:45',
      vehicleId: 'vehicle-1',
    },
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const loadJourneys = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setJourneys(mockJourneys);
      setLoading(false);
    };

    loadJourneys();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular atualização de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    setJourneys(mockJourneys);
    setRefreshing(false);
  };

  const handleNewJourney = () => {
    // Navegar para tela de nova jornada
    console.log('Iniciar nova jornada');
  };

  const handleJourneyPress = (journey: Journey) => {
    // Navegar para detalhes da jornada
    console.log('Abrir detalhes da jornada:', journey.id);
  };

  const filteredJourneys = journeys.filter(journey => {
    // Implementar lógica de filtro baseada em selectedFilter
    return true; // Por enquanto, mostrar todas
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
        <View style={styles.loadingContainer}>
          <Ionicons name="car-outline" size={60} color={lightTheme.colors.primary} />
          <Text style={styles.loadingText}>Carregando jornadas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Jornadas</Text>
          <Text style={styles.headerSubtitle}>
            {journeys.length} {journeys.length === 1 ? 'jornada' : 'jornadas'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color={lightTheme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter-outline" size={24} color={lightTheme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros Rápidos */}
      <QuickFilters 
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Conteúdo Principal */}
      {filteredJourneys.length === 0 ? (
        <EmptyState onNewJourney={handleNewJourney} />
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredJourneys.map((journey) => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              onPress={() => handleJourneyPress(journey)}
            />
          ))}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewJourney}>
        <Ionicons name="add" size={28} color={lightTheme.colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  loadingText: {
    ...typography.body,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[4],
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: lightTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.borderLight,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: lightTheme.colors.text,
    marginBottom: 0,
  },
  headerSubtitle: {
    ...typography.caption,
    color: lightTheme.colors.textSecondary,
    marginBottom: 0,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  headerButton: {
    padding: spacing[2],
    borderRadius: components.button.base.borderRadius,
  },

  // Filtros
  filtersContainer: {
    backgroundColor: lightTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.borderLight,
  },
  filtersContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: lightTheme.colors.surfaceVariant,
    gap: spacing[1],
  },
  filterChipActive: {
    backgroundColor: lightTheme.colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: lightTheme.colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: lightTheme.colors.surface,
  },

  // Conteúdo
  content: {
    flex: 1,
    padding: spacing[4],
  },

  // Journey Card
  journeyCard: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...lightTheme.shadows.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing[2],
  },
  routeText: {
    ...typography.h4,
    color: lightTheme.colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
    gap: spacing[1],
  },
  statusText: {
    ...typography.small,
    color: lightTheme.colors.surface,
    fontWeight: '600',
  },
  cardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metricText: {
    ...typography.caption,
    color: lightTheme.colors.textSecondary,
  },
  cardDate: {
    ...typography.small,
    color: lightTheme.colors.textTertiary,
    textAlign: 'right',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  emptyTitle: {
    ...typography.h3,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginTop: spacing[4],
  },
  emptySubtitle: {
    ...typography.body,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 24,
    gap: spacing[2],
    ...lightTheme.shadows.base,
  },
  emptyButtonText: {
    ...typography.body,
    color: lightTheme.colors.surface,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[4],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: lightTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...lightTheme.shadows.lg,
  },
});

export default JourneysScreenImproved;

