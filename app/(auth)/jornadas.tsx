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
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJourneyToFinish, setSelectedJourneyToFinish] = useState<Journey | null>(null);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [kmInicio, setKmInicio] = useState('');
  const [kmFim, setKmFim] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [platformRevenues, setPlatformRevenues] = useState<{ [key: string]: string }>({});

  // Finish journey form state
  const [finishKmFim, setFinishKmFim] = useState('');
  const [finishPlatformRevenues, setFinishPlatformRevenues] = useState<{ [key: string]: string }>({});
  const [finishPlatformRevenuesBeforeCutoff, setFinishPlatformRevenuesBeforeCutoff] = useState<{ [key: string]: string }>({});
  const [finishPlatformRevenuesAfterCutoff, setFinishPlatformRevenuesAfterCutoff] = useState<{ [key: string]: string }>({});

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

  const handleCancelJourney = async (journeyId: string) => {
    Alert.alert(
      'Cancelar Jornada',
      'Tem certeza que deseja cancelar esta jornada? Esta ação não pode ser desfeita.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Para cancelar, vamos deletar a jornada
              const { deleteJourney } = await import('../../src/services/journeyService');
              await deleteJourney(journeyId);
              Alert.alert('Sucesso', 'Jornada cancelada com sucesso!');
              await loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao cancelar jornada');
            }
          },
        },
      ]
    );
  };

  // Função para verificar se a jornada atravessa o horário de corte de uma plataforma
  const checksCutoffTime = (journey: Journey, platformName: string): boolean => {
    const startDate = new Date(journey.dataInicio);
    const currentDate = new Date();
    
    // Definir horários de corte por plataforma
    const cutoffTimes: { [key: string]: number } = {
      '99': 0,    // Meia-noite (00:00)
      'Uber': 4,  // 04:00 da manhã
    };
    
    const cutoffHour = cutoffTimes[platformName];
    if (cutoffHour === undefined) return false;
    
    // Criar data do horário de corte no dia da jornada
    const cutoffDate = new Date(startDate);
    cutoffDate.setHours(cutoffHour, 0, 0, 0);
    
    // Se a jornada começou antes do horário de corte e está sendo finalizada depois
    if (startDate < cutoffDate && currentDate > cutoffDate) {
      return true;
    }
    
    // Se a jornada começou em um dia e está sendo finalizada no dia seguinte
    const startDay = startDate.getDate();
    const currentDay = currentDate.getDate();
    if (startDay !== currentDay) {
      return true;
    }
    
    return false;
  };

  const handleFinishJourney = (journey: Journey) => {
    setSelectedJourneyToFinish(journey);
    setFinishKmFim('');
    setFinishPlatformRevenues({});
    setFinishPlatformRevenuesBeforeCutoff({});
    setFinishPlatformRevenuesAfterCutoff({});
    setShowFinishModal(true);
  };

  const handleCloseFinishModal = () => {
    setShowFinishModal(false);
    setSelectedJourneyToFinish(null);
    setFinishKmFim('');
    setFinishPlatformRevenues({});
    setFinishPlatformRevenuesBeforeCutoff({});
    setFinishPlatformRevenuesAfterCutoff({});
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
          journeys.map((journey) => {
            const isActive = !journey.dataFim || !journey.kmFim;
            
            return (
              <View key={journey.id} style={styles.journeyCard}>
                <View style={styles.journeyHeader}>
                  <View style={styles.journeyHeaderLeft}>
                    <Text style={styles.journeyDate}>{formatDate(journey.dataInicio)}</Text>
                    {isActive && (
                      <View style={styles.activeIndicator}>
                        <Text style={styles.activeIndicatorText}>ATIVA</Text>
                      </View>
                    )}
                  </View>
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
                
                {/* Botões de ação para jornadas ativas */}
                {isActive && (
                  <View style={styles.journeyActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelJourney(journey.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.finishButton]}
                      onPress={() => handleFinishJourney(journey)}
                    >
                      <Text style={styles.finishButtonText}>Finalizar Jornada</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
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

      {/* Modal de finalizar jornada */}
      <Modal
        visible={showFinishModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseFinishModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseFinishModal}>
              <Text style={styles.modalCloseButton}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Finalizar Jornada</Text>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedJourneyToFinish && (
              <>
                {/* Informações da jornada */}
                <View style={styles.journeyInfoSection}>
                  <Text style={styles.sectionTitle}>Informações da Jornada</Text>
                  <Text style={styles.journeyInfoText}>
                    Iniciada em: {formatDate(selectedJourneyToFinish.dataInicio)}
                  </Text>
                  <Text style={styles.journeyInfoText}>
                    KM Inicial: {selectedJourneyToFinish.kmInicio}
                  </Text>
                </View>

                {/* KM Final */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>KM Final *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Quilometragem final"
                    keyboardType="numeric"
                    value={finishKmFim}
                    onChangeText={setFinishKmFim}
                  />
                </View>

                {/* Faturamento por plataforma */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Faturamento por Plataforma *</Text>
                  {platforms.map((platform) => {
                    const crossesCutoff = checksCutoffTime(selectedJourneyToFinish, platform.nome);
                    
                    return (
                      <View key={platform.id} style={styles.platformSection}>
                        <Text style={styles.platformSectionTitle}>{platform.nome}</Text>
                        
                        {crossesCutoff ? (
                          // Mostrar dois campos quando atravessa horário de corte
                          <>
                            <Text style={styles.cutoffWarning}>
                              ⚠️ Esta jornada atravessou o horário de corte da {platform.nome}
                            </Text>
                            <View style={styles.cutoffRevenueRow}>
                              <Text style={styles.cutoffRevenueLabel}>
                                Antes do horário de corte:
                              </Text>
                              <TextInput
                                style={styles.cutoffRevenueInput}
                                placeholder="R$ 0,00"
                                keyboardType="decimal-pad"
                                value={finishPlatformRevenuesBeforeCutoff[platform.id] || ''}
                                onChangeText={(value) =>
                                  setFinishPlatformRevenuesBeforeCutoff({
                                    ...finishPlatformRevenuesBeforeCutoff,
                                    [platform.id]: value,
                                  })
                                }
                              />
                            </View>
                            <View style={styles.cutoffRevenueRow}>
                              <Text style={styles.cutoffRevenueLabel}>
                                Depois do horário de corte:
                              </Text>
                              <TextInput
                                style={styles.cutoffRevenueInput}
                                placeholder="R$ 0,00"
                                keyboardType="decimal-pad"
                                value={finishPlatformRevenuesAfterCutoff[platform.id] || ''}
                                onChangeText={(value) =>
                                  setFinishPlatformRevenuesAfterCutoff({
                                    ...finishPlatformRevenuesAfterCutoff,
                                    [platform.id]: value,
                                  })
                                }
                              />
                            </View>
                          </>
                        ) : (
                          // Mostrar um campo quando não atravessa horário de corte
                          <View style={styles.platformRevenueRow}>
                            <Text style={styles.platformRevenueName}>Faturamento Total:</Text>
                            <TextInput
                              style={styles.platformRevenueInput}
                              placeholder="R$ 0,00"
                              keyboardType="decimal-pad"
                              value={finishPlatformRevenues[platform.id] || ''}
                              onChangeText={(value) =>
                                setFinishPlatformRevenues({
                                  ...finishPlatformRevenues,
                                  [platform.id]: value,
                                })
                              }
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                  
                  {/* Total geral */}
                  <Text style={styles.totalRevenue}>
                    Total Geral: R${' '}
                    {(
                      Object.values(finishPlatformRevenues).reduce((sum, value) => sum + (parseFloat(value) || 0), 0) +
                      Object.values(finishPlatformRevenuesBeforeCutoff).reduce((sum, value) => sum + (parseFloat(value) || 0), 0) +
                      Object.values(finishPlatformRevenuesAfterCutoff).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Botão finalizar */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={() => {/* TODO: Implementar handleFinishSubmit */}}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Finalizar Jornada</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
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
  // Novos estilos para jornadas ativas
  journeyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeIndicator: {
    backgroundColor: '#FF9500',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  activeIndicatorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  journeyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#34C759',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para o modal de finalização
  journeyInfoSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  journeyInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  platformSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  platformSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cutoffWarning: {
    fontSize: 12,
    color: '#FF9500',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  cutoffRevenueRow: {
    marginBottom: 12,
  },
  cutoffRevenueLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  cutoffRevenueInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
  },
});

export default JornadasScreen;
