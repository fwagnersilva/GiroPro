import React, { useState, useEffect } from 'react';
import { useApiErrorHandler } from '../../src/utils/apiErrorHandler';
import { Button, Card, Input, LoadingSpinner, colors, spacing, typography } from './ui';
import AddEditExpenseForm from './AddEditExpenseForm';

interface Expense {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  veiculoId?: string;
  veiculoNome?: string;
  tipo: 'combustivel' | 'manutencao' | 'seguro' | 'ipva' | 'multa' | 'outros';
}

interface ExpensesScreenProps {
  onBack: () => void;
}

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ onBack }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  const { apiRequest } = useApiErrorHandler();

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${import.meta.env.VITE_API_URL}/api/v1/expenses`, {
        method: 'GET',
      });
      if (response.success) {
        setExpenses(response.data);
      } else {
        setError(response.message || 'Erro ao buscar despesas.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao buscar despesas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const categories = [
    { value: 'todas', label: 'Todas as categorias' },
    { value: 'combustivel', label: 'Combustível' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'ipva', label: 'IPVA' },
    { value: 'multa', label: 'Multas' },
    { value: 'outros', label: 'Outros' }
  ];

  const filteredExpenses = filterCategory === 'todas' 
    ? expenses 
    : expenses.filter(expense => expense.tipo === filterCategory);

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.valor, 0);

  const getCategoryIcon = (tipo: string) => {
    const icons = {
      combustivel: '⛽',
      manutencao: '🔧',
      seguro: '🛡️',
      ipva: '📄',
      multa: '🚫',
      outros: '📝'
    };
    return icons[tipo as keyof typeof icons] || '📝';
  };

  const handleSaveExpense = async (expenseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const method = expenseData.id ? 'PUT' : 'POST';
      const url = expenseData.id ? `${import.meta.env.VITE_API_URL}/api/v1/expenses/${expenseData.id}` : `${import.meta.env.VITE_API_URL}/api/v1/expenses`;
      const response = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (response.success) {
        setShowAddForm(false);
        setEditingExpense(null);
        fetchExpenses(); // Recarrega a lista de despesas
      } else {
        setError(response.message || 'Erro ao salvar despesa.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao salvar despesa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${import.meta.env.VITE_API_URL}/api/v1/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        fetchExpenses(); // Recarrega a lista de despesas
      } else {
        setError(response.message || 'Erro ao excluir despesa.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao excluir despesa.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (tipo: string) => {
    const colorMap = {
      combustivel: colors.secondary.warning,
      manutencao: colors.primary.main,
      seguro: colors.secondary.success,
      ipva: colors.secondary.info,
      multa: colors.secondary.error,
      outros: colors.neutral.text.secondary
    };
    return colorMap[tipo as keyof typeof colorMap] || colors.neutral.text.secondary;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: colors.neutral.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size={40} />
          <p style={{ 
            color: colors.neutral.text.secondary, 
            fontSize: typography.fontSize.base, 
            margin: `${spacing.lg} 0 0 0` 
          }}>
            Carregando despesas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.neutral.background,
      padding: spacing.xl
    }}>
      <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing['2xl'],
          flexWrap: 'wrap',
          gap: spacing.lg
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              leftIcon="←"
            >
              Voltar
            </Button>
            <div>
              <h1 style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.primary.main,
                margin: `0 0 ${spacing.sm} 0`
              }}>💰 Despesas</h1>
              <p style={{
                fontSize: typography.fontSize.lg,
                color: colors.neutral.text.secondary,
                margin: '0'
              }}>Gerencie todas as suas despesas</p>
            </div>
          </div>
          <Button
            variant="success"
            onClick={() => setShowAddForm(true)}
            leftIcon="+"
          >
            Adicionar Despesa
          </Button>
        </div>

        {/* Filtros e Resumo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing['2xl']
        }}>
          <Card padding="lg" style={{ backgroundColor: colors.primary.main }}>
            <h3 style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary.contrast,
              margin: `0 0 ${spacing.sm} 0`
            }}>Total de Despesas</h3>
            <p style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.primary.contrast,
              margin: '0'
            }}>
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <div>
            <label style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: colors.neutral.text.primary,
              marginBottom: spacing.sm,
              display: 'block'
            }}>
              Filtrar por categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                border: `1px solid ${colors.neutral.border}`,
                borderRadius: '8px',
                backgroundColor: colors.neutral.surface,
                fontSize: typography.fontSize.base,
                color: colors.neutral.text.primary,
                outline: 'none'
              }}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card padding="md" style={{
            backgroundColor: '#FEF2F2',
            border: `1px solid #FECACA`,
            marginBottom: spacing.lg
          }}>
            <p style={{ color: colors.secondary.error, fontSize: typography.fontSize.sm, margin: '0' }}>
              {error}
            </p>
          </Card>
        )}

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <Card padding="xl" style={{
            textAlign: 'center',
            backgroundColor: '#F8F9FA'
          }}>
            <div style={{ fontSize: '64px', marginBottom: spacing.lg }}>💰</div>
            <h3 style={{ color: colors.neutral.text.primary, margin: `0 0 ${spacing.sm} 0` }}>
              Nenhuma despesa encontrada
            </h3>
            <p style={{ color: colors.neutral.text.secondary, margin: `0 0 ${spacing.xl} 0` }}>
              {filterCategory === 'todas' 
                ? 'Adicione sua primeira despesa para começar a controlar seus gastos.'
                : `Nenhuma despesa encontrada na categoria "${categories.find(c => c.value === filterCategory)?.label}".`
              }
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
              Adicionar Primeira Despesa
            </Button>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gap: spacing.lg
          }}>
            {filteredExpenses.map((expense) => (
              <Card
                key={expense.id}
                padding="lg"
                hover
                style={{
                  border: `1px solid ${colors.neutral.border}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: spacing.lg,
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      marginBottom: spacing.sm
                    }}>
                      <span style={{ fontSize: '24px' }}>
                        {getCategoryIcon(expense.tipo)}
                      </span>
                      <div>
                        <h3 style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral.text.primary,
                          margin: '0'
                        }}>
                          {expense.descricao}
                        </h3>
                        <p style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral.text.secondary,
                          margin: '0'
                        }}>
                          {expense.veiculoNome} • {new Date(expense.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.lg
                  }}>
                    <div style={{
                      backgroundColor: getCategoryColor(expense.tipo),
                      color: colors.primary.contrast,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: '6px',
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold
                    }}>
                      {expense.categoria}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: typography.fontSize.xl,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.secondary.error,
                        margin: '0'
                      }}>
                        R$ {expense.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: spacing.sm }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setEditingExpense(expense)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir esta despesa?")) {
                            handleDeleteExpense(expense.id);
                          }
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingExpense) && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <Card style={{
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral.text.primary,
                margin: `0 0 ${spacing.xl} 0`
              }}>
                {editingExpense ? 'Editar Despesa' : 'Adicionar Nova Despesa'}
              </h2>
              <AddEditExpenseForm
                initialData={editingExpense}
                onSave={handleSaveExpense}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingExpense(null);
                }}
                loading={loading}
                error={error}
              />
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExpensesScreen;

