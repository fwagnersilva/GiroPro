import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, spacing, borderRadius, shadows, typography } from '../theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

// Componente de Skeleton Loading
export const FuelingCardSkeleton: React.FC = () => {
  const shimmerAnimation = new Animated.Value(0);

  React.useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, []);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonMainInfo}>
          <Animated.View 
            style={[styles.skeletonTextLarge, { opacity: shimmerOpacity }]} 
          />
          <Animated.View 
            style={[styles.skeletonTextMedium, { opacity: shimmerOpacity }]} 
          />
          <Animated.View 
            style={[styles.skeletonTextSmall, { opacity: shimmerOpacity }]} 
          />
        </View>
        <Animated.View 
          style={[styles.skeletonBadge, { opacity: shimmerOpacity }]} 
        />
      </View>
      
      <View style={styles.skeletonMetrics}>
        <Animated.View 
          style={[styles.skeletonPrimaryMetric, { opacity: shimmerOpacity }]} 
        />
        <View style={styles.skeletonSecondaryMetrics}>
          <Animated.View 
            style={[styles.skeletonSecondaryMetric, { opacity: shimmerOpacity }]} 
          />
          <Animated.View 
            style={[styles.skeletonSecondaryMetric, { opacity: shimmerOpacity }]} 
          />
        </View>
      </View>
    </View>
  );
};

// Componente de Chip de Filtro
interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  isActive, 
  onPress, 
  icon 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={isActive ? lightTheme.colors.surface : lightTheme.colors.textSecondary} 
        />
      )}
      <Text style={[
        styles.filterChipText,
        isActive && styles.filterChipTextActive
      ]}>
        {label}
      </Text>
      {isActive && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons 
            name="close" 
            size={14} 
            color={lightTheme.colors.surface} 
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// Componente de Estatística Rápida
interface QuickStatProps {
  icon: string;
  value: string;
  label: string;
  color: string;
  onPress?: () => void;
}

export const QuickStat: React.FC<QuickStatProps> = ({ 
  icon, 
  value, 
  label, 
  color, 
  onPress 
}) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={styles.quickStatItem} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.quickStatIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.quickStatValue}>{value}</Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </Component>
  );
};

// Componente de Seção de Lista
interface ListSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ListSection: React.FC<ListSectionProps> = ({ 
  title, 
  subtitle, 
  children 
}) => {
  return (
    <View style={styles.listSection}>
      <View style={styles.listSectionHeader}>
        <Text style={styles.listSectionTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.listSectionSubtitle}>{subtitle}</Text>
        )}
      </View>
      {children}
    </View>
  );
};

// Componente de Ação Swipe
interface SwipeActionProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

export const SwipeAction: React.FC<SwipeActionProps> = ({ 
  icon, 
  label, 
  color, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[styles.swipeAction, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={20} color={lightTheme.colors.surface} />
      <Text style={styles.swipeActionText}>{label}</Text>
    </TouchableOpacity>
  );
};

// Componente de Estado Vazio Personalizado
interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  subtitle, 
  actionLabel, 
  onActionPress 
}) => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name={icon as any} size={80} color={lightTheme.colors.textTertiary} />
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity
          style={styles.emptyStateAction}
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyStateActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Skeleton Styles
  skeletonCard: {
    backgroundColor: lightTheme.colors.surface,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.base,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  skeletonMainInfo: {
    flex: 1,
    gap: spacing[2],
  },
  skeletonTextLarge: {
    height: 20,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    width: '80%',
  },
  skeletonTextMedium: {
    height: 16,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    width: '60%',
  },
  skeletonTextSmall: {
    height: 14,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    width: '40%',
  },
  skeletonBadge: {
    height: 32,
    width: 80,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.full,
  },
  skeletonMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  skeletonPrimaryMetric: {
    height: 32,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
    flex: 1,
  },
  skeletonSecondaryMetrics: {
    gap: spacing[2],
  },
  skeletonSecondaryMetric: {
    height: 20,
    width: 60,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.sm,
  },

  // Filter Chip Styles
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: lightTheme.colors.borderLight,
    gap: spacing[2],
  },
  filterChipActive: {
    backgroundColor: lightTheme.colors.primary,
    borderColor: lightTheme.colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: lightTheme.colors.surface,
  },

  // Quick Stat Styles
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  quickStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },
  quickStatLabel: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },

  // List Section Styles
  listSection: {
    marginBottom: spacing[4],
  },
  listSectionHeader: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: lightTheme.colors.surfaceVariant,
  },
  listSectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  listSectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[1],
  },

  // Swipe Action Styles
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    paddingHorizontal: spacing[2],
  },
  swipeActionText: {
    color: lightTheme.colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[1],
    textAlign: 'center',
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  emptyStateIcon: {
    marginBottom: spacing[6],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  emptyStateSubtitle: {
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
    marginBottom: spacing[6],
  },
  emptyStateAction: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  emptyStateActionText: {
    color: lightTheme.colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

