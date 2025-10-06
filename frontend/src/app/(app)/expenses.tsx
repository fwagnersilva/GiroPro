import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';

interface Expense {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  date: string;
  description: string;
  value: string;
  category: string;
}

export default function Expenses() {
  const router = useRouter();
  // Mock data for vehicles
  const [vehicles] = useState([
    { id: '1', model: 'Honda Civic', placa: 'ABC-1234' },
    { id: '2', model: 'Toyota Corolla', placa: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', placa: 'DEF-9012' },
  ]);

  // Mock data for expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      vehicleId: '1',
      vehicleModel: 'Honda Civic',
      date: '2025-09-25',
      description: 'Troca de óleo e filtro',
      value: '120.00',
      category: 'Manutenção',
    },
    {
      id: '2',
      vehicleId: '2',
      vehicleModel: 'Toyota Corolla',
      date: '2025-09-20',
      description: 'Alinhamento e balanceamento',
      value: '80.00',
      category: 'Manutenção',
    },
    {
      id: '3',
      vehicleId: '1',
      vehicleModel: 'Honda Civic',
      date: '2025-09-15',
      description: 'Lavagem completa',
      value: '25.00',
      category: 'Limpeza',
    },
  ]);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((acc, expense) => {
    return acc + parseFloat(expense.value);
  }, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.value);
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = () => {
    router.push('/edit-expense');
  };

  const handleEditExpense = (expense: Expense) => {
    router.push(`/edit-expense?id=${expense.id}`);
  };

  const handleDeleteExpense = (expenseId: string) => {
    // TODO: Implementar verificação no backend para saber se há registros associados
    // Por enquanto, vamos simular que não há registros associados para permitir a exclusão.
    const hasAssociatedRecords = false; // Placeholder

    if (hasAssociatedRecords) {
      Alert.alert(
        'Não é possível excluir',
        'Esta despesa possui registros associados (jornadas, abastecimentos). Exclua-os primeiro.',
      );
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setExpenses(expenses.filter((e) => e.id !== expenseId));
            Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Minhas Despesas
            </Text>
            <Text className="text-gray-600">
              Registre gastos dos seus veículos
            </Text>
          </View>
          <Button onPress={handleAddExpense} className="px-4 py-2">
            <Text className="text-white font-medium">+ Adicionar</Text>
          </Button>
        </View>

        {/* Summary */}
        <View className="mb-6 p-4 bg-red-50 rounded-lg">
          <Text className="text-red-800 font-semibold text-lg mb-2">
            Total de Despesas
          </Text>
          <Text className="text-red-900 text-2xl font-bold">
            R$ {totalExpenses.toFixed(2)}
          </Text>
          <Text className="text-red-600 text-sm mt-1">
            {expenses.length} despesa(s) registrada(s)
          </Text>
        </View>

        {/* Expenses by Category */}
        {Object.keys(expensesByCategory).length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Despesas por Categoria
            </Text>
            <View className="flex-row flex-wrap">
              {Object.entries(expensesByCategory).map(([category, total]) => (
                <View
                  key={category}
                  className="bg-blue-50 p-3 rounded-lg mr-2 mb-2"
                >
                  <Text className="text-blue-600 text-sm font-medium">
                    {category}
                  </Text>
                  <Text className="text-blue-900 font-bold">
                    R$ {total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Expenses List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Despesas Registradas ({expenses.length})
          </Text>

          {expenses.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-center">
                Nenhuma despesa registrada.{'\n'}
                Adicione sua primeira despesa para começar!
              </Text>
            </View>
          ) : (
            expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <View
                  key={expense.id}
                  className="bg-gray-50 p-4 rounded-lg mb-3"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-lg mb-1">
                        {expense.description}
                      </Text>
                      <Text className="text-gray-600 mb-1">
                        {expense.vehicleModel} • {expense.date}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                          <Text className="text-blue-800 text-xs font-medium">
                            {expense.category}
                          </Text>
                        </View>
                        <Text className="text-red-600 font-bold">
                          R$ {expense.value}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row space-x-2">
                      <Button
                        onPress={() => handleEditExpense(expense)}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Text className="text-blue-600 text-sm">Editar</Text>
                      </Button>
                      <Button
                        onPress={() => handleDeleteExpense(expense.id)}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Text className="text-red-600 text-sm">Excluir</Text>
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