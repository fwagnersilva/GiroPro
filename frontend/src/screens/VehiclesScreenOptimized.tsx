import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/api';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';
import FormInput from '../components/FormInput';

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

const VehiclesScreenOptimized: React.FC = () => {
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

  const { data: vehicles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehicleService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalVisible(false);
      resetForm();
      if (isWeb()) {
        alert('Veículo cadastrado com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
      }
    },
    onError: (error: any) => {
      if (isWeb()) {
        alert(error.message || 'Erro ao cadastrar veículo');
      } else {
        Alert.alert('Erro', error.message || 'Erro ao cadastrar veículo');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setModalVisible(false);
      setEditingVehicle(null);
      resetForm();
      if (isWeb()) {
        alert('Veículo atualizado com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
      }
    },
    onError: (error: any) => {
      if (isWeb()) {
        alert(error.message || 'Erro ao atualizar veículo');
      } else {
        Alert.alert('Erro', error.message || 'Erro ao atualizar veículo');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vehicleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      if (isWeb()) {
        alert('Veículo excluído com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Veículo excluído com sucesso!');
      }
    },
    onError: (error: any) => {
      if (isWeb()) {
        alert(error.message || 'Erro ao excluir veículo');
      } else {
        Alert.alert('Erro', error.message || 'Erro ao excluir veículo');
      }
    },
  });

  const resetForm = useCallback(() => {
    setFormData({
      marca: '',
      modelo: '',
      ano: '',
      placa: '',
      tipo_combustivel: 'Gasolina',
      tipo_uso: 'Proprio',
    });
  }, []);

  const openAddModal = useCallback(() => {
    resetForm();
    setEditingVehicle(null);
    setModalVisible(true);
  }, [resetForm]);

  const openEditModal = useCallback((vehicle: Vehicle) => {
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
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      if (isWeb()) {
        alert('Preencha todos os campos obrigatórios');
      } else {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      }
      return;
    }

    if (isNaN(Number(formData.ano)) || Number(formData.ano) < 1900 || Number(formData.ano) > new Date().getFullYear() + 1) {
      if (isWeb()) {
        alert('Ano inválido');
      } else {
        Alert.alert('Erro', 'Ano inválido');
      }
      return;
    }

    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    if (!placaRegex.test(formData.placa.toUpperCase().replace('-', ''))) {
      if (isWeb()) {
        alert('Formato de placa inválido');
      } else {
        Alert.alert('Erro', 'Formato de placa inválido');
      }
      return;
    }

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
  }, [formData, editingVehicle, createMutation, updateMutation]);

  const handleDelete = useCallback((vehicle: Vehicle) => {
    if (isWeb()) {
      if (confirm(`Tem certeza que deseja excluir o veículo ${vehicle.marca} ${vehicle.modelo}?`)) {
        deleteMutation.mutate(vehicle.id);
      }
    } else {
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
    }
  }, [deleteMutation]);

  const getFuelTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'Gasolina': return 'car-outline';
      case 'Etanol': return 'leaf-outline';
      case 'Diesel': return 'bus-outline';
      case 'GNV': return 'flame-outline';
      case 'Flex': return 'swap-horizontal-outline';
      default: return 'car-outline';
    }
  }, []);

  const getUsageTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'Proprio': return '#4CAF50';
      case 'Alugado': return '#FF9800';
      case 'Financiado': return '#2196F3';
      default: return '#757575';
    }
  }, []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: components.container.backgroundColor,
      paddingTop: getSafePadding().paddingTop,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.body,
      marginTop: spacing.md,
      color: '#757575',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    errorText: {
      ...typography.h3,
      color: '#F44336',
      textAlign: 'center',
      marginTop: spacing.md,
    },
    retryButton: {
      backgroundColor: '#007AFF',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: components.button.borderRadius,
      marginTop: spacing.lg,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    retryButtonText: {
      ...typography.buttonText,
      color: '#FFFFFF',
    },
    listContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    vehicleCard: {
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
    vehicleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    vehicleInfo: {
      flex: 1,
    },
    vehicleTitle: {
      ...typography.h4,
      color: '#333333',
    },
    vehicleSubtitle: {
      ...typography.body,
      color: '#757575',
    },
    vehicleActions: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: spacing.sm,
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    vehicleDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.sm,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
      marginBottom: spacing.xs,
    },
    detailText: {
      ...typography.caption,
      color: '#757575',
      marginLeft: spacing.xs,
    },
    usageIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: spacing.xs,
    },
    financialInfo: {
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: spacing.sm,
      marginTop: spacing.sm,
    },
    financialText: {
      ...typography.caption,
      color: '#555555',
      marginBottom: spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    emptyTitle: {
      ...typography.h3,
      color: '#CCCCCC',
      marginTop: spacing.md,
    },
    emptySubtitle: {
      ...typography.body,
      color: '#AAAAAA',
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    emptyButton: {
      backgroundColor: '#007AFF',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: components.button.borderRadius,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    emptyButtonText: {
      ...typography.buttonText,
      color: '#FFFFFF',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingTop: getSafePadding().paddingTop,
      ...platformStyles.web({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }),
    },
    modalContent: {
      flex: 1,
      padding: spacing.md,
      ...platformStyles.web({
        backgroundColor: '#FFFFFF',
        borderRadius: components.card.borderRadius,
        width: '90%',
        maxWidth: 600,
        maxHeight: '90%',
        overflowY: 'auto',
        padding: spacing.lg,
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
      ...platformStyles.web({
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 0,
      }),
    },
    modalTitle: {
      ...typography.h3,
      color: '#333333',
    },
    modalCancelButton: {
      ...typography.buttonText,
      color: '#FF3B30',
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    modalSaveButton: {
      ...typography.buttonText,
      color: '#007AFF',
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    formField: {
      marginBottom: spacing.md,
    },
    formLabel: {
      ...typography.body,
      fontWeight: '600',
      marginBottom: spacing.xs,
      color: '#333333',
    },
    formInput: {
      ...components.input,
      backgroundColor: '#F9F9F9',
      ...platformStyles.web({
        outline: 'none',
        ':focus': {
          borderColor: '#007AFF',
        },
      }),
    },
    pickerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.xs,
    },
    pickerOption: {
      backgroundColor: '#E5E5EA',
      borderRadius: components.button.borderRadius,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#D0D0D0',
        },
      }),
    },
    pickerOptionSelected: {
      backgroundColor: '#007AFF',
      ...platformStyles.web({
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    pickerOptionText: {
      ...typography.caption,
      color: '#333333',
    },
    pickerOptionTextSelected: {
      color: '#FFFFFF',
    },
  }), [getSafePadding]);

  const renderVehicleItem = useCallback(({ item }: { item: Vehicle }) => (
    <View style={responsiveStyles.vehicleCard}>
      <View style={responsiveStyles.vehicleHeader}>
        <View style={responsiveStyles.vehicleInfo}>
          <Text style={responsiveStyles.vehicleTitle}>
            {item.marca} {item.modelo}
          </Text>
          <Text style={responsiveStyles.vehicleSubtitle}>
            {item.ano} • {item.placa}
          </Text>
        </View>
        <View style={responsiveStyles.vehicleActions}>
          <TouchableOpacity
            style={responsiveStyles.actionButton}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={responsiveStyles.actionButton}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={responsiveStyles.vehicleDetails}>
        <View style={responsiveStyles.detailItem}>
          <Ionicons
            name={getFuelTypeIcon(item.tipo_combustivel)}
            size={16}
            color="#757575"
          />
          <Text style={responsiveStyles.detailText}>{item.tipo_combustivel}</Text>
        </View>

        <View style={responsiveStyles.detailItem}>
          <View
            style={[
              responsiveStyles.usageIndicator,
              { backgroundColor: getUsageTypeColor(item.tipo_uso) },
            ]}
          />
          <Text style={responsiveStyles.detailText}>{item.tipo_uso}</Text>
        </View>

        {item.media_consumo && (
          <View style={responsiveStyles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color="#757575" />
            <Text style={responsiveStyles.detailText}>
              {(item.media_consumo / 100).toFixed(1)} km/L
            </Text>
          </View>
        )}
      </View>

      {(item.valor_aluguel || item.valor_prestacao) && (
        <View style={responsiveStyles.financialInfo}>
          {item.valor_aluguel && (
            <Text style={responsiveStyles.financialText}>
              Aluguel: R$ {(item.valor_aluguel / 100).toFixed(2)}/mês
            </Text>
          )}
          {item.valor_prestacao && (
            <Text style={responsiveStyles.financialText}>
              Prestação: R$ {(item.valor_prestacao / 100).toFixed(2)}/mês
            </Text>
          )}
        </View>
      )}
    </View>
  ), [getFuelTypeIcon, getUsageTypeColor, openEditModal, handleDelete, responsiveStyles]);

  const renderFormField = useCallback((
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    keyboardType?: any,
    secureTextEntry?: boolean,
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    autoCorrect?: boolean,
    leftIcon?: string,
    rightIcon?: string,
    onRightIconPress?: () => void,
    validation?: any,
    required?: boolean,
  ) => (
    <FormInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onRightIconPress={onRightIconPress}
      validation={validation}
      required={required}
    />
  ), []);

  const renderPicker = useCallback((
    label: string,
    value: string,
    options: { label: string; value: string }[],
    onSelect: (value: string) => void
  ) => (
    <View style={responsiveStyles.formField}>
      <Text style={responsiveStyles.formLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={responsiveStyles.pickerContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                responsiveStyles.pickerOption,
                value === option.value && responsiveStyles.pickerOptionSelected,
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  responsiveStyles.pickerOptionText,
                  value === option.value && responsiveStyles.pickerOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  ), [responsiveStyles]);

  if (isLoading) {
    return (
      <View style={responsiveStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={responsiveStyles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={responsiveStyles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={responsiveStyles.errorText}>Erro ao carregar veículos</Text>
        <TouchableOpacity style={responsiveStyles.retryButton} onPress={() => refetch()}>
          <Text style={responsiveStyles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.header}>
        <Text style={responsiveStyles.title}>Meus Veículos</Text>
        <TouchableOpacity style={responsiveStyles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={responsiveStyles.emptyContainer}>
          <Ionicons name="car-outline" size={64} color="#CCCCCC" />
          <Text style={responsiveStyles.emptyTitle}>Nenhum veículo cadastrado</Text>
          <Text style={responsiveStyles.emptySubtitle}>
            Adicione seu primeiro veículo para começar
          </Text>
          <TouchableOpacity style={responsiveStyles.emptyButton} onPress={openAddModal}>
            <Text style={responsiveStyles.emptyButtonText}>Adicionar Veículo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={responsiveStyles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle={isWeb() ? 'overFullScreen' : 'pageSheet'}
        onRequestClose={() => setModalVisible(false)}
        transparent={isWeb()}
      >
        <View style={responsiveStyles.modalContainer}>
          <View style={responsiveStyles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
              <Text style={responsiveStyles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={responsiveStyles.modalTitle}>
              {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              activeOpacity={0.7}
            >
              <Text style={responsiveStyles.modalSaveButton}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvando...'
                  : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={responsiveStyles.modalContent}>
            {renderFormField(
              'Marca *',
              formData.marca,
              (text) => setFormData({ ...formData, marca: text }),
              'Ex: Toyota',
              'default',
              false,
              'words',
              false,
              'car-outline'
            )}

            {renderFormField(
              'Modelo *',
              formData.modelo,
              (text) => setFormData({ ...formData, modelo: text }),
              'Ex: Corolla',
              'default',
              false,
              'words',
              false,
              'car-sport-outline'
            )}

            {renderFormField(
              'Ano *',
              formData.ano,
              (text) => setFormData({ ...formData, ano: text }),
              'Ex: 2020',
              'numeric',
              false,
              'none',
              false,
              'calendar-outline'
            )}

            {renderFormField(
              'Placa *',
              formData.placa,
              (text) => setFormData({ ...formData, placa: text.toUpperCase() }),
              'Ex: ABC1234',
              'default',
              false,
              'characters',
              false,
              'pricetag-outline'
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
                'numeric',
                false,
                'none',
                false,
                'cash-outline'
              )}

            {formData.tipo_uso === 'Financiado' &&
              renderFormField(
                'Valor da Prestação (R$)',
                formData.valor_prestacao || '',
                (text) => setFormData({ ...formData, valor_prestacao: text }),
                'Ex: 800.00',
                'numeric',
                false,
                'none',
                false,
                'wallet-outline'
              )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default VehiclesScreenOptimized;


