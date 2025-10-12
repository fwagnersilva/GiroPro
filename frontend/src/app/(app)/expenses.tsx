import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import RefButton from '@/components/RefButton';
import { palette, rounded } from '@/theme';


export default function Expenses() {
const router = useRouter();
const [expenses] = useState([] as any[]);


return (
<View className={`flex-1 ${palette.bg}`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="flex-row justify-between items-center mb-6">
<View>
<Text className="text-3xl font-bold text-white">Despesas</Text>
<Text className="text-slate-300">Registre gastos de forma organizada</Text>
</View>
<RefButton onPress={() => router.push('/edit-expense')} style="bg-blue-600">+ Adicionar</RefButton>
</View>


<View className={`${palette.surface} ${rounded} p-4 mb-6 border border-slate-700`}>
<Text className="text-red-300 font-semibold">Total de Despesas</Text>
<Text className="text-2xl font-bold text-white mt-2">R$ 0,00</Text>
<Text className="text-red-400 text-sm mt-1">0 despesa(s)</Text>
</View>


<View>
<Text className="text-2xl font-bold text-white mb-4">Despesas Registradas</Text>
{expenses.length === 0 ? (
<View className={`${palette.surface} ${rounded} p-8 items-center border border-slate-700`}>
<Text className="text-slate-300 text-center">Nenhuma despesa registrada.</Text>
</View>
) : null}
</View>
</ScrollView>
</View>
);
}