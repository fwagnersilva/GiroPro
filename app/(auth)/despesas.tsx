import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DespesasScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Despesas</Text>
      <Text style={styles.text}>Conteúdo da tela de Despesas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});

export default DespesasScreen;

