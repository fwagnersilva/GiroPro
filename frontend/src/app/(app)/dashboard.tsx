import React from 'react';
import { ScrollView } from 'react-native';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Dashboard() {
  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            GiroPro Dashboard
          </Text>
          <Text className="text-gray-600">
            Controle sua frota com inteligência e eficiência
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

        {/* Veículos da Frota */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Frota Ativa
          </Text>
          
          <View className="bg-gray-50 p-4 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">
                  Honda Civic 2020 - ABC-1234
                </Text>
                <Text className="text-gray-600 text-sm">
                  Eficiência: 12.5 km/l • Última viagem: Hoje
                </Text>
              </View>
              <View className="w-3 h-3 bg-green-500 rounded-full" />
            </View>
          </View>

          <View className="bg-gray-50 p-4 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">
                  Toyota Corolla 2019 - XYZ-5678
                </Text>
                <Text className="text-gray-600 text-sm">
                  Eficiência: 11.2 km/l • Última viagem: Ontem
                </Text>
              </View>
              <View className="w-3 h-3 bg-green-500 rounded-full" />
            </View>
          </View>

          <View className="bg-gray-50 p-4 rounded-lg">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">
                  Ford Ka 2018 - DEF-9012
                </Text>
                <Text className="text-gray-600 text-sm">
                  Eficiência: 13.1 km/l • Manutenção pendente
                </Text>
              </View>
              <View className="w-3 h-3 bg-yellow-500 rounded-full" />
            </View>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="flex-1 bg-blue-600 p-4 rounded-lg mr-2">
              <Text className="text-white font-medium text-center">
                Nova Viagem
              </Text>
            </View>
            <View className="flex-1 bg-green-600 p-4 rounded-lg ml-2">
              <Text className="text-white font-medium text-center">
                Registrar Abastecimento
              </Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <View className="flex-1 bg-orange-600 p-4 rounded-lg mr-2">
              <Text className="text-white font-medium text-center">
                Adicionar Despesa
              </Text>
            </View>
            <View className="flex-1 bg-purple-600 p-4 rounded-lg ml-2">
              <Text className="text-white font-medium text-center">
                Relatórios
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
