import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';

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
    icon: '🏠',
    route: '/dashboard'
  },
  {
    id: 'journeys',
    title: 'Jornadas',
    icon: '🚗',
    route: '/dashboard/journeys'
  },
  {
    id: 'fuelings',
    title: 'Abastecimentos',
    icon: '⛽',
    route: '/dashboard/fuelings'
  },
  {
    id: 'expenses',
    title: 'Despesas',
    icon: '💰',
    route: '/dashboard/expenses'
  },
  {
    id: 'vehicles',
    title: 'Veículos',
    icon: '🚙',
    route: '/dashboard/vehicles'
  }
];

const WebSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemPress = (route: string) => {
    navigate(route);
  };

  const isActiveRoute = (route: string) => {
    if (route === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(route);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>🚗</Text>
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
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
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
            console.log('Logout');
          }}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={styles.footerText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: '100vh' as any,
    backgroundColor: '#1a1d29',
    borderRightWidth: 1,
    borderRightColor: '#2a2d3a',
    flexDirection: 'column',
    position: 'fixed' as any,
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2d3a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2196F320',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: 16,
  },
  logoText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#2196F320',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  menuIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2d3a',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
});

export default WebSidebar;
