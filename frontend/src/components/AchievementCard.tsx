import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/designTokens';
import { formatDate } from '../utils/formatters';

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  tipo_conquista: 'Faturamento' | 'Quilometragem' | 'Jornadas' | 'Eficiencia' | 'Consistencia' | 'Metas' | 'Especial';
  raridade: 'Comum' | 'Raro' | 'Epico' | 'Lendario';
  icone: string;
  cor: string;
  criterio_valor?: number;
  criterio_descricao?: string;
  pontos_recompensa: number;
  desbloqueada: boolean;
  data_desbloqueio?: string;
  valor_atingido?: number;
  progresso_atual?: number;
  progresso_total?: number;
}

interface AchievementCardProps {
  conquista: Conquista;
  onPress?: (conquista: Conquista) => void;
  animated?: boolean;
}

type AchievementStatus = 'unlocked' | 'in_progress' | 'locked';

const AchievementCard: React.FC<AchievementCardProps> = ({
  conquista,
  onPress,
  animated = false
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const getAchievementStatus = (): AchievementStatus => {
    if (conquista.desbloqueada) return 'unlocked';
    if (conquista.progresso_atual && conquista.progresso_atual > 0) return 'in_progress';
    return 'locked';
  };

  const getRaridadeColors = () => {
    switch (conquista.raridade) {
      case 'Comum': 
        return {
          border: colors.neutral[400],
          background: colors.neutral[100],
          text: colors.neutral[700],
          gradient: [colors.neutral[300], colors.neutral[400]]
        };
      case 'Raro': 
        return {
          border: colors.primary[500],
          background: colors.primary[50],
          text: colors.primary[700],
          gradient: [colors.primary[400], colors.primary[600]]
        };
      case 'Epico': 
        return {
          border: colors.secondary[500],
          background: colors.secondary[50],
          text: colors.secondary[700],
          gradient: [colors.secondary[400], colors.secondary[600]]
        };
      case 'Lendario': 
        return {
          border: colors.warning[500],
          background: colors.warning[50],
          text: colors.warning[700],
          gradient: [colors.warning[400], colors.warning[600]]
        };
      default: 
        return {
          border: colors.neutral[400],
          background: colors.neutral[100],
          text: colors.neutral[700],
          gradient: [colors.neutral[300], colors.neutral[400]]
        };
    }
  };

  const status = getAchievementStatus();
  const raridadeColors = getRaridadeColors();
  const progressPercentage = conquista.progresso_total ? 
    ((conquista.progresso_atual || 0) / conquista.progresso_total) * 100 : 0;

  const handlePress = () => {
    if (animated) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onPress?.(conquista);
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'unlocked':
        return (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedBadgeText}>✓</Text>
          </View>
        );
      case 'locked':
        return (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedBadgeText}>🔒</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderProgressSection = () => {
    if (status !== 'in_progress' || !conquista.progresso_total) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Progresso: {conquista.progresso_atual || 0} / {conquista.progresso_total}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: raridadeColors.border
              }
            ]}
          />
        </View>
      </View>
    );
  };

  const renderUnlockedInfo = () => {
    if (status !== 'unlocked' || !conquista.data_desbloqueio) return null;

    return (
      <View style={styles.unlockedInfo}>
        <Text style={styles.unlockedDate}>
          Desbloqueada em: {formatDate(conquista.data_desbloqueio)}
        </Text>
        {conquista.valor_atingido && (
          <Text style={styles.unlockedValue}>
            Valor atingido: {conquista.valor_atingido}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: animatedValue }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: raridadeColors.border,
            opacity: status === 'locked' ? 0.7 : 1,
          },
          status === 'unlocked' && styles.cardUnlocked
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Conquista ${conquista.nome}. ${conquista.descricao}. ${
          status === 'unlocked' ? 'Desbloqueada' : 
          status === 'in_progress' ? `Em progresso: ${Math.round(progressPercentage)}%` : 
          'Bloqueada'
        }`}
        accessibilityHint={status === 'locked' ? 'Toque para ver os requisitos' : 'Toque para ver detalhes'}
        activeOpacity={0.8}
      >
        {/* Header com ícone e informações principais */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={[
              styles.iconBackground,
              { backgroundColor: raridadeColors.background }
            ]}>
              <Text style={[
                styles.icon,
                { color: raridadeColors.text }
              ]}>
                {conquista.icone}
              </Text>
            </View>
            {renderStatusBadge()}
          </View>
          
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {conquista.nome}
            </Text>
            <Text style={styles.description} numberOfLines={3}>
              {conquista.descricao}
            </Text>
            
            <View style={styles.meta}>
              <View style={[
                styles.rarityBadge,
                { backgroundColor: raridadeColors.border }
              ]}>
                <Text style={styles.rarityText}>{conquista.raridade}</Text>
              </View>
              <Text style={styles.pointsText}>+{conquista.pontos_recompensa} pts</Text>
            </View>
          </View>
        </View>

        {/* Seção de progresso */}
        {renderProgressSection()}

        {/* Critério de conquista */}
        {conquista.criterio_descricao && (
          <Text style={styles.criteriaText}>{conquista.criterio_descricao}</Text>
        )}

        {/* Informações de desbloqueio */}
        {renderUnlockedInfo()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    ...shadows.md,
  },
  cardUnlocked: {
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    color: colors.neutral[0],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  lockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.neutral[500],
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBadgeText: {
    fontSize: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.fontSize.base,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rarityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rarityText: {
    color: colors.neutral[0],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  pointsText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },
  progressContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
  },
  progressPercentage: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  criteriaText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    fontStyle: 'italic',
    marginTop: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
  unlockedInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  unlockedDate: {
    fontSize: typography.fontSize.xs,
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
  },
  unlockedValue: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
});

export default AchievementCard;

