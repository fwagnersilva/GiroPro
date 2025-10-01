import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Vehicle {
  id: string;
  idUsuario: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  tipoUso: 'proprio' | 'alugado' | 'financiado';
  valorAluguel?: number; // em centavos
  valorPrestacao?: number; // em centavos
  mediaConsumo?: number;
}

export default function Vehicles() {
  // Mock userId - substituir pela autenticação real
  const userId = 'user-123';

  // Mock data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      idUsuario: userId,
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2020,
      placa: 'ABC1234',
      tipoCombustivel: 'gasolina',
      tipoUso: 'proprio'
    },
    {
      id: '2',
      idUsuario: userId,
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2019,
      placa: 'XYZ5678',
      tipoCombustivel: 'flex',
      tipoUso: 'proprio'
    },
    {
      id: '3',
      idUsuario: userId,
      marca: 'Ford',
      modelo: 'Ka',
      ano: 2018,
      placa: 'DEF9012',
      tipoCombustivel: 'flex',
      tipoUso: 'alugado',
      valorAluguel: 150000 // R$ 1500,00
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    tipoCombustivel: 'flex' as Vehicle['tipoCombustivel'],
    tipoUso: 'proprio' as Vehicle['tipoUso'],
    valorAluguel: '',
    valorPrestacao: '',
    mediaConsumo: ''
  });

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      ano: '',
      placa: '',
      tipoCombustivel: 'flex',
      tipoUso: 'proprio',
      valorAluguel: '',
      valorPrestacao: '',
      mediaConsumo: ''
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
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      placa: vehicle.placa,
      tipoCombustivel: vehicle.tipoCombustivel,
      tipoUso: vehicle.tipoUso,
      valorAluguel: vehicle.valorAluguel ? (vehicle.valorAluguel / 100).toFixed(2) : '',
      valorPrestacao: vehicle.valorPrestacao ? (vehicle.valorPrestacao / 100).toFixed(2) : '',
      mediaConsumo: vehicle.mediaConsumo?.toString() || ''
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
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      Alert.alert('Erro', 'Marca, modelo, ano e placa são obrigatórios.');
      return;
    }

    // Validação de placa (formato brasileiro - aceita antigo e Mercosul)
    const placaRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const placaLimpa = formData.placa.toUpperCase().replace(/[-\s]/g, '');
    
    if (!placaRegex.test(placaLimpa)) {
      Alert.alert('Erro', 'Formato de placa inválido. Use ABC1234 ou ABC1D23.');
      return;
    }

    // Validação de ano
    const currentYear = new Date().getFullYear();
    const ano = parseInt(formData.ano);

    if (ano < 1900 || ano > currentYear + 1) {
      Alert.alert('Erro', 'Ano inválido.');
      return;
    }

    // Validação de valores monetários condicionais
    if (formData.tipoUso === 'alugado' && !formData.valorAluguel) {
      Alert.alert('Erro', 'Informe o valor do aluguel.');
      return;
    }

    if (formData.tipoUso === 'financiado' && !formData.valorPrestacao) {
      Alert.alert('Erro', 'Informe o valor da prestação.');
      return;
    }

    // Preparar dados do veículo
    const vehicleData: Omit<Vehicle, 'id'> = {
      idUsuario: userId,
      marca: formData.marca,
      modelo: formData.modelo,
      ano: ano,
      placa: placaLimpa,
      tipoCombustivel: formData.tipoCombustivel,
      tipoUso: formData.tipoUso,
      valorAluguel: formData.valorAluguel ? Math.round(parseFloat(formData.valorAluguel) * 100) : undefined,
      valorPrestacao: formData.valorPrestacao ? Math.round(parseFloat(formData.valorPrestacao) * 100) : undefined,
      mediaConsumo: formData.mediaConsumo ? parseFloat(formData.mediaConsumo) : undefined
    };

    if (editingVehicle) {
      // Editar veículo existente
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...vehicleData, id: editingVehicle.id }
          : v
      ));
      Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
    } else {
      // Adicionar novo veículo
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...vehicleData
      };
      setVehicles([...vehicles, newVehicle]);
      Alert.alert('Sucesso', 'Veículo adicionado com sucesso!');
    }

    resetForm();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
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
                Marca *
              </Text>
              <Input
                placeholder="Ex: Honda, Toyota, Ford"
                value={formData.marca}
                onChangeText={(text) => setFormData({...formData, marca: text})}
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </Text>
              <Input
                placeholder="Ex: Civic, Corolla, Ka"
                value={formData.modelo}
                onChangeText={(text) => setFormData({...formData, modelo: text})}
                className="w-full"
              />
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Ano *
                </Text>
                <Input
                  placeholder="2020"
                  value={formData.ano}
                  onChangeText={(text) => setFormData({...formData, ano: text})}
                  keyboardType="numeric"
                  className="w-full"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Placa *
                </Text>
                <Input
                  placeholder="ABC1234"
                  value={formData.placa}
                  onChangeText={(text) => setFormData({...formData, placa: text})}
                  autoCapitalize="characters"
                  maxLength={8}
                  className="w-full"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tipo de Combustível *
              </Text>
              <View className="flex-row flex-wrap">
                {(['flex', 'gasolina', 'etanol', 'diesel', 'gnv'] as const).map((tipo) => (
                  <Button
                    key={tipo}
                    onPress={() => setFormData({...formData, tipoCombustivel: tipo})}
                    variant={formData.tipoCombustivel === tipo ? 'default' : 'outline'}
                    className="mr-2 mb-2 px-3 py-2"
                  >
                    <Text className={formData.tipoCombustivel === tipo ? 'text-white text-xs' : 'text-gray-600 text-xs'}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tipo de Uso *
              </Text>
              <View className="flex-row">
                {(['proprio', 'alugado', 'financiado'] as const).map((tipo) => (
                  <Button
                    key={tipo}
                    onPress={() => setFormData({...formData, tipoUso: tipo})}
                    variant={formData.tipoUso === tipo ? 'default' : 'outline'}
                    className="flex-1 mr-2"
                  >
                    <Text className={formData.tipoUso === tipo ? 'text-white text-xs' : 'text-gray-600 text-xs'}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            {formData.tipoUso === 'alugado' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Valor do Aluguel (R$) *
                </Text>
                <Input
                  placeholder="1500.00"
                  value={formData.valorAluguel}
                  onChangeText={(text) => setFormData({...formData, valorAluguel: text})}
                  keyboardType="decimal-pad"
                  className="w-full"
                />
              </View>
            )}

            {formData.tipoUso === 'financiado' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Valor da Prestação (R$) *
                </Text>
                <Input
                  placeholder="800.00"
                  value={formData.valorPrestacao}
                  onChangeText={(text) => setFormData({...formData, valorPrestacao: text})}
                  keyboardType="decimal-pad"
                  className="w-full"
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Média de Consumo (km/l)
              </Text>
              <Input
                placeholder="12.5"
                value={formData.mediaConsumo}
                onChangeText={(text) => setFormData({...formData, mediaConsumo: text})}
                keyboardType="decimal-pad"
                className="w-full"
              />
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
                      {vehicle.marca} {vehicle.modelo}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      {vehicle.ano} • {vehicle.placa}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      Combustível: {vehicle.tipoCombustivel.charAt(0).toUpperCase() + vehicle.tipoCombustivel.slice(1)}
                    </Text>
                    <Text className="text-gray-600">
                      Uso: {vehicle.tipoUso.charAt(0).toUpperCase() + vehicle.tipoUso.slice(1)}
                      {vehicle.tipoUso === 'alugado' && vehicle.valorAluguel && 
                        ` - ${formatCurrency(vehicle.valorAluguel)}/mês`}
                      {vehicle.tipoUso === 'financiado' && vehicle.valorPrestacao && 
                        ` - ${formatCurrency(vehicle.valorPrestacao)}/mês`}
                    </Text>
                    {vehicle.mediaConsumo && (
                      <Text className="text-gray-600">
                        Consumo: {vehicle.mediaConsumo} km/l
                      </Text>
                    )}
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
