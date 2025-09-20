import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  View,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { lightTheme } from '../theme/enhancedTokens';
import { useHapticFeedback } from '../utils/hapticFeedback';
import { animationConfig } from '../animations/enhancedAnimations';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: boolean;
  animationType?: 'scale' | 'opacity' | 'elevation' | 'none';
  rippleColor?: string;
}

// Botão interativo com estados visuais e feedback háptico
export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  animationType = 'scale',
  rippleColor,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(2)).current;
  const haptics = useHapticFeedback();

  const theme = lightTheme;

  // Estilos base por variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.error,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };

  // Estilos por tamanho
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          minHeight: 36,
        };
      case 'md':
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[6],
          minHeight: 48,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[8],
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[6],
          minHeight: 48,
        };
    }
  };

  // Cor do texto baseada na variante
  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return theme.colors.textPrimary;
    }
    return theme.colors.textOnPrimary;
  };

  // Animações de press
  const animatePress = (pressed: boolean) => {
    const animations = [];

    if (animationType === 'scale') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: pressed ? 0.95 : 1,
          duration: animationConfig.duration.fast,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'opacity') {
      animations.push(
        Animated.timing(opacityAnim, {
          toValue: pressed ? 0.7 : 1,
          duration: animationConfig.duration.fast,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'elevation') {
      animations.push(
        Animated.timing(elevationAnim, {
          toValue: pressed ? 0 : 4,
          duration: animationConfig.duration.fast,
          useNativeDriver: false,
        })
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    setIsPressed(true);
    animatePress(true);
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    setIsPressed(false);
    animatePress(false);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      haptics.onButtonPress(variant === 'destructive');
    }
    
    onPress?.(event);
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      haptics.onLongPress();
    }
    
    onLongPress?.(event);
  };

  const animatedStyle = {
    transform: animationType === 'scale' ? [{ scale: scaleAnim }] : undefined,
    opacity: animationType === 'opacity' ? opacityAnim : undefined,
    elevation: animationType === 'elevation' ? elevationAnim : undefined,
  };

  const buttonStyle = [
    {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    },
    getVariantStyles(),
    getSizeStyles(),
    disabled && { opacity: 0.5 },
    style,
    animatedStyle,
  ];

  const finalTextStyle = [
    {
      color: getTextColor(),
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
    },
    textStyle,
  ];

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled || loading}
      android_ripple={{
        color: rippleColor || theme.colors.hover,
        borderless: false,
      }}
    >
      <Animated.View style={buttonStyle}>
        {typeof children === 'string' ? (
          <Text style={finalTextStyle}>{children}</Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
};

interface InteractiveCardProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  disabled?: boolean;
  hapticFeedback?: boolean;
  animationType?: 'scale' | 'elevation' | 'none';
}

// Card interativo com estados visuais
export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  variant = 'default',
  disabled = false,
  hapticFeedback = true,
  animationType = 'elevation',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(2)).current;
  const haptics = useHapticFeedback();

  const theme = lightTheme;

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.lg,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.base,
        };
    }
  };

  const animatePress = (pressed: boolean) => {
    const animations = [];

    if (animationType === 'scale') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: pressed ? 0.98 : 1,
          duration: animationConfig.duration.fast,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'elevation') {
      animations.push(
        Animated.timing(elevationAnim, {
          toValue: pressed ? 8 : 2,
          duration: animationConfig.duration.fast,
          useNativeDriver: false,
        })
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    setIsPressed(true);
    animatePress(true);
  };

  const handlePressOut = () => {
    if (disabled) return;
    setIsPressed(false);
    animatePress(false);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    
    if (hapticFeedback) {
      haptics.onButtonPress();
    }
    
    onPress?.(event);
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    if (disabled) return;
    
    if (hapticFeedback) {
      haptics.onLongPress();
    }
    
    onLongPress?.(event);
  };

  const animatedStyle = {
    transform: animationType === 'scale' ? [{ scale: scaleAnim }] : undefined,
    elevation: animationType === 'elevation' ? elevationAnim : undefined,
  };

  const cardStyle = [
    {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
    },
    getVariantStyles(),
    disabled && { opacity: 0.5 },
    style,
    animatedStyle,
  ];

  if (!onPress && !onLongPress) {
    return <Animated.View style={cardStyle}>{children}</Animated.View>;
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled}
      android_ripple={{
        color: theme.colors.hover,
        borderless: false,
      }}
    >
      <Animated.View style={cardStyle}>{children}</Animated.View>
    </Pressable>
  );
};

