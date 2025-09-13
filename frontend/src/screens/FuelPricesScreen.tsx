import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { fuelPricesService } from '../services/api';

interface FuelPrice {
  tipo_combustivel: string;
  preco_medio: number;
  preco_minimo: number;
  preco_maximo: number;
  estado: string;
  cidade: string;
  numero_postos: number;
  data_coleta: string;
}

interface RegionalComparison {
  estado: string;
  preco_medio: number;
  variacao_semanal: number;
  numero_postos: number;
  ultima_atualizacao: string;
}

const FuelPricesScreen: React.FC = () => {
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [regionalComparison, setRegionalComparison] = useState<RegionalComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<'Gasolina' | 'Etanol' | 'Diesel' | 'GNV'>('Gasolina');
  const [selectedState, setSelectedState] = useState('SP');
  const [selectedCity, setSelectedCity] = useState('São Paulo');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPrice, setReportPrice] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fuelTypes = [
    { label: 'Gasolina', value: 'Gasolina' as const },
    { label: 'Etanol', value: 'Etanol' as const },
    { label: 'Diesel', value: 'Diesel' as const },
    { label: 'GNV', value: 'GNV' as const },
  ];

  const states = [
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
  ];

  useEffect(() => {
    loadInitialData();
  }, [selectedFuelType, selectedState, selectedCity]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPrices(),
        loadRegionalComparison()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados de preços');
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      const response = await fuelPricesService.getPrices({
        estado: selectedState,
        cidade: selectedCity,
        tipo_combustivel: selectedFuelType
      });
      setPrices(response.precos);
      setLastUpdate(response.ultima_atualizacao);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    }
  };

  const loadRegionalComparison = async () => {
    try {
      const response = await fuelPricesService.getRegionalComparison({
        tipo_combustivel: selectedFuelType
      });
      setRegionalComparison(response.comparativo);
    } catch (error) {
      console.error('Erro ao carregar comparativo regional:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleReportPrice = async () => {
    if (!reportPrice || isNaN(parseFloat(reportPrice))) {
      Alert.alert('Erro', 'Por favor, insira um preço válido');
      return;
    }

    try {
      await fuelPricesService.reportPrice({
        estado: selectedState,
        cidade: selectedCity,
        tipo_combustivel: selectedFuelType,
        preco_medio: parseFloat(reportPrice),
        data_coleta: new Date().toISOString(),
        fonte: 'Usuário'
      });

      Alert.alert('Sucesso', 'Preço reportado com sucesso! Obrigado por contribuir.');
      setShowReportModal(false);
      setReportPrice('');
      onRefresh();
    } catch (error) {
      console.error('Erro ao reportar preço:', error);
      Alert.alert('Erro', 'Não foi possível reportar o preço');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFuelIcon = (fuelType: string) => {
    const icons: { [key: string]: string } = {
      'Gasolina': 'car-outline',
      'Etanol': 'leaf-outline',
      'Diesel': 'bus-outline',
      'GNV': 'flame-outline'
    };
    return icons[fuelType] || 'car-outline';
  };

  const getFuelColor = (fuelType: string) => {
    const colors: { [key: string]: string } = {
      'Gasolina': '#FF9500',
      'Etanol': '#34C759',
      'Diesel': '#007AFF',
      'GNV': '#FF3B30'
    };
    return colors[fuelType] || '#8E8E93';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando preços...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Preços de Combustível</Text>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => setShowReportModal(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Combustível:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedFuelType}
                onValueChange={setSelectedFuelType}
                style={styles.picker}
              >
                {fuelTypes.map(fuel => (
                  <Picker.Item key={fuel.value} label={fuel.label} value={fuel.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedState}
                onValueChange={setSelectedState}
                style={styles.picker}
              >
                {states.map(state => (
                  <Picker.Item key={state.value} label={state.label} value={state.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* Preços Locais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preços em {selectedCity} - {selectedState}</Text>
        {prices.map((price, index) => (
          <View key={index} style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <View style={styles.fuelTypeContainer}>
                <View style={[
                  styles.fuelIcon,
                  { backgroundColor: getFuelColor(price.tipo_combustivel) + '20' }
                ]}>
                  <Ionicons
                    name={getFuelIcon(price.tipo_combustivel) as any}
                    size={24}
                    color={getFuelColor(price.tipo_combustivel)}
                  />
                </View>
                <Text style={styles.fuelTypeName}>{price.tipo_combustivel}</Text>
              </View>
              <Text style={styles.postsCount}>{price.numero_postos} postos</Text>
            </View>

            <View style={styles.priceDetails}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Preço Médio</Text>
                <Text style={styles.priceValue}>{formatCurrency(price.preco_medio)}</Text>
              </View>
              <View style={styles.priceRange}>
                <Text style={styles.priceRangeText}>
                  {formatCurrency(price.preco_minimo)} - {formatCurrency(price.preco_maximo)}
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        {lastUpdate && (
          <Text style={styles.updateInfo}>
            Última atualização: {formatDate(lastUpdate)}
          </Text>
        )}
      </View>

      {/* Comparativo Regional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparativo Regional - {selectedFuelType}</Text>
        {regionalComparison.map((item, index) => (
          <View key={index} style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.stateName}>{item.estado}</Text>
              <View style={styles.variationContainer}>
                <Ionicons
                  name={item.variacao_semanal >= 0 ? "trending-up" : "trending-down"}
                  size={16}
                  color={item.variacao_semanal >= 0 ? "#FF3B30" : "#34C759"}
                />
                <Text style={[
                  styles.variationText,
                  { color: item.variacao_semanal >= 0 ? "#FF3B30" : "#34C759" }
                ]}>
                  {item.variacao_semanal >= 0 ? '+' : ''}{(item.variacao_semanal * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
            <View style={styles.comparisonDetails}>
              <Text style={styles.comparisonPrice}>{formatCurrency(item.preco_medio)}</Text>
              <Text style={styles.comparisonPosts}>{item.numero_postos} postos</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Modal de Reportar Preço */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reportar Preço</Text>
              <TouchableOpacity
                onPress={() => setShowReportModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalInfo}>
                {selectedFuelType} em {selectedCity} - {selectedState}
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preço por litro (R$):</Text>
                <TextInput
                  style={styles.priceInput}
                  value={reportPrice}
                  onChangeText={setReportPrice}
                  placeholder="Ex: 5.89"
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowReportModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleReportPrice}
                >
                  <Text style={styles.submitButtonText}>Reportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    color: '#8E8E93',
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
  reportButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    height: 50,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  priceCard: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fuelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fuelTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  postsCount: {
    fontSize: 12,
    color: '#8E8E93',
  },
  priceDetails: {
    gap: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceRange: {
    alignItems: 'center',
  },
  priceRangeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  updateInfo: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  comparisonCard: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  variationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  comparisonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  comparisonPosts: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalInfo: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FuelPricesScreen;

