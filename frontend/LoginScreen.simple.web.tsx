import React, { useState } from 'react';
import FormInputWeb from './src/components/FormInput.web';
import LoadingSpinnerWeb from './src/components/LoadingSpinner.web';
import { AuthProvider, useAuth } from './src/contexts/AuthContext.web';

const webStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
  },
  loginButtonDisabled: {
    backgroundColor: '#A9D3FF',
    cursor: 'not-allowed',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '600',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
    border: '1px solid #C3E6CB',
  },
  errorMessage: {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
    border: '1px solid #F5C6CB',
  },
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      setMessage({ text: 'Por favor, informe seu email', type: 'error' });
      return;
    }

    if (!senha.trim()) {
      setMessage({ text: 'Por favor, informe sua senha', type: 'error' });
      return;
    }

    try {
      await signIn({ email: email.trim(), senha });
      setMessage({ text: 'Login realizado com sucesso!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao fazer login', type: 'error' });
    }
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
    <div style={webStyles.container}>
      <div style={webStyles.content}>
        <div style={webStyles.header}>
          <h1 style={webStyles.title}>GiroPro</h1>
          <p style={webStyles.subtitle}>Gestão financeira para motoristas</p>
        </div>

        {message && (
          <div style={{
            ...webStyles.message,
            ...(message.type === 'success' ? webStyles.successMessage : webStyles.errorMessage)
          }}>
            {message.text}
          </div>
        )}

        <div style={webStyles.form}>
          <FormInputWeb
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            required
            leftIcon="mail-outline"
            testID="email-input"
          />

          <FormInputWeb
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
            required
            leftIcon="lock-closed-outline"
            testID="password-input"
          />

          <button
            style={{
              ...webStyles.loginButton,
              ...(!isFormValid && webStyles.loginButtonDisabled),
            }}
            onClick={handleLogin}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <LoadingSpinnerWeb color="#FFFFFF" />
            ) : (
              <span style={webStyles.loginButtonText}>Entrar</span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
            <p>Credenciais de teste:</p>
            <p>Email: teste@teste.com</p>
            <p>Senha: Teste123@</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreenSimpleWeb: React.FC = () => {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
};

export default LoginScreenSimpleWeb;

