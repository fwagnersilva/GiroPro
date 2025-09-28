
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { lightTheme } from '../theme/tokens';
import { typography, spacing } from '../styles/responsive';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'grid-outline',
    route: '/dashboard'
  },
  {
    id: 'journeys',
    title: 'Jornadas',
    icon: 'car-outline',
    route: '/dashboard/journeys'
  },
  {
    id: 'fuelings',
    title: 'Abastecimentos',
    icon: 'water-outline',
    route: '/dashboard/fuelings'
  },
  {
    id: 'expenses',
    title: 'Despesas',
    icon: 'receipt-outline',
    route: '/dashboard/expenses'
  },
  {
    id: 'vehicles',
    title: 'Veículos',
    icon: 'car-sport-outline',
    route: '/dashboard/vehicles'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemPress = (route: string) => {
    navigate(route);
    if (onClose) {
      onClose();
    }
  };

  const isActiveRoute = (route: string) => {
    if (route === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(route);
  };

  return (
    <View style={[styles.container, !isOpen && styles.containerClosed]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="car-sport" size={24} color={lightTheme.colors.primary} />
          </View>
          <Text style={styles.logoText}>GiroPro</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                isActive && styles.menuItemActive
              ]}
              onPress={() => handleMenuItemPress(item.route)}
              accessible={true}
              accessibilityLabel={`Navegar para ${item.title}`}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={isActive ? lightTheme.colors.primary : lightTheme.colors.textSecondary}
                style={styles.menuIcon}
              />
              <Text style={[
                styles.menuText,
                isActive && styles.menuTextActive
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => {
            // Implementar logout
            console.log('Logout');
          }}
          accessible={true}
          accessibilityLabel="Sair do sistema"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={lightTheme.colors.textSecondary}
            style={styles.menuIcon}
          />
          <Text style={styles.footerText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: '100vh',
    backgroundColor: '#1a1d29', // Cor escura similar ao exemplo
    borderRightWidth: 1,
    borderRightColor: '#2a2d3a',
    flexDirection: 'column',
    position: 'fixed' as any,
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  containerClosed: {
    width: 64,
  },
  header: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: lightTheme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...typography.h3,
    color: '#ffffff',
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    paddingTop: spacing[4],
    paddingHorizontal: spacing[2],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[1],
    gap: spacing[3],
    cursor: 'pointer' as any,
    transition: 'all 0.2s ease' as any,
  },
  menuItemActive: {
    backgroundColor: lightTheme.colors.primary + '20',
    borderLeftWidth: 3,
    borderLeftColor: lightTheme.colors.primary,
  },
  menuIcon: {
    width: 20,
  },
  menuText: {
    ...typography.body,
    color: '#9ca3af', // Cor cinza similar ao exemplo
    fontWeight: '500',
  },
  menuTextActive: {
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#2a2d3a',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[3],
    cursor: 'pointer' as any,
  },
  footerText: {
    ...typography.body,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default Sidebar;

