import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVehicleService } from '../hooks/useVehicleService';
import { Vehicle } from '../services/vehicleService';
import VehicleForm from './VehicleForm';

const VehicleList: React.FC = () => {
  const router = useRouter();
  const { 
    vehicles, 
    loading, 
    error, 
    fetchVehicles, 
    addVehicle, 
    editVehicle, 
    removeVehicle 
  } = useVehicleService();




  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleAddVehicle = () => {
    router.push('/vehicles/new');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    router.push(`/vehicles/${vehicle.id}`);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o veículo ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => removeVehicle(vehicle.id)
        }
      ]
    );
  };

  const handleFormSubmit = async (data: any) => {
    // This logic will be moved to the form screen
    console.log('Form submitted, but this logic should be in the form screen.');
  };

  const handleFormCancel = () => {
    // This logic will be moved to the form screen
    console.log('Form cancelled, but this logic should be in the form screen.');
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleItem}>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>{item.make} {item.model}</Text>
        {item.year && <Text style={styles.vehicleDetail}>Ano: {item.year}</Text>}
        {item.plate && <Text style={styles.vehicleDetail}>Placa: {item.plate}</Text>}
        {item.color && <Text style={styles.vehicleDetail}>Cor: {item.color}</Text>}
        {item.fuelType && (
          <Text style={styles.vehicleDetail}>
            Combustível: {getFuelTypeLabel(item.fuelType)}
          </Text>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditVehicle(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteVehicle(item)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: { [key: string]: string } = {
      'flex': 'Flex',
      'gasoline': 'Gasolina',
      'ethanol': 'Etanol',
      'diesel': 'Diesel'
    };
    return labels[fuelType] || fuelType;
  };

  if (loading && vehicles.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Text style={styles.errorSubtext}>Não foi possível carregar os veículos.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVehicles}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veículos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
          <Ionicons name="add-circle" size={24} color="#fff" /><Text style={styles.addButtonText}> Adicionar</Text>
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum veículo cadastrado</Text>
          <Text style={styles.emptyStateSubtext}>
            Clique em "Adicionar" para cadastrar seu primeiro veículo
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicleItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  vehicleItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleInfo: {
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VehicleList;
