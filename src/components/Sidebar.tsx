import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path as any);
    if (onClose && Platform.OS === 'web') {
      // Não fecha automaticamente na web para manter o sidebar visível
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  if (!isOpen && Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GiroPro</Text>
        <Text style={styles.headerSubtitle}>Sistema de Gestão</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* Dashboard */}
        <TouchableOpacity
          style={[styles.menuItem, isActive('/dashboard') && styles.menuItemActive]}
          onPress={() => handleNavigation('/dashboard')}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={[styles.menuText, isActive('/dashboard') && styles.menuTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Jornadas */}
        <TouchableOpacity
          style={[styles.menuItem, isActive('/jornadas') && styles.menuItemActive]}
          onPress={() => handleNavigation('/jornadas')}
        >
          <Text style={styles.menuIcon}>🚗</Text>
          <Text style={[styles.menuText, isActive('/jornadas') && styles.menuTextActive]}>
            Jornadas
          </Text>
        </TouchableOpacity>

        {/* Abastecimentos */}
        <TouchableOpacity
          style={[styles.menuItem, isActive('/abastecimentos') && styles.menuItemActive]}
          onPress={() => handleNavigation('/abastecimentos')}
        >
          <Text style={styles.menuIcon}>⛽</Text>
          <Text style={[styles.menuText, isActive('/abastecimentos') && styles.menuTextActive]}>
            Abastecimentos
          </Text>
        </TouchableOpacity>

        {/* Despesas */}
        <TouchableOpacity
          style={[styles.menuItem, isActive('/despesas') && styles.menuItemActive]}
          onPress={() => handleNavigation('/despesas')}
        >
          <Text style={styles.menuIcon}>💰</Text>
          <Text style={[styles.menuText, isActive('/despesas') && styles.menuTextActive]}>
            Despesas
          </Text>
        </TouchableOpacity>

        {/* Configurações com Submenu */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setSettingsExpanded(!settingsExpanded)}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Configurações</Text>
          <Text style={styles.expandIcon}>{settingsExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {settingsExpanded && (
          <View style={styles.submenuContainer}>
            <TouchableOpacity
              style={[styles.submenuItem, isActive('/settings/perfil') && styles.menuItemActive]}
              onPress={() => handleNavigation('/settings/perfil')}
            >
              <Text style={[styles.submenuText, isActive('/settings/perfil') && styles.menuTextActive]}>
                Perfil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submenuItem, isActive('/settings/style') && styles.menuItemActive]}
              onPress={() => handleNavigation('/settings/style')}
            >
              <Text style={[styles.submenuText, isActive('/settings/style') && styles.menuTextActive]}>
                Estilo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submenuItem, isActive('/vehicles') && styles.menuItemActive]}
              onPress={() => handleNavigation('/vehicles')}
            >
              <Text style={[styles.submenuText, isActive('/vehicles') && styles.menuTextActive]}>
                Veículos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submenuItem, isActive('/cadastro-plataformas') && styles.menuItemActive]}
              onPress={() => handleNavigation('/cadastro-plataformas')}
            >
              <Text style={[styles.submenuText, isActive('/cadastro-plataformas') && styles.menuTextActive]}>
                Plataformas
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    flexDirection: 'column',
    ...(Platform.OS === 'web' && {
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    }),
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#4b5563',
    flex: 1,
  },
  menuTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 12,
    color: '#9ca3af',
  },
  submenuContainer: {
    marginLeft: 20,
  },
  submenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 8,
  },
  submenuText: {
    fontSize: 14,
    color: '#6b7280',
    paddingLeft: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
});

export default Sidebar;
