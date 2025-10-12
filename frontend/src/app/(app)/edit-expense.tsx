import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

interface Expense {
  id: string;
  idUsuario: string;
  vehicleId: string;
  vehicleModel: string;
  date: string;
  category: string;
  description: string;
  value: number; // em centavos
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

export default function EditExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expenseId = params.id as string | undefined;

  // Mock userId - substituir pela autenticação real
  const userId = 'user-123';

  // Mock data for vehicles
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Renault Logan', plate: 'QXF5C67' },
    { id: '2', model: 'Toyota Corolla', plate: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', plate: 'DEF-9012' },
  ]);

  // Mock data for expenses (simulando um estado global ou API)
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      idUsuario: userId,
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      date: '2025-09-28',
      category: 'Manutenção',
      description: 'Troca de óleo',
      value: 15000,
    },
    {
      id: '2',
      idUsuario: userId,
      vehicleId: '1',
      vehicleModel: 'Renault Logan',
      date: '2025-09-25',
      category: 'Combustível',
      description: 'Abastecimento',
      value: 20000,
    },
    {
      id: '3',
      idUsuario: userId,
      vehicleId: '2',
      vehicleModel: 'Toyota Corolla',
      date: '2025-09-20',
      category: 'Limpeza',
      description: 'Lavagem completa',
      value: 5000,
    },
  ]);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    category: 'Manutenção',
    description: '',
    value: '',
  });

  useEffect(() => {
    if (expenseId) {
      const expenseToEdit = expenses.find(e => e.id === expenseId);
      if (expenseToEdit) {
        setEditingExpense(expenseToEdit);
        setFormData({
          vehicleId: expenseToEdit.vehicleId,
          date: expenseToEdit.date,
          category: expenseToEdit.category,
          description: expenseToEdit.description,
          value: (expenseToEdit.value / 100).toFixed(2),
        });
      }
    }
  }, [expenseId, expenses]);

  const resetForm = () => {
    setFormData({
      vehicleId: vehicles[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      category: 'Manutenção',
      description: '',
      value: '',
    });
    setEditingExpense(null);
  };

  const handleSaveExpense = () => {
    if (!formData.vehicleId || !formData.date || !formData.category || !formData.description || !formData.value) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const expenseValue = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(expenseValue) || expenseValue <= 0) {
      Alert.alert('Erro', 'Valor inválido.');
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    const expenseData = {
      idUsuario: userId,
      vehicleId: formData.vehicleId,
      vehicleModel: selectedVehicle.model,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      value: Math.round(expenseValue * 100),
    };

    if (editingExpense) {
      setExpenses(expenses.map(e =>
        e.id === editingExpense.id
          ? { ...expenseData, id: editingExpense.id } as Expense
          : e
      ));
      Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseData,
      };
      setExpenses([...expenses, newExpense]);
      Alert.alert('Sucesso', 'Despesa adicionada com sucesso!');
    }

    router.back();
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  return (
    <View className="flex-1 bg-gray-50">
      <FocusAwareStatusBar />
      <Stack.Screen 
        options={{ 
          title: editingExpense ? 'Editar Despesa' : 'Nova Despesa',
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
            {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
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
                    {selectedVehicle?.model}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {selectedVehicle?.plate}
                  </Text>
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
              className="flex-1 bg-blue-500 rounded-xl py-4 shadow-md active:bg-blue-600"
            >
              <Text className="text-white font-semibold text-center text-base">
                {editingExpense ? 'Atualizar' : 'Salvar'}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.back()}
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