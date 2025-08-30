import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';
import { Picker } from '@react-native-picker/picker';
import { lightTheme, spacing, borderRadius, shadows, typography } from '../theme/tokens';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const FuelingHistoryScreen: React.FC = ({ navigation }: any) => {
  const [fuelings, setFuelings] = useState<FuelingWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filtros
  const [searchText, setSearchText] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnimation] = useState(new Animated.Value(0));

  // Estatísticas rápidas
  const [quickStats, setQuickStats] = useState({
    totalSpent: 0,
    totalLiters: 0,
    averagePrice: 0,
    lastFueling: null as FuelingWithVehicle | null,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadFuelings(1, true);
    }
  }, [selectedVehicle, selectedFuelType, searchText]);

  useEffect(() => {
    calculateQuickStats();
  }, [fuelings]);

  useEffect(() => {
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showFilters]);

  const calculateQuickStats = () => {
    if (fuelings.length === 0) {
      setQuickStats({
        totalSpent: 0,
        totalLiters: 0,
        averagePrice: 0,
        lastFueling: null,
      });
      return;
    }

    const totalSpent = fuelings.reduce((sum, f) => sum + f.valor_total, 0);
    const totalLiters = fuelings.reduce((sum, f) => sum + f.quantidade_litros, 0);
    const averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;
    const lastFueling = fuelings[0]; // Assumindo que a lista está ordenada por data

    setQuickStats({
      totalSpent,
      totalLiters,
      averagePrice,
      lastFueling,
    });
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFuelings(1, true),
        loadVehicles()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const vehiclesData = await vehicleService.getVehicles();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  };

  const loadFuelings = async (pageNumber: number, reset: boolean = false) => {
    try {
      if (pageNumber === 1) {
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }

      const params: any = {
        page: pageNumber,
        limit: 20,
      };

      if (selectedVehicle) {
        params.id_veiculo = selectedVehicle;
      }

      if (selectedFuelType) {
        params.tipo_combustivel = selectedFuelType;
      }

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      const response = await fuelingService.getFuelings(params);
      const newFuelings = response.data || [];

      const enrichedFuelings = newFuelings.map((fueling: Fueling) => {
        const vehicle = vehicles.find(v => v.id === fueling.id_veiculo);
        return {
          ...fueling,
          veiculo_marca: vehicle?.marca,
          veiculo_modelo: vehicle?.modelo,
          veiculo_placa: vehicle?.placa,
        };
      });

      if (reset || pageNumber === 1) {
        setFuelings(enrichedFuelings);
        setPage(1);
      } else {
        setFuelings(prev => [...prev, ...enrichedFuelings]);
      }

      setPage(pageNumber);
      setHasMore(newFuelings.length === 20);

    } catch (error: any) {
      console.error('Erro ao carregar abastecimentos:', error);
      Alert.alert('Erro', error.message || 'Não foi possível carregar os abastecimentos');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadFuelings(1, true);
  }, [selectedVehicle, selectedFuelType, searchText]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadFuelings(page + 1);
    }
  };

  const formatCurrency = (centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos / 100);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFuelTypeIcon = (fuelType: string): string => {
    const icons: { [key: string]: string } = {
      'Gasolina': 'car',
      'Etanol': 'leaf',
      'Diesel': 'bus',
      'GNV': 'cloud',
      'Flex': 'swap-horizontal'
    };
    return icons[fuelType] || 'car';
  };

  const getFuelTypeColor = (fuelType: string): string => {
    const colors: { [key: string]: string } = {
      'Gasolina': lightTheme.colors.error,
      'Etanol': lightTheme.colors.success,
      'Diesel': lightTheme.colors.textSecondary,
      'GNV': lightTheme.colors.primary,
      'Flex': lightTheme.colors.warning
    };
    return colors[fuelType] || lightTheme.colors.textSecondary;
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedVehicle('');
    setSelectedFuelType('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchText.trim()) count++;
    if (selectedVehicle) count++;
    if (selectedFuelType) count++;
    return count;
  };

  const deleteFueling = async (fuelingId: string) => {
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
              await fuelingService.deleteFueling(fuelingId);
              Alert.alert('Sucesso', 'Abastecimento excluído com sucesso');
              loadFuelings(1, true);
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível excluir o abastecimento');
            }
          }
        }
      ]
    );
  };

  const renderQuickStats = () => (
    <View style={styles.quickStatsContainer}>
      <Text style={styles.quickStatsTitle}>Resumo do Mês</Text>
      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatItem}>
          <Ionicons name="wallet-outline" size={20} color={lightTheme.colors.primary} />
          <Text style={styles.quickStatValue}>{formatCurrency(quickStats.totalSpent)}</Text>
          <Text style={styles.quickStatLabel}>Total Gasto</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Ionicons name="speedometer-outline" size={20} color={lightTheme.colors.success} />
          <Text style={styles.quickStatValue}>{quickStats.totalLiters.toFixed(1)}L</Text>
          <Text style={styles.quickStatLabel}>Total Litros</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Ionicons name="trending-up-outline" size={20} color={lightTheme.colors.warning} />
          <Text style={styles.quickStatValue}>{formatCurrency(quickStats.averagePrice * 100)}</Text>
          <Text style={styles.quickStatLabel}>Preço Médio</Text>
        </View>
      </View>
    </View>
  );

  const renderFuelingItem = ({ item, index }: { item: FuelingWithVehicle; index: number }) => (
    <Animated.View
      style={[
        styles.fuelingCard,
        {
          opacity: new Animated.Value(0),
          transform: [
            {
              translateY: new Animated.Value(50),
            },
          ],
        },
      ]}
      onLayout={() => {
        Animated.parallel([
          Animated.timing(new Animated.Value(0), {
            toValue: 1,
            duration: 300,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(new Animated.Value(50), {
            toValue: 0,
            duration: 300,
            delay: index * 100,
            useNativeDriver: true,
          }),
        ]).start();
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('FuelingDetails', { fuelingId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.fuelingHeader}>
          <View style={styles.fuelingMainInfo}>
            <Text style={styles.fuelingDate}>
              {formatDate(item.data_abastecimento)}
            </Text>
            <Text style={styles.fuelingVehicle}>
              {item.veiculo_marca} {item.veiculo_modelo}
            </Text>
            <Text style={styles.fuelingPlate}>{item.veiculo_placa}</Text>
          </View>
          <View style={[styles.fuelTypeBadge, { backgroundColor: getFuelTypeColor(item.tipo_combustivel) }]}>
            <Ionicons 
              name={getFuelTypeIcon(item.tipo_combustivel) as any} 
              size={16} 
              color={lightTheme.colors.surface} 
            />
            <Text style={styles.fuelTypeText}>{item.tipo_combustivel}</Text>
          </View>
        </View>

        <View style={styles.fuelingMetrics}>
          <View style={styles.primaryMetric}>
            <Text style={styles.primaryMetricValue}>
              {formatCurrency(item.valor_total)}
            </Text>
            <Text style={styles.primaryMetricLabel}>Total Pago</Text>
          </View>
          
          <View style={styles.secondaryMetrics}>
            <View style={styles.secondaryMetric}>
              <Text style={styles.secondaryMetricValue}>
                {item.quantidade_litros.toFixed(1)}L
              </Text>
              <Text style={styles.secondaryMetricLabel}>Litros</Text>
            </View>
            <View style={styles.secondaryMetric}>
              <Text style={styles.secondaryMetricValue}>
                {formatCurrency(item.valor_litro)}
              </Text>
              <Text style={styles.secondaryMetricLabel}>Preço/L</Text>
            </View>
          </View>
        </View>

        {(item.km_atual || item.nome_posto) && (
          <View style={styles.fuelingDetails}>
            {item.km_atual && (
              <View style={styles.fuelingDetail}>
                <Ionicons name="speedometer" size={14} color={lightTheme.colors.textSecondary} />
                <Text style={styles.fuelingDetailText}>
                  {item.km_atual.toLocaleString('pt-BR')} km
                </Text>
              </View>
            )}
            {item.nome_posto && (
              <View style={styles.fuelingDetail}>
                <Ionicons name="location" size={14} color={lightTheme.colors.textSecondary} />
                <Text style={styles.fuelingDetailText}>
                  {item.nome_posto}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.fuelingActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditFueling', { fuelingId: item.id })}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color={lightTheme.colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteFueling(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={16} color={lightTheme.colors.error} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderFilters = () => (
    <Animated.View
      style={[
        styles.filtersContainer,
        {
          height: filterAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
          opacity: filterAnimation,
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={lightTheme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por posto..."
          placeholderTextColor={lightTheme.colors.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={lightTheme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Veículo:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVehicle}
              onValueChange={setSelectedVehicle}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="" />
              {vehicles.map((vehicle) => (
                <Picker.Item
                  key={vehicle.id}
                  label={`${vehicle.marca} ${vehicle.modelo}`}
                  value={vehicle.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Combustível:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFuelType}
              onValueChange={setSelectedFuelType}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="" />
              <Picker.Item label="Gasolina" value="Gasolina" />
              <Picker.Item label="Etanol" value="Etanol" />
              <Picker.Item label="Diesel" value="Diesel" />
              <Picker.Item label="GNV" value="GNV" />
              <Picker.Item label="Flex" value="Flex" />
            </Picker>
          </View>
        </View>
      </View>

      {getActiveFiltersCount() > 0 && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Ionicons name="refresh" size={16} color={lightTheme.colors.primary} />
          <Text style={styles.clearFiltersText}>Limpar Filtros ({getActiveFiltersCount()})</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonTextLarge} />
        <View style={styles.skeletonBadge} />
      </View>
      <View style={styles.skeletonMetrics}>
        <View style={styles.skeletonTextMedium} />
        <View style={styles.skeletonTextSmall} />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={lightTheme.colors.primary} />
        <Text style={styles.loadingText}>Carregando mais abastecimentos...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={80} color={lightTheme.colors.textTertiary} />
      <Text style={styles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {searchText || selectedVehicle || selectedFuelType
          ? 'Tente ajustar os filtros de busca'
          : 'Registre seu primeiro abastecimento para vê-lo aqui'}
      </Text>
      {!(searchText || selectedVehicle || selectedFuelType) && (
        <TouchableOpacity
          style={styles.emptyAction}
          onPress={() => navigation.navigate('AddFueling')}
        >
          <Text style={styles.emptyActionText}>Adicionar Abastecimento</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={lightTheme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Histórico de Abastecimentos</Text>
          <View style={styles.filterButton} />
        </View>
        <View style={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <React.Fragment key={index}>
              {renderSkeletonItem()}
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={lightTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Abastecimentos</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name={showFilters ? "filter" : "filter-outline"} 
            size={24} 
            color={showFilters ? lightTheme.colors.primary : lightTheme.colors.text} 
          />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && renderFilters()}

      <FlatList
        data={fuelings}
        renderItem={renderFuelingItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[lightTheme.colors.primary]}
            tintColor={lightTheme.colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={fuelings.length > 0 ? renderQuickStats : null}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={fuelings.length === 0 ? styles.emptyList : styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFueling')}
        activeOpacity={0.8}
      >
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
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: lightTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.borderLight,
    ...shadows.sm,
  },
  backButton: {
    padding: spacing[2],
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[4],
  },
  filterButton: {
    padding: spacing[2],
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: lightTheme.colors.error,
    borderRadius: borderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: lightTheme.colors.surface,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },

  // Quick Stats Styles
  quickStatsContainer: {
    backgroundColor: lightTheme.colors.surface,
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.base,
  },
  quickStatsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[4],
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: lightTheme.colors.text,
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  quickStatLabel: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // Filters Styles
  filtersContainer: {
    backgroundColor: lightTheme.colors.surface,
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.borderLight,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: lightTheme.colors.borderLight,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.text,
    fontFamily: typography.fontFamily.regular,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.text,
    marginBottom: spacing[2],
  },
  pickerContainer: {
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.borderLight,
  },
  picker: {
    height: 48,
    color: lightTheme.colors.text,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    marginBottom: spacing[2],
  },
  clearFiltersText: {
    color: lightTheme.colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing[2],
  },

  // List Styles
  listContent: {
    paddingBottom: spacing[20],
  },
  emptyList: {
    flexGrow: 1,
  },

  // Fueling Card Styles
  fuelingCard: {
    backgroundColor: lightTheme.colors.surface,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.base,
  },
  fuelingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  fuelingMainInfo: {
    flex: 1,
  },
  fuelingDate: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },
  fuelingVehicle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.textSecondary,
    marginBottom: spacing[1],
  },
  fuelingPlate: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textTertiary,
    fontFamily: typography.fontFamily.medium,
  },
  fuelTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginLeft: spacing[3],
  },
  fuelTypeText: {
    color: lightTheme.colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[1],
  },

  // Metrics Styles
  fuelingMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  primaryMetric: {
    flex: 1,
  },
  primaryMetricValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: lightTheme.colors.primary,
    marginBottom: spacing[1],
  },
  primaryMetricLabel: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  secondaryMetric: {
    alignItems: 'flex-end',
  },
  secondaryMetricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },
  secondaryMetricLabel: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
  },

  // Details Styles
  fuelingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  fuelingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fuelingDetailText: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    marginLeft: spacing[2],
  },

  // Actions Styles
  fuelingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.borderLight,
    gap: spacing[3],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: lightTheme.colors.primaryLight,
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
  },
  editButtonText: {
    color: lightTheme.colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: `${lightTheme.colors.error}15`,
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: lightTheme.colors.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    paddingTop: spacing[6],
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[5],
  },
  loadingText: {
    marginLeft: spacing[3],
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },

  // Skeleton Styles
  skeletonCard: {
    backgroundColor: lightTheme.colors.surface,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.base,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  skeletonTextLarge: {
    height: 20,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    flex: 1,
    marginRight: spacing[4],
  },
  skeletonBadge: {
    height: 24,
    width: 80,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.full,
  },
  skeletonMetrics: {
    gap: spacing[2],
  },
  skeletonTextMedium: {
    height: 16,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    width: '60%',
  },
  skeletonTextSmall: {
    height: 14,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    width: '40%',
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[10],
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginTop: spacing[6],
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
    marginBottom: spacing[6],
  },
  emptyAction: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  emptyActionText: {
    color: lightTheme.colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },

  // FAB Styles
  addButton: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[6],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: lightTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});

export default FuelingHistoryScreen;

