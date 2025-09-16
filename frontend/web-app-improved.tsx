import React, { useState, useEffect, createContext, useContext } from 'react';

// Types
interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: { email: string; senha: string }) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

// Auth Context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Auth Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials: { email: string; senha: string }) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      if (data.success && data.user) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Dados de usuário não encontrados');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Web-compatible FormInput Component
interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  testID?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const iconMap: Record<string, string> = {
    'mail-outline': '✉️',
    'lock-closed-outline': '🔒',
    'eye-outline': '👁️',
    'eye-off-outline': '🙈',
    'person-outline': '👤',
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        fontSize: '16px',
        fontWeight: '500',
        color: '#000000',
        marginBottom: '8px',
        display: 'block'
      }}>
        {label}
        {required && <span style={{ color: '#FF3B30' }}> *</span>}
      </label>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: `1px solid ${error ? '#FF3B30' : isFocused ? '#007AFF' : '#E5E5EA'}`,
        borderRadius: '8px',
        minHeight: '48px',
        boxShadow: isFocused ? '0 0 0 2px rgba(0, 122, 255, 0.2)' : 'none',
      }}>
        {leftIcon && (
          <span style={{
            marginLeft: '16px',
            fontSize: '20px',
            color: error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'
          }}>
            {iconMap[leftIcon] || leftIcon}
          </span>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-testid={testID}
          style={{
            flex: 1,
            fontSize: '16px',
            color: '#000000',
            padding: '12px 16px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            paddingLeft: leftIcon ? '8px' : '16px',
            paddingRight: rightIcon ? '8px' : '16px',
          }}
        />
        
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconPress}
            data-testid="right-icon-button"
            style={{
              padding: '12px',
              marginRight: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'
            }}
          >
            {iconMap[rightIcon] || rightIcon}
          </button>
        )}
      </div>
      
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '6px'
        }}>
          <span style={{ fontSize: '16px', color: '#FF3B30', marginRight: '6px' }}>⚠️</span>
          <span style={{ fontSize: '14px', color: '#FF3B30' }}>{error}</span>
        </div>
      )}
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC<{ color?: string; size?: number }> = ({ 
  color = '#007AFF', 
  size = 24 
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      border: `2px solid transparent`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);

// Login Component with improved form handling
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn } = useAuth();

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) return 'Senha é obrigatória';
    if (showRegister) {
      if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
      if (!/(?=.*[a-z])/.test(password)) return 'Senha deve conter pelo menos 1 letra minúscula';
      if (!/(?=.*[A-Z])/.test(password)) return 'Senha deve conter pelo menos 1 letra maiúscula';
      if (!/(?=.*\d)/.test(password)) return 'Senha deve conter pelo menos 1 número';
      if (!/(?=.*[@$!%*?&])/.test(password)) return 'Senha deve conter pelo menos 1 caractere especial (@$!%*?&)';
    }
    return null;
  };

  const validateName = (name: string): string | null => {
    if (showRegister && !name.trim()) return 'Nome é obrigatório';
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(senha);
    const nameError = validateName(nome);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.senha = passwordError;
    if (nameError) newErrors.nome = nameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      setErrors({ form: error.message || 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      if (data.success && data.user) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        throw new Error(data.message || 'Erro ao registrar');
      }
    } catch (error: any) {
      setErrors({ form: error.message || 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#007AFF',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>GiroPro</h1>
          <p style={{
            fontSize: '18px',
            color: '#8E8E93',
            margin: '0'
          }}>Gestão financeira para motoristas</p>
        </div>

        {/* Toggle */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '24px',
          backgroundColor: '#F8F9FA',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => {
              setShowRegister(false);
              setErrors({});
            }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: !showRegister ? '#007AFF' : 'transparent',
              color: !showRegister ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              setErrors({});
            }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: showRegister ? '#007AFF' : 'transparent',
              color: showRegister ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Registrar
          </button>
        </div>

        {/* Error Message */}
        {errors.form && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#DC2626', fontSize: '14px', margin: '0' }}>
              {errors.form}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={showRegister ? handleRegister : handleLogin}>
          {showRegister && (
            <FormInput
              label="Nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={setNome}
              required
              error={errors.nome}
              leftIcon="person-outline"
              testID="nome-input"
            />
          )}

          <FormInput
            label="Email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={setEmail}
            required
            error={errors.email}
            leftIcon="mail-outline"
            testID="email-input"
          />

          <FormInput
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            value={senha}
            onChange={setSenha}
            required
            error={errors.senha}
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            testID="senha-input"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#A9D3FF' : '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading && <LoadingSpinner color="#FFFFFF" size={20} />}
            {loading ? 'Processando...' : (showRegister ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        {/* Test Credentials */}
        {!showRegister && (
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 4px 0' }}>
              Credenciais de teste:
            </p>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 4px 0' }}>
              Email: teste@teste.com
            </p>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0' }}>
              Senha: Teste123@
            </p>
          </div>
        )}

        {showRegister && (
          <div style={{
            backgroundColor: '#FFF3CD',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#856404', textAlign: 'center', margin: '0' }}>
              A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component (unchanged from original)
const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#007AFF',
              margin: '0 0 8px 0'
            }}>Dashboard</h1>
            <p style={{
              fontSize: '18px',
              color: '#8E8E93',
              margin: '0'
            }}>Bem-vindo, {user?.nome}!</p>
          </div>
          <button
            onClick={signOut}
            style={{
              backgroundColor: '#FF3B30',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Backend</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>Conectado</p>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Banco de Dados</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>SQLite em Memória</p>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Autenticação</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>Funcionando</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            🚗 Meus Veículos
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#34C759',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            💰 Despesas
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#FF9500',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            ⛽ Abastecimentos
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#AF52DE',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            📊 Relatórios
          </button>
        </div>

        {/* Informações do Sistema */}
        <div style={{
          backgroundColor: '#F8F9FA',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#007AFF', margin: '0 0 16px 0' }}>🎉 Sistema Configurado com Sucesso!</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Backend</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>http://localhost:3000</p>
            </div>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Frontend</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>http://localhost:19006</p>
            </div>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Usuário</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#F2F2F7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{ textAlign: 'center' }}>
      <LoadingSpinner size={40} />
      <p style={{ color: '#8E8E93', fontSize: '16px', margin: '16px 0 0 0' }}>
        Carregando...
      </p>
    </div>
  </div>
);

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};

// App with Provider
export default function WebAppImproved() {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}

