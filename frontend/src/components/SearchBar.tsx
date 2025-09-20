import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/designTokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
  autoFocus = false,
  style
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[500]}
          autoFocus={autoFocus}
          returnKeyType="search"
          accessibilityLabel="Campo de busca"
          accessibilityHint={`Digite para buscar. ${placeholder}`}
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  clearIcon: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
  },
});

export default SearchBar;