interface InteractiveToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  hapticFeedback?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

// Toggle switch interativo
export const InteractiveToggle: React.FC<InteractiveToggleProps> = ({
  value,
  onValueChange,
  style,
  size = 'md',
  disabled = false,
  hapticFeedback = true,
  activeColor,
  inactiveColor,
}) => {
  const translateAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const haptics = useHapticFeedback();

  const theme = lightTheme;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          width: 40,
          height: 24,
          borderRadius: 12,
          thumbSize: 18,
          thumbMargin: 3,
        };
      case 'md':
        return {
          width: 50,
          height: 30,
          borderRadius: 15,
          thumbSize: 24,
          thumbMargin: 3,
        };
      case 'lg':
        return {
          width: 60,
          height: 36,
          borderRadius: 18,
          thumbSize: 30,
          thumbMargin: 3,
        };
      default:
        return {
          width: 50,
          height: 30,
          borderRadius: 15,
          thumbSize: 24,
          thumbMargin: 3,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  React.useEffect(() => {
    Animated.timing(translateAnim, {
      toValue: value ? 1 : 0,
      duration: animationConfig.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (disabled) return;

    if (hapticFeedback) {
      haptics.onToggle();
    }

    // Animação de feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    onValueChange(!value);
  };

  const thumbTranslateX = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sizeStyles.width - sizeStyles.thumbSize - sizeStyles.thumbMargin * 2],
  });

  const trackColor = value 
    ? (activeColor || theme.colors.primary)
    : (inactiveColor || theme.colors.border);

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View
        style={[
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            borderRadius: sizeStyles.borderRadius,
            backgroundColor: trackColor,
            justifyContent: 'center',
            padding: sizeStyles.thumbMargin,
          },
          disabled && { opacity: 0.5 },
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={{
            width: sizeStyles.thumbSize,
            height: sizeStyles.thumbSize,
            borderRadius: sizeStyles.thumbSize / 2,
            backgroundColor: theme.colors.surface,
            ...theme.shadows.sm,
            transform: [{ translateX: thumbTranslateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

interface InteractiveSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  disabled?: boolean;
  hapticFeedback?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

// Slider interativo (implementação básica)
export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  style,
  trackStyle,
  thumbStyle,
  disabled = false,
  hapticFeedback = true,
  activeColor,
  inactiveColor,
}) => {
  const haptics = useHapticFeedback();
  const theme = lightTheme;

  // Implementação simplificada - em um projeto real, usaria uma biblioteca como react-native-slider
  const handlePress = () => {
    if (disabled) return;
    
    if (hapticFeedback) {
      haptics.onButtonPress();
    }
  };

  return (
    <View style={[{ height: 40, justifyContent: 'center' }, style]}>
      <View
        style={[
          {
            height: 4,
            backgroundColor: inactiveColor || theme.colors.border,
            borderRadius: 2,
          },
          trackStyle,
        ]}
      >
        <View
          style={{
            height: 4,
            backgroundColor: activeColor || theme.colors.primary,
            borderRadius: 2,
            width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[
          {
            position: 'absolute',
            left: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
            marginLeft: -12,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: activeColor || theme.colors.primary,
            ...theme.shadows.sm,
          },
          disabled && { opacity: 0.5 },
          thumbStyle,
        ]}
      />
    </View>
  );
};

export default {
  InteractiveButton,
  InteractiveCard,
  InteractiveToggle,
  InteractiveSlider,
};

