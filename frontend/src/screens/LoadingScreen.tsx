import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LoadingSpinner 
        size="large" 
        color="#007AFF" 
        text="Carregando..." 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default LoadingScreen;

