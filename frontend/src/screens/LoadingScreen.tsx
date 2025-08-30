import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Animation } from '../constants/designTokens';

export interface ProgressIndicatorProps {
  /** Tipo do indicador de progresso */
  type?: 'circular' | 'linear' | 'dots';
  /** Progresso atual (0-100) - undefined para indeterminado */
  progress?: number;
  /** Tamanho do indicador */
  size?: 'small' | 'medium' | 'large';
  /** Cor do indicador */
  color?: string;
  /** Mostrar porcentagem */
  showPercentage?: boolean;
  /** Texto personalizado */
  text?: string;
  /** Estilo customizado do container */
  style?: ViewStyle;
  /** Estilo customizado do texto */
  textStyle?: TextStyle;
  /** Callback quando animação completa */
  onComplete?: () => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  type = 'circular',
  progress,
  size = 'medium',
  color = Colors.primary[500],
  showPercentage = false,
  text,
  style,
  textStyle,
  onComplete,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  const sizeConfig = {
    small: { width: 24, height: 24, strokeWidth: 2 },
    medium: { width: 40, height: 40, strokeWidth: 3 },
    large: { width: 60, height: 60, strokeWidth: 4 },
  };

  const currentSize = sizeConfig[size];

  // Animação de rotação para indicadores indeterminados
  useEffect(() => {
    if (progress === undefined) {
      const rotationAnimation = Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();

      return () => rotationAnimation.stop();
    }
  }, [progress, rotationValue]);

  // Animação de pulsação
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseValue]);

  // Animação de progresso
  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: Animation.duration.normal,
        useNativeDriver: false,
      }).start(() => {
        if (progress >= 100 && onComplete) {
          onComplete();
        }
      });
    }
  }, [progress, animatedValue, onComplete]);

  const renderCircularIndicator = () => {
    const rotation = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    if (progress === undefined) {
      // Indicador indeterminado
      return (
        <Animated.View
          style={[
            styles.circularContainer,
            {
              width: currentSize.width,
              height: currentSize.height,
              transform: [{ rotate: rotation }, { scale: pulseValue }],
            },
          ]}
        >
          <View
            style={[
              styles.circularIndicator,
              {
                width: currentSize.width,
                height: currentSize.height,
                borderWidth: currentSize.strokeWidth,
                borderColor: color,
                borderTopColor: 'transparent',
              },
            ]}
          />
        </Animated.View>
      );
    }

    // Indicador determinado (com progresso)
    const circumference = 2 * Math.PI * (currentSize.width / 2 - currentSize.strokeWidth);
    const strokeDashoffset = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });

    return (
      <View style={styles.circularProgressContainer}>
        <View
          style={[
            styles.circularBackground,
            {
              width: currentSize.width,
              height: currentSize.height,
              borderWidth: currentSize.strokeWidth,
              borderColor: Colors.neutral[200],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circularProgress,
            {
              width: currentSize.width,
              height: currentSize.height,
              borderWidth: currentSize.strokeWidth,
              borderColor: color,
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
        {showPercentage && (
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText, { color }]}>
              {Math.round(progress)}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderLinearIndicator = () => {
    const progressWidth = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.linearContainer}>
        <View style={[styles.linearBackground, { height: currentSize.strokeWidth * 2 }]}>
          <Animated.View
            style={[
              styles.linearProgress,
              {
                width: progress !== undefined ? progressWidth : '100%',
                backgroundColor: color,
                height: currentSize.strokeWidth * 2,
              },
            ]}
          />
        </View>
        {showPercentage && progress !== undefined && (
          <Text style={[styles.percentageText, { color, marginTop: Spacing.xs }]}>
            {Math.round(progress)}%
          </Text>
        )}
      </View>
    );
  };

  const renderDotsIndicator = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: currentSize.strokeWidth * 3,
                height: currentSize.strokeWidth * 3,
                transform: [
                  {
                    scale: pulseValue.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderIndicator = () => {
    switch (type) {
      case 'linear':
        return renderLinearIndicator();
      case 'dots':
        return renderDotsIndicator();
      case 'circular':
      default:
        return renderCircularIndicator();
    }
  };

  return (
    <View style={[styles.container, style]} testID="progress-indicator">
      {renderIndicator()}
      {text && (
        <Text
          style={[styles.text, textStyle]}
          testID="progress-text"
          accessibilityLabel={text}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Circular Indicator
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularIndicator: {
    borderRadius: 9999,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularBackground: {
    borderRadius: 9999,
    position: 'absolute',
  },
  circularProgress: {
    borderRadius: 9999,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Linear Indicator
  linearContainer: {
    width: 200,
    alignItems: 'center',
  },
  linearBackground: {
    width: '100%',
    backgroundColor: Colors.neutral[200],
    borderRadius: 9999,
    overflow: 'hidden',
  },
  linearProgress: {
    borderRadius: 9999,
  },
  
  // Dots Indicator
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 9999,
    marginHorizontal: Spacing.xs / 2,
  },
  
  // Text
  text: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
});

export default ProgressIndicator;

