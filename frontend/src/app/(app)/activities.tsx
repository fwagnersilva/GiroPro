import React, { useState } from 'react';
import { ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useJourneys } from '@/lib/hooks/useJourneys';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useFuelings } from '@/lib/hooks/useFuelings';

type PeriodFilter = 'hoje' | 'ontem' | 'semana' | 'mes';
type ActivityType = 'jornada' | 'despesa' | 'abastecimento' | 'todas';

interface Activity {
  id: string;
  type: Exclude<ActivityType, 'todas'>;
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
  const [selectedType, setSelectedType] = useState<ActivityType>('todas');
  const [refreshing, setRefreshing] = useState(false);

  // Buscar dados reais
  const { data: journeys, isLoading: loadingJourneys, refetch: refetchJourneys } = useJourneys({ periodo: selectedPeriod });
  const { data: expenses, isLoading: loadingExpenses, refetch: refetchExpenses } = useExpenses({ periodo: selectedPeriod });
  const { data: fuelings, isLoading: loadingFuelings, refetch: refetchFuelings } = useFuelings({ periodo: selectedPeriod });

  const isLoading = loadingJourneys || loadingExpenses || loadingFuelings;

  const periods: { key: PeriodFilter; label: string }[] = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'ontem', label: 'Ontem' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' }
  ];

  const activityTypes: { key: ActivityType; label: string; icon: string }[] = [
    { key: 'todas', label: 'Todas', icon: '📋' },
    { key: 'jornada', label: 'Jornadas', icon: '🚗' },
    { key: 'despesa', label: 'Despesas', icon: '💸' },
    { key: 'abastecimento', label: 'Abastecimento', icon: '⛽' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityIcon = (type: Exclude<ActivityType, 'todas'>) => {
    const icons = {
      jornada: '🚗',
      despesa: '💸',
      abastecimento: '⛽'
    };
    return icons[type];
  };

  const getActivityColor = (type: Exclude<ActivityType, 'todas'>) => {
    const colors = {
      jornada: 'bg-green-100 border-green-300',
      despesa: 'bg-red-100 border-red-300',
      abastecimento: 'bg-blue-100 border-blue-300'
    };
    return colors[type];
  };

  const getActivityValueColor = (type: Exclude<ActivityType, 'todas'>) => {
    const colors = {
      jornada: 'text-green-600',
      despesa: 'text-red-600',
      abastecimento: 'text-blue-600'
    };
    return colors[type];
  };

  // Converter dados da API em atividades
  const activities: Activity[] = [];

  // Adicionar jornadas
  if (journeys) {
    journeys.forEach(journey => {
      activities.push({
        id: journey.id,
        type: 'jornada',
        title: 'Jornada Finalizada',
        description: `${journey.duracaoHoras || 0} horas trabalhadas • ${journey.distanciaTotal || 0} km rodados`,
        value: journey.valorTotal,
        date: journey.dataFim || journey.dataInicio,
        time: formatTime(journey.dataFim || journey.dataInicio),
        vehicleModel: journey.vehicleModel
      });
    });
  }

  // Adicionar despesas
  if (expenses) {
    expenses.forEach(expense => {
      activities.push({
        id: expense.id,
        type: 'despesa',
        title: 'Despesa Registrada',
        description: expense.description,
        value: expense.value,
        date: expense.date,
        time: formatTime(expense.createdAt || expense.date),
        vehicleModel: expense.vehicleModel,
        category: expense.category
      });
    });
  }

  // Adicionar abastecimentos
  if (fuelings) {
    fuelings.forEach(fueling => {
      activities.push({
        id: fueling.id,
        type: 'abastecimento',
        title: 'Abastecimento',
        description: `${fueling.liters} litros • ${fueling.posto || 'Posto não informado'}`,
        value: fueling.totalValue,
        date: fueling.date,
        time: formatTime(fueling.createdAt || fueling.date),
        vehicleModel: fueling.vehicleModel
      });
    });
  }

  // Ordenar por data (mais recentes primeiro)
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtrar por tipo
  const filteredActivities = selectedType === 'todas' 
    ? activities 
    : activities.filter(activity => activity.type === selectedType);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchJourneys(),
      refetchExpenses(),
      refetchFuelings()
    ]);
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FocusAwareStatusBar />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            
            {isLoading ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-500 mt-4">Carregando atividades...</Text>
              </View>
            ) : filteredActivities.length > 0 ? (
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