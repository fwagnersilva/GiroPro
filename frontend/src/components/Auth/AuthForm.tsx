import React from 'react';

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  children,
  onSubmit,
}) => {
  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
  };

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      {children}
    </form>
  );
};

export default AuthForm;


