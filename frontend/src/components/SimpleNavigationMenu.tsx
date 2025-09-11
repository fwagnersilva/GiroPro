import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SimpleNavigationMenuProps {
  navigation: any;
}

const SimpleNavigationMenu: React.FC<SimpleNavigationMenuProps> = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { title: 'Dashboard', screen: 'Dashboard', icon: 'home-outline' },
    { title: 'Meus Veículos', screen: 'Vehicles', icon: 'car-outline' },
    { title: 'Despesas', screen: 'Expenses', icon: 'receipt-outline' },
    { title: 'Abastecimentos', screen: 'Fuelings', icon: 'car-sport-outline' },
    { title: 'Relatórios', screen: 'Reports', icon: 'analytics-outline' },
    { title: 'Jornadas', screen: 'Journeys', icon: 'map-outline' },
    { title: 'Histórico de Jornadas', screen: 'JourneyHistory', icon: 'time-outline' },
    { title: 'Nova Despesa', screen: 'AddExpense', icon: 'add-circle-outline' },
    { title: 'Novo Abastecimento', screen: 'AddFueling', icon: 'add-circle-outline' },
    { title: 'Perfil', screen: 'Profile', icon: 'person-outline' },
    { title: 'Metas', screen: 'Goals', icon: 'flag-outline' },
    { title: 'Conquistas', screen: 'Achievements', icon: 'trophy-outline' },
  ];

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
    setIsExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Ionicons name={isExpanded ? "close" : "menu"} size={24} color="#FFF" />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.menuDropdown}>
          <View style={styles.menuHeader}>
            <Ionicons name="car-sport" size={20} color="#007AFF" />
            <Text style={styles.menuTitle}>GiroPro - Menu</Text>
          </View>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.screen)}
            >
              <Ionicons name={item.icon as any} size={18} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
  },
  menuButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    minWidth: 250,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
});

export default SimpleNavigationMenu;

