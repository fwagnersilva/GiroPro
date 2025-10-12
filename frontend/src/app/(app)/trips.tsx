import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { FocusAwareStatusBar, Text, View, Input, Button } from '@/components/ui';


export default function Trips() {
const [active, setActive] = useState(false);


return (
<View className={`flex-1 bg-gray-900`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="mb-6">
<Text className="text-3xl font-bold text-white">Jornadas</Text>
<Text className="text-slate-300">Inicie, pause e finalize com clareza</Text>
</View>


{!active ? (
<View className={`bg-gray-800 rounded-lg p-6 border border-slate-700 mb-6`}>
<Text className="text-white font-semibold text-lg mb-3">Iniciar Nova Jornada</Text>
<Input placeholder="Quilometragem inicial" className="bg-slate-900 text-white" />
<Button onPress={() => setActive(true)} label="🚀 Iniciar Jornada" className="bg-green-600 mt-4" />
</View>
) : (
<View className={`bg-gray-800 rounded-lg p-6 border border-slate-700 mb-6`}>
<Text className="text-white font-semibold text-lg">Jornada em Andamento</Text>
<View className="mt-4 grid grid-cols-2 gap-3">
<Button label="⏸ Pausar" className="bg-yellow-600" />
<Button label="✅ Finalizar" className="bg-blue-600" />
</View>
</View>
)}


<View>
<Text className="text-2xl font-bold text-white mb-4">Jornadas Recentes</Text>
<View className={`bg-gray-800 rounded-lg p-4 border border-slate-700`}>
<Text className="text-white font-semibold">Renault Logan · 78 km</Text>
<Text className="text-slate-300 text-sm mt-1">4h 55min · R$ 134,66</Text>
</View>
</View>
</ScrollView>
</View>
);
}

