import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FuelRecord, CreateFuelRecordData, UpdateFuelRecordData } from '../services/fuelService';
import { Vehicle } from '../services/vehicleService';

interface FuelFormProps {
  fuelRecord?: FuelRecord;
  vehicles: Vehicle[];
  onSubmit: (data: CreateFuelRecordData | UpdateFuelRecordData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const FuelForm: React.FC<FuelFormProps> = ({ 
  fuelRecord, 
  vehicles,
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    vehicleId: fuelRecord?.vehicleId || (vehicles[0]?.id || ''),
    date: fuelRecord?.date || new Date().toISOString().split('T')[0],
    odometer: fuelRecord?.odometer?.toString() || '',
    liters: fuelRecord?.liters?.toString() || '',
    pricePerLiter: fuelRecord?.pricePerLiter?.toString() || '',
    fuelType: fuelRecord?.fuelType || 'gasoline' as const,
    gasStation: fuelRecord?.gasStation || '',
    notes: fuelRecord?.notes || '',
  });

  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calcular preço total automaticamente
  useEffect(() => {
    const liters = parseFloat(formData.liters) || 0;
    const pricePerLiter = parseFloat(formData.pricePerLiter) || 0;
    setTotalPrice(liters * pricePerLiter);
  }, [formData.liters, formData.pricePerLiter]);

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.vehicleId || !formData.date || !formData.odometer || !formData.liters || !formData.pricePerLiter) {
      Alert.alert('Erro', 'Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    const odometer = parseInt(formData.odometer);
    const liters = parseFloat(formData.liters);
    const pricePerLiter = parseFloat(formData.pricePerLiter);

    if (isNaN(odometer) || odometer <= 0) {
      Alert.alert('Erro', 'Quilometragem deve ser um número válido maior que zero.');
      return;
    }

    if (isNaN(liters) || liters <= 0) {
      Alert.alert('Erro', 'Litros deve ser um número válido maior que zero.');
      return;
    }

    if (isNaN(pricePerLiter) || pricePerLiter <= 0) {
      Alert.alert('Erro', 'Preço por litro deve ser um número válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const submitData: CreateFuelRecordData = {
        vehicleId: formData.vehicleId,
        date: formData.date,
        odometer,
        liters,
        pricePerLiter,
        fuelType: formData.fuelType,
        gasStation: formData.gasStation.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao salvar abastecimento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleLabel = (vehicle: Vehicle) => {
    return `${vehicle.make} ${vehicle.model}${vehicle.plate ? ` (${vehicle.plate})` : ''}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Abastecimento' : 'Registrar Abastecimento'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Veículo *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.vehicleId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
              style={styles.picker}
              enabled={!isEditing} // Não permitir alterar veículo ao editar
            >
              {vehicles.map(vehicle => (
                <Picker.Item 
                  key={vehicle.id} 
                  label={getVehicleLabel(vehicle)} 
                  value={vehicle.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data *</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quilometragem *</Text>
          <TextInput
            style={styles.input}
            value={formData.odometer}
            onChangeText={(text) => setFormData(prev => ({ ...prev, odometer: text }))}
            placeholder="Ex: 45000"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Litros *</Text>
          <TextInput
            style={styles.input}
            value={formData.liters}
            onChangeText={(text) => setFormData(prev => ({ ...prev, liters: text }))}
            placeholder="Ex: 40.5"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço por Litro (R$) *</Text>
          <TextInput
            style={styles.input}
            value={formData.pricePerLiter}
            onChangeText={(text) => setFormData(prev => ({ ...prev, pricePerLiter: text }))}
            placeholder="Ex: 5.89"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Combustível *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.fuelType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
              style={styles.picker}
            >
              <Picker.Item label="Gasolina" value="gasoline" />
              <Picker.Item label="Etanol" value="ethanol" />
              <Picker.Item label="Diesel" value="diesel" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Posto de Combustível</Text>
          <TextInput
            style={styles.input}
            value={formData.gasStation}
            onChangeText={(text) => setFormData(prev => ({ ...prev, gasStation: text }))}
            placeholder="Ex: Posto Shell"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Observações adicionais..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total:</Text>
          <Text style={styles.totalPriceValue}>
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.submitButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FuelForm;
