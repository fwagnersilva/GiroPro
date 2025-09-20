import React, { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  combustivel: string;
  quilometragem: number;
}

interface VehiclesScreenProps {
  onBack: () => void;
}

const VehiclesScreen: React.FC<VehiclesScreenProps> = ({ onBack }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        placa: 'ABC-1234',
        cor: 'Branco',
        combustivel: 'Flex',
        quilometragem: 45000
      },
      {
        id: '2',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2019,
        placa: 'DEF-5678',
        cor: 'Prata',
        combustivel: 'Flex',
        quilometragem: 52000
      }
    ];

    // Simular carregamento
    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const LoadingSpinner = ({ size = 24 }: { size?: number }) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `2px solid transparent`,
        borderTop: `2px solid #007AFF`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );

  if (loading) {
    return (
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
            Carregando veículos...
          </p>
        </div>
      </div>
    );
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: '#8E8E93',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Voltar
            </button>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#007AFF',
                margin: '0 0 8px 0'
              }}>🚗 Meus Veículos</h1>
              <p style={{
                fontSize: '18px',
                color: '#8E8E93',
                margin: '0'
              }}>Gerencie seus veículos cadastrados</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#34C759',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Adicionar Veículo
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#DC2626', fontSize: '14px', margin: '0' }}>
              {error}
            </p>
          </div>
        )}

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: '#F8F9FA',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚗</div>
            <h3 style={{ color: '#333', margin: '0 0 8px 0' }}>Nenhum veículo cadastrado</h3>
            <p style={{ color: '#8E8E93', margin: '0 0 24px 0' }}>
              Adicione seu primeiro veículo para começar a gerenciar suas informações.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
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
              Adicionar Primeiro Veículo
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5EA',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                      margin: '0 0 4px 0'
                    }}>
                      {vehicle.marca} {vehicle.modelo}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#8E8E93',
                      margin: '0'
                    }}>
                      {vehicle.ano} • {vehicle.cor}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#F8F9FA',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                    {vehicle.combustivel}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#8E8E93',
                      margin: '0 0 4px 0',
                      fontWeight: '600'
                    }}>
                      PLACA
                    </p>
                    <p style={{
                      fontSize: '16px',
                      color: '#333',
                      margin: '0',
                      fontWeight: '600'
                    }}>
                      {vehicle.placa}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#8E8E93',
                      margin: '0 0 4px 0',
                      fontWeight: '600'
                    }}>
                      QUILOMETRAGEM
                    </p>
                    <p style={{
                      fontSize: '16px',
                      color: '#333',
                      margin: '0',
                      fontWeight: '600'
                    }}>
                      {vehicle.quilometragem.toLocaleString()} km
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Funcionalidade de edição em desenvolvimento');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#007AFF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Tem certeza que deseja excluir este veículo?')) {
                        setVehicles(vehicles.filter(v => v.id !== vehicle.id));
                      }
                    }}
                    style={{
                      backgroundColor: '#FF3B30',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Form Modal */}
        {showAddForm && (
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
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 24px 0'
              }}>
                Adicionar Novo Veículo
              </h2>
              
              <p style={{
                color: '#8E8E93',
                fontSize: '16px',
                textAlign: 'center',
                margin: '0 0 24px 0'
              }}>
                Funcionalidade em desenvolvimento
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: '#8E8E93',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesScreen;

