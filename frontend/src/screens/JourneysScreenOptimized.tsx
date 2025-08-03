import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { layouts, typography, spacing } from '../styles/responsive';
import { getSafePadding } from '../utils/platformUtils';

const JourneysScreenOptimized: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Jornadas</Text>
        <Text style={styles.subtitle}>Em desenvolvimento</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: layouts.dashboard.container.backgroundColor,
    paddingTop: getSafePadding().paddingTop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    color: '#333333',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default JourneysScreenOptimized;


