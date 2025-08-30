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
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { expenseService, vehicleService } from '../services/api';
import { Expense, Vehicle } from '../types';
import { Picker } from '@react-native-picker/picker';
import { getTheme, spacing, borderRadius, shadows } from '../theme/tokens';

interface ExpenseWithVehicle extends Expense {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

// Componente de Skeleton Loading
const SkeletonCard: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  
  return (
    <View style={[styles.skeletonCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonLine, styles.skeletonTitle, { backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.skeletonLine, styles.skeletonBadge, { backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
      <View style={[styles.skeletonLine, styles.skeletonAmount, { backgroundColor: theme.colors.surfaceVariant }]} />
      <View style={[styles.skeletonLine, styles.skeletonDescription, { backgroundColor: theme.colors.surfaceVariant }]} />
    </View>
  );
};

// Componente de Chip de Filtro Ativo
const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  
  return (
    <View style={[styles.filterChip, { backgroundColor: theme.colors.primaryLight }]}>
      <Text style={[styles.filterChipText, { color: theme.colors.primary }]}>{label}</Text>
      <TouchableOpacity 
        onPress={onRemove}
        accessibilityLabel={`Remover filtro ${label}`}
        accessibilityRole="button"
      >
        <Ionicons name="close" size={16} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const ExpenseHistoryScreenImproved: React.FC = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  
  const [expenses, setExpenses] = useState<ExpenseWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filtros
  const [searchText, setSearchText] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Recarregar quando filtros mudarem
    if (!loading) {
      loadExpenses(1, true);
    }
  }, [selectedVehicle, selectedExpenseType, searchText]);

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

  const loadExpenses = async (pageNumber: number, reset: boolean = false) => {
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

      if (selectedExpenseType) {
        params.tipo_despesa = selectedExpenseType;
      }

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      const response = await expenseService.getExpenses(params);
      const newExpenses = response.data || [];

      // Enriquecer com dados do veículo
      const enrichedExpenses = newExpenses.map((expense: Expense) => {
        const vehicle = vehicles.find(v => v.id === expense.id_veiculo);
        return {
          ...expense,
          veiculo_marca: vehicle?.marca,
          veiculo_modelo: vehicle?.modelo,
          veiculo_placa: vehicle?.placa,
        };
      });

      if (reset || pageNumber === 1) {
        setExpenses(enrichedExpenses);
        setPage(1);
      } else {
        setExpenses(prev => [...prev, ...enrichedExpenses]);
      }

      setPage(pageNumber);
      setHasMore(newExpenses.length === 20);

    } catch (error: any) {
      console.error('Erro ao carregar despesas:', error);
      Alert.alert('Erro', error.message || 'Não foi possível carregar as despesas');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadExpenses(1, true);
  }, [selectedVehicle, selectedExpenseType, searchText]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadExpenses(page + 1);
    }
  };

  const formatCurrency = (centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos / 100);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getExpenseTypeIcon = (expenseType: string): string => {
    const icons: { [key: string]: string } = {
      'Manutencao': 'build',
      'Pneus': 'ellipse',
      'Seguro': 'shield-checkmark',
      'Outros': 'receipt'
    };
    return icons[expenseType] || 'receipt';
  };

  const getExpenseTypeColor = (expenseType: string): string => {
    const colors: { [key: string]: string } = {
      'Manutencao': theme.colors.warning,
      'Pneus': theme.colors.textSecondary,
      'Seguro': theme.colors.primary,
      'Outros': theme.colors.secondary
    };
    return colors[expenseType] || theme.colors.textSecondary;
  };

  const getExpenseTypeLabel = (expenseType: string): string => {
    const labels: { [key: string]: string } = {
      'Manutencao': 'Manutenção',
      'Pneus': 'Pneus',
      'Seguro': 'Seguro',
      'Outros': 'Outros'
    };
    return labels[expenseType] || expenseType;
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedVehicle('');
    setSelectedExpenseType('');
  };

