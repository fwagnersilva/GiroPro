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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { expenseService, vehicleService } from '../services/api';
import { Expense, Vehicle } from '../types';
import { Picker } from '@react-native-picker/picker';

interface ExpenseWithVehicle extends Expense {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const ExpenseHistoryScreen: React.FC = ({ navigation }: any) => {
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
      'Manutencao': '#FF9500',
      'Pneus': '#8E8E93',
      'Seguro': '#007AFF',
      'Outros': '#AF52DE'
    };
    return colors[expenseType] || '#8E8E93';
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
      'Tem certeza que deseja excluir esta despesa?',
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

  const renderExpenseItem = ({ item }: { item: ExpenseWithVehicle }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDate}>
            {formatDate(item.data_despesa)}
          </Text>
          {item.veiculo_marca && (
            <Text style={styles.expenseVehicle}>
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
        <Ionicons name="wallet" size={20} color="#FF3B30" />
        <Text style={styles.expenseAmount}>
          {formatCurrency(item.valor_despesa)}
        </Text>
      </View>

      {item.descricao && (
        <View style={styles.expenseDescription}>
          <Ionicons name="document-text" size={16} color="#666" />
          <Text style={styles.expenseDescriptionText} numberOfLines={3}>
            {item.descricao}
          </Text>
        </View>
      )}

      <View style={styles.expenseActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditExpense', { expenseId: item.id })}
        >
          <Ionicons name="pencil" size={16} color="#007AFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteExpense(item.id)}
        >
          <Ionicons name="trash" size={16} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por descrição..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
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
          <Text style={styles.filterLabel}>Categoria:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedExpenseType}
              onValueChange={setSelectedExpenseType}
              style={styles.picker}
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

      <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
        <Ionicons name="refresh" size={16} color="#007AFF" />
        <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color="#007AFF" />
        <Text style={styles.loadingText}>Carregando mais despesas...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>Nenhuma despesa encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {searchText || selectedVehicle || selectedExpenseType
          ? 'Tente ajustar os filtros de busca'
          : 'Registre sua primeira despesa para vê-la aqui'}
      </Text>
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
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Período</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Despesas</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Maior Categoria</Text>
            <Text style={styles.summaryValue}>
              {topCategory ? getExpenseTypeLabel(topCategory[0]) : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando despesas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Despesas</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name={showFilters ? "filter" : "filter-outline"} 
            size={24} 
            color={showFilters ? "#007AFF" : "#333"} 
          />
        </TouchableOpacity>
      </View>

      {showFilters && renderFilters()}
      {renderSummary()}

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  filterButton: {
    padding: 5,
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    height: 40,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  clearFiltersText: {
    color: '#007AFF',
    fontSize: 14,
    marginLeft: 5,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  expenseCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseVehicle: {
    fontSize: 14,
    color: '#666',
  },
  expenseTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expenseTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  expenseValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
  expenseDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseDescriptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ExpenseHistoryScreen;

