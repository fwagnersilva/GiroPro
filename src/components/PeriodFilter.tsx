import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export type PeriodType = 'today' | 'week' | 'month' | 'custom';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  onCustomDatePress?: () => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  onCustomDatePress,
}) => {
  const periods: { value: PeriodType; label: string }[] = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'custom', label: 'Personalizado' },
  ];

  const handlePeriodPress = (period: PeriodType) => {
    if (period === 'custom' && onCustomDatePress) {
      onCustomDatePress();
    } else {
      onPeriodChange(period);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Período:</Text>
      <View style={styles.buttonsContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.button,
              selectedPeriod === period.value && styles.buttonActive,
            ]}
            onPress={() => handlePeriodPress(period.value)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === period.value && styles.buttonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  buttonTextActive: {
    color: '#fff',
  },
});

export default PeriodFilter;
