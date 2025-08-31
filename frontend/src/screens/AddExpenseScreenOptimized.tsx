import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { expenseService } from '../services/api';
import { Vehicle } from '../types';
import FormInput from '../components/FormInput';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

interface AddExpenseScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddExpenseScreenOptimized: React.FC<AddExpenseScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);

  const expenseTypes = useMemo(() => [
    { value: 'Manutencao', label: 'Manutenção', icon: 'build-outline', color: '#FF9500' },
    { value: 'Pneus', label: 'Pneus', icon: 'ellipse-outline', color: '#34C759' },
    { value: 'Seguro', label: 'Seguro', icon: 'shield-outline', color: '#007AFF' },
    { value: 'Outros', label: 'Outros', icon: 'receipt-outline', color: '#8E8E93' },
  ], []);

  const handleSubmit = useCallback(async () => {
    // Validações
    if (!formData.valor_despesa || parseFloat(formData.valor_despesa) <= 0) {
      if (isWeb()) {
        alert('Informe um valor válido para a despesa');
      } else {
        Alert.alert('Erro', 'Informe um valor válido para a despesa');
      }
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: new Date(formData.data_despesa + 'T12:00:00.000Z').toISOString(),
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: parseFloat(formData.valor_despesa),
        descricao: formData.descricao || undefined,
      };

      await expenseService.createExpense(expenseData);
      
      if (isWeb()) {
        alert('Despesa registrada com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert(
          'Sucesso',
          'Despesa registrada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Erro ao registrar despesa:', error);
      const message = error.message || 'Não foi possível registrar a despesa';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigation]);

  const formatCurrency = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  }, []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5EA',
      paddingTop: getSafePadding().paddingTop + spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    backButton: {
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    title: {
      ...typography.h3,
      color: '#000000',
    },
    placeholder: {
      width: 32,
    },
    content: {
      flex: 1,
    },
    form: {
      padding: spacing.md,
      ...platformStyles.web({
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body,
      fontWeight: '500',
      color: '#000000',
      marginBottom: spacing.xs,
    },
    input: {
      ...components.input,
      backgroundColor: '#FFFFFF',
      ...platformStyles.web({
        outline: 'none',
        ':focus': {
          borderColor: '#007AFF',
        },
      }),
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    valuePreview: {
      marginTop: spacing.xs,
      ...typography.caption,
      color: '#007AFF',
      fontWeight: '500',
    },
    expenseTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    expenseTypeButton: {
      flex: 1,
      minWidth: '48%', // Ajuste para 2 colunas com gap
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#E5E5EA',
      borderRadius: components.card.borderRadius,
      padding: spacing.md,
      alignItems: 'center',
      gap: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        ':hover': {
          backgroundColor: '#F0F0F0',
        },
      }),
    },
    expenseTypeButtonSelected: {
      backgroundColor: '#F0F8FF',
      borderColor: '#007AFF',
      ...platformStyles.web({
        ':hover': {
          backgroundColor: '#E0E8FF',
        },
      }),
    },
    expenseTypeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    expenseTypeLabel: {
      ...typography.caption,
      fontWeight: '500',
      color: '#000000',
      textAlign: 'center',
    },
    expenseTypeLabelSelected: {
      color: '#007AFF',
      fontWeight: '600',
    },
    pickerContainer: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E5EA',
      borderRadius: components.input.borderRadius,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      ...platformStyles.web({
        // Web specific styles for picker if needed
      }),
    },
    footer: {
      padding: spacing.md,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    submitButton: {
      backgroundColor: '#007AFF',
      borderRadius: components.button.borderRadius,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    submitButtonDisabled: {
      backgroundColor: '#8E8E93',
      ...platformStyles.web({
        cursor: 'not-allowed',
        ':hover': {
          backgroundColor: '#8E8E93',
        },
      }),
    },
    submitButtonText: {
      ...typography.buttonText,
      color: '#FFFFFF',
    },
  }), [getSafePadding]);

  return (
    <KeyboardAvoidingView
      style={responsiveStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={responsiveStyles.header}>
        <TouchableOpacity
          style={responsiveStyles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={responsiveStyles.title}>Nova Despesa</Text>
        <View style={responsiveStyles.placeholder} />
      </View>

      <ScrollView style={responsiveStyles.content} showsVerticalScrollIndicator={false}>
        <View style={responsiveStyles.form}>
          {/* Tipo de Despesa */}
          <View style={responsiveStyles.inputGroup}>
            <<Text style={responsiveStyles.label}>Tipo de Despesa *</Text>>
            <View style={responsiveStyles.expenseTypeContainer}>
              {expenseTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    responsiveStyles.expenseTypeButton,
                    formData.tipo_despesa === type.value && responsiveStyles.expenseTypeButtonSelected,
                    { borderColor: type.color }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, tipo_despesa: type.value as any }))}
                  activeOpacity={0.7}
                >
                  <View style={[
                    responsiveStyles.expenseTypeIcon,
                    { backgroundColor: type.color + '20' }
                  ]}>
                    <Ionicons
                      name={type.icon as any}
                      size={24}
                      color={type.color}
                    />
                  </View>
                  <Text style={[
                    responsiveStyles.expenseTypeLabel,
                    formData.tipo_despesa === type.value && responsiveStyles.expenseTypeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data da Despesa */}
          <FormInput
            label="Data *"
            value={formData.data_despesa}
            onChangeText={(text) => setFormData(prev => ({ ...prev, data_despesa: text }))}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            leftIcon="calendar-outline"
            required
          />

          {/* Valor da Despesa */}
          <FormInput
            label="Valor (R$) *"
            value={formData.valor_despesa}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, valor_despesa: text }));
              // Validação em tempo real para o valor da despesa
              if (parseFloat(text) <= 0 && text !== '') {
                // Aqui você pode definir um estado de erro ou exibir uma mensagem de validação
                // Por simplicidade, vamos apenas garantir que o handleSubmit já lida com isso
              }
            }}
            placeholder="Ex: 150.00"
            keyboardType="decimal-pad"
            leftIcon="cash-outline"
            required
            validation={validators.positiveNumber}
          />
          {formData.valor_despesa && (
            <Text style={responsiveStyles.valuePreview}>
              {formatCurrency(formData.valor_despesa)}
            </Text>
          )}

          {/* Seleção de Veículo (Opcional) */}
          <View style={responsiveStyles.inputGroup}>
            <Text style={responsiveStyles.label}>Veículo (Opcional)</Text>
            <View style={responsiveStyles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={responsiveStyles.picker}
              >
                <Picker.Item label="Não associar a um veículo" value="" />
                {vehicles.map((vehicle) => (
                  <Picker.Item
                    key={vehicle.id}
                    label={`${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`}
                    value={vehicle.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Descrição (Opcional) */}
          <FormInput
            label="Descrição (Opcional)"
            value={formData.descricao}
            onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
            placeholder="Descreva os detalhes da despesa..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            leftIcon="document-text-outline"
          />
        </View>
      </ScrollView>

      <View style={responsiveStyles.footer}>
        <TouchableOpacity
          style={[responsiveStyles.submitButton, loading && responsiveStyles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={responsiveStyles.submitButtonText}>Registrar Despesa</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreenOptimized;


