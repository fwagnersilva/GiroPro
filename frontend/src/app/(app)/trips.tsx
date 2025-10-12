<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
=======
import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { FocusAwareStatusBar, Text, View, Input, Button } from '@/components/ui';
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

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
  const [showEndForm, setShowEndForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

<<<<<<< HEAD
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
  ]);
=======
return (
<View className={`flex-1 bg-gray-900`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="mb-6">
<Text className="text-3xl font-bold text-white">Jornadas</Text>
<Text className="text-slate-300">Inicie, pause e finalize com clareza</Text>
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const activeTrip = trips.find((trip) => trip.status === 'active' || trip.status === 'paused');

<<<<<<< HEAD
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);
=======
{!active ? (
<View className={`bg-gray-800 rounded-lg p-6 border border-slate-700 mb-6`}>
<Text className="text-white font-semibold text-lg mb-3">Iniciar Nova Jornada</Text>
<Input placeholder="Quilometragem inicial" className="bg-slate-900 text-white" />
<Button onPress={() => setActive(true)} label="🚀 Iniciar Jornada" className="bg-green-600 mt-4" />
</View>
) : (
<View className={`bg-gray-800 rounded-lg p-6 border border-slate-700 mb-6`}>
<Text className="text-white font-semibold text-lg">Jornada em Andamento</Text>
<View className="mt-4 grid grid-cols-2 gap-3">
<Button label="⏸ Pausar" className="bg-yellow-600" />
<Button label="✅ Finalizar" className="bg-blue-600" />
</View>
</View>
)}
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const today = new Date().toDateString();
  const todayTrips = trips.filter((trip) => {
    const tripDate = new Date(trip.startDate).toDateString();
    return tripDate === today && trip.status === 'completed';
  });

<<<<<<< HEAD
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

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
      totalKm: endOdometerNum - startOdometerNum,
      totalTime: '5h 30min',
      grossEarnings: totalEarnings,
      netEarnings: totalEarnings * 0.8,
      ratePerHour: 25.50,
      ratePerKm: 1.73,
    };

    setTrips(trips.map((trip) => (trip.id === activeTrip.id ? updatedTrip : trip)));
    setEndOdometerInput('');
    setUberEarningsInput('0,00');
    setApp99EarningsInput('0,00');
    setShowEndForm(false);
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
            setShowEndForm(false);
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
    <View className="flex-1 bg-gradient-to-b from-blue-900 to-blue-950">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4 bg-gradient-to-b from-blue-900 to-transparent">
          <Text className="text-3xl font-bold text-white mb-1">Jornadas</Text>
          <Text className="text-blue-100">Gerencie suas corridas diárias</Text>
        </View>

        {/* Content */}
        <View className="px-4 pb-8">
          {/* Start Trip Form - Show only when no active trip */}
          {!activeTrip && (
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-lg border border-gray-100">
              <View className="flex-row items-center mb-4">
                <View className="bg-green-100 rounded-full w-10 h-10 items-center justify-center mr-3">
                  <Ionicons name="play" size={20} color="#16A34A" />
                </View>
                <Text className="text-lg font-bold text-gray-900">Iniciar Nova Jornada</Text>
              </View>

              {vehicles.length > 1 && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Escolha o Veículo</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={selectedVehicleId}
                      onValueChange={setSelectedVehicleId}
                      style={{ color: '#1F2937' }}
                    >
                      {vehicles.map((vehicle) => (
                        <Picker.Item 
                          key={vehicle.id} 
                          label={`${vehicle.model} (${vehicle.plate})`} 
                          value={vehicle.id} 
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              {vehicles.length === 1 && (
                <View className="mb-4 bg-blue-50 p-3 rounded-lg">
                  <Text className="text-xs font-medium text-blue-600 mb-1">Veículo Selecionado</Text>
                  <Text className="text-lg font-bold text-gray-900">{vehicles[0].model}</Text>
                  <Text className="text-sm text-gray-600">{vehicles[0].plate}</Text>
                </View>
              )}

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Quilometragem Inicial</Text>
                <Input
                  placeholder="Ex: 45230"
                  value={startOdometerInput}
                  onChangeText={setStartOdometerInput}
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </View>

              <Button
                onPress={handleStartTrip}
                className="bg-green-600 py-3 rounded-lg shadow-md"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="play" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Iniciar Jornada</Text>
                </View>
              </Button>
            </View>
          )}

          {/* Active Trip Section */}
          {activeTrip && (
            <View className="mb-6">
              {/* Status Badge */}
              <View className="flex-row items-center mb-4">
                <View className={`w-3 h-3 rounded-full mr-2 ${activeTrip.status === 'paused' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <Text className={`font-bold text-lg ${activeTrip.status === 'paused' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {activeTrip.status === 'paused' ? 'Pausada' : 'Em Andamento'}
                </Text>
              </View>

              {/* Main Trip Card */}
              <View className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
                {/* Header */}
                <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="car" size={24} color="white" />
                    <Text className="text-white text-xl font-bold ml-2">{activeTrip.vehicleModel}</Text>
                  </View>
                  <Text className="text-blue-100">{activeTrip.vehiclePlate}</Text>
                </View>

                {/* Trip Info */}
                <View className="p-5">
                  <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''} mb-4`}>
                    <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                      <Text className="text-xs text-gray-500 font-medium mb-1">KM Inicial</Text>
                      <Text className="text-lg font-bold text-gray-900">{activeTrip.startOdometer}</Text>
                    </View>
                    <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                      <Text className="text-xs text-gray-500 font-medium mb-1">Horário</Text>
                      <Text className="text-lg font-bold text-gray-900">{formatTime(activeTrip.startDate)}</Text>
                    </View>
                  </View>

                  <View className="border-t border-gray-100 pt-4">
                    <Text className="text-xs text-gray-500 font-medium mb-1">Iniciado em</Text>
                    <Text className="text-sm text-gray-700">{formatDateTime(activeTrip.startDate)} às {formatTime(activeTrip.startDate)}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              {activeTrip.status === 'active' && !showEndForm && (
                <View className="space-y-3">
                  <View className="mb-3">
                    <Text className="text-sm font-semibold text-white mb-2">KM Atual (para pausar)</Text>
                    <Input
                      placeholder="Ex: 45280"
                      value={pauseKmInput}
                      onChangeText={setPauseKmInput}
                      keyboardType="numeric"
                      className="bg-white border border-gray-200 rounded-lg text-gray-900"
                    />
                  </View>
                  <Button
                    onPress={handlePauseTrip}
                    className="bg-yellow-500 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Pausar Jornada</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(true)}
                    className="bg-blue-600 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Finalizar Jornada</Text>
                  </Button>
                  <Button
                    onPress={handleCancelTrip}
                    className="bg-red-600 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Cancelar Jornada</Text>
                  </Button>
                </View>
              )}

              {activeTrip.status === 'paused' && !showEndForm && (
                <View className="space-y-3">
                  <View className="mb-3">
                    <Text className="text-sm font-semibold text-white mb-2">KM Atual (para retomar)</Text>
                    <Input
                      placeholder="Ex: 45280"
                      value={resumeKmInput}
                      onChangeText={setResumeKmInput}
                      keyboardType="numeric"
                      className="bg-white border border-gray-200 rounded-lg text-gray-900"
                    />
                  </View>
                  <Button
                    onPress={handleResumeTrip}
                    className="bg-green-600 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Retomar Jornada</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(true)}
                    className="bg-blue-600 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Finalizar Jornada</Text>
                  </Button>
                  <Button
                    onPress={handleCancelTrip}
                    className="bg-red-600 py-3 rounded-lg"
                  >
                    <Text className="text-white font-bold text-center">Cancelar Jornada</Text>
                  </Button>
                </View>
              )}

              {showEndForm && (
                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                  <Text className="text-lg font-bold text-gray-900 mb-4">Finalizar Jornada</Text>
                  
                  <View className="mb-3">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">KM Final</Text>
                    <Input
                      placeholder="Ex: 45280"
                      value={endOdometerInput}
                      onChangeText={setEndOdometerInput}
                      keyboardType="numeric"
                      className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Faturamento (R$)</Text>
                    <View className="flex-row gap-2">
                      <Input
                        placeholder="UBER"
                        value={uberEarningsInput}
                        onChangeText={setUberEarningsInput}
                        keyboardType="numeric"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                      />
                      <Input
                        placeholder="99"
                        value={app99EarningsInput}
                        onChangeText={setApp99EarningsInput}
                        keyboardType="numeric"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                      />
                    </View>
                  </View>

                  <Button
                    onPress={handleEndTrip}
                    className="bg-green-600 py-3 rounded-lg mb-2"
                  >
                    <Text className="text-white font-bold text-center">Confirmar Finalização</Text>
                  </Button>
                  <Button
                    onPress={() => setShowEndForm(false)}
                    className="bg-gray-300 py-3 rounded-lg"
                  >
                    <Text className="text-gray-900 font-bold text-center">Voltar</Text>
                  </Button>
                </View>
              )}
            </View>
          )}

          {/* Today's Trips */}
          <View>
            <View className="flex-row items-center mb-4">
              <View className="bg-white bg-opacity-20 rounded-full w-8 h-8 items-center justify-center mr-2">
                <Ionicons name="calendar" size={18} color="white" />
              </View>
              <Text className="text-2xl font-bold text-white">Jornadas de Hoje</Text>
            </View>

            {todayTrips.length === 0 ? (
              <View className="bg-white bg-opacity-10 rounded-2xl p-6 items-center border border-white border-opacity-20">
                <Ionicons name="document-outline" size={40} color="rgba(255, 255, 255, 0.5)" />
                <Text className="text-white text-center mt-3 font-medium">Nenhuma jornada finalizada hoje</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {todayTrips.map((trip) => (
                  <View key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    {/* Header */}
                    <View className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3">
                      <Text className="font-bold text-gray-900 text-lg">{trip.vehicleModel}</Text>
                      <Text className="text-gray-600 text-sm">{trip.vehiclePlate}</Text>
                    </View>

                    {/* Info */}
                    <View className="p-4">
                      <View className={`flex-row gap-2 ${isSmallScreen ? 'flex-wrap' : ''} mb-3`}>
                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-2`}>
                          <Text className="text-xs text-gray-500 mb-1">KM Rodados</Text>
                          <Text className="text-lg font-bold text-gray-900">{trip.totalKm} km</Text>
                        </View>
                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-2`}>
                          <Text className="text-xs text-gray-500 mb-1">Tempo</Text>
                          <Text className="text-lg font-bold text-gray-900">{trip.totalTime}</Text>
                        </View>
                      </View>

                      <View className="bg-green-50 rounded-lg p-2">
                        <Text className="text-xs text-green-600 font-medium mb-1">Faturamento</Text>
                        <Text className="text-xl font-bold text-green-600">
                          {trip.earnings ? formatCurrency(trip.earnings.total) : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
=======
<View>
<Text className="text-2xl font-bold text-white mb-4">Jornadas Recentes</Text>
<View className={`bg-gray-800 rounded-lg p-4 border border-slate-700`}>
<Text className="text-white font-semibold">Renault Logan · 78 km</Text>
<Text className="text-slate-300 text-sm mt-1">4h 55min · R$ 134,66</Text>
</View>
</View>
</ScrollView>
</View>
);
}

>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e
