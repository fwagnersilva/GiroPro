import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

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

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    description: '',
    value: '',
    category: 'Manutenção',
  });

  const categories = [
    'Manutenção',
    'Combustível',
    'Seguro',
    'IPVA',
    'Multas',
    'Limpeza',
    'Peças',
    'Outros',
  ];

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      value: '',
      category: 'Manutenção',
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleAddExpense = () => {
    setShowForm(true);
    resetForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      vehicleId: expense.vehicleId,
      date: expense.date,
      description: expense.description,
      value: expense.value,
      category: expense.category,
    });
    setShowForm(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
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

  const handleSaveExpense = () => {
    // Validações
    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.description ||
      !formData.value ||
      !formData.category
    ) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const valueNum = parseFloat(formData.value);
    if (isNaN(valueNum) || valueNum <= 0) {
      Alert.alert('Erro', 'Valor da despesa inválido.');
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    if (editingExpense) {
      // Editar despesa existente
      setExpenses(
        expenses.map((e) =>
          e.id === editingExpense.id
            ? {
                ...editingExpense,
                ...formData,
                vehicleModel: selectedVehicle.model,
              }
            : e
        )
      );
      Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
    } else {
      // Adicionar nova despesa
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...formData,
        vehicleModel: selectedVehicle.model,
      };
      setExpenses([...expenses, newExpense]);
      Alert.alert('Sucesso', 'Despesa adicionada com sucesso!');
    }

    resetForm();
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.value),
    0
  );

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += parseFloat(expense.value);
    return acc;
  }, {} as Record<string, number>);

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

        {/* Expense Form */}
        {showForm && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Veículo
              </Text>
              <View className="flex-row flex-wrap">
                {vehicles.map((vehicle) => (
                  <Button
                    key={vehicle.id}
                    onPress={() =>
                      setFormData({ ...formData, vehicleId: vehicle.id })
                    }
                    variant={
                      formData.vehicleId === vehicle.id ? 'default' : 'outline'
                    }
                    className="mr-2 mb-2"
                  >
                    <Text
                      className={
                        formData.vehicleId === vehicle.id
                          ? 'text-white text-sm'
                          : 'text-gray-600 text-sm'
                      }
                    >
                      {vehicle.model}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Data
              </Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Categoria
              </Text>
              <View className="flex-row flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onPress={() =>
                      setFormData({ ...formData, category: category })
                    }
                    variant={
                      formData.category === category ? 'default' : 'outline'
                    }
                    className="mr-2 mb-2"
                  >
                    <Text
                      className={
                        formData.category === category
                          ? 'text-white text-sm'
                          : 'text-gray-600 text-sm'
                      }
                    >
                      {category}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Descrição do Serviço/Gasto
              </Text>
              <Input
                placeholder="Ex: Troca de óleo, Alinhamento, Multa"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Valor Gasto (R$)
              </Text>
              <Input
                placeholder="Ex: 120.00"
                value={formData.value}
                onChangeText={(text) =>
                  setFormData({ ...formData, value: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            <View className="flex-row space-x-2">
              <Button onPress={handleSaveExpense} className="flex-1 mr-2">
                <Text className="text-white font-medium">
                  {editingExpense ? 'Atualizar' : 'Salvar'}
                </Text>
              </Button>
              <Button
                onPress={resetForm}
                variant="outline"
                className="flex-1 ml-2"
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </Button>
            </View>
          </View>
        )}

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
