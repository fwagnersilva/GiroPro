import React, { useState } from 'react';
import { ScrollView, Alert, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';
import { useVehicles, useDeleteVehicle } from '@/api/vehicles';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

export default function Vehicles() {
  const router = useRouter();
  const { data: vehicles, isLoading, error, refetch } = useVehicles();
  const deleteVehicle = useDeleteVehicle();
  const [refreshing, setRefreshing] = useState(false);

  const handleAddVehicle = () => {
    router.push('/edit-vehicle');
  };

  const handleEditVehicle = (vehicleId: string) => {
    router.push(`/edit-vehicle?id=${vehicleId}`);
  };

  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    Alert.alert(
      'Excluir Veículo',
      `Tem certeza que deseja excluir "${vehicleName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVehicle.mutateAsync(vehicleId);
              Alert.alert('Sucesso', 'Veículo excluído com sucesso!');
            } catch (err: any) {
              Alert.alert(
                'Erro',
                err.response?.data?.message || 'Erro ao excluir veículo'
              );
            }
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !vehicles) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 to-white items-center justify-center">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="mt-4 text-gray-600 font-medium">Carregando veículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="bg-red-50 rounded-2xl p-6 items-center">
          <Ionicons name="alert-circle" size={48} color="#DC2626" />
          <Text className="text-red-600 text-center font-bold mt-3 text-lg">
            Erro ao carregar veículos
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </Text>
          <Button
            label="Tentar novamente"
            onPress={() => refetch()}
            className="mt-4 bg-red-600"
          />
        </View>
      </View>
    );
  }

  const vehicleCount = vehicles?.length || 0;

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0066CC" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900">
                Meus Veículos
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {vehicleCount} {vehicleCount === 1 ? 'veículo' : 'veículos'} cadastrado{vehicleCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center">
              <Text className="text-white text-xl font-bold">{vehicleCount}</Text>
            </View>
          </View>

          {/* Add Button */}
          <Button
            label="+ Adicionar Veículo"
            onPress={handleAddVehicle}
            className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 rounded-xl font-semibold shadow-lg"
          />
        </View>

        {/* Content */}
        <View className="px-4 pb-8">
          {!vehicles || vehicles.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-gray-100">
              <View className="bg-blue-50 rounded-full w-16 h-16 items-center justify-center mb-4">
                <Ionicons name="car-outline" size={32} color="#0066CC" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 text-center">
                Nenhum veículo cadastrado
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Clique em "Adicionar Veículo" para começar a usar o GiroPro
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {vehicles.map((vehicle, index) => (
                <View
                  key={vehicle.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  {/* Vehicle Header */}
                  <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold">
                        {vehicle.marca} {vehicle.modelo}
                      </Text>
                      <Text className="text-blue-100 text-sm mt-1">
                        {vehicle.ano} • {vehicle.placa}
                      </Text>
                    </View>
                    <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                      <Text className="text-white text-xs font-semibold">
                        #{index + 1}
                      </Text>
                    </View>
                  </View>

                  {/* Vehicle Details */}
                  <View className="p-4">
                    <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''}`}>
                      {/* Fuel Type */}
                      <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-xl p-3`}>
                        <Text className="text-xs text-gray-500 font-medium mb-1">
                          Combustível
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="flash" size={16} color="#0066CC" />
                          <Text className="text-sm font-semibold text-gray-900 ml-2 capitalize">
                            {vehicle.tipoCombustivel}
                          </Text>
                        </View>
                      </View>

                      {/* Usage Type */}
                      <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-xl p-3`}>
                        <Text className="text-xs text-gray-500 font-medium mb-1">
                          Tipo de Uso
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="map" size={16} color="#0066CC" />
                          <Text className="text-sm font-semibold text-gray-900 ml-2 capitalize">
                            {vehicle.tipoUso}
                          </Text>
                        </View>
                      </View>

                      {/* Consumption */}
                      {vehicle.mediaConsumo && (
                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-xl p-3`}>
                          <Text className="text-xs text-gray-500 font-medium mb-1">
                            Consumo
                          </Text>
                          <View className="flex-row items-center">
                            <Ionicons name="speedometer" size={16} color="#0066CC" />
                            <Text className="text-sm font-semibold text-gray-900 ml-2">
                              {vehicle.mediaConsumo} km/l
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="px-4 py-3 bg-gray-50 flex-row gap-3 border-t border-gray-100">
                    <Button
                      label="Editar"
                      onPress={() => handleEditVehicle(vehicle.id)}
                      className={`flex-1 bg-blue-600 py-2.5 rounded-lg font-semibold ${
                        isSmallScreen ? 'text-sm' : ''
                      }`}
                    />
                    <Button
                      label="Excluir"
                      onPress={() =>
                        handleDeleteVehicle(
                          vehicle.id,
                          `${vehicle.marca} ${vehicle.modelo}`
                        )
                      }
                      className={`flex-1 bg-red-50 border border-red-200 py-2.5 rounded-lg font-semibold text-red-600 ${
                        isSmallScreen ? 'text-sm' : ''
                      }`}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}