import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from '../components/Icon';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../utils/alert';
import { platformStyles, platformValue } from '../utils/platform';

// Mock de serviço de veículo e despesa
const vehicleService = {
  getVehicles: async () => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', marca: 'Fiat', modelo: 'Uno', placa: 'ABC-1234' },
      { id: '2', marca: 'Chevrolet', modelo: 'Onix', placa: 'DEF-5678' },
    ];
  },
};

const expenseService = {
  createExpense: async (data: any) => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Despesa criada:', data);
    return { success: true };
  },
};

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
}

const AddExpenseScreenClean: React.FC<any> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);
  const [valorDespesaError, setValorDespesaError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const fetchedVehicles = await vehicleService.getVehicles();
        setVehicles(fetchedVehicles);
      } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    };
    loadVehicles();
  }, []);

  const expenseTypes = [
    { value: 'Manutencao', label: 'Manutenção', icon: 'build-outline', color: '#FF9500' },
    { value: 'Pneus', label: 'Pneus', icon: 'ellipse-outline', color: '#34C759' },
    { value: 'Seguro', label: 'Seguro', icon: 'shield-outline', color: '#007AFF' },
    { value: 'Outros', label: 'Outros', icon: 'receipt-outline', color: '#8E8E93' },
  ];

  const handleSubmit = async () => {
    if (valorDespesaError) {
      Alert.alert('Erro', valorDespesaError);
      return;
    }

    if (!formData.valor_despesa || parseFloat(formData.valor_despesa) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido para a despesa');
      return;
    }

    try {
      setLoading(true);

      const expenseData = {
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: new Date(formData.data_despesa + 'T12:00:00.000Z').toISOString(),
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: parseFloat(formData.valor_despesa) * 100, // Convertendo para centavos
        descricao: formData.descricao || undefined,
      };

      await expenseService.createExpense(expenseData);
      
      Alert.alert(
        'Sucesso',
        'Despesa registrada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack ? navigation.goBack() : console.log('Go back action'),
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack ? navigation.goBack() : console.log('Go back action')}
        >
          <Icon name="arrow-back-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Despesa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
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
                    <Icon
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
              keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
            />
          </View>

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
              keyboardType={Platform.OS === 'web' ? 'default' : 'decimal-pad'}
            />
            {formData.valor_despesa && (
              <Text style={styles.valuePreview}>
                {formatCurrency(formData.valor_despesa)}
              </Text>
            )}
            {valorDespesaError && <Text style={styles.errorText}>{valorDespesaError}</Text>}
          </View>

          {/* Seleção de Veículo (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veículo (Opcional)</Text>
            <TouchableOpacity 
              style={styles.pickerDisplay}
              onPress={() => setShowVehiclePicker(!showVehiclePicker)}
            >
              <Text style={styles.pickerDisplayText}>
                {formData.id_veiculo ? 
                  vehicles.find(v => v.id === formData.id_veiculo)?.placa || 'Selecione um veículo'
                  : 'Não associar a um veículo'
                }
              </Text>
              <Icon name="chevron-down-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
            {showVehiclePicker && (
              <View style={styles.pickerOptionsContainer}>
                <TouchableOpacity
                  style={styles.pickerOption}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, id_veiculo: '' }));
                    setShowVehiclePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>Não associar a um veículo</Text>
                </TouchableOpacity>
                {vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, id_veiculo: vehicle.id }));
                      setShowVehiclePicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>
                      {`${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
            <LoadingSpinner color="#FFFFFF" />
          ) : (
            <>
              <Icon name="checkmark-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Registrar Despesa</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...platformStyles({
      web: {
        minHeight: '100vh',
      },
    }),
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
    ...platformStyles({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    ...platformStyles({
      web: {
        outline: 'none',
      },
    }),
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
    ...platformStyles({
      web: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      },
    }),
  },
  expenseTypeButton: {
    flex: 1,
    minWidth: platformValue({ web: 'auto', default: '45%' }),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
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
  pickerDisplay: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  pickerDisplayText: {
    fontSize: 16,
    color: '#000000',
  },
  pickerOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    marginTop: 4,
    position: platformValue({ web: 'absolute', default: 'relative' }),
    width: '100%',
    zIndex: 10,
    ...platformStyles({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    ...platformStyles({
      web: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#F0F8FF',
        },
      },
    }),
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    ...platformStyles({
      web: {
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...platformStyles({
      web: {
        cursor: 'pointer',
      },
    }),
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

export default AddExpenseScreenClean;

