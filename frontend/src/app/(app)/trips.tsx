import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Trip {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  startDate: string;
  endDate: string | null;
  startOdometer: string;
  endOdometer: string | null;
  status: 'active' | 'completed';
  earnings: {
    uber: string;
    app99: string;
    total: string;
  } | null;
}

interface AppSettings {
  uber: boolean;
  app99: boolean;
}

export default function Trips() {
  // Mock data for vehicles
  const [vehicles] = useState([
    { id: '1', model: 'Honda Civic', placa: 'ABC-1234' },
    { id: '2', model: 'Toyota Corolla', placa: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', placa: 'DEF-9012' },
  ]);

  // App settings (which apps are active)
  const [appSettings, setAppSettings] = useState<AppSettings>({
    uber: true,
    app99: true,
  });

  // Mock data for trips
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      vehicleId: '1',
      vehicleModel: 'Honda Civic',
      startDate: '2025-09-25T08:00:00',
      endDate: '2025-09-25T18:00:00',
      startOdometer: '50000',
      endOdometer: '50150',
      status: 'completed',
      earnings: {
        uber: '180.50',
        app99: '120.30',
        total: '300.80',
      },
    },
    {
      id: '2',
      vehicleId: '2',
      vehicleModel: 'Toyota Corolla',
      startDate: '2025-09-30T09:00:00',
      endDate: null,
      startOdometer: '75000',
      endOdometer: null,
      status: 'active',
      earnings: null,
    },
  ]);

  // Form states
  const [showStartForm, setShowStartForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [startFormData, setStartFormData] = useState({
    vehicleId: '',
    startOdometer: '',
  });

  const [endFormData, setEndFormData] = useState({
    endOdometer: '',
    uberEarnings: '',
    app99Earnings: '',
  });

  const activeTrip = trips.find((trip) => trip.status === 'active');

  const handleStartTrip = () => {
    if (!startFormData.vehicleId || !startFormData.startOdometer) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const odometerNum = parseInt(startFormData.startOdometer);
    if (isNaN(odometerNum) || odometerNum <= 0) {
      Alert.alert('Erro', 'Odômetro inicial inválido.');
      return;
    }

    // Check if there's already an active trip
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
      startDate: new Date().toISOString(),
      endDate: null,
      startOdometer: startFormData.startOdometer,
      endOdometer: null,
      status: 'active',
      earnings: null,
    };

    setTrips([...trips, newTrip]);
    setStartFormData({ vehicleId: '', startOdometer: '' });
    setShowStartForm(false);
    Alert.alert('Sucesso', 'Jornada iniciada com sucesso!');
  };

  const handleEndTrip = () => {
    if (!selectedTrip || !endFormData.endOdometer) {
      Alert.alert('Erro', 'Odômetro final é obrigatório.');
      return;
    }

    const endOdometerNum = parseInt(endFormData.endOdometer);
    const startOdometerNum = parseInt(selectedTrip.startOdometer);

    if (isNaN(endOdometerNum) || endOdometerNum <= startOdometerNum) {
      Alert.alert('Erro', 'Odômetro final deve ser maior que o inicial.');
      return;
    }

    // Validate earnings if apps are active
    let uberEarnings = 0;
    let app99Earnings = 0;

    if (appSettings.uber) {
      uberEarnings = parseFloat(endFormData.uberEarnings) || 0;
      if (isNaN(uberEarnings) || uberEarnings < 0) {
        Alert.alert('Erro', 'Faturamento do Uber inválido.');
        return;
      }
    }

    if (appSettings.app99) {
      app99Earnings = parseFloat(endFormData.app99Earnings) || 0;
      if (isNaN(app99Earnings) || app99Earnings < 0) {
        Alert.alert('Erro', 'Faturamento do 99 inválido.');
        return;
      }
    }

    const totalEarnings = uberEarnings + app99Earnings;

    const updatedTrip: Trip = {
      ...selectedTrip,
      endDate: new Date().toISOString(),
      endOdometer: endFormData.endOdometer,
      status: 'completed',
      earnings: {
        uber: uberEarnings.toFixed(2),
        app99: app99Earnings.toFixed(2),
        total: totalEarnings.toFixed(2),
      },
    };

    setTrips(trips.map((trip) => (trip.id === selectedTrip.id ? updatedTrip : trip)));
    setEndFormData({ endOdometer: '', uberEarnings: '', app99Earnings: '' });
    setSelectedTrip(null);
    setShowEndForm(false);
    Alert.alert('Sucesso', 'Jornada finalizada com sucesso!');
  };

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta jornada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setTrips(trips.filter((t) => t.id !== tripId));
            Alert.alert('Sucesso', 'Jornada excluída com sucesso!');
          },
        },
      ]
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const calculateDistance = (trip: Trip) => {
    if (!trip.endOdometer) return 0;
    return parseInt(trip.endOdometer) - parseInt(trip.startOdometer);
  };

  const totalEarnings = trips
    .filter((trip) => trip.earnings)
    .reduce((total, trip) => total + parseFloat(trip.earnings!.total), 0);

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Minhas Jornadas
            </Text>
            <Text className="text-gray-600">
              Gerencie suas viagens e faturamento
            </Text>
          </View>
          <Button
            onPress={() => setShowAppSettings(true)}
            variant="outline"
            className="px-3 py-2"
          >
            <Text className="text-gray-600 font-medium">⚙️ Apps</Text>
          </Button>
        </View>

        {/* Active Trip Status */}
        {activeTrip ? (
          <View className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-green-800 font-semibold text-lg mb-2">
              🚗 Jornada Ativa
            </Text>
            <Text className="text-green-700 mb-1">
              Veículo: {activeTrip.vehicleModel}
            </Text>
            <Text className="text-green-700 mb-1">
              Início: {formatDateTime(activeTrip.startDate)}
            </Text>
            <Text className="text-green-700 mb-3">
              Odômetro inicial: {activeTrip.startOdometer} km
            </Text>
            <Button
              onPress={() => {
                setSelectedTrip(activeTrip);
                setShowEndForm(true);
              }}
              className="w-full"
            >
              <Text className="text-white font-medium">Finalizar Jornada</Text>
            </Button>
          </View>
        ) : (
          <View className="mb-6 p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800 font-semibold text-lg mb-2">
              Iniciar Nova Jornada
            </Text>
            <Text className="text-blue-700 mb-3">
              Nenhuma jornada ativa. Inicie uma nova jornada para começar a trabalhar.
            </Text>
            <Button
              onPress={() => setShowStartForm(true)}
              className="w-full"
            >
              <Text className="text-white font-medium">+ Iniciar Jornada</Text>
            </Button>
          </View>
        )}

        {/* Earnings Summary */}
        <View className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <Text className="text-yellow-800 font-semibold text-lg mb-2">
            Faturamento Total
          </Text>
          <Text className="text-yellow-900 text-2xl font-bold">
            R$ {totalEarnings.toFixed(2)}
          </Text>
          <Text className="text-yellow-600 text-sm mt-1">
            {trips.filter((t) => t.earnings).length} jornada(s) completada(s)
          </Text>
        </View>

        {/* Start Trip Form */}
        {showStartForm && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Iniciar Nova Jornada
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Veículo
              </Text>
              <View className="flex-row flex-wrap">
                {vehicles.map((vehicle) => (
                  <Button
                    key={vehicle.id}
                    onPress={() =>
                      setStartFormData({ ...startFormData, vehicleId: vehicle.id })
                    }
                    variant={
                      startFormData.vehicleId === vehicle.id ? 'default' : 'outline'
                    }
                    className="mr-2 mb-2"
                  >
                    <Text
                      className={
                        startFormData.vehicleId === vehicle.id
                          ? 'text-white text-sm'
                          : 'text-gray-600 text-sm'
                      }
                    >
                      {vehicle.model}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Odômetro Inicial (km)
              </Text>
              <Input
                placeholder="Ex: 50000"
                value={startFormData.startOdometer}
                onChangeText={(text) =>
                  setStartFormData({ ...startFormData, startOdometer: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            <View className="flex-row space-x-2">
              <Button onPress={handleStartTrip} className="flex-1 mr-2">
                <Text className="text-white font-medium">Iniciar</Text>
              </Button>
              <Button
                onPress={() => setShowStartForm(false)}
                variant="outline"
                className="flex-1 ml-2"
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </Button>
            </View>
          </View>
        )}

        {/* End Trip Form */}
        {showEndForm && selectedTrip && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Finalizar Jornada - {selectedTrip.vehicleModel}
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Odômetro Final (km)
              </Text>
              <Input
                placeholder={`Maior que ${selectedTrip.startOdometer}`}
                value={endFormData.endOdometer}
                onChangeText={(text) =>
                  setEndFormData({ ...endFormData, endOdometer: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            {appSettings.uber && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Faturamento Uber (R$)
                </Text>
                <Input
                  placeholder="Ex: 180.50"
                  value={endFormData.uberEarnings}
                  onChangeText={(text) =>
                    setEndFormData({ ...endFormData, uberEarnings: text })
                  }
                  keyboardType="numeric"
                  className="w-full"
                />
              </View>
            )}

            {appSettings.app99 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Faturamento 99 (R$)
                </Text>
                <Input
                  placeholder="Ex: 120.30"
                  value={endFormData.app99Earnings}
                  onChangeText={(text) =>
                    setEndFormData({ ...endFormData, app99Earnings: text })
                  }
                  keyboardType="numeric"
                  className="w-full"
                />
              </View>
            )}

            <View className="flex-row space-x-2">
              <Button onPress={handleEndTrip} className="flex-1 mr-2">
                <Text className="text-white font-medium">Finalizar</Text>
              </Button>
              <Button
                onPress={() => {
                  setShowEndForm(false);
                  setSelectedTrip(null);
                }}
                variant="outline"
                className="flex-1 ml-2"
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </Button>
            </View>
          </View>
        )}

        {/* App Settings */}
        {showAppSettings && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Configuração de Aplicativos
            </Text>

            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">Uber</Text>
                <Button
                  onPress={() =>
                    setAppSettings({ ...appSettings, uber: !appSettings.uber })
                  }
                  variant={appSettings.uber ? 'default' : 'outline'}
                  className="px-4 py-1"
                >
                  <Text
                    className={
                      appSettings.uber ? 'text-white text-sm' : 'text-gray-600 text-sm'
                    }
                  >
                    {appSettings.uber ? 'Ativo' : 'Inativo'}
                  </Text>
                </Button>
              </View>

              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-700 font-medium">99</Text>
                <Button
                  onPress={() =>
                    setAppSettings({ ...appSettings, app99: !appSettings.app99 })
                  }
                  variant={appSettings.app99 ? 'default' : 'outline'}
                  className="px-4 py-1"
                >
                  <Text
                    className={
                      appSettings.app99 ? 'text-white text-sm' : 'text-gray-600 text-sm'
                    }
                  >
                    {appSettings.app99 ? 'Ativo' : 'Inativo'}
                  </Text>
                </Button>
              </View>
            </View>

            <Button
              onPress={() => setShowAppSettings(false)}
              className="w-full"
            >
              <Text className="text-white font-medium">Salvar Configurações</Text>
            </Button>
          </View>
        )}

        {/* Trips List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Histórico de Jornadas ({trips.length})
          </Text>

          {trips.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-center">
                Nenhuma jornada registrada.{'\n'}
                Inicie sua primeira jornada para começar!
              </Text>
            </View>
          ) : (
            trips
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((trip) => (
                <View key={trip.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-lg mb-1">
                        {trip.vehicleModel}
                      </Text>
                      <Text className="text-gray-600 mb-1">
                        Início: {formatDateTime(trip.startDate)}
                      </Text>
                      {trip.endDate && (
                        <Text className="text-gray-600 mb-1">
                          Fim: {formatDateTime(trip.endDate)}
                        </Text>
                      )}
                      <Text className="text-gray-600 mb-1">
                        Distância: {calculateDistance(trip)} km
                      </Text>
                      {trip.earnings && (
                        <Text className="text-green-600 font-bold">
                          Faturamento: R$ {trip.earnings.total}
                        </Text>
                      )}
                      <View className="flex-row items-center mt-2">
                        <View
                          className={`px-2 py-1 rounded ${
                            trip.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              trip.status === 'active' ? 'text-green-800' : 'text-gray-800'
                            }`}
                          >
                            {trip.status === 'active' ? 'Ativa' : 'Finalizada'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {trip.status === 'completed' && (
                      <Button
                        onPress={() => handleDeleteTrip(trip.id)}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Text className="text-red-600 text-sm">Excluir</Text>
                      </Button>
                    )}
                  </View>
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
