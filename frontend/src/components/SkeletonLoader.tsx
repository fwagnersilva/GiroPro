import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E1E9EE', '#F2F8FC'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Componente para skeleton de card do dashboard
export const DashboardCardSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width={20} height={20} borderRadius={10} />
      <SkeletonLoader width={80} height={12} />
    </View>
    <SkeletonLoader width={120} height={24} style={{ marginTop: 8 }} />
    <SkeletonLoader width={100} height={12} style={{ marginTop: 4 }} />
  </View>
);

// Componente para skeleton de item de lista
export const ListItemSkeleton: React.FC = () => (
  <View style={styles.listItemSkeleton}>
    <View style={styles.listItemHeader}>
      <SkeletonLoader width={100} height={16} />
      <SkeletonLoader width={20} height={20} borderRadius={10} />
    </View>
    <SkeletonLoader width={150} height={12} style={{ marginTop: 8 }} />
    <View style={styles.listItemDetails}>
      <SkeletonLoader width={80} height={12} />
      <SkeletonLoader width={60} height={12} />
    </View>
    <View style={styles.listItemDetails}>
      <SkeletonLoader width={70} height={12} />
      <SkeletonLoader width={90} height={12} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listItemSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default SkeletonLoader;

