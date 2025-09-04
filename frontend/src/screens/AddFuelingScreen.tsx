import React, { useState, useEffect, useCallback } from 'react';
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
import * as Haptics from 'expo-haptics';
import { Picker } from '@react-native-picker/picker';
import { fuelingService } from '../services/api';
import { Vehicle } from '../types';

interface AddFuelingScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddFuelingScreen: React.FC<AddFuelingScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    tipo_combustivel: 'Gasolina' as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex',
    quantidade_litros: '',
    valor_litro: '',
    km_atual: '',
    nome_posto: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    // Validações
    if (!formData.id_veiculo) {
      Alert.alert('Erro', 'Selecione um veículo');
      return;
    }

    if (!formData.quantidade_litros || parseFloat(formData.quantidade_litros) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida de litros');
      return;
    }

    if (!formData.valor_litro || parseFloat(formData.valor_litro) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido por litro');
      return;
    }

    try {
      setLoading(true);

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
      
      Alert.alert(
        'Sucesso',
        'Abastecimento registrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              handleHapticFeedback();
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao registrar abastecimento:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível registrar o abastecimento',
        [
          {
            text: 'OK',
            onPress: () => {
              handleHapticFeedback();
            }
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHapticFeedback = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn("Haptics not supported or failed", error);
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Abastecimento</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Seleção de Veículo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veículo *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={styles.picker}
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            <TextInput
              style={[styles.input, focusedField === 'data_abastecimento' && styles.inputFocused]}
              value={formData.data_abastecimento}
              onChangeText={(text) => setFormData(prev => ({ ...prev, data_abastecimento: text }))}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              onFocus={() => setFocusedField('data_abastecimento')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Tipo de Combustível */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Combustível *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.tipo_combustivel}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, tipo_combustivel: value }));
                  handleHapticFeedback();
                }}
                style={styles.picker}
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade (Litros) *</Text>
            <TextInput
              style={[styles.input, focusedField === 'quantidade_litros' && styles.inputFocused]}
              value={formData.quantidade_litros}
              onChangeText={(text) => setFormData(prev => ({ ...prev, quantidade_litros: text }))}
              placeholder="Ex: 45.5"
              keyboardType="decimal-pad"
              onFocus={() => setFocusedField('quantidade_litros')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Valor por Litro */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor por Litro (R$) *</Text>
            <TextInput
              style={[styles.input, focusedField === 'valor_litro' && styles.inputFocused]}
              value={formData.valor_litro}
              onChangeText={(text) => setFormData(prev => ({ ...prev, valor_litro: text }))}
              placeholder="Ex: 5.49"
              keyboardType="decimal-pad"
              onFocus={() => setFocusedField('valor_litro')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Valor Total (Calculado) */}
          {valorTotal > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Valor Total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(valorTotal)}</Text>
            </View>
          )}

          {/* KM Atual (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>KM Atual (Opcional)</Text>
            <TextInput
              style={[styles.input, focusedField === 'km_atual' && styles.inputFocused]}
              value={formData.km_atual}
              onChangeText={(text) => setFormData(prev => ({ ...prev, km_atual: text }))}
              placeholder="Ex: 125000"
              keyboardType="numeric"
              onFocus={() => setFocusedField('km_atual')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Nome do Posto (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Posto (Opcional)</Text>
            <TextInput
              style={[styles.input, focusedField === 'nome_posto' && styles.inputFocused]}
              value={formData.nome_posto}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome_posto: text }))}
              placeholder="Ex: Posto Shell"
              onFocus={() => setFocusedField('nome_posto')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Registrar Abastecimento</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  inputFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  totalContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddFuelingScreen;
