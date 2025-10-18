import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Dimensions, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';
import {
  useJourneys,
  useCreateJourney,
  useUpdateJourney,
  useDeleteJourney,
  useFinalizeJourney,
} from '@/lib/hooks/useJourneys';
import { useVehicles } from '@/lib/hooks/useVehicles';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface Trip {
  id: string;
  vehicleId?: string;
  idVeiculo?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  startDate?: string;
  dataInicio?: string;
  endDate?: string | null;
  dataFim?: string | null;
  startOdometer?: number;
  kmInicio?: number;
  endOdometer?: number | null;
  kmFim?: number | null;
  status?: 'active' | 'paused' | 'completed';
  pausedOdometer?: number | null;
  pauseTimestamps?: { pause: string; resume: string | null; pauseKm: number; resumeKm: number | null }[];
  earnings?: { uber: number; app99: number; total: number } | null;
  valorTotal?: number;
}

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
}

// Função para detectar cruzamento de horário
const detectTimeShiftCrossing = (startDate: string) => {
  const start = new Date(startDate);
  const now = new Date();
  
  // Para 99Pop: verifica se cruzou meia-noite (00:00)
  const crossed99Midnight = start.getDate() !== now.getDate();
  
  // Para Uber: verifica se cruzou 4h da manhã
  let crossedUber4AM = false;
  if (start.getDate() === now.getDate()) {
    // Mesmo dia: verifica se iniciou antes das 4h e agora é depois
    crossedUber4AM = start.getHours() < 4 && now.getHours() >= 4;
  } else {
    // Dias diferentes: sempre cruzou 4h
    crossedUber4AM = true;
  }
  
  return {
    crossed99: crossed99Midnight,
    crossedUber: crossedUber4AM,
    hasCrossing: crossed99Midnight || crossedUber4AM
  };
};

