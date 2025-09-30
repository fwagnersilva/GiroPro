import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

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
  status: 'active' | 'completed';
  earnings: {
    uber: number;
    app99: number;
    total: number;
  } | null;
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
  // Mock data for vehicles
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Renault Logan', plate: 'QXF5C67' },
    { id: '2', model: 'Toyota Corolla', plate: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', plate: 'DEF-9012' },
  ]);

  // Mock data for trips
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      vehiclePlate: 'QXF5C67',
      startDate: '2025-09-29T13:32:00',
      endDate: '2025-09-29T00:28:00',
      startOdometer: 229128,
      endOdometer: 229206,
      status: 'completed',
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
      startDate: '2025-09-29T11:19:00',
      endDate: '2025-09-29T17:37:00',
      startOdometer: 228995,
      endOdometer: 229117,
      status: 'completed',
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
    {
      id: '3',
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      vehiclePlate: 'QXF5C67',
      startDate: '2025-09-30T17:16:00',
      endDate: null,
      startOdometer: 125,
      endOdometer: null,
      status: 'active',
      earnings: null,
      totalKm: null,
      totalTime: null,
      grossEarnings: null,
      netEarnings: null,
      ratePerHour: null,
      ratePerKm: null,
    },
  ]);

  // Form states
  const [showStartForm, setShowStartForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [startFormData, setStartFormData] = useState({
    vehicleId: '1',
    startOdometer: '',
  });

  const [endFormData, setEndFormData] = useState({
    endOdometer: '',
    uberEarnings: '0,00',
    app99Earnings: '0,00',
  });

  const activeTrip = trips.find((trip) => trip.status === 'active');
  const completedTrips = trips.filter((trip) => trip.status === 'completed');

  const handleStartTrip = () => {
    if (!startFormData.vehicleId || !startFormData.startOdometer) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const odometerNum = parseInt(startFormData.startOdometer);
    if (isNaN(odometerNum) || odometerNum <= 0) {
      Alert.alert('Erro', 'Quilometragem inicial inválida.');
      return;
    }

    if (activeTrip) {
      Alert.alert('Erro', 'Já existe uma jornada ativa. Finalize-a antes de iniciar uma nova.');
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === startFormData.vehicleId);
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      vehicleId: startFormData.vehicleId,
      vehicleModel: selectedVehicle.model,
      vehiclePlate: selectedVehicle.plate,
      startDate: new Date().toISOString(),
      endDate: null,
      startOdometer: odometerNum,
      endOdometer: null,
      status: 'active',
      earnings: null,
      totalKm: null,
      totalTime: null,
      grossEarnings: null,
      netEarnings: null,
      ratePerHour: null,
      ratePerKm: null,
    };

    setTrips([...trips, newTrip]);
    setStartFormData({ vehicleId: '1', startOdometer: '' });
    setShowStartForm(false);
    Alert.alert('Sucesso', 'Jornada iniciada com sucesso!');
  };

  const handleEndTrip = () => {
    if (!selectedTrip || !endFormData.endOdometer) {
      Alert.alert('Erro', 'Quilometragem final é obrigatória.');
      return;
    }

    const endOdometerNum = parseInt(endFormData.endOdometer);
    const startOdometerNum = selectedTrip.startOdometer;

    if (isNaN(endOdometerNum) || endOdometerNum <= startOdometerNum) {
      Alert.alert('Erro', 'Quilometragem final deve ser maior que a inicial.');
      return;
    }

    const uberEarnings = parseFloat(endFormData.uberEarnings.replace(',', '.')) || 0;
    const app99Earnings = parseFloat(endFormData.app99Earnings.replace(',', '.')) || 0;
    const totalEarnings = uberEarnings + app99Earnings;
    const totalKm = endOdometerNum - startOdometerNum;

    // Calculate time difference
    const startTime = new Date(selectedTrip.startDate);
    const endTime = new Date();
    const timeDiffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalTimeStr = `${hours}h ${minutes}min`;

    const ratePerHour = hours > 0 ? totalEarnings / (hours + minutes / 60) : 0;
    const ratePerKm = totalKm > 0 ? totalEarnings / totalKm : 0;

    const updatedTrip: Trip = {
      ...selectedTrip,
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
      netEarnings: totalEarnings * 0.8, // Assuming 20% costs
      ratePerHour,
      ratePerKm,
    };

    setTrips(trips.map((trip) => (trip.id === selectedTrip.id ? updatedTrip : trip)));
    setEndFormData({ endOdometer: '', uberEarnings: '0,00', app99Earnings: '0,00' });
    setSelectedTrip(null);
    setShowEndForm(false);
    Alert.alert('Sucesso', 'Jornada finalizada com sucesso!');
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
    <View className="flex-1 bg-gray-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-2">
            Jornadas
          </Text>
        </View>

        {/* Active Trip Section */}
        {activeTrip && (
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              <Text className="text-red-400 font-medium">Jornada em Andamento</Text>
              <Text className="text-gray-400 ml-auto text-sm">
                Início: {formatDateTime(activeTrip.startDate)} {formatTime(activeTrip.startDate)}
              </Text>
            </View>

            <View className="bg-gray-800 rounded-lg p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-white font-medium">
                    Veículo: {activeTrip.vehicleModel} ({activeTrip.vehiclePlate})
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mb-4">
                <View className="w-4 h-4 bg-gray-600 rounded-full mr-2" />
                <Text className="text-gray-300 text-sm">
                  KM Início: {activeTrip.startOdometer}
                </Text>
                <View className="w-4 h-4 bg-gray-600 rounded-full ml-auto mr-2" />
                <Text className="text-gray-300 text-sm">
                  Início: {formatTime(activeTrip.startDate)}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-400 text-sm mb-2">KM Final *</Text>
                <Input
                  placeholder="Quilometragem no painel"
                  value={endFormData.endOdometer}
                  onChangeText={(text) =>
                    setEndFormData({ ...endFormData, endOdometer: text })
                  }
                  keyboardType="numeric"
                  className="w-full bg-gray-700 border-gray-600 text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-400 text-sm mb-2">Faturamento por Plataforma (R$)</Text>
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-gray-300 text-sm mb-1">UBER</Text>
                    <Input
                      placeholder="0,00"
                      value={endFormData.uberEarnings}
                      onChangeText={(text) =>
                        setEndFormData({ ...endFormData, uberEarnings: text })
                      }
                      keyboardType="numeric"
                      className="bg-gray-700 border-gray-600 text-white text-center"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-300 text-sm mb-1">99</Text>
                    <Input
                      placeholder="0,00"
                      value={endFormData.app99Earnings}
                      onChangeText={(text) =>
                        setEndFormData({ ...endFormData, app99Earnings: text })
                      }
                      keyboardType="numeric"
                      className="bg-gray-700 border-gray-600 text-white text-center"
                    />
                  </View>
                </View>
              </View>

              <View className="flex-row space-x-2">
                <Button
                  onPress={() => {
                    setSelectedTrip(activeTrip);
                    handleEndTrip();
                  }}
                  className="flex-1 bg-green-600"
                >
                  <Text className="text-white font-medium">✓ Finalizar Jornada</Text>
                </Button>
                <Button
                  onPress={() => {
                    // Cancel trip logic
                    Alert.alert('Cancelar Jornada', 'Tem certeza que deseja cancelar esta jornada?', [
                      { text: 'Não', style: 'cancel' },
                      { text: 'Sim', style: 'destructive', onPress: () => {
                        setTrips(trips.filter(t => t.id !== activeTrip.id));
                      }}
                    ]);
                  }}
                  className="bg-red-600 px-4"
                >
                  <Text className="text-white font-medium">✕ Cancelar</Text>
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Start New Trip Button */}
        {!activeTrip && (
          <View className="mb-6">
            <Button
              onPress={() => setShowStartForm(true)}
              className="bg-blue-600 p-4 rounded-lg"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-medium mr-2">🚗 Iniciar Nova Jornada</Text>
              </View>
            </Button>
          </View>
        )}

        {/* Start Trip Form */}
        {showStartForm && (
          <View className="mb-6 bg-gray-800 rounded-lg p-4">
            <Text className="text-white font-semibold text-lg mb-4">
              🚗 Iniciar Nova Jornada
            </Text>

            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Veículo *</Text>
              <View className="bg-gray-700 rounded-lg p-3">
                <Text className="text-white">
                  {vehicles.find(v => v.id === startFormData.vehicleId)?.model} ({vehicles.find(v => v.id === startFormData.vehicleId)?.plate})
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">KM Inicial *</Text>
              <Input
                placeholder="Quilometragem no painel"
                value={startFormData.startOdometer}
                onChangeText={(text) =>
                  setStartFormData({ ...startFormData, startOdometer: text })
                }
                keyboardType="numeric"
                className="w-full bg-gray-700 border-gray-600 text-white"
              />
            </View>

            <Button
              onPress={handleStartTrip}
              className="w-full bg-blue-600 mb-2"
            >
              <Text className="text-white font-medium">▶ Iniciar Jornada</Text>
            </Button>

            <Button
              onPress={() => setShowStartForm(false)}
              variant="outline"
              className="w-full border-gray-600"
            >
              <Text className="text-gray-400 font-medium">Cancelar</Text>
            </Button>
          </View>
        )}

        {/* History Section */}
        <View>
          <Text className="text-white font-semibold text-lg mb-4">
            Histórico
          </Text>

          {completedTrips.length === 0 ? (
            <View className="bg-gray-800 rounded-lg p-6">
              <Text className="text-gray-400 text-center">
                Nenhuma jornada finalizada ainda.
              </Text>
            </View>
          ) : (
            completedTrips
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((trip) => (
                <View key={trip.id} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-400 text-sm">
                      {formatDateTime(trip.startDate)}
                    </Text>
                    <Button
                      onPress={() => {
                        Alert.alert('Excluir Jornada', 'Tem certeza que deseja excluir esta jornada?', [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Excluir', style: 'destructive', onPress: () => {
                            setTrips(trips.filter(t => t.id !== trip.id));
                          }}
                        ]);
                      }}
                      variant="outline"
                      className="border-gray-600 px-2 py-1"
                    >
                      <Text className="text-gray-400 text-xs">🗑</Text>
                    </Button>
                  </View>

                  <View className="bg-gray-800 rounded-lg p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View>
                        <Text className="text-white font-medium">
                          Veículo: {trip.vehicleModel} ({trip.vehiclePlate})
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mb-4">
                      <View className="w-4 h-4 bg-gray-600 rounded-full mr-2" />
                      <Text className="text-gray-300 text-sm">
                        {formatTime(trip.startDate)} - {trip.endDate ? formatTime(trip.endDate) : ''}
                      </Text>
                      <View className="w-4 h-4 bg-gray-600 rounded-full ml-auto mr-2" />
                      <Text className="text-gray-300 text-sm">
                        {trip.startOdometer} - {trip.endOdometer}
                      </Text>
                    </View>

                    {/* Earnings Summary */}
                    <View className="flex-row justify-between mb-4">
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">💰 Bruto</Text>
                        <Text className="text-white font-bold">
                          {formatCurrency(trip.earnings?.total || 0)}
                        </Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">💵 Líquido</Text>
                        <Text className="text-green-400 font-bold">
                          {formatCurrency(trip.netEarnings || 0)}
                        </Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">📍 KM</Text>
                        <Text className="text-white font-bold">
                          {trip.totalKm || 0} km
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between mb-4">
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">⏱ Tempo</Text>
                        <Text className="text-white font-bold">
                          {trip.totalTime || '0h 0min'}
                        </Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">📈 R$/Hora</Text>
                        <Text className="text-white font-bold">
                          {formatCurrency(trip.ratePerHour || 0)}
                        </Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">🚗 R$/KM</Text>
                        <Text className="text-white font-bold">
                          {formatCurrency(trip.ratePerKm || 0)}
                        </Text>
                      </View>
                    </View>

                    {/* Platform Breakdown */}
                    <View>
                      <Text className="text-gray-400 text-xs mb-2">Detalhado por Plataforma:</Text>
                      <View className="flex-row space-x-2">
                        <View className="flex-1 bg-gray-700 rounded p-2">
                          <Text className="text-gray-300 text-xs text-center">99</Text>
                          <Text className="text-white font-bold text-center">
                            {formatCurrency(trip.earnings?.app99 || 0)}
                          </Text>
                        </View>
                        <View className="flex-1 bg-gray-700 rounded p-2">
                          <Text className="text-gray-300 text-xs text-center">UBER</Text>
                          <Text className="text-white font-bold text-center">
                            {formatCurrency(trip.earnings?.uber || 0)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
