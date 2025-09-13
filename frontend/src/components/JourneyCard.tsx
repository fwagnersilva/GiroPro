import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Journey, 
  JourneyCardProps,
  JOURNEY_STATUS_LABELS,
  JOURNEY_STATUS_COLORS,
  JOURNEY_STATUS_ICONS 
} from '../types/journey';
import { typography, spacing } from '../styles/responsive';
import { lightTheme } from '../theme/tokens';

const JourneyCard: React.FC<JourneyCardProps> = ({ 
  journey, 
  onPress, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  const getStatusColor = (status: Journey['status']) => {
    return JOURNEY_STATUS_COLORS[status] || lightTheme.colors.textSecondary;
  };

  const getStatusIcon = (status: Journey['status']) => {
    return JOURNEY_STATUS_ICONS[status] || 'help-circle';
  };

  const getStatusText = (status: Journey['status']) => {
    return JOURNEY_STATUS_LABELS[status] || 'Desconhecido';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}k km`;
    }
    return `${distance} km`;
  };

  const getEfficiencyColor = (consumption: number) => {
    // Cores baseadas na eficiência (verde = eficiente, vermelho = ineficiente)
    if (consumption <= 8) return lightTheme.colors.success;
    if (consumption <= 12) return lightTheme.colors.warning;
    return lightTheme.colors.error;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Jornada ${journey.title}, ${getStatusText(journey.status)}`}
      accessibilityHint="Toque para ver detalhes da jornada"
    >
      {/* Header com rota e status */}
      <View style={styles.header}>
        <View style={styles.routeContainer}>
          <Ionicons 
            name="car-outline" 
            size={20} 
            color={lightTheme.colors.primary} 
          />
          <View style={styles.routeInfo}>
            <Text style={styles.routeText} numberOfLines={1}>
              {journey.origin} → {journey.destination}
            </Text>
            {journey.title && (
              <Text style={styles.titleText} numberOfLines={1}>
                {journey.title}
              </Text>
            )}
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(journey.status) }]}>
          <Ionicons 
            name={getStatusIcon(journey.status) as any} 
            size={12} 
            color={lightTheme.colors.surface} 
          />
          <Text style={styles.statusText}>{getStatusText(journey.status)}</Text>
        </View>
      </View>

      {/* Métricas principais */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={lightTheme.colors.textSecondary} 
            />
            <Text style={styles.metricLabel}>Duração</Text>
            <Text style={styles.metricValue}>{journey.duration}</Text>
          </View>
          
          <View style={styles.metric}>
            <Ionicons 
              name="speedometer-outline" 
              size={16} 
              color={lightTheme.colors.textSecondary} 
            />
            <Text style={styles.metricLabel}>Distância</Text>
            <Text style={styles.metricValue}>{formatDistance(journey.distance)}</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Ionicons 
              name="water-outline" 
              size={16} 
              color={getEfficiencyColor(journey.fuelConsumption)} 
            />
            <Text style={styles.metricLabel}>Consumo</Text>
            <Text style={[styles.metricValue, { color: getEfficiencyColor(journey.fuelConsumption) }]}>
              {journey.fuelConsumption.toFixed(1)} L/100km
            </Text>
          </View>
          
          <View style={styles.metric}>
            <Ionicons 
              name="cash-outline" 
              size={16} 
              color={lightTheme.colors.textSecondary} 
            />
            <Text style={styles.metricLabel}>Custo</Text>
            <Text style={styles.metricValue}>{formatCurrency(journey.cost)}</Text>
          </View>
        </View>
      </View>

      {/* Tags (se existirem) */}
      {journey.tags && journey.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {journey.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {journey.tags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{journey.tags.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer com data e ações */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>{journey.date}</Text>
        
        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                accessible={true}
                accessibilityLabel="Editar jornada"
              >
                <Ionicons name="pencil-outline" size={18} color={lightTheme.colors.primary} />
              </TouchableOpacity>
            )}
            
            {onDelete && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                accessible={true}
                accessibilityLabel="Excluir jornada"
              >
                <Ionicons name="trash-outline" size={18} color={lightTheme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Notas (se existirem) */}
      {journey.notes && (
        <View style={styles.notesContainer}>
          <Ionicons 
            name="document-text-outline" 
            size={14} 
            color={lightTheme.colors.textTertiary} 
          />
          <Text style={styles.notesText} numberOfLines={2}>
            {journey.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...lightTheme.shadows.base,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },

  routeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing[2],
  },

  routeInfo: {
    flex: 1,
    marginLeft: spacing[2],
  },

  routeText: {
    ...typography.h4,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },

  titleText: {
    ...typography.caption,
    color: lightTheme.colors.textSecondary,
    fontStyle: 'italic',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
    gap: spacing[1],
  },

  statusText: {
    ...typography.small,
    color: lightTheme.colors.surface,
    fontWeight: '600',
  },

  metricsContainer: {
    marginBottom: spacing[3],
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },

  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing[1],
  },

  metricLabel: {
    ...typography.small,
    color: lightTheme.colors.textTertiary,
    fontSize: 11,
  },

  metricValue: {
    ...typography.caption,
    color: lightTheme.colors.textSecondary,
    fontWeight: '500',
    marginLeft: 'auto',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    marginBottom: spacing[2],
  },

  tag: {
    backgroundColor: lightTheme.colors.primaryLight,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },

  tagText: {
    ...typography.small,
    color: lightTheme.colors.primary,
    fontSize: 10,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    ...typography.small,
    color: lightTheme.colors.textTertiary,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },

  actionButton: {
    padding: spacing[1],
    borderRadius: 6,
    backgroundColor: lightTheme.colors.surfaceVariant,
  },

  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing[2],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.borderLight,
    gap: spacing[1],
  },

  notesText: {
    ...typography.small,
    color: lightTheme.colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});

export default JourneyCard;

