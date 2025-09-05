import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ElegantLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isVisible, setIsVisible] = useState(false);

  // Animação de entrada
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '' && validateEmail(email);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      showMessage('Por favor, preencha todos os campos corretamente.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        email: email.trim(),
        senha,
      });

      if (response.data.success) {
        showMessage('Login realizado com sucesso!', 'success');
        
        // Salvar token se "Lembrar-me" estiver marcado
        if (rememberMe) {
          localStorage.setItem('giropro_token', response.data.accessToken);
          localStorage.setItem('giropro_user', JSON.stringify(response.data.user || { email }));
        }
        
        console.log('Token de acesso:', response.data.accessToken);
        
        // Aqui você pode redirecionar para o dashboard ou tela principal
        // window.location.href = '/dashboard';
        
      } else {
        showMessage(response.data.message || 'Erro no login', 'error');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.response?.data?.message) {
        showMessage(error.response.data.message, 'error');
      } else {
        showMessage('Erro de conexão. Verifique se o backend está rodando.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    showMessage('Funcionalidade de registro em desenvolvimento...', 'error');
  };

  const handleForgotPassword = () => {
    showMessage('Funcionalidade "Esqueceu a senha" em desenvolvimento...', 'error');
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.backgroundPattern}></div>
      </div>
      
      <div style={{
        ...styles.loginCard,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🚗</div>
            <h1 style={styles.title}>GiroPro</h1>
          </div>
          <p style={styles.subtitle}>Gestão financeira para motoristas</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>📧</div>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: email && !validateEmail(email) ? '#FF3B30' : '#E5E5EA'
                }}
                required
              />
            </div>
            {email && !validateEmail(email) && (
              <span style={styles.errorText}>Email inválido</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>🔒</div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={styles.optionsContainer}>
            <label style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Lembrar-me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={styles.forgotPassword}
            >
              Esqueceu sua senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              ...styles.loginButton,
              backgroundColor: isFormValid && !loading ? '#007AFF' : '#A9D3FF',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <span>Entrando...</span>
              </div>
            ) : (
              'Entrar'
            )}
          </button>

          {message && (
            <div style={{
              ...styles.message,
              backgroundColor: messageType === 'success' ? '#D4EDDA' : '#F8D7DA',
              color: messageType === 'success' ? '#155724' : '#721C24',
              borderColor: messageType === 'success' ? '#C3E6CB' : '#F5C6CB'
            }}>
              {message}
            </div>
          )}

          <div style={styles.dividerContainer}>
            <div style={styles.divider}></div>
            <span style={styles.dividerText}>ou</span>
            <div style={styles.divider}></div>
          </div>

          <button
            type="button"
            onClick={handleRegisterRedirect}
            style={styles.registerButton}
          >
            Não tem conta? <span style={styles.registerLink}>Cadastre-se</span>
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2025 GiroPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  background: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: -2,
  },
  backgroundPattern: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
    `,
    zIndex: -1,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logo: {
    fontSize: '32px',
    marginRight: '12px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007AFF',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#8E8E93',
    margin: 0,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  inputContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '12px',
    fontSize: '16px',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 44px',
    border: '2px solid #E5E5EA',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
  },
  errorText: {
    fontSize: '12px',
    color: '#FF3B30',
    marginTop: '4px',
    display: 'block',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    transform: 'scale(1.2)',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#333',
  },
  forgotPassword: {
    background: 'none',
    border: 'none',
    color: '#007AFF',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #FFFFFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center' as const,
    border: '1px solid',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  divider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    margin: '0 16px',
    fontSize: '14px',
    color: '#8E8E93',
  },
  registerButton: {
    width: '100%',
    padding: '12px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#333',
    cursor: 'pointer',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #E5E5EA',
  },
  footerText: {
    fontSize: '12px',
    color: '#8E8E93',
    margin: 0,
  },
};

// Adicionar animação CSS para o spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #007AFF !important;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  }
`;
document.head.appendChild(styleSheet);

export default ElegantLogin;

