import React from 'react';
import { createButtonStyle, colors, typography, spacing } from '../../styles/designSystem';

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'text'; // Adicionado variant para flexibilidade
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
}) => {
  const baseStyle = createButtonStyle(variant === 'primary' ? 'primary' : 'secondary');

  const textButtonStyle = {
    background: 'none',
    border: 'none',
    color: colors.primary.main,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    textDecoration: 'underline',
    padding: spacing.xs, // Ajuste de padding para botões de texto
    margin: '0 auto', // Centralizar botões de texto
    display: 'block', // Para que margin auto funcione
  };

  const finalStyle = variant === 'text' ? textButtonStyle : baseStyle;

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={finalStyle}>
      {text}
    </button>
  );
};

export default AuthButton;


