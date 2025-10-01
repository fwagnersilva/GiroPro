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
import { Vehicle, CreateVehicleData, UpdateVehicleData } from '../services/vehicleService';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: CreateVehicleData | UpdateVehicleData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  vehicle, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year?.toString() || '',
    plate: vehicle?.plate || '',
    color: vehicle?.color || '',
    fuelType: vehicle?.fuelType || 'flex' as const,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.make.trim() || !formData.model.trim()) {
      Alert.alert('Erro', 'Marca e modelo são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const submitData: CreateVehicleData = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: formData.year ? parseInt(formData.year) : undefined,
        plate: formData.plate.trim() || undefined,
        color: formData.color.trim() || undefined,
        fuelType: formData.fuelType,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Veículo' : 'Cadastrar Veículo'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={styles.input}
            value={formData.make}
            onChangeText={(text) => setFormData(prev => ({ ...prev, make: text }))}
            placeholder="Ex: Toyota"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Modelo *</Text>
          <TextInput
            style={styles.input}
            value={formData.model}
            onChangeText={(text) => setFormData(prev => ({ ...prev, model: text }))}
            placeholder="Ex: Corolla"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ano</Text>
          <TextInput
            style={styles.input}
            value={formData.year}
            onChangeText={(text) => setFormData(prev => ({ ...prev, year: text }))}
            placeholder="Ex: 2020"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={formData.plate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, plate: text }))}
            placeholder="Ex: ABC-1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cor</Text>
          <TextInput
            style={styles.input}
            value={formData.color}
            onChangeText={(text) => setFormData(prev => ({ ...prev, color: text }))}
            placeholder="Ex: Prata"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Combustível</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.fuelType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
              style={styles.picker}
            >
              <Picker.Item label="Flex" value="flex" />
              <Picker.Item label="Gasolina" value="gasoline" />
              <Picker.Item label="Etanol" value="ethanol" />
              <Picker.Item label="Diesel" value="diesel" />
            </Picker>
          </View>
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
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    height: 50,
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

export default VehicleForm;
