import React from 'react';
import { createButtonStyle } from '../../styles/designSystem';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle = createButtonStyle(variant, size);

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...buttonStyle,
        ...style,
        ...(disabled && {
          opacity: 0.6,
          cursor: 'not-allowed'
        })
      }}
    >
      {loading && <LoadingSpinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </button>
  );
};

export default Button;

