import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Animated,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { InsightsPanelImproved } from '../components/InsightsPanelImproved';
import { MultiVehicleSelector } from '../components/MultiVehicleSelector';
import { SafeAreaView } from 'react-native-safe-area-context';

// Ícones profissionais (simulando Lucide icons)
const Icons = {
  ChevronDown: () => <Text style={styles.icon}>▼</Text>,
  ChevronRight: () => <Text style={styles.icon}>▶</Text>,
  Car: () => <Text style={styles.icon}>🚗</Text>,
  Calendar: () => <Text style={styles.icon}>📅</Text>,
  Filter: () => <Text style={styles.icon}>🔍</Text>,
  RefreshCw: () => <Text style={styles.icon}>🔄</Text>,
  X: () => <Text style={styles.icon}>✕</Text>,
  BarChart3: () => <Text style={styles.icon}>📊</Text>,
  TrendingUp: () => <Text style={styles.icon}>📈</Text>,
  AlertCircle: () => <Text style={styles.icon}>⚠️</Text>,
};

type PeriodType = 7 | 30 | 90 | 365;
type ViewMode = 'all' | 'insights' | 'recommendations';

interface FilterChip {
  id: string;
  label: string;
  type: 'vehicle' | 'period';
}

export const InsightsScreenImproved: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(30);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Animação para o modal
  const modalAnimation = new Animated.Value(0);

  const handleVehicleSelect = useCallback((vehicleId: string, vehicle: any) => {
    setSelectedVehicleId(vehicleId);
    setShowVehicleModal(false);
  }, []);

  const clearVehicleSelection = useCallback(() => {
    setSelectedVehicleId(undefined);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
  }, []);

  const openVehicleModal = useCallback(() => {
    setShowVehicleModal(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const closeVehicleModal = useCallback(() => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowVehicleModal(false);
    });
  }, []);

  const getPeriodLabel = (period: PeriodType) => {
    const labels = {
      7: '7 dias',
      30: '30 dias',
      90: '90 dias',
      365: '1 ano',
    };
    return labels[period];
  };

  const activeFilters = useMemo((): FilterChip[] => {
    const filters: FilterChip[] = [];
    
    if (selectedVehicleId) {
      filters.push({
        id: 'vehicle',
        label: 'Veículo Específico',
        type: 'vehicle'
      });
    }
    
    if (selectedPeriod !== 30) {
      filters.push({
        id: 'period',
        label: getPeriodLabel(selectedPeriod),
        type: 'period'
      });
    }
    
    return filters;
  }, [selectedVehicleId, selectedPeriod]);

  const removeFilter = useCallback((filterId: string) => {
    if (filterId === 'vehicle') {
      clearVehicleSelection();
    } else if (filterId === 'period') {
      setSelectedPeriod(30);
    }
  }, [clearVehicleSelection]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleContainer}>
          <Icons.BarChart3 />
          <Text style={styles.headerTitle}>Insights Inteligentes</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Icons.RefreshCw />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.headerSubtitle}>
        Análises e recomendações personalizadas para otimizar seus resultados
      </Text>
      
      <Text style={styles.lastUpdated}>
        Última atualização: {lastUpdated.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  const renderViewModeSelector = () => (
    <View style={styles.viewModeContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'all', label: 'Todos', icon: Icons.BarChart3 },
          { key: 'insights', label: 'Insights', icon: Icons.TrendingUp },
          { key: 'recommendations', label: 'Recomendações', icon: Icons.AlertCircle },
        ].map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.viewModeButton,
              viewMode === key && styles.activeViewModeButton
            ]}
            onPress={() => setViewMode(key as ViewMode)}
          >
            <Icon />
            <Text style={[
              styles.viewModeButtonText,
              viewMode === key && styles.activeViewModeButtonText
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filtersHeader}>
        <View style={styles.filtersTitle}>
          <Icons.Filter />
          <Text style={styles.filtersTitleText}>Filtros</Text>
        </View>
      </View>

      {/* Chips de filtros ativos */}
      {activeFilters.length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeFilters.map((filter) => (
              <View key={filter.id} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{filter.label}</Text>
                <TouchableOpacity
                  style={styles.filterChipRemove}
                  onPress={() => removeFilter(filter.id)}
                >
                  <Icons.X />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.filtersRow}>
        {/* Seletor de Veículo */}
        <TouchableOpacity
          style={[styles.filterButton, styles.vehicleFilterButton]}
          onPress={openVehicleModal}
        >
          <Icons.Car />
          <Text style={styles.filterButtonText}>
            {selectedVehicleId ? 'Veículo' : 'Todos'}
          </Text>
          <Icons.ChevronDown />
        </TouchableOpacity>

        {/* Seletor de Período */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodScrollContainer}
        >
          {([7, 30, 90, 365] as PeriodType[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Icons.Calendar />
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {getPeriodLabel(period)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderVehicleModal = () => (
    <Modal
      visible={showVehicleModal}
      transparent
      animationType="none"
      onRequestClose={closeVehicleModal}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: modalAnimation,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={closeVehicleModal}
        />
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{
                translateY: modalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Veículo</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeVehicleModal}
            >
              <Icons.X />
            </TouchableOpacity>
          </View>
          
          <MultiVehicleSelector
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleVehicleSelect}
            showStats={false}
          />
          
          {selectedVehicleId && (
            <TouchableOpacity
              style={styles.clearSelectionButton}
              onPress={clearVehicleSelection}
            >
              <Text style={styles.clearSelectionText}>Limpar Seleção</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
        backgroundColor="#FFFFFF" 
      />
      
      {renderHeader()}
      {renderViewModeSelector()}
      {renderFilters()}
      {renderVehicleModal()}
      
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <InsightsPanelImproved
          selectedVehicleId={selectedVehicleId}
          periodDays={selectedPeriod}
          showFullAnalysis={true}
          viewMode={viewMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  viewModeContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeViewModeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  viewModeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeViewModeButtonText: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  activeFiltersContainer: {
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
    marginRight: 6,
  },
  filterChipRemove: {
    padding: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  vehicleFilterButton: {
    minWidth: 120,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  periodScrollContainer: {
    flex: 1,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 100,
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  clearSelectionButton: {
    margin: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
  },
  clearSelectionText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  icon: {
    fontSize: 16,
    color: '#6B7280',
  },
});

