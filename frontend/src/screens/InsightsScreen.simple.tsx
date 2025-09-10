import React, { useState, useEffect } from 'react';

interface Insight {
  id: string;
  title: string;
  description: string;
  value: string;
  type: 'expense' | 'fueling' | 'vehicle';
}

const InsightsScreenSimple: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data para demonstração
  const mockInsights: Insight[] = [
    {
      id: '1',
      title: 'Total Gasto em Manutenção',
      description: 'Soma de todas as despesas de manutenção.',
      value: 'R$ 1.500,00',
      type: 'expense',
    },
    {
      id: '2',
      title: 'Média de Consumo por Litro',
      description: 'Consumo médio de combustível dos veículos.',
      value: '10.5 km/L',
      type: 'fueling',
    },
    {
      id: '3',
      title: 'Veículo com Maior Despesa',
      description: 'O veículo que gerou mais gastos no último mês.',
      value: 'Toyota Corolla',
      type: 'vehicle',
    },
  ];

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInsights(mockInsights);
    } catch (error) {
      alert('Erro ao carregar insights');
    } finally {
      setLoading(false);
    }
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
              color: '#34C759',
              margin: '0 0 8px 0',
            }}>Insights e Relatórios</h1>
            <p style={{
              fontSize: '16px',
              color: '#8E8E93',
              margin: '0',
            }}>Análises e dados importantes sobre seus gastos</p>
          </div>
        </div>

        {/* Lista de Insights */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #34C75930',
              borderTop: '3px solid #34C759',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}></div>
            <p style={{ color: '#8E8E93' }}>Carregando insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8E8E93',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhum insight disponível</p>
            <p>Comece a registrar seus dados para ver as análises</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {insights.map((insight) => (
              <div
                key={insight.id}
                style={{
                  backgroundColor: '#F8F9FA',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5EA',
                }}
              >
                <h3 style={{
                  color: '#333',
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}>
                  {insight.title}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                  {insight.description}
                </p>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#007AFF',
                }}>
                  {insight.value}
                </div>
              </div>
            ))}
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

export default InsightsScreenSimple;


