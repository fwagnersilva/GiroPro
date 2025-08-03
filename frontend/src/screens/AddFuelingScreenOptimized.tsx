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
import { fuelingService } from '../services/api';
import { Vehicle } from '../types';
import FormInput from '../components/FormInput';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

interface AddFuelingScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddFuelingScreenOptimized: React.FC<AddFuelingScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    tipo_combustivel: 'Gasolina' as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex',
    quantidade_litros: '',
    valor_litro: '',
    km_atual: '',
    nome_posto: '',
  });

  const [loading, setLoading] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    // Se houver apenas um veículo, selecionar automaticamente
    if (vehicles.length === 1) {
      setFormData(prev => ({ ...prev, id_veiculo: vehicles[0].id }));
    }
  }, [vehicles]);

  useEffect(() => {
    // Calcular valor total automaticamente
    const quantidade = parseFloat(formData.quantidade_litros) || 0;
    const valorLitro = parseFloat(formData.valor_litro) || 0;
    setValorTotal(quantidade * valorLitro);
  }, [formData.quantidade_litros, formData.valor_litro]);

  const handleSubmit = useCallback(async () => {
    // Validações
    if (!formData.id_veiculo) {
      if (isWeb()) {
        alert('Selecione um veículo');
      } else {
        Alert.alert('Erro', 'Selecione um veículo');
      }
      return;
    }

    if (!formData.quantidade_litros || parseFloat(formData.quantidade_litros) <= 0) {
      if (isWeb()) {
        alert('Informe uma quantidade válida de litros');
      } else {
        Alert.alert('Erro', 'Informe uma quantidade válida de litros');
      }
      return;
    }

    if (!formData.valor_litro || parseFloat(formData.valor_litro) <= 0) {
      if (isWeb()) {
        alert('Informe um valor válido por litro');
      } else {
        Alert.alert('Erro', 'Informe um valor válido por litro');
      }
      return;
    }

    setLoading(true);
    try {
      const fuelingData = {
        id_veiculo: formData.id_veiculo,
        data_abastecimento: new Date(formData.data_abastecimento + 'T12:00:00.000Z').toISOString(),
        tipo_combustivel: formData.tipo_combustivel,
        quantidade_litros: parseFloat(formData.quantidade_litros),
        valor_litro: parseFloat(formData.valor_litro),
        km_atual: formData.km_atual ? parseInt(formData.km_atual) : undefined,
        nome_posto: formData.nome_posto || undefined,
      };

      await fuelingService.createFueling(fuelingData);
      
      if (isWeb()) {
        alert('Abastecimento registrado com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert(
          'Sucesso',
          'Abastecimento registrado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Erro ao registrar abastecimento:', error);
      const message = error.message || 'Não foi possível registrar o abastecimento';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigation]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
    totalContainer: {
      backgroundColor: '#007AFF',
      borderRadius: components.card.borderRadius,
      padding: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    totalLabel: {
      ...typography.body,
      fontWeight: '500',
      color: '#FFFFFF',
    },
    totalValue: {
      ...typography.h3,
      fontWeight: '600',
      color: '#FFFFFF',
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
        <Text style={responsiveStyles.title}>Novo Abastecimento</Text>
        <View style={responsiveStyles.placeholder} />
      </View>

      <ScrollView style={responsiveStyles.content} showsVerticalScrollIndicator={false}>
        <View style={responsiveStyles.form}>
          {/* Seleção de Veículo */}
          <View style={responsiveStyles.inputGroup}>
            <Text style={responsiveStyles.label}>Veículo *</Text>
            <View style={responsiveStyles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={responsiveStyles.picker}
              >
                <Picker.Item label="Selecione um veículo" value="" />
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

          {/* Data do Abastecimento */}
          <FormInput
            label="Data *"
            value={formData.data_abastecimento}
            onChangeText={(text) => setFormData(prev => ({ ...prev, data_abastecimento: text }))}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            leftIcon="calendar-outline"
            required
          />

          {/* Tipo de Combustível */}
          <View style={responsiveStyles.inputGroup}>
            <Text style={responsiveStyles.label}>Tipo de Combustível *</Text>
            <View style={responsiveStyles.pickerContainer}>
              <Picker
                selectedValue={formData.tipo_combustivel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_combustivel: value }))}
                style={responsiveStyles.picker}
              >
                <Picker.Item label="Gasolina" value="Gasolina" />
                <Picker.Item label="Etanol" value="Etanol" />
                <Picker.Item label="Diesel" value="Diesel" />
                <Picker.Item label="GNV" value="GNV" />
                <Picker.Item label="Flex" value="Flex" />
              </Picker>
            </View>
          </View>

          {/* Quantidade de Litros */}
          <FormInput
            label="Quantidade (Litros) *"
            value={formData.quantidade_litros}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantidade_litros: text }))}
            placeholder="Ex: 45.5"
            keyboardType="decimal-pad"
            leftIcon="water-outline"
            required
          />

          {/* Valor por Litro */}
          <FormInput
            label="Valor por Litro (R$) *"
            value={formData.valor_litro}
            onChangeText={(text) => setFormData(prev => ({ ...prev, valor_litro: text }))}
            placeholder="Ex: 5.49"
            keyboardType="decimal-pad"
            leftIcon="cash-outline"
            required
          />

          {/* Valor Total (Calculado) */}
          {valorTotal > 0 && (
            <View style={responsiveStyles.totalContainer}>
              <Text style={responsiveStyles.totalLabel}>Valor Total:</Text>
              <Text style={responsiveStyles.totalValue}>{formatCurrency(valorTotal)}</Text>
            </View>
          )}

          {/* KM Atual (Opcional) */}
          <FormInput
            label="KM Atual (Opcional)"
            value={formData.km_atual}
            onChangeText={(text) => setFormData(prev => ({ ...prev, km_atual: text }))}
            placeholder="Ex: 125000"
            keyboardType="numeric"
            leftIcon="speedometer-outline"
          />

          {/* Nome do Posto (Opcional) */}
          <FormInput
            label="Nome do Posto (Opcional)"
            value={formData.nome_posto}
            onChangeText={(text) => setFormData(prev => ({ ...prev, nome_posto: text }))}
            placeholder="Ex: Posto Shell"
            leftIcon="business-outline"
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
              <Text style={responsiveStyles.submitButtonText}>Registrar Abastecimento</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddFuelingScreenOptimized;


