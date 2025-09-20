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
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';
import { Picker } from '@react-native-picker/picker';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Recarregar quando filtros mudarem
    if (!loading) {
      loadFuelings(1, true);
    }
  }, [selectedVehicle, selectedFuelType, searchText]);

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

      // Enriquecer com dados do veículo
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
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
      'Gasolina': '#FF3B30',
      'Etanol': '#34C759',
      'Diesel': '#8E8E93',
      'GNV': '#007AFF',
      'Flex': '#FF9500'
    };
    return colors[fuelType] || '#8E8E93';
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedVehicle('');
    setSelectedFuelType('');
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

  const renderFuelingItem = ({ item }: { item: FuelingWithVehicle }) => (
    <TouchableOpacity
      style={styles.fuelingCard}
      onPress={() => navigation.navigate('FuelingDetails', { fuelingId: item.id })}
    >
      <View style={styles.fuelingHeader}>
        <View style={styles.fuelingInfo}>
          <Text style={styles.fuelingDate}>
            {formatDate(item.data_abastecimento)}
          </Text>
          <Text style={styles.fuelingVehicle}>
            {item.veiculo_marca} {item.veiculo_modelo} ({item.veiculo_placa})
          </Text>
        </View>
        <View style={[styles.fuelTypeBadge, { backgroundColor: getFuelTypeColor(item.tipo_combustivel) }]}>
          <Ionicons 
            name={getFuelTypeIcon(item.tipo_combustivel) as any} 
            size={16} 
            color="#FFF" 
          />
          <Text style={styles.fuelTypeText}>{item.tipo_combustivel}</Text>
        </View>
      </View>

      <View style={styles.fuelingMetrics}>
        <View style={styles.metric}>
          <Ionicons name="speedometer" size={16} color="#666" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Litros</Text>
            <Text style={styles.metricValue}>
              {item.quantidade_litros.toFixed(2)}L
            </Text>
          </View>
        </View>

        <View style={styles.metric}>
          <Ionicons name="pricetag" size={16} color="#666" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Preço/L</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(item.valor_litro)}
            </Text>
          </View>
        </View>

        <View style={styles.metric}>
          <Ionicons name="wallet" size={16} color="#666" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={[styles.metricValue, styles.totalValue]}>
              {formatCurrency(item.valor_total)}
            </Text>
          </View>
        </View>
      </View>

      {item.km_atual && (
        <View style={styles.fuelingKm}>
          <Ionicons name="car-sport" size={14} color="#666" />
          <Text style={styles.fuelingKmText}>
            Quilometragem: {item.km_atual.toLocaleString('pt-BR')} km
          </Text>
        </View>
      )}

      {item.nome_posto && (
        <View style={styles.fuelingStation}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.fuelingStationText}>
            {item.nome_posto}
          </Text>
        </View>
      )}

      <View style={styles.fuelingActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditFueling', { fuelingId: item.id })}
        >
          <Ionicons name="pencil" size={16} color="#007AFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteFueling(item.id)}
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
          placeholder="Buscar por posto..."
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
        <Text style={styles.loadingText}>Carregando mais abastecimentos...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>Nenhum abastecimento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {searchText || selectedVehicle || selectedFuelType
          ? 'Tente ajustar os filtros de busca'
          : 'Registre seu primeiro abastecimento para vê-lo aqui'}
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Abastecimentos</Text>
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

      <FlatList
        data={fuelings}
        renderItem={renderFuelingItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={fuelings.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFueling')}
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
  fuelingCard: {
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
    color: '#333',
    marginBottom: 4,
  },
  fuelingVehicle: {
    fontSize: 14,
    color: '#666',
  },
  fuelTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fuelTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  fuelingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricInfo: {
    marginLeft: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    color: '#FF3B30',
  },
  fuelingKm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fuelingKmText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  fuelingStation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fuelingStationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  fuelingActions: {
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

export default FuelingHistoryScreen;

