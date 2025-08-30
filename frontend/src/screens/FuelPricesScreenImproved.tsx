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
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { fuelPricesService } from '../services/api';
import { lightTheme, darkTheme, spacing, borderRadius, shadows, typography } from '../theme/tokens';

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

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isWeb = Platform.OS === 'web';

const FuelPricesScreenImproved: React.FC = () => {
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const fuelTypes = [
    { label: 'Gasolina', value: 'Gasolina' as const, icon: 'car-outline', color: '#FF9500' },
    { label: 'Etanol', value: 'Etanol' as const, icon: 'leaf-outline', color: '#34C759' },
    { label: 'Diesel', value: 'Diesel' as const, icon: 'bus-outline', color: '#007AFF' },
    { label: 'GNV', value: 'GNV' as const, icon: 'flame-outline', color: '#FF3B30' },
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
      setLoadingPrices(true);
      const response = await fuelPricesService.getPrices({
        estado: selectedState,
        cidade: selectedCity,
        tipo_combustivel: selectedFuelType
      });
      setPrices(response.precos);
      setLastUpdate(response.ultima_atualizacao);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    } finally {
      setLoadingPrices(false);
    }
  };

  const loadRegionalComparison = async () => {
    try {
      setLoadingComparison(true);
      const response = await fuelPricesService.getRegionalComparison({
        tipo_combustivel: selectedFuelType
      });
      setRegionalComparison(response.comparativo);
    } catch (error) {
      console.error('Erro ao carregar comparativo regional:', error);
    } finally {
      setLoadingComparison(false);
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

  const getFuelTypeData = (fuelType: string) => {
    return fuelTypes.find(fuel => fuel.value === fuelType) || fuelTypes[0];
  };

  const getBestPrice = () => {
    if (prices.length === 0) return null;
    return prices.reduce((min, price) => 
      price.preco_medio < min.preco_medio ? price : min
    );
  };

  const renderSkeletonCard = () => (
    <View style={[styles.priceCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonCircle, { backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.skeletonText, { backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
      <View style={styles.skeletonBody}>
        <View style={[styles.skeletonPrice, { backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.skeletonRange, { backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Carregando preços de combustível...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Preços de Combustível
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Encontre os melhores preços na sua região
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.reportButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowReportModal(true)}
            accessibilityLabel="Reportar preço de combustível"
            accessibilityHint="Toque para informar um preço de combustível"
          >
            <Ionicons name="add" size={24} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filters */}
      <View style={[styles.quickFilters, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>
          Combustível
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fuelTypeScroll}>
          {fuelTypes.map((fuel) => (
            <TouchableOpacity
              key={fuel.value}
              style={[
                styles.fuelTypeChip,
                {
                  backgroundColor: selectedFuelType === fuel.value 
                    ? fuel.color + '20' 
                    : theme.colors.surfaceVariant,
                  borderColor: selectedFuelType === fuel.value 
                    ? fuel.color 
                    : theme.colors.border,
                }
              ]}
              onPress={() => setSelectedFuelType(fuel.value)}
            >
              <Ionicons 
                name={fuel.icon as any} 
                size={20} 
                color={selectedFuelType === fuel.value ? fuel.color : theme.colors.textSecondary} 
              />
              <Text style={[
                styles.fuelTypeChipText,
                { 
                  color: selectedFuelType === fuel.value 
                    ? fuel.color 
                    : theme.colors.textSecondary 
                }
              ]}>
                {fuel.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Location Filters */}
      <View style={[styles.locationFilters, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Estado:</Text>
            <View style={[styles.pickerContainer, { 
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.border 
            }]}>
              <Picker
                selectedValue={selectedState}
                onValueChange={setSelectedState}
                style={[styles.picker, { color: theme.colors.text }]}
              >
                {states.map(state => (
                  <Picker.Item key={state.value} label={state.label} value={state.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* Best Price Highlight */}
      {getBestPrice() && (
        <View style={[styles.bestPriceContainer, { backgroundColor: theme.colors.success + '10' }]}>
          <View style={styles.bestPriceHeader}>
            <Ionicons name="trophy" size={24} color={theme.colors.success} />
            <Text style={[styles.bestPriceTitle, { color: theme.colors.success }]}>
              Melhor Preço Encontrado
            </Text>
          </View>
          <Text style={[styles.bestPriceValue, { color: theme.colors.success }]}>
            {formatCurrency(getBestPrice()!.preco_medio)}
          </Text>
          <Text style={[styles.bestPriceLocation, { color: theme.colors.textSecondary }]}>
            {getBestPrice()!.cidade} - {getBestPrice()!.estado}
          </Text>
        </View>
      )}

      {/* Local Prices */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preços em {selectedCity} - {selectedState}
          </Text>
          {loadingPrices && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>

        {loadingPrices ? (
          <>
            {renderSkeletonCard()}
            {renderSkeletonCard()}
          </>
        ) : (
          <View style={isTablet ? styles.gridContainer : undefined}>
            {prices.map((price, index) => {
              const fuelData = getFuelTypeData(price.tipo_combustivel);
              const isBestPrice = getBestPrice()?.preco_medio === price.preco_medio;
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.priceCard,
                    isTablet && styles.gridItem,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: isBestPrice ? theme.colors.success : theme.colors.border,
                      borderWidth: isBestPrice ? 2 : 1,
                    }
                  ]}
                >
                  {isBestPrice && (
                    <View style={[styles.bestPriceBadge, { backgroundColor: theme.colors.success }]}>
                      <Ionicons name="star" size={12} color={theme.colors.surface} />
                      <Text style={[styles.bestPriceBadgeText, { color: theme.colors.surface }]}>
                        Melhor Preço
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceHeader}>
                    <View style={styles.fuelTypeContainer}>
                      <View style={[
                        styles.fuelIcon,
                        { backgroundColor: fuelData.color + '20' }
                      ]}>
                        <Ionicons
                          name={fuelData.icon as any}
                          size={24}
                          color={fuelData.color}
                        />
                      </View>
                      <View>
                        <Text style={[styles.fuelTypeName, { color: theme.colors.text }]}>
                          {price.tipo_combustivel}
                        </Text>
                        <Text style={[styles.postsCount, { color: theme.colors.textSecondary }]}>
                          {price.numero_postos} postos consultados
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.priceDetails}>
                    <View style={styles.mainPrice}>
                      <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                        Preço Médio
                      </Text>
                      <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
                        {formatCurrency(price.preco_medio)}
                      </Text>
                    </View>
                    
                    <View style={styles.priceRange}>
                      <View style={styles.rangeItem}>
                        <Text style={[styles.rangeLabel, { color: theme.colors.textTertiary }]}>
                          Mínimo
                        </Text>
                        <Text style={[styles.rangeValue, { color: theme.colors.success }]}>
                          {formatCurrency(price.preco_minimo)}
                        </Text>
                      </View>
                      <View style={styles.rangeDivider} />
                      <View style={styles.rangeItem}>
                        <Text style={[styles.rangeLabel, { color: theme.colors.textTertiary }]}>
                          Máximo
                        </Text>
                        <Text style={[styles.rangeValue, { color: theme.colors.error }]}>
                          {formatCurrency(price.preco_maximo)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        
        {lastUpdate && (
          <Text style={[styles.updateInfo, { color: theme.colors.textTertiary }]}>
            Última atualização: {formatDate(lastUpdate)}
          </Text>
        )}
      </View>

      {/* Regional Comparison */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Comparativo Regional - {selectedFuelType}
          </Text>
          {loadingComparison && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>

        {loadingComparison ? (
          <>
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
          </>
        ) : (
          regionalComparison.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.comparisonCard,
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border 
                }
              ]}
            >
              <View style={styles.comparisonHeader}>
                <Text style={[styles.stateName, { color: theme.colors.text }]}>
                  {item.estado}
                </Text>
                <View style={styles.variationContainer}>
                  <Ionicons
                    name={item.variacao_semanal >= 0 ? "trending-up" : "trending-down"}
                    size={16}
                    color={item.variacao_semanal >= 0 ? theme.colors.error : theme.colors.success}
                  />
                  <Text style={[
                    styles.variationText,
                    { color: item.variacao_semanal >= 0 ? theme.colors.error : theme.colors.success }
                  ]}>
                    {item.variacao_semanal >= 0 ? '+' : ''}{(item.variacao_semanal * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
              <View style={styles.comparisonDetails}>
                <Text style={[styles.comparisonPrice, { color: theme.colors.primary }]}>
                  {formatCurrency(item.preco_medio)}
                </Text>
                <Text style={[styles.comparisonPosts, { color: theme.colors.textSecondary }]}>
                  {item.numero_postos} postos
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Report Price Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Reportar Preço
              </Text>
              <TouchableOpacity
                onPress={() => setShowReportModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalInfoContainer}>
                <View style={[
                  styles.modalFuelIcon,
                  { backgroundColor: getFuelTypeData(selectedFuelType).color + '20' }
                ]}>
                  <Ionicons
                    name={getFuelTypeData(selectedFuelType).icon as any}
                    size={32}
                    color={getFuelTypeData(selectedFuelType).color}
                  />
                </View>
                <Text style={[styles.modalInfo, { color: theme.colors.text }]}>
                  {selectedFuelType} em {selectedCity} - {selectedState}
                </Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Preço por litro (R$):
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { 
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }
                  ]}
                  value={reportPrice}
                  onChangeText={setReportPrice}
                  placeholder="Ex: 5.89"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: theme.colors.border }]}
                  onPress={() => setShowReportModal(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleReportPrice}
                >
                  <Text style={[styles.submitButtonText, { color: theme.colors.surface }]}>
                    Reportar Preço
                  </Text>
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
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  
  loadingText: {
    marginTop: spacing[3],
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },

  // Header Styles
  header: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    ...shadows.sm,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing[1],
  },
  
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  
  reportButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },

  // Quick Filters
  quickFilters: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginBottom: spacing[2],
  },
  
  filterSectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing[3],
  },
  
  fuelTypeScroll: {
    flexDirection: 'row',
  },
  
  fuelTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    marginRight: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    minHeight: 40,
  },
  
  fuelTypeChipText: {
    marginLeft: spacing[2],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.medium,
  },

  // Location Filters
  locationFilters: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
  },
  
  filterRow: {
    marginBottom: spacing[3],
  },
  
  filterItem: {
    flex: 1,
  },
  
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing[2],
  },
  
  pickerContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  
  picker: {
    height: 50,
  },

  // Best Price Highlight
  bestPriceContainer: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  
  bestPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  
  bestPriceTitle: {
    marginLeft: spacing[2],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  bestPriceValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing[1],
  },
  
  bestPriceLocation: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },

  // Section Styles
  section: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[4],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.base,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },

  // Grid Layout for Tablets
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing[2],
  },
  
  gridItem: {
    width: isTablet ? '48%' : '100%',
    marginHorizontal: spacing[2],
  },

  // Price Card Styles
  priceCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    position: 'relative',
    ...shadows.sm,
  },
  
  bestPriceBadge: {
    position: 'absolute',
    top: -1,
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
    zIndex: 1,
  },
  
  bestPriceBadgeText: {
    marginLeft: spacing[1],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  priceHeader: {
    marginBottom: spacing[4],
  },
  
  fuelTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  fuelIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  
  fuelTypeName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing[1],
  },
  
  postsCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },
  
  priceDetails: {
    gap: spacing[3],
  },
  
  mainPrice: {
    alignItems: 'center',
  },
  
  priceLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing[1],
  },
  
  priceValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
  },
  
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  
  rangeItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  rangeDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: spacing[2],
  },
  
  rangeLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing[1],
  },
  
  rangeValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  updateInfo: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginTop: spacing[3],
    fontStyle: 'italic',
  },

  // Skeleton Loading
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  
  skeletonCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    marginRight: spacing[3],
  },
  
  skeletonText: {
    height: 16,
    width: 120,
    borderRadius: borderRadius.sm,
  },
  
  skeletonBody: {
    alignItems: 'center',
    gap: spacing[2],
  },
  
  skeletonPrice: {
    height: 24,
    width: 100,
    borderRadius: borderRadius.sm,
  },
  
  skeletonRange: {
    height: 14,
    width: 150,
    borderRadius: borderRadius.sm,
  },

  // Comparison Card Styles
  comparisonCard: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  
  stateName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  
  variationText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  comparisonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  comparisonPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
  },
  
  comparisonPosts: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  
  modalContent: {
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
  },
  
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  
  closeButton: {
    padding: spacing[1],
  },
  
  modalBody: {
    padding: spacing[5],
  },
  
  modalInfoContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  
  modalFuelIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  
  modalInfo: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  
  inputContainer: {
    marginBottom: spacing[6],
  },
  
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing[2],
  },
  
  priceInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    minHeight: 48,
  },
  
  modalActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  
  cancelButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  
  submitButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
});

export default FuelPricesScreenImproved;

