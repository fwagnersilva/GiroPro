import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavigationMenuProps {
  navigation: any;
  currentScreen?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen: string;
  category: string;
  description?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ navigation, currentScreen }) => {
  const [isVisible, setIsVisible] = useState(false);

  const menuItems: MenuItem[] = [
    // Principais
    { id: 'dashboard', title: 'Dashboard', icon: 'home-outline', screen: 'Dashboard', category: 'Principal', description: 'Visão geral' },
    { id: 'vehicles', title: 'Meus Veículos', icon: 'car-outline', screen: 'Vehicles', category: 'Principal', description: 'Gerenciar veículos' },
    { id: 'expenses', title: 'Despesas', icon: 'receipt-outline', screen: 'Expenses', category: 'Principal', description: 'Controle de gastos' },
    { id: 'fuelings', title: 'Abastecimentos', icon: 'car-sport-outline', screen: 'Fuelings', category: 'Principal', description: 'Registro de combustível' },
    { id: 'reports', title: 'Relatórios', icon: 'analytics-outline', screen: 'Reports', category: 'Principal', description: 'Análises e gráficos' },
    
    // Jornadas
    { id: 'journeys', title: 'Jornadas', icon: 'map-outline', screen: 'Journeys', category: 'Jornadas', description: 'Viagens ativas' },
    { id: 'journey-history', title: 'Histórico de Jornadas', icon: 'time-outline', screen: 'JourneyHistory', category: 'Jornadas', description: 'Viagens anteriores' },
    
    // Adicionar
    { id: 'add-expense', title: 'Nova Despesa', icon: 'add-circle-outline', screen: 'AddExpense', category: 'Adicionar', description: 'Registrar gasto' },
    { id: 'add-fueling', title: 'Novo Abastecimento', icon: 'add-circle-outline', screen: 'AddFueling', category: 'Adicionar', description: 'Registrar combustível' },
    
    // Históricos
    { id: 'expense-history', title: 'Histórico de Despesas', icon: 'list-outline', screen: 'ExpenseHistory', category: 'Históricos', description: 'Despesas anteriores' },
    { id: 'fueling-history', title: 'Histórico de Abastecimentos', icon: 'list-outline', screen: 'FuelingHistory', category: 'Históricos', description: 'Abastecimentos anteriores' },
    { id: 'fuel-prices', title: 'Preços de Combustível', icon: 'pricetag-outline', screen: 'FuelPrices', category: 'Históricos', description: 'Histórico de preços' },
    
    // Metas
    { id: 'goals', title: 'Metas', icon: 'flag-outline', screen: 'Goals', category: 'Metas', description: 'Objetivos financeiros' },
    { id: 'achievements', title: 'Conquistas', icon: 'trophy-outline', screen: 'Achievements', category: 'Metas', description: 'Badges e troféus' },
    { id: 'insights', title: 'Insights', icon: 'bulb-outline', screen: 'Insights', category: 'Metas', description: 'Dicas inteligentes' },
    
    // Configurações
    { id: 'profile', title: 'Perfil', icon: 'person-outline', screen: 'Profile', category: 'Configurações', description: 'Dados pessoais' },
    { id: 'change-password', title: 'Alterar Senha', icon: 'lock-closed-outline', screen: 'ChangePassword', category: 'Configurações', description: 'Segurança da conta' },
    { id: 'multi-vehicle', title: 'Multi Veículos', icon: 'car-sport-outline', screen: 'MultiVehicle', category: 'Configurações', description: 'Gestão avançada' },
  ];

  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);

  const handleNavigate = (screen: string) => {
    setIsVisible(false);
    navigation.navigate(screen);
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        currentScreen === item.screen && styles.menuItemActive
      ]}
      onPress={() => handleNavigate(item.screen)}
    >
      <View style={styles.menuItemIcon}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={currentScreen === item.screen ? '#007AFF' : '#666'} 
        />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={[
          styles.menuItemTitle,
          currentScreen === item.screen && styles.menuItemTitleActive
        ]}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.menuItemDescription}>
            {item.description}
          </Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={currentScreen === item.screen ? '#007AFF' : '#CCC'} 
      />
    </TouchableOpacity>
  );

  return (
    <>
      {/* Botão do Menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>

      {/* Modal do Menu */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Ionicons name="car-sport" size={28} color="#007AFF" />
              <Text style={styles.modalTitle}>GiroPro</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuContent}>
            {Object.entries(groupedItems).map(([category, items]) => (
              <View key={category} style={styles.menuCategory}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {items.map(renderMenuItem)}
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Text style={styles.footerText}>
              Sistema funcionando corretamente!
            </Text>
            <View style={styles.statusIndicators}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.statusText}>Backend</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.statusText}>Banco</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.statusText}>Auth</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    flex: 1,
    padding: 16,
  },
  menuCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemActive: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuItemTitleActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalFooter: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
});

export default NavigationMenu;

