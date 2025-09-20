import React, { useState, useEffect } from 'react';
import { Button, Card, Input, LoadingSpinner, colors, spacing, typography } from './ui';

interface FuelRecord {
  id: string;
  veiculoId: string;
  veiculoNome: string;
  posto: string;
  combustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv';
  litros: number;
  valorLitro: number;
  valorTotal: number;
  quilometragem: number;
  data: string;
  observacoes?: string;
}

interface FuelScreenProps {
  onBack: () => void;
}

const FuelScreen: React.FC<FuelScreenProps> = ({ onBack }) => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterFuel, setFilterFuel] = useState<string>('todos');

  // Mock data para demonstração
  useEffect(() => {
    const mockFuelRecords: FuelRecord[] = [
      {
        id: '1',
        veiculoId: '1',
        veiculoNome: 'Toyota Corolla',
        posto: 'Posto Shell - Av. Paulista',
        combustivel: 'gasolina',
        litros: 45.2,
        valorLitro: 5.89,
        valorTotal: 266.23,
        quilometragem: 45250,
        data: '2024-01-15',
        observacoes: 'Tanque cheio'
      },
      {
        id: '2',
        veiculoId: '1',
        veiculoNome: 'Toyota Corolla',
        posto: 'Posto BR - Centro',
        combustivel: 'etanol',
        litros: 42.8,
        valorLitro: 4.12,
        valorTotal: 176.34,
        quilometragem: 44850,
        data: '2024-01-08'
      },
      {
        id: '3',
        veiculoId: '2',
        veiculoNome: 'Honda Civic',
        posto: 'Posto Ipiranga - Shopping',
        combustivel: 'gasolina',
        litros: 38.5,
        valorLitro: 5.95,
        valorTotal: 229.08,
        quilometragem: 52150,
        data: '2024-01-12'
      }
    ];

    // Simular carregamento
    setTimeout(() => {
      setFuelRecords(mockFuelRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const fuelTypes = [
    { value: 'todos', label: 'Todos os combustíveis' },
    { value: 'gasolina', label: 'Gasolina' },
    { value: 'etanol', label: 'Etanol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'gnv', label: 'GNV' }
  ];

  const filteredRecords = filterFuel === 'todos' 
    ? fuelRecords 
    : fuelRecords.filter(record => record.combustivel === filterFuel);

  const totalSpent = filteredRecords.reduce((sum, record) => sum + record.valorTotal, 0);
  const totalLiters = filteredRecords.reduce((sum, record) => sum + record.litros, 0);
  const averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;

  const getFuelIcon = (combustivel: string) => {
    const icons = {
      gasolina: '⛽',
      etanol: '🌱',
      diesel: '🚛',
      gnv: '💨'
    };
    return icons[combustivel as keyof typeof icons] || '⛽';
  };

  const getFuelColor = (combustivel: string) => {
    const colorMap = {
      gasolina: colors.secondary.error,
      etanol: colors.secondary.success,
      diesel: colors.neutral.text.primary,
      gnv: colors.primary.main
    };
    return colorMap[combustivel as keyof typeof colorMap] || colors.neutral.text.secondary;
  };

  const calculateConsumption = (currentRecord: FuelRecord, previousRecord?: FuelRecord) => {
    if (!previousRecord) return null;
    
    const kmDifference = currentRecord.quilometragem - previousRecord.quilometragem;
    const consumption = kmDifference / previousRecord.litros;
    
    return consumption > 0 ? consumption.toFixed(1) : null;
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
            Carregando abastecimentos...
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
              }}>⛽ Abastecimentos</h1>
              <p style={{
                fontSize: typography.fontSize.lg,
                color: colors.neutral.text.secondary,
                margin: '0'
              }}>Controle seus abastecimentos e consumo</p>
            </div>
          </div>
          <Button
            variant="success"
            onClick={() => setShowAddForm(true)}
            leftIcon="+"
          >
            Registrar Abastecimento
          </Button>
        </div>

        {/* Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing['2xl']
        }}>
          <Card padding="lg" style={{ backgroundColor: colors.secondary.error }}>
            <h3 style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary.contrast,
              margin: `0 0 ${spacing.sm} 0`
            }}>Total Gasto</h3>
            <p style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.primary.contrast,
              margin: '0'
            }}>
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card padding="lg" style={{ backgroundColor: colors.secondary.success }}>
            <h3 style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary.contrast,
              margin: `0 0 ${spacing.sm} 0`
            }}>Total de Litros</h3>
            <p style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.primary.contrast,
              margin: '0'
            }}>
              {totalLiters.toFixed(1)} L
            </p>
          </Card>

          <Card padding="lg" style={{ backgroundColor: colors.primary.main }}>
            <h3 style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary.contrast,
              margin: `0 0 ${spacing.sm} 0`
            }}>Preço Médio</h3>
            <p style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.primary.contrast,
              margin: '0'
            }}>
              R$ {averagePrice.toFixed(2)}/L
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
              Filtrar por combustível
            </label>
            <select
              value={filterFuel}
              onChange={(e) => setFilterFuel(e.target.value)}
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
              {fuelTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
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

        {/* Fuel Records List */}
        {filteredRecords.length === 0 ? (
          <Card padding="xl" style={{
            textAlign: 'center',
            backgroundColor: '#F8F9FA'
          }}>
            <div style={{ fontSize: '64px', marginBottom: spacing.lg }}>⛽</div>
            <h3 style={{ color: colors.neutral.text.primary, margin: `0 0 ${spacing.sm} 0` }}>
              Nenhum abastecimento encontrado
            </h3>
            <p style={{ color: colors.neutral.text.secondary, margin: `0 0 ${spacing.xl} 0` }}>
              {filterFuel === 'todos' 
                ? 'Registre seu primeiro abastecimento para começar a controlar seu consumo.'
                : `Nenhum abastecimento encontrado para "${fuelTypes.find(f => f.value === filterFuel)?.label}".`
              }
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
              Registrar Primeiro Abastecimento
            </Button>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gap: spacing.lg
          }}>
            {filteredRecords
              .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
              .map((record, index) => {
                const previousRecord = filteredRecords
                  .filter(r => r.veiculoId === record.veiculoId)
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .find(r => new Date(r.data) < new Date(record.data));
                
                const consumption = calculateConsumption(record, previousRecord);
                
                return (
                  <Card
                    key={record.id}
                    padding="lg"
                    hover
                    style={{
                      border: `1px solid ${colors.neutral.border}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: spacing.lg,
                      alignItems: 'center'
                    }}>
                      {/* Ícone e Info Principal */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md
                      }}>
                        <div style={{
                          fontSize: '32px',
                          backgroundColor: getFuelColor(record.combustivel),
                          color: colors.primary.contrast,
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getFuelIcon(record.combustivel)}
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            textTransform: 'capitalize'
                          }}>
                            {record.combustivel}
                          </h3>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.secondary,
                            margin: '0'
                          }}>
                            {record.veiculoNome}
                          </p>
                        </div>
                      </div>

                      {/* Detalhes */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: spacing.lg
                      }}>
                        <div>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            POSTO
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            fontWeight: typography.fontWeight.medium
                          }}>
                            {record.posto}
                          </p>
                        </div>

                        <div>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            LITROS
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            fontWeight: typography.fontWeight.medium
                          }}>
                            {record.litros.toFixed(1)} L
                          </p>
                        </div>

                        <div>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            PREÇO/LITRO
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            fontWeight: typography.fontWeight.medium
                          }}>
                            R$ {record.valorLitro.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            KM
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            fontWeight: typography.fontWeight.medium
                          }}>
                            {record.quilometragem.toLocaleString()} km
                          </p>
                        </div>

                        {consumption && (
                          <div>
                            <p style={{
                              fontSize: typography.fontSize.xs,
                              color: colors.neutral.text.secondary,
                              margin: '0',
                              fontWeight: typography.fontWeight.semibold
                            }}>
                              CONSUMO
                            </p>
                            <p style={{
                              fontSize: typography.fontSize.sm,
                              color: colors.secondary.success,
                              margin: '0',
                              fontWeight: typography.fontWeight.medium
                            }}>
                              {consumption} km/L
                            </p>
                          </div>
                        )}

                        <div>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            DATA
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral.text.primary,
                            margin: '0',
                            fontWeight: typography.fontWeight.medium
                          }}>
                            {new Date(record.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      {/* Valor Total e Ações */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: spacing.md
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral.text.secondary,
                            margin: '0',
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            TOTAL
                          </p>
                          <p style={{
                            fontSize: typography.fontSize.xl,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.secondary.error,
                            margin: '0'
                          }}>
                            R$ {record.valorTotal.toFixed(2)}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: spacing.sm }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => alert('Funcionalidade de edição em desenvolvimento')}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="error"
                            size="sm"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
                                setFuelRecords(fuelRecords.filter(r => r.id !== record.id));
                              }
                            }}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>

                    {record.observacoes && (
                      <div style={{
                        marginTop: spacing.md,
                        padding: spacing.md,
                        backgroundColor: colors.neutral.background,
                        borderRadius: '6px'
                      }}>
                        <p style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral.text.secondary,
                          margin: '0',
                          fontStyle: 'italic'
                        }}>
                          💬 {record.observacoes}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
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
                Registrar Novo Abastecimento
              </h2>
              
              <p style={{
                color: colors.neutral.text.secondary,
                fontSize: typography.fontSize.base,
                textAlign: 'center',
                margin: `0 0 ${spacing.xl} 0`
              }}>
                Funcionalidade em desenvolvimento
              </p>

              <div style={{
                display: 'flex',
                gap: spacing.md,
                justifyContent: 'flex-end'
              }}>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Fechar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FuelScreen;

