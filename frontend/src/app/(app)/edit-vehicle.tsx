import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value / 100);
};

export default function EditVehicleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string | undefined;

  // Mock userId - substituir pela autenticação real
  const userId = 'user-123';

  // Mock data (simulando um estado global ou API)
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

  useEffect(() => {
    if (vehicleId) {
      const vehicleToEdit = vehicles.find(v => v.id === vehicleId);
      if (vehicleToEdit) {
        setEditingVehicle(vehicleToEdit);
        setFormData({
          marca: vehicleToEdit.marca,
          modelo: vehicleToEdit.modelo,
          ano: vehicleToEdit.ano.toString(),
          placa: vehicleToEdit.placa,
          tipoCombustivel: vehicleToEdit.tipoCombustivel,
          tipoUso: vehicleToEdit.tipoUso,
          valorAluguel: vehicleToEdit.valorAluguel ? (vehicleToEdit.valorAluguel / 100).toFixed(2) : '',
          valorPrestacao: vehicleToEdit.valorPrestacao ? (vehicleToEdit.valorPrestacao / 100).toFixed(2) : '',
          mediaConsumo: vehicleToEdit.mediaConsumo?.toString() || ''
        });
      }
    }
  }, [vehicleId, vehicles]);

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
          ? { ...vehicleData, id: editingVehicle.id } as Vehicle
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

    router.back(); // Voltar para a tela de veículos
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <Stack.Screen options={{ title: editingVehicle ? 'Editar Veículo' : 'Novo Veículo' }} />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
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
            onPress={() => router.back()}
            variant="outline"
            className="flex-1 ml-2"
          >
            <Text className="text-gray-600 font-medium">
              Cancelar
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

