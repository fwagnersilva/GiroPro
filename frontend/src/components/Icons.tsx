import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../theme/tokens';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

const theme = lightTheme;

// Ícone de Lixeira
export const TrashIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = theme.colors.textSecondary,
  style 
}) => (
  <View style={[styles.iconContainer, { width: size, height: size }, style]}>
    <Text style={[styles.iconText, { fontSize: size * 0.8, color }]}>🗑</Text>
  </View>
);

// Ícone de Plus
export const PlusIcon: React.FC<IconProps> = ({ 
  size = 20, 
  color = theme.colors.surface,
  style 
}) => (
  <View style={[styles.iconContainer, { width: size, height: size }, style]}>
    <Text style={[styles.iconText, { fontSize: size * 0.8, color, fontWeight: 'bold' }]}>+</Text>
  </View>
);

// Ícone de Target/Meta
export const TargetIcon: React.FC<IconProps> = ({ 
  size = 40, 
  color = theme.colors.primary,
  style 
}) => (
  <View style={[styles.iconContainer, { width: size, height: size }, style]}>
    <Text style={[styles.iconText, { fontSize: size * 0.8, color }]}>🎯</Text>
  </View>
);

// Ícone de Warning
export const WarningIcon: React.FC<IconProps> = ({ 
  size = 40, 
  color = theme.colors.warning,
  style 
}) => (
  <View style={[styles.iconContainer, { width: size, height: size }, style]}>
    <Text style={[styles.iconText, { fontSize: size * 0.8, color }]}>⚠️</Text>
  </View>
);

// Ícones para tipos de meta
export const MoneyIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={[styles.goalTypeIcon, { width: size, height: size }, style]}>
    <Text style={[styles.goalTypeText, { fontSize: size * 0.8 }]}>💰</Text>
  </View>
);

export const RoadIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={[styles.goalTypeIcon, { width: size, height: size }, style]}>
    <Text style={[styles.goalTypeText, { fontSize: size * 0.8 }]}>🛣️</Text>
  </View>
);

export const CarIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={[styles.goalTypeIcon, { width: size, height: size }, style]}>
    <Text style={[styles.goalTypeText, { fontSize: size * 0.8 }]}>🚗</Text>
  </View>
);

export const BulbIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={[styles.goalTypeIcon, { width: size, height: size }, style]}>
    <Text style={[styles.goalTypeText, { fontSize: size * 0.8 }]}>💡</Text>
  </View>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={[styles.goalTypeIcon, { width: size, height: size }, style]}>
    <Text style={[styles.goalTypeText, { fontSize: size * 0.8 }]}>📈</Text>
  </View>
);

// Ícones para status
export const CheckIcon: React.FC<IconProps> = ({ size = 16, style }) => (
  <View style={[styles.statusIcon, { width: size, height: size }, style]}>
    <Text style={[styles.statusText, { fontSize: size * 0.75 }]}>✅</Text>
  </View>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 16, style }) => (
  <View style={[styles.statusIcon, { width: size, height: size }, style]}>
    <Text style={[styles.statusText, { fontSize: size * 0.75 }]}>⏸️</Text>
  </View>
);

export const CompleteIcon: React.FC<IconProps> = ({ size = 16, style }) => (
  <View style={[styles.statusIcon, { width: size, height: size }, style]}>
    <Text style={[styles.statusText, { fontSize: size * 0.75 }]}>🎯</Text>
  </View>
);

export const ExpiredIcon: React.FC<IconProps> = ({ size = 16, style }) => (
  <View style={[styles.statusIcon, { width: size, height: size }, style]}>
    <Text style={[styles.statusText, { fontSize: size * 0.75 }]}>⏰</Text>
  </View>
);

// Função para obter ícone por tipo de meta
export const getGoalTypeIcon = (tipo: string, size: number = 24) => {
  const iconProps = { size };
  
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
export const getStatusIcon = (status: string, size: number = 16) => {
  const iconProps = { size };
  
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
  },
  
  iconText: {
    textAlign: 'center',
  },
  
  goalTypeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
  goalTypeText: {
    textAlign: 'center',
  },
  
  statusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusText: {
    textAlign: 'center',
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
  getGoalTypeIcon,
  getStatusIcon,
};

