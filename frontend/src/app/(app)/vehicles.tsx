import React from 'react';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';
import { useVehicles, useDeleteVehicle } from '@/api/vehicles';

export default function Vehicles() {
  const router = useRouter();
  const { data: vehicles, isLoading, error } = useVehicles();
  const deleteVehicle = useDeleteVehicle();

  const handleAddVehicle = () => {
    router.push('/edit-vehicle');
  };

  const handleEditVehicle = (vehicleId: string) => {
    router.push(`/edit-vehicle?id=${vehicleId}`);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este veículo?',
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

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#359CF1" />
        <Text className="mt-4 text-gray-600">Carregando veículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-4">
        <Text className="text-red-600 text-center mb-4">
          Erro ao carregar veículos
        </Text>
        <Text className="text-gray-600 text-center">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Meus Veículos
          </Text>
          <Button
            label="Adicionar Veículo"
            onPress={handleAddVehicle}
            className="mb-4"
          />
        </View>

        {!vehicles || vehicles.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-gray-500 text-center">
              Nenhum veículo cadastrado
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Clique em "Adicionar Veículo" para começar
            </Text>
          </View>
        ) : (
          vehicles.map((vehicle) => (
            <View
              key={vehicle.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {vehicle.marca} {vehicle.modelo}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Ano: {vehicle.ano} • Placa: {vehicle.placa}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <View className="flex-1 mr-2">
                  <Text className="text-xs text-gray-500 mb-1">
                    Combustível
                  </Text>
                  <Text className="text-sm font-medium text-gray-900 capitalize">
                    {vehicle.tipoCombustivel}
                  </Text>
                </View>
                <View className="flex-1 mr-2">
                  <Text className="text-xs text-gray-500 mb-1">
                    Tipo de Uso
                  </Text>
                  <Text className="text-sm font-medium text-gray-900 capitalize">
                    {vehicle.tipoUso}
                  </Text>
                </View>
                {vehicle.mediaConsumo && (
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-1">
                      Consumo
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {vehicle.mediaConsumo} km/l
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row mt-4 space-x-2">
                <Button
                  label="Editar"
                  onPress={() => handleEditVehicle(vehicle.id)}
                  variant="outline"
                  className="flex-1 mr-2"
                />
                <Button
                  label="Excluir"
                  onPress={() => handleDeleteVehicle(vehicle.id)}
                  variant="outline"
                  className="flex-1 border-red-500"
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
