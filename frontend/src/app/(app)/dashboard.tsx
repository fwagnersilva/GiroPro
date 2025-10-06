
import React from 'react';
import { ScrollView } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.nome || 'Usuário';

  return (
    <View className="flex-1 bg-slate-950">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Olá, {userName}
          </Text>
          <Text className="text-slate-300">Bem-vindo ao seu painel de controle</Text>
        </View>

        {/* Resumo Financeiro */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-4">
            Resumo Financeiro
          </Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl mr-2">
              <Text className="text-green-400 text-sm font-medium mb-1">
                Lucro Líquido
              </Text>
              <Text className="text-3xl font-bold text-white">R$ 2.450</Text>
              <Text className="text-green-500 text-xs mt-1">+15% este mês</Text>
            </View>
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl ml-2">
              <Text className="text-red-400 text-sm font-medium mb-1">
                Despesas Totais
              </Text>
              <Text className="text-3xl font-bold text-white">R$ 1.890</Text>
              <Text className="text-red-500 text-xs mt-1">+8% este mês</Text>
            </View>
          </View>
        </View>

        {/* Métricas Operacionais */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-4">
            Métricas Operacionais
          </Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl mr-2">
              <Text className="text-blue-400 text-sm font-medium mb-1">
                Total de Viagens
              </Text>
              <Text className="text-3xl font-bold text-white">47</Text>
              <Text className="text-blue-500 text-xs mt-1">+12% este mês</Text>
            </View>
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl ml-2">
              <Text className="text-orange-400 text-sm font-medium mb-1">
                Distância Total
              </Text>
              <Text className="text-3xl font-bold text-white">3.240 km</Text>
              <Text className="text-orange-500 text-xs mt-1">+18% este mês</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl mr-2">
              <Text className="text-purple-400 text-sm font-medium mb-1">
                Consumo Médio
              </Text>
              <Text className="text-3xl font-bold text-white">11.8 km/l</Text>
              <Text className="text-purple-500 text-xs mt-1">+2% este mês</Text>
            </View>
            <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl ml-2">
              <Text className="text-indigo-400 text-sm font-medium mb-1">
                Abastecimentos
              </Text>
              <Text className="text-3xl font-bold text-white">23</Text>
              <Text className="text-indigo-500 text-xs mt-1">+5% este mês</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