  const deleteExpense = async (expenseId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(expenseId);
              Alert.alert('Sucesso', 'Despesa excluída com sucesso');
              loadExpenses(1, true);
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível excluir a despesa');
            }
          }
        }
      ]
    );
  };

  // Obter filtros ativos para exibir chips
  const getActiveFilters = () => {
    const filters = [];
    if (selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (vehicle) {
        filters.push({
          key: 'vehicle',
          label: `${vehicle.marca} ${vehicle.modelo}`,
          onRemove: () => setSelectedVehicle('')
        });
      }
    }
    if (selectedExpenseType) {
      filters.push({
        key: 'type',
        label: getExpenseTypeLabel(selectedExpenseType),
        onRemove: () => setSelectedExpenseType('')
      });
    }
    if (searchText) {
      filters.push({
        key: 'search',
        label: `"${searchText}"`,
        onRemove: () => setSearchText('')
      });
    }
    return filters;
  };


  const renderExpenseItem = ({ item }: { item: ExpenseWithVehicle }) => (
    <TouchableOpacity
      style={[styles.expenseCard, { backgroundColor: theme.colors.surface, ...shadows.base }]}
      onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
      accessibilityLabel={`Despesa de ${formatCurrency(item.valor_despesa)} em ${formatDate(item.data_despesa)}`}
      accessibilityRole="button"
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={[styles.expenseDate, { color: theme.colors.text }]}>
            {formatDate(item.data_despesa)}
          </Text>
          {item.veiculo_marca && (
            <Text style={[styles.expenseVehicle, { color: theme.colors.textSecondary }]}>
              {item.veiculo_marca} {item.veiculo_modelo} ({item.veiculo_placa})
            </Text>
          )}
        </View>
        <View style={[styles.expenseTypeBadge, { backgroundColor: getExpenseTypeColor(item.tipo_despesa) }]}>
          <Ionicons 
            name={getExpenseTypeIcon(item.tipo_despesa) as any} 
            size={16} 
            color="#FFF" 
          />
          <Text style={styles.expenseTypeText}>
            {getExpenseTypeLabel(item.tipo_despesa)}
          </Text>
        </View>
      </View>

      <View style={styles.expenseValue}>
        <Ionicons name="wallet" size={20} color={theme.colors.error} />
        <Text style={[styles.expenseAmount, { color: theme.colors.error }]}>
          {formatCurrency(item.valor_despesa)}
        </Text>
      </View>

      {item.descricao && (
        <View style={styles.expenseDescription}>
          <Ionicons name="document-text" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.expenseDescriptionText, { color: theme.colors.textSecondary }]} numberOfLines={3}>
            {item.descricao}
          </Text>
        </View>
      )}

      <View style={styles.expenseActions}>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => navigation.navigate('EditExpense', { expenseId: item.id })}
          accessibilityLabel="Editar despesa"
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={16} color={theme.colors.primary} />
          <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: `${theme.colors.error}15` }]}
          onPress={() => deleteExpense(item.id)}
          accessibilityLabel="Excluir despesa"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={16} color={theme.colors.error} />
          <Text style={[styles.deleteButtonText, { color: theme.colors.error }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={[styles.filtersContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Buscar por descrição..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          accessibilityLabel="Campo de busca por descrição"
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchText('')}
            accessibilityLabel="Limpar busca"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Veículo:</Text>
          <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
            <Picker
              selectedValue={selectedVehicle}
              onValueChange={setSelectedVehicle}
              style={[styles.picker, { color: theme.colors.text }]}
              accessibilityLabel="Filtro por veículo"
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
          <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Categoria:</Text>
          <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
            <Picker
              selectedValue={selectedExpenseType}
              onValueChange={setSelectedExpenseType}
              style={[styles.picker, { color: theme.colors.text }]}
              accessibilityLabel="Filtro por categoria"
            >
              <Picker.Item label="Todas" value="" />
              <Picker.Item label="Manutenção" value="Manutencao" />
              <Picker.Item label="Pneus" value="Pneus" />
              <Picker.Item label="Seguro" value="Seguro" />
              <Picker.Item label="Outros" value="Outros" />
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.clearFiltersButton} 
        onPress={clearFilters}
        accessibilityLabel="Limpar todos os filtros"
        accessibilityRole="button"
      >
        <Ionicons name="refresh" size={16} color={theme.colors.primary} />
        <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>Limpar Filtros</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveFilters = () => {
    const activeFilters = getActiveFilters();
    if (activeFilters.length === 0) return null;

    return (
      <View style={[styles.activeFiltersContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.activeFiltersLabel, { color: theme.colors.textSecondary }]}>
          Filtros ativos:
        </Text>
        <View style={styles.activeFiltersRow}>
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              onRemove={filter.onRemove}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Carregando mais despesas...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color={theme.colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Nenhuma despesa encontrada
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {searchText || selectedVehicle || selectedExpenseType
          ? 'Tente ajustar os filtros de busca'
          : 'Registre sua primeira despesa para vê-la aqui'}
      </Text>
      {!searchText && !selectedVehicle && !selectedExpenseType && (
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AddExpense')}
          accessibilityLabel="Adicionar primeira despesa"
          accessibilityRole="button"
        >
          <Text style={styles.emptyButtonText}>Adicionar Despesa</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSummary = () => {
    if (expenses.length === 0) return null;

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.valor_despesa, 0);
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.tipo_despesa;
      acc[category] = (acc[category] || 0) + expense.valor_despesa;
      return acc;
    }, {} as { [key: string]: number });

    const topCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    return (
      <View style={[styles.summaryContainer, { backgroundColor: theme.colors.surface, ...shadows.base }]}>
        <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
          Resumo do Período
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Total de Despesas
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Maior Categoria
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {topCategory ? getExpenseTypeLabel(topCategory[0]) : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSkeletonList = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Histórico de Despesas</Text>
          <View style={styles.headerSpacer} />
        </View>
        {renderSkeletonList()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Histórico de Despesas</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          accessibilityLabel={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          accessibilityRole="button"
        >
          <Ionicons 
            name={showFilters ? "filter" : "filter-outline"} 
            size={24} 
            color={showFilters ? theme.colors.primary : theme.colors.text} 
          />
          {getActiveFilters().length > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: theme.colors.error }]}>
              <Text style={styles.filterBadgeText}>{getActiveFilters().length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && renderFilters()}
      {renderActiveFilters()}
      {renderSummary()}

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary, ...shadows.lg }]}
        onPress={() => navigation.navigate('AddExpense')}
        accessibilityLabel="Adicionar nova despesa"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing[1],
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[5],
  },
  filterButton: {
    padding: spacing[1],
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  filtersContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    marginBottom: spacing[4],
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  filterItem: {
    flex: 1,
    marginHorizontal: spacing[1],
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  pickerContainer: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    height: 48,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    minHeight: 44,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing[1],
  },
  activeFiltersContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  activeFiltersLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    gap: spacing[1],
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryContainer: {
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: spacing[1],
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: spacing[20],
  },
  expenseCard: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  expenseVehicle: {
    fontSize: 14,
  },
  expenseTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    gap: spacing[1],
  },
  expenseTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expenseValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  expenseDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  expenseDescriptionText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: spacing[2],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    gap: spacing[1],
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    gap: spacing[1],
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[5],
    gap: spacing[2],
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[10],
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  emptyButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: spacing[5],
    right: spacing[5],
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Skeleton Loading Styles
  skeletonContainer: {
    paddingTop: spacing[3],
  },
  skeletonCard: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  skeletonLine: {
    borderRadius: borderRadius.sm,
  },
  skeletonTitle: {
    width: '60%',
    height: 16,
  },
  skeletonBadge: {
    width: 80,
    height: 24,
    borderRadius: borderRadius.full,
  },
  skeletonAmount: {
    width: '40%',
    height: 20,
    marginBottom: spacing[2],
  },
  skeletonDescription: {
    width: '80%',
    height: 14,
  },
});

export default ExpenseHistoryScreenImproved;

