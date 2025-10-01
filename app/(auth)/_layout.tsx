import React from 'react';
import { Stack } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import Sidebar from '../../src/components/Sidebar';

export default function AuthLayout() {
  // No mobile, usa o Drawer nativo do React Navigation
  // Na web, usa um layout com Sidebar customizado
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <ProtectedRoute>
        <View style={styles.webContainer}>
          <Sidebar />
          <View style={styles.contentContainer}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="jornadas" />
              <Stack.Screen name="abastecimentos" />
              <Stack.Screen name="despesas" />
              <Stack.Screen name="vehicles" />
              <Stack.Screen name="cadastro-plataformas" />
              <Stack.Screen name="settings" />
            </Stack>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  // Para mobile, mantém o Drawer original
  // Nota: Isso requer que o Drawer seja importado dinamicamente ou
  // que seja tratado de forma condicional
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="jornadas" />
        <Stack.Screen name="abastecimentos" />
        <Stack.Screen name="despesas" />
        <Stack.Screen name="vehicles" />
        <Stack.Screen name="cadastro-plataformas" />
        <Stack.Screen name="settings" />
      </Stack>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
  },
  contentContainer: {
    flex: 1,
    overflow: 'auto',
  },
});
