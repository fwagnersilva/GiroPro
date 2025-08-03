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
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { reportService, vehicleService } from '../services/api';
import { Vehicle } from '../types';
import LoadingSpinner from './LoadingSpinner';

type ReportType = 'weekly' | 'monthly' | 'weekly-comparison' | 'monthly-comparison';

interface WeeklyMonthlyReportsProps {
  navigation?: any;
}

const WeeklyMonthlyReports: React.FC<WeeklyMonthlyReportsProps> = ({ navigation }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<ReportType>('monthly');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

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
        id_veiculo: selectedVehicle || undefined,
        data_inicio: customDateRange.start || undefined,
        data_fim: customDateRange.end || undefined,
      };

      let data;
      switch (selectedReport) {
        case 'weekly':
          data = await reportService.getWeeklyReport(params);
          break;
        case 'monthly':
          data = await reportService.getMonthlyReport(params);
          break;
        case 'weekly-comparison':
          data = await reportService.getWeeklyComparison({
            id_veiculo: selectedVehicle || undefined,
            numero_semanas: 4
          });
          break;
        case 'monthly-comparison':
          data = await reportService.getMonthlyComparison({
            id_veiculo: selectedVehicle || undefined,
            numero_meses: 6
          });
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
        id_veiculo: selectedVehicle || undefined,
        data_inicio: customDateRange.start || undefined,
        data_fim: customDateRange.end || undefined,
      };

      let blob;
      let filename;
      
      switch (selectedReport) {
        case 'weekly':
          blob = await reportService.downloadWeeklyReportCSV(params);
          filename = 'relatorio_semanal.csv';
          break;
        case 'monthly':
          blob = await reportService.downloadMonthlyReportCSV(params);
          filename = 'relatorio_mensal.csv';
          break;
        default:
          Alert.alert('Info', 'Download CSV não disponível para relatórios comparativos');
          return;
      }

      if (Platform.OS === 'web') {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
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
      case 'weekly':
        return 'Relatório Semanal';
      case 'monthly':
        return 'Relatório Mensal';
      case 'weekly-comparison':
        return 'Comparativo Semanal';
      case 'monthly-comparison':
        return 'Comparativo Mensal';
      default:
        return 'Relatório';
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toFixed(2)}`;
  };

  const renderFinancialSummary = (resumo: any) => {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Faturamento Bruto</Text>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {formatCurrency(resumo.faturamento_bruto)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Despesas</Text>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {formatCurrency(resumo.total_despesas)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lucro Líquido</Text>
            <Text style={[
              styles.statValue,
              { color: resumo.lucro_liquido >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {formatCurrency(resumo.lucro_liquido)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Margem de Lucro</Text>
            <Text style={[
              styles.statValue,
              { color: resumo.margem_lucro >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {resumo.margem_lucro.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>KM Total</Text>
            <Text style={styles.additionalStatValue}>{resumo.km_total} km</Text>
          </View>
          
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>Número de Jornadas</Text>
            <Text style={styles.additionalStatValue}>{resumo.numero_jornadas}</Text>
          </View>
          
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>Custo por KM</Text>
            <Text style={styles.additionalStatValue}>
              R$ {(resumo.custo_por_km / 100).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>Ganho Médio/Jornada</Text>
            <Text style={styles.additionalStatValue}>
              {formatCurrency(resumo.ganho_medio_por_jornada)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderExpenseBreakdown = (detalhamento: any) => {
    if (!detalhamento) return null;

    const totalDespesas = detalhamento.combustivel.total + 
      detalhamento.outras_categorias.reduce((sum: number, cat: any) => sum + cat.total, 0);

    return (
      <View style={styles.expenseContainer}>
        <Text style={styles.sectionTitle}>Detalhamento de Despesas</Text>
        
        <View style={styles.expenseItem}>
          <Text style={styles.expenseCategory}>Combustível</Text>
          <Text style={styles.expenseValue}>
            {formatCurrency(detalhamento.combustivel.total)}
          </Text>
          <Text style={styles.expensePercentage}>
            {totalDespesas > 0 ? ((detalhamento.combustivel.total / totalDespesas) * 100).toFixed(1) : 0}%
          </Text>
        </View>

        {detalhamento.outras_categorias.map((categoria: any, index: number) => (
          <View key={index} style={styles.expenseItem}>
            <Text style={styles.expenseCategory}>{categoria.categoria}</Text>
            <Text style={styles.expenseValue}>
              {formatCurrency(categoria.total)}
            </Text>
            <Text style={styles.expensePercentage}>
              {totalDespesas > 0 ? ((categoria.total / totalDespesas) * 100).toFixed(1) : 0}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDailyEvolution = (evolucao: any[]) => {
    if (!evolucao || evolucao.length === 0) return null;

    const chartData = {
      labels: evolucao.slice(-7).map(item => {
        const date = new Date(item.data);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: evolucao.slice(-7).map(item => item.lucro / 100),
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Evolução do Lucro (Últimos 7 dias)</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          yAxisLabel="R$"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#4CAF50"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  };

  const renderComparison = (comparativo: any[]) => {
    if (!comparativo || comparativo.length === 0) return null;

    const chartData = {
      labels: comparativo.map(item => 
        selectedReport === 'weekly-comparison' 
          ? `Sem ${item.numero_semana}` 
          : item.mes_ano.split(' ')[0].substring(0, 3)
      ),
      datasets: [
        {
          data: comparativo.map(item => item.lucro_liquido / 100),
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        }
      ]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>
          {selectedReport === 'weekly-comparison' ? 'Comparativo Semanal' : 'Comparativo Mensal'}
        </Text>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          yAxisLabel="R$"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.comparisonList}>
          {comparativo.map((item, index) => (
            <View key={index} style={styles.comparisonCard}>
              <Text style={styles.comparisonPeriod}>
                {selectedReport === 'weekly-comparison' ? `Semana ${item.numero_semana}` : item.mes_ano}
              </Text>
              <Text style={styles.comparisonValue}>
                {formatCurrency(item.lucro_liquido)}
              </Text>
              <Text style={styles.comparisonMargin}>
                {item.margem_lucro.toFixed(1)}% margem
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderIndicators = (indicadores: any) => {
    if (!indicadores) return null;

    return (
      <View style={styles.indicatorsContainer}>
        <Text style={styles.sectionTitle}>Indicadores de Performance</Text>
        
        <View style={styles.indicatorItem}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
          <View style={styles.indicatorText}>
            <Text style={styles.indicatorLabel}>Eficiência Financeira</Text>
            <Text style={styles.indicatorValue}>{indicadores.eficiencia_financeira}</Text>
          </View>
        </View>
        
        <View style={styles.indicatorItem}>
          <Ionicons name="speedometer" size={24} color="#2196F3" />
          <View style={styles.indicatorText}>
            <Text style={styles.indicatorLabel}>Produtividade</Text>
            <Text style={styles.indicatorValue}>{indicadores.produtividade}</Text>
          </View>
        </View>
        
        <View style={styles.indicatorItem}>
          <Ionicons name="calculator" size={24} color="#FF9800" />
          <View style={styles.indicatorText}>
            <Text style={styles.indicatorLabel}>Custo Operacional</Text>
            <Text style={styles.indicatorValue}>{indicadores.custo_operacional}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    if (selectedReport === 'weekly-comparison' || selectedReport === 'monthly-comparison') {
      const comparativo = selectedReport === 'weekly-comparison' 
        ? reportData.comparativo_semanas 
        : reportData.comparativo_meses;
      
      return (
        <View style={styles.reportContent}>
          {renderComparison(comparativo)}
        </View>
      );
    }

    const { resumo_financeiro, detalhamento_despesas, evolucao_diaria, indicadores } = reportData;

    return (
      <View style={styles.reportContent}>
        {renderFinancialSummary(resumo_financeiro)}
        {renderExpenseBreakdown(detalhamento_despesas)}
        {renderDailyEvolution(evolucao_diaria)}
        {renderIndicators(indicadores)}
      </View>
    );
  };

  if (loadingVehicles) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Tipo de Relatório</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedReport}
            onValueChange={(value) => setSelectedReport(value)}
            style={styles.picker}
          >
            <Picker.Item label="Relatório Semanal" value="weekly" />
            <Picker.Item label="Relatório Mensal" value="monthly" />
            <Picker.Item label="Comparativo Semanal" value="weekly-comparison" />
            <Picker.Item label="Comparativo Mensal" value="monthly-comparison" />
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

          {reportData && (selectedReport === 'weekly' || selectedReport === 'monthly') && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadCSV}
            >
              <Ionicons name="download" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Baixar CSV</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {reportData && (
        <View style={styles.reportContainer}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>{getReportTitle()}</Text>
            <Text style={styles.reportPeriod}>
              {reportData.periodo ? reportData.periodo.descricao : 'Comparativo'}
            </Text>
          </View>
          {renderReportContent()}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
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
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 20,
  },
  reportHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reportPeriod: {
    fontSize: 16,
    color: '#666',
  },
  reportContent: {
    flex: 1,
  },
  summaryContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  additionalStatItem: {
    width: '48%',
    marginBottom: 10,
  },
  additionalStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expenseContainer: {
    marginBottom: 30,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseCategory: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  expensePercentage: {
    fontSize: 14,
    color: '#666',
    width: 50,
    textAlign: 'right',
  },
  chartContainer: {
    marginBottom: 30,
  },
  comparisonList: {
    marginTop: 15,
  },
  comparisonCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  comparisonPeriod: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  comparisonMargin: {
    fontSize: 12,
    color: '#666',
  },
  indicatorsContainer: {
    marginBottom: 20,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  indicatorText: {
    marginLeft: 15,
    flex: 1,
  },
  indicatorLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 14,
    color: '#666',
  },
});

export default WeeklyMonthlyReports;

