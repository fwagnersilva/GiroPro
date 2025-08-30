import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme, spacing, borderRadius, shadows } from '../theme/tokens';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  type: ToastType;
  duration?: number;
  onHide: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  type,
  duration = 3000,
  onHide,
}) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Mostrar toast
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide após duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          icon: 'checkmark-circle' as const,
          iconColor: '#FFF',
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          icon: 'close-circle' as const,
          iconColor: '#FFF',
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          icon: 'warning' as const,
          iconColor: '#FFF',
        };
      case 'info':
        return {
          backgroundColor: theme.colors.primary,
          icon: 'information-circle' as const,
          iconColor: '#FFF',
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          icon: 'information-circle' as const,
          iconColor: theme.colors.text,
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            ...shadows.lg,
          },
        ]}
      >
        <Ionicons
          name={config.icon}
          size={24}
          color={config.iconColor}
        />
        <Text style={[styles.message, { color: config.iconColor }]}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={hideToast}
          style={styles.closeButton}
          accessibilityLabel="Fechar notificação"
          accessibilityRole="button"
        >
          <Ionicons
            name="close"
            size={20}
            color={config.iconColor}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing[4],
    right: spacing[4],
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    gap: spacing[3],
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    padding: spacing[1],
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ToastNotification;

