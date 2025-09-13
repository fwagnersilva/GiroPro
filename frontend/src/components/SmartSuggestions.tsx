import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/tokens';

interface Suggestion {
  id: string;
  type: 'posto' | 'valor' | 'quantidade' | 'combustivel';
  label: string;
  value: string;
  frequency: number;
  lastUsed: Date;
  icon: string;
}

interface SmartSuggestionsProps {
  field: string;
  currentValue: string;
  onSuggestionSelect: (value: string) => void;
  vehicleId?: string;
  fuelType?: string;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  field,
  currentValue,
  onSuggestionSelect,
  vehicleId,
  fuelType,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Simulação de dados históricos - em produção viria de AsyncStorage ou API
  const mockHistoricalData = {
    postos: [
      { name: 'Posto Shell Centro', frequency: 15, lastUsed: new Date('2025-08-25') },
      { name: 'BR Petrobras Av. Paulista', frequency: 12, lastUsed: new Date('2025-08-20') },
      { name: 'Ipiranga Shopping', frequency: 8, lastUsed: new Date('2025-08-15') },
    ],
    valores: {
      'Gasolina': [5.49, 5.52, 5.45, 5.51],
      'Etanol': [3.89, 3.92, 3.85, 3.91],
      'Diesel': [4.25, 4.28, 4.22, 4.26],
    },
    quantidades: [45.5, 50.0, 42.3, 48.7, 35.2],
  };

  const generateSuggestions = useCallback(() => {
    const newSuggestions: Suggestion[] = [];

    switch (field) {
      case 'nome_posto':
        mockHistoricalData.postos
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 3)
          .forEach((posto, index) => {
            newSuggestions.push({
              id: `posto-${index}`,
              type: 'posto',
              label: posto.name,
              value: posto.name,
              frequency: posto.frequency,
              lastUsed: posto.lastUsed,
              icon: 'business',
            });
          });
        break;

      case 'valor_litro':
        if (fuelType && mockHistoricalData.valores[fuelType as keyof typeof mockHistoricalData.valores]) {
          const valores = mockHistoricalData.valores[fuelType as keyof typeof mockHistoricalData.valores];
          const avgValue = valores.reduce((sum, val) => sum + val, 0) / valores.length;
          const minValue = Math.min(...valores);
          const maxValue = Math.max(...valores);

          newSuggestions.push(
            {
              id: 'valor-avg',
              type: 'valor',
              label: `Média: R$ ${avgValue.toFixed(2)}`,
              value: avgValue.toFixed(2),
              frequency: valores.length,
              lastUsed: new Date(),
              icon: 'trending-up',
            },
            {
              id: 'valor-min',
              type: 'valor',
              label: `Menor: R$ ${minValue.toFixed(2)}`,
              value: minValue.toFixed(2),
              frequency: 1,
              lastUsed: new Date(),
              icon: 'trending-down',
            },
            {
              id: 'valor-max',
              type: 'valor',
              label: `Maior: R$ ${maxValue.toFixed(2)}`,
              value: maxValue.toFixed(2),
              frequency: 1,
              lastUsed: new Date(),
              icon: 'trending-up',
            }
          );
        }
        break;

      case 'quantidade_litros':
        const avgQuantity = mockHistoricalData.quantidades.reduce((sum, val) => sum + val, 0) / mockHistoricalData.quantidades.length;
        const commonQuantities = [...new Set(mockHistoricalData.quantidades)]
          .sort((a, b) => {
            const freqA = mockHistoricalData.quantidades.filter(q => q === a).length;
            const freqB = mockHistoricalData.quantidades.filter(q => q === b).length;
            return freqB - freqA;
          })
          .slice(0, 3);

        newSuggestions.push({
          id: 'qty-avg',
          type: 'quantidade',
          label: `Média: ${avgQuantity.toFixed(1)}L`,
          value: avgQuantity.toFixed(1),
          frequency: mockHistoricalData.quantidades.length,
          lastUsed: new Date(),
          icon: 'analytics',
        });

        commonQuantities.forEach((qty, index) => {
          const frequency = mockHistoricalData.quantidades.filter(q => q === qty).length;
          newSuggestions.push({
            id: `qty-${index}`,
            type: 'quantidade',
            label: `Usual: ${qty}L`,
            value: qty.toString(),
            frequency,
            lastUsed: new Date(),
            icon: 'speedometer',
          });
        });
        break;
    }

    setSuggestions(newSuggestions);
  }, [field, fuelType]);

  useEffect(() => {
    if (currentValue.length > 0) {
      generateSuggestions();
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setIsVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [currentValue, generateSuggestions, fadeAnim]);

  const handleSuggestionPress = (suggestion: Suggestion) => {
    onSuggestionSelect(suggestion.value);
    setIsVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const renderSuggestion = ({ item }: { item: Suggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons name={item.icon as any} size={16} color={colors.primary[600]} />
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionLabel}>{item.label}</Text>
        <Text style={styles.suggestionMeta}>
          Usado {item.frequency}x • {getRelativeTime(item.lastUsed)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.neutral[400]} />
    </TouchableOpacity>
  );

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    return `${Math.floor(diffInDays / 30)} meses atrás`;
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={16} color={colors.warning[600]} />
        <Text style={styles.headerText}>Sugestões Inteligentes</Text>
      </View>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    elevation: 4,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.warning[50],
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.warning[700],
    marginLeft: spacing.xs,
  },
  list: {
    maxHeight: 150,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
    marginBottom: 2,
  },
  suggestionMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
  },
});

export default SmartSuggestions;