// Componente do Card de Jornada Ativa
const ActiveTripCard = ({ 
  trip, 
  vehicle,
  pauseKmInput,
  setPauseKmInput,
  resumeKmInput,
  setResumeKmInput,
  endOdometerInput,
  setEndOdometerInput,
  uber1Input,
  setUber1Input,
  uber2Input,
  setUber2Input,
  app99_1Input,
  setApp99_1Input,
  app99_2Input,
  setApp99_2Input,
  onPause,
  onResume,
  onFinish, 
  onCancel 
}: { 
  trip: Trip; 
  vehicle?: Vehicle;
  pauseKmInput: string;
  setPauseKmInput: (value: string) => void;
  resumeKmInput: string;
  setResumeKmInput: (value: string) => void;
  endOdometerInput: string;
  setEndOdometerInput: (value: string) => void;
  uber1Input: string;
  setUber1Input: (value: string) => void;
  uber2Input: string;
  setUber2Input: (value: string) => void;
  app99_1Input: string;
  setApp99_1Input: (value: string) => void;
  app99_2Input: string;
  setApp99_2Input: (value: string) => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancel: () => void;
}) => {
  const startDate = trip.startDate || trip.dataInicio || '';
  const startOdometer = trip.startOdometer || trip.kmInicio || 0;
  const isPaused = trip.status === 'paused';
  
  const getElapsedTime = () => {
    const start = new Date(startDate);
    const now = new Date();
    let totalMs = now.getTime() - start.getTime();
    
    // Subtrair tempo de pausas
    if (trip.pauseTimestamps && trip.pauseTimestamps.length > 0) {
      trip.pauseTimestamps.forEach(pause => {
        if (pause.pause && pause.resume) {
          const pauseStart = new Date(pause.pause);
          const pauseEnd = new Date(pause.resume);
          totalMs -= (pauseEnd.getTime() - pauseStart.getTime());
        } else if (pause.pause && !pause.resume) {
          // Pausa ativa - subtrair desde o início da pausa até agora
          const pauseStart = new Date(pause.pause);
          totalMs -= (now.getTime() - pauseStart.getTime());
        }
      });
    }
    
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const elapsed = getElapsedTime();
  const crossing = detectTimeShiftCrossing(startDate);

  return (
    <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-200">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 ${isPaused ? 'bg-orange-600' : 'bg-blue-600'} rounded-full items-center justify-center mr-3`}>
            <Ionicons name={isPaused ? "pause" : "car-sport"} size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">
              {isPaused ? 'Jornada Pausada' : 'Jornada em Andamento'}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Início: {new Date(startDate).toLocaleDateString('pt-BR')} {new Date(startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>

      {/* Informações do Veículo */}
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <Text className="text-white font-bold text-base mb-1">
          Veículo: {vehicle?.marca} {vehicle?.modelo} ({vehicle?.placa || 'N/A'})
        </Text>
        <Text className="text-gray-300 text-sm">
          Início: {new Date(startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | Tempo ativo: {elapsed.hours}h {elapsed.minutes}min
        </Text>
      </View>

      {/* KM Inicial */}
      <View className="bg-blue-50 rounded-xl p-4 mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">KM Inicial *</Text>
        <Input
          value={startOdometer.toString()}
          editable={false}
          className="bg-white"
        />
      </View>

      {/* Seção de Pausa/Retomada */}
      {isPaused ? (
        <View className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="pause-circle" size={20} color="#EA580C" />
            <Text className="text-sm font-bold text-orange-900 ml-2">Jornada Pausada</Text>
          </View>
          
          <Text className="text-sm font-semibold text-gray-700 mb-2">KM de Retomada *</Text>
          <Input
            placeholder="Informe o KM atual para retomar"
            value={resumeKmInput}
            onChangeText={setResumeKmInput}
            keyboardType="numeric"
            className="bg-white mb-3"
          />
          
          <Button onPress={onResume} className="bg-green-600 py-3 rounded-xl">
            <Text className="text-white font-bold text-center">▶ Retomar Jornada</Text>
          </Button>
        </View>
      ) : (
        <>
          {/* Botão de Pausar (quando não está pausado) */}
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">KM de Pausa</Text>
            <Input
              placeholder="Informe o KM atual para pausar"
              value={pauseKmInput}
              onChangeText={setPauseKmInput}
              keyboardType="numeric"
              className="bg-white mb-3"
            />
            
            <Button onPress={onPause} className="bg-orange-600 py-3 rounded-xl">
              <Text className="text-white font-bold text-center">⏸ Pausar Jornada</Text>
            </Button>
          </View>

          {/* Aviso de Cruzamento */}
          {crossing.hasCrossing && (
            <View className="bg-blue-100 border border-blue-300 rounded-xl p-3 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="alert-circle" size={20} color="#2563EB" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-bold text-blue-900 mb-1">Cruzamento de Horário Detectado!</Text>
                  {crossing.crossed99 && (
                    <Text className="text-xs text-blue-800">
                      • Cruzou 00:00 (meia-noite) - Separe os valores da 99
                    </Text>
                  )}
                  {crossing.crossedUber && (
                    <Text className="text-xs text-blue-800">
                      • Cruzou 04:00 - Separe os valores da UBER
                    </Text>
                  )}
                  <Text className="text-xs text-blue-700 mt-1 italic">
                    Isso é importante para o relatório fiscal das plataformas
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* KM Final */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">KM Final *</Text>
            <Input
              placeholder="Quilometragem no painel"
              value={endOdometerInput}
              onChangeText={setEndOdometerInput}
              keyboardType="numeric"
              className="bg-gray-50"
            />
          </View>

          {/* Faturamento por Plataforma */}
          <Text className="text-base font-bold text-gray-900 mb-3">Faturamento por Plataforma (R$)</Text>
          
          {/* 99Pop */}
          <View className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <Text className="text-sm font-semibold text-orange-900 mb-2">99</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  placeholder={crossing.crossed99 ? "Dia anterior" : "0,00"}
                  value={app99_1Input}
                  onChangeText={setApp99_1Input}
                  keyboardType="decimal-pad"
                  className="bg-white"
                />
              </View>
              {crossing.crossed99 && (
                <View className="flex-1">
                  <Input
                    placeholder="Novo dia (0,00)"
                    value={app99_2Input}
                    onChangeText={setApp99_2Input}
                    keyboardType="decimal-pad"
                    className="bg-white"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Uber */}
          <View className="mb-6 bg-gray-100 border border-gray-300 rounded-xl p-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">UBER</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  placeholder={crossing.crossedUber ? "Antes das 4h" : "0,00"}
                  value={uber1Input}
                  onChangeText={setUber1Input}
                  keyboardType="decimal-pad"
                  className="bg-white"
                />
              </View>
              {crossing.crossedUber && (
                <View className="flex-1">
                  <Input
                    placeholder="Após 4h (0,00)"
                    value={uber2Input}
                    onChangeText={setUber2Input}
                    keyboardType="decimal-pad"
                    className="bg-white"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Botões de Finalizar e Cancelar */}
          <View className="flex-row gap-3">
            <Button onPress={onFinish} className="flex-1 bg-green-600 py-4 rounded-xl">
              <Text className="text-white font-bold text-center">✓ Finalizar Jornada</Text>
            </Button>
            <Button onPress={onCancel} className="bg-red-600 px-6 py-4 rounded-xl">
              <Text className="text-white font-bold text-center">✕ Cancelar</Text>
            </Button>
          </View>
        </>
      )}

      {/* Histórico de Pausas */}
      {trip.pauseTimestamps && trip.pauseTimestamps.length > 0 && (
        <View className="mt-4 bg-gray-50 rounded-xl p-4">
          <Text className="text-sm font-bold text-gray-900 mb-2">Histórico de Pausas</Text>
          {trip.pauseTimestamps.map((pause, index) => (
            <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <View className="flex-1">
                <Text className="text-xs text-gray-600">
                  Pausa {index + 1}: {new Date(pause.pause).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (KM: {pause.pauseKm})
                </Text>
                {pause.resume && (
                  <Text className="text-xs text-gray-600">
                    Retomada: {new Date(pause.resume).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} (KM: {pause.resumeKm})
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Componente do Card de Histórico
const HistoryTripCard = ({ 
  trip, 
  vehicle,
  onDelete 
}: { 
  trip: Trip; 
  vehicle?: Vehicle;
  onDelete: () => void;
}) => {
  const startDate = trip.startDate || trip.dataInicio || '';
  const endDate = trip.endDate || trip.dataFim || '';
  const startOdometer = trip.startOdometer || trip.kmInicio || 0;
  const endOdometer = trip.endOdometer || trip.kmFim || 0;
  const kmPercorrido = endOdometer - startOdometer;
  
  // Calcular tempo de jornada (descontando pausas)
  const getJourneyTime = () => {
    if (!startDate || !endDate) return '0h 0min';
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalMs = end.getTime() - start.getTime();
    
    // Subtrair tempo de pausas
    if (trip.pauseTimestamps && trip.pauseTimestamps.length > 0) {
      trip.pauseTimestamps.forEach(pause => {
        if (pause.pause && pause.resume) {
          const pauseStart = new Date(pause.pause);
          const pauseEnd = new Date(pause.resume);
          totalMs -= (pauseEnd.getTime() - pauseStart.getTime());
        }
      });
    }
    
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  // Valores fictícios para demonstração (substituir por dados reais da API)
  const valorBruto = trip.valorTotal ? (trip.valorTotal / 100) : 0;
  const valorLiquido = valorBruto * 0.85; // Exemplo: 85% do bruto
  const valor99 = valorBruto * 0.4; // Exemplo
  const valorUber = valorBruto * 0.6; // Exemplo

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-200">
      {/* Header com Data */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-gray-900">
          {new Date(startDate).toLocaleDateString('pt-BR')}
        </Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Informações do Veículo */}
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <Text className="text-white font-bold text-sm mb-1">
          Veículo: {vehicle?.marca} {vehicle?.modelo} ({vehicle?.placa || 'N/A'})
        </Text>
        <Text className="text-gray-300 text-xs">
          {new Date(startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Valores Principais */}
      <View className="flex-row mb-4">
        <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2 border border-green-200">
          <View className="flex-row items-center mb-1">
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text className="text-xs text-gray-600 ml-1">Bruto</Text>
          </View>
          <Text className="text-lg font-bold text-green-700">R$ {valorBruto.toFixed(2)}</Text>
        </View>
        
        <View className="flex-1 bg-blue-50 rounded-xl p-3 border border-blue-200">
          <View className="flex-row items-center mb-1">
            <Ionicons name="cash" size={16} color="#3B82F6" />
            <Text className="text-xs text-gray-600 ml-1">Líquido</Text>
          </View>
          <Text className="text-lg font-bold text-blue-700">R$ {valorLiquido.toFixed(2)}</Text>
        </View>
        
        <View className="flex-1 bg-purple-50 rounded-xl p-3 ml-2 border border-purple-200">
          <View className="flex-row items-center mb-1">
            <Ionicons name="navigate" size={16} color="#8B5CF6" />
            <Text className="text-xs text-gray-600 ml-1">KM</Text>
          </View>
          <Text className="text-lg font-bold text-purple-700">{kmPercorrido.toFixed(0)} km</Text>
        </View>
      </View>

      {/* Detalhes Adicionais */}
      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">Tempo</Text>
          </View>
          <Text className="text-sm font-bold text-gray-900">{getJourneyTime()}</Text>
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Ionicons name="speedometer-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">R$/Hora</Text>
          </View>
          <Text className="text-sm font-bold text-gray-900">
            R$ {(valorLiquido / (parseInt(getJourneyTime().split('h')[0]) || 1)).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Faturamento por Plataforma */}
      <Text className="text-xs font-semibold text-gray-700 mb-2">Detalhado por Plataforma</Text>
      <View className="flex-row gap-2">
        <View className="flex-1 bg-orange-50 rounded-lg p-3 border border-orange-200">
          <Text className="text-xs text-orange-900 font-semibold mb-1">99</Text>
          <Text className="text-base font-bold text-orange-700">R$ {valor99.toFixed(2)}</Text>
        </View>
        
        <View className="flex-1 bg-gray-100 rounded-lg p-3 border border-gray-300">
          <Text className="text-xs text-gray-900 font-semibold mb-1">UBER</Text>
          <Text className="text-base font-bold text-gray-700">R$ {valorUber.toFixed(2)}</Text>
        </View>
      </View>

      {/* Histórico de Pausas */}
      {trip.pauseTimestamps && trip.pauseTimestamps.length > 0 && (
        <View className="mt-4 bg-gray-50 rounded-xl p-3">
          <Text className="text-xs font-bold text-gray-900 mb-2">Pausas durante a jornada: {trip.pauseTimestamps.length}</Text>
          {trip.pauseTimestamps.map((pause, index) => (
            <Text key={index} className="text-xs text-gray-600">
              • Pausa {index + 1}: {pause.pauseKm} km → {pause.resumeKm} km
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default function Trips() {
  const { data: journeysData, isLoading: isLoadingJourneys, refetch: refetchJourneys } = useJourneys();
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles();
  const createJourney = useCreateJourney();
  const updateJourney = useUpdateJourney();
  const deleteJourney = useDeleteJourney();
  const finalizeJourney = useFinalizeJourney();

  const [startOdometerInput, setStartOdometerInput] = useState('');
  const [pauseKmInput, setPauseKmInput] = useState('');
  const [resumeKmInput, setResumeKmInput] = useState('');
  const [endOdometerInput, setEndOdometerInput] = useState('');
  
  // Estados para faturamento
  const [uber1Input, setUber1Input] = useState('');
  const [uber2Input, setUber2Input] = useState('');
  const [app99_1Input, setApp99_1Input] = useState('');
  const [app99_2Input, setApp99_2Input] = useState('');
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const vehicles: Vehicle[] = vehiclesData || [];
  const trips: Trip[] = journeysData || [];
  const activeTrip = trips.find((trip) => !(trip.endDate || trip.dataFim));
  const allCompletedTrips = trips.filter(trip => trip.endDate || trip.dataFim);

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchJourneys();
    setRefreshing(false);
  };

  const handleStartTrip = async () => {
    if (!selectedVehicleId || !startOdometerInput) {
      Alert.alert('Erro', 'Selecione um veículo e informe a quilometragem inicial.');
      return;
    }
    const odometerNum = parseInt(startOdometerInput);
    if (isNaN(odometerNum) || odometerNum <= 0) {
      Alert.alert('Erro', 'Quilometragem inicial inválida.');
      return;
    }
    if (activeTrip) {
      Alert.alert('Erro', 'Já existe uma jornada ativa.');
      return;
    }
    try {
      await createJourney.mutateAsync({
        idVeiculo: selectedVehicleId,
        kmInicio: odometerNum,
        dataInicio: new Date().toISOString(),
        status: 'active',
      });
      setStartOdometerInput('');
      Alert.alert('Sucesso', 'Jornada iniciada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível iniciar a jornada.');
      console.error(error);
    }
  };

  const handlePauseTrip = async () => {
    if (!activeTrip || !pauseKmInput) {
      Alert.alert('Erro', 'Informe o KM de pausa.');
      return;
    }
    const pauseKm = parseInt(pauseKmInput);
    const startOdometer = activeTrip.startOdometer || activeTrip.kmInicio || 0;
    
    if (isNaN(pauseKm) || pauseKm <= startOdometer) {
      Alert.alert('Erro', 'KM de pausa inválido.');
      return;
    }

    try {
      const currentPauses = activeTrip.pauseTimestamps || [];
      const newPause = {
        pause: new Date().toISOString(),
        resume: null,
        pauseKm: pauseKm,
        resumeKm: null
      };

      await updateJourney.mutateAsync({
        id: activeTrip.id,
        data: {
          status: 'paused',
          pausedOdometer: pauseKm,
          pauseTimestamps: [...currentPauses, newPause]
        }
      });
      
      setPauseKmInput('');
      Alert.alert('Sucesso', 'Jornada pausada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível pausar a jornada.');
      console.error(error);
    }
  };

  const handleResumeTrip = async () => {
    if (!activeTrip || !resumeKmInput) {
      Alert.alert('Erro', 'Informe o KM de retomada.');
      return;
    }
    const resumeKm = parseInt(resumeKmInput);
    const pausedKm = activeTrip.pausedOdometer || 0;
    
    if (isNaN(resumeKm) || resumeKm < pausedKm) {
      Alert.alert('Erro', 'KM de retomada inválido.');
      return;
    }

    try {
      const currentPauses = activeTrip.pauseTimestamps || [];
      const lastPauseIndex = currentPauses.length - 1;
      
      if (lastPauseIndex >= 0) {
        currentPauses[lastPauseIndex] = {
          ...currentPauses[lastPauseIndex],
          resume: new Date().toISOString(),
          resumeKm: resumeKm
        };
      }

      await updateJourney.mutateAsync({
        id: activeTrip.id,
        data: {
          status: 'active',
          pausedOdometer: null,
          pauseTimestamps: currentPauses
        }
      });
      
      setResumeKmInput('');
      Alert.alert('Sucesso', 'Jornada retomada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível retomar a jornada.');
      console.error(error);
    }
  };

  const handleEndTrip = async () => {
    if (!activeTrip || !endOdometerInput) {
      Alert.alert('Erro', 'Quilometragem final é obrigatória.');
      return;
    }
    const endOdometerNum = parseInt(endOdometerInput);
    const startOdometer = activeTrip.startOdometer || activeTrip.kmInicio || 0;
    
    if (isNaN(endOdometerNum) || endOdometerNum <= startOdometer) {
      Alert.alert('Erro', 'Quilometragem final inválida.');
      return;
    }

    // Calcula o total de faturamento
    const uber1 = parseFloat(uber1Input.replace(',', '.')) || 0;
    const uber2 = parseFloat(uber2Input.replace(',', '.')) || 0;
    const app99_1 = parseFloat(app99_1Input.replace(',', '.')) || 0;
    const app99_2 = parseFloat(app99_2Input.replace(',', '.')) || 0;
    
    const totalEarnings = uber1 + uber2 + app99_1 + app99_2;

    try {
      await finalizeJourney.mutateAsync({
        id: activeTrip.id,
        data: { kmFim: endOdometerNum, valorTotal: Math.round(totalEarnings * 100) }
      });
      
      // Limpa os campos
      setEndOdometerInput('');
      setUber1Input('');
      setUber2Input('');
      setApp99_1Input('');
      setApp99_2Input('');
      setPauseKmInput('');
      setResumeKmInput('');
      
      Alert.alert('Sucesso', 'Jornada finalizada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar.');
      console.error(error);
    }
  };

  const handleCancelTrip = () => {
    Alert.alert(
      'Cancelar Jornada',
      'Tem certeza que deseja cancelar esta jornada?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            if (activeTrip) {
              try {
                await deleteJourney.mutateAsync(activeTrip.id);
                // Limpa os campos
                setEndOdometerInput('');
                setUber1Input('');
                setUber2Input('');
                setApp99_1Input('');
                setApp99_2Input('');
                setPauseKmInput('');
                setResumeKmInput('');
                Alert.alert('Sucesso', 'Jornada cancelada.');
                await refetchJourneys();
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível cancelar.');
              }
            }
          }
        }
      ]
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      'Excluir Jornada',
      'Tem certeza que deseja excluir esta jornada do histórico?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJourney.mutateAsync(tripId);
              Alert.alert('Sucesso', 'Jornada excluída.');
              await refetchJourneys();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          }
        }
      ]
    );
  };

  if (isLoadingJourneys || isLoadingVehicles) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Carregando...</Text>
      </View>
    );
  }

  const vehicleForActiveTrip = vehicles.find(v => v.id === (activeTrip?.vehicleId || activeTrip?.idVeiculo));

  return (
    <View className="flex-1 bg-gray-50">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1 px-4 py-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Título */}
        <Text className="text-2xl font-bold text-gray-900 mb-6">Jornadas</Text>

        {/* Jornada Ativa */}
        {activeTrip && (
          <ActiveTripCard
            trip={activeTrip}
            vehicle={vehicleForActiveTrip}
            pauseKmInput={pauseKmInput}
            setPauseKmInput={setPauseKmInput}
            resumeKmInput={resumeKmInput}
            setResumeKmInput={setResumeKmInput}
            endOdometerInput={endOdometerInput}
            setEndOdometerInput={setEndOdometerInput}
            uber1Input={uber1Input}
            setUber1Input={setUber1Input}
            uber2Input={uber2Input}
            setUber2Input={setUber2Input}
            app99_1Input={app99_1Input}
            setApp99_1Input={setApp99_1Input}
            app99_2Input={app99_2Input}
            setApp99_2Input={setApp99_2Input}
            onPause={handlePauseTrip}
            onResume={handleResumeTrip}
            onFinish={handleEndTrip}
            onCancel={handleCancelTrip}
          />
        )}

        {/* Iniciar Nova Jornada */}
        {!activeTrip && vehicles.length > 0 && (
          <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-200">
            <Text className="text-xl font-bold text-gray-900 mb-4">Iniciar Nova Jornada</Text>
            
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Veículo</Text>
              <Picker
                selectedValue={selectedVehicleId}
                onValueChange={(value) => setSelectedVehicleId(value)}
                style={{ backgroundColor: '#F9FAFB' }}
              >
                {vehicles.map((vehicle) => (
                  <Picker.Item
                    key={vehicle.id}
                    label={`${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`}
                    value={vehicle.id}
                  />
                ))}
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">KM Inicial</Text>
              <Input
                placeholder="Ex: 230730"
                value={startOdometerInput}
                onChangeText={setStartOdometerInput}
                keyboardType="numeric"
                className="bg-gray-50"
              />
            </View>

            <Button onPress={handleStartTrip} className="bg-blue-600 py-4 rounded-xl">
              <Text className="text-white font-bold text-center">Iniciar Jornada</Text>
            </Button>
          </View>
        )}

        {/* Histórico */}
        {allCompletedTrips.length > 0 && (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-4">Histórico</Text>
            {allCompletedTrips.map((trip) => {
              const vehicleForTrip = vehicles.find(v => v.id === (trip.vehicleId || trip.idVeiculo));
              return (
                <HistoryTripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={vehicleForTrip}
                  onDelete={() => handleDeleteTrip(trip.id)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

