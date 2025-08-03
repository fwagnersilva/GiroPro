import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const FuelingsScreenOptimized: React.FC = ({ navigation }: any) => {
  const [fuelings, setFuelings] = useState<FuelingWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadVehicles = useCallback(async () => {
    try {
      const vehiclesData = await vehicleService.getVehicles();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      if (isWeb()) {
        alert('Erro ao carregar veículos');
      } else {
        Alert.alert('Erro', 'Erro ao carregar veículos');
      }
    }
  }, []);

  const loadFuelings = useCallback(async (pageNumber: number = 1, reset: boolean = false) => {
    try {
      const response = await fuelingService.getFuelings({
        page: pageNumber,
        limit: 20
      });

      if (reset) {
        setFuelings(response.data);
      } else {
        setFuelings(prev => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.hasNext);
      setPage(pageNumber);
    } catch (error) {
      console.error('Erro ao carregar abastecimentos:', error);
      if (isWeb()) {
        alert('Não foi possível carregar os abastecimentos');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os abastecimentos');
      }
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFuelings(1, true),
        loadVehicles()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      if (isWeb()) {
        alert('Não foi possível carregar os dados');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados');
      }
    } finally {
      setLoading(false);
    }
  }, [loadFuelings, loadVehicles]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFuelings(1, true);
    setRefreshing(false);
  }, [loadFuelings]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadFuelings(page + 1, false);
    }
  }, [hasMore, loading, page, loadFuelings]);

  const handleDeleteFueling = useCallback(async (id: string) => {
    if (isWeb()) {
      if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
        try {
          await fuelingService.deleteFueling(id);
          setFuelings(prev => prev.filter(fueling => fueling.id !== id));
          alert('Abastecimento excluído com sucesso');
        } catch (error) {
          console.error('Erro ao excluir abastecimento:', error);
          alert('Não foi possível excluir o abastecimento');
        }
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este abastecimento?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await fuelingService.deleteFueling(id);
                setFuelings(prev => prev.filter(fueling => fueling.id !== id));
                Alert.alert('Sucesso', 'Abastecimento excluído com sucesso');
              } catch (error) {
                console.error('Erro ao excluir abastecimento:', error);
                Alert.alert('Erro', 'Não foi possível excluir o abastecimento');
              }
            }
          }
        ]
      );
    }
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }, []);

  const formatLiters = useCallback((milliliters: number) => {
    return (milliliters / 1000).toFixed(2) + 'L';
  }, []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
      paddingTop: getSafePadding().paddingTop,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5EA',
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    title: {
      ...typography.h2,
      color: '#333333',
    },
    addButton: {
      backgroundColor: '#007AFF',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    listContainer: {
      padding: spacing.md,
      flexGrow: 1,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    fuelingCard: {
      ...components.card,
      marginBottom: spacing.md,
      padding: spacing.md,
      backgroundColor: '#FFFFFF',
      borderColor: '#E0E0E0',
      borderWidth: 1,
      ...platformStyles.web({
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-5px)',
        },
      }),
    },
    fuelingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    fuelingInfo: {
      flex: 1,
    },
    fuelingDate: {
      ...typography.body,
      fontWeight: '600',
      color: '#000000',
      marginBottom: spacing.xs,
    },
    vehicleInfo: {
      ...typography.caption,
      color: '#8E8E93',
    },
    deleteButton: {
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    fuelingDetails: {
      gap: spacing.xs,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      ...typography.caption,
      color: '#8E8E93',
    },
    detailValue: {
      ...typography.caption,
      fontWeight: '500',
      color: '#000000',
    },
    totalValue: {
      ...typography.body,
      fontWeight: '600',
      color: '#007AFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: layouts.dashboard.container.backgroundColor,
    },
    loadingText: {
      ...typography.body,
      marginTop: spacing.md,
      color: '#8E8E93',
    },
    loadingFooter: {
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    emptyTitle: {
      ...typography.h3,
      color: '#CCCCCC',
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      ...typography.body,
      color: '#AAAAAA',
      textAlign: 'center',
      lineHeight: typography.body.lineHeight,
    },
  }), [getSafePadding]);

  const renderFuelingItem = useCallback(({ item }: { item: FuelingWithVehicle }) => (
    <View style={responsiveStyles.fuelingCard}>
      <View style={responsiveStyles.fuelingHeader}>
        <View style={responsiveStyles.fuelingInfo}>
          <Text style={responsiveStyles.fuelingDate}>{formatDate(item.data_abastecimento)}</Text>
          <Text style={responsiveStyles.vehicleInfo}>
            {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
          </Text>
        </View>
        <TouchableOpacity
          style={responsiveStyles.deleteButton}
          onPress={() => handleDeleteFueling(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={responsiveStyles.fuelingDetails}>
        <View style={responsiveStyles.detailRow}>
          <Text style={responsiveStyles.detailLabel}>Combustível:</Text>
          <Text style={responsiveStyles.detailValue}>{item.tipo_combustivel}</Text>
        </View>
        <View style={responsiveStyles.detailRow}>
          <Text style={responsiveStyles.detailLabel}>Quantidade:</Text>
          <Text style={responsiveStyles.detailValue}>{formatLiters(item.quantidade_litros)}</Text>
        </View>
        <View style={responsiveStyles.detailRow}>
          <Text style={responsiveStyles.detailLabel}>Valor/Litro:</Text>
          <Text style={responsiveStyles.detailValue}>{formatCurrency(item.valor_litro)}</Text>
        </View>
        <View style={responsiveStyles.detailRow}>
          <Text style={responsiveStyles.detailLabel}>Total:</Text>
          <Text style={[responsiveStyles.detailValue, responsiveStyles.totalValue]}>
            {formatCurrency(item.valor_total)}
          </Text>
        </View>
        {item.nome_posto && (
          <View style={responsiveStyles.detailRow}>
            <Text style={responsiveStyles.detailLabel}>Posto:</Text>
            <Text style={responsiveStyles.detailValue}>{item.nome_posto}</Text>
          </View>
        )}
        {item.km_atual && (
          <View style={responsiveStyles.detailRow}>
            <Text style={responsiveStyles.detailLabel}>KM:</Text>
            <Text style={responsiveStyles.detailValue}>{item.km_atual.toLocaleString('pt-BR')}</Text>
          </View>
        )}
      </View>
    </View>
  ), [formatDate, formatLiters, formatCurrency, handleDeleteFueling, responsiveStyles]);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={responsiveStyles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [hasMore, responsiveStyles]);

  const renderEmpty = useCallback(() => (
    <View style={responsiveStyles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color="#8E8E93" />
      <Text style={responsiveStyles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={responsiveStyles.emptySubtitle}>
        Registre seu primeiro abastecimento tocando no botão +
      </Text>
    </View>
  ), [responsiveStyles]);

  if (loading) {
    return (
      <View style={responsiveStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={responsiveStyles.loadingText}>Carregando abastecimentos...</Text>
      </View>
    );
  }

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.header}>
        <Text style={responsiveStyles.title}>Abastecimentos</Text>
        <TouchableOpacity
          style={responsiveStyles.addButton}
          onPress={() => navigation.navigate('AddFueling', { vehicles })}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={fuelings}
        renderItem={renderFuelingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={responsiveStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FuelingsScreenOptimized;


