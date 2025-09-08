import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

interface Expense {
  id: string;
  idVeiculo?: string;
  dataDespesa: string;
  tipoDespesa: 'manutencao' | 'pneus' | 'seguro' | 'outros';
  valorDespesa: number; // em centavos
  descricao?: string;
  veiculo?: string; // nome do veículo para exibição
}

const ExpensesScreenFixed: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    idVeiculo: '',
    dataDespesa: new Date().toISOString().split('T')[0],
    tipoDespesa: 'manutencao',
    valorDespesa: '',
    descricao: ''
  });
  
  // Comentado temporariamente para teste
  // const { user } = useAuth();

  // Mock data para demonstração
  const mockExpenses: Expense[] = [
    {
      id: '1',
      idVeiculo: '1',
      dataDespesa: '2025-09-05',
      tipoDespesa: 'manutencao',
      valorDespesa: 12000, // R$ 120,00 em centavos
      descricao: 'Troca de óleo e filtros',
      veiculo: 'Toyota Corolla'
    },
    {
      id: '2',
      idVeiculo: '2',
      dataDespesa: '2025-09-03',
      tipoDespesa: 'pneus',
      valorDespesa: 45000, // R$ 450,00 em centavos
      descricao: 'Troca de 4 pneus',
      veiculo: 'Honda Civic'
    }
  ];

  const tiposDespesa = [
    { value: 'manutencao', label: 'Manutenção', color: '#FF9500', icon: '🔧' },
    { value: 'pneus', label: 'Pneus', color: '#34C759', icon: '🛞' },
    { value: 'seguro', label: 'Seguro', color: '#007AFF', icon: '🛡️' },
    { value: 'outros', label: 'Outros', color: '#8E8E93', icon: '📋' }
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExpenses(mockExpenses);
    } catch (error) {
      alert('Erro ao carregar despesas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valueInCents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.valorDespesa, 0);

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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#34C759',
              margin: '0 0 8px 0'
            }}>Minhas Despesas</h1>
            <p style={{
              fontSize: '16px',
              color: '#8E8E93',
              margin: '0 0 8px 0'
            }}>Controle seus gastos com veículos</p>
            <p style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0'
            }}>Total: {formatCurrency(totalExpenses)}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            style={{
              backgroundColor: '#34C759',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {showForm ? 'Cancelar' : '+ Adicionar Despesa'}
          </button>
        </div>

        {/* Lista de Despesas */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #34C75930',
              borderTop: '3px solid #34C759',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#8E8E93' }}>Carregando despesas...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8E8E93'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhuma despesa cadastrada</p>
            <p>Clique em "Adicionar Despesa" para começar</p>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Todas as Despesas</h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {expenses
                .sort((a, b) => new Date(b.dataDespesa).getTime() - new Date(a.dataDespesa).getTime())
                .map((expense) => {
                  const tipoInfo = tiposDespesa.find(t => t.value === expense.tipoDespesa) || tiposDespesa[0];
                  return (
                    <div
                      key={expense.id}
                      style={{
                        backgroundColor: '#F8F9FA',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #E5E5EA',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: tipoInfo.color,
                              borderRadius: '50%',
                              marginRight: '8px'
                            }}
                          ></div>
                          <h4 style={{
                            color: '#333',
                            margin: '0',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>
                            {expense.descricao}
                          </h4>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#8E8E93'
                        }}>
                          <span>{tipoInfo.label}</span>
                          <span>{formatDate(expense.dataDespesa)}</span>
                          {expense.veiculo && <span>{expense.veiculo}</span>}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px' 
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#333'
                        }}>
                          {formatCurrency(expense.valorDespesa)}
                        </span>
                      </div>
                    </div>
                  );
                })}
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

export default ExpensesScreenFixed;

