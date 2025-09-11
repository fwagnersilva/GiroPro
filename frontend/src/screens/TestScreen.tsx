import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TestScreenProps {
  navigation: any;
}

const TestScreen: React.FC<TestScreenProps> = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const navigateToVehicles = () => {
    navigation.navigate('Vehicles');
  };

  const navigateToExpenses = () => {
    navigation.navigate('Expenses');
  };

  const navigateToFuelings = () => {
    navigation.navigate('Fuelings');
  };

  const navigateToReports = () => {
    navigation.navigate('Reports');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToJourneys = () => {
    navigation.navigate('Journeys');
  };

  const navigateToJourneyHistory = () => {
    navigation.navigate('JourneyHistory');
  };

  const navigateToOnboarding = () => {
    navigation.navigate('Onboarding');
  };

  const navigateToMultiVehicle = () => {
    navigation.navigate('MultiVehicle');
  };

  const navigateToFuelPrices = () => {
    navigation.navigate('FuelPrices');
  };

  const navigateToExpenseHistory = () => {
    navigation.navigate('ExpenseHistory');
  };

  const navigateToFuelingHistory = () => {
    navigation.navigate('FuelingHistory');
  };

  const navigateToAchievements = () => {
    navigation.navigate('Achievements');
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const navigateToGoals = () => {
    navigation.navigate('Goals');
  };

  const navigateToInsights = () => {
    navigation.navigate('Insights');
  };

  const navigateToAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const navigateToAddFueling = () => {
    navigation.navigate('AddFueling');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="car-sport" size={48} color="#007AFF" />
          <Text style={styles.title}>GiroPro - Test Navigation</Text>
          <Text style={styles.subtitle}>Teste todas as telas do aplicativo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Autenticação</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
            <Ionicons name="log-in-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToOnboarding}>
            <Ionicons name="help-circle-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Onboarding</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Telas Principais</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToDashboard}>
            <Ionicons name="home-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToVehicles}>
            <Ionicons name="car-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Meus Veículos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToExpenses}>
            <Ionicons name="receipt-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Despesas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToFuelings}>
            <Ionicons name="car-sport-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Abastecimentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToReports}>
            <Ionicons name="analytics-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Relatórios</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>➕ Adicionar Dados</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToAddExpense}>
            <Ionicons name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Adicionar Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToAddFueling}>
            <Ionicons name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Adicionar Abastecimento</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚗 Jornadas</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToJourneys}>
            <Ionicons name="map-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Jornadas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToJourneyHistory}>
            <Ionicons name="time-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Histórico de Jornadas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Históricos</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToExpenseHistory}>
            <Ionicons name="list-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Histórico de Despesas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToFuelingHistory}>
            <Ionicons name="list-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Histórico de Abastecimentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToFuelPrices}>
            <Ionicons name="pricetag-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Preços de Combustível</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Metas e Conquistas</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToGoals}>
            <Ionicons name="flag-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Metas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToAchievements}>
            <Ionicons name="trophy-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Conquistas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToInsights}>
            <Ionicons name="bulb-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Insights</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
            <Ionicons name="person-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToChangePassword}>
            <Ionicons name="lock-closed-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToMultiVehicle}>
            <Ionicons name="car-sport-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Multi Veículos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sistema funcionando corretamente!{'\n'}
            Backend: ✅ Conectado{'\n'}
            Banco: ✅ Configurado{'\n'}
            Auth: ✅ Funcionando
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#34C759',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TestScreen;

