import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleApp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GiroPro - Teste Simples</Text>
      <Text style={styles.subtitle}>Se você está vendo isso, o React Native Web está funcionando!</Text>
      <Text style={styles.info}>Backend: http://localhost:3000</Text>
      <Text style={styles.info}>Frontend: http://localhost:19006</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
});

export default SimpleApp;

