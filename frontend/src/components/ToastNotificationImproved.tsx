import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, spacing, typography, borderRadius, shadows } from '../theme/tokens';

interface ToastNotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
  position?: 'top' | 'bottom';
  actionLabel?: string;
  onAction?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const ToastNotificationImproved: React.FC<ToastNotificationProps> = ({
  id,
  type,
  message,
  visible,
  duration = 4000,
  onDismiss,
  position = 'top',
  actionLabel,
  onAction,
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const toastConfig = {
    success: {
      backgroundColor: '#34C759',
      icon: 'checkmark-circle',
      iconColor: '#FFFFFF',
    },
    error: {
      backgroundColor: '#FF3B30',
      icon: 'alert-circle',
      iconColor: '#FFFFFF',
    },
    warning: {
      backgroundColor: '#FF9500',
      icon: 'warning',
      iconColor: '#FFFFFF',
    },
    info: {
      backgroundColor: '#007AFF',
      icon: 'information-circle',
      iconColor: '#FFFFFF',
    },
  };

  const config = toastConfig[type];

  useEffect(() => {
    if (visible) {
      // Animação de entrada
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
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    handleDismiss();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
          [position]: position === 'top' ? 
            (Platform.OS === 'ios' ? 60 : 40) : 
            (Platform.OS === 'ios' ? 40 : 20),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={config.icon as any} 
            size={24} 
            color={config.iconColor} 
          />
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          {actionLabel && onAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAction}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress bar para indicar tempo restante */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            transform: [{
              scaleX: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.xl,
    zIndex: 1000,
    overflow: 'hidden',
    maxWidth: isTablet ? 400 : undefined,
    alignSelf: isTablet ? 'center' : 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
    gap: spacing[3],
  },
  iconContainer: {
    marginTop: spacing[1],
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButton: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
  dismissButton: {
    padding: spacing[1],
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ToastNotificationImproved;

