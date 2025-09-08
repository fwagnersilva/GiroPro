import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

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

interface LoginScreenWebProps {
  onNavigateToRegister?: () => void;
}

const LoginScreenWeb: React.FC<LoginScreenWebProps> = ({ onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{email?: string; senha?: string}>({});
  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {email?: string; senha?: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '' && Object.keys(errors).length === 0;

  return (
    <div style={webStyles.container}>
      <div style={webStyles.content}>
        <div style={webStyles.header}>
          <h1 style={webStyles.title}>GiroPro</h1>
          <p style={webStyles.subtitle}>Gestão financeira para motoristas</p>
        </div>

        <form onSubmit={handleLogin} style={webStyles.form}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Email *
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: errors.email ? '2px solid #FF3B30' : '2px solid #E5E5EA',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Senha *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (errors.senha) {
                    setErrors(prev => ({ ...prev, senha: undefined }));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  fontSize: '16px',
                  border: errors.senha ? '2px solid #FF3B30' : '2px solid #E5E5EA',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#8E8E93'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.senha && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.senha}</p>
            )}
          </div>

          <div style={webStyles.optionsContainer}>
            <label style={webStyles.rememberMeContainer}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={webStyles.rememberMeText}>Lembrar-me</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Funcionalidade em desenvolvimento')}
              style={{
                background: 'none',
                border: 'none',
                color: '#007AFF',
                fontSize: '16px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Esqueceu sua senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              ...webStyles.loginButton,
              ...(!isFormValid || loading ? webStyles.loginButtonDisabled : {})
            }}
          >
            <span style={webStyles.loginButtonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </span>
          </button>

          <div style={webStyles.dividerContainer}>
            <div style={webStyles.divider} />
            <span style={webStyles.dividerText}>ou</span>
            <div style={webStyles.divider} />
          </div>

          <button 
            type="button" 
            style={webStyles.registerButton} 
            onClick={onNavigateToRegister}
          >
            <span style={webStyles.registerButtonText}>
              Não tem conta? <span style={webStyles.registerLink}>Cadastre-se</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreenWeb;


