import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Dimensions } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface Fueling {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  litros: number;
  valorTotal: number;
  precoPorLitro: number;
  kmAtual?: number;
  nomePosto?: string;
}

interface Vehicle {
  id: string;
  model: string;
  plate: string;
}

const fuelTypes = [
  { id: 'flex', label: 'Flex', icon: 'swap-vertical', color: 'bg-orange-600' },
  { id: 'gasolina', label: 'Gasolina', icon: 'flame', color: 'bg-yellow-600' },
  { id: 'etanol', label: 'Etanol', icon: 'leaf', color: 'bg-green-600' },
  { id: 'diesel', label: 'Diesel', icon: 'water', color: 'bg-blue-600' },
  { id: 'gnv', label: 'GNV', icon: 'wind', color: 'bg-purple-600' },
];

const SectionHeader: React.FC<{ title: string; icon?: string }> = ({ title, icon }) => (
  <View className="flex-row items-center mb-4">
    {icon && (
      <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={18} color="#0066CC" />
      </View>
    )}
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
  </View>
);

export default function EditFuelingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fuelingId = params.id as string | undefined;

  const userId = 'user-123';

  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Renault Logan', plate: 'QXF5C67' },
    { id: '2', model: 'Toyota Corolla', plate: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', plate: 'DEF-9012' },
  ]);

  const [fuelings, setFuelings] = useState<Fueling[]>([
    {
      id: '1',
      idUsuario: userId,
      idVeiculo: '1',
      dataAbastecimento: '2025-09-29',
      tipoCombustivel: 'gasolina',
      litros: 30.5,
      valorTotal: 15000,
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
      valorTotal: 10000,
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

  const handleSaveFueling = () => {
    if (!formData.idVeiculo || !formData.dataAbastecimento || !formData.tipoCombustivel || !formData.litros || !formData.valorTotal || !formData.precoPorLitro) {
      Alert.alert('Erro', 'Veículo, data, combustível, litros, valor e preço são obrigatórios.');
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
      valorTotal: Math.round(valorTotalNum * 100),
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

  const selectedVehicle = vehicles.find(v => v.id === formData.idVeiculo);
  const selectedFuel = fuelTypes.find(f => f.id === formData.tipoCombustivel);

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <Stack.Screen
        options={{
          title: editingFueling ? 'Editar Abastecimento' : 'Novo Abastecimento',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center mr-3">
              <Ionicons name={editingFueling ? "pencil" : "add-circle"} size={22} color="#0066CC" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">
              {editingFueling ? 'Editar Abastecimento' : 'Novo Abastecimento'}
            </Text>
          </View>
          <Text className="text-gray-600 ml-13">
            {editingFueling ? 'Atualize os dados do abastecimento' : 'Registre um novo abastecimento'}
          </Text>
        </View>

        {/* Vehicle Selection */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Veículo" icon="car" />
          
          <View className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-blue-600 items-center justify-center mr-3">
                <Ionicons name="car" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-blue-600 font-medium mb-1">Veículo Selecionado</Text>
                <Text className="text-lg font-bold text-gray-900">
                  {selectedVehicle?.model}
                </Text>
                <Text className="text-sm text-gray-600">
                  {selectedVehicle?.plate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Informações do Abastecimento" icon="water" />

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Data *</Text>
            <Input
              placeholder="AAAA-MM-DD"
              value={formData.dataAbastecimento}
              onChangeText={(text) => setFormData({ ...formData, dataAbastecimento: text })}
              className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </View>

          <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Litros *</Text>
              <Input
                placeholder="Ex: 30.5"
                value={formData.litros}
                onChangeText={(text) => setFormData({ ...formData, litros: text })}
                keyboardType="decimal-pad"
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>

            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Valor Total (R$) *</Text>
              <Input
                placeholder="Ex: 150.00"
                value={formData.valorTotal}
                onChangeText={(text) => setFormData({ ...formData, valorTotal: text })}
                keyboardType="decimal-pad"
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Preço por Litro (R$) *</Text>
            <Input
              placeholder="Ex: 4.91"
              value={formData.precoPorLitro}
              onChangeText={(text) => setFormData({ ...formData, precoPorLitro: text })}
              keyboardType="decimal-pad"
              className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </View>
        </View>

        {/* Fuel Type */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Tipo de Combustível" icon="flame" />
          
          <View className={`flex-row flex-wrap gap-2`}>
            {fuelTypes.map((fuel) => (
              <Button
                key={fuel.id}
                onPress={() => setFormData({ ...formData, tipoCombustivel: fuel.id as any })}
                className={`flex-1 ${isSmallScreen ? 'w-[30%]' : 'w-[18%]'} py-3 rounded-lg ${
                  formData.tipoCombustivel === fuel.id
                    ? `${fuel.color} border-2 border-gray-400`
                    : 'bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <View className="items-center">
                  <Ionicons
                    name={fuel.icon as any}
                    size={20}
                    color={formData.tipoCombustivel === fuel.id ? 'white' : '#6B7280'}
                  />
                  <Text className={`text-xs font-semibold mt-1 ${
                    formData.tipoCombustivel === fuel.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                    {fuel.label}
                  </Text>
                </View>
              </Button>
            ))}
          </View>
        </View>

        {/* Additional Information */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Informações Adicionais" icon="speedometer" />

          <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Odômetro (Km)</Text>
              <Input
                placeholder="Ex: 50000"
                value={formData.kmAtual}
                onChangeText={(text) => setFormData({ ...formData, kmAtual: text })}
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>

            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Nome do Posto</Text>
              <Input
                placeholder="Ex: Ipiranga"
                value={formData.nomePosto}
                onChangeText={(text) => setFormData({ ...formData, nomePosto: text })}
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>
          </View>
        </View>

        {/* Summary Card */}
        {formData.litros && formData.valorTotal && formData.precoPorLitro && (
          <View className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6 border border-green-200 shadow-sm">
            <Text className="text-sm font-bold text-gray-700 mb-3">Resumo</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs text-gray-600 mb-1">Litros Totais</Text>
                <Text className="text-lg font-bold text-gray-900">
                  {parseFloat(formData.litros).toFixed(2)} L
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-600 mb-1">Valor Total</Text>
                <Text className="text-lg font-bold text-green-600">
                  R$ {parseFloat(formData.valorTotal).toFixed(2)}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-600 mb-1">Preço/L</Text>
                <Text className="text-lg font-bold text-gray-900">
                  R$ {parseFloat(formData.precoPorLitro).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View className={`flex-row gap-3 mb-8 ${isSmallScreen ? 'flex-col' : ''}`}>
          <Button
            onPress={handleSaveFueling}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 py-4 rounded-xl shadow-md"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                {editingFueling ? 'Atualizar' : 'Adicionar'}
              </Text>
            </View>
          </Button>
          <Button
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 py-4 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="close" size={20} color="#374151" />
              <Text className="text-gray-800 font-bold ml-2">Cancelar</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}