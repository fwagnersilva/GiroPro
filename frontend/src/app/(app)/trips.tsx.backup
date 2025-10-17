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
  vehicleId: string;
  vehicleModel?: string;
  vehiclePlate?: string;
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

const TripHistoryCard: React.FC<{ trip: Trip; onDelete: (trip: Trip) => void }> = ({ trip, onDelete }) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const liquidoValue = trip.netEarnings || 0;
  const isPositive = liquidoValue > 0;

  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-4">
      <View className="px-4 pt-3 pb-2 border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-sm text-gray-600">{formatDate(trip.startDate)}</Text>
        <Button onPress={() => onDelete(trip)} className="bg-transparent p-0">
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </Button>
      </View>
      <View className="bg-slate-800 px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <Ionicons name="car" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">{trip.vehicleModel || 'Veículo'} ({trip.vehiclePlate || 'N/A'})</Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#CBD5E1" />
            <Text className="text-slate-300 text-xs ml-1">{formatTime(trip.startDate)} - {trip.endDate ? formatTime(trip.endDate) : '...'}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="speedometer-outline" size={14} color="#CBD5E1" />
            <Text className="text-slate-300 text-xs ml-1">{trip.startOdometer} - {trip.endOdometer || '...'}</Text>
          </View>
        </View>
      </View>
      <View className="px-4 py-4">
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 items-center bg-gray-50 rounded-lg py-3 mr-2">
            <View className="flex-row items-center mb-1">
              <Ionicons name="cash-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-500 font-medium ml-1">Bruto</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">{formatCurrency(trip.grossEarnings || 0)}</Text>
          </View>
          <View className={`flex-1 items-center rounded-lg py-3 ${isPositive ? 'bg-green-50' : 'bg-gray-50'}`}>
            <View className="flex-row items-center mb-1">
              <Ionicons name="trending-up-outline" size={16} color={isPositive ? "#16A34A" : "#6B7280"} />
              <Text className={`text-xs font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-gray-500'}`}>Líquido</Text>
            </View>
            <Text className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
              {liquidoValue >= 0 ? '' : '-'}{formatCurrency(Math.abs(liquidoValue))}
            </Text>
          </View>
          <View className="flex-1 items-center bg-gray-50 rounded-lg py-3 ml-2">
            <View className="flex-row items-center mb-1">
              <Ionicons name="navigate-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-500 font-medium ml-1">KM</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">{(trip.totalKm || 0).toFixed(1)} km</Text>
          </View>
        </View>
      </View>
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
  const [uberEarningsInput, setUberEarningsInput] = useState('0,00');
  const [app99EarningsInput, setApp99EarningsInput] = useState('0,00');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [showEndForm, setShowEndForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const vehicles: Vehicle[] = vehiclesData || [];
  const trips: Trip[] = journeysData || [];
  const activeTrip = trips.find((trip) => trip.status === 'active' || trip.status === 'paused');
  const allCompletedTrips = trips.filter(trip => trip.status === 'completed');

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
        status: 'ativa'
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
    if (isNaN(endOdometerNum) || endOdometerNum <= activeTrip.startOdometer) {
      Alert.alert('Erro', 'Quilometragem final inválida.');
      return;
    }
    const uberEarnings = parseFloat(uberEarningsInput.replace(',', '.')) || 0;
    const app99Earnings = parseFloat(app99EarningsInput.replace(',', '.')) || 0;
    try {
      await finalizeJourney.mutateAsync({
        id: activeTrip.id,
        data: { kmFim: endOdometerNum, valorTotal: uberEarnings + app99Earnings }
      });
      setEndOdometerInput('');
      setUberEarningsInput('0,00');
      setApp99EarningsInput('0,00');
      setShowEndForm(false);
      Alert.alert('Sucesso', 'Jornada finalizada!');
      await refetchJourneys();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar.');
      console.error(error);
    }
  };

  const handleDeleteTrip = (trip: Trip) => {
    Alert.alert('Excluir Jornada', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteJourney.mutateAsync(trip.id);
            Alert.alert('Sucesso', 'Jornada excluída!');
            await refetchJourneys();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        }
      }
    ]);
  };

  if (isLoadingJourneys || isLoadingVehicles) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-900 to-blue-950 items-center justify-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4">Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-900 to-blue-950">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFFFFF" />} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white mb-1">Jornadas</Text>
          <Text className="text-blue-100">Gerencie suas corridas diárias</Text>
        </View>
        <View className="px-4 pb-8">
          {!activeTrip && vehicles.length > 0 && (
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-lg">
              <Text className="text-lg font-bold text-gray-900 mb-4">Iniciar Nova Jornada</Text>
              {vehicles.length > 1 && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Escolha o Veículo</Text>
                  <Picker selectedValue={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                    {vehicles.map((v) => <Picker.Item key={v.id} label={`${v.model} (${v.plate})`} value={v.id} />)}
                  </Picker>
                </View>
              )}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Quilometragem Inicial</Text>
                <Input placeholder="Ex: 45230" value={startOdometerInput} onChangeText={setStartOdometerInput} keyboardType="numeric" />
              </View>
              <Button onPress={handleStartTrip} className="bg-green-600 py-3 rounded-lg">
                <Text className="text-white font-bold text-center">Iniciar Jornada</Text>
              </Button>
            </View>
          )}
          {activeTrip && !showEndForm && (
            <View className="mb-6">
              <Button onPress={() => setShowEndForm(true)} className="bg-blue-600 py-3 rounded-lg">
                <Text className="text-white font-bold text-center">Finalizar Jornada</Text>
              </Button>
            </View>
          )}
          {showEndForm && (
            <View className="bg-white rounded-2xl p-5 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">Finalizar Jornada</Text>
              <View className="mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">KM Final</Text>
                <Input placeholder="Ex: 45280" value={endOdometerInput} onChangeText={setEndOdometerInput} keyboardType="numeric" />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Faturamento (R$)</Text>
                <View className="flex-row gap-2">
                  <Input placeholder="UBER" value={uberEarningsInput} onChangeText={setUberEarningsInput} keyboardType="numeric" className="flex-1" />
                  <Input placeholder="99" value={app99EarningsInput} onChangeText={setApp99EarningsInput} keyboardType="numeric" className="flex-1" />
                </View>
              </View>
              <Button onPress={handleEndTrip} className="bg-green-600 py-3 rounded-lg mb-2">
                <Text className="text-white font-bold text-center">Confirmar</Text>
              </Button>
              <Button onPress={() => setShowEndForm(false)} className="bg-gray-300 py-3 rounded-lg">
                <Text className="text-gray-900 font-bold text-center">Voltar</Text>
              </Button>
            </View>
          )}
          <View>
            <Text className="text-2xl font-bold text-white mb-4">Histórico</Text>
            {allCompletedTrips.length === 0 ? (
              <Text className="text-white text-center">Nenhuma jornada finalizada</Text>
            ) : (
              allCompletedTrips.map((trip) => <TripHistoryCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />)
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
