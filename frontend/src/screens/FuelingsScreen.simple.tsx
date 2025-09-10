import React, { useState, useEffect } from 'react';

interface Fueling {
  id: string;
  idVeiculo: string;
  dataAbastecimento: string;
  tipoCombustivel: string;
  litros: number;
  valorLitro: number;
  valorTotal: number;
  kmAtual: number;
  nomePosto?: string;
  veiculo?: string; // nome do veículo para exibição
}

const FuelingsScreenSimple: React.FC = () => {
  const [fuelings, setFuelings] = useState<Fueling[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data para demonstração
  const mockFuelings: Fueling[] = [
    {
      id: '1',
      idVeiculo: '1',
      dataAbastecimento: '2025-09-01',
      tipoCombustivel: 'gasolina',
      litros: 30,
      valorLitro: 5.50,
      valorTotal: 165.00,
      kmAtual: 50000,
      nomePosto: 'Posto Ipiranga',
      veiculo: 'Toyota Corolla'
    },
    {
      id: '2',
      idVeiculo: '2',
      dataAbastecimento: '2025-08-25',
      tipoCombustivel: 'etanol',
      litros: 40,
      valorLitro: 3.80,
      valorTotal: 152.00,
      kmAtual: 45000,
      nomePosto: 'Posto Shell',
      veiculo: 'Honda Civic'
    }
  ];

  useEffect(() => {
    loadFuelings();
  }, []);

  const loadFuelings = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFuelings(mockFuelings);
    } catch (error) {
      alert('Erro ao carregar abastecimentos');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const totalFuelingsValue = fuelings.reduce((sum, fueling) => sum + fueling.valorTotal, 0);

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
              color: '#007AFF',
              margin: '0 0 8px 0'
            }}>Meus Abastecimentos</h1>
            <p style={{
              fontSize: '16px',
              color: '#8E8E93',
              margin: '0 0 8px 0'
            }}>Controle seus gastos com combustível</p>
            <p style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0'
            }}>Total Gasto: {formatCurrency(totalFuelingsValue)}</p>
          </div>
          <button
            onClick={() => alert('Navegar para tela de adicionar abastecimento')}
            style={{
              backgroundColor: '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Adicionar Abastecimento
          </button>
        </div>

        {/* Lista de Abastecimentos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #007AFF30',
              borderTop: '3px solid #007AFF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#8E8E93' }}>Carregando abastecimentos...</p>
          </div>
        ) : fuelings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8E8E93'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhum abastecimento cadastrado</p>
            <p>Clique em "Adicionar Abastecimento" para começar</p>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Todos os Abastecimentos</h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {fuelings
                .sort((a, b) => new Date(b.dataAbastecimento).getTime() - new Date(a.dataAbastecimento).getTime())
                .map((fueling) => (
                  <div
                    key={fueling.id}
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
                      <h4 style={{
                        color: '#333',
                        margin: '0',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {fueling.veiculo} - {fueling.tipoCombustivel.charAt(0).toUpperCase() + fueling.tipoCombustivel.slice(1)}
                      </h4>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#8E8E93'
                      }}>
                        <span>{formatDate(fueling.dataAbastecimento)}</span>
                        <span>{fueling.litros} L</span>
                        <span>{formatCurrency(fueling.valorLitro)}/L</span>
                        <span>{fueling.kmAtual} KM</span>
                        {fueling.nomePosto && <span>{fueling.nomePosto}</span>}
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
                        {formatCurrency(fueling.valorTotal)}
                      </span>
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

export default FuelingsScreenSimple;


