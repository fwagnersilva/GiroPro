import React from 'react';
import { ScrollView } from 'react-native';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Activities() {
  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Atividades Recentes
        </Text>
        {/* Conteúdo da página de atividades será adicionado aqui */}
        <Text className="text-gray-600">Nenhuma atividade recente para exibir.</Text>
      </ScrollView>
    </View>
  );
}

