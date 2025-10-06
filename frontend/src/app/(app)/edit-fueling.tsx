import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Fueling {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  litros: number;
  valorTotal: number; // em centavos
  precoPorLitro: number;
  kmAtual?: number;
  nomePosto?: string;
}

interface Vehicle {
  id: string;
  model: string;
  plate: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value / 100);
};

export default function EditFuelingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fuelingId = params.id as string | undefined;

  // Mock userId - substituir pela autenticação real
  const userId = 'user-123';

  // Mock data for vehicles
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Renault Logan', plate: 'QXF5C67' },
    { id: '2', model: 'Toyota Corolla', plate: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', plate: 'DEF-9012' },
  ]);

  // Mock data for fuelings (simulando um estado global ou API)
  const [fuelings, setFuelings] = useState<Fueling[]>([
    {
      id: '1',
      idUsuario: userId,
      idVeiculo: '1',
      dataAbastecimento: '2025-09-29',
      tipoCombustivel: 'gasolina',
      litros: 30.5,
      valorTotal: 15000, // R$ 150,00
      precoPorLitro: 4.91,
      kmAtual: 229128,
      nomePosto: 'Posto Ipiranga',
    },
    {
      id: '2',
      idUsuario: userId,
      idVeiculo: '2',
      dataAbastecimento: '2025-09-28',
      tipoCombustivel: 'etanol',
      litros: 25.0,
      valorTotal: 10000, // R$ 100,00
      precoPorLitro: 4.00,
      kmAtual: 50000,
      nomePosto: 'Posto Shell',
    },
  ]);

  const [editingFueling, setEditingFueling] = useState<Fueling | null>(null);
  const [formData, setFormData] = useState({
    idVeiculo: vehicles[0]?.id || '',
    dataAbastecimento: new Date().toISOString().split('T')[0],
    tipoCombustivel: 'gasolina' as Fueling['tipoCombustivel'],
    litros: '',
    valorTotal: '',
    precoPorLitro: '',
    kmAtual: '',
    nomePosto: '',
  });

  useEffect(() => {
    if (fuelingId) {
      const fuelingToEdit = fuelings.find(f => f.id === fuelingId);
      if (fuelingToEdit) {
        setEditingFueling(fuelingToEdit);
        setFormData({
          idVeiculo: fuelingToEdit.idVeiculo,
          dataAbastecimento: fuelingToEdit.dataAbastecimento,
          tipoCombustivel: fuelingToEdit.tipoCombustivel,
          litros: fuelingToEdit.litros.toString(),
          valorTotal: (fuelingToEdit.valorTotal / 100).toFixed(2),
          precoPorLitro: fuelingToEdit.precoPorLitro.toFixed(2),
          kmAtual: fuelingToEdit.kmAtual?.toString() || '',
          nomePosto: fuelingToEdit.nomePosto || '',
        });
      }
    }
  }, [fuelingId, fuelings]);

  const resetForm = () => {
    setFormData({
      idVeiculo: vehicles[0]?.id || '',
      dataAbastecimento: new Date().toISOString().split('T')[0],
      tipoCombustivel: 'gasolina',
      litros: '',
      valorTotal: '',
      precoPorLitro: '',
      kmAtual: '',
      nomePosto: '',
    });
    setEditingFueling(null);
  };

  const handleSaveFueling = () => {
    if (!formData.idVeiculo || !formData.dataAbastecimento || !formData.tipoCombustivel || !formData.litros || !formData.valorTotal || !formData.precoPorLitro) {
      Alert.alert('Erro', 'Os campos de veículo, data, tipo de combustível, litros, valor total e preço por litro são obrigatórios.');
      return;
    }

    const litrosNum = parseFloat(formData.litros.replace(',', '.'));
    const valorTotalNum = parseFloat(formData.valorTotal.replace(',', '.'));
    const precoPorLitroNum = parseFloat(formData.precoPorLitro.replace(',', '.'));
    const kmAtualNum = formData.kmAtual ? parseInt(formData.kmAtual) : undefined;

    if (isNaN(litrosNum) || litrosNum <= 0) {
      Alert.alert('Erro', 'Litros inválidos.');
      return;
    }
    if (isNaN(valorTotalNum) || valorTotalNum <= 0) {
      Alert.alert('Erro', 'Valor total inválido.');
      return;
    }
    if (isNaN(precoPorLitroNum) || precoPorLitroNum <= 0) {
      Alert.alert('Erro', 'Preço por litro inválido.');
      return;
    }
    if (kmAtualNum !== undefined && (isNaN(kmAtualNum) || kmAtualNum <= 0)) {
      Alert.alert('Erro', 'Odômetro inválido.');
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === formData.idVeiculo);
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    const fuelingData = {
      idUsuario: userId,
      idVeiculo: formData.idVeiculo,
      dataAbastecimento: formData.dataAbastecimento,
      tipoCombustivel: formData.tipoCombustivel,
      litros: litrosNum,
      valorTotal: Math.round(valorTotalNum * 100), // Armazenar em centavos
      precoPorLitro: precoPorLitroNum,
      kmAtual: kmAtualNum,
      nomePosto: formData.nomePosto || undefined,
    };

    if (editingFueling) {
      setFuelings(fuelings.map(f =>
        f.id === editingFueling.id
          ? { ...fuelingData, id: editingFueling.id } as Fueling
          : f
      ));
      Alert.alert('Sucesso', 'Abastecimento atualizado com sucesso!');
    } else {
      const newFueling: Fueling = {
        id: Date.now().toString(),
        ...fuelingData,
      };
      setFuelings([...fuelings, newFueling]);
      Alert.alert('Sucesso', 'Abastecimento adicionado com sucesso!');
    }

    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <Stack.Screen options={{ title: editingFueling ? 'Editar Abastecimento' : 'Novo Abastecimento' }} />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          {editingFueling ? 'Editar Abastecimento' : 'Novo Abastecimento'}
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Veículo *
          </Text>
          <View className="border border-gray-300 rounded-lg p-3">
            <Text className="text-gray-800">
              {vehicles.find(v => v.id === formData.idVeiculo)?.model} ({vehicles.find(v => v.id === formData.idVeiculo)?.plate})
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Data do Abastecimento *
          </Text>
          <Input
            placeholder="AAAA-MM-DD"
            value={formData.dataAbastecimento}
            onChangeText={(text) => setFormData({ ...formData, dataAbastecimento: text })}
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Tipo de Combustível *
          </Text>
          <View className="flex-row flex-wrap">
            {(['gasolina', 'etanol', 'diesel', 'gnv', 'flex'] as const).map((tipo) => (
              <Button
                key={tipo}
                onPress={() => setFormData({ ...formData, tipoCombustivel: tipo })}
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
            Litros Abastecidos *
          </Text>
          <Input
            placeholder="Ex: 30.5"
            value={formData.litros}
            onChangeText={(text) => setFormData({ ...formData, litros: text })}
            keyboardType="numeric"
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Valor Total (R$) *
          </Text>
          <Input
            placeholder="Ex: 150.00"
            value={formData.valorTotal}
            onChangeText={(text) => setFormData({ ...formData, valorTotal: text })}
            keyboardType="numeric"
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Preço por Litro (R$) *
          </Text>
          <Input
            placeholder="Ex: 4.91"
            value={formData.precoPorLitro}
            onChangeText={(text) => setFormData({ ...formData, precoPorLitro: text })}
            keyboardType="numeric"
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Odômetro (Km) - Opcional
          </Text>
          <Input
            placeholder="Ex: 50000"
            value={formData.kmAtual}
            onChangeText={(text) => setFormData({ ...formData, kmAtual: text })}
            keyboardType="numeric"
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Nome do Posto - Opcional
          </Text>
          <Input
            placeholder="Ex: Posto Ipiranga"
            value={formData.nomePosto}
            onChangeText={(text) => setFormData({ ...formData, nomePosto: text })}
            className="w-full"
          />
        </View>

        <View className="flex-row space-x-2">
          <Button
            onPress={handleSaveFueling}
            className="flex-1 mr-2"
          >
            <Text className="text-white font-medium">
              {editingFueling ? 'Atualizar' : 'Salvar'}
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

