import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { reportService, vehicleService } from '../services/api';
import { Vehicle } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { escapeHtml } from '../utils/security';

type ReportType = 'journey-earnings' | 'expense-analysis' | 'fuel-consumption' | 'weekly-monthly';
type Period = 'hoje' | 'semana' | 'mes' | 'ano';

const ReportsScreen: React.FC = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('mes');
  const [selectedReport, setSelectedReport] = useState<ReportType>('journey-earnings');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const vehiclesData = await vehicleService.getVehicles();
      setVehicles(vehiclesData);
    } catch (error: any) {
      console.error('Erro ao carregar veículos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setReportData(null);

      const params = {
        periodo: selectedPeriod,
        id_veiculo: selectedVehicle || undefined,
      };

      let data;
      switch (selectedReport) {
        case 'journey-earnings':
          data = await reportService.getJourneyEarningsReport(params);
          break;
        case 'expense-analysis':
          data = await reportService.getExpenseAnalysisReport(params);
          break;
        case 'fuel-consumption':
          data = await reportService.getFuelConsumptionReport(params);
          break;
        default:
          throw new Error('Tipo de relatório inválido');
      }

      setReportData(data);
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', error.message || 'Não foi possível gerar o relatório');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const params = {
        periodo: selectedPeriod,
        id_veiculo: selectedVehicle || undefined,
      };

      let blobResponse;
      let filename;
      
      switch (selectedReport) {
        case 'journey-earnings':
          blobResponse = await reportService.downloadJourneyEarningsCSV(params);
          filename = 'relatorio_jornadas.csv';
          break;
        case 'expense-analysis':
          blobResponse = await reportService.downloadExpenseAnalysisCSV(params);
          filename = 'relatorio_despesas.csv';
          break;
        case 'fuel-consumption':
          blobResponse = await reportService.downloadFuelConsumptionCSV(params);
          filename = 'relatório_combustivel.csv';
          break;
        default:
          throw new Error('Tipo de relatório inválido');
      }

      // Ensure the blob is treated as text/csv to prevent XSS
      const csvBlob = new Blob([blobResponse], { type: 'text/csv' });
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = encodeURI(url);      link.setAttribute("download", encodeURIComponent(filename.replace(/[^a-zA-Z0-9_.-]/g, "_")));
      // document.body.appendChild(link); // Removido para prevenir XSS
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (Platform.OS !== 'web') {
        Alert.alert('Sucesso', 'Relatório gerado! Em breve você poderá fazer o download no aplicativo.');
      }
    } catch (error: any) {
      console.error('Erro ao baixar CSV:', error);
      Alert.alert('Erro', error.message || 'Não foi possível baixar o relatório.');
    }
  };

  const getReportTitle = () => {
    switch (selectedReport) {
      case 'journey-earnings':
        return 'Relatório de Ganhos por Jornada';
      case 'expense-analysis':
        return 'Relatório de Análise de Despesas';
      case 'fuel-consumption':
        return 'Relatório de Consumo de Combustível';
      default:
        return 'Relatório';
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'hoje':
        return 'Hoje';
      case 'semana':
        return 'Última Semana';
      case 'mes':
        return 'Este Mês';
      case 'ano':
        return 'Este Ano';
      default: 
        return 'Período';
    }
  };

  const renderReportContent = () => {
    if (selectedReport === 'weekly-monthly') {
      return <WeeklyMonthlyReports navigation={navigation} />;
    }

    if (!reportData) return null;

    switch (selectedReport) {
      case 'journey-earnings':
        return renderJourneyEarningsReport();
      case 'expense-analysis':
        return renderExpenseAnalysisReport();
      case 'fuel-consumption':
        return renderFuelConsumptionReport();
      default:
        return null;
    }
  };

  const renderJourneyEarningsReport = () => {
    const { estatisticas, jornadas, total_jornadas, faturamento_diario } = reportData;

    return (
      <View style={styles.reportContent}>
        <Text style={styles.sectionTitle}>Resumo Estatístico</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Jornadas</Text>
            <Text style={styles.statValue}>{total_jornadas}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ganho Bruto Total</Text>
            <Text style={styles.statValue}>
              R$ {(estatisticas.total_ganho_bruto / 100).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lucro Líquido Total</Text>
            <Text style={[
              styles.statValue,
              { color: estatisticas.total_lucro_liquido >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              R$ {(estatisticas.total_lucro_liquido / 100).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Margem de Lucro</Text>
            <Text style={[
              styles.statValue,
              { color: estatisticas.margem_lucro_media >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {estatisticas.margem_lucro_media.toFixed(1)}%
            </Text>
          </View>
        </View>

        {faturamento_diario && faturamento_diario.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Faturamento Diário (Últimos 30 dias)</Text>
            <LineChart
              data={faturamento_diario}
              width={Dimensions.get("window").width - 60} // from react-native
              height={220}
              yAxisLabel="R$"
              yAxisSuffix=""
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Últimas Jornadas</Text>
        
        {jornadas.slice(0, 5).map((jornada: any, index: number) => (
          <View key={index} style={styles.journeyCard}>
            <View style={styles.journeyHeader}>
              <Text style={styles.journeyDate}>
                {new Date(jornada.data_inicio).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.journeyVehicle}>
                {jornada.veiculo.marca} {jornada.veiculo.modelo}
              </Text>
            </View>
            
            <View style={styles.journeyStats}>
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatLabel}>Ganho Bruto</Text>
                <Text style={styles.journeyStatValue}>
                  R$ {(jornada.financeiro.ganho_bruto / 100).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatLabel}>Lucro Líquido</Text>
                <Text style={[
                  styles.journeyStatValue,
                  { color: jornada.financeiro.lucro_liquido_estimado >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  R$ {(jornada.financeiro.lucro_liquido_estimado / 100).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.journeyStat}>
                <Text style={styles.journeyStatLabel}>KM Total</Text>
                <Text style={styles.journeyStatValue}>
                  {jornada.quilometragem.total || 0} km
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderExpenseAnalysisReport = () => {
    const { despesas_por_categoria, evolucao_despesas, comparacao_veiculos, analise_combustivel } = reportData;

    const totalDespesas = despesas_por_categoria.reduce((sum: any, item: any) => sum + item.total_valor, 0);

    return (
      <View style={styles.reportContent}>
        <Text style={styles.sectionTitle}>Resumo de Despesas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Despesas</Text>
            <Text style={styles.statValue}>
              R$ {(totalDespesas / 100).toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Categorias</Text>
            <Text style={styles.statValue}>
              {despesas_por_categoria.length}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
        {despesas_por_categoria.length > 0 ? (
          despesas_por_categoria.map((item: any, index: number) => (
            <View key={index} style={styles.expenseCategoryItem}>
              <Text style={styles.expenseCategoryText}>{item.tipo_despesa}</Text>
              <Text style={styles.expenseCategoryValue}>
                R$ {(item.total_valor / 100).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>Nenhuma despesa encontrada para este período.</Text>
        )}

        {/* Placeholder para evolução e comparação */}
        <Text style={styles.sectionTitle}>Evolução das Despesas (Em breve)</Text>
        <Text style={styles.placeholder}>
          Gráficos de evolução e comparação entre veículos serão implementados em futuras versões.
        </Text>
      </View>
    );
  };

  const renderFuelConsumptionReport = () => {
    const { consumo_por_veiculo, evolucao_precos, comparacao_combustiveis, analise_eficiencia } = reportData;

    const totalLitros = consumo_por_veiculo.reduce((sum: any, item: any) => sum + item.total_litros, 0);
    const totalGasto = consumo_por_veiculo.reduce((sum: any, item: any) => sum + item.total_gasto, 0);

    return (
      <View style={styles.reportContent}>
        <Text style={styles.sectionTitle}>Resumo de Consumo</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Litros</Text>
            <Text style={styles.statValue}>
              {totalLitros.toFixed(2)} L
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Gasto</Text>
            <Text style={styles.statValue}>
              R$ {(totalGasto / 100).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Consumo por Veículo</Text>
        {consumo_por_veiculo.length > 0 ? (
          consumo_por_veiculo.map((item: any, index: number) => (
            <View key={index} style={styles.fuelConsumptionItem}>
              <Text style={styles.fuelConsumptionText}>{item.veiculo_marca} {item.veiculo_modelo}</Text>
              <Text style={styles.fuelConsumptionValue}>
                {item.total_litros.toFixed(2)} L (R$ {(item.total_gasto / 100).toFixed(2)})
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>Nenhum consumo de combustível encontrado para este período.</Text>
        )}

        {/* Placeholder para evolução e comparação */}
        <Text style={styles.sectionTitle}>Evolução de Preços (Em breve)</Text>
        <Text style={styles.placeholder}>
          Gráficos de evolução de preços e comparação entre tipos de combustível serão implementados em futuras versões.
        </Text>
      </View>
    );
  };

  if (loadingVehicles) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Relatórios</Text>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Tipo de Relatório</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedReport}
            onValueChange={(value) => setSelectedReport(value)}
            style={styles.picker}
          >
            <Picker.Item label="Ganhos por Jornada" value="journey-earnings" />
            <Picker.Item label="Análise de Despesas" value="expense-analysis" />
            <Picker.Item label="Consumo de Combustível" value="fuel-consumption" />
            <Picker.Item label="Relatórios Semanais e Mensais" value="weekly-monthly" />
          </Picker>
        </View>

        {selectedReport !== 'weekly-monthly' && (
          <>
            <Text style={styles.filterLabel}>Período</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value)}
                style={styles.picker}
              >
                <Picker.Item label="Hoje" value="hoje" />
                <Picker.Item label="Última Semana" value="semana" />
                <Picker.Item label="Este Mês" value="mes" />
                <Picker.Item label="Este Ano" value="ano" />
              </Picker>
            </View>

            <Text style={styles.filterLabel}>Veículo (Opcional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVehicle}
                onValueChange={(value) => setSelectedVehicle(value)}
                style={styles.picker}>
                <Picker.Item label="Todos os veículos" value="" />
                {vehicles.map((vehicle) => (
                  <Picker.Item
                    key={vehicle.id}
                    label={`${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})`}
                    value={vehicle.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateReport}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="analytics" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Gerar Relatório</Text>
                  </>
                )}
              </TouchableOpacity>

              {reportData && (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={downloadCSV}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="download" size={20} color="#FFF" />
                      <Text style={styles.buttonText}>Baixar CSV</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </> 
        )}

        {selectedReport === 'weekly-monthly' && (
          <View style={styles.weeklyMonthlyContainer}>
            <Text style={styles.placeholder}>Funcionalidade em desenvolvimento. Em breve você poderá visualizar relatórios semanais e mensais aqui.</Text>
          </View>
        )}
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        renderReportContent()
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  pickerContainer: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  generateButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
  },
  downloadButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  reportContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 10,
  },
  journeyCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  journeyDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  journeyVehicle: {
    fontSize: 14,
    color: '#777',
  },
  journeyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  journeyStat: {
    alignItems: 'center',
  },
  journeyStatLabel: {
    fontSize: 12,
    color: '#888',
  },
  journeyStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  expenseCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  expenseCategoryText: {
    fontSize: 15,
    color: '#333',
  },
  expenseCategoryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  fuelConsumptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  fuelConsumptionText: {
    fontSize: 15,
    color: '#333',
  },
  fuelConsumptionValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  weeklyMonthlyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ReportsScreen;
