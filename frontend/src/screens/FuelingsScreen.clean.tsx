import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from '../components/Icon';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../utils/alert';
import { platformStyles, platformValue } from '../utils/platform';

// Mock de serviço de abastecimento e veículo
const fuelingService = {
  getFuelings: async (params: { page: number; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockFuelings = [
      { id: '1', data_abastecimento: '2025-09-01T10:00:00Z', tipo_combustivel: 'Gasolina', quantidade_litros: 40000, valor_litro: 549, km_atual: 120000, nome_posto: 'Posto Ipiranga', valor_total: 21960 },
      { id: '2', data_abastecimento: '2025-09-02T11:00:00Z', tipo_combustivel: 'Etanol', quantidade_litros: 30000, valor_litro: 399, km_atual: 120500, nome_posto: 'Posto Shell', valor_total: 11970 },
      { id: '3', data_abastecimento: '2025-09-03T12:00:00Z', tipo_combustivel: 'Diesel', quantidade_litros: 50000, valor_litro: 650, km_atual: 121000, nome_posto: 'Posto Petrobras', valor_total: 32500 },
      { id: '4', data_abastecimento: '2025-09-04T13:00:00Z', tipo_combustivel: 'Gasolina', quantidade_litros: 35000, valor_litro: 559, km_atual: 121500, nome_posto: 'Posto BR', valor_total: 19565 },
      { id: '5', data_abastecimento: '2025-09-05T14:00:00Z', tipo_combustivel: 'Flex', quantidade_litros: 42000, valor_litro: 480, km_atual: 122000, nome_posto: 'Posto Ale', valor_total: 20160 },
    ];
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const data = mockFuelings.slice(start, end);
    return { data, pagination: { hasNext: end < mockFuelings.length } };
  },
  deleteFueling: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Abastecimento ${id} excluído.`);
    return { success: true };
  },
};

const vehicleService = {
  getVehicles: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', marca: 'Fiat', modelo: 'Uno', placa: 'ABC-1234' },
      { id: '2', marca: 'Chevrolet', modelo: 'Onix', placa: 'DEF-5678' },
    ];
  },
};

interface Fueling {
  id: string;
  data_abastecimento: string;
  tipo_combustivel: string;
  quantidade_litros: number;
  valor_litro: number;
  km_atual?: number;
  nome_posto?: string;
  valor_total: number;
}

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
}

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const FuelingsScreenClean: React.FC<any> = ({ navigation }) => {
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
        limit: 5 // Reduced limit for mock data
      });

      const fuelingsWithVehicleInfo = response.data.map(fueling => {
        const vehicle = vehicles.find(v => v.id === fueling.id_veiculo);
        return {
          ...fueling,
          veiculo_marca: vehicle?.marca,
          veiculo_modelo: vehicle?.modelo,
          veiculo_placa: vehicle?.placa,
        };
      });

      if (reset) {
        setFuelings(fuelingsWithVehicleInfo);
      } else {
        setFuelings(prev => [...prev, ...fuelingsWithVehicleInfo]);
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
          {item.veiculo_marca && (
            <Text style={styles.vehicleInfo}>
              {item.veiculo_marca} {item.veiculo_modelo} - {item.veiculo_placa}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteFueling(item.id)}
        >
          <Icon name="trash-outline" size={20} color="#FF3B30" />
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
        <LoadingSpinner size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="car-outline" size={64} color="#8E8E93" />
      <Text style={styles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Registre seu primeiro abastecimento tocando no botão +
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" color="#007AFF" />
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
          onPress={() => navigation.navigate('AddFueling')}
        >
          <Icon name="add-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={fuelings}
        renderItem={renderFuelingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <View style={{ backgroundColor: '#F5F5F5' }}>
            <LoadingSpinner size="small" color="#007AFF" />
          </View>
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
    ...platformStyles({
      web: {
        minHeight: '100vh',
      },
    }),
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
    ...platformStyles({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
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
    ...platformStyles({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
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
    minHeight: platformValue({ web: '400px', default: 400 }),
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
    minHeight: platformValue({ web: '400px', default: 400 }),
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

export default FuelingsScreenClean;

