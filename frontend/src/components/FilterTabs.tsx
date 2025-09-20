import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/designTokens';

interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
  style?: any;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  selectedKey,
  onSelect,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isActive = selectedKey === option.key;
          
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.tab,
                isActive && styles.tabActive
              ]}
              onPress={() => onSelect(option.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${option.label}${option.count !== undefined ? `. ${option.count} itens` : ''}`}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.tabTextActive
              ]}>
                {option.label}
              </Text>
              {option.count !== undefined && (
                <Text style={[
                  styles.tabCount,
                  isActive && styles.tabCountActive
                ]}>
                  {option.count}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[0],
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    minHeight: 44, // Acessibilidade - touch target mínimo
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    ...shadows.sm,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.semibold,
  },
  tabCount: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    marginTop: 2,
  },
  tabCountActive: {
    color: colors.neutral[200],
  },
});

export default FilterTabs;

