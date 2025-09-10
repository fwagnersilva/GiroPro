import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
}

const GoalsScreenSimple: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'currentAmount'>>({
    name: '',
    targetAmount: 0,
    dueDate: new Date().toISOString().split('T')[0],
  });

  // Mock data para demonstração
  const mockGoals: Goal[] = [
    {
      id: '1',
      name: 'Comprar Carro Novo',
      targetAmount: 50000,
      currentAmount: 15000,
      dueDate: '2026-12-31',
    },
    {
      id: '2',
      name: 'Viagem para Europa',
      targetAmount: 10000,
      currentAmount: 3000,
      dueDate: '2025-07-15',
    },
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGoals(mockGoals);
    } catch (error) {
      alert('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'targetAmount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor, insira o nome da meta.');
      return;
    }
    if (formData.targetAmount <= 0 || isNaN(formData.targetAmount)) {
      alert('Por favor, insira um valor alvo válido e positivo.');
      return;
    }
    if (new Date(formData.dueDate) < new Date()) {
      alert('A data de vencimento não pode ser no passado.');
      return;
    }

    try {
      setLoading(true);
      // Simular criação na API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newGoal: Goal = {
        id: Date.now().toString(),
        ...formData,
        currentAmount: 0, // Nova meta começa com 0
      };

      setGoals([...goals, newGoal]);
      setFormData({
        name: '',
        targetAmount: 0,
        dueDate: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      alert('Meta adicionada com sucesso! (Mock)');
    } catch (error) {
      alert('Erro ao adicionar meta');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#FF9500',
              margin: '0 0 8px 0',
            }}>Minhas Metas Financeiras</h1>
            <p style={{
              fontSize: '16px',
              color: '#8E8E93',
              margin: '0',
            }}>Acompanhe suas metas de economia e investimento</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            style={{
              backgroundColor: '#FF9500',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {showForm ? 'Cancelar' : '+ Adicionar Meta'}
          </button>
        </div>

        {/* Formulário de Adicionar Meta */}
        {showForm && (
          <div style={{
            backgroundColor: '#F8F9FA',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '24px',
            border: '1px solid #E5E5EA',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 20px 0',
            }}>Adicionar Nova Meta</h3>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px',
                  }}>Nome da Meta</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D1D6',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px',
                  }}>Valor Alvo (R$)</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D1D6',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px',
                  }}>Data de Vencimento</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D1D6',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#FF9500',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Salvar Meta
              </button>
            </form>
          </div>
        )}

        {/* Lista de Metas */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #FF950030',
              borderTop: '3px solid #FF9500',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}></div>
            <p style={{ color: '#8E8E93' }}>Carregando metas...</p>
          </div>
        ) : goals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8E8E93',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhuma meta cadastrada</p>
            <p>Clique em "Adicionar Meta" para começar</p>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Todas as Metas</h3>
            <div style={{
              display: 'grid',
              gap: '12px',
            }}>
              {goals
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((goal) => (
                  <div
                    key={goal.id}
                    style={{
                      backgroundColor: '#F8F9FA',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #E5E5EA',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: '#333',
                        margin: '0',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}>
                        {goal.name}
                      </h4>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#8E8E93',
                      }}>
                        <span>Alvo: {formatCurrency(goal.targetAmount)}</span>
                        <span>Atual: {formatCurrency(goal.currentAmount)}</span>
                        <span>Vencimento: {formatDate(goal.dueDate)}</span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#333',
                    }}>
                      {((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoalsScreenSimple;


