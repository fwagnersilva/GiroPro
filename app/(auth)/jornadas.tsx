import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JornadasScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jornadas</Text>
      <Text style={styles.text}>Conteúdo da tela de Jornadas.</Text>
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

export default JornadasScreen;

