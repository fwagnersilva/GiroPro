import React, { useState, useEffect, useMemo } from 'react';
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
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/designTokens';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

interface FuelTypeConfig {
  color: string;
  icon: string;
  label: string;
}

const FUEL_TYPE_CONFIG: Record<string, FuelTypeConfig> = {
  'Gasolina': { color: colors.primary[500], icon: 'car', label: 'Gasolina' },
  'Etanol': { color: colors.success[500], icon: 'leaf', label: 'Etanol' },
  'Diesel': { color: colors.warning[500], icon: 'bus', label: 'Diesel' },
  'GNV': { color: colors.secondary[500], icon: 'cloud', label: 'GNV' },
  'Flex': { color: colors.neutral[600], icon: 'swap-horizontal', label: 'Flex' },
};

const FuelingsScreenImproved: React.FC = ({ navigation }: any) => {
  const [fuelings, setFuelings] = useState<FuelingWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Animação para entrada dos cards
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fuelings]);

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

  const loadFuelings = async (pageNumber: number = 1, reset: boolean = false) => {
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
      Alert.alert('Erro', 'Não foi possível carregar os abastecimentos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFuelings(1, true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadFuelings(page + 1, false);
    }
  };

  const handleDeleteFueling = async (id: string) => {
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
  };

  // Filtros aplicados
  const filteredFuelings = useMemo(() => {
    return fuelings.filter(fueling => {
      const matchesSearch = searchQuery === '' || 
        fueling.nome_posto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fueling.veiculo_marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fueling.veiculo_modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fueling.veiculo_placa?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFuelType = selectedFuelType === null || 
        fueling.tipo_combustivel === selectedFuelType;

      return matchesSearch && matchesFuelType;
    });
  }, [fuelings, searchQuery, selectedFuelType]);

  // Estatísticas resumidas
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyFuelings = fuelings.filter(fueling => {
      const fuelingDate = new Date(fueling.data_abastecimento);
      return fuelingDate.getMonth() === currentMonth && 
             fuelingDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyFuelings.reduce((sum, fueling) => sum + fueling.valor_total, 0);
    const totalLiters = monthlyFuelings.reduce((sum, fueling) => sum + fueling.quantidade_litros, 0);
    const averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;

    return {
      totalSpent,
      totalLiters: totalLiters / 1000, // Converter para litros
      averagePrice,
      count: monthlyFuelings.length
    };
  }, [fuelings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatLiters = (milliliters: number) => {
    return (milliliters / 1000).toFixed(2) + 'L';
  };

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonLine, { width: '40%' }]} />
        <View style={[styles.skeletonLine, { width: 20, height: 20, borderRadius: 10 }]} />
      </View>
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '80%' }]} />
        <View style={[styles.skeletonLine, { width: '50%' }]} />
      </View>
    </View>
  );

  const renderFuelTypeFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedFuelType === null && styles.filterChipActive
        ]}
        onPress={() => setSelectedFuelType(null)}
        accessibilityLabel="Mostrar todos os tipos de combustível"
        accessibilityRole="button"
      >
        <Text style={[
          styles.filterChipText,
          selectedFuelType === null && styles.filterChipTextActive
        ]}>
          Todos
        </Text>
      </TouchableOpacity>
      
      {Object.entries(FUEL_TYPE_CONFIG).map(([type, config]) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterChip,
            selectedFuelType === type && styles.filterChipActive,
            selectedFuelType === type && { backgroundColor: config.color }
          ]}
          onPress={() => setSelectedFuelType(selectedFuelType === type ? null : type)}
          accessibilityLabel={`Filtrar por ${config.label}`}
          accessibilityRole="button"
        >
          <Ionicons 
            name={config.icon as any} 
            size={16} 
            color={selectedFuelType === type ? colors.neutral[0] : config.color} 
          />
          <Text style={[
            styles.filterChipText,
            selectedFuelType === type && styles.filterChipTextActive
          ]}>
            {config.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatsHeader = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Resumo do Mês</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatCurrency(stats.totalSpent)}</Text>
          <Text style={styles.statLabel}>Gasto Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalLiters.toFixed(1)}L</Text>
          <Text style={styles.statLabel}>Litros</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.count}</Text>
          <Text style={styles.statLabel}>Abastecimentos</Text>
        </View>
      </View>
    </View>
  );

  const renderFuelingItem = ({ item, index }: { item: FuelingWithVehicle; index: number }) => {
    const fuelConfig = FUEL_TYPE_CONFIG[item.tipo_combustivel] || FUEL_TYPE_CONFIG['Flex'];
    
    return (
      <Animated.View
        style={[
          styles.fuelingCard,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        <View style={styles.fuelingHeader}>
          <View style={styles.fuelingMainInfo}>
            <View style={styles.fuelingDateRow}>
              <Text style={styles.fuelingDate}>{formatDate(item.data_abastecimento)}</Text>
              <View style={[styles.fuelBadge, { backgroundColor: fuelConfig.color }]}>
                <Ionicons name={fuelConfig.icon as any} size={12} color={colors.neutral[0]} />
                <Text style={styles.fuelBadgeText}>{fuelConfig.label}</Text>
              </View>
            </View>
            <Text style={styles.totalValue}>
              {formatCurrency(item.valor_total)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteFueling(item.id)}
            accessibilityLabel={`Excluir abastecimento de ${formatDate(item.data_abastecimento)}`}
            accessibilityRole="button"
            accessibilityHint="Toque duas vezes para excluir este abastecimento"
          >
            <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.vehicleInfo}>
          <Ionicons name="car" size={16} color={colors.neutral[600]} />
          <Text style={styles.vehicleText}>
            {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
          </Text>
        </View>

        <View style={styles.fuelingDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Quantidade</Text>
              <Text style={styles.detailValue}>{formatLiters(item.quantidade_litros)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Preço/L</Text>
              <Text style={styles.detailValue}>{formatCurrency(item.valor_litro)}</Text>
            </View>
          </View>
          
          {(item.nome_posto || item.km_atual) && (
            <View style={styles.secondaryInfo}>
              {item.nome_posto && (
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={14} color={colors.neutral[600]} />
                  <Text style={styles.infoText}>{item.nome_posto}</Text>
                </View>
              )}
              {item.km_atual && (
                <View style={styles.infoRow}>
                  <Ionicons name="speedometer" size={14} color={colors.neutral[600]} />
                  <Text style={styles.infoText}>{item.km_atual.toLocaleString('pt-BR')} km</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="car-outline" size={64} color={colors.neutral[400]} />
      </View>
      <Text style={styles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFuelType 
          ? 'Tente ajustar os filtros ou buscar por outros termos'
          : 'Registre seu primeiro abastecimento tocando no botão +'
        }
      </Text>
      {(!searchQuery && !selectedFuelType) && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('AddFueling', { vehicles })}
          accessibilityLabel="Adicionar primeiro abastecimento"
          accessibilityRole="button"
        >
          <Text style={styles.emptyButtonText}>Adicionar Abastecimento</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Abastecimentos</Text>
          <TouchableOpacity style={styles.addButton} disabled>
            <Ionicons name="add" size={24} color={colors.neutral[0]} />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {[...Array(5)].map((_, index) => (
            <React.Fragment key={index}>
              {renderSkeletonCard()}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abastecimentos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            accessibilityLabel="Alternar filtros"
            accessibilityRole="button"
          >
            <Ionicons 
              name={showFilters ? "funnel" : "funnel-outline"} 
              size={20} 
              color={colors.primary[500]} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFueling', { vehicles })}
            accessibilityLabel="Adicionar novo abastecimento"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={24} color={colors.neutral[0]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.neutral[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por posto, veículo ou placa..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.neutral[500]}
            accessibilityLabel="Campo de busca"
            accessibilityHint="Digite para buscar abastecimentos"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Limpar busca"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={20} color={colors.neutral[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showFilters && renderFuelTypeFilter()}

      <FlatList
        data={filteredFuelings}
        renderItem={renderFuelingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={stats.count > 0 ? renderStatsHeader : null}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: colors.primary[500],
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
    paddingVertical: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },
  filterChipTextActive: {
    color: colors.neutral[0],
  },
  statsContainer: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    ...shadows.sm,
  },
  statsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  listContainer: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  fuelingCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  fuelingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  fuelingMainInfo: {
    flex: 1,
  },
  fuelingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  fuelingDate: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  },
  fuelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  fuelBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[0],
  },
  totalValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success[600],
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error[50],
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  vehicleText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
  },
  fuelingDetails: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  },
  secondaryInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
  },
  loadingFooter: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxxl,
    paddingVertical: spacing.xxxxxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  emptyButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[0],
  },
  skeletonCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  skeletonContent: {
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.sm,
  },
});

export default FuelingsScreenImproved;

