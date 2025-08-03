import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MultiVehicleSelector } from '../components/MultiVehicleSelector';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';
import { multiVehicleService } from '../services/multiVehicleService';
import { LoadingSpinner } from '../components/LoadingSpinner';

type TabType = 'vehicles' | 'analytics' | 'comparison';
type PeriodType = '7d' | '30d' | '90d' | '1y';

export const MultiVehicleScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30d');

  // Query para resumo rápido
  const { data: quickSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['quick-summary'],
    queryFn: () => multiVehicleService.getQuickSummary(),
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });

  const handleVehicleSelect = (vehicleId: string, vehicle: any) => {
    setSelectedVehicleId(vehicleId);
    // Opcional: Navegar para detalhes do veículo ou mostrar analytics específicas
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const getPeriodLabel = (period: PeriodType) => {
    const labels = {
      '7d': '7 dias',
      '30d': '30 dias',
      '90d': '90 dias',
      '1y': '1 ano',
    };
    return labels[period];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Múltiplos Veículos</Text>
      <Text style={styles.headerSubtitle}>Gerencie e analise todos os seus veículos</Text>
    </View>
  );

  const renderQuickSummary = () => {
    if (summaryLoading) {
      return (
        <View style={styles.summaryContainer}>
          <LoadingSpinner />
        </View>
      );
    }

    if (!quickSummary) {
      return null;
    }

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo de Hoje</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{quickSummary.total_veiculos}</Text>
            <Text style={styles.summaryLabel}>Total de Veículos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {quickSummary.veiculos_com_jornadas_hoje}
            </Text>
            <Text style={styles.summaryLabel}>Ativos Hoje</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {formatCurrency(quickSummary.faturamento_total_hoje)}
            </Text>
            <Text style={styles.summaryLabel}>Faturamento</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {quickSummary.km_total_hoje.toLocaleString('pt-BR')} km
            </Text>
            <Text style={styles.summaryLabel}>Quilometragem</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'vehicles' && styles.activeTab]}
        onPress={() => setActiveTab('vehicles')}
      >
        <Text style={[styles.tabText, activeTab === 'vehicles' && styles.activeTabText]}>
          🚗 Veículos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
        onPress={() => setActiveTab('analytics')}
      >
        <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
          📊 Análises
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'comparison' && styles.activeTab]}
        onPress={() => setActiveTab('comparison')}
      >
        <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>
          🔄 Comparação
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPeriodSelector = () => {
    if (activeTab === 'vehicles') return null;

    return (
      <View style={styles.periodContainer}>
        <Text style={styles.periodLabel}>Período:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['7d', '30d', '90d', '1y'] as PeriodType[]).map((period) => (
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
    );
  };

  const renderVehicleSelector = () => (
    <View style={styles.vehicleSelectorContainer}>
      <Text style={styles.selectorTitle}>Selecionar Veículo (Opcional)</Text>
      <Text style={styles.selectorSubtitle}>
        Deixe em branco para analisar todos os veículos
      </Text>
      <MultiVehicleSelector
        selectedVehicleId={selectedVehicleId}
        onVehicleSelect={handleVehicleSelect}
        showStats={false}
      />
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return (
          <MultiVehicleSelector
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleVehicleSelect}
            showStats={true}
          />
        );
      
      case 'analytics':
        return (
          <View style={styles.analyticsContainer}>
            {renderVehicleSelector()}
            <AdvancedAnalytics
              selectedVehicleId={selectedVehicleId}
              selectedPeriod={selectedPeriod}
            />
          </View>
        );
      
      case 'comparison':
        return (
          <AdvancedAnalytics
            selectedPeriod={selectedPeriod}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderQuickSummary()}
      {renderTabSelector()}
      {renderPeriodSelector()}
      <View style={styles.contentContainer}>
        {renderContent()}
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
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  periodContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginRight: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  analyticsContainer: {
    flex: 1,
  },
  vehicleSelectorContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 200,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectorSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
});

