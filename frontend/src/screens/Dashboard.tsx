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
              color: "#666",
              margin: "0"
            }}>
              Bem-vindo, {user?.nome}!
            </p>
          </div>
          <button
            onClick={signOut}
            style={{
              padding: "12px 24px",
              backgroundColor: "#FF3B30",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Sair
          </button>
        </div>

        {loadingData ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Carregando dados...</p>
          </div>
        ) : dashboardData ? (
          <div>
            {/* Métricas Principais */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}>
              <div style={{
                backgroundColor: "#E8F5E8",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #34C759"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  color: "#34C759",
                  margin: "0 0 8px 0"
                }}>
                  Faturamento Bruto
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0"
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.faturamento_bruto || 0)}
                </p>
              </div>

              <div style={{
                backgroundColor: "#FFE8E8",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #FF3B30"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  color: "#FF3B30",
                  margin: "0 0 8px 0"
                }}>
                  Total de Despesas
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0"
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.total_despesas || 0)}
                </p>
              </div>

              <div style={{
                backgroundColor: "#E8F4FF",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #007AFF"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  color: "#007AFF",
                  margin: "0 0 8px 0"
                }}>
                  Lucro Líquido
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0"
                }}>
                  {formatCurrency(dashboardData.metricas_principais?.lucro_liquido || 0)}
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: "4px 0 0 0"
                }}>
                  Margem: {(dashboardData.metricas_principais?.margem_lucro || 0).toFixed(1)}%
                </p>
              </div>

              <div style={{
                backgroundColor: "#FFF4E8",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #FF9500"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  color: "#FF9500",
                  margin: "0 0 8px 0"
                }}>
                  Ganho por Hora
                </h3>
                <p style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0"
                }}>
                  {formatCurrency(dashboardData.metricas_operacionais?.ganho_por_hora || 0)}
                </p>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px"
            }}>
              <div style={{
                backgroundColor: "#F8F9FA",
                padding: "16px",
                borderRadius: "8px"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#666" }}>KM Total</h4>
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}>
                  {(dashboardData.metricas_operacionais?.km_total || 0).toLocaleString()} km
                </p>
              </div>

              <div style={{
                backgroundColor: "#F8F9FA",
                padding: "16px",
                borderRadius: "8px"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#666" }}>Jornadas</h4>
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}>
                  {dashboardData.metricas_operacionais?.numero_jornadas || 0}
                </p>
              </div>

              <div style={{
                backgroundColor: "#F8F9FA",
                padding: "16px",
                borderRadius: "8px"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#666" }}>Custo por KM</h4>
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}>
                  {formatCurrency(dashboardData.metricas_operacionais?.custo_por_km || 0)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Nenhum dado disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


