import React, { useState } from 'react';
import { ScrollView, Alert, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
import { Ionicons } from '@expo/vector-icons';
=======
import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface Expense {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  date: string;
  description: string;
  value: string;
  category: string;
}

const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    'Manutenção': 'build',
    'Limpeza': 'water',
    'Combustível': 'flame',
    'Seguro': 'shield-checkmark',
    'Documentação': 'document-text',
    'Reparos': 'construct',
    'Outros': 'help-circle',
  };
  return iconMap[category] || 'help-circle';
};

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    'Manutenção': 'bg-orange-600',
    'Limpeza': 'bg-blue-600',
    'Combustível': 'bg-yellow-600',
    'Seguro': 'bg-red-600',
    'Documentação': 'bg-purple-600',
    'Reparos': 'bg-red-700',
    'Outros': 'bg-gray-600',
  };
  return colorMap[category] || 'bg-gray-600';
};

export default function Expenses() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [vehicles] = useState([
    { id: '1', model: 'Honda Civic', placa: 'ABC-1234' },
    { id: '2', model: 'Toyota Corolla', placa: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', placa: 'DEF-9012' },
  ]);

<<<<<<< HEAD
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
    {
      id: '4',
      vehicleId: '3',
      vehicleModel: 'Ford Ka',
      date: '2025-09-10',
      description: 'Renovação do seguro',
      value: '450.00',
      category: 'Seguro',
    },
  ]);
=======
return (
<View className={`flex-1 bg-gray-900`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="flex-row justify-between items-center mb-6">
<View>
<Text className="text-3xl font-bold text-white">Despesas</Text>
<Text className="text-slate-300">Registre gastos de forma organizada</Text>
</View>
<Button onPress={() => router.push('/edit-expense')} label="+ Adicionar" className="bg-blue-600" />
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

<<<<<<< HEAD
  const totalExpenses = expenses.reduce((acc, expense) => {
    return acc + parseFloat(expense.value);
  }, 0);
=======
<View className={`bg-gray-800 rounded-lg p-4 mb-6 border border-slate-700`}>
<Text className="text-red-300 font-semibold">Total de Despesas</Text>
<Text className="text-2xl font-bold text-white mt-2">R$ 0,00</Text>
<Text className="text-red-400 text-sm mt-1">0 despesa(s)</Text>
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.value);
    return acc;
  }, {} as Record<string, number>);

