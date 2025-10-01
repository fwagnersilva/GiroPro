import React from 'react';
import { Stack, useRouter } from 'expo-router';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';

// Componente Sidebar para o menu lateral (sempre visível no web)
const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.sidebarContainer}>
      <Text style={styles.sidebarHeader}>GiroPro</Text>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('/dashboard')}>
        <Text style={styles.sidebarItemText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('/jornadas')}>
        <Text style={styles.sidebarItemText}>Jornadas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('/abastecimentos')}>
        <Text style={styles.sidebarItemText}>Abastecimentos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('/despesas')}>
        <Text style={styles.sidebarItemText}>Despesas</Text>
      </TouchableOpacity>
      {/* Menu de Configurações */} 
      <Text style={styles.sidebarSectionHeader}>Configurações</Text>
      <TouchableOpacity style={styles.sidebarSubItem} onPress={() => router.push('/settings/perfil')}>
        <Text style={styles.sidebarItemText}>Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarSubItem} onPress={() => router.push('/settings/style')}>
        <Text style={styles.sidebarItemText}>Style</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarSubItem} onPress={() => router.push('/settings/vehicles')}>
        <Text style={styles.sidebarItemText}>Veículos</n></TouchableOpacity>
      <TouchableOpacity style={styles.sidebarSubItem} onPress={() => router.push('/settings/cadastro-plataformas')}>
        <Text style={styles.sidebarItemText}>Cadastro de Plataformas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.sidebarItem, styles.logoutButton]} onPress={logout}>
        <Text style={styles.sidebarItemText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AuthLayout() {
  return (
    <ProtectedRoute>
      <View style={styles.mainLayout}>
        <Sidebar />
        <View style={styles.contentContainer}>
          <Stack>
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="jornadas" options={{ headerShown: false }} />
            <Stack.Screen name="abastecimentos" options={{ headerShown: false }} />
            <Stack.Screen name="despesas" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="vehicles" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 240,
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sidebarHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarSubItem: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  sidebarItemText: {
    fontSize: 18,
    color: '#555',
  },
  sidebarSectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    color: '#888',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#fdd',
  },
  contentContainer: {
    flex: 1,
  },
});

