import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
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
  onFinish, 
  onCancel 
}: { 
  trip: Trip; 
  vehicle?: Vehicle;
  onFinish: () => void;
  onCancel: () => void;
}) => {
  const startDate = trip.startDate || trip.dataInicio || '';
  const startOdometer = trip.startOdometer || trip.kmInicio || 0;
  
  const getElapsedTime = () => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const elapsed = getElapsedTime();
  const crossing = detectTimeShiftCrossing(startDate);

  return (
    <View className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 mb-6 border-2 border-red-300">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mr-3">
            <Ionicons name="car-sport" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">Jornada em Andamento</Text>
            <Text className="text-sm text-gray-600 mt-1">
              Veículo: {vehicle?.marca} {vehicle?.modelo} ({vehicle?.placa || 'N/A'})
            </Text>
          </View>
        </View>
      </View>

      {/* Informações */}
      <View className="bg-white rounded-xl p-4 mb-4">
        {/* KM Inicial */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="speedometer-outline" size={20} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            KM Início: <Text className="font-bold text-gray-900">{startOdometer.toLocaleString('pt-BR')}</Text>
          </Text>
        </View>

        {/* Hora de Início */}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            Início: <Text className="font-bold text-gray-900">
              {new Date(startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Text>
        </View>
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
    </View>
  );
};

export default function Trips() {
  const { data: journeysData, isLoading: isLoadingJourneys, refetch: refetchJourneys } = useJourneys();
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles();
  const createJourney = useCreateJourney();
  const deleteJourney = useDeleteJourney();
  const finalizeJourney = useFinalizeJourney();

  const [startOdometerInput, setStartOdometerInput] = useState('');
  const [endOdometerInput, setEndOdometerInput] = useState('');
  
  // Estados para faturamento
  const [uber1Input, setUber1Input] = useState('');
  const [uber2Input, setUber2Input] = useState('');
  const [app99_1Input, setApp99_1Input] = useState('');
  const [app99_2Input, setApp99_2Input] = useState('');
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [showEndForm, setShowEndForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const vehicles: Vehicle[] = vehiclesData || [];
  const trips: Trip[] = journeysData || [];
  const activeTrip = trips.find((trip) => !(trip.endDate || trip.dataFim));
  const allCompletedTrips = trips.filter(trip => trip.endDate || trip.dataFim);

  const startDate = activeTrip?.startDate || activeTrip?.dataInicio || '';
  const crossing = startDate ? detectTimeShiftCrossing(startDate) : { crossed99: false, crossedUber: false, hasCrossing: false };

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
      });
      setStartOdometerInput('');
      Alert.alert('Sucesso', 'Jornada iniciada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível iniciar a jornada.');
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
      setShowEndForm(false);
      
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

  if (isLoadingJourneys || isLoadingVehicles) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0066CC" />
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
        {/* Jornada Ativa */}
        {activeTrip && !showEndForm && (
          <>
            <ActiveTripCard
              trip={activeTrip}
              vehicle={vehicleForActiveTrip}
              onFinish={() => setShowEndForm(true)}
              onCancel={handleCancelTrip}
            />
            <Button onPress={() => setShowEndForm(true)} className="bg-green-600 py-4 rounded-xl mb-6">
              <Text className="text-white font-bold text-center">Finalizar Jornada</Text>
            </Button>
          </>
        )}

        {/* Formulário de Finalização */}
        {showEndForm && activeTrip && (
          <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-200">
            <Text className="text-xl font-bold text-gray-900 mb-4">Finalizar Jornada</Text>
            
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
            <View className="mb-4 bg-purple-50 p-4 rounded-xl">
              <Text className="text-sm font-semibold text-purple-900 mb-2">🟣 99Pop/InDrive</Text>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Input
                    placeholder={crossing.crossed99 ? "Dia anterior" : "Valor"}
                    value={app99_1Input}
                    onChangeText={setApp99_1Input}
                    keyboardType="decimal-pad"
                    className="bg-white"
                  />
                </View>
                {crossing.crossed99 && (
                  <View className="flex-1">
                    <Input
                      placeholder="Novo dia"
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
            <View className="mb-6 bg-gray-100 p-4 rounded-xl">
              <Text className="text-sm font-semibold text-gray-900 mb-2">⚫ UBER</Text>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Input
                    placeholder={crossing.crossedUber ? "Antes das 4h" : "Valor"}
                    value={uber1Input}
                    onChangeText={setUber1Input}
                    keyboardType="decimal-pad"
                    className="bg-white"
                  />
                </View>
                {crossing.crossedUber && (
                  <View className="flex-1">
                    <Input
                      placeholder="Após 4h"
                      value={uber2Input}
                      onChangeText={setUber2Input}
                      keyboardType="decimal-pad"
                      className="bg-white"
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <Button onPress={handleEndTrip} className="flex-1 bg-green-600 py-4 rounded-xl">
                <Text className="text-white font-bold text-center">Finalizar Jornada</Text>
              </Button>
              <Button onPress={() => setShowEndForm(false)} className="bg-gray-300 px-6 py-4 rounded-xl">
                <Text className="text-gray-800 font-bold text-center">Cancelar</Text>
              </Button>
            </View>
          </View>
        )}

        {/* Iniciar Nova Jornada */}
        {!activeTrip && vehicles.length > 0 && (
          <View className="bg-white rounded-2xl p-5 mb-6">
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
            <Text className="text-xl font-bold text-gray-900 mb-4">Histórico de Jornadas</Text>
            <Text className="text-gray-600 mb-4">{allCompletedTrips.length} jornadas finalizadas</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}