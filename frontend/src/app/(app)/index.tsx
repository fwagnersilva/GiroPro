import React from 'react';
import { ScrollView } from 'react-native';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.nome || 'Usuário';

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {userName}
          </Text>
        </View>

        {/* Resumo Financeiro */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Resumo Financeiro
          </Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-green-50 p-4 rounded-lg mr-2">
              <Text className="text-green-600 text-sm font-medium mb-1">
                Lucro Líquido
              </Text>
              <Text className="text-2xl font-bold text-green-900">R$ 2.450</Text>
              <Text className="text-green-600 text-xs">+15% este mês</Text>
            </View>
            <View className="flex-1 bg-red-50 p-4 rounded-lg ml-2">
              <Text className="text-red-600 text-sm font-medium mb-1">
                Despesas Totais
              </Text>
              <Text className="text-2xl font-bold text-red-900">R$ 1.890</Text>
              <Text className="text-red-600 text-xs">+8% este mês</Text>
            </View>
          </View>
        </View>

        {/* Métricas Operacionais */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Métricas Operacionais
          </Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-blue-50 p-4 rounded-lg mr-2">
              <Text className="text-blue-600 text-sm font-medium mb-1">
                Total de Viagens
              </Text>
              <Text className="text-2xl font-bold text-blue-900">47</Text>
              <Text className="text-blue-600 text-xs">+12% este mês</Text>
            </View>
            <View className="flex-1 bg-orange-50 p-4 rounded-lg ml-2">
              <Text className="text-orange-600 text-sm font-medium mb-1">
                Distância Total
              </Text>
              <Text className="text-2xl font-bold text-orange-900">3,240 km</Text>
              <Text className="text-orange-600 text-xs">+18% este mês</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <View className="flex-1 bg-purple-50 p-4 rounded-lg mr-2">
              <Text className="text-purple-600 text-sm font-medium mb-1">
                Consumo Médio
              </Text>
              <Text className="text-2xl font-bold text-purple-900">11.8 km/l</Text>
              <Text className="text-purple-600 text-xs">+2% este mês</Text>
            </View>
            <View className="flex-1 bg-indigo-50 p-4 rounded-lg ml-2">
              <Text className="text-indigo-600 text-sm font-medium mb-1">
                Abastecimentos
              </Text>
              <Text className="text-2xl font-bold text-indigo-900">23</Text>
              <Text className="text-indigo-600 text-xs">+5% este mês</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}