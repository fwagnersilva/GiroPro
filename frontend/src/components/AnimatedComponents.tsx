import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, TextStyle } from 'react-native';
import { animationManager, animationConfig } from '../animations/enhancedAnimations';

interface AnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'slideInRight' | 'slideInLeft' | 'scaleIn' | 'bounce';
  duration?: number;
  delay?: number;
  easing?: any;
  onAnimationComplete?: () => void;
}

// Componente de View animada
export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  style,
  animationType = 'fadeIn',
  duration = animationConfig.duration.normal,
  delay = 0,
  easing = animationConfig.easing.easeOut,
  onAnimationComplete,
}) => {
  const animationKey = useRef(`animated-view-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 0);

  useEffect(() => {
    const startAnimation = () => {
      switch (animationType) {
        case 'fadeIn':
          animationManager.fadeIn(animationKey, duration, easing, onAnimationComplete);
          break;
        case 'slideUp':
          animationManager.slideUp(animationKey, 50, duration, easing, onAnimationComplete);
          break;
        case 'slideInRight':
          animationManager.slideInRight(animationKey, 300, duration, easing, onAnimationComplete);
          break;
        case 'slideInLeft':
          animationManager.slideInLeft(animationKey, 300, duration, easing, onAnimationComplete);
          break;
        case 'scaleIn':
          animationManager.scaleIn(animationKey, 0, 1, duration, easing, onAnimationComplete);
          break;
        case 'bounce':
          animationManager.bounce(animationKey, 0.8, 1, duration, onAnimationComplete);
          break;
      }
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      animationManager.stopAnimation(animationKey);
    };
  }, [animationType, duration, delay, easing, onAnimationComplete]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      case 'slideUp':
        return {
          transform: [{ translateY: animatedValue }],
        };
      case 'slideInRight':
        return {
          transform: [{ translateX: animatedValue }],
        };
      case 'slideInLeft':
        return {
          transform: [{ translateX: animatedValue }],
        };
      case 'scaleIn':
        return {
          transform: [{ scale: animatedValue }],
        };
      case 'bounce':
        return {
          transform: [{ scale: animatedValue }],
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'typewriter';
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

// Componente de Text animado
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  animationType = 'fadeIn',
  duration = animationConfig.duration.normal,
  delay = 0,
  onAnimationComplete,
}) => {
  const animationKey = useRef(`animated-text-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 0);

  useEffect(() => {
    const startAnimation = () => {
      switch (animationType) {
        case 'fadeIn':
          animationManager.fadeIn(animationKey, duration, animationConfig.easing.easeOut, onAnimationComplete);
          break;
        case 'slideUp':
          animationManager.slideUp(animationKey, 30, duration, animationConfig.easing.easeOut, onAnimationComplete);
          break;
        case 'typewriter':
          // Para efeito typewriter, usamos uma animação linear
          animationManager.fadeIn(animationKey, duration, animationConfig.easing.linear, onAnimationComplete);
          break;
      }
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      animationManager.stopAnimation(animationKey);
    };
  }, [animationType, duration, delay, onAnimationComplete]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [{ translateY: animatedValue }],
        };
      case 'typewriter':
        return {
          opacity: animatedValue,
        };
      default:
        return {};
    }
  };

  return (
    <Animated.Text style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.Text>
  );
};

interface PulseViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pulseScale?: number;
  duration?: number;
  isActive?: boolean;
}

