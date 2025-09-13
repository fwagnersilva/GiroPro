import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { lightTheme, spacing, borderRadius, shadows } from '../theme/tokens';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  shimmerColors?: string[];
  duration?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const EnhancedSkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius: borderRadiusValue = 8,
  style,
  shimmerColors = [lightTheme.colors.surfaceVariant, lightTheme.colors.border, lightTheme.colors.surfaceVariant],
  duration = 1500,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue, duration]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: shimmerColors,
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadiusValue,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Componente para skeleton do card principal do dashboard
export const MainCardSkeleton: React.FC = () => (
  <View style={styles.mainCardSkeleton}>
    <View style={styles.mainCardHeader}>
      <EnhancedSkeletonLoader width={48} height={48} borderRadius={24} />
      <View style={styles.mainCardHeaderText}>
        <EnhancedSkeletonLoader width={120} height={16} />
        <EnhancedSkeletonLoader width={80} height={12} style={{ marginTop: spacing[1] }} />
      </View>
    </View>
    
    <EnhancedSkeletonLoader 
      width={200} 
      height={32} 
      style={{ marginVertical: spacing[4] }} 
    />
    
    <View style={styles.mainCardFooter}>
      <EnhancedSkeletonLoader width={100} height={12} />
      <EnhancedSkeletonLoader width={60} height={16} />
    </View>
  </View>
);

// Componente para skeleton de card secundário
export const SecondaryCardSkeleton: React.FC = () => (
  <View style={styles.secondaryCardSkeleton}>
    <View style={styles.secondaryCardHeader}>
      <EnhancedSkeletonLoader width={32} height={32} borderRadius={16} />
      <EnhancedSkeletonLoader width={80} height={12} />
    </View>
    
    <EnhancedSkeletonLoader 
      width={120} 
      height={20} 
      style={{ marginVertical: spacing[2] }} 
    />
    
    <EnhancedSkeletonLoader width={100} height={12} />
  </View>
);

// Componente para skeleton de ação rápida
export const QuickActionSkeleton: React.FC = () => (
  <View style={styles.quickActionSkeleton}>
    <EnhancedSkeletonLoader width={24} height={24} borderRadius={12} />
    <EnhancedSkeletonLoader 
      width={80} 
      height={14} 
      style={{ marginTop: spacing[2] }} 
    />
    <EnhancedSkeletonLoader 
      width={100} 
      height={11} 
      style={{ marginTop: spacing[1] }} 
    />
  </View>
);

// Componente para skeleton de item de despesa
export const ExpenseItemSkeleton: React.FC = () => (
  <View style={styles.expenseItemSkeleton}>
    <EnhancedSkeletonLoader width={150} height={14} />
    <EnhancedSkeletonLoader width={80} height={14} />
  </View>
);

// Componente para skeleton do seletor de período
export const PeriodSelectorSkeleton: React.FC = () => (
  <View style={styles.periodSelectorSkeleton}>
    {[1, 2, 3, 4].map((index) => (
      <View key={index} style={styles.periodButtonSkeleton}>
        <EnhancedSkeletonLoader width={16} height={16} borderRadius={8} />
        <EnhancedSkeletonLoader width={60} height={12} style={{ marginLeft: spacing[1] }} />
      </View>
    ))}
  </View>
);

// Componente para skeleton completo do dashboard
export const DashboardSkeleton: React.FC = () => (
  <View style={styles.dashboardSkeleton}>
    {/* Header Skeleton */}
    <View style={styles.headerSkeleton}>
      <EnhancedSkeletonLoader width={200} height={24} />
      <EnhancedSkeletonLoader width={120} height={16} style={{ marginTop: spacing[1] }} />
    </View>

    {/* Period Selector Skeleton */}
    <PeriodSelectorSkeleton />

    {/* Quick Actions Skeleton */}
    <View style={styles.quickActionsSkeleton}>
      <EnhancedSkeletonLoader width={120} height={18} style={{ marginBottom: spacing[3] }} />
      <View style={styles.quickActionsGrid}>
        <QuickActionSkeleton />
        <QuickActionSkeleton />
        <QuickActionSkeleton />
        <QuickActionSkeleton />
      </View>
    </View>

    {/* Main Card Skeleton */}
    <MainCardSkeleton />

    {/* Secondary Cards Skeleton */}
    <View style={styles.secondaryCardsContainer}>
      <SecondaryCardSkeleton />
      <SecondaryCardSkeleton />
      <SecondaryCardSkeleton />
      <SecondaryCardSkeleton />
    </View>

    {/* Expense Items Skeleton */}
    <View style={styles.expensesSkeleton}>
      <EnhancedSkeletonLoader width={180} height={18} style={{ marginBottom: spacing[3] }} />
      <ExpenseItemSkeleton />
      <ExpenseItemSkeleton />
      <ExpenseItemSkeleton />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: lightTheme.colors.surfaceVariant,
  },
  
  // Main Card Skeleton
  mainCardSkeleton: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    margin: spacing[4],
    marginTop: 0,
    ...shadows.lg,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  mainCardHeaderText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    paddingTop: spacing[4],
  },

  // Secondary Card Skeleton
  secondaryCardSkeleton: {
    width: isTablet ? '48%' : '48%',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.base,
  },
  secondaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  secondaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing[3],
    margin: spacing[4],
    marginTop: 0,
  },

  // Quick Action Skeleton
  quickActionSkeleton: {
    width: isTablet ? '48%' : '48%',
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionsSkeleton: {
    margin: spacing[4],
    marginTop: 0,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing[3],
  },

  // Expense Item Skeleton
  expenseItemSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  expensesSkeleton: {
    margin: spacing[4],
    marginTop: spacing[6],
  },

  // Period Selector Skeleton
  periodSelectorSkeleton: {
    flexDirection: 'row',
    backgroundColor: lightTheme.colors.surface,
    margin: spacing[4],
    borderRadius: borderRadius.md,
    padding: spacing[1],
    ...shadows.base,
  },
  periodButtonSkeleton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },

  // Header Skeleton
  headerSkeleton: {
    backgroundColor: lightTheme.colors.primary,
    padding: spacing[5],
    paddingTop: spacing[12],
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },

  // Dashboard Skeleton
  dashboardSkeleton: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
});

export default EnhancedSkeletonLoader;

