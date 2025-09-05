import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

interface Expense {
  id: string;
  id_veiculo?: string;
  data_despesa: string;
  tipo_despesa: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
  valor_despesa: number; // em centavos
  descricao?: string;
  veiculo?: string; // nome do veículo para exibição
}

const ExpensesScreenSimple: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: ''
  });
  const { user } = useAuth();

  // Mock data para demonstração
  const mockExpenses: Expense[] = [
    {
      id: '1',
      id_veiculo: '1',
      data_despesa: '2025-09-05',
      tipo_despesa: 'Manutencao',
      valor_despesa: 12000, // R$ 120,00 em centavos
      descricao: 'Troca de óleo e filtros',
      veiculo: 'Toyota Corolla'
    },
    {
      id: '2',
      id_veiculo: '2',
      data_despesa: '2025-09-03',
      tipo_despesa: 'Pneus',
      valor_despesa: 45000, // R$ 450,00 em centavos
      descricao: 'Troca de 4 pneus',
      veiculo: 'Honda Civic'
    },
    {
      id: '3',
      id_veiculo: '1',
      data_despesa: '2025-09-01',
      tipo_despesa: 'Seguro',
      valor_despesa: 85000, // R$ 850,00 em centavos
      descricao: 'Seguro anual do veículo',
      veiculo: 'Toyota Corolla'
    },
    {
      id: '4',
      id_veiculo: '3',
      data_despesa: '2025-08-30',
      tipo_despesa: 'Outros',
      valor_despesa: 2500, // R$ 25,00 em centavos
      descricao: 'Lavagem completa',
      veiculo: 'Volkswagen Gol'
    }
  ];

  const tiposDespesa = [
    { value: 'Manutencao', label: 'Manutenção', color: '#FF9500', icon: '🔧' },
    { value: 'Pneus', label: 'Pneus', color: '#34C759', icon: '🛞' },
    { value: 'Seguro', label: 'Seguro', color: '#007AFF', icon: '🛡️' },
    { value: 'Outros', label: 'Outros', color: '#8E8E93', icon: '📋' }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor_despesa) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const valor = parseFloat(formData.valor_despesa);
    if (isNaN(valor) || valor <= 0) {
      alert('Valor deve ser um número positivo');
      return;
    }

    try {
      setLoading(true);
      
      // Simular criação na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: formData.data_despesa,
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: Math.round(valor * 100), // Converter para centavos
        descricao: formData.descricao,
        veiculo: formData.id_veiculo ? 'Veículo Selecionado' : undefined
      };
      
      setExpenses([newExpense, ...expenses]);
      setFormData({
        id_veiculo: '',
        data_despesa: new Date().toISOString().split('T')[0],
        tipo_despesa: 'Manutencao',
        valor_despesa: '',
        descricao: ''
      });
      setShowForm(false);
      alert('Despesa adicionada com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar despesa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;
    
    try {
      setLoading(true);
      // Simular exclusão na API
      await new Promise(resolve => setTimeout(resolve, 500));
      setExpenses(expenses.filter(e => e.id !== id));
      alert('Despesa excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir despesa');
    } finally {
      setLoading(false);
    }
  };

  const getTipoInfo = (tipo: string) => {
    return tiposDespesa.find(t => t.value === tipo) || tiposDespesa[tiposDespesa.length - 1];
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.valor_despesa, 0);

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

        {/* Formulário */}
        {showForm && (
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Nova Despesa</h3>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ex: Abastecimento Posto Shell"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0,00"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Veículo (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.veiculo}
                    onChange={(e) => setFormData({...formData, veiculo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ex: Toyota Corolla"
                  />
                </div>
              </div>
              
              <button
                type="submit"
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
                {loading ? 'Salvando...' : 'Salvar Despesa'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de Despesas */}
        {loading && !showForm ? (
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
            {/* Resumo por categoria */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#333', marginBottom: '16px' }}>Resumo por Categoria</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {categorias.map(categoria => {
                  const totalCategoria = expenses
                    .filter(e => e.categoria === categoria.value)
                    .reduce((sum, e) => sum + e.valor, 0);
                  
                  if (totalCategoria === 0) return null;
                  
                  return (
                    <div
                      key={categoria.value}
                      style={{
                        backgroundColor: categoria.color + '20',
                        border: `2px solid ${categoria.color}`,
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <p style={{ 
                        color: categoria.color, 
                        fontWeight: 'bold', 
                        margin: '0 0 4px 0',
                        fontSize: '14px'
                      }}>
                        {categoria.label}
                      </p>
                      <p style={{ 
                        color: '#333', 
                        fontWeight: 'bold', 
                        margin: '0',
                        fontSize: '16px'
                      }}>
                        {formatCurrency(totalCategoria)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de despesas */}
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Todas as Despesas</h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {expenses
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((expense) => {
                  const categoriaInfo = getCategoriaInfo(expense.categoria);
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
                              backgroundColor: categoriaInfo.color,
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
                          color: '#666' 
                        }}>
                          <span><strong>Categoria:</strong> {categoriaInfo.label}</span>
                          <span><strong>Data:</strong> {formatDate(expense.data)}</span>
                          {expense.veiculo && (
                            <span><strong>Veículo:</strong> {expense.veiculo}</span>
                          )}
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
                          {formatCurrency(expense.valor)}
                        </span>
                        
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={loading}
                          style={{
                            backgroundColor: '#FF3B30',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                          }}
                        >
                          Excluir
                        </button>
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

export default ExpensesScreenSimple;

