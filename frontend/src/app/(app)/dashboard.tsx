import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
<<<<<<< HEAD
import { useAuth } from '@/lib';
=======
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

type PeriodFilter = 'hoje' | 'ontem' | 'semana' | 'mes';

export default function Dashboard() {
<<<<<<< HEAD
  const { user } = useAuth();
  const userName = user?.nome || 'Usuário';
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('mes');
=======
return (
<View className={`flex-1 bg-gray-900`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="mb-6">
<Text className="text-3xl font-extrabold text-white mb-1">Olá, motorista</Text>
<Text className="text-slate-300">Painel com métricas rápidas e ações</Text>
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  // Mock data - substituir por dados reais da API
  const dashboardData = {
    financeiro: {
      faturamentoTotal: 4340.00,
      despesasTotais: 1890.00,
      lucroLiquido: 2450.00,
      variacao: {
        faturamento: 22,
        despesas: 8,
        lucro: 15
      }
    },
    operacional: {
      totalJornadas: 18,
      diasTrabalhados: 22,
      horasTrabalhadas: 176,
      mediaHorasDia: 8.0,
      distanciaTotal: 3240
    },
    estrategico: {
      valorPorKm: 1.34,
      consumoMedio: 11.8,
      custoPorKm: 0.58,
      ticketMedio: 24.11,
      abastecimentos: 23
    },
    melhoresDias: [
      { dia: 'Sexta-feira', valor: 312.50, jornadas: 2 },
      { dia: 'Sábado', valor: 287.80, jornadas: 2 },
      { dia: 'Quinta-feira', valor: 265.30, jornadas: 1 }
    ]
  };

<<<<<<< HEAD
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
=======
<View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<View className={`bg-gray-800 rounded-lg p-5 border border-slate-700 shadow-sm`}>
<Text className="text-green-400 font-semibold text-sm">Lucro Líquido</Text>
<Text className="text-3xl font-bold text-white mt-2">R$ 2.450</Text>
<Text className="text-green-300 text-xs mt-1">+15% este mês</Text>
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const getPeriodLabel = (period: PeriodFilter) => {
    const labels = {
      hoje: 'Hoje',
      ontem: 'Ontem',
      semana: 'Esta Semana',
      mes: 'Este Mês'
    };
    return labels[period];
  };

<<<<<<< HEAD
  const periods: { key: PeriodFilter; label: string }[] = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'ontem', label: 'Ontem' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' }
  ];
=======
<View className={`bg-gray-800 rounded-lg p-5 border border-slate-700 shadow-sm`}>
<Text className="text-red-400 font-semibold text-sm">Despesas Totais</Text>
<Text className="text-3xl font-bold text-white mt-2">R$ 1.890</Text>
<Text className="text-red-300 text-xs mt-1">+8% este mês</Text>
</View>
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

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

<<<<<<< HEAD
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
              <Pressable className="bg-slate-800 px-3 py-1.5 rounded-lg">
                <Text className="text-slate-300 text-xs">Ver detalhes</Text>
              </Pressable>
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
                  value={formatCurrency(dashboardData.estrategico.valorPorKm)}
                  subtext="receita/km"
                  color="green"
                />
                <MetricCard
                  label="Custo por KM"
                  value={formatCurrency(dashboardData.estrategico.custoPorKm)}
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
                  value={formatCurrency(dashboardData.estrategico.ticketMedio)}
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
                      {formatCurrency(dia.valor)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Ações Rápidas */}
          <View>
            <Text className="text-xl font-bold text-white mb-4">
              ⚡ Ações Rápidas
            </Text>
            
            <View className="flex-row gap-3">
              <Pressable className="flex-1 bg-blue-600 rounded-xl p-4 active:bg-blue-700">
                <Text className="text-white font-semibold text-center">
                  Nova Jornada
                </Text>
              </Pressable>
              
              <Pressable className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 active:bg-slate-700">
                <Text className="text-white font-semibold text-center">
                  Nova Despesa
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
=======
<View className="grid grid-cols-1 md:grid-cols-4 gap-4">
{[
{ label: 'Total de Viagens', value: '47', tone: 'text-blue-300' },
{ label: 'Distância', value: '3.240 km', tone: 'text-orange-300' },
{ label: 'Consumo Médio', value: '11.8 km/l', tone: 'text-purple-300' },
{ label: 'Abastecimentos', value: '23', tone: 'text-indigo-300' },
].map((m) => (
<View key={m.label} className={`bg-gray-800 rounded-lg p-4 border border-slate-700`}>
<Text className={`text-sm font-medium ${m.tone}`}>{m.label}</Text>
<Text className="text-2xl font-bold text-white mt-2">{m.value}</Text>
</View>
))}
</View>
</ScrollView>
</View>
);
}

>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e
