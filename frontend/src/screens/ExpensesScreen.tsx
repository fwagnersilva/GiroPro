import React, { useState, useEffect } from 'react';
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
import { expenseService, vehicleService } from '../services/api';
import { Expense, Vehicle } from '../types';

interface ExpenseWithVehicle extends Expense {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const ExpensesScreen: React.FC = ({ navigation }: any) => {
  const [expenses, setExpenses] = useState<ExpenseWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
      'Pneus': '#34C759',
      'Seguro': '#007AFF',
      'Outros': '#8E8E93'
    };
    return colors[type] || '#8E8E93';
  };

  const renderExpenseItem = ({ item }: { item: ExpenseWithVehicle }) => (
    <View style={styles.expenseCard}>
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
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.expenseDetails}>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Valor:</Text>
          <Text style={styles.valueAmount}>{formatCurrency(item.valor_despesa)}</Text>
        </View>
        {item.descricao && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Descrição:</Text>
            <Text style={styles.descriptionText}>{item.descricao}</Text>
          </View>
        )}
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
      <Text style={styles.emptyTitle}>Nenhuma despesa encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Registre sua primeira despesa tocando no botão +
      </Text>
    </View>
  );

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
        <Text style={styles.title}>Despesas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpense', { vehicles })}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  expenseTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 14,
    color: '#8E8E93',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 52,
  },
  deleteButton: {
    padding: 4,
  },
  expenseDetails: {
    gap: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
  },
  descriptionContainer: {
    gap: 4,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
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
    color: '#8E8E93',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
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
  },
});

export default ExpensesScreen;

