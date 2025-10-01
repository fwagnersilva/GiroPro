import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigation = useNavigation();

  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName as never); // 'as never' para contornar problemas de tipagem temporariamente
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Dashboard')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Vehicles')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Veículos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Settings')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Configurações</Text>
      </TouchableOpacity>
      {/* Adicione mais itens de menu conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250, // Largura do sidebar
    backgroundColor: '#f0f0f0',
    padding: 20,
    zIndex: 1000, // Garante que o sidebar fique acima de outros elementos
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

