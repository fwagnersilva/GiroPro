import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// Mapeamento de ícones Ionicons para emojis/símbolos web
const webIconMap: { [key: string]: string } = {
  // Auth icons
  'mail-outline': '✉️',
  'lock-closed-outline': '🔒',
  'eye-outline': '👁️',
  'eye-off-outline': '🙈',
  'person-outline': '👤',
  
  // Navigation icons
  'home-outline': '🏠',
  'car-outline': '🚗',
  'receipt-outline': '🧾',
  'analytics-outline': '📊',
  'settings-outline': '⚙️',
  
  // Action icons
  'add-outline': '➕',
  'remove-outline': '➖',
  'checkmark-outline': '✅',
  'close-outline': '❌',
  'search-outline': '🔍',
  'filter-outline': '🔽',
  
  // Financial icons
  'card-outline': '💳',
  'cash-outline': '💰',
  'trending-up-outline': '📈',
  'trending-down-outline': '📉',
  
  // Vehicle icons
  'speedometer-outline': '⏱️',
  'location-outline': '📍',
  'time-outline': '🕐',
  
  // Menu icons
  'menu-outline': '☰',
  'ellipsis-vertical-outline': '⋮',
  'chevron-forward-outline': '▶️',
  'chevron-back-outline': '◀️',
  
  // Default fallback
  'default': '●'
};

const WebIcon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  const iconSymbol = webIconMap[name] || webIconMap['default'];
  
  return (
    <span 
      style={{
        fontSize: size,
        color: color,
        display: 'inline-block',
        lineHeight: 1,
        ...style
      }}
    >
      {iconSymbol}
    </span>
  );
};

const Icon: React.FC<IconProps> = (props) => {
  if (Platform.OS === 'web') {
    return <WebIcon {...props} />;
  }
  
  // Para mobile, usar Ionicons normal
  return (
    <Ionicons 
      name={props.name as any} 
      size={props.size} 
      color={props.color}
      style={props.style}
    />
  );
};

export default Icon;

