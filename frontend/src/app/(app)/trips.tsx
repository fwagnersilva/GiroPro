
import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Trip {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  vehiclePlate: string;
  startDate: string;
  endDate: string | null;
  startOdometer: number;
  endOdometer: number | null;
  status: 'active' | 'paused' | 'completed';
  pausedOdometer: number | null;
  pauseTimestamps: { pause: string; resume: string | null; pauseKm: number; resumeKm: number | null }[];
  earnings: { uber: number; app99: number; total: number } | null;
  totalKm: number | null;
  totalTime: string | null;
  grossEarnings: number | null;
  netEarnings: number | null;
  ratePerHour: number | null;
  ratePerKm: number | null;
}

interface Vehicle {
  id: string;
  model: string;
  plate: string;
}

export default function Trips() {
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Renault Logan', plate: 'QXF5C67' },
    { id: '2', model: 'Toyota Corolla', plate: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', plate: 'DEF-9012' },
  ]);

  const [startOdometerInput, setStartOdometerInput] = useState('');
  const [pauseKmInput, setPauseKmInput] = useState('');
  const [resumeKmInput, setResumeKmInput] = useState('');
  const [endOdometerInput, setEndOdometerInput] = useState('');
  const [uberEarningsInput, setUberEarningsInput] = useState('0,00');
  const [app99EarningsInput, setApp99EarningsInput] = useState('0,00');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles.length > 0 ? vehicles[0].id : '');

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      vehiclePlate: 'QXF5C67',
      startDate: '2025-10-05T13:32:00',
      endDate: '2025-10-05T18:28:00',
      startOdometer: 229128,
      endOdometer: 229206,
      status: 'completed',
      pausedOdometer: null,
      pauseTimestamps: [],
      earnings: {
        uber: 92.69,
        app99: 41.97,
        total: 134.66,
      },
      totalKm: 78,
      totalTime: '4h 55min',
      grossEarnings: 134.66,
      netEarnings: 92.00,
      ratePerHour: 27.39,
      ratePerKm: 1.73,
    },
    {
      id: '2',
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      vehiclePlate: 'QXF5C67',
      startDate: '2025-10-05T11:19:00',
      endDate: '2025-10-05T17:37:00',
      startOdometer: 228995,
      endOdometer: 229117,
      status: 'completed',
      pausedOdometer: null,
      pauseTimestamps: [],
      earnings: {
        uber: 0,
        app99: 210.71,
        total: 210.71,
      },
      totalKm: 122,
      totalTime: '6h 18min',
      grossEarnings: 210.71,
      netEarnings: 143.83,
      ratePerHour: 33.45,
      ratePerKm: 1.73,
    },
  ]);

  const [showEndForm, setShowEndForm] = useState(false); // Novo estado para controlar a exibição do formulário de finalização

  const activeTrip = trips.find((trip) => trip.status === 'active' || trip.status === 'paused');
  
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  // Filtrar apenas jornadas do dia atual
  const today = new Date().toDateString();
  const todayTrips = trips.filter((trip) => {
    const tripDate = new Date(trip.startDate).toDateString();
    return tripDate === today && trip.status === 'completed';
  });

  const handleStartTrip = () => {
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
      Alert.alert('Erro', 'Já existe uma jornada ativa. Finalize-a antes de iniciar uma nova.');
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      vehicleId: selectedVehicleId,
      vehicleModel: selectedVehicle.model,
      vehiclePlate: selectedVehicle.plate,
      startDate: new Date().toISOString(),
      endDate: null,
      startOdometer: odometerNum,
      endOdometer: null,
      status: 'active',
      pausedOdometer: null,
      pauseTimestamps: [],
      earnings: null,
      totalKm: null,
      totalTime: null,
      grossEarnings: null,
      netEarnings: null,
      ratePerHour: null,
      ratePerKm: null,
    };

    setTrips([...trips, newTrip]);
    setStartOdometerInput('');
    Alert.alert('Sucesso', 'Jornada iniciada com sucesso!');
  };

  const handlePauseTrip = () => {
    if (!activeTrip || activeTrip.status !== 'active') {
      Alert.alert('Erro', 'Nenhuma jornada ativa para pausar.');
      return;
    }

    if (!pauseKmInput) {
      Alert.alert('Erro', 'Informe a quilometragem atual para pausar.');
      return;
    }

    const pauseKm = parseInt(pauseKmInput);
    if (isNaN(pauseKm) || pauseKm < activeTrip.startOdometer) {
      Alert.alert('Erro', 'Quilometragem inválida ou menor que a inicial.');
      return;
    }

    const updatedTrip: Trip = {
      ...activeTrip,
      status: 'paused',
      pausedOdometer: pauseKm,
      pauseTimestamps: [...activeTrip.pauseTimestamps, { 
        pause: new Date().toISOString(), 
        resume: null,
        pauseKm: pauseKm,
        resumeKm: null
      }],
    };

    setTrips(trips.map((trip) => (trip.id === activeTrip.id ? updatedTrip : trip)));
    setPauseKmInput('');
    Alert.alert('Sucesso', 'Jornada pausada com sucesso!');
  };

  const handleResumeTrip = () => {
    if (!activeTrip || activeTrip.status !== 'paused') {
      Alert.alert('Erro', 'Nenhuma jornada pausada para retomar.');
      return;
    }

    if (!resumeKmInput) {
      Alert.alert('Erro', 'Informe a quilometragem atual para retomar.');
      return;
    }

    const resumeKm = parseInt(resumeKmInput);
    const lastPause = activeTrip.pauseTimestamps[activeTrip.pauseTimestamps.length - 1];
    
    if (isNaN(resumeKm) || resumeKm < lastPause.pauseKm) {
      Alert.alert('Erro', 'Quilometragem deve ser maior ou igual à quilometragem de pausa.');
      return;
    }

    const updatedPauseTimestamps = [...activeTrip.pauseTimestamps];
    updatedPauseTimestamps[updatedPauseTimestamps.length - 1] = { 
      ...lastPause, 
      resume: new Date().toISOString(),
      resumeKm: resumeKm
    };

    const updatedTrip: Trip = {
      ...activeTrip,
      status: 'active',
      pauseTimestamps: updatedPauseTimestamps,
    };

    setTrips(trips.map((trip) => (trip.id === activeTrip.id ? updatedTrip : trip)));
    setResumeKmInput('');
    Alert.alert('Sucesso', 'Jornada retomada com sucesso!');
  };

  const handleEndTrip = () => {
    if (!activeTrip) {
      Alert.alert('Erro', 'Nenhuma jornada ativa para finalizar.');
      return;
    }

    if (!endOdometerInput) {
      Alert.alert('Erro', 'Quilometragem final é obrigatória.');
      return;
    }

    const endOdometerNum = parseInt(endOdometerInput);
    const startOdometerNum = activeTrip.startOdometer;

    if (isNaN(endOdometerNum) || endOdometerNum <= startOdometerNum) {
      Alert.alert('Erro', 'Quilometragem final deve ser maior que a inicial.');
      return;
    }

    const uberEarnings = parseFloat(uberEarningsInput.replace(',', '.')) || 0;
    const app99Earnings = parseFloat(app99EarningsInput.replace(',', '.')) || 0;
    const totalEarnings = uberEarnings + app99Earnings;
    
    // Calcular KM real rodado (subtraindo os KMs pausados)
    let totalKm = endOdometerNum - startOdometerNum;
    let pausedKm = 0;
    
    activeTrip.pauseTimestamps.forEach(pauseEntry => {
      if (pauseEntry.pauseKm && pauseEntry.resumeKm) {
        pausedKm += pauseEntry.resumeKm - pauseEntry.pauseKm;
      }
    });
    
    totalKm = totalKm - pausedKm;

    // Calcular tempo total pausado
    let totalPausedTimeMs = 0;
    activeTrip.pauseTimestamps.forEach(pauseEntry => {
      if (pauseEntry.pause && pauseEntry.resume) {
        totalPausedTimeMs += new Date(pauseEntry.resume).getTime() - new Date(pauseEntry.pause).getTime();
      }
    });

    // Calcular tempo ativo
    const startTime = new Date(activeTrip.startDate);
    const endTime = new Date();
    const totalTripTimeMs = endTime.getTime() - startTime.getTime();
    const activeTimeMs = totalTripTimeMs - totalPausedTimeMs;

    const hours = Math.floor(activeTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((activeTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalTimeStr = `${hours}h ${minutes}min`;

    const ratePerHour = hours > 0 ? totalEarnings / (hours + minutes / 60) : 0;
    const ratePerKm = totalKm > 0 ? totalEarnings / totalKm : 0;

    const updatedTrip: Trip = {
      ...activeTrip,
      endDate: new Date().toISOString(),
      endOdometer: endOdometerNum,
      status: 'completed',
      earnings: {
        uber: uberEarnings,
        app99: app99Earnings,
        total: totalEarnings,
      },
      totalKm,
      totalTime: totalTimeStr,
      grossEarnings: totalEarnings,
      netEarnings: totalEarnings * 0.8,
      ratePerHour,
      ratePerKm,
    };

    setTrips(trips.map((trip) => (trip.id === activeTrip.id ? updatedTrip : trip)));
    setEndOdometerInput('');
    setUberEarningsInput('0,00');
    setApp99EarningsInput('0,00');
    setShowEndForm(false); // Esconde o formulário de finalização após finalizar
    Alert.alert('Sucesso', 'Jornada finalizada com sucesso!');
  };

  const handleCancelTrip = () => {
    if (!activeTrip) return;
    
    Alert.alert(
      'Cancelar Jornada',
      'Tem certeza que deseja cancelar esta jornada?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            setTrips(trips.filter(t => t.id !== activeTrip.id));
            setEndOdometerInput('');
            setUberEarningsInput('0,00');
            setApp99EarningsInput('0,00');
            setPauseKmInput('');
            setResumeKmInput('');
            setShowEndForm(false); // Esconde o formulário de finalização
            Alert.alert('Sucesso', 'Jornada cancelada com sucesso!');
          }
        }
      ]
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View className="flex-1 bg-slate-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Jornadas
          </Text>
          <Text className="text-slate-400">Gerencie suas corridas diárias</Text>
        </View>

        {/* Se não houver jornada ativa, mostra o formulário para iniciar */}
        {!activeTrip && (
          <View className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
            <Text className="text-white font-semibold text-lg mb-4">Iniciar Nova Jornada</Text>
            
            {vehicles.length > 1 && (
              <View className="mb-4">
                <Text className="text-slate-300 text-sm mb-2 font-medium">Escolha o Veículo</Text>
                <View className="bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
                  <Picker
                    selectedValue={selectedVehicleId}
                    onValueChange={(itemValue) => setSelectedVehicleId(itemValue)}
                    style={{ color: 'white' }}
                    dropdownIconColor="white"
                  >
                    {vehicles.map((vehicle) => (
                      <Picker.Item key={vehicle.id} label={`${vehicle.model} (${vehicle.plate})`} value={vehicle.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {vehicles.length === 1 && (
              <View className="mb-4">
                <Text className="text-slate-300 text-sm mb-2 font-medium">Veículo Selecionado</Text>
                <Text className="text-white text-lg font-bold">{vehicles[0].model} ({vehicles[0].plate})</Text>
              </View>
            )}

            <View className="mb-6">
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Quilometragem Inicial *
              </Text>
              <Input
                placeholder="Digite a quilometragem inicial"
                value={startOdometerInput}
                onChangeText={setStartOdometerInput}
                keyboardType="numeric"
                className="w-full bg-slate-900 border-slate-600 text-white"
              />
            </View>

            <Button onPress={handleStartTrip} className="bg-green-600">
              <Text className="text-white font-medium text-center">🚀 Iniciar Jornada</Text>
            </Button>
          </View>
        )}

        {/* Active Trip Section */}
        {activeTrip && (
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className={`w-3 h-3 rounded-full mr-2 ${activeTrip.status === 'paused' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <Text className={`font-medium ${activeTrip.status === 'paused' ? 'text-yellow-400' : 'text-green-400'}`}>
                {activeTrip.status === 'paused' ? 'Jornada Pausada' : 'Jornada em Andamento'}
              </Text>
            </View>
            
            <View className="mb-2">
              <Text className="text-slate-400 text-sm">
                Início: {formatDateTime(activeTrip.startDate)} às {formatTime(activeTrip.startDate)}
              </Text>
            </View>

            <View className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <View className="mb-4">
                <Text className="text-white font-semibold text-lg">
                  🚗 {activeTrip.vehicleModel}
                </Text>
                <Text className="text-slate-400 text-sm">{activeTrip.vehiclePlate}</Text>
              </View>

              <View className="flex-row mb-6 p-4 bg-slate-900 rounded-lg">
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">KM Início</Text>
                  <Text className="text-white font-bold text-xl">{activeTrip.startOdometer}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-sm">Horário Início</Text>
                  <Text className="text-white font-bold text-xl">{formatTime(activeTrip.startDate)}</Text>
                </View>
              </View>

              {/* Botões de Ação e Campos Condicionais */}
              {activeTrip.status === 'active' && !showEndForm && (
                <View className="space-y-3">
                  <View className="mb-4">
                    <Text className="text-slate-300 text-sm mb-2 font-medium">
                      KM Atual (para pausar)
                    </Text>
                    <Input
                      placeholder="Digite o KM atual"
                      value={pauseKmInput}
                      onChangeText={setPauseKmInput}
                      keyboardType="numeric"
                      className="w-full bg-slate-900 border-slate-600 text-white"
                    />
                  </View>
                  <Button
                    onPress={handlePauseTrip}
                    className="bg-yellow-600"
                  >
                    <Text className="text-white font-medium text-center">⏸ Pausar Jornada</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(true)} // Mostra o formulário de finalização
                    className="bg-red-600"
                  >
                    <Text className="text-white font-medium text-center">✅ Finalizar Jornada</Text>
                  </Button>
                  <Button
                    onPress={handleCancelTrip}
                    className="bg-slate-700"
                  >
                    <Text className="text-white font-medium text-center">❌ Cancelar Jornada</Text>
                  </Button>
                </View>
              )}

              {activeTrip.status === 'paused' && !showEndForm && (
                <View className="space-y-3">
                  <View className="mb-4">
                    <Text className="text-slate-300 text-sm mb-2 font-medium">
                      KM Atual (para retomar)
                    </Text>
                    <Input
                      placeholder="Digite o KM atual"
                      value={resumeKmInput}
                      onChangeText={setResumeKmInput}
                      keyboardType="numeric"
                      className="w-full bg-slate-900 border-slate-600 text-white"
                    />
                    <Text className="text-slate-400 text-xs mt-1">
                      KM na pausa: {activeTrip.pausedOdometer}
                    </Text>
                  </View>
                  <Button
                    onPress={handleResumeTrip}
                    className="bg-blue-600"
                  >
                    <Text className="text-white font-medium text-center">▶ Retomar Jornada</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(true)} // Mostra o formulário de finalização
                    className="bg-red-600"
                  >
                    <Text className="text-white font-medium text-center">✅ Finalizar Jornada</Text>
                  </Button>
                  <Button
                    onPress={handleCancelTrip}
                    className="bg-slate-700"
                  >
                    <Text className="text-white font-medium text-center">❌ Cancelar Jornada</Text>
                  </Button>
                </View>
              )}

              {/* End Form Fields - Visível apenas quando showEndForm é true */}
              {showEndForm && (
                <View className="space-y-3">
                  <View className="mb-4 mt-6">
                    <Text className="text-slate-300 text-sm mb-2 font-medium">
                      KM Final *
                    </Text>
                    <Input
                      placeholder="Quilometragem final"
                      value={endOdometerInput}
                      onChangeText={setEndOdometerInput}
                      keyboardType="numeric"
                      className="w-full bg-slate-900 border-slate-600 text-white"
                    />
                  </View>

                  <View className="mb-6">
                    <Text className="text-slate-300 text-sm mb-2 font-medium">
                      Faturamento por Plataforma (R$)
                    </Text>
                    <View className="flex-row space-x-4">
                      <View className="flex-1">
                        <Text className="text-slate-400 text-xs mb-1">UBER</Text>
                        <Input
                          placeholder="0,00"
                          value={uberEarningsInput}
                          onChangeText={setUberEarningsInput}
                          keyboardType="numeric"
                          className="bg-slate-900 border-slate-600 text-white text-center"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-400 text-xs mb-1">99</Text>
                        <Input
                          placeholder="0,00"
                          value={app99EarningsInput}
                          onChangeText={setApp99EarningsInput}
                          keyboardType="numeric"
                          className="bg-slate-900 border-slate-600 text-white text-center"
                        />
                      </View>
                    </View>
                  </View>

                  <Button
                    onPress={handleEndTrip}
                    className="bg-red-600"
                  >
                    <Text className="text-white font-medium text-center">✅ Confirmar Finalização</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(false)} // Volta para os botões de pausa/retomada
                    className="bg-slate-700"
                  >
                    <Text className="text-white font-medium text-center">Voltar</Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Completed Trips Section */}
        <View>
          <Text className="text-2xl font-bold text-white mb-4">Jornadas de Hoje</Text>
          {todayTrips.length === 0 ? (
            <Text className="text-slate-400">Nenhuma jornada finalizada hoje.</Text>
          ) : (
            todayTrips.map((trip) => (
              <View key={trip.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-3">
                <Text className="text-white font-semibold text-lg">🚗 {trip.vehicleModel} ({trip.vehiclePlate})</Text>
                <Text className="text-slate-300 text-sm">Início: {formatTime(trip.startDate)} - Fim: {formatTime(trip.endDate || '')}</Text>
                <Text className="text-slate-300 text-sm">KM Rodados: {trip.totalKm}</Text>
                <Text className="text-slate-300 text-sm">Tempo Ativo: {trip.totalTime}</Text>
                <Text className="text-green-400 font-bold mt-2">Total Faturado: {formatCurrency(trip.earnings?.total || 0)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

