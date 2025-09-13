import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { multiVehicleService, VehicleWithStats } from '../services/multiVehicleService';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonLoader } from './SkeletonLoader';

interface MultiVehicleSelectorProps {
  selectedVehicleId?: string;
  onVehicleSelect: (vehicleId: string, vehicle: VehicleWithStats['veiculo']) => void;
  showStats?: boolean;
  allowMultiSelect?: boolean;
  selectedVehicleIds?: string[];
  onMultiSelect?: (vehicleIds: string[]) => void;
}

export const MultiVehicleSelector: React.FC<MultiVehicleSelectorProps> = ({
  selectedVehicleId,
  onVehicleSelect,
  showStats = false,
  allowMultiSelect = false,
  selectedVehicleIds = [],
  onMultiSelect,
}) => {
  const queryClient = useQueryClient();
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedVehicleIds);

  // Query para buscar veículos com estatísticas
  const { data: vehiclesData, isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles-with-stats'],
    queryFn: () => multiVehicleService.getVehiclesWithStats({
      ordenar_por: 'data_cadastro',
      ordem: 'desc'
    }),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para definir veículo ativo
  const setActiveVehicleMutation = useMutation({
    mutationFn: (vehicleId: string) => multiVehicleService.setActiveVehicle(vehicleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles-with-stats'] });
      Alert.alert('Sucesso', data.message);
    },
    onError: (error: Error) => {
      Alert.alert('Erro', error.message);
    },
  });

  useEffect(() => {
    setLocalSelectedIds(selectedVehicleIds);
  }, [selectedVehicleIds]);

  const handleVehiclePress = (vehicle: VehicleWithStats) => {
    if (allowMultiSelect) {
      const isSelected = localSelectedIds.includes(vehicle.veiculo.id);
      let newSelectedIds: string[];
      
      if (isSelected) {
        newSelectedIds = localSelectedIds.filter(id => id !== vehicle.veiculo.id);
      } else {
        newSelectedIds = [...localSelectedIds, vehicle.veiculo.id];
      }
      
      setLocalSelectedIds(newSelectedIds);
      onMultiSelect?.(newSelectedIds);
    } else {
      onVehicleSelect(vehicle.veiculo.id, vehicle.veiculo);
    }
  };

  const handleSetActiveVehicle = (vehicleId: string) => {
    Alert.alert(
      'Definir Veículo Ativo',
      'Deseja definir este veículo como padrão para novas jornadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => setActiveVehicleMutation.mutate(vehicleId)
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return '#10B981'; // Verde
      case 'Pouco Ativo':
        return '#F59E0B'; // Amarelo
      case 'Inativo':
        return '#EF4444'; // Vermelho
      default:
        return '#6B7280'; // Cinza
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader height={120} />
        <SkeletonLoader height={120} />
        <SkeletonLoader height={120} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar veículos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!vehiclesData?.veiculos || vehiclesData.veiculos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
        <Text style={styles.emptySubtext}>Cadastre um veículo para começar</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Resumo Geral */}
      {showStats && vehiclesData.resumo_geral && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo Geral ({vehiclesData.periodo_analise})</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{vehiclesData.resumo_geral.total_veiculos}</Text>
              <Text style={styles.summaryLabel}>Total de Veículos</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                {vehiclesData.resumo_geral.veiculos_ativos}
              </Text>
              <Text style={styles.summaryLabel}>Ativos</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {formatCurrency(vehiclesData.resumo_geral.faturamento_total_geral)}
              </Text>
              <Text style={styles.summaryLabel}>Faturamento Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {vehiclesData.resumo_geral.km_total_geral.toLocaleString('pt-BR')} km
              </Text>
              <Text style={styles.summaryLabel}>KM Total</Text>
            </View>
          </View>
        </View>
      )}

      {/* Lista de Veículos */}
      {vehiclesData.veiculos.map((vehicleData) => {
        const isSelected = allowMultiSelect 
          ? localSelectedIds.includes(vehicleData.veiculo.id)
          : selectedVehicleId === vehicleData.veiculo.id;

        return (
          <TouchableOpacity
            key={vehicleData.veiculo.id}
            style={[
              styles.vehicleCard,
              isSelected && styles.selectedVehicleCard
            ]}
            onPress={() => handleVehiclePress(vehicleData)}
            onLongPress={() => !allowMultiSelect && handleSetActiveVehicle(vehicleData.veiculo.id)}
          >
            {/* Header do Veículo */}
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                  {vehicleData.veiculo.marca} {vehicleData.veiculo.modelo}
                </Text>
                <Text style={styles.vehicleDetails}>
                  {vehicleData.veiculo.ano} • {vehicleData.veiculo.placa}
                </Text>
                <Text style={styles.vehicleType}>
                  {vehicleData.veiculo.tipo_combustivel} • {vehicleData.veiculo.tipo_uso}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(vehicleData.veiculo.status) }
                ]}>
                  <Text style={styles.statusText}>{vehicleData.veiculo.status}</Text>
                </View>
                {allowMultiSelect && (
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                )}
              </View>
            </View>

            {/* Estatísticas (se habilitado) */}
            {showStats && (
              <View style={styles.statsContainer}>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatCurrency(vehicleData.estatisticas_30_dias.faturamento_total)}
                    </Text>
                    <Text style={styles.statLabel}>Faturamento</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {vehicleData.estatisticas_30_dias.km_total.toLocaleString('pt-BR')} km
                    </Text>
                    <Text style={styles.statLabel}>Quilometragem</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {vehicleData.estatisticas_30_dias.numero_jornadas}
                    </Text>
                    <Text style={styles.statLabel}>Jornadas</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[
                      styles.statValue,
                      { color: vehicleData.estatisticas_30_dias.lucro_liquido >= 0 ? '#10B981' : '#EF4444' }
                    ]}>
                      {formatCurrency(vehicleData.estatisticas_30_dias.lucro_liquido)}
                    </Text>
                    <Text style={styles.statLabel}>Lucro</Text>
                  </View>
                </View>

                {/* Informações Adicionais */}
                <View style={styles.additionalInfo}>
                  <Text style={styles.additionalInfoText}>
                    Consumo: {vehicleData.estatisticas_30_dias.consumo_medio} km/l
                  </Text>
                  <Text style={styles.additionalInfoText}>
                    Margem: {vehicleData.estatisticas_30_dias.margem_lucro}%
                  </Text>
                  <Text style={styles.additionalInfoText}>
                    Última jornada: {formatDate(vehicleData.estatisticas_30_dias.ultima_jornada)}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Loading para mutation */}
      {setActiveVehicleMutation.isPending && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedVehicleCard: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    width: '48%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  additionalInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  additionalInfoText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

