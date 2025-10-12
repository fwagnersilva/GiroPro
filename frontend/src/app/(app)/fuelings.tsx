import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { palette, rounded } from '@/theme';
import RefButton from '@/components/RefButton';


export default function Fuelings() {
const router = useRouter();
const [fuelings, setFuelings] = useState([] as any[]);


const handleAdd = () => router.push('/edit-fueling');


return (
<View className={`flex-1 ${palette.bg}`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="flex-row justify-between items-center mb-6">
<View>
<Text className="text-3xl font-bold text-white">Abastecimentos</Text>
<Text className="text-slate-300">Registre e acompanhe</Text>
</View>
<RefButton onPress={handleAdd} style="bg-blue-600">+ Adicionar</RefButton>
</View>


<View className="space-y-3">
{fuelings.length === 0 ? (
<View className={`${palette.surface} ${rounded} p-8 border border-slate-700 items-center`}>
<Text className="text-slate-300 text-center">Nenhum abastecimento registrado. Adicione o primeiro!</Text>
</View>
) : (
fuelings.map((f) => (
<View key={f.id} className={`${palette.surface} ${rounded} p-4 border border-slate-700 flex-row justify-between`}>
<View className="flex-1 mr-3">
<Text className="text-white font-semibold">{f.nomePosto || 'Posto'}</Text>
<Text className="text-slate-300 text-sm">{f.litros} L · R$ {f.precoPorLitro.toFixed(2)}</Text>
</View>
<View className="flex-row space-x-2">
<RefButton onPress={() => {}} style="bg-blue-600 px-3 py-2">Editar</RefButton>
<RefButton onPress={() => {}} style="bg-red-600 px-3 py-2">Excluir</RefButton>
</View>
</View>
))
)}
</View>
</ScrollView>
</View>
);
}