import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme, spacing, borderRadius, shadows } from '../theme/tokens';

interface ExpenseWithVehicle {
  id: string;
  data_despesa: string;
  tipo_despesa: string;
  valor_despesa: number;
  descricao?: string;
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

interface EnhancedExpenseCardProps {
  expense: ExpenseWithVehicle;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
  getExpenseTypeLabel: (type: string) => string;
  getExpenseTypeIcon: (type: string) => string;
  getExpenseTypeColor: (type: string) => string;
}

const EnhancedExpenseCard: React.FC<EnhancedExpenseCardProps> = ({
  expense,
  onPress,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
  getExpenseTypeLabel,
  getExpenseTypeIcon,
  getExpenseTypeColor,
}) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            ...shadows.base,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityLabel={`Despesa de ${formatCurrency(expense.valor_despesa)} em ${formatDate(expense.data_despesa)}`}
        accessibilityRole="button"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.date, { color: theme.colors.text }]}>
              {formatDate(expense.data_despesa)}
            </Text>
          </View>
          
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getExpenseTypeColor(expense.tipo_despesa) }
          ]}>
            <Ionicons 
              name={getExpenseTypeIcon(expense.tipo_despesa) as any} 
              size={14} 
              color="#FFF" 
            />
            <Text style={styles.categoryText}>
              {getExpenseTypeLabel(expense.tipo_despesa)}
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        {expense.veiculo_marca && (
          <View style={styles.vehicleContainer}>
            <Ionicons 
              name="car-outline" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.vehicleText, { color: theme.colors.textSecondary }]}>
              {expense.veiculo_marca} {expense.veiculo_modelo} • {expense.veiculo_placa}
            </Text>
          </View>
        )}

        {/* Amount */}
        <View style={styles.amountContainer}>
          <View style={styles.amountRow}>
            <Ionicons 
              name="wallet-outline" 
              size={20} 
              color={theme.colors.error} 
            />
            <Text style={[styles.amount, { color: theme.colors.error }]}>
              {formatCurrency(expense.valor_despesa)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {expense.descricao && (
          <View style={styles.descriptionContainer}>
            <Text 
              style={[styles.description, { color: theme.colors.textSecondary }]}
              numberOfLines={2}
            >
              {expense.descricao}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={[styles.actions, { borderTopColor: theme.colors.borderLight }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primaryLight }]}
            onPress={onEdit}
            accessibilityLabel="Editar despesa"
            accessibilityRole="button"
          >
            <Ionicons name="pencil-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.colors.error}15` }]}
            onPress={onDelete}
            accessibilityLabel="Excluir despesa"
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
            <Text style={[styles.actionText, { color: theme.colors.error }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    gap: spacing[1],
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountContainer: {
    marginBottom: spacing[3],
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
  },
  descriptionContainer: {
    marginBottom: spacing[3],
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    gap: spacing[2],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    minHeight: 44,
    gap: spacing[1],
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EnhancedExpenseCard;

