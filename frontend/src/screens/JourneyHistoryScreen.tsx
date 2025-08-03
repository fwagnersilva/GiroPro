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
import { journeyService, vehicleService } from '../services/api';
import { Journey, Vehicle } from '../types';
import { Picker } from '@react-native-picker/picker';

interface JourneyWithVehicle extends Journey {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

const JourneyHistoryScreen: React.FC = ({ navigation }: any) => {
  const [journeys, setJourneys] = useState<JourneyWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filtros
  const [searchText, setSearchText] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'active'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Recarregar quando filtros mudarem
    if (!loading) {
      loadJourneys(1, true);
    }
  }, [selectedVehicle, selectedStatus, searchText]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadJourneys(1, true),
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

  const loadJourneys = async (pageNumber: number, reset: boolean = false) => {
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

      if (selectedStatus === 'completed') {
        params.status = 'finalizada';
      } else if (selectedStatus === 'active') {
        params.status = 'ativa';
      }

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      const response = await journeyService.getJourneys(params);
      const newJourneys = response.data || [];

      // Enriquecer com dados do veículo
      const enrichedJourneys = newJourneys.map((journey: Journey) => {
        const vehicle = vehicles.find(v => v.id === journey.id_veiculo);
        return {
          ...journey,
          veiculo_marca: vehicle?.marca,
          veiculo_modelo: vehicle?.modelo,
          veiculo_placa: vehicle?.placa,
        };
      });

      if (reset || pageNumber === 1) {
        setJourneys(enrichedJourneys);
        setPage(1);
      } else {
        setJourneys(prev => [...prev, ...enrichedJourneys]);
      }

      setPage(pageNumber);
      setHasMore(newJourneys.length === 20); // Se retornou menos que o limite, não há mais páginas

    } catch (error: any) {
      console.error('Erro ao carregar jornadas:', error);
      Alert.alert('Erro', error.message || 'Não foi possível carregar as jornadas');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadJourneys(1, true);
  }, [selectedVehicle, selectedStatus, searchText]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadJourneys(page + 1);
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

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (journey: Journey): string => {
    if (!journey.data_fim) return '#FF9500'; // Ativa
    return '#34C759'; // Finalizada
  };

  const getStatusText = (journey: Journey): string => {
    if (!journey.data_fim) return 'Em andamento';
    return 'Finalizada';
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedVehicle('');
    setSelectedStatus('all');
  };

  const renderJourneyItem = ({ item }: { item: JourneyWithVehicle }) => (
    <TouchableOpacity
      style={styles.journeyCard}
      onPress={() => navigation.navigate('JourneyDetails', { journeyId: item.id })}
    >
      <View style={styles.journeyHeader}>
        <View style={styles.journeyInfo}>
          <Text style={styles.journeyDate}>
            {formatDate(item.data_inicio)}
          </Text>
          <Text style={styles.journeyVehicle}>
            {item.veiculo_marca} {item.veiculo_modelo} ({item.veiculo_placa})
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
          <Text style={styles.statusText}>{getStatusText(item)}</Text>
        </View>
      </View>

      <View style={styles.journeyDetails}>
        <View style={styles.journeyTime}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.journeyTimeText}>
            {formatTime(item.data_inicio)}
            {item.data_fim && ` - ${formatTime(item.data_fim)}`}
          </Text>
        </View>

        {item.tempo_total && (
          <View style={styles.journeyDuration}>
            <Ionicons name="hourglass" size={16} color="#666" />
            <Text style={styles.journeyDurationText}>
              {formatDuration(item.tempo_total)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.journeyMetrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>KM</Text>
          <Text style={styles.metricValue}>
            {item.km_total || (item.km_fim && item.km_inicio ? item.km_fim - item.km_inicio : 0)} km
          </Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Ganho</Text>
          <Text style={[styles.metricValue, styles.gainValue]}>
            {formatCurrency(item.ganho_bruto || 0)}
          </Text>
        </View>

        {item.km_total && item.ganho_bruto && (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>R$/KM</Text>
            <Text style={styles.metricValue}>
              {formatCurrency((item.ganho_bruto / item.km_total) * 100)}
            </Text>
          </View>
        )}
      </View>

      {item.observacoes && (
        <View style={styles.journeyNotes}>
          <Ionicons name="document-text" size={14} color="#666" />
          <Text style={styles.journeyNotesText} numberOfLines={2}>
            {item.observacoes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por observações..."
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
          <Text style={styles.filterLabel}>Status:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={setSelectedStatus}
              style={styles.picker}
            >
              <Picker.Item label="Todas" value="all" />
              <Picker.Item label="Finalizadas" value="completed" />
              <Picker.Item label="Em andamento" value="active" />
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
        <Text style={styles.loadingText}>Carregando mais jornadas...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-sport" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>Nenhuma jornada encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {searchText || selectedVehicle || selectedStatus !== 'all'
          ? 'Tente ajustar os filtros de busca'
          : 'Inicie sua primeira jornada para vê-la aqui'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando jornadas...</Text>
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
        <Text style={styles.title}>Histórico de Jornadas</Text>
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
        data={journeys}
        renderItem={renderJourneyItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={journeys.length === 0 ? styles.emptyList : undefined}
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
    fontSize: 20,
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
  journeyCard: {
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
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  journeyInfo: {
    flex: 1,
  },
  journeyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  journeyVehicle: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  journeyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  journeyTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  journeyDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyDurationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  journeyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  gainValue: {
    color: '#34C759',
  },
  journeyNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  journeyNotesText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
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
});

export default JourneyHistoryScreen;

