import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import VehiclesScreen from './src/components/VehiclesScreen';
import ExpensesScreen from './src/components/ExpensesScreen';
import FuelScreen from './src/components/FuelScreen';
import { apiRequest, useApiErrorHandler } from './src/utils/apiErrorHandler';
import { Button, Input, LoadingSpinner, colors, spacing, typography } from './src/components/ui';

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
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
      });

      if (data.success && data.user) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Dados de usuário não encontrados');
      }
    } catch (error: any) {
      throw error; // Re-throw para ser tratado no componente
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
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha }),
      });

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
            <Input
              label="Nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={setNome}
              required
              error={errors.nome}
              leftIcon="👤"
              testID="nome-input"
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={setEmail}
            required
            error={errors.email}
            leftIcon="✉️"
            testID="email-input"
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            value={senha}
            onChange={setSenha}
            required
            error={errors.senha}
            leftIcon="🔒"
            rightIcon={showPassword ? '🙈' : '👁️'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            testID="senha-input"
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: spacing.lg }}
          >
            {loading ? 'Processando...' : (showRegister ? 'Registrar' : 'Entrar')}
          </Button>
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

// Dashboard Component (updated with navigation)
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToVehicles = () => {
    navigate('/vehicles');
  };

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
<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/vehicles")}
              style={{
                backgroundColor: "#007AFF",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Meus Veículos
            </button>
            <button
              onClick={() => navigate("/expenses")}
              style={{
                backgroundColor: "#34C759",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Despesas
            </button>
            <button
              onClick={() => navigate("/fuel")}
              style={{
                backgroundColor: "#FF9500",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Abastecimentos
            </button>
          </div>
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
            onClick={handleNavigateToVehicles}
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

// Main App Component with Routing
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
     <Route path="/vehicles" element={<VehiclesScreen onBack={() => navigate("/dashboard")} />} />
              <Route path="/expenses" element={<ExpensesScreen onBack={() => navigate("/dashboard")} />} />
              <Route path="/fuel" element={<FuelScreen onBack={() => navigate("/dashboard")} />} />
    </Routes>
  );
};

// App with Provider and Router
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
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </>
  );
}

