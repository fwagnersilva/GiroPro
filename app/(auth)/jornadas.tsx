import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getJourneys,
  createJourney,
  Journey,
  PlatformRevenue,
} from '../../src/services/journeyService';
import { getActivePlatforms, Platform } from '../../src/services/platformService';
import { getVehicles, Vehicle } from '../../src/services/vehicleService';

const JornadasScreen: React.FC = () => {
  const router = useRouter();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [kmInicio, setKmInicio] = useState('');
  const [kmFim, setKmFim] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [platformRevenues, setPlatformRevenues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [journeysData, platformsData, vehiclesData] = await Promise.all([
        getJourneys(),
        getActivePlatforms(),
        getVehicles(),
      ]);
      setJourneys(journeysData);
      setPlatforms(platformsData);
      setVehicles(vehiclesData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (vehicles.length === 0) {
      Alert.alert('Atenção', 'Você precisa cadastrar um veículo primeiro');
      return;
    }
    if (platforms.length === 0) {
      Alert.alert('Atenção', 'Você precisa ativar pelo menos uma plataforma');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedVehicle('');
    setKmInicio('');
    setKmFim('');
    setDataInicio('');
    setDataFim('');
    setObservacoes('');
    setPlatformRevenues({});
  };

  const handleSubmit = async () => {
    if (!selectedVehicle || !kmInicio || !dataInicio) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    // Calcular ganho bruto total
    const totalRevenue = Object.values(platformRevenues).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );

    if (totalRevenue === 0) {
      Alert.alert('Atenção', 'Informe o faturamento de pelo menos uma plataforma');
      return;
    }

    try {
      setIsSubmitting(true);

      // Preparar dados das plataformas
      const plataformasData: PlatformRevenue[] = Object.entries(platformRevenues)
        .filter(([_, value]) => parseFloat(value) > 0)
        .map(([idPlataforma, value]) => ({
          idPlataforma,
          valor: Math.round(parseFloat(value) * 100), // Converter para centavos
        }));

      const journeyData = {
        idVeiculo: selectedVehicle,
        dataInicio,
        kmInicio: parseInt(kmInicio),
        ...(dataFim && { dataFim }),
        ...(kmFim && { kmFim: parseInt(kmFim) }),
        ganhoBruto: Math.round(totalRevenue * 100), // Converter para centavos
        ...(observacoes && { observacoes }),
        plataformas: plataformasData,
      };

      await createJourney(journeyData);
      Alert.alert('Sucesso', 'Jornada registrada com sucesso!');
      handleCloseModal();
      await loadData();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao registrar jornada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando jornadas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jornadas</Text>
        <Text style={styles.headerSubtitle}>Registre suas viagens diárias</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Botão adicionar */}
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Text style={styles.addButtonText}>+ Nova Jornada</Text>
        </TouchableOpacity>

        {/* Lista de jornadas */}
        {journeys.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma jornada registrada</Text>
            <Text style={styles.emptyStateSubtext}>
              Toque em "Nova Jornada" para começar
            </Text>
          </View>
        ) : (
          journeys.map((journey) => (
            <View key={journey.id} style={styles.journeyCard}>
              <View style={styles.journeyHeader}>
                <Text style={styles.journeyDate}>{formatDate(journey.dataInicio)}</Text>
                <Text style={styles.journeyRevenue}>
                  {formatCurrency(journey.ganhoBruto || 0)}
                </Text>
              </View>
              <View style={styles.journeyDetails}>
                <Text style={styles.journeyDetailText}>
                  KM: {journey.kmInicio} → {journey.kmFim || '---'}
                </Text>
                {journey.kmTotal && (
                  <Text style={styles.journeyDetailText}>
                    Total: {journey.kmTotal} km
                  </Text>
                )}
              </View>
              {journey.observacoes && (
                <Text style={styles.journeyObservation}>{journey.observacoes}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de nova jornada */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.modalCloseButton}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Jornada</Text>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Veículo */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Veículo *</Text>
              <View style={styles.pickerContainer}>
                {vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.pickerOption,
                      selectedVehicle === vehicle.id && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setSelectedVehicle(vehicle.id)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedVehicle === vehicle.id &&
                          styles.pickerOptionTextSelected,
                      ]}
                    >
                      {vehicle.make} {vehicle.model}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Data e KM */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Data Início *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={dataInicio}
                  onChangeText={setDataInicio}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>KM Início *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={kmInicio}
                  onChangeText={setKmInicio}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Data Fim</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={dataFim}
                  onChangeText={setDataFim}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>KM Fim</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={kmFim}
                  onChangeText={setKmFim}
                />
              </View>
            </View>

            {/* Faturamento por plataforma */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Faturamento por Plataforma *</Text>
              {platforms.map((platform) => (
                <View key={platform.id} style={styles.platformRevenueRow}>
                  <Text style={styles.platformRevenueName}>{platform.nome}</Text>
                  <TextInput
                    style={styles.platformRevenueInput}
                    placeholder="R$ 0,00"
                    keyboardType="decimal-pad"
                    value={platformRevenues[platform.id] || ''}
                    onChangeText={(value) =>
                      setPlatformRevenues({
                        ...platformRevenues,
                        [platform.id]: value,
                      })
                    }
                  />
                </View>
              ))}
              <Text style={styles.totalRevenue}>
                Total: R${' '}
                {Object.values(platformRevenues)
                  .reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
                  .toFixed(2)}
              </Text>
            </View>

            {/* Observações */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações sobre a jornada..."
                multiline
                numberOfLines={4}
                value={observacoes}
                onChangeText={setObservacoes}
              />
            </View>

            {/* Botão salvar */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar Jornada</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  journeyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  journeyRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  journeyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  journeyDetailText: {
    fontSize: 14,
    color: '#666',
  },
  journeyObservation: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    gap: 8,
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  pickerOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  platformRevenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformRevenueName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  platformRevenueInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: 120,
    textAlign: 'right',
  },
  totalRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JornadasScreen;
