import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterState {
  dateRange: 'today' | 'week' | 'month' | '3months' | 'year' | 'custom';
  categories: string[];
  vehicles: string[];
  searchText: string;
}

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
}

interface ExpenseFiltersProps {
  visible: boolean;
  filters: FilterState;
  vehicles: Vehicle[];
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  visible,
  filters,
  vehicles,
  onClose,
  onFiltersChange,
  onClearFilters,
}) => {
  const dateRangeOptions = [
    { key: 'today', label: 'Hoje', icon: 'today-outline' },
    { key: 'week', label: 'Esta semana', icon: 'calendar-outline' },
    { key: 'month', label: 'Este mês', icon: 'calendar-outline' },
    { key: '3months', label: 'Últimos 3 meses', icon: 'calendar-outline' },
    { key: 'year', label: 'Este ano', icon: 'calendar-outline' },
  ];

  const categoryOptions = [
    { key: 'Manutencao', label: 'Manutenção', color: '#FF9500', icon: 'build-outline' },
    { key: 'Pneus', label: 'Pneus', color: '#4A4A4A', icon: 'ellipse-outline' },
    { key: 'Seguro', label: 'Seguro', color: '#007AFF', icon: 'shield-outline' },
    { key: 'Outros', label: 'Outros', color: '#8E8E93', icon: 'receipt-outline' },
  ];

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    updateFilters({ categories: newCategories });
  };

  const toggleVehicle = (vehicleId: string) => {
    const newVehicles = filters.vehicles.includes(vehicleId)
      ? filters.vehicles.filter(v => v !== vehicleId)
      : [...filters.vehicles, vehicleId];
    
    updateFilters({ vehicles: newVehicles });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.vehicles.length > 0) count++;
    if (filters.dateRange !== 'month') count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Filtros</Text>
            {getActiveFiltersCount() > 0 && (
              <View style={styles.activeFiltersBadge}>
                <Text style={styles.activeFiltersText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity onPress={onClearFilters} style={styles.headerButton}>
            <Text style={styles.clearButton}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Range Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.optionsGrid}>
              {dateRangeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionCard,
                    filters.dateRange === option.key && styles.optionCardActive
                  ]}
                  onPress={() => updateFilters({ dateRange: option.key as any })}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={filters.dateRange === option.key ? '#FFFFFF' : '#007AFF'}
                  />
                  <Text style={[
                    styles.optionText,
                    filters.dateRange === option.key && styles.optionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View style={styles.optionsGrid}>
              {categoryOptions.map((category) => {
                const isSelected = filters.categories.includes(category.key);
                return (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardActive
                    ]}
                    onPress={() => toggleCategory(category.key)}
                  >
                    <View style={styles.categoryIconContainer}>
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={isSelected ? '#FFFFFF' : category.color}
                      />
                    </View>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextActive
                    ]}>
                      {category.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Vehicles Section */}
          {vehicles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Veículos</Text>
              <View style={styles.vehiclesList}>
                {vehicles.map((vehicle) => {
                  const isSelected = filters.vehicles.includes(vehicle.id);
                  return (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={styles.vehicleItem}
                      onPress={() => toggleVehicle(vehicle.id)}
                    >
                      <View style={styles.vehicleInfo}>
                        <Ionicons
                          name="car-outline"
                          size={20}
                          color="#007AFF"
                          style={styles.vehicleIcon}
                        />
                        <View style={styles.vehicleDetails}>
                          <Text style={styles.vehicleName}>
                            {vehicle.marca} {vehicle.modelo}
                          </Text>
                          <Text style={styles.vehiclePlate}>{vehicle.placa}</Text>
                        </View>
                      </View>
                      <Switch
                        value={isSelected}
                        onValueChange={() => toggleVehicle(vehicle.id)}
                        trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                        thumbColor={isSelected ? '#FFFFFF' : '#FFFFFF'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Summary Section */}
          {getActiveFiltersCount() > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo dos Filtros</Text>
              <View style={styles.summaryContainer}>
                {filters.dateRange !== 'month' && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Período:</Text>
                    <Text style={styles.summaryValue}>
                      {dateRangeOptions.find(d => d.key === filters.dateRange)?.label}
                    </Text>
                  </View>
                )}
                {filters.categories.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Categorias:</Text>
                    <Text style={styles.summaryValue}>
                      {filters.categories.length} selecionada(s)
                    </Text>
                  </View>
                )}
                {filters.vehicles.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Veículos:</Text>
                    <Text style={styles.summaryValue}>
                      {filters.vehicles.length} selecionado(s)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  headerButton: {
    minWidth: 60,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  activeFiltersBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFiltersText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  clearButton: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 8,
    minWidth: 120,
  },
  optionCardActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehiclesList: {
    gap: 12,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleIcon: {
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExpenseFilters;

