import React from 'react';
import { ScrollView } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { palette, rounded } from '@/theme';


export default function Dashboard() {
return (
<View className={`flex-1 ${palette.bg}`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="mb-6">
<Text className="text-3xl font-extrabold text-white mb-1">Olá, motorista</Text>
<Text className="text-slate-300">Painel com métricas rápidas e ações</Text>
</View>


<View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<View className={`${palette.surface} ${rounded} p-5 border border-slate-700 shadow-sm`}>
<Text className="text-green-400 font-semibold text-sm">Lucro Líquido</Text>
<Text className="text-3xl font-bold text-white mt-2">R$ 2.450</Text>
<Text className="text-green-300 text-xs mt-1">+15% este mês</Text>
</View>


<View className={`${palette.surface} ${rounded} p-5 border border-slate-700 shadow-sm`}>
<Text className="text-red-400 font-semibold text-sm">Despesas Totais</Text>
<Text className="text-3xl font-bold text-white mt-2">R$ 1.890</Text>
<Text className="text-red-300 text-xs mt-1">+8% este mês</Text>
</View>
</View>


<View className="grid grid-cols-1 md:grid-cols-4 gap-4">
{[
{ label: 'Total de Viagens', value: '47', tone: 'text-blue-300' },
{ label: 'Distância', value: '3.240 km', tone: 'text-orange-300' },
{ label: 'Consumo Médio', value: '11.8 km/l', tone: 'text-purple-300' },
{ label: 'Abastecimentos', value: '23', tone: 'text-indigo-300' },
].map((m) => (
<View key={m.label} className={`${palette.surface} ${rounded} p-4 border border-slate-700`}>
<Text className={`text-sm font-medium ${m.tone}`}>{m.label}</Text>
<Text className="text-2xl font-bold text-white mt-2">{m.value}</Text>
</View>
))}
</View>
</ScrollView>
</View>
);
}