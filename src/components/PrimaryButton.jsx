import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import './PrimaryButton.css';

const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'default',
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const baseClasses = 'primary-button transition-all duration-300 ease-in-out';
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md hover:shadow-lg',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  };

  const combinedClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `.trim();

  return (
    <Button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
