import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JourneysScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jornadas</Text>
      <Text style={styles.subtitle}>Em desenvolvimento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default JourneysScreen;

