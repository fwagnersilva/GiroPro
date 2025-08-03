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
import { expenseService, vehicleService } from '../services/api';
import { Expense, Vehicle } from '../types';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

interface ExpenseWithVehicle extends Expense {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const ExpensesScreenOptimized: React.FC = ({ navigation }: any) => {
  const [expenses, setExpenses] = useState<ExpenseWithVehicle[]>([]);
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

  const loadExpenses = useCallback(async (pageNumber: number = 1, reset: boolean = false) => {
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
      if (isWeb()) {
        alert('Não foi possível carregar as despesas');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as despesas');
      }
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadExpenses(1, true),
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
  }, [loadExpenses, loadVehicles]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses(1, true);
    setRefreshing(false);
  }, [loadExpenses]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadExpenses(page + 1, false);
    }
  }, [hasMore, loading, page, loadExpenses]);

  const handleDeleteExpense = useCallback(async (id: string) => {
    if (isWeb()) {
      if (confirm('Tem certeza que deseja excluir esta despesa?')) {
        try {
          await expenseService.deleteExpense(id);
          setExpenses(prev => prev.filter(expense => expense.id !== id));
          alert('Despesa excluída com sucesso');
        } catch (error) {
          console.error('Erro ao excluir despesa:', error);
          alert('Não foi possível excluir a despesa');
        }
      }
    } else {
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

  const getExpenseTypeLabel = useCallback((type: string) => {
    const types: { [key: string]: string } = {
      'Manutencao': 'Manutenção',
      'Pneus': 'Pneus',
      'Seguro': 'Seguro',
      'Outros': 'Outros'
    };
    return types[type] || type;
  }, []);

  const getExpenseTypeIcon = useCallback((type: string) => {
    const icons: { [key: string]: string } = {
      'Manutencao': 'build-outline',
      'Pneus': 'ellipse-outline',
      'Seguro': 'shield-outline',
      'Outros': 'receipt-outline'
    };
    return icons[type] || 'receipt-outline';
  }, []);

  const getExpenseTypeColor = useCallback((type: string) => {
    const colors: { [key: string]: string } = {
      'Manutencao': '#FF9500',
      'Pneus': '#34C759',
      'Seguro': '#007AFF',
      'Outros': '#8E8E93'
    };
    return colors[type] || '#8E8E93';
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
    expenseCard: {
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
    expenseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    expenseInfo: {
      flex: 1,
    },
    expenseTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    expenseTypeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    expenseTypeInfo: {
      flex: 1,
    },
    expenseType: {
      ...typography.body,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 2,
    },
    expenseDate: {
      ...typography.caption,
      color: '#8E8E93',
    },
    vehicleInfo: {
      ...typography.caption,
      color: '#8E8E93',
      marginLeft: 52, // Alinhar com o texto acima do ícone
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
    expenseDetails: {
      gap: spacing.sm,
    },
    valueContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    valueLabel: {
      ...typography.caption,
      color: '#8E8E93',
    },
    valueAmount: {
      ...typography.body,
      fontWeight: '600',
      color: '#FF3B30',
    },
    descriptionContainer: {
      gap: spacing.xs,
    },
    descriptionLabel: {
      ...typography.caption,
      color: '#8E8E93',
    },
    descriptionText: {
      ...typography.caption,
      color: '#000000',
      lineHeight: typography.caption.lineHeight,
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

  const renderExpenseItem = useCallback(({ item }: { item: ExpenseWithVehicle }) => (
    <View style={responsiveStyles.expenseCard}>
      <View style={responsiveStyles.expenseHeader}>
        <View style={responsiveStyles.expenseInfo}>
          <View style={responsiveStyles.expenseTypeContainer}>
            <View style={[
              responsiveStyles.expenseTypeIcon,
              { backgroundColor: getExpenseTypeColor(item.tipo_despesa) + '20' }
            ]}>
              <Ionicons
                name={getExpenseTypeIcon(item.tipo_despesa) as any}
                size={20}
                color={getExpenseTypeColor(item.tipo_despesa)}
              />
            </View>
            <View style={responsiveStyles.expenseTypeInfo}>
              <Text style={responsiveStyles.expenseType}>
                {getExpenseTypeLabel(item.tipo_despesa)}
              </Text>
              <Text style={responsiveStyles.expenseDate}>{formatDate(item.data_despesa)}</Text>
            </View>
          </View>
          {item.veiculo_marca && (
            <Text style={responsiveStyles.vehicleInfo}>
              {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={responsiveStyles.deleteButton}
          onPress={() => handleDeleteExpense(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={responsiveStyles.expenseDetails}>
        <View style={responsiveStyles.valueContainer}>
          <Text style={responsiveStyles.valueLabel}>Valor:</Text>
          <Text style={responsiveStyles.valueAmount}>{formatCurrency(item.valor_despesa)}</Text>
        </View>
        {item.descricao && (
          <View style={responsiveStyles.descriptionContainer}>
            <Text style={responsiveStyles.descriptionLabel}>Descrição:</Text>
            <Text style={responsiveStyles.descriptionText}>{item.descricao}</Text>
          </View>
        )}
      </View>
    </View>
  ), [getExpenseTypeColor, getExpenseTypeIcon, getExpenseTypeLabel, formatDate, handleDeleteExpense, formatCurrency, responsiveStyles]);

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
      <Ionicons name="receipt-outline" size={64} color="#8E8E93" />
      <Text style={responsiveStyles.emptyTitle}>Nenhuma despesa encontrada</Text>
      <Text style={responsiveStyles.emptySubtitle}>
        Registre sua primeira despesa tocando no botão +
      </Text>
    </View>
  ), [responsiveStyles]);

  if (loading) {
    return (
      <View style={responsiveStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={responsiveStyles.loadingText}>Carregando despesas...</Text>
      </View>
    );
  }

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.header}>
        <Text style={responsiveStyles.title}>Despesas</Text>
        <TouchableOpacity
          style={responsiveStyles.addButton}
          onPress={() => navigation.navigate('AddExpense', { vehicles })}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
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

export default ExpensesScreenOptimized;


