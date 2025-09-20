import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface FilterOptions {
  searchTerm: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  vehicle?: string;
  status?: string;
  type?: string;
}

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories?: string[];
  availableVehicles?: Array<{ id: string; name: string }>;
  availableStatuses?: string[];
  availableTypes?: string[];
  placeholder?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  availableCategories = [],
  availableVehicles = [],
  availableStatuses = [],
  availableTypes = [],
  placeholder = 'Buscar...',
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleSearchChange = (text: string) => {
    const newFilters = { ...filters, searchTerm: text };
    onFiltersChange(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchTerm: filters.searchTerm, // Manter o termo de busca
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setShowFilterModal(false);
  };

  const updateTempFilter = (key: keyof FilterOptions, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.category) count++;
    if (filters.vehicle) count++;
    if (filters.status) count++;
    if (filters.type) count++;
    return count;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderOptionButtons = (
    options: string[] | Array<{ id: string; name: string }>,
    selectedValue: string | undefined,
    onSelect: (value: string | undefined) => void,
    isVehicle = false
  ) => (
    <View style={styles.optionButtons}>
      <TouchableOpacity
        style={[styles.optionButton, !selectedValue && styles.optionButtonActive]}
        onPress={() => onSelect(undefined)}
      >
        <Text style={[styles.optionButtonText, !selectedValue && styles.optionButtonTextActive]}>
          Todos
        </Text>
      </TouchableOpacity>
      {options.map((option) => {
        const value = isVehicle ? (option as { id: string; name: string }).id : (option as string);
        const label = isVehicle ? (option as { id: string; name: string }).name : (option as string);
        const isSelected = selectedValue === value;
        
        return (
          <TouchableOpacity
            key={value}
            style={[styles.optionButton, isSelected && styles.optionButtonActive]}
            onPress={() => onSelect(isSelected ? undefined : value)}
          >
            <Text style={[styles.optionButtonText, isSelected && styles.optionButtonTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            value={filters.searchTerm}
            onChangeText={handleSearchChange}
            placeholderTextColor="#8E8E93"
          />
          {filters.searchTerm.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => handleSearchChange('')}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons 
            name="options" 
            size={20} 
            color={getActiveFiltersCount() > 0 ? '#FFF' : '#007AFF'} 
          />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de filtros */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={handleApplyFilters}>
              <Text style={styles.modalApplyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Filtro de data */}
            {renderFilterSection('Período', (
              <View>
                <View style={styles.dateRow}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateLabel}>De:</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setShowDateFromPicker(true)}
                    >
                      <Text style={[styles.dateInputText, !tempFilters.dateFrom && styles.dateInputPlaceholder]}>
                        {tempFilters.dateFrom ? formatDate(tempFilters.dateFrom) : 'Selecionar'}
                      </Text>
                      <Ionicons name="calendar" size={16} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateLabel}>Até:</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setShowDateToPicker(true)}
                    >
                      <Text style={[styles.dateInputText, !tempFilters.dateTo && styles.dateInputPlaceholder]}>
                        {tempFilters.dateTo ? formatDate(tempFilters.dateTo) : 'Selecionar'}
                      </Text>
                      <Ionicons name="calendar" size={16} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {(tempFilters.dateFrom || tempFilters.dateTo) && (
                  <TouchableOpacity
                    style={styles.clearDateButton}
                    onPress={() => {
                      updateTempFilter('dateFrom', undefined);
                      updateTempFilter('dateTo', undefined);
                    }}
                  >
                    <Text style={styles.clearDateText}>Limpar datas</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Filtro de categoria */}
            {availableCategories.length > 0 && renderFilterSection('Categoria', 
              renderOptionButtons(availableCategories, tempFilters.category, (value) => updateTempFilter('category', value))
            )}

            {/* Filtro de veículo */}
            {availableVehicles.length > 0 && renderFilterSection('Veículo', 
              renderOptionButtons(availableVehicles, tempFilters.vehicle, (value) => updateTempFilter('vehicle', value), true)
            )}

            {/* Filtro de status */}
            {availableStatuses.length > 0 && renderFilterSection('Status', 
              renderOptionButtons(availableStatuses, tempFilters.status, (value) => updateTempFilter('status', value))
            )}

            {/* Filtro de tipo */}
            {availableTypes.length > 0 && renderFilterSection('Tipo', 
              renderOptionButtons(availableTypes, tempFilters.type, (value) => updateTempFilter('type', value))
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearAllButton} onPress={handleClearFilters}>
              <Text style={styles.clearAllButtonText}>Limpar Tudo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        {showDateFromPicker && (
          <DateTimePicker
            value={tempFilters.dateFrom || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDateFromPicker(false);
              if (selectedDate) {
                updateTempFilter('dateFrom', selectedDate);
              }
            }}
          />
        )}

        {showDateToPicker && (
          <DateTimePicker
            value={tempFilters.dateTo || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDateToPicker(false);
              if (selectedDate) {
                updateTempFilter('dateTo', selectedDate);
              }
            }}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearSearchButton: {
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalApplyText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateInputText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  dateInputPlaceholder: {
    color: '#8E8E93',
  },
  clearDateButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearDateText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: '#FFF',
  },
  modalFooter: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  clearAllButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchAndFilter;

