import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PeriodFilter, { PeriodType } from '../../src/components/PeriodFilter';

const Dashboard = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    // Aqui você pode adicionar lógica para filtrar os dados com base no período selecionado
    console.log('Período selecionado:', period);
  };

  const handleCustomDatePress = () => {
    // Aqui você pode abrir um modal ou navegar para uma tela de seleção de datas personalizadas
    console.log('Abrir seletor de datas personalizado');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Bem-vindo, {user?.name || user?.email || 'Usuário'}!
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Filtro de Período */}
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          onCustomDatePress={handleCustomDatePress}
        />

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>🎉 Login realizado com sucesso!</Text>
          <Text style={styles.welcomeText}>
            Você está agora logado no sistema GiroPro. Esta é uma tela protegida que só pode ser acessada após autenticação.
          </Text>
        </View>

        {/* Cards de funcionalidades */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.cardBlue]}
            onPress={() => router.push('/vehicles' as any)}
          >
            <View style={[styles.cardIcon, styles.cardIconBlue]}>
              <Text style={styles.cardIconText}>🚗</Text>
            </View>
            <Text style={styles.cardTitle}>Jornadas</Text>
            <Text style={styles.cardDescription}>Registre suas viagens</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardGreen]}
            onPress={() => router.push('/abastecimentos' as any)}
          >
            <View style={[styles.cardIcon, styles.cardIconGreen]}>
              <Text style={styles.cardIconText}>⛽</Text>
            </View>
            <Text style={styles.cardTitle}>Abastecimentos</Text>
            <Text style={styles.cardDescription}>Controle combustível</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardPurple]}
            onPress={() => router.push('/despesas' as any)}
          >
            <View style={[styles.cardIcon, styles.cardIconPurple]}>
              <Text style={styles.cardIconText}>💰</Text>
            </View>
            <Text style={styles.cardTitle}>Despesas</Text>
            <Text style={styles.cardDescription}>Gerencie gastos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardOrange]}
            onPress={() => router.push('/vehicles' as any)}
          >
            <View style={[styles.cardIcon, styles.cardIconOrange]}>
              <Text style={styles.cardIconText}>🚙</Text>
            </View>
            <Text style={styles.cardTitle}>Veículos</Text>
            <Text style={styles.cardDescription}>Cadastre veículos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardTeal]}
            onPress={() => router.push('/cadastro-plataformas' as any)}
          >
            <View style={[styles.cardIcon, styles.cardIconTeal]}>
              <Text style={styles.cardIconText}>📱</Text>
            </View>
            <Text style={styles.cardTitle}>Plataformas</Text>
            <Text style={styles.cardDescription}>Gerencie apps</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas rápidas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Resumo do Mês</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Jornadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ 0,00</Text>
              <Text style={styles.statLabel}>Despesas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0 km</Text>
              <Text style={styles.statLabel}>Distância</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0 L</Text>
              <Text style={styles.statLabel}>Combustível</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardBlue: {
    backgroundColor: '#eff6ff',
  },
  cardGreen: {
    backgroundColor: '#f0fdf4',
  },
  cardPurple: {
    backgroundColor: '#faf5ff',
  },
  cardOrange: {
    backgroundColor: '#fff7ed',
  },
  cardTeal: {
    backgroundColor: '#f0fdfa',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardIconBlue: {
    backgroundColor: '#2563eb',
  },
  cardIconGreen: {
    backgroundColor: '#16a34a',
  },
  cardIconPurple: {
    backgroundColor: '#9333ea',
  },
  cardIconOrange: {
    backgroundColor: '#ea580c',
  },
  cardIconTeal: {
    backgroundColor: '#14b8a6',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default Dashboard;
