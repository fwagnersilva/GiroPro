import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  textClassName?: string;
  loadingColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  containerClassName = '',
  textClassName = '',
  loadingColor,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-blue-600 border-blue-600
          ${isDisabled ? 'bg-blue-300 border-blue-300' : 'active:bg-blue-700'}
        `;
      case 'secondary':
        return `
          bg-gray-600 border-gray-600
          ${isDisabled ? 'bg-gray-300 border-gray-300' : 'active:bg-gray-700'}
        `;
      case 'outline':
        return `
          bg-transparent border-blue-600
          ${isDisabled ? 'border-blue-300' : 'active:bg-blue-50'}
        `;
      case 'ghost':
        return `
          bg-transparent border-transparent
          ${isDisabled ? '' : 'active:bg-gray-100'}
        `;
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 min-h-[36px]';
      case 'md':
        return 'px-4 py-3 min-h-[44px]';
      case 'lg':
        return 'px-6 py-4 min-h-[52px]';
      default:
        return 'px-4 py-3 min-h-[44px]';
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return `text-white ${isDisabled ? 'text-white' : ''}`;
      case 'outline':
        return `text-blue-600 ${isDisabled ? 'text-blue-300' : ''}`;
      case 'ghost':
        return `text-gray-700 ${isDisabled ? 'text-gray-400' : ''}`;
      default:
        return 'text-white';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getLoadingColor = () => {
    if (loadingColor) return loadingColor;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return isDisabled ? '#93C5FD' : '#2563EB';
      case 'ghost':
        return isDisabled ? '#9CA3AF' : '#374151';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      className={`
        border rounded-lg flex-row items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${isDisabled ? 'opacity-60' : ''}
        ${containerClassName}
      `}
      disabled={isDisabled}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoadingColor()}
          className="mr-2"
        />
      ) : (
        leftIcon && <View className="mr-2">{leftIcon}</View>
      )}
      
      <Text
        className={`
          font-medium text-center
          ${getTextVariantStyles()}
          ${getTextSizeStyles()}
          ${textClassName}
        `}
      >
        {loading ? 'Carregando...' : title}
      </Text>
      
      {!loading && rightIcon && (
        <View className="ml-2">{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

