import React, { forwardRef } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName = '',
      inputClassName = '',
      labelClassName = '',
      errorClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <View className={`mb-4 ${containerClassName}`}>
        {label && (
          <Text className={`text-gray-700 text-sm font-medium mb-2 ${labelClassName}`}>
            {label}
          </Text>
        )}
        
        <View className="relative">
          {leftIcon && (
            <View className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              {leftIcon}
            </View>
          )}
          
          <TextInput
            ref={ref}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg
              bg-white text-gray-900 text-base
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
              ${inputClassName}
            `}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
          
          {rightIcon && (
            <View className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
              {rightIcon}
            </View>
          )}
        </View>
        
        {error && (
          <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;

