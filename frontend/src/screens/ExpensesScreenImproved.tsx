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
  Modal,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { expenseService, vehicleService } from '../services/api';
import { Expense, Vehicle } from '../types';

interface ExpenseWithVehicle extends Expense {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

interface FilterState {
  dateRange: 'today' | 'week' | 'month' | '3months' | 'year' | 'custom';
  categories: string[];
  vehicles: string[];
  searchText: string;
}

const ExpensesScreenImproved: React.FC = ({ navigation }: any) => {
  const [expenses, setExpenses] = useState<ExpenseWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'month',
    categories: [],
    vehicles: [],
    searchText: '',
  });

  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadExpenses(1, true),
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

  const loadExpenses = async (pageNumber: number = 1, reset: boolean = false) => {
    try {
      const response = await expenseService.getExpenses({
        page: pageNumber,
        limit: 20
      });

      if (reset) {
        setExpenses(response.data);
      } else {
        setExpenses(prev => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.hasNext);
      setPage(pageNumber);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as despesas');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses(1, true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadExpenses(page + 1, false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(id);
              setExpenses(prev => prev.filter(expense => expense.id !== id));
              Alert.alert('Sucesso', 'Despesa excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir despesa:', error);
              Alert.alert('Erro', 'Não foi possível excluir a despesa');
            }
          }
        }
      ]
    );
  };

  const handleEditExpense = (expense: ExpenseWithVehicle) => {
    navigation.navigate('EditExpense', { expense, vehicles });
  };

  // Filtros e busca
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filtro por texto de busca
    if (filters.searchText) {
      filtered = filtered.filter(expense =>
        expense.descricao?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        expense.tipo_despesa.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    // Filtro por categorias
    if (filters.categories.length > 0) {
      filtered = filtered.filter(expense =>
        filters.categories.includes(expense.tipo_despesa)
      );
    }

    // Filtro por veículos
    if (filters.vehicles.length > 0) {
      filtered = filtered.filter(expense =>
        expense.id_veiculo && filters.vehicles.includes(expense.id_veiculo)
      );
    }

    // Filtro por data
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.data_despesa);
          return expenseDate >= today;
        });
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.data_despesa);
          return expenseDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.data_despesa);
          return expenseDate >= monthAgo;
        });
        break;
      case '3months':
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.data_despesa);
          return expenseDate >= threeMonthsAgo;
        });
        break;
      case 'year':
        const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.data_despesa);
          return expenseDate >= yearAgo;
        });
        break;
    }

    return filtered;
  }, [expenses, filters]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.valor_despesa, 0);
  }, [filteredExpenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getExpenseTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'Manutencao': 'Manutenção',
      'Pneus': 'Pneus',
      'Seguro': 'Seguro',
      'Outros': 'Outros'
    };
    return types[type] || type;
  };

  const getExpenseTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Manutencao': 'build-outline',
      'Pneus': 'ellipse-outline',
      'Seguro': 'shield-outline',
      'Outros': 'receipt-outline'
    };
    return icons[type] || 'receipt-outline';
  };

  const getExpenseTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Manutencao': '#FF9500',
      'Pneus': '#4A4A4A',
      'Seguro': '#007AFF',
      'Outros': '#8E8E93'
    };
    return colors[type] || '#8E8E93';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.vehicles.length > 0) count++;
    if (filters.dateRange !== 'month') count++;
    return count;
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'month',
      categories: [],
      vehicles: [],
      searchText: '',
    });
  };

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonTextContainer}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonSubtitle} />
        </View>
        <View style={styles.skeletonAmount} />
      </View>
      <View style={styles.skeletonDescription} />
    </View>
  );

  const renderExpenseItem = ({ item }: { item: ExpenseWithVehicle }) => (
    <TouchableOpacity
      style={[styles.expenseCard, isTablet && styles.expenseCardTablet]}
      onPress={() => handleEditExpense(item)}
      activeOpacity={0.7}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <View style={styles.expenseTypeContainer}>
            <View style={[
              styles.expenseTypeIcon,
              { backgroundColor: getExpenseTypeColor(item.tipo_despesa) + '20' }
            ]}>
              <Ionicons
                name={getExpenseTypeIcon(item.tipo_despesa) as any}
                size={20}
                color={getExpenseTypeColor(item.tipo_despesa)}
              />
            </View>
            <View style={styles.expenseTypeInfo}>
              <Text style={styles.expenseType}>
                {getExpenseTypeLabel(item.tipo_despesa)}
              </Text>
              <Text style={styles.expenseDate}>{formatDate(item.data_despesa)}</Text>
            </View>
          </View>
          {item.veiculo_marca && (
            <Text style={styles.vehicleInfo}>
              {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
            </Text>
          )}
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.valueAmount}>{formatCurrency(item.valor_despesa)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteExpense(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {item.descricao && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.descricao}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filtros</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.modalClearButton}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          {/* Filtros de data */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Período</Text>
            <View style={styles.filterChips}>
              {[
                { key: 'today', label: 'Hoje' },
                { key: 'week', label: 'Esta semana' },
                { key: 'month', label: 'Este mês' },
                { key: '3months', label: 'Últimos 3 meses' },
                { key: 'year', label: 'Este ano' },
              ].map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.filterChip,
                    filters.dateRange === period.key && styles.filterChipActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, dateRange: period.key as any }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.dateRange === period.key && styles.filterChipTextActive
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filtros de categoria */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Categorias</Text>
            <View style={styles.filterChips}>
              {[
                { key: 'Manutencao', label: 'Manutenção', color: '#FF9500' },
                { key: 'Pneus', label: 'Pneus', color: '#4A4A4A' },
                { key: 'Seguro', label: 'Seguro', color: '#007AFF' },
                { key: 'Outros', label: 'Outros', color: '#8E8E93' },
              ].map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.filterChip,
                    filters.categories.includes(category.key) && styles.filterChipActive
                  ]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.includes(category.key)
                        ? prev.categories.filter(c => c !== category.key)
                        : [...prev.categories, category.key]
                    }));
                  }}
                >
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={[
                    styles.filterChipText,
                    filters.categories.includes(category.key) && styles.filterChipTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSummaryHeader = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total do Período</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Despesas</Text>
        <Text style={styles.summaryCount}>{filteredExpenses.length}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color="#8E8E93" />
      <Text style={styles.emptyTitle}>
        {filters.searchText || getActiveFiltersCount() > 0
          ? 'Nenhuma despesa encontrada'
          : 'Nenhuma despesa registrada'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {filters.searchText || getActiveFiltersCount() > 0
          ? 'Tente ajustar os filtros ou busca'
          : 'Registre sua primeira despesa tocando no botão +'
        }
      </Text>
      {(filters.searchText || getActiveFiltersCount() > 0) && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersButtonText}>Limpar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Despesas</Text>
        </View>
        <View style={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Despesas</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, getActiveFiltersCount() > 0 && styles.headerButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={24} color="#007AFF" />
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddExpense', { vehicles })}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar despesas..."
              value={filters.searchText}
              onChangeText={(text) => setFilters(prev => ({ ...prev, searchText: text }))}
              autoFocus
            />
            {filters.searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setFilters(prev => ({ ...prev, searchText: '' }))}
              >
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {renderSummaryHeader()}

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 'tablet' : 'mobile'}
      />

      {renderFilterModal()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  headerButtonActive: {
    backgroundColor: '#007AFF20',
    borderRadius: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  listContainerTablet: {
    paddingHorizontal: 24,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseCardTablet: {
    marginHorizontal: 4,
    flex: 0.5,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  expenseTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseTypeInfo: {
    flex: 1,
  },
  expenseType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 48,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  valueAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  deleteButton: {
    padding: 4,
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  // Skeleton loading styles
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 6,
    width: '60%',
  },
  skeletonSubtitle: {
    height: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    width: '40%',
  },
  skeletonAmount: {
    height: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    width: 80,
  },
  skeletonDescription: {
    height: 14,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    width: '80%',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalClearButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#000000',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ExpensesScreenImproved;

