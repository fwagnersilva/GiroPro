import React from 'react';
import { createInputStyle, typography, spacing, colors } from '../../styles/designSystem';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  autoComplete,
  error,
}) => {
  const inputStyle = createInputStyle(!!error);

  const labelStyle = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.text.primary,
  };

  const fieldErrorStyle = {
    color: colors.secondary.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  };

  return (
    <>
      <label htmlFor={id} style={labelStyle}>{label}:</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ ...inputStyle, marginBottom: spacing.loginScreen.inputMarginBottom }} // Sobrescreve o marginBottom padrão
        autoComplete={autoComplete}
      />
      {error && <div style={fieldErrorStyle}>{error}</div>}
    </>
  );
};

export default AuthInput;


