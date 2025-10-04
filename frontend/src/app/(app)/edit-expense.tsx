import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
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

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <Stack.Screen options={{ title: editingExpense ? 'Editar Despesa' : 'Nova Despesa' }} />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Veículo *
          </Text>
          <View className="border border-gray-300 rounded-lg p-3">
            <Text className="text-gray-800">
              {vehicles.find(v => v.id === formData.vehicleId)?.model} ({vehicles.find(v => v.id === formData.vehicleId)?.plate})
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Data *
          </Text>
          <Input
            placeholder="AAAA-MM-DD"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </Text>
          <View className="flex-row flex-wrap">
            {(['Manutenção', 'Combustível', 'Limpeza', 'Outros'] as const).map((cat) => (
              <Button
                key={cat}
                onPress={() => setFormData({ ...formData, category: cat })}
                variant={formData.category === cat ? 'default' : 'outline'}
                className="mr-2 mb-2 px-3 py-2"
              >
                <Text className={formData.category === cat ? 'text-white text-xs' : 'text-gray-600 text-xs'}>
                  {cat}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Descrição do Serviço/Gasto *
          </Text>
          <Input
            placeholder="Ex: Troca de óleo, Alinhamento, Multa"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            className="w-full"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Valor Gasto (R$) *
          </Text>
          <Input
            placeholder="Ex: 120.00"
            value={formData.value}
            onChangeText={(text) => setFormData({ ...formData, value: text })}
            keyboardType="numeric"
            className="w-full"
          />
        </View>

        <View className="flex-row space-x-2">
          <Button
            onPress={handleSaveExpense}
            className="flex-1 mr-2"
          >
            <Text className="text-white font-medium">
              {editingExpense ? 'Atualizar' : 'Salvar'}
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

