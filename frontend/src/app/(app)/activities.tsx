import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

type PeriodFilter = 'hoje' | 'ontem' | 'semana' | 'mes';
type ActivityType = 'jornada' | 'despesa' | 'abastecimento' | 'manutencao';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  value?: number;
  date: string;
  time: string;
  vehicleModel?: string;
  category?: string;
}

export default function Activities() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('semana');
  const [selectedType, setSelectedType] = useState<ActivityType | 'todas'>('todas');

  // Mock data - substituir por dados reais da API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'jornada',
      title: 'Jornada Finalizada',
      description: '8.5 horas trabalhadas • 142 km rodados',
      value: 287.50,
      date: '2025-10-12',
      time: '18:30',
      vehicleModel: 'Renault Logan'
    },
    {
      id: '2',
      type: 'abastecimento',
      title: 'Abastecimento',
      description: '42 litros • Posto Shell',
      value: 231.00,
      date: '2025-10-12',
      time: '14:20',
      vehicleModel: 'Renault Logan'
    },
    {
      id: '3',
      type: 'despesa',
      title: 'Despesa Registrada',
      description: 'Lavagem completa',
      value: 50.00,
      date: '2025-10-11',
      time: '16:45',
      vehicleModel: 'Renault Logan',
      category: 'Limpeza'
    },
    {
      id: '4',
      type: 'jornada',
      title: 'Jornada Finalizada',
      description: '6.0 horas trabalhadas • 98 km rodados',
      value: 198.30,
      date: '2025-10-11',
      time: '13:15',
      vehicleModel: 'Renault Logan'
    },
    {
      id: '5',
      type: 'manutencao',
      title: 'Manutenção Realizada',
      description: 'Troca de óleo e filtros',
      value: 280.00,
      date: '2025-10-10',
      time: '10:30',
      vehicleModel: 'Renault Logan',
      category: 'Manutenção'
    },
    {
      id: '6',
      type: 'jornada',
      title: 'Jornada Finalizada',
      description: '9.0 horas trabalhadas • 156 km rodados',
      value: 312.50,
      date: '2025-10-09',
      time: '19:00',
      vehicleModel: 'Renault Logan'
    }
  ];

  const periods: { key: PeriodFilter; label: string }[] = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'ontem', label: 'Ontem' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' }
  ];

  const activityTypes: { key: ActivityType | 'todas'; label: string; icon: string }[] = [
    { key: 'todas', label: 'Todas', icon: '📋' },
    { key: 'jornada', label: 'Jornadas', icon: '🚗' },
    { key: 'despesa', label: 'Despesas', icon: '💸' },
    { key: 'abastecimento', label: 'Abastecimento', icon: '⛽' },
    { key: 'manutencao', label: 'Manutenção', icon: '🔧' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      jornada: '🚗',
      despesa: '💸',
      abastecimento: '⛽',
      manutencao: '🔧'
    };
    return icons[type];
  };

  const getActivityColor = (type: ActivityType) => {
    const colors = {
      jornada: 'bg-green-100 border-green-300',
      despesa: 'bg-red-100 border-red-300',
      abastecimento: 'bg-blue-100 border-blue-300',
      manutencao: 'bg-orange-100 border-orange-300'
    };
    return colors[type];
  };

  const getActivityValueColor = (type: ActivityType) => {
    const colors = {
      jornada: 'text-green-600',
      despesa: 'text-red-600',
      abastecimento: 'text-blue-600',
      manutencao: 'text-orange-600'
    };
    return colors[type];
  };

  const filteredActivities = activities.filter(activity => {
    if (selectedType !== 'todas' && activity.type !== selectedType) {
      return false;
    }
    // Aqui você implementaria a lógica real de filtro por período
    return true;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <FocusAwareStatusBar />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 pt-8 pb-6 mb-4">
          <Text className="text-3xl font-bold text-white mb-1">
            Atividades Recentes
          </Text>
          <Text className="text-blue-100 text-sm">
            Acompanhe todas as suas movimentações
          </Text>
        </View>

        <View className="px-4 space-y-4">
          {/* Filtro de Período */}
          <View>
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
              Período
            </Text>
            <View className="flex-row gap-2">
              {periods.map((period) => (
                <Pressable
                  key={period.key}
                  onPress={() => setSelectedPeriod(period.key)}
                  className={`flex-1 py-2.5 rounded-lg ${
                    selectedPeriod === period.key
                      ? 'bg-blue-500 shadow-sm'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      selectedPeriod === period.key
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Filtro de Tipo */}
          <View>
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
              Tipo de Atividade
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-2"
            >
              {activityTypes.map((type) => (
                <Pressable
                  key={type.key}
                  onPress={() => setSelectedType(type.key)}
                  className={`px-4 py-2.5 rounded-full flex-row items-center ${
                    selectedType === type.key
                      ? 'bg-blue-500 shadow-sm'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text className="mr-1.5">{type.icon}</Text>
                  <Text
                    className={`text-sm font-semibold ${
                      selectedType === type.key
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Lista de Atividades */}
          <View className="mt-2">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 ml-1">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'atividade' : 'atividades'}
            </Text>
            
            {filteredActivities.length > 0 ? (
              <View className="space-y-3">
                {filteredActivities.map((activity) => (
                  <Pressable
                    key={activity.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50"
                  >
                    <View className="flex-row p-4">
                      {/* Ícone */}
                      <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 border-2 ${getActivityColor(activity.type)}`}>
                        <Text className="text-2xl">
                          {getActivityIcon(activity.type)}
                        </Text>
                      </View>

                      {/* Conteúdo */}
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-1">
                          <Text className="text-base font-semibold text-gray-900 flex-1">
                            {activity.title}
                          </Text>
                          {activity.value && (
                            <Text className={`text-base font-bold ml-2 ${getActivityValueColor(activity.type)}`}>
                              {activity.type === 'jornada' ? '+' : '-'}{formatCurrency(activity.value)}
                            </Text>
                          )}
                        </View>

                        <Text className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </Text>

                        <View className="flex-row items-center">
                          <Text className="text-xs text-gray-500">
                            {formatDate(activity.date)} • {activity.time}
                          </Text>
                          {activity.vehicleModel && (
                            <>
                              <Text className="text-xs text-gray-400 mx-1.5">•</Text>
                              <Text className="text-xs text-gray-500">
                                {activity.vehicleModel}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Categoria Badge (opcional) */}
                    {activity.category && (
                      <View className="px-4 pb-3">
                        <View className="inline-flex bg-gray-100 px-2.5 py-1 rounded-full self-start">
                          <Text className="text-xs font-medium text-gray-600">
                            {activity.category}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-xl p-8 items-center">
                <Text className="text-6xl mb-4">📭</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma atividade encontrada
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Não há atividades para o período e filtros selecionados
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}