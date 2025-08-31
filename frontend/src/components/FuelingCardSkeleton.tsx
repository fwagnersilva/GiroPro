import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme/designTokens';

interface SkeletonItemProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width = '100%',
  height = 16,
  borderRadius: borderRadius.sm,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View
      style={[
        styles.skeletonContainer,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

interface FuelingCardSkeletonProps {
  style?: any;
}

export const FuelingCardSkeleton: React.FC<FuelingCardSkeletonProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      {/* Header com data e badge */}
      <View style={styles.cardHeader}>
        <View style={styles.cardMainInfo}>
          <View style={styles.cardDateRow}>
            <SkeletonItem width="40%" height={18} />
            <SkeletonItem width={70} height={24} borderRadius={borderRadius.full} />
          </View>
          <SkeletonItem width="55%" height={28} style={{ marginTop: spacing.sm }} />
        </View>
        <SkeletonItem width={40} height={40} borderRadius={borderRadius.md} />
      </View>

      {/* Informações do veículo */}
      <View style={styles.vehicleInfo}>
        <SkeletonItem width={16} height={16} borderRadius={borderRadius.sm} />
        <SkeletonItem width="65%" height={16} style={{ marginLeft: spacing.sm }} />
      </View>

      {/* Detalhes principais */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <SkeletonItem width="50%" height={12} />
            <SkeletonItem width="70%" height={16} style={{ marginTop: spacing.xs }} />
          </View>
          <View style={styles.detailItem}>
            <SkeletonItem width="60%" height={12} />
            <SkeletonItem width="80%" height={16} style={{ marginTop: spacing.xs }} />
          </View>
        </View>

        {/* Informações secundárias */}
        <View style={styles.secondaryInfo}>
          <View style={styles.infoRow}>
            <SkeletonItem width={14} height={14} borderRadius={borderRadius.sm} />
            <SkeletonItem width="45%" height={14} style={{ marginLeft: spacing.sm }} />
          </View>
          <View style={styles.infoRow}>
            <SkeletonItem width={14} height={14} borderRadius={borderRadius.sm} />
            <SkeletonItem width="35%" height={14} style={{ marginLeft: spacing.sm }} />
          </View>
        </View>
      </View>
    </View>
  );
};

interface StatsSkeletonProps {
  style?: any;
}

export const StatsCardSkeleton: React.FC<StatsSkeletonProps> = ({ style }) => {
  return (
    <View style={[styles.statsContainer, style]}>
      <SkeletonItem width="40%" height={20} style={{ marginBottom: spacing.md }} />
      <View style={styles.statsRow}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.statItem}>
            <SkeletonItem width="80%" height={24} />
            <SkeletonItem width="60%" height={14} style={{ marginTop: spacing.xs }} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: colors.neutral[200],
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
    backgroundColor: colors.neutral[300],
  },
  cardContainer: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailsContainer: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
  secondaryInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
});

export default FuelingCardSkeleton;

