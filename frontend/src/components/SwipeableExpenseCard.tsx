import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SwipeableExpenseCardProps {
  expense: any;
  onEdit: () => void;
  onDelete: () => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
  getExpenseTypeLabel: (type: string) => string;
  getExpenseTypeIcon: (type: string) => string;
  getExpenseTypeColor: (type: string) => string;
}

const SwipeableExpenseCard: React.FC<SwipeableExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
  getExpenseTypeLabel,
  getExpenseTypeIcon,
  getExpenseTypeColor,
}) => {
  const translateX = new Animated.Value(0);
  const leftActionOpacity = new Animated.Value(0);
  const rightActionOpacity = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.END) {
      const threshold = 80;
      
      if (translationX > threshold) {
        // Swipe right - Delete action
        Animated.timing(translateX, {
          toValue: 100,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onDelete();
          resetPosition();
        });
      } else if (translationX < -threshold) {
        // Swipe left - Edit action
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onEdit();
          resetPosition();
        });
      } else {
        resetPosition();
      }
    } else if (state === State.ACTIVE) {
      // Update action opacity based on swipe distance
      if (translationX > 0) {
        leftActionOpacity.setValue(Math.min(translationX / 80, 1));
        rightActionOpacity.setValue(0);
      } else {
        rightActionOpacity.setValue(Math.min(Math.abs(translationX) / 80, 1));
        leftActionOpacity.setValue(0);
      }
    }
  };

  const resetPosition = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(leftActionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rightActionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Left Action (Delete) */}
      <Animated.View style={[styles.leftAction, { opacity: leftActionOpacity }]}>
        <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        <Text style={styles.actionText}>Excluir</Text>
      </Animated.View>

      {/* Right Action (Edit) */}
      <Animated.View style={[styles.rightAction, { opacity: rightActionOpacity }]}>
        <Ionicons name="pencil-outline" size={24} color="#FFFFFF" />
        <Text style={styles.actionText}>Editar</Text>
      </Animated.View>

      {/* Main Card */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.expenseCard,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.expenseHeader}>
            <View style={styles.expenseInfo}>
              <View style={styles.expenseTypeContainer}>
                <View style={[
                  styles.expenseTypeIcon,
                  { backgroundColor: getExpenseTypeColor(expense.tipo_despesa) + '20' }
                ]}>
                  <Ionicons
                    name={getExpenseTypeIcon(expense.tipo_despesa) as any}
                    size={20}
                    color={getExpenseTypeColor(expense.tipo_despesa)}
                  />
                </View>
                <View style={styles.expenseTypeInfo}>
                  <Text style={styles.expenseType}>
                    {getExpenseTypeLabel(expense.tipo_despesa)}
                  </Text>
                  <Text style={styles.expenseDate}>{formatDate(expense.data_despesa)}</Text>
                </View>
              </View>
              {expense.veiculo_marca && (
                <Text style={styles.vehicleInfo}>
                  {expense.veiculo_marca} {expense.veiculo_modelo} - {expense.veiculo_placa}
                </Text>
              )}
            </View>
            <View style={styles.expenseAmountContainer}>
              <Text style={styles.valueAmount}>{formatCurrency(expense.valor_despesa)}</Text>
            </View>
          </View>

          {expense.descricao && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText} numberOfLines={2}>
                {expense.descricao}
              </Text>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    position: 'relative',
  },
  leftAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 12,
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  expenseTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseTypeInfo: {
    flex: 1,
  },
  expenseType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 48,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
});

export default SwipeableExpenseCard;

