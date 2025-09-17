import React, { useState, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layouts, typography, spacing, useResponsiveStyles } from '../styles/responsive';
import { lightTheme } from '../theme/tokens';
import { getSafePadding } from '../utils/platformUtils';
import { useJourneys, useQuickFilters } from '../hooks/useJourneys';
import { Journey, QUICK_FILTERS } from '../types/journey';
import { journeySchema } from '../schemas/journeySchemas';
import JourneyCard from '../components/JourneyCard';
import AddJourneyModal from '../components/AddJourneyModal';

// Componente de Estado Vazio
const EmptyState: React.FC<{ onNewJourney: () => void }> = ({ onNewJourney }) => (
  <View style={styles.emptyState}>
    <Ionicons name="map-outline" size={80} color={lightTheme.colors.textTertiary} />
    <Text style={styles.emptyTitle}>Nenhuma jornada registrada</Text>
    <Text style={styles.emptySubtitle}>
      Comece a rastrear suas viagens para obter insights sobre eficiência e custos de combustível
    </Text>
    <TouchableOpacity style={styles.emptyButton} onPress={onNewJourney}>
      <Ionicons name="add-circle-outline" size={20} color={lightTheme.colors.surface} />
      <Text style={styles.emptyButtonText}>Iniciar primeira jornada</Text>
    </TouchableOpacity>
    
    <View style={styles.emptyFeatures}>
      <View style={styles.emptyFeature}>
        <Ionicons name="analytics-outline" size={24} color={lightTheme.colors.primary} />
        <Text style={styles.emptyFeatureText}>Análise de eficiência</Text>
      </View>
      <View style={styles.emptyFeature}>
        <Ionicons name="location-outline" size={24} color={lightTheme.colors.primary} />
        <Text style={styles.emptyFeatureText}>Rastreamento GPS</Text>
      </View>
      <View style={styles.emptyFeature}>
        <Ionicons name="cash-outline" size={24} color={lightTheme.colors.primary} />
        <Text style={styles.emptyFeatureText}>Controle de custos</Text>
      </View>
    </View>
  </View>
);

// Componente de Filtros Rápidos
const QuickFilters: React.FC<{
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ selectedFilter, onFilterChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {QUICK_FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterChip,
            selectedFilter === filter.key && styles.filterChipActive
          ]}
          onPress={() => onFilterChange(filter.key)}
          accessible={true}
          accessibilityLabel={`Filtrar por ${filter.label}`}
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

// Componente de Métricas Resumidas
const MetricsSummary: React.FC<{ journeys: Journey[] }> = ({ journeys }) => {
  const completedJourneys = journeys.filter(j => j.status === 'completed');
  const totalDistance = completedJourneys.reduce((sum, j) => sum + j.distance, 0);
  const totalCost = completedJourneys.reduce((sum, j) => sum + j.cost, 0);
  const avgConsumption = completedJourneys.length > 0 
    ? completedJourneys.reduce((sum, j) => sum + j.fuelConsumption, 0) / completedJourneys.length 
    : 0;

  return (
    <View style={styles.metricsContainer}>
      <View style={styles.metricCard}>
        <Ionicons name="speedometer-outline" size={20} color={lightTheme.colors.primary} />
        <Text style={styles.metricValue}>{totalDistance.toLocaleString('pt-BR')} km</Text>
        <Text style={styles.metricLabel}>Distância Total</Text>
      </View>
      
      <View style={styles.metricCard}>
        <Ionicons name="cash-outline" size={20} color={lightTheme.colors.success} />
        <Text style={styles.metricValue}>R$ {totalCost.toFixed(2)}</Text>
        <Text style={styles.metricLabel}>Custo Total</Text>
      </View>
      
      <View style={styles.metricCard}>
        <Ionicons name="water-outline" size={20} color={lightTheme.colors.warning} />
        <Text style={styles.metricValue}>{avgConsumption.toFixed(1)} L/100km</Text>
        <Text style={styles.metricLabel}>Consumo Médio</Text>
      </View>
    </View>
  );
};

