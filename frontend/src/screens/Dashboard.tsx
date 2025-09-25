import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext will be moved to its own file

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
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2F2F7",
      padding: "24px"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#007AFF",
              margin: "0 0 8px 0"
            }}>
              Dashboard
            </h1>
            <p style={{
              fontSize: "16px",
              color: "#6C757D",
              margin: 0
            }}>
              Bem-vindo, Usuário Teste!
            </p>
          </div>
          <button
            onClick={signOut}
            style={{
              backgroundColor: "#FF3B30",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            Sair
          </button>
        </div>

        {/* Main Metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "32px"
        }}>
          {dashboardData?.metricas_principais && (
            <>
              <div style={{
                backgroundColor: "#E6F7ED",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #52C41A"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#52C41A",
                  margin: "0 0 8px 0"
                }}>
                  Faturamento Bruto
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#52C41A",
                  margin: 0
                }}>
                  {formatCurrency(dashboardData.metricas_principais.faturamento_bruto)}
                </p>
              </div>

              <div style={{
                backgroundColor: "#FFF1F0",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #F5222D"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#F5222D",
                  margin: "0 0 8px 0"
                }}>
                  Total de Despesas
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#F5222D",
                  margin: 0
                }}>
                  {formatCurrency(dashboardData.metricas_principais.total_despesas)}
                </p>
              </div>

              <div style={{
                backgroundColor: "#E6F7FF",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #1890FF"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#1890FF",
                  margin: "0 0 8px 0"
                }}>
                  Lucro Líquido
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1890FF",
                  margin: "0 0 4px 0"
                }}>
                  {formatCurrency(dashboardData.metricas_principais.lucro_liquido)}
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#1890FF",
                  margin: 0
                }}>
                  Margem: {dashboardData.metricas_principais.margem_lucro}%
                </p>
              </div>

              <div style={{
                backgroundColor: "#FFFBE6",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #FAAD14"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#FAAD14",
                  margin: "0 0 8px 0"
                }}>
                  Ganho por Hora
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#FAAD14",
                  margin: 0
                }}>
                  {formatCurrency(dashboardData.metricas_operacionais.ganho_por_hora)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Operational Metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px"
        }}>
          {dashboardData?.metricas_operacionais && (
            <>
              <div style={{
                backgroundColor: "#F0F2F5",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #D9D9D9"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#333333",
                  margin: "0 0 8px 0"
                }}>
                  KM Total
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333333",
                  margin: 0
                }}>
                  {dashboardData.metricas_operacionais.km_total.toLocaleString("pt-BR")} km
                </p>
              </div>

              <div style={{
                backgroundColor: "#F0F2F5",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #D9D9D9"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#333333",
                  margin: "0 0 8px 0"
                }}>
                  Jornadas
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333333",
                  margin: 0
                }}>
                  {dashboardData.metricas_operacionais.numero_jornadas}
                </p>
              </div>

              <div style={{
                backgroundColor: "#F0F2F5",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #D9D9D9"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  color: "#333333",
                  margin: "0 0 8px 0"
                }}>
                  Custo por KM
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333333",
                  margin: 0
                }}>
                  {formatCurrency(dashboardData.metricas_operacionais.custo_por_km)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

