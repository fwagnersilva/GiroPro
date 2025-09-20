import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { lightTheme } from '../theme/tokens';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
  onPress?: () => void;
  disabled?: boolean;
}

const theme = lightTheme;

// Ícone de Lixeira com feedback visual
export const TrashIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = theme.colors.error,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.iconContainer, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="trash-outline" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícone de Plus com animação
export const PlusIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = theme.colors.surface,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.iconContainer, 
        styles.plusContainer,
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.8}
    >
      <Ionicons 
        name="add" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícone de Target/Meta
export const TargetIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.primary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.iconContainer, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <MaterialIcons 
        name="track-changes" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícone de Warning
export const WarningIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.warning,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.iconContainer, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="warning" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícones para tipos de meta
export const MoneyIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.success,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.goalTypeIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <FontAwesome5 
        name="dollar-sign" 
        size={size * 0.8} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const RoadIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.primary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.goalTypeIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <FontAwesome5 
        name="road" 
        size={size * 0.8} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const CarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.secondary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.goalTypeIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="car" 
        size={size * 0.9} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const BulbIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.warning,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.goalTypeIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="bulb" 
        size={size * 0.9} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const ChartIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.info,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.goalTypeIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="bar-chart" 
        size={size * 0.9} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícones para status
export const CheckIcon: React.FC<IconProps> = ({ 
  size = 16, 
  color = theme.colors.success,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.statusIcon, 
        { width: size + 4, height: size + 4 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="checkmark-circle" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const PauseIcon: React.FC<IconProps> = ({ 
  size = 16, 
  color = theme.colors.warning,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.statusIcon, 
        { width: size + 4, height: size + 4 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="pause-circle" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const CompleteIcon: React.FC<IconProps> = ({ 
  size = 16, 
  color = theme.colors.primary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.statusIcon, 
        { width: size + 4, height: size + 4 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <MaterialIcons 
        name="check-circle" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const ExpiredIcon: React.FC<IconProps> = ({ 
  size = 16, 
  color = theme.colors.error,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.statusIcon, 
        { width: size + 4, height: size + 4 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <MaterialIcons 
        name="schedule" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Ícones de navegação
export const HomeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.textPrimary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.navIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="home" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const HistoryIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.textPrimary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.navIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="time" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const AnalyticsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.textPrimary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.navIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="analytics" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

export const SettingsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.textPrimary,
  style,
  onPress,
  disabled = false
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;
  
  return (
    <IconComponent 
      style={[
        styles.navIcon, 
        { width: size + 8, height: size + 8 }, 
        style,
        disabled && styles.disabled
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="settings" 
        size={size} 
        color={disabled ? theme.colors.textSecondary : color} 
      />
    </IconComponent>
  );
};

// Função para obter ícone por tipo de meta
export const getGoalTypeIcon = (tipo: string, size: number = 24, onPress?: () => void) => {
  const iconProps = { size, onPress };
  
  switch (tipo) {
    case 'Faturamento':
      return <MoneyIcon {...iconProps} />;
    case 'Quilometragem':
      return <RoadIcon {...iconProps} />;
    case 'Jornadas':
      return <CarIcon {...iconProps} />;
    case 'Economia':
      return <BulbIcon {...iconProps} />;
    case 'Lucro':
      return <ChartIcon {...iconProps} />;
    default:
      return <ChartIcon {...iconProps} />;
  }
};

// Função para obter ícone por status
export const getStatusIcon = (status: string, size: number = 16, onPress?: () => void) => {
  const iconProps = { size, onPress };
  
  switch (status) {
    case 'Ativa':
      return <CheckIcon {...iconProps} />;
    case 'Pausada':
      return <PauseIcon {...iconProps} />;
    case 'Concluida':
      return <CompleteIcon {...iconProps} />;
    case 'Expirada':
      return <ExpiredIcon {...iconProps} />;
    default:
      return <CheckIcon {...iconProps} />;
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  
  plusContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  goalTypeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  
  statusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  navIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  
  disabled: {
    opacity: 0.5,
  },
});

export default {
  TrashIcon,
  PlusIcon,
  TargetIcon,
  WarningIcon,
  MoneyIcon,
  RoadIcon,
  CarIcon,
  BulbIcon,
  ChartIcon,
  CheckIcon,
  PauseIcon,
  CompleteIcon,
  ExpiredIcon,
  HomeIcon,
  HistoryIcon,
  AnalyticsIcon,
  SettingsIcon,
  getGoalTypeIcon,
  getStatusIcon,
};

