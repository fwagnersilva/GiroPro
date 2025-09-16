import React, { useState, useEffect } from 'react';
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

interface AddExpenseScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);
  const [valorDespesaError, setValorDespesaError] = useState<string | null>(null);

  const expenseTypes = [
    { value: 'Manutencao', label: 'Manutenção', icon: 'build-outline', color: '#FF9500' },
    { value: 'Pneus', label: 'Pneus', icon: 'ellipse-outline', color: '#34C759' },
    { value: 'Seguro', label: 'Seguro', icon: 'shield-outline', color: '#007AFF' },
    { value: 'Outros', label: 'Outros', icon: 'receipt-outline', color: '#8E8E93' },
  ];

  const handleSubmit = async () => {
    // Validações
    if (valorDespesaError) {
      Alert.alert('Erro', valorDespesaError);
      return;
    }

    if (!formData.id_veiculo) {
      Alert.alert("Erro", "Selecione um veículo");
      return;
    }

    if (!formData.valor_despesa || parseFloat(formData.valor_despesa) <= 0) {
      Alert.alert("Erro", "Informe um valor válido para a despesa");
      return;
    }

    try {
      setLoading(true);

      const expenseData = {
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: new Date(formData.data_despesa + 'T12:00:00.000Z').toISOString(),
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: parseFloat(formData.valor_despesa),
        descricao: formData.descricao || undefined,
      };

      await expenseService.createExpense(expenseData);
      
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
    } catch (error: any) {
      console.error('Erro ao registrar despesa:', error);
      Alert.alert('Erro', error.message || 'Não foi possível registrar a despesa');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const getSelectedExpenseType = () => {
    return expenseTypes.find(type => type.value === formData.tipo_despesa);
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
        <Text style={styles.title}>Nova Despesa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Valor da Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.valor_despesa}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, valor_despesa: text }));
                if (parseFloat(text) <= 0 || isNaN(parseFloat(text))) {
                  setValorDespesaError('Informe um valor válido para a despesa');
                } else {
                  setValorDespesaError(null);
                }
              }}
              placeholder="Ex: 150.00"
              keyboardType="decimal-pad"
            />
            {formData.valor_despesa && (
              <Text style={styles.valuePreview}>
                {formatCurrency(formData.valor_despesa)}
              </Text>
            )}
            {valorDespesaError && <Text style={styles.errorText}>{valorDespesaError}</Text>}
          </View>

          {/* Tipo de Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Despesa <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.expenseTypeContainer}>
              {expenseTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.expenseTypeButton,
                    formData.tipo_despesa === type.value && styles.expenseTypeButtonSelected,
                    { borderColor: type.color }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, tipo_despesa: type.value as any }))}
                >
                  <View style={[
                    styles.expenseTypeIcon,
                    { backgroundColor: type.color + '20' }
                  ]}>
                    <Ionicons
                      name={type.icon as any}
                      size={24}
                      color={type.color}
                    />
                  </View>
                  <Text style={[
                    styles.expenseTypeLabel,
                    formData.tipo_despesa === type.value && styles.expenseTypeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data da Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.data_despesa}
              onChangeText={(text) => setFormData(prev => ({ ...prev, data_despesa: text }))}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
            />
          </View>

          {/* Seleção de Veículo (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veículo *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={styles.picker}
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
              placeholder="Descreva os detalhes da despesa..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
              <Text style={styles.submitButtonText}>Registrar Despesa</Text>
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  valuePreview: {
    marginTop: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  expenseTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  expenseTypeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  expenseTypeButtonSelected: {
    backgroundColor: '#F0F8FF',
  },
  expenseTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseTypeLabel: {
    fontSize: 14,
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddExpenseScreen;

