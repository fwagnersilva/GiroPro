import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#007AFF',
  text,
  style
}) => {
  return (
    <View style={[styles.container, style]} testID="loading-spinner-container">
      <ActivityIndicator size={size} color={color} testID="loading-spinner" />
      {text && (
        <Text 
          style={[styles.text, { color }]} 
          testID="loading-text"
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingSpinner;

