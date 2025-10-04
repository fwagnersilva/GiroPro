import React from 'react';
import { ScrollView } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Dashboard() {
  const user = useAuth.use.user();
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


      </ScrollView>
    </View>
  );
}

