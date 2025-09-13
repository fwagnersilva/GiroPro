import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface SkeletonLoaderImprovedProps {
  height?: number;
  width?: number | string;
  borderRadius?: number;
  style?: any;
}

const SkeletonItem: React.FC<SkeletonLoaderImprovedProps> = ({
  height = 20,
  width = '100%',
  borderRadius = 8,
  style,
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
    outputRange: ['#E5E7EB', '#F3F4F6'],
  });

  return (
    <Animated.View
      style={[
        {
          height,
          width,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

export const SkeletonLoaderImproved: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Skeleton para resumo geral */}
      <View style={styles.summaryContainer}>
        <SkeletonItem height={24} width="60%" style={styles.titleSkeleton} />
        <View style={styles.summaryGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.summaryItem}>
              <SkeletonItem height={28} width={40} style={styles.valueSkeleton} />
              <SkeletonItem height={12} width="80%" style={styles.labelSkeleton} />
            </View>
          ))}
        </View>
        <View style={styles.tagsContainer}>
          <SkeletonItem height={14} width="40%" style={styles.tagTitleSkeleton} />
          <View style={styles.tagsRow}>
            <SkeletonItem height={24} width={80} borderRadius={12} style={styles.tagSkeleton} />
            <SkeletonItem height={24} width={100} borderRadius={12} style={styles.tagSkeleton} />
            <SkeletonItem height={24} width={70} borderRadius={12} style={styles.tagSkeleton} />
          </View>
        </View>
      </View>

      {/* Skeleton para controles */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <SkeletonItem height={16} width="30%" />
          <View style={styles.controlsButtons}>
            <SkeletonItem height={28} width={70} borderRadius={8} style={styles.controlButton} />
            <SkeletonItem height={28} width={70} borderRadius={8} style={styles.controlButton} />
            <SkeletonItem height={28} width={80} borderRadius={8} style={styles.controlButton} />
          </View>
        </View>
      </View>

      {/* Skeleton para seção de insights */}
      <View style={styles.section}>
        <SkeletonItem height={20} width="40%" style={styles.sectionTitleSkeleton} />
        
        {/* Cards de insights */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <SkeletonItem height={40} width={40} borderRadius={20} style={styles.iconSkeleton} />
                <View style={styles.titleTextContainer}>
                  <SkeletonItem height={18} width="80%" style={styles.cardTitleSkeleton} />
                  <SkeletonItem height={12} width="50%" style={styles.cardCategorySkeleton} />
                </View>
              </View>
              <View style={styles.cardActions}>
                <SkeletonItem height={20} width={60} borderRadius={10} style={styles.badgeSkeleton} />
                <SkeletonItem height={12} width={12} style={styles.chevronSkeleton} />
              </View>
            </View>
            <SkeletonItem height={16} width="100%" style={styles.descriptionSkeleton} />
            <SkeletonItem height={16} width="85%" style={styles.descriptionSkeleton} />
          </View>
        ))}
      </View>

      {/* Skeleton para seção de recomendações */}
      <View style={styles.section}>
        <SkeletonItem height={20} width="50%" style={styles.sectionTitleSkeleton} />
        
        {/* Cards de recomendações */}
        {[1, 2].map((item) => (
          <View key={item} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <SkeletonItem height={40} width={40} borderRadius={20} style={styles.iconSkeleton} />
                <View style={styles.titleTextContainer}>
                  <SkeletonItem height={18} width="90%" style={styles.cardTitleSkeleton} />
                  <SkeletonItem height={12} width="40%" style={styles.cardCategorySkeleton} />
                </View>
              </View>
              <View style={styles.cardActions}>
                <SkeletonItem height={20} width={50} borderRadius={10} style={styles.badgeSkeleton} />
                <SkeletonItem height={12} width={12} style={styles.chevronSkeleton} />
              </View>
            </View>
            <SkeletonItem height={16} width="100%" style={styles.descriptionSkeleton} />
            <SkeletonItem height={16} width="75%" style={styles.descriptionSkeleton} />
          </View>
        ))}
      </View>

      {/* Skeleton para informações do período */}
      <View style={styles.periodContainer}>
        <SkeletonItem height={16} width="40%" style={styles.periodTitleSkeleton} />
        <SkeletonItem height={12} width="60%" style={styles.periodTextSkeleton} />
        <SkeletonItem height={12} width="30%" style={styles.periodTextSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  titleSkeleton: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  valueSkeleton: {
    marginBottom: 8,
  },
  labelSkeleton: {
    marginBottom: 4,
  },
  tagsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tagTitleSkeleton: {
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
  },
  tagSkeleton: {
    marginRight: 8,
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsButtons: {
    flexDirection: 'row',
  },
  controlButton: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleSkeleton: {
    marginBottom: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  iconSkeleton: {
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  cardTitleSkeleton: {
    marginBottom: 8,
  },
  cardCategorySkeleton: {
    marginBottom: 4,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  badgeSkeleton: {
    marginBottom: 8,
  },
  chevronSkeleton: {
    marginBottom: 4,
  },
  descriptionSkeleton: {
    marginBottom: 4,
  },
  periodContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  periodTitleSkeleton: {
    marginBottom: 8,
  },
  periodTextSkeleton: {
    marginBottom: 4,
  },
});

