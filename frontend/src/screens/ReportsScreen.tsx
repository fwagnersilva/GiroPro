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
    } catch (error) {
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

      let blob;
      let filename;
      
      switch (selectedReport) {
        case 'journey-earnings':
          blob = await reportService.downloadJourneyEarningsCSV(params);
          filename = 'relatorio_jornadas.csv';
          break;
        case 'expense-analysis':
          blob = await reportService.downloadExpenseAnalysisCSV(params);
          filename = 'relatorio_despesas.csv';
          break;
        case 'fuel-consumption':
          blob = await reportService.downloadFuelConsumptionCSV(params);
          filename = 'relatorio_combustivel.csv';
          break;
        default:
          throw new Error('Tipo de relatório inválido');
      }

      // Para React Native, você precisaria usar uma biblioteca como react-native-fs
      // ou expo-file-system para salvar o arquivo
      if (Platform.OS === 'web') {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = escapeHtml(filename);
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        Alert.alert('Sucesso', 'Relatório gerado! Em breve será possível fazer download no app.');
      }
    } catch (error: any) {
      console.error('Erro ao baixar CSV:', error);
      Alert.alert('Erro', error.message || 'Não foi possível baixar o relatório');
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
                style={styles.picker}
              >
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
                >
                  <Ionicons name="download" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Baixar CSV</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {selectedReport === 'weekly-monthly' ? (
        renderReportContent()
      ) : (
        reportData && (
          <View style={styles.reportContainer}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{getReportTitle()}</Text>
              <Text style={styles.reportPeriod}>{getPeriodLabel()}</Text>
            </View>
            
            {renderReportContent()}
          </View>
        )
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#FFF",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#FFF",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  reportContainer: {
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  reportPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reportContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  journeyCard: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  journeyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  journeyVehicle: {
    fontSize: 12,
    color: '#666',
  },
  journeyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journeyStat: {
    flex: 1,
  },
  journeyStatLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  journeyStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  expenseCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseCategoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  expenseCategoryValue: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  fuelConsumptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fuelConsumptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  fuelConsumptionValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default ReportsScreen;

