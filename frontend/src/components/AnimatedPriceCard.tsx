import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, spacing, borderRadius, shadows, typography } from '../theme/tokens';

interface FuelPrice {
  tipo_combustivel: string;
  preco_medio: number;
  preco_minimo: number;
  preco_maximo: number;
  estado: string;
  cidade: string;
  numero_postos: number;
  data_coleta: string;
}

interface AnimatedPriceCardProps {
  price: FuelPrice;
  fuelData: {
    label: string;
    value: string;
    icon: string;
    color: string;
  };
  isBestPrice?: boolean;
  onPress?: () => void;
  animationDelay?: number;
  theme?: typeof lightTheme;
}

const AnimatedPriceCard: React.FC<AnimatedPriceCardProps> = ({
  price,
  fuelData,
  isBestPrice = false,
  onPress,
  animationDelay = 0,
  theme = lightTheme,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: animationDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: animationDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: animationDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso para melhor preço
    if (isBestPrice) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Animação de shimmer para destaque
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, shimmerAnim, animationDelay, isBestPrice]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePress = () => {
    // Animação de feedback tátil
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback (iOS/Android)
    if (Platform.OS !== 'web') {
      // Implementar haptic feedback aqui
      // Exemplo: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress?.();
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.priceCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isBestPrice ? theme.colors.success : theme.colors.border,
            borderWidth: isBestPrice ? 2 : 1,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={`Preço de ${price.tipo_combustivel}: ${formatCurrency(price.preco_medio)}`}
        accessibilityHint="Toque para ver mais detalhes"
      >
        {/* Shimmer Effect para Best Price */}
        {isBestPrice && (
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          />
        )}

        {/* Best Price Badge */}
        {isBestPrice && (
          <Animated.View
            style={[
              styles.bestPriceBadge,
              { backgroundColor: theme.colors.success },
            ]}
          >
            <Ionicons name="star" size={12} color={theme.colors.surface} />
            <Text style={[styles.bestPriceBadgeText, { color: theme.colors.surface }]}>
              Melhor Preço
            </Text>
          </Animated.View>
        )}

        {/* Header */}
        <View style={styles.priceHeader}>
          <View style={styles.fuelTypeContainer}>
            <Animated.View
              style={[
                styles.fuelIcon,
                { backgroundColor: fuelData.color + '20' },
              ]}
            >
              <Ionicons
                name={fuelData.icon as any}
                size={24}
                color={fuelData.color}
              />
            </Animated.View>
            <View>
              <Text style={[styles.fuelTypeName, { color: theme.colors.text }]}>
                {price.tipo_combustivel}
              </Text>
              <Text style={[styles.postsCount, { color: theme.colors.textSecondary }]}>
                {price.numero_postos} postos consultados
              </Text>
            </View>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.priceDetails}>
          <View style={styles.mainPrice}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Preço Médio
            </Text>
            <Animated.Text
              style={[
                styles.priceValue,
                { color: isBestPrice ? theme.colors.success : theme.colors.primary },
              ]}
            >
              {formatCurrency(price.preco_medio)}
            </Animated.Text>
          </View>

          <View style={[styles.priceRange, { borderTopColor: theme.colors.border }]}>
            <View style={styles.rangeItem}>
              <Text style={[styles.rangeLabel, { color: theme.colors.textTertiary }]}>
                Mínimo
              </Text>
              <Text style={[styles.rangeValue, { color: theme.colors.success }]}>
                {formatCurrency(price.preco_minimo)}
              </Text>
            </View>
            <View style={[styles.rangeDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.rangeItem}>
              <Text style={[styles.rangeLabel, { color: theme.colors.textTertiary }]}>
                Máximo
              </Text>
              <Text style={[styles.rangeValue, { color: theme.colors.error }]}>
                {formatCurrency(price.preco_maximo)}
              </Text>
            </View>
          </View>
        </View>

        {/* Trend Indicator */}
        <View style={styles.trendContainer}>
          <Ionicons
            name="trending-up"
            size={16}
            color={theme.colors.textTertiary}
          />
          <Text style={[styles.trendText, { color: theme.colors.textTertiary }]}>
            Tendência estável
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  priceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    position: 'relative',
    overflow: 'hidden',
    ...shadows.base,
  },

  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 100,
    transform: [{ skewX: '-20deg' }],
  },

  bestPriceBadge: {
    position: 'absolute',
    top: -1,
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
    zIndex: 1,
    ...shadows.sm,
  },

  bestPriceBadgeText: {
    marginLeft: spacing[1],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },

  priceHeader: {
    marginBottom: spacing[4],
  },

  fuelTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fuelIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },

  fuelTypeName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing[1],
  },

  postsCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },

  priceDetails: {
    gap: spacing[3],
  },

  mainPrice: {
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing[1],
  },

  priceValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.bold,
  },

  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
  },

  rangeItem: {
    alignItems: 'center',
    flex: 1,
  },

  rangeDivider: {
    width: 1,
    height: 30,
    marginHorizontal: spacing[2],
  },

  rangeLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing[1],
  },

  rangeValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },

  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  trendText: {
    marginLeft: spacing[1],
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },
});

export default AnimatedPriceCard;

