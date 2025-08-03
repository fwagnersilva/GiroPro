import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { InsightsPanel } from '../components/InsightsPanel';
import { MultiVehicleSelector } from '../components/MultiVehicleSelector';

type PeriodType = 7 | 30 | 90 | 365;

export const InsightsScreen: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(30);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  const handleVehicleSelect = (vehicleId: string, vehicle: any) => {
    setSelectedVehicleId(vehicleId);
    setShowVehicleSelector(false);
  };

  const clearVehicleSelection = () => {
    setSelectedVehicleId(undefined);
    setShowVehicleSelector(false);
  };

  const getPeriodLabel = (period: PeriodType) => {
    const labels = {
      7: '7 dias',
      30: '30 dias',
      90: '90 dias',
      365: '1 ano',
    };
    return labels[period];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Insights Inteligentes</Text>
      <Text style={styles.headerSubtitle}>
        Análises e recomendações personalizadas para otimizar seus resultados
      </Text>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Seletor de Veículo */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Veículo:</Text>
        <TouchableOpacity
          style={styles.vehicleButton}
          onPress={() => setShowVehicleSelector(!showVehicleSelector)}
        >
          <Text style={styles.vehicleButtonText}>
            {selectedVehicleId ? 'Veículo Específico' : 'Todos os Veículos'}
          </Text>
          <Text style={styles.vehicleButtonIcon}>
            {showVehicleSelector ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>
        
        {selectedVehicleId && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearVehicleSelection}
          >
            <Text style={styles.clearButtonText}>Limpar Seleção</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Seletor de Período */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Período:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {([7, 30, 90, 365] as PeriodType[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
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

  const renderVehicleSelector = () => {
    if (!showVehicleSelector) return null;

    return (
      <View style={styles.vehicleSelectorContainer}>
        <MultiVehicleSelector
          selectedVehicleId={selectedVehicleId}
          onVehicleSelect={handleVehicleSelect}
          showStats={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      {renderVehicleSelector()}
      
      <View style={styles.contentContainer}>
        <InsightsPanel
          selectedVehicleId={selectedVehicleId}
          periodDays={selectedPeriod}
          showFullAnalysis={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  vehicleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  vehicleButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  vehicleButtonIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  vehicleSelectorContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentContainer: {
    flex: 1,
  },
});

