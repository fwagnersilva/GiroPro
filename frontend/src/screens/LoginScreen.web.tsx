import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'; // Keep Alert for now, might need a web-specific alert later
import { useAuth } from '../contexts/AuthContext';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';

// Web-specific styles (can be moved to a CSS file later)
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
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  rememberMeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  rememberMeText: {
    marginLeft: '8px',
    fontSize: '16px',
    color: '#000000',
  },
  forgotPasswordText: {
    fontSize: '16px',
    color: '#007AFF',
    cursor: 'pointer',
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
  dividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '16px',
  },
  divider: {
    flexGrow: 1,
    height: '1px',
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: '16px',
    fontSize: '16px',
    color: '#8E8E93',
  },
  registerButton: {
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },
  registerButtonText: {
    fontSize: '16px',
    color: '#000000',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  icon: {
    fontSize: '24px',
    marginRight: '8px',
  },
};

const LoginScreenWeb: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  // No need for Animated.Value or useEffect for animations in this simple web version
  // CSS transitions/animations can be used directly in webStyles

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu email');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
      // TODO: Redirect to dashboard after successful login
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    // TODO: Implement web navigation to register page
    Alert.alert('Navegação', 'Funcionalidade de cadastro em desenvolvimento para web.');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
    <div style={webStyles.container}>
      <div style={webStyles.content}>
        <div style={webStyles.header}>
          <h1 style={webStyles.title}>GiroPro</h1>
          <p style={webStyles.subtitle}>Gestão financeira para motoristas</p>
        </div>

        <div style={webStyles.form}>
          <FormInput
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            required
            leftIcon="mail-outline"
            validation={combineValidators(validators.required, validators.email)}
            testID="email-input"
          />

          <FormInput
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            required
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={togglePasswordVisibility}
            validation={validators.required}
            testID="password-input"
          />

          <div style={webStyles.optionsContainer}>
            <div
              style={webStyles.rememberMeContainer}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe ? (
                <span style={{ ...webStyles.icon, color: '#007AFF' }}>☑️</span>
              ) : (
                <span style={{ ...webStyles.icon, color: '#8E8E93' }}>⬜</span>
              )}
              <span style={webStyles.rememberMeText}>Lembrar-me</span>
            </div>

            <button
              style={webStyles.forgotPasswordText}
              onClick={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            >
              Esqueceu sua senha?
            </button>
          </div>

          <button
            style={{
              ...webStyles.loginButton,
              ...(!isFormValid && webStyles.loginButtonDisabled),
            }}
            onClick={handleLogin}
            disabled={!isFormValid}
          >
            {loading ? (
              <LoadingSpinner color="#FFFFFF" />
            ) : (
              <span style={webStyles.loginButtonText}>Entrar</span>
            )}
          </button>

          <div style={webStyles.dividerContainer}>
            <div style={webStyles.divider} />
            <span style={webStyles.dividerText}>ou</span>
            <div style={webStyles.divider} />
          </div>

          <button style={webStyles.registerButton} onClick={navigateToRegister}>
            <span style={webStyles.registerButtonText}>
              Não tem conta? <span style={webStyles.registerLink}>Cadastre-se</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreenWeb;


