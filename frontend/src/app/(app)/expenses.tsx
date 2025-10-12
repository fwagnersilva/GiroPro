import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { FocusAwareStatusBar, Text, View, Input } from '@/components/ui';
import { useVehicles } from '@/lib/hooks/useVehicles';
import { useExpense, useCreateExpense, useUpdateExpense } from '@/lib/hooks/useExpenses';

export default function EditExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expenseId = params.id as string | undefined;

  // Buscar dados reais
  const { data: vehicles, isLoading: loadingVehicles } = useVehicles();
  const { data: expense, isLoading: loadingExpense } = useExpense(expenseId || '');
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Manutenção',
    description: '',
    value: '',
  });

  // Preencher formulário ao editar
  useEffect(() => {
    if (expense) {
      setFormData({
        vehicleId: expense.vehicleId,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        value: (expense.value / 100).toFixed(2),
      });
    } else if (vehicles && vehicles.length > 0 && !formData.vehicleId) {
      setFormData(prev => ({ ...prev, vehicleId: vehicles[0].id }));
    }
  }, [expense, vehicles]);

  const handleSaveExpense = async () => {
    if (!formData.vehicleId || !formData.date || !formData.category || !formData.description || !formData.value) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const expenseValue = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(expenseValue) || expenseValue <= 0) {
      Alert.alert('Erro', 'Valor inválido.');
      return;
    }

    const expenseData = {
      vehicleId: formData.vehicleId,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      value: Math.round(expenseValue * 100), // converter para centavos
    };

    try {
      if (expenseId) {
        await updateExpense.mutateAsync({ id: expenseId, data: expenseData });
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
      } else {
        await createExpense.mutateAsync(expenseData);
        Alert.alert('Sucesso', 'Despesa adicionada com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a despesa. Tente novamente.');
      console.error('Erro ao salvar despesa:', error);
    }
  };

  const selectedVehicle = vehicles?.find(v => v.id === formData.vehicleId);
  const isLoading = loadingVehicles || (expenseId && loadingExpense);
  const isSaving = createExpense.isPending || updateExpense.isPending;

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <FocusAwareStatusBar />
        <Stack.Screen options={{ title: 'Carregando...' }} />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Carregando dados...</Text>
      </View>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-4">
        <FocusAwareStatusBar />
        <Stack.Screen options={{ title: 'Nova Despesa' }} />
        <Text className="text-6xl mb-4">🚗</Text>
        <Text className="text-xl font-bold text-gray-900 mb-2">Nenhum veículo cadastrado</Text>
        <Text className="text-gray-600 text-center mb-6">
          Você precisa cadastrar um veículo antes de adicionar despesas
        </Text>
        <Pressable
          onPress={() => router.push('/vehicles')}
          className="bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Cadastrar Veículo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FocusAwareStatusBar />
      <Stack.Screen 
        options={{ 
          title: expenseId ? 'Editar Despesa' : 'Nova Despesa',
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header Card */}
        <View className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 pt-6 pb-8 mb-4">
          <Text className="text-2xl font-bold text-white mb-1">
            {expenseId ? 'Editar Despesa' : 'Nova Despesa'}
          </Text>
          <Text className="text-blue-100 text-sm">
            Preencha os campos abaixo com as informações da despesa
          </Text>
        </View>

        <View className="px-4 space-y-4">
          {/* Veículo */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Veículo *
            </Text>
            <Pressable
              onPress={() => setShowVehicleSelect(!showVehicleSelect)}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">
                    {selectedVehicle?.model || 'Selecione um veículo'}
                  </Text>
                  {selectedVehicle?.plate && (
                    <Text className="text-gray-500 text-xs mt-1">
                      {selectedVehicle.plate}
                    </Text>
                  )}
                </View>
                <Text className="text-gray-400">▼</Text>
              </View>
            </Pressable>
            
            {showVehicleSelect && (
              <View className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                {vehicles.map((vehicle) => (
                  <Pressable
                    key={vehicle.id}
                    onPress={() => {
                      setFormData({ ...formData, vehicleId: vehicle.id });
                      setShowVehicleSelect(false);
                    }}
                    className={`p-3 border-b border-gray-100 ${
                      formData.vehicleId === vehicle.id ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <Text className={`font-medium ${
                      formData.vehicleId === vehicle.id ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {vehicle.model}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {vehicle.plate}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Data */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Data *
            </Text>
            <Input
              placeholder="AAAA-MM-DD"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              className="border-gray-200 bg-gray-50 rounded-lg"
            />
          </View>

          {/* Categoria */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Categoria *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(['Manutenção', 'Combustível', 'Limpeza', 'Outros'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setFormData({ ...formData, category: cat })}
                  className={`px-4 py-2.5 rounded-full ${
                    formData.category === cat
                      ? 'bg-blue-500'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    formData.category === cat ? 'text-white' : 'text-gray-700'
                  }`}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Descrição */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Descrição do Serviço/Gasto *
            </Text>
            <Input
              placeholder="Ex: Troca de óleo, Alinhamento, Multa"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              className="border-gray-200 bg-gray-50 rounded-lg"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Valor */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Valor Gasto (R$) *
            </Text>
            <Input
              placeholder="Ex: 120.00"
              value={formData.value}
              onChangeText={(text) => setFormData({ ...formData, value: text })}
              keyboardType="numeric"
              className="border-gray-200 bg-gray-50 rounded-lg"
            />
          </View>

          {/* Botões de Ação */}
          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={handleSaveExpense}
              disabled={isSaving}
              className={`flex-1 rounded-xl py-4 shadow-md ${
                isSaving ? 'bg-blue-400' : 'bg-blue-500 active:bg-blue-600'
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-center text-base">
                  {expenseId ? 'Atualizar' : 'Salvar'}
                </Text>
              )}
            </Pressable>
            
            <Pressable
              onPress={() => router.back()}
              disabled={isSaving}
              className="flex-1 bg-white border-2 border-gray-200 rounded-xl py-4 active:bg-gray-50"
            >
              <Text className="text-gray-700 font-semibold text-center text-base">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}