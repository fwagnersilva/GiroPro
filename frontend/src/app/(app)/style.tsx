import * as React from 'react';

import { Buttons } from '@/components/buttons';
import { Colors } from '@/components/colors';
import { Inputs } from '@/components/inputs';
import { Typography } from '@/components/typography';
import { ThemeDemo } from '@/components/theme-demo';
import { FocusAwareStatusBar, SafeAreaView, ScrollView, View } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4 bg-theme-background">
        <SafeAreaView className="flex-1">
          {/* Header com toggle de tema */}
          <View className="flex-row justify-between items-center mb-6 pt-4">
            <View>
              <Typography />
            </View>
            <ThemeToggle variant="button" size="md" />
          </View>
          
          {/* Demonstração completa do novo sistema de temas */}
          <ThemeDemo />
          
          {/* Componentes originais para comparação */}
          <View className="mt-8 pt-8 border-t border-theme">
            <Colors />
            <Buttons />
            <Inputs />
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
