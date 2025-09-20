import React, { useState } from 'react';
import { createInputStyle, colors, spacing, typography } from '../../styles/designSystem';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  required = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputStyle = createInputStyle(!!error);

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.neutral.text.primary,
          marginBottom: spacing.sm,
          display: 'block'
        }}>
          {label}
          {required && <span style={{ color: colors.secondary.error }}> *</span>}
        </label>
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: colors.neutral.surface,
        border: `1px solid ${error ? colors.secondary.error : isFocused ? colors.primary.main : colors.neutral.border}`,
        borderRadius: '8px',
        minHeight: '48px',
        boxShadow: isFocused ? `0 0 0 2px ${colors.states.focus}` : 'none',
        transition: 'all 0.2s ease'
      }}>
        {leftIcon && (
          <div style={{
            marginLeft: spacing.lg,
            color: error ? colors.secondary.error : isFocused ? colors.primary.main : colors.neutral.text.secondary,
            display: 'flex',
            alignItems: 'center'
          }}>
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontSize: typography.fontSize.base,
            color: colors.neutral.text.primary,
            padding: `${spacing.md} ${spacing.lg}`,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            paddingLeft: leftIcon ? spacing.sm : spacing.lg,
            paddingRight: rightIcon ? spacing.sm : spacing.lg,
            ...style
          }}
        />
        
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            style={{
              padding: spacing.md,
              marginRight: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: error ? colors.secondary.error : isFocused ? colors.primary.main : colors.neutral.text.secondary,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {rightIcon}
          </button>
        )}
      </div>
      
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '6px'
        }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.secondary.error, marginRight: '6px' }}>⚠️</span>
          <span style={{ fontSize: typography.fontSize.sm, color: colors.secondary.error }}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;

