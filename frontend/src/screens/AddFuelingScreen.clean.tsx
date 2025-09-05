import React, { useState, useEffect, useCallback } from 'react';
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

// Mock de serviço de veículo e abastecimento
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

const fuelingService = {
  createFueling: async (data: any) => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Abastecimento criado:', data);
    return { success: true };
  },
};

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
}

const AddFuelingScreenClean: React.FC<any> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    tipo_combustivel: 'Gasolina' as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex',
    quantidade_litros: '',
    valor_litro: '',
    km_atual: '',
    nome_posto: "",
  });

  const [loading, setLoading] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [showFuelTypePicker, setShowFuelTypePicker] = useState(false);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const fetchedVehicles = await vehicleService.getVehicles();
        setVehicles(fetchedVehicles);
        if (fetchedVehicles.length === 1) {
          setFormData(prev => ({ ...prev, id_veiculo: fetchedVehicles[0].id }));
        }
      } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      }
    };
    loadVehicles();
  }, []);

  useEffect(() => {
    const quantidade = parseFloat(formData.quantidade_litros) || 0;
    const valorLitro = parseFloat(formData.valor_litro) || 0;
    setValorTotal(quantidade * valorLitro);
  }, [formData.quantidade_litros, formData.valor_litro]);

  const fuelTypes = [
    { value: 'Gasolina', label: 'Gasolina' },
    { value: 'Etanol', label: 'Etanol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'GNV', label: 'GNV' },
    { value: 'Flex', label: 'Flex' },
  ];

  const handleSubmit = async () => {
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
            onPress: () => navigation?.goBack ? navigation.goBack() : console.log('Go back action'),
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao registrar abastecimento:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível registrar o abastecimento',
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
        <Text style={styles.title}>Novo Abastecimento</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Seleção de Veículo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veículo *</Text>
            <TouchableOpacity 
              style={styles.pickerDisplay}
              onPress={() => setShowVehiclePicker(!showVehiclePicker)}
            >
              <Text style={styles.pickerDisplayText}>
                {formData.id_veiculo ? 
                  vehicles.find(v => v.id === formData.id_veiculo)?.placa || 'Selecione um veículo'
                  : 'Selecione um veículo'
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

          {/* Data do Abastecimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            <TextInput
              style={styles.input}
              value={formData.data_abastecimento}
              onChangeText={(text) => setFormData(prev => ({ ...prev, data_abastecimento: text }))}
              placeholder="YYYY-MM-DD"
              keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
            />
          </View>

          {/* Tipo de Combustível */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Combustível *</Text>
            <TouchableOpacity 
              style={styles.pickerDisplay}
              onPress={() => setShowFuelTypePicker(!showFuelTypePicker)}
            >
              <Text style={styles.pickerDisplayText}>
                {fuelTypes.find(type => type.value === formData.tipo_combustivel)?.label || 'Selecione o tipo de combustível'}
              </Text>
              <Icon name="chevron-down-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
            {showFuelTypePicker && (
              <View style={styles.pickerOptionsContainer}>
                {fuelTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, tipo_combustivel: type.value as any }));
                      setShowFuelTypePicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quantidade de Litros */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade (Litros) *</Text>
            <TextInput
              style={styles.input}
              value={formData.quantidade_litros}
              onChangeText={(text) => setFormData(prev => ({ ...prev, quantidade_litros: text }))}
              placeholder="Ex: 45.5"
              keyboardType={Platform.OS === 'web' ? 'default' : 'decimal-pad'}
            />
          </View>

          {/* Valor por Litro */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor por Litro (R$) *</Text>
            <TextInput
              style={styles.input}
              value={formData.valor_litro}
              onChangeText={(text) => setFormData(prev => ({ ...prev, valor_litro: text }))}
              placeholder="Ex: 5.49"
              keyboardType={Platform.OS === 'web' ? 'default' : 'decimal-pad'}
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
              style={styles.input}
              value={formData.km_atual}
              onChangeText={(text) => setFormData(prev => ({ ...prev, km_atual: text }))}
              placeholder="Ex: 125000"
              keyboardType={Platform.OS === 'web' ? 'default' : 'numeric'}
            />
          </View>

          {/* Nome do Posto (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Posto (Opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.nome_posto}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome_posto: text }))}
              placeholder="Ex: Posto Shell"
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
              <Text style={styles.submitButtonText}>Registrar Abastecimento</Text>
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
});

export default AddFuelingScreenClean;

