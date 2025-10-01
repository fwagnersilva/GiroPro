import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { useFuelService } from '../hooks/useFuelService';
import { useVehicleService } from '../hooks/useVehicleService';
import { FuelRecord } from '../services/fuelService';
import FuelForm from './FuelForm';

const FuelList: React.FC = () => {
  const { 
    fuelRecords, 
    loading: fuelLoading, 
    error: fuelError, 
    fetchFuelRecords, 
    addFuelRecord, 
    editFuelRecord, 
    removeFuelRecord 
  } = useFuelService();

  const { 
    vehicles, 
    loading: vehiclesLoading, 
    fetchVehicles 
  } = useVehicleService();

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);

  useEffect(() => {
    fetchFuelRecords();
    fetchVehicles();
  }, [fetchFuelRecords, fetchVehicles]);

  const handleAddRecord = () => {
    if (vehicles.length === 0) {
      Alert.alert(
        'Nenhum Veículo',
        'É necessário cadastrar pelo menos um veículo antes de registrar abastecimentos.',
        [{ text: 'OK' }]
      );
      return;
    }
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEditRecord = (record: FuelRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDeleteRecord = (record: FuelRecord) => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo';
    
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o abastecimento de ${vehicleName} do dia ${formatDate(record.date)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => removeFuelRecord(record.id)
        }
      ]
    );
  };

  const handleFormSubmit = async (data: any) => {
    if (editingRecord) {
      await editFuelRecord(editingRecord.id, data);
    } else {
      await addFuelRecord(data);
    }
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: { [key: string]: string } = {
      'gasoline': 'Gasolina',
      'ethanol': 'Etanol',
      'diesel': 'Diesel'
    };
    return labels[fuelType] || fuelType;
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo não encontrado';
  };

  const renderFuelItem = ({ item }: { item: FuelRecord }) => (
    <View style={styles.fuelItem}>
      <View style={styles.fuelHeader}>
        <Text style={styles.vehicleName}>{getVehicleName(item.vehicleId)}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.fuelDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quilometragem:</Text>
          <Text style={styles.detailValue}>{item.odometer.toLocaleString('pt-BR')} km</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Combustível:</Text>
          <Text style={styles.detailValue}>{getFuelTypeLabel(item.fuelType)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Litros:</Text>
          <Text style={styles.detailValue}>{item.liters.toFixed(2)} L</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preço/L:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.pricePerLiter)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            {formatCurrency(item.totalPrice)}
          </Text>
        </View>
        
        {item.gasStation && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posto:</Text>
            <Text style={styles.detailValue}>{item.gasStation}</Text>
          </View>
        )}
        
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.detailLabel}>Observações:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditRecord(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRecord(item)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const loading = fuelLoading || vehiclesLoading;

  if (loading && fuelRecords.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando abastecimentos...</Text>
      </View>
    );
  }

  if (fuelError && fuelRecords.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {fuelError}</Text>
        <Text style={styles.errorSubtext}>Não foi possível carregar os abastecimentos.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFuelRecords}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abastecimentos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
          <Text style={styles.addButtonText}>+ Registrar</Text>
        </TouchableOpacity>
      </View>

      {fuelRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum abastecimento registrado</Text>
          <Text style={styles.emptyStateSubtext}>
            Clique em "Registrar" para adicionar seu primeiro abastecimento
          </Text>
        </View>
      ) : (
        <FlatList
          data={fuelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={renderFuelItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <FuelForm
          fuelRecord={editingRecord || undefined}
          vehicles={vehicles}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isEditing={!!editingRecord}
        />
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  fuelItem: {
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
  fuelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  fuelDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    fontStyle: 'italic',
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

export default FuelList;
