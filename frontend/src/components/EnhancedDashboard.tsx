import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface DashboardMetrics {
  faturamentoBruto: number;
  totalDespesas: number;
  lucroLiquido: number;
  margemLucro: number;
  kmTotal: number;
  numeroJornadas: number;
  ganhoMedioPorJornada: number;
  ganhoPorHora: number;
}

interface Props {
  metrics: DashboardMetrics;
  period: 'hoje' | 'semana' | 'mes' | 'ano';
  onPeriodChange: (period: 'hoje' | 'semana' | 'mes' | 'ano') => void;
  loading?: boolean;
}

const EnhancedDashboard: React.FC<Props> = ({
  metrics,
  period,
  onPeriodChange,
  loading = false,
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number, suffix = '') => {
    return `${value.toLocaleString('pt-BR')}${suffix}`;
  };

  const getCardColor = (type: string) => {
    const colors = {
      revenue: '#4CAF50',
      expense: '#F44336',
      profit: '#2196F3',
      margin: '#FF9800',
      distance: '#9C27B0',
      trips: '#607D8B',
      avgTrip: '#795548',
      hourly: '#009688',
    };
    return colors[type as keyof typeof colors] || '#666';
  };

  const periodLabels = {
    hoje: 'Hoje',
    semana: 'Esta Semana',
    mes: 'Este Mês',
    ano: 'Este Ano',
  };

  const DashboardCard = ({
    title,
    value,
    icon,
    type,
    trend,
    trendValue,
  }: {
    title: string;
    value: string;
    icon: string;
    type: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  }) => {
    const cardColor = getCardColor(type);
    const isSelected = selectedCard === type;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isSelected ? cardColor + '15' : 'white',
            borderColor: isSelected ? cardColor : '#E0E0E0',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => setSelectedCard(isSelected ? null : type)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
            <Ionicons name={icon as any} size={24} color={cardColor} />
          </View>
          {trend && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove'}
                size={16}
                color={trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : '#666'}
              />
              <Text
                style={[
                  styles.trendText,
                  {
                    color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : '#666',
                  },
                ]}
              >
                {trendValue}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.cardValue, { color: cardColor }]}>{value}</Text>
      </TouchableOpacity>
    );
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2196F3',
    },
  };

  // Dados de exemplo para os gráficos
  const weeklyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [120, 180, 150, 200, 240, 300, 280],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const expenseData = {
    labels: ['Combustível', 'Manutenção', 'Outros'],
    datasets: [
      {
        data: [60, 25, 15],
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com seletor de período */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodSelector}
          >
            {Object.entries(periodLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: period === key ? '#2196F3' : 'transparent',
                    borderColor: period === key ? '#2196F3' : '#E0E0E0',
                  },
                ]}
                onPress={() => onPeriodChange(key as any)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: period === key ? 'white' : '#666' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Cards principais */}
        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Faturamento Bruto"
            value={formatCurrency(metrics.faturamentoBruto)}
            icon="trending-up-outline"
            type="revenue"
            trend="up"
            trendValue="+12%"
          />
          <DashboardCard
            title="Total Despesas"
            value={formatCurrency(metrics.totalDespesas)}
            icon="receipt-outline"
            type="expense"
            trend="down"
            trendValue="-5%"
          />
          <DashboardCard
            title="Lucro Líquido"
            value={formatCurrency(metrics.lucroLiquido)}
            icon="cash-outline"
            type="profit"
            trend="up"
            trendValue="+18%"
          />
          <DashboardCard
            title="Margem de Lucro"
            value={`${metrics.margemLucro.toFixed(1)}%`}
            icon="pie-chart-outline"
            type="margin"
            trend="up"
            trendValue="+2.3%"
          />
        </View>

        {/* Cards operacionais */}
        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Km Percorridos"
            value={formatNumber(metrics.kmTotal, ' km')}
            icon="speedometer-outline"
            type="distance"
          />
          <DashboardCard
            title="Número de Jornadas"
            value={formatNumber(metrics.numeroJornadas)}
            icon="car-outline"
            type="trips"
          />
          <DashboardCard
            title="Ganho por Jornada"
            value={formatCurrency(metrics.ganhoMedioPorJornada)}
            icon="stats-chart-outline"
            type="avgTrip"
          />
          <DashboardCard
            title="Ganho por Hora"
            value={formatCurrency(metrics.ganhoPorHora)}
            icon="time-outline"
            type="hourly"
          />
        </View>

        {/* Gráfico de faturamento semanal */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Faturamento da Semana</Text>
          <LineChart
            data={weeklyData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Gráfico de distribuição de despesas */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribuição de Despesas</Text>
          <BarChart
            data={expenseData}
            width={width - 40}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>

        {/* Espaçamento inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 8,
  },
});

export default EnhancedDashboard;

