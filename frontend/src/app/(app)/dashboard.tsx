import React, { useState } from 'react';
import { ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { useDashboard } from '@/lib/hooks/useDashboard';

type PeriodFilter = 'hoje' | 'ontem' | 'semana' | 'mes';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.nome || 'Usuário';
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('mes');

  // Buscar dados reais do dashboard
  const { data: dashboardData, isLoading, isError, error } = useDashboard({ periodo: selectedPeriod });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const getPeriodLabel = (period: PeriodFilter) => {
    const labels = {
      hoje: 'Hoje',
      ontem: 'Ontem',
      semana: 'Esta Semana',
      mes: 'Este Mês'
    };
    return labels[period];
  };

  const periods: { key: PeriodFilter; label: string }[] = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'ontem', label: 'Ontem' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' }
  ];

  const MetricCard = ({ 
    label, 
    value, 
    subtext, 
    color = 'blue',
    size = 'normal' 
  }: { 
    label: string; 
    value: string; 
    subtext?: string; 
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'cyan';
    size?: 'normal' | 'large';
  }) => {
    const colorClasses = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      red: 'text-red-400',
      orange: 'text-orange-400',
      purple: 'text-purple-400',
      indigo: 'text-indigo-400',
      cyan: 'text-cyan-400'
    };

    const subtextColorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      red: 'text-red-500',
      orange: 'text-orange-500',
      purple: 'text-purple-500',
      indigo: 'text-indigo-500',
      cyan: 'text-cyan-500'
    };

    return (
      <View className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl">
        <Text className={`${colorClasses[color]} text-xs font-semibold mb-2 uppercase tracking-wide`}>
          {label}
        </Text>
        <Text className={`font-bold text-white ${size === 'large' ? 'text-3xl' : 'text-2xl'}`}>
          {value}
        </Text>
        {subtext && (
          <Text className={`${subtextColorClasses[color]} text-xs mt-1 font-medium`}>
            {subtext}
          </Text>
        )}
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <FocusAwareStatusBar />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4">Carregando dashboard...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-4">
        <FocusAwareStatusBar />
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-white text-xl font-bold mb-2">Erro ao carregar dados</Text>
        <Text className="text-slate-400 text-center">
          {error instanceof Error ? error.message : 'Tente novamente mais tarde'}
        </Text>
      </View>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-4">
        <FocusAwareStatusBar />
        <Text className="text-6xl mb-4">📊</Text>
        <Text className="text-white text-xl font-bold mb-2">Nenhum dado disponível</Text>
        <Text className="text-slate-400 text-center">
          Comece registrando suas jornadas e despesas
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <FocusAwareStatusBar />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4 bg-gradient-to-b from-slate-900 to-slate-950">
          <Text className="text-3xl font-bold text-white mb-1">
            Olá, {userName}
          </Text>
          <Text className="text-slate-400 text-sm">Dashboard do motorista • {getPeriodLabel(selectedPeriod)}</Text>
        </View>

        {/* Filtro de Período */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row gap-2">
            {periods.map((period) => (
              <Pressable
                key={period.key}
                onPress={() => setSelectedPeriod(period.key)}
                className={`flex-1 py-2.5 rounded-lg ${
                  selectedPeriod === period.key
                    ? 'bg-blue-600'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    selectedPeriod === period.key
                      ? 'text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="px-4 space-y-6">
          {/* Resumo Financeiro */}
          <View>
            <View className="flex-row items-center justify-between mb-4 mt-2">
              <Text className="text-xl font-bold text-white">
                💰 Resumo Financeiro
              </Text>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row gap-3">
                <MetricCard
                  label="Faturamento Total"
                  value={formatCurrency(dashboardData.financeiro.faturamentoTotal)}
                  subtext={`+${dashboardData.financeiro.variacao.faturamento}% este mês`}
                  color="cyan"
                  size="large"
                />
              </View>
              
              <View className="flex-row gap-3">
                <MetricCard
                  label="Lucro Líquido"
                  value={formatCurrency(dashboardData.financeiro.lucroLiquido)}
                  subtext={`+${dashboardData.financeiro.variacao.lucro}% este mês`}
                  color="green"
                />
                <MetricCard
                  label="Despesas Totais"
                  value={formatCurrency(dashboardData.financeiro.despesasTotais)}
                  subtext={`+${dashboardData.financeiro.variacao.despesas}% este mês`}
                  color="red"
                />
              </View>
            </View>
          </View>

          {/* Métricas Operacionais */}
          <View>
            <Text className="text-xl font-bold text-white mb-4">
              📊 Métricas Operacionais
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row gap-3">
                <MetricCard
                  label="Total de Jornadas"
                  value={dashboardData.operacional.totalJornadas.toString()}
                  subtext="neste mês"
                  color="blue"
                />
                <MetricCard
                  label="Dias Trabalhados"
                  value={dashboardData.operacional.diasTrabalhados.toString()}
                  subtext="de 30 dias"
                  color="indigo"
                />
              </View>
              
              <View className="flex-row gap-3">
                <MetricCard
                  label="Horas Trabalhadas"
                  value={`${dashboardData.operacional.horasTrabalhadas}h`}
                  subtext="no total"
                  color="purple"
                />
                <MetricCard
                  label="Média Horas/Dia"
                  value={`${dashboardData.operacional.mediaHorasDia.toFixed(1)}h`}
                  subtext="por dia"
                  color="orange"
                />
              </View>
              
              <View className="flex-row gap-3">
                <MetricCard
                  label="Distância Total"
                  value={`${dashboardData.operacional.distanciaTotal.toLocaleString('pt-BR')} km`}
                  subtext="rodados"
                  color="cyan"
                />
              </View>
            </View>
          </View>

          {/* Métricas Estratégicas */}
          <View>
            <Text className="text-xl font-bold text-white mb-4">
              🎯 Métricas Estratégicas
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row gap-3">
                <MetricCard
                  label="Valor por KM"
                  value={formatCurrency(dashboardData.estrategico.valorPorKm * 100)}
                  subtext="receita/km"
                  color="green"
                />
                <MetricCard
                  label="Custo por KM"
                  value={formatCurrency(dashboardData.estrategico.custoPorKm * 100)}
                  subtext="despesa/km"
                  color="red"
                />
              </View>
              
              <View className="flex-row gap-3">
                <MetricCard
                  label="Consumo Médio"
                  value={`${dashboardData.estrategico.consumoMedio} km/l`}
                  subtext="eficiência"
                  color="blue"
                />
                <MetricCard
                  label="Ticket Médio"
                  value={formatCurrency(dashboardData.estrategico.ticketMedio * 100)}
                  subtext="por corrida"
                  color="purple"
                />
              </View>
              
              <View className="flex-row gap-3">
                <MetricCard
                  label="Abastecimentos"
                  value={dashboardData.estrategico.abastecimentos.toString()}
                  subtext="no mês"
                  color="orange"
                />
              </View>
            </View>
          </View>

          {/* Top 3 Melhores Dias */}
          {dashboardData.melhoresDias && dashboardData.melhoresDias.length > 0 && (
            <View>
              <Text className="text-xl font-bold text-white mb-4">
                🏆 Top 3 Melhores Dias
              </Text>
              
              <View className="space-y-3">
                {dashboardData.melhoresDias.map((dia, index) => (
                  <View 
                    key={index}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex-row items-center"
                  >
                    <View className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 items-center justify-center mr-4">
                      <Text className="text-slate-900 font-bold text-lg">
                        {index + 1}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-base">
                        {dia.dia}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5">
                        {dia.jornadas} {dia.jornadas === 1 ? 'jornada' : 'jornadas'}
                      </Text>
                    </View>
                    
                    <View className="items-end">
                      <Text className="text-green-400 font-bold text-xl">
                        {formatCurrency(dia.valor * 100)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}