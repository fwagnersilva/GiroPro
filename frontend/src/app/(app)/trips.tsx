import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';
import { useVehicle, useCreateVehicle, useUpdateVehicle } from '@/api/vehicles/use-vehicles';
import type { CreateVehicleDto, UpdateVehicleDto } from '@/api/vehicles/types';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

const fuelTypes = [
  { id: 'flex', label: 'Flex', icon: 'swap-vertical' },
  { id: 'gasolina', label: 'Gasolina', icon: 'flame' },
  { id: 'etanol', label: 'Etanol', icon: 'leaf' },
  { id: 'diesel', label: 'Diesel', icon: 'water' },
  { id: 'gnv', label: 'GNV', icon: 'leaf' },
];

const usageTypes = [
  { id: 'proprio', label: 'Próprio', icon: 'person' },
  { id: 'alugado', label: 'Alugado', icon: 'home' },
  { id: 'financiado', label: 'Financiado', icon: 'card' },
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

export default function EditVehicleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string | undefined;

  const { data: vehicleData, isLoading: isLoadingVehicle } = useVehicle(vehicleId || '');
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    tipoCombustivel: 'flex' as const,
    tipoUso: 'proprio' as const,
    valorAluguel: '',
    valorPrestacao: '',
    mediaConsumo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vehicleData) {
      setFormData({
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        ano: vehicleData.ano.toString(),
        placa: vehicleData.placa,
        tipoCombustivel: vehicleData.tipoCombustivel,
        tipoUso: vehicleData.tipoUso,
        valorAluguel: vehicleData.valorAluguel ? (vehicleData.valorAluguel / 100).toFixed(2) : '',
        valorPrestacao: vehicleData.valorPrestacao ? (vehicleData.valorPrestacao / 100).toFixed(2) : '',
        mediaConsumo: vehicleData.mediaConsumo?.toString() || ''
      });
    }
  }, [vehicleData]);

  const validateForm = () => {
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      Alert.alert('Erro', 'Marca, modelo, ano e placa são obrigatórios.');
      return false;
    }

    const placaRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const placaLimpa = formData.placa.toUpperCase().replace(/[-\s]/g, '');

    if (!placaRegex.test(placaLimpa)) {
      Alert.alert('Erro', 'Formato de placa inválido. Use ABC1234 ou ABC1D23.');
      return false;
    }

    const currentYear = new Date().getFullYear();
    const ano = parseInt(formData.ano);

    if (ano < 1900 || ano > currentYear + 1) {
      Alert.alert('Erro', 'Ano inválido.');
      return false;
    }

    if (formData.tipoUso === 'alugado' && !formData.valorAluguel) {
      Alert.alert('Erro', 'Informe o valor do aluguel.');
      return false;
    }

    if (formData.tipoUso === 'financiado' && !formData.valorPrestacao) {
      Alert.alert('Erro', 'Informe o valor da prestação.');
      return false;
    }

    return true;
  };

  const handleSaveVehicle = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const placaLimpa = formData.placa.toUpperCase().replace(/[-\s]/g, '');
      const ano = parseInt(formData.ano);

      const vehiclePayload: CreateVehicleDto = {
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

      if (vehicleId) {
        await updateVehicle.mutateAsync({
          id: vehicleId,
          data: vehiclePayload as UpdateVehicleDto
        });
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
      } else {
        await createVehicle.mutateAsync(vehiclePayload);
        Alert.alert('Sucesso', 'Veículo adicionado com sucesso!');
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao salvar veículo'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingVehicle && vehicleId) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 to-white items-center justify-center">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="text-gray-600 mt-4">Carregando veículo...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <Stack.Screen
        options={{
          title: vehicleId ? 'Editar Veículo' : 'Novo Veículo',
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
              <Ionicons name={vehicleId ? "pencil" : "add-circle"} size={22} color="#0066CC" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">
              {vehicleId ? 'Editar Veículo' : 'Novo Veículo'}
            </Text>
          </View>
          <Text className="text-gray-600 ml-13">
            {vehicleId ? 'Atualize os dados do seu veículo' : 'Adicione um novo veículo'}
          </Text>
        </View>

        {/* Basic Information */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Informações Básicas" icon="car" />

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Marca *</Text>
            <Input
              placeholder="Ex: Honda, Toyota, Ford"
              value={formData.marca}
              onChangeText={(text) => setFormData({...formData, marca: text})}
              className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Modelo *</Text>
            <Input
              placeholder="Ex: Civic, Corolla, Ka"
              value={formData.modelo}
              onChangeText={(text) => setFormData({...formData, modelo: text})}
              className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </View>

          <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Ano *</Text>
              <Input
                placeholder="2020"
                value={formData.ano}
                onChangeText={(text) => setFormData({...formData, ano: text})}
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''}`}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Placa *</Text>
              <Input
                placeholder="ABC1234"
                value={formData.placa}
                onChangeText={(text) => setFormData({...formData, placa: text})}
                autoCapitalize="characters"
                maxLength={8}
                className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </View>
          </View>
        </View>

        {/* Fuel Type */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Tipo de Combustível" icon="flame" />

          <View className={`flex-row flex-wrap gap-2`}>
            {fuelTypes.map((fuel) => (
              <Button
                key={fuel.id}
                onPress={() => setFormData({...formData, tipoCombustivel: fuel.id as any})}
                className={`flex-1 ${isSmallScreen ? 'w-[30%]' : 'w-[18%]'} py-3 rounded-lg ${
                  formData.tipoCombustivel === fuel.id
                    ? 'bg-blue-600 border-2 border-blue-700'
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

        {/* Usage Type */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Tipo de Uso" icon="home" />

          <View className={`flex-row gap-2 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            {usageTypes.map((usage) => (
              <Button
                key={usage.id}
                onPress={() => setFormData({...formData, tipoUso: usage.id as any})}
                className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} py-3 rounded-lg ${
                  formData.tipoUso === usage.id
                    ? 'bg-green-600 border-2 border-green-700'
                    : 'bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons
                    name={usage.icon as any}
                    size={18}
                    color={formData.tipoUso === usage.id ? 'white' : '#6B7280'}
                  />
                  <Text className={`font-semibold ml-2 ${
                    formData.tipoUso === usage.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                    {usage.label}
                  </Text>
                </View>
              </Button>
            ))}
          </View>
        </View>

        {/* Conditional Fields */}
        {formData.tipoUso === 'alugado' && (
          <View className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-200 shadow-sm">
            <SectionHeader title="Valor do Aluguel" icon="card" />
            <Input
              placeholder="1500.00"
              value={formData.valorAluguel}
              onChangeText={(text) => setFormData({...formData, valorAluguel: text})}
              keyboardType="decimal-pad"
              className="bg-white border border-orange-200 rounded-lg text-gray-900"
            />
          </View>
        )}

        {formData.tipoUso === 'financiado' && (
          <View className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-200 shadow-sm">
            <SectionHeader title="Valor da Prestação" icon="card" />
            <Input
              placeholder="800.00"
              value={formData.valorPrestacao}
              onChangeText={(text) => setFormData({...formData, valorPrestacao: text})}
              keyboardType="decimal-pad"
              className="bg-white border border-purple-200 rounded-lg text-gray-900"
            />
          </View>
        )}

        {/* Additional Info */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          <SectionHeader title="Informações Adicionais" icon="speedometer" />

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Média de Consumo (km/l)
            </Text>
            <Input
              placeholder="12.5"
              value={formData.mediaConsumo}
              onChangeText={(text) => setFormData({...formData, mediaConsumo: text})}
              keyboardType="decimal-pad"
              className="bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </View>
        </View>

        {/* Buttons */}
        <View className={`flex-row gap-3 mb-8 ${isSmallScreen ? 'flex-col' : ''}`}>
          <Button
            onPress={handleSaveVehicle}
            disabled={isSubmitting}
            className={`flex-1 py-4 rounded-xl shadow-md ${
              isSubmitting
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">
                    {vehicleId ? 'Atualizar' : 'Adicionar Veículo'}
                  </Text>
                </>
              )}
            </View>
          </Button>
          <Button
            onPress={() => router.back()}
            disabled={isSubmitting}
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