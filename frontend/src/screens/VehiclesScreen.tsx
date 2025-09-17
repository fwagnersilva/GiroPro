import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/api';
import { z } from 'zod';
import { vehicleSchema } from '../schemas/vehicleSchemas';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
  tipo_uso: 'Proprio' | 'Alugado' | 'Financiado';
  valor_aluguel?: number;
  valor_prestacao?: number;
  media_consumo?: number;
  data_cadastro: string;
}

interface VehicleFormData {
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex';
  tipo_uso: 'Proprio' | 'Alugado' | 'Financiado';
  valor_aluguel?: string;
  valor_prestacao?: string;
}

const VehiclesScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    tipo_combustivel: 'Gasolina',
    tipo_uso: 'Proprio',
  });

  const queryClient = useQueryClient();

  // Query para buscar veículos
  const {
    data: vehicles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehicleService.getAll,
  });

  // Mutation para criar veículo
  const createMutation = useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalVisible(false);
      resetForm();
      Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar veículo');
    },
  });

  // Mutation para atualizar veículo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalVisible(false);
      setEditingVehicle(null);
      resetForm();
      Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.message || 'Erro ao atualizar veículo');
    },
  });

  // Mutation para excluir veículo
  const deleteMutation = useMutation({
    mutationFn: vehicleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      Alert.alert('Sucesso', 'Veículo excluído com sucesso!');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.message || 'Erro ao excluir veículo');
    },
  });

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      ano: '',
      placa: '',
      tipo_combustivel: 'Gasolina',
      tipo_uso: 'Proprio',
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingVehicle(null);
    setModalVisible(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setFormData({
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      placa: vehicle.placa,
      tipo_combustivel: vehicle.tipo_combustivel,
      tipo_uso: vehicle.tipo_uso,
      valor_aluguel: vehicle.valor_aluguel ? (vehicle.valor_aluguel / 100).toString() : '',
      valor_prestacao: vehicle.valor_prestacao ? (vehicle.valor_prestacao / 100).toString() : '',
    });
    setEditingVehicle(vehicle);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    // Validações básicas
    try {
      vehicleSchema.parse({ 
        marca: formData.marca, 
        modelo: formData.modelo, 
        ano: Number(formData.a        placa: formData.placa.toUpperCase().replace(\'-\\' , \'\'),
        tipo_combustivel: formData.tipo_combustivel
      });    } catch (e: any) {
      Alert.alert("Erro", e.errors[0].message);
      return;
    }



    // Validar placa (formato brasileiro) - removido pois já está no schema

    const submitData: any = {
      marca: formData.marca,
      modelo: formData.modelo,
      ano: Number(formData.ano),
      placa: formData.placa.toUpperCase(),
      tipo_combustivel: formData.tipo_combustivel,
      tipo_uso: formData.tipo_uso,
    };

    if (formData.tipo_uso === 'Alugado' && formData.valor_aluguel) {
      submitData.valor_aluguel = Math.round(Number(formData.valor_aluguel) * 100);
    }

    if (formData.tipo_uso === 'Financiado' && formData.valor_prestacao) {
      submitData.valor_prestacao = Math.round(Number(formData.valor_prestacao) * 100);
    }

    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o veículo ${vehicle.marca} ${vehicle.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(vehicle.id),
        },
      ]
    );
  };

  const getFuelTypeIcon = (type: string) => {
    switch (type) {
      case 'Gasolina':
        return 'car-outline';
      case 'Etanol':
        return 'leaf-outline';
      case 'Diesel':
        return 'bus-outline';
      case 'GNV':
        return 'flame-outline';
      case 'Flex':
        return 'swap-horizontal-outline';
      default:
        return 'car-outline';
    }
  };

  const getUsageTypeColor = (type: string) => {
    switch (type) {
      case 'Proprio':
        return '#4CAF50';
      case 'Alugado':
        return '#FF9800';
      case 'Financiado':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>
            {item.marca} {item.modelo}
          </Text>
          <Text style={styles.vehicleSubtitle}>
            {item.ano} • {item.placa}
          </Text>
        </View>
        <View style={styles.vehicleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <View style={styles.detailItem}>
          <Ionicons
            name={getFuelTypeIcon(item.tipo_combustivel)}
            size={16}
            color="#757575"
          />
          <Text style={styles.detailText}>{item.tipo_combustivel}</Text>
        </View>

        <View style={styles.detailItem}>
          <View
            style={[
              styles.usageIndicator,
              { backgroundColor: getUsageTypeColor(item.tipo_uso) },
            ]}
          />
          <Text style={styles.detailText}>{item.tipo_uso}</Text>
        </View>

        {item.media_consumo && (
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>
              {(item.media_consumo / 100).toFixed(1)} km/L
            </Text>
          </View>
        )}
      </View>

      {(item.valor_aluguel || item.valor_prestacao) && (
        <View style={styles.financialInfo}>
          {item.valor_aluguel && (
            <Text style={styles.financialText}>
              Aluguel: R$ {(item.valor_aluguel / 100).toFixed(2)}/mês
            </Text>
          )}
          {item.valor_prestacao && (
            <Text style={styles.financialText}>
              Prestação: R$ {(item.valor_prestacao / 100).toFixed(2)}/mês
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const renderFormField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    keyboardType?: any
  ) => (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderPicker = (
    label: string,
    value: string,
    options: { label: string; value: string }[],
    onSelect: (value: string) => void
  ) => (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.pickerContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pickerOption,
                value === option.value && styles.pickerOptionSelected,
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  value === option.value && styles.pickerOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>Erro ao carregar veículos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Veículos</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
          <Text style={styles.emptySubtitle}>
            Adicione seu primeiro veículo para começar
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
            <Text style={styles.emptyButtonText}>Adicionar Veículo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Formulário */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Text style={styles.modalSaveButton}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvando...'
                  : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {renderFormField(
              'Marca *',
              formData.marca,
              (text) => setFormData({ ...formData, marca: text }),
              'Ex: Toyota'
            )}

            {renderFormField(
              'Modelo *',
              formData.modelo,
              (text) => setFormData({ ...formData, modelo: text }),
              'Ex: Corolla'
            )}

            {renderFormField(
              'Ano *',
              formData.ano,
              (text) => setFormData({ ...formData, ano: text }),
              'Ex: 2020',
              'numeric'
            )}

            {renderFormField(
              'Placa *',
              formData.placa,
              (text) => setFormData({ ...formData, placa: text.toUpperCase() }),
              'Ex: ABC1234'
            )}

            {renderPicker(
              'Tipo de Combustível',
              formData.tipo_combustivel,
              [
                { label: 'Gasolina', value: 'Gasolina' },
                { label: 'Etanol', value: 'Etanol' },
                { label: 'Diesel', value: 'Diesel' },
                { label: 'GNV', value: 'GNV' },
                { label: 'Flex', value: 'Flex' },
              ],
              (value) =>
                setFormData({
                  ...formData,
                  tipo_combustivel: value as any,
                })
            )}

            {renderPicker(
              'Tipo de Uso',
              formData.tipo_uso,
              [
                { label: 'Próprio', value: 'Proprio' },
                { label: 'Alugado', value: 'Alugado' },
                { label: 'Financiado', value: 'Financiado' },
              ],
              (value) =>
                setFormData({
                  ...formData,
                  tipo_uso: value as any,
                })
            )}

            {formData.tipo_uso === 'Alugado' &&
              renderFormField(
                'Valor do Aluguel (R$)',
                formData.valor_aluguel || '',
                (text) => setFormData({ ...formData, valor_aluguel: text }),
                'Ex: 1500.00',
                'numeric'
              )}

            {formData.tipo_uso === 'Financiado' &&
              renderFormField(
                'Valor da Prestação (R$)',
                formData.valor_prestacao || '',
                (text) => setFormData({ ...formData, valor_prestacao: text }),
                'Ex: 800.00',
                'numeric'
              )}
          </ScrollView>
        </View>
      </Modal>
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
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  vehicleActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  vehicleDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  usageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  financialInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  financialText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#F44336',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalSaveButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#2196F3',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#757575',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
  },
});

export default VehiclesScreen;

