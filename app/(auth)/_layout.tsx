import React, { useState } from 'react';
import { Stack, Drawer } from 'expo-router';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';

// Componente CustomDrawerContent para o menu lateral
const CustomDrawerContent = ({ navigation }) => {
  const { logout } = useAuth();
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>GiroPro</Text>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('dashboard')}>
        <Text style={styles.drawerItemText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('jornadas')}>
        <Text style={styles.drawerItemText}>Jornadas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('abastecimentos')}>
        <Text style={styles.drawerItemText}>Abastecimentos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('despesas')}>
        <Text style={styles.drawerItemText}>Despesas</Text>
      </TouchableOpacity>
      
      {/* Menu de Configurações com Submenu */}
      <TouchableOpacity style={styles.drawerItem} onPress={() => setSettingsExpanded(!settingsExpanded)}>
        <Text style={styles.drawerItemText}>Configurações {settingsExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {settingsExpanded && (
        <View>
          <TouchableOpacity style={styles.drawerSubItem} onPress={() => navigation.navigate('settings/perfil')}>
            <Text style={styles.drawerItemText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerSubItem} onPress={() => navigation.navigate('settings/style')}>
            <Text style={styles.drawerItemText}>Style</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerSubItem} onPress={() => navigation.navigate('settings/vehicles')}>
            <Text style={styles.drawerItemText}>Veículos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerSubItem} onPress={() => navigation.navigate('settings/cadastro-plataformas')}>
            <Text style={styles.drawerItemText}>Cadastro de Plataformas</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity style={[styles.drawerItem, styles.logoutButton]} onPress={logout}>
        <Text style={styles.drawerItemText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AuthLayout() {
  return (
    <ProtectedRoute>
      <Drawer drawerContent={CustomDrawerContent}>
        <Drawer.Screen name="dashboard" options={{ headerShown: false, title: 'Dashboard' }} />
        <Drawer.Screen name="jornadas" options={{ headerShown: false, title: 'Jornadas' }} />
        <Drawer.Screen name="abastecimentos" options={{ headerShown: false, title: 'Abastecimentos' }} />
        <Drawer.Screen name="despesas" options={{ headerShown: false, title: 'Despesas' }} />
        <Drawer.Screen name="settings" options={{ headerShown: false, title: 'Configurações' }} />
        {/* A rota 'vehicles' original foi movida para dentro de 'settings' */}
        {/* <Drawer.Screen name="vehicles" options={{ headerShown: false, title: 'Veículos' }} /> */}
      </Drawer>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerSubItem: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#555',
  },
  drawerSectionHeader: {
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
});

