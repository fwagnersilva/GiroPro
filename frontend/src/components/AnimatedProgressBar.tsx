import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { lightTheme, borderRadius } from '../theme/tokens';

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
  duration?: number;
  style?: any;
}

const theme = lightTheme;

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = theme.colors.borderLight,
  progressColor,
  borderRadius: radius = borderRadius.sm,
  duration = 1000,
  style
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Determinar cor baseada no progresso
  const getProgressColor = (percentage: number) => {
    if (progressColor) return progressColor;
    
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 75) return '#8BC34A';
    if (percentage >= 50) return theme.colors.warning;
    if (percentage >= 25) return '#FFC107';
    return theme.colors.error;
  };

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(progress, 100),
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress, duration]);

  return (
    <View style={[styles.container, { height, backgroundColor, borderRadius: radius }, style]}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
            backgroundColor: getProgressColor(progress),
            borderRadius: radius,
          },
        ]}
      />
      
      {/* Efeito de brilho para progresso alto */}
      {progress >= 75 && (
        <Animated.View
          style={[
            styles.shine,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
              borderRadius: radius,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  
  progressFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  
  shine: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.3,
    backgroundColor: '#FFFFFF',
  },
});

export default AnimatedProgressBar;