// Componente com efeito pulse
export const PulseView: React.FC<PulseViewProps> = ({
  children,
  style,
  pulseScale = 1.05,
  duration = animationConfig.duration.slow,
  isActive = true,
}) => {
  const animationKey = useRef(`pulse-view-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 1);

  useEffect(() => {
    if (isActive) {
      animationManager.pulse(animationKey, 1, pulseScale, duration, true);
    } else {
      animationManager.stopAnimation(animationKey);
    }

    return () => {
      animationManager.stopAnimation(animationKey);
    };
  }, [isActive, pulseScale, duration]);

  return (
    <Animated.View style={[style, { transform: [{ scale: animatedValue }] }]}>
      {children}
    </Animated.View>
  );
};

interface ShakeViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  trigger?: boolean;
  intensity?: number;
  duration?: number;
  onShakeComplete?: () => void;
}

// Componente com efeito shake
export const ShakeView: React.FC<ShakeViewProps> = ({
  children,
  style,
  trigger = false,
  intensity = 10,
  duration = animationConfig.duration.normal,
  onShakeComplete,
}) => {
  const animationKey = useRef(`shake-view-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 0);

  useEffect(() => {
    if (trigger) {
      animationManager.shake(animationKey, intensity, duration, onShakeComplete);
    }
  }, [trigger, intensity, duration, onShakeComplete]);

  return (
    <Animated.View style={[style, { transform: [{ translateX: animatedValue }] }]}>
      {children}
    </Animated.View>
  );
};

interface RotatingViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isRotating?: boolean;
  duration?: number;
  clockwise?: boolean;
}

// Componente com rotação
export const RotatingView: React.FC<RotatingViewProps> = ({
  children,
  style,
  isRotating = false,
  duration = animationConfig.duration.verySlow,
  clockwise = true,
}) => {
  const animationKey = useRef(`rotating-view-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 0);

  useEffect(() => {
    if (isRotating) {
      const toDegree = clockwise ? 360 : -360;
      animationManager.rotate(animationKey, 0, toDegree, duration, animationConfig.easing.linear, true);
    } else {
      animationManager.stopAnimation(animationKey);
    }

    return () => {
      animationManager.stopAnimation(animationKey);
    };
  }, [isRotating, duration, clockwise]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[style, { transform: [{ rotate: rotation }] }]}>
      {children}
    </Animated.View>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  style?: ViewStyle;
  staggerDelay?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'scaleIn';
  animationDuration?: number;
  onAllAnimationsComplete?: () => void;
}

// Componente para lista com animações escalonadas
export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  style,
  staggerDelay = 100,
  animationType = 'fadeIn',
  animationDuration = animationConfig.duration.normal,
  onAllAnimationsComplete,
}) => {
  const animationKeys = useRef(
    children.map((_, index) => `staggered-item-${index}-${Math.random()}`)
  ).current;

  useEffect(() => {
    animationManager.stagger(
      animationKeys,
      animationType,
      staggerDelay,
      animationDuration,
      onAllAnimationsComplete
    );

    return () => {
      animationKeys.forEach(key => animationManager.stopAnimation(key));
    };
  }, [animationType, staggerDelay, animationDuration, onAllAnimationsComplete]);

  return (
    <View style={style}>
      {children.map((child, index) => {
        const animatedValue = animationManager.getAnimatedValue(animationKeys[index], 0);
        
        const getAnimatedStyle = () => {
          switch (animationType) {
            case 'fadeIn':
              return { opacity: animatedValue };
            case 'slideUp':
              return { 
                opacity: animatedValue,
                transform: [{ translateY: animatedValue }] 
              };
            case 'scaleIn':
              return { 
                opacity: animatedValue,
                transform: [{ scale: animatedValue }] 
              };
            default:
              return {};
          }
        };

        return (
          <Animated.View key={index} style={getAnimatedStyle()}>
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
};

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
  barStyle?: ViewStyle;
  duration?: number;
  color?: string;
  backgroundColor?: string;
}

// Barra de progresso animada
export const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
  barStyle,
  duration = animationConfig.duration.normal,
  color = '#2196F3',
  backgroundColor = '#E0E0E0',
}) => {
  const animationKey = useRef(`progress-bar-${Math.random()}`).current;
  const animatedValue = animationManager.getAnimatedValue(animationKey, 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: false, // width não pode usar native driver
    }).start();
  }, [progress, duration]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[
      {
        height: 8,
        backgroundColor,
        borderRadius: 4,
        overflow: 'hidden',
      },
      style
    ]}>
      <Animated.View style={[
        {
          height: '100%',
          backgroundColor: color,
          width,
        },
        barStyle
      ]} />
    </View>
  );
};

export default {
  AnimatedView,
  AnimatedText,
  PulseView,
  ShakeView,
  RotatingView,
  StaggeredList,
  AnimatedProgressBar,
};

