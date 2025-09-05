import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  tipoCombustivel: string;
}

const VehiclesScreenSimple: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    tipoCombustivel: 'flex'
  });
  const { user } = useAuth();

  // Mock data para demonstração
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020,
      placa: 'ABC-1234',
      tipoCombustivel: 'flex'
    },
    {
      id: '2',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2019,
      placa: 'XYZ-5678',
      tipoCombustivel: 'gasolina'
    }
  ];

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVehicles(mockVehicles);
    } catch (error) {
      alert('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marca || !formData.modelo || !formData.placa) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      // Simular criação na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData
      };
      
      setVehicles([...vehicles, newVehicle]);
      setFormData({
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        placa: '',
        tipoCombustivel: 'flex'
      });
      setShowForm(false);
      alert('Veículo adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return;
    
    try {
      setLoading(true);
      // Simular exclusão na API
      await new Promise(resolve => setTimeout(resolve, 500));
      setVehicles(vehicles.filter(v => v.id !== id));
      alert('Veículo excluído com sucesso!');
    } catch (error) {
      alert('Erro ao excluir veículo');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '1000px',
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
            }}>Meus Veículos</h1>
            <p style={{
              fontSize: '16px',
              color: '#8E8E93',
              margin: '0'
            }}>Gerencie sua frota de veículos</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            style={{
              backgroundColor: '#007AFF',
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
            {showForm ? 'Cancelar' : '+ Adicionar Veículo'}
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
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Novo Veículo</h3>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ex: Toyota"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ex: Corolla"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Ano
                  </label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({...formData, ano: parseInt(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={formData.placa}
                    onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="ABC-1234"
                    maxLength={8}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Combustível
                  </label>
                  <select
                    value={formData.tipoCombustivel}
                    onChange={(e) => setFormData({...formData, tipoCombustivel: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5EA',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="flex">Flex</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                    <option value="diesel">Diesel</option>
                    <option value="gnv">GNV</option>
                  </select>
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
                {loading ? 'Salvando...' : 'Salvar Veículo'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de Veículos */}
        {loading && !showForm ? (
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
            <p style={{ color: '#8E8E93' }}>Carregando veículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8E8E93'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhum veículo cadastrado</p>
            <p>Clique em "Adicionar Veículo" para começar</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  backgroundColor: '#F8F9FA',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5EA'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    color: '#333',
                    margin: '0',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
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
                
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <p style={{ margin: '4px 0' }}><strong>Ano:</strong> {vehicle.ano}</p>
                  <p style={{ margin: '4px 0' }}><strong>Placa:</strong> {vehicle.placa}</p>
                  <p style={{ margin: '4px 0' }}><strong>Combustível:</strong> {vehicle.tipoCombustivel}</p>
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

export default VehiclesScreenSimple;

