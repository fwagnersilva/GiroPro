import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

const FinalSidebar: React.FC = () => {
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
    <View style={{
      width: 256,
      height: '100%',
      backgroundColor: '#1a1d29',
      borderRightWidth: 1,
      borderRightColor: '#2a2d3a',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <View style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2d3a',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#2196F320',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 16 }}>🚗</Text>
          </View>
          <Text style={{
            fontSize: 24,
            color: '#ffffff',
            fontWeight: '600',
          }}>GiroPro</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 8,
      }}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 4,
                backgroundColor: isActive ? '#2196F320' : 'transparent',
                borderLeftWidth: isActive ? 3 : 0,
                borderLeftColor: isActive ? '#2196F3' : 'transparent',
              }}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <Text style={{
                fontSize: 16,
                width: 20,
                textAlign: 'center',
                marginRight: 12,
              }}>{item.icon}</Text>
              <Text style={{
                fontSize: 16,
                color: isActive ? '#2196F3' : '#9ca3af',
                fontWeight: isActive ? '600' : '500',
              }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#2a2d3a',
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          onPress={() => {
            console.log('Logout');
          }}
        >
          <Text style={{
            fontSize: 16,
            width: 20,
            textAlign: 'center',
            marginRight: 12,
          }}>🚪</Text>
          <Text style={{
            fontSize: 16,
            color: '#9ca3af',
            fontWeight: '500',
          }}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FinalSidebar;
