import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Vehicle {
  id: string;
  modelo: string;
  anoFabricacao: string;
  anoModelo: string;
  placa: string;
  tipoCombustivel: string;
}

export default function Vehicles() {
  // Mock data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      modelo: 'Honda Civic',
      anoFabricacao: '2020',
      anoModelo: '2020',
      placa: 'ABC-1234',
      tipoCombustivel: 'Gasolina'
    },
    {
      id: '2',
      modelo: 'Toyota Corolla',
      anoFabricacao: '2019',
      anoModelo: '2019',
      placa: 'XYZ-5678',
      tipoCombustivel: 'Flex'
    },
    {
      id: '3',
      modelo: 'Ford Ka',
      anoFabricacao: '2018',
      anoModelo: '2018',
      placa: 'DEF-9012',
      tipoCombustivel: 'Flex'
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    modelo: '',
    anoFabricacao: '',
    anoModelo: '',
    placa: '',
    tipoCombustivel: 'Flex'
  });

  const resetForm = () => {
    setFormData({
      modelo: '',
      anoFabricacao: '',
      anoModelo: '',
      placa: '',
      tipoCombustivel: 'Flex'
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const handleAddVehicle = () => {
    setShowForm(true);
    resetForm();
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      modelo: vehicle.modelo,
      anoFabricacao: vehicle.anoFabricacao,
      anoModelo: vehicle.anoModelo,
      placa: vehicle.placa,
      tipoCombustivel: vehicle.tipoCombustivel
    });
    setShowForm(true);
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
          onPress: () => {
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
            Alert.alert('Sucesso', 'Veículo excluído com sucesso!');
          }
        }
      ]
    );
  };

  const handleSaveVehicle = () => {
    // Validações
    if (!formData.modelo || !formData.anoFabricacao || !formData.anoModelo || !formData.placa) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    // Validação de placa (formato brasileiro)
    const placaRegex = /^[A-Z]{3}-\d{4}$/;
    if (!placaRegex.test(formData.placa.toUpperCase())) {
      Alert.alert('Erro', 'Formato de placa inválido. Use o formato ABC-1234.');
      return;
    }

    // Validação de anos
    const currentYear = new Date().getFullYear();
    const anoFab = parseInt(formData.anoFabricacao);
    const anoMod = parseInt(formData.anoModelo);

    if (anoFab < 1900 || anoFab > currentYear + 1) {
      Alert.alert('Erro', 'Ano de fabricação inválido.');
      return;
    }

    if (anoMod < 1900 || anoMod > currentYear + 1) {
      Alert.alert('Erro', 'Ano do modelo inválido.');
      return;
    }

    if (editingVehicle) {
      // Editar veículo existente
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...formData, placa: formData.placa.toUpperCase() }
          : v
      ));
      Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
    } else {
      // Adicionar novo veículo
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData,
        placa: formData.placa.toUpperCase()
      };
      setVehicles([...vehicles, newVehicle]);
      Alert.alert('Sucesso', 'Veículo adicionado com sucesso!');
    }

    resetForm();
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Minha Frota
            </Text>
            <Text className="text-gray-600">
              Gerencie seus veículos cadastrados
            </Text>
          </View>
          <Button
            onPress={handleAddVehicle}
            className="px-4 py-2"
          >
            <Text className="text-white font-medium">
              + Adicionar
            </Text>
          </Button>
        </View>

        {/* Vehicle Form */}
        {showForm && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Modelo
              </Text>
              <Input
                placeholder="Ex: Honda Civic, Toyota Corolla"
                value={formData.modelo}
                onChangeText={(text) => setFormData({...formData, modelo: text})}
                className="w-full"
              />
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Ano de Fabricação
                </Text>
                <Input
                  placeholder="2020"
                  value={formData.anoFabricacao}
                  onChangeText={(text) => setFormData({...formData, anoFabricacao: text})}
                  keyboardType="numeric"
                  className="w-full"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Ano do Modelo
                </Text>
                <Input
                  placeholder="2020"
                  value={formData.anoModelo}
                  onChangeText={(text) => setFormData({...formData, anoModelo: text})}
                  keyboardType="numeric"
                  className="w-full"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Placa
              </Text>
              <Input
                placeholder="ABC-1234"
                value={formData.placa}
                onChangeText={(text) => setFormData({...formData, placa: text})}
                autoCapitalize="characters"
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tipo de Combustível
              </Text>
              <View className="flex-row space-x-2">
                {['Flex', 'Gasolina', 'Etanol', 'Diesel'].map((tipo) => (
                  <Button
                    key={tipo}
                    onPress={() => setFormData({...formData, tipoCombustivel: tipo})}
                    variant={formData.tipoCombustivel === tipo ? 'default' : 'outline'}
                    className="flex-1 mr-2"
                  >
                    <Text className={formData.tipoCombustivel === tipo ? 'text-white' : 'text-gray-600'}>
                      {tipo}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="flex-row space-x-2">
              <Button
                onPress={handleSaveVehicle}
                className="flex-1 mr-2"
              >
                <Text className="text-white font-medium">
                  {editingVehicle ? 'Atualizar' : 'Salvar'}
                </Text>
              </Button>
              <Button
                onPress={resetForm}
                variant="outline"
                className="flex-1 ml-2"
              >
                <Text className="text-gray-600 font-medium">
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        )}

        {/* Vehicles List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Veículos Cadastrados ({vehicles.length})
          </Text>

          {vehicles.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-center">
                Nenhum veículo cadastrado.{'\n'}
                Adicione seu primeiro veículo para começar!
              </Text>
            </View>
          ) : (
            vehicles.map((vehicle) => (
              <View key={vehicle.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-lg mb-1">
                      {vehicle.modelo}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      {vehicle.anoFabricacao}/{vehicle.anoModelo} • {vehicle.placa}
                    </Text>
                    <Text className="text-gray-600">
                      Combustível: {vehicle.tipoCombustivel}
                    </Text>
                  </View>
                  <View className="flex-row space-x-2">
                    <Button
                      onPress={() => handleEditVehicle(vehicle)}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      <Text className="text-blue-600 text-sm">
                        Editar
                      </Text>
                    </Button>
                    <Button
                      onPress={() => handleDeleteVehicle(vehicle.id)}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      <Text className="text-red-600 text-sm">
                        Excluir
                      </Text>
                    </Button>
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
