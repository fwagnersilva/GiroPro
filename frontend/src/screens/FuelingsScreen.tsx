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
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const FuelingsScreen: React.FC = ({ navigation }: any) => {
  const [fuelings, setFuelings] = useState<FuelingWithVehicle[]>([]);
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

  const renderFuelingItem = ({ item }: { item: FuelingWithVehicle }) => (
    <View style={styles.fuelingCard}>
      <View style={styles.fuelingHeader}>
        <View style={styles.fuelingInfo}>
          <Text style={styles.fuelingDate}>{formatDate(item.data_abastecimento)}</Text>
          <Text style={styles.vehicleInfo}>
            {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteFueling(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.fuelingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Combustível:</Text>
          <Text style={styles.detailValue}>{item.tipo_combustivel}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantidade:</Text>
          <Text style={styles.detailValue}>{formatLiters(item.quantidade_litros)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valor/Litro:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.valor_litro)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            {formatCurrency(item.valor_total)}
          </Text>
        </View>
        {item.nome_posto && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posto:</Text>
            <Text style={styles.detailValue}>{item.nome_posto}</Text>
          </View>
        )}
        {item.km_atual && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>KM:</Text>
            <Text style={styles.detailValue}>{item.km_atual.toLocaleString('pt-BR')}</Text>
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
      <Ionicons name="car-outline" size={64} color="#8E8E93" />
      <Text style={styles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Registre seu primeiro abastecimento tocando no botão +
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando abastecimentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abastecimentos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFueling', { vehicles })}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={fuelings}
        renderItem={renderFuelingItem}
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
  fuelingCard: {
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
  fuelingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fuelingInfo: {
    flex: 1,
  },
  fuelingDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 4,
  },
  fuelingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
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

export default FuelingsScreen;