<<<<<<< HEAD
  const handleAddExpense = () => {
    router.push('/edit-expense');
  };

  const handleEditExpense = (expense: Expense) => {
    router.push(`/edit-expense?id=${expense.id}`);
  };

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'Excluir Despesa',
      `Tem certeza que deseja excluir "${expense.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setExpenses(expenses.filter((e) => e.id !== expense.id));
            Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
          },
        },
      ]
    );
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0066CC" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-red-600 to-red-700 px-4 pt-6 pb-8 rounded-b-3xl">
          <Text className="text-white text-3xl font-bold mb-1">
            Despesas
          </Text>
          <Text className="text-red-100 mb-6">Registre gastos dos seus veículos</Text>

          {/* Main Stats */}
          <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-4`}>
              <Text className="text-red-100 text-xs font-medium mb-1">Total</Text>
              <Text className="text-white text-2xl font-bold">
                R$ {totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-4`}>
              <Text className="text-red-100 text-xs font-medium mb-1">Registros</Text>
              <Text className="text-white text-2xl font-bold">
                {expenses.length}
              </Text>
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-4`}>
              <Text className="text-red-100 text-xs font-medium mb-1">Média</Text>
              <Text className="text-white text-2xl font-bold">
                R$ {(totalExpenses / (expenses.length || 1)).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pt-6 pb-8">
          {/* Add Button */}
          <Button
            onPress={handleAddExpense}
            className="bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-xl mb-6 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={22} color="white" />
              <Text className="text-white font-bold ml-2">Nova Despesa</Text>
            </View>
          </Button>

          {/* Categories Summary */}
          {Object.keys(expensesByCategory).length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-lg bg-purple-100 items-center justify-center mr-2">
                  <Ionicons name="pie-chart" size={18} color="#7C3AED" />
                </View>
                <Text className="text-lg font-bold text-gray-900">Por Categoria</Text>
              </View>

              <View className={`flex-row flex-wrap gap-2`}>
                {Object.entries(expensesByCategory).map(([category, total]) => {
                  const categoryColor = getCategoryColor(category);
                  return (
                    <View
                      key={category}
                      className={`flex-1 ${isSmallScreen ? 'w-[48%]' : 'w-[30%]'} ${categoryColor} rounded-xl p-3 shadow-sm`}
                    >
                      <Text className="text-white text-xs font-medium mb-1">
                        {category}
                      </Text>
                      <Text className="text-white text-lg font-bold">
                        R$ {total.toFixed(2)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Expenses List */}
          <View>
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-lg bg-red-100 items-center justify-center mr-2">
                <Ionicons name="receipt" size={18} color="#DC2626" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                Despesas Registradas
              </Text>
            </View>

            {expenses.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center border border-gray-100 shadow-sm">
                <View className="bg-red-100 rounded-full w-16 h-16 items-center justify-center mb-4">
                  <Ionicons name="receipt-outline" size={32} color="#DC2626" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 text-center">
                  Nenhuma despesa registrada
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  Adicione sua primeira despesa para começar
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {sortedExpenses.map((expense) => {
                  const categoryIcon = getCategoryIcon(expense.category);
                  const categoryColor = getCategoryColor(expense.category);

                  return (
                    <View
                      key={expense.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                    >
                      {/* Header */}
                      <View className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${categoryColor}`}>
                            <Ionicons name={categoryIcon as any} size={20} color="white" />
                          </View>
                          <View className="flex-1">
                            <Text className="font-bold text-gray-900">
                              {expense.description}
                            </Text>
                            <Text className="text-xs text-gray-600 mt-1">
                              {expense.date}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-red-100 rounded-lg px-3 py-1">
                          <Text className="text-red-600 font-bold text-sm">
                            R$ {expense.value}
                          </Text>
                        </View>
                      </View>

                      {/* Details */}
                      <View className="px-4 py-4">
                        <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''} mb-3`}>
                          <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                            <Text className="text-xs text-gray-500 font-medium mb-1">
                              Veículo
                            </Text>
                            <Text className="text-sm font-bold text-gray-900">
                              {expense.vehicleModel}
                            </Text>
                          </View>

                          <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                            <Text className="text-xs text-gray-500 font-medium mb-1">
                              Categoria
                            </Text>
                            <View className="flex-row items-center">
                              <View className={`w-5 h-5 rounded mr-1 ${categoryColor}`} />
                              <Text className="text-sm font-bold text-gray-900">
                                {expense.category}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Actions */}
                        <View className="flex-row gap-2 pt-3 border-t border-gray-100">
                          <Button
                            onPress={() => handleEditExpense(expense)}
                            className="flex-1 bg-blue-100 py-2 rounded-lg"
                          >
                            <View className="flex-row items-center justify-center">
                              <Ionicons name="pencil" size={16} color="#0066CC" />
                              <Text className="text-blue-600 font-semibold ml-1">Editar</Text>
                            </View>
                          </Button>
                          <Button
                            onPress={() => handleDeleteExpense(expense)}
                            className="flex-1 bg-red-100 py-2 rounded-lg"
                          >
                            <View className="flex-row items-center justify-center">
                              <Ionicons name="trash" size={16} color="#DC2626" />
                              <Text className="text-red-600 font-semibold ml-1">Excluir</Text>
                            </View>
                          </Button>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
=======
<View>
<Text className="text-2xl font-bold text-white mb-4">Despesas Registradas</Text>
{expenses.length === 0 ? (
<View className={`bg-gray-800 rounded-lg p-8 items-center border border-slate-700`}>
<Text className="text-slate-300 text-center">Nenhuma despesa registrada.</Text>
</View>
) : null}
</View>
</ScrollView>
</View>
);
}

>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e
