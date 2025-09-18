import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
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
      console.log('Tentando fazer login com:', credentials.email);
      
      // Simulação de login para credenciais de teste
      if (credentials.email === 'teste@teste.com' && credentials.senha === 'Teste123@') {
        const mockUser = {
          id: '1',
          nome: 'Usuário Teste',
          email: credentials.email
        };
        
        localStorage.setItem('token', 'mock-token-123');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        console.log('Login simulado bem-sucedido');
        return;
      }
      
      // Tentativa de login real com o backend
      try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || data.message || 'Erro ao fazer login');
        }

        if (data.success && data.data) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          setUser(data.data.user);
          console.log('Login real bem-sucedido');
        } else {
          throw new Error(data.error?.message || data.message || 'Erro ao fazer login');
        }
      } catch (networkError: any) {
        console.warn('Backend não disponível, usando login simulado para credenciais de teste');
        if (credentials.email === 'teste@teste.com' && credentials.senha === 'Teste123@') {
          const mockUser = {
            id: '1',
            nome: 'Usuário Teste',
            email: credentials.email
          };
          
          localStorage.setItem('token', 'mock-token-123');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          console.log('Login simulado bem-sucedido (fallback)');
          return;
        }
        throw new Error('Credenciais inválidas ou servidor indisponível');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
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
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated: !!user }}>
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

// Dashboard Component
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Dados simulados para demonstração
      const mockData = {
        metricas_principais: {
          faturamento_bruto: 15000.00,
          total_despesas: 8500.00,
          lucro_liquido: 6500.00,
          margem_lucro: 43.3
        },
        metricas_operacionais: {
          ganho_por_hora: 25.50,
          km_total: 12500,
          numero_jornadas: 45,
          custo_por_km: 0.68
        }
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
            }}>
              Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0'
            }}>
              Bem-vindo, {user?.nome}!
            </p>
          </div>
          <button
            onClick={signOut}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF3B30',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>

        {loadingData ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Carregando dados...</p>
          </div>
        ) : dashboardData ? (
          <div>
            {/* Métricas Principais */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                backgroundColor: '#E8F5E8',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #34C759'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#34C759',
                  margin: '0 0 8px 0'
                }}>
                  Faturamento Bruto
                </h3>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0'
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.faturamento_bruto || 0)}
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFE8E8',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #FF3B30'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#FF3B30',
                  margin: '0 0 8px 0'
                }}>
                  Total de Despesas
                </h3>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0'
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.total_despesas || 0)}
                </p>
              </div>

              <div style={{
                backgroundColor: '#E8F4FF',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #007AFF'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#007AFF',
                  margin: '0 0 8px 0'
                }}>
                  Lucro Líquido
                </h3>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0'
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.lucro_liquido || 0)}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '4px 0 0 0'
                }}>
                  Margem: {(dashboardData.metricas_principais?.margem_lucro || 0).toFixed(1)}%
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFF4E8',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #FF9500'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#FF9500',
                  margin: '0 0 8px 0'
                }}>
                  Ganho por Hora
                </h3>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0'
                }}>
                  {formatCurrency(dashboardData.metricas_operacionais?.ganho_por_hora || 0)}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: '#F8F9FA',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>KM Total</h4>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
                  {(dashboardData.metricas_operacionais?.km_total || 0).toLocaleString()} km
                </p>
              </div>

              <div style={{
                backgroundColor: '#F8F9FA',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Jornadas</h4>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
                  {dashboardData.metricas_operacionais?.numero_jornadas || 0}
                </p>
              </div>

              <div style={{
                backgroundColor: '#F8F9FA',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Custo por KM</h4>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
                  {formatCurrency(dashboardData.metricas_operacionais?.custo_por_km || 0)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Nenhum dado disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NewLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('handleLogin chamado', { email, senha: senha ? '***' : '' });
    
    if (!email.trim() || !senha.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      console.error('Erro no handleLogin:', error);
      setError(error.message || 'Erro ao fazer login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#007AFF',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          GiroPro
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#8E8E93',
          margin: '0 0 32px 0',
          textAlign: 'center'
        }}>
          Gestão financeira para motoristas
        </p>

        {error && (
          <div style={{
            backgroundColor: '#FFE8E8',
            color: '#FF3B30',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '8px',
              display: 'block'
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                border: '1px solid #E5E5EA',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                backgroundColor: loading ? '#F8F9FA' : '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '8px',
              display: 'block'
            }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                border: '1px solid #E5E5EA',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                backgroundColor: loading ? '#F8F9FA' : '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#8E8E93' : '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#F0F8FF',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#007AFF',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Credenciais de teste:
          </p>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0'
          }}>
            Email: teste@teste.com<br/>
            Senha: Teste123@
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F2F7'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: '0', fontSize: '18px', color: '#666' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <NewLoginScreen />;
};

// Root Component
const WebApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default WebApp;