// Componente Principal
const JourneysScreen: React.FC = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState(\'all\');
  const [isAddJourneyModalVisible, setAddJourneyModalVisible] = useState(false);
  const { getQuickFilter } = useQuickFilters();
  const { journeys, loading, error, refresh } = useJourneys();
  const { isDesktop, isTablet } = useResponsiveStyles();

  const handleFilterChange = useCallback((filterKey: string) => {
    setSelectedFilter(filterKey);
    const filter = getQuickFilter(filterKey);
    // Aplicar filtro aos dados
    // Por enquanto apenas mudamos o estado visual
  }, [getQuickFilter]);

  const handleNewJourney = useCallback(() => {
    setAddJourneyModalVisible(true);
  }, []);

  const handleJourneyPress = useCallback((journey: Journey) => {
    Alert.alert(
      'Detalhes da Jornada',
      `Funcionalidade em desenvolvimento. Detalhes da jornada "${journey.title}" serão exibidos em breve.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleJourneyEdit = useCallback((journey: Journey) => {
    Alert.alert(
      'Editar Jornada',
      `Edição da jornada "${journey.title}" em desenvolvimento.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleJourneyDelete = useCallback((journey: Journey) => {
    Alert.alert(
      'Excluir Jornada',
      `Tem certeza que deseja excluir a jornada "${journey.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          // Implementar exclusão
          console.log('Excluir jornada:', journey.id);
        }}
      ]
    );
  }, []);

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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={lightTheme.colors.error} />
          <Text style={styles.errorTitle}>Erro ao carregar jornadas</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.headerButton}
            accessible={true}
            accessibilityLabel="Buscar jornadas"
          >
            <Ionicons name="search-outline" size={24} color={lightTheme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            accessible={true}
            accessibilityLabel="Filtros avançados"
          >
            <Ionicons name="filter-outline" size={24} color={lightTheme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros Rápidos */}
      <QuickFilters 
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Conteúdo Principal */}
      {journeys.length === 0 ? (
        <EmptyState onNewJourney={handleNewJourney} />
      ) : (
        <>
          {/* Métricas Resumidas */}
          <MetricsSummary journeys={journeys} />
          
          {/* Lista de Jornadas */}
          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {journeys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onPress={() => handleJourneyPress(journey)}
                onEdit={() => handleJourneyEdit(journey)}
                onDelete={() => handleJourneyDelete(journey)}
                showActions={true}
              />
            ))}
          </ScrollView>
        </>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleNewJourney}
        accessible={true}
        accessibilityLabel="Iniciar nova jornada"
      >
        <Ionicons name="add" size={28} color={lightTheme.colors.surface} />
      </TouchableOpacity>

      <AddJourneyModal
        visible={isAddJourneyModalVisible}
        onClose={() => setAddJourneyModalVisible(false)}
        onSubmit={(kmInicio) => {
          console.log("Nova jornada com km inicial:", kmInicio);
          setAddJourneyModalVisible(false);
          Alert.alert(
            'Nova Jornada',
            `Jornada iniciada com ${kmInicio} km. Funcionalidade de rastreamento em desenvolvimento.`,
            [{ text: 'OK' }]
          );
        }}
        loading={false} // Adicionar estado de loading real quando a API for integrada
      />
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

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  errorTitle: {
    ...typography.h3,
    color: lightTheme.colors.text,
    marginTop: spacing[4],
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 24,
    marginTop: spacing[4],
  },
  retryButtonText: {
    ...typography.body,
    color: lightTheme.colors.surface,
    fontWeight: '600',
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
    borderRadius: 8,
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

  // Métricas
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  metricCard: {
    flex: 1,
    backgroundColor: lightTheme.colors.surface,
    padding: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    ...lightTheme.shadows.sm,
  },
  metricValue: {
    ...typography.h4,
    color: lightTheme.colors.text,
    marginTop: spacing[1],
    marginBottom: spacing[1],
  },
  metricLabel: {
    ...typography.small,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Conteúdo
  content: {
    flex: 1,
    padding: spacing[4],
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
    marginBottom: spacing[8],
  },
  emptyButtonText: {
    ...typography.body,
    color: lightTheme.colors.surface,
    fontWeight: '600',
  },
  emptyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  emptyFeature: {
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyFeatureText: {
    ...typography.small,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
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

export default JourneysScreen;

