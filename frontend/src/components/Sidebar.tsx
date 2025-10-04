import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const signOut = useAuth.use.signOut();
  const [configExpanded, setConfigExpanded] = useState(false);

  const navigateTo = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  const toggleConfig = () => {
    setConfigExpanded(!configExpanded);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay escuro */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
      
      {/* Sidebar */}
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>GiroPro</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <TouchableOpacity onPress={() => navigateTo("/dashboard")} style={styles.menuItem}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateTo("/activities")} style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuItemText}>Atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateTo('/vehicles')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>🚗</Text>
            <Text style={styles.menuItemText}>Veículos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateTo('/trips')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>🗺️</Text>
            <Text style={styles.menuItemText}>Jornadas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateTo('/expenses')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>💰</Text>
            <Text style={styles.menuItemText}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigateTo('/fuelings')} style={styles.menuItem}>
            <Text style={styles.menuIcon}>⛽</Text>
            <Text style={styles.menuItemText}>Abastecimentos</Text>
          </TouchableOpacity>

          

          {/* Configurações com submenu */}
          <View>
            <TouchableOpacity onPress={toggleConfig} style={styles.menuItem}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuItemText}>Configurações</Text>
              <Text style={styles.expandIcon}>{configExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            
            {configExpanded && (
              <View style={styles.submenu}>
                <TouchableOpacity onPress={() => navigateTo('/profile')} style={styles.submenuItem}>
                  <Text style={styles.submenuItemText}>👤 Perfil</Text>
                </TouchableOpacity>
                               <TouchableOpacity onPress={() => navigateTo('/settings')} style={styles.submenuItem}>
                  <Text style={styles.submenuItemText}>⚙️ Geral</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Sair */}
          <TouchableOpacity onPress={handleSignOut} style={[styles.menuItem, styles.logoutItem]}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#ffffff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#3b82f6',
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  submenu: {
    backgroundColor: '#f9fafb',
    paddingLeft: 20,
  },
  submenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  submenuItemText: {
    fontSize: 15,
    color: '#4b5563',
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#ef4444',
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});