import React, { useState } from 'react';
import { ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface MetricCard {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  change: string;
  color: string;
  bgColor: string;
  trend: 'up' | 'down';
}

const MetricCardComponent: React.FC<MetricCard> = ({
  icon,
  label,
  value,
  unit,
  change,
  color,
  bgColor,
  trend,
}) => (
  <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100`}>
    <View className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${bgColor}`}>
      <Ionicons name={icon as any} size={24} color="white" />
    </View>
    <Text className="text-xs text-gray-500 font-medium mb-2 uppercase">
      {label}
    </Text>
    <View className="flex-row items-end justify-between">
      <View>
        <Text className="text-2xl font-bold text-gray-900">
          {value}
        </Text>
        {unit && (
          <Text className="text-xs text-gray-600 font-medium">
            {unit}
          </Text>
        )}
      </View>
      <View className={`flex-row items-center px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
        <Ionicons
          name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
          size={14}
          color={trend === 'up' ? '#16A34A' : '#DC2626'}
        />
        <Text className={`text-xs font-bold ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </Text>
      </View>
    </View>
  </View>
);

const SectionHeader: React.FC<{ icon: string; title: string; color: string }> = ({
  icon,
  title,
  color,
}) => (
  <View className="flex-row items-center mb-4 px-1">
    <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${color}`}>
      <Ionicons name={icon as any} size={18} color="white" />
    </View>
    <Text className="text-xl font-bold text-gray-900">{title}</Text>
  </View>
);

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.nome || 'Usuário';
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const metrics = {
    financial: [
      {
        icon: 'trending-up',
        label: 'Lucro Líquido',
        value: '2.450',
        unit: 'R$',
        change: '+15%',
        color: 'text-green-600',
        bgColor: 'bg-green-600',
        trend: 'up' as const,
      },
      {
        icon: 'cash-outline',
        label: 'Faturamento',
        value: '5.340',
        unit: 'R$',
        change: '+22%',
        color: 'text-blue-600',
        bgColor: 'bg-blue-600',
        trend: 'up' as const,
      },
      {
        icon: 'wallet-outline',
        label: 'Despesas',
        value: '1.890',
        unit: 'R$',
        change: '+8%',
        color: 'text-red-600',
        bgColor: 'bg-red-600',
        trend: 'up' as const,
      },
      {
        icon: 'calculator-outline',
        label: 'Média/Viagem',
        value: '113.6',
        unit: 'R$',
        change: '+5%',
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        trend: 'up' as const,
      },
    ],
    operational: [
      {
        icon: 'car-outline',
        label: 'Total de Viagens',
        value: '47',
        change: '+12%',
        color: 'text-blue-600',
        bgColor: 'bg-blue-600',
        trend: 'up' as const,
      },
      {
        icon: 'location-outline',
        label: 'Distância Total',
        value: '3.240',
        unit: 'km',
        change: '+18%',
        color: 'text-orange-600',
        bgColor: 'bg-orange-600',
        trend: 'up' as const,
      },
      {
        icon: 'speedometer-outline',
        label: 'Consumo Médio',
        value: '11.8',
        unit: 'km/l',
        change: '+2%',
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        trend: 'up' as const,
      },
      {
        icon: 'water-outline',
        label: 'Abastecimentos',
        value: '23',
        change: '+5%',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-600',
        trend: 'up' as const,
      },
    ],
  };

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
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-blue-100 text-sm font-medium">Bem-vindo(a)</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                Olá, {userName.split(' ')[0]}!
              </Text>
            </View>
            <View className="w-14 h-14 rounded-full bg-white bg-opacity-20 items-center justify-center border-2 border-white">
              <Ionicons name="person" size={28} color="white" />
            </View>
          </View>

          {/* Quick Stats */}
          <View className="bg-white bg-opacity-15 rounded-xl px-3 py-2 flex-row justify-around">
            <View className="items-center">
              <Text className="text-blue-100 text-xs font-medium">Este Mês</Text>
              <Text className="text-white text-lg font-bold mt-1">47</Text>
              <Text className="text-blue-100 text-xs">viagens</Text>
            </View>
            <View className="w-px bg-white bg-opacity-30" />
            <View className="items-center">
              <Text className="text-blue-100 text-xs font-medium">Este Mês</Text>
              <Text className="text-white text-lg font-bold mt-1">R$ 2.450</Text>
              <Text className="text-blue-100 text-xs">lucro</Text>
            </View>
            <View className="w-px bg-white bg-opacity-30" />
            <View className="items-center">
              <Text className="text-blue-100 text-xs font-medium">Média</Text>
              <Text className="text-white text-lg font-bold mt-1">11.8</Text>
              <Text className="text-blue-100 text-xs">km/l</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pt-6 pb-8">
          {/* Financial Summary */}
          <SectionHeader
            icon="trending-up"
            title="Resumo Financeiro"
            color="bg-green-600"
          />
          <View className={`flex-row flex-wrap`}>
            {metrics.financial.map((metric, index) => (
              <View key={index} className={isSmallScreen ? 'w-[48%] pr-1' : 'w-[48%] pr-2'}>
                <MetricCardComponent {...metric} />
              </View>
            ))}
          </View>

          {/* Operational Metrics */}
          <View className="mt-4">
            <SectionHeader
              icon="speedometer"
              title="Métricas Operacionais"
              color="bg-blue-600"
            />
            <View className={`flex-row flex-wrap`}>
              {metrics.operational.map((metric, index) => (
                <View key={index} className={isSmallScreen ? 'w-[48%] pr-1' : 'w-[48%] pr-2'}>
                  <MetricCardComponent {...metric} />
                </View>
              ))}
            </View>
          </View>

          {/* Performance Overview */}
          <View className="mt-6">
            <SectionHeader
              icon="analytics"
              title="Desempenho"
              color="bg-purple-600"
            />
            <View className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
              <View className="flex-row items-center mb-4">
                <Ionicons name="bar-chart" size={24} color="#7C3AED" />
                <Text className="text-lg font-bold text-gray-900 ml-2">
                  Performance do Mês
                </Text>
              </View>

              <View className="space-y-3">
                {[
                  { label: 'Eficiência', value: 85, color: 'bg-green-600' },
                  { label: 'Rentabilidade', value: 72, color: 'bg-blue-600' },
                  { label: 'Consistência', value: 91, color: 'bg-purple-600' },
                ].map((item, index) => (
                  <View key={index}>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-sm font-semibold text-gray-700">
                        {item.label}
                      </Text>
                      <Text className="text-sm font-bold text-gray-900">
                        {item.value}%
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View className="mt-6">
            <SectionHeader
              icon="bulb"
              title="Dicas"
              color="bg-yellow-600"
            />
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Text className="text-sm text-yellow-800 leading-5">
                💡 Você está tendo um ótimo desempenho! Continue mantendo uma boa consistência nas viagens e considere revisar suas despesas para aumentar ainda mais a rentabilidade.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}