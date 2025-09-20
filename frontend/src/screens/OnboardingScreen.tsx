import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingWizard from '../components/OnboardingWizard';
import LoadingSpinner from '../components/LoadingSpinner';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding === 'true') {
        // Se já completou o onboarding, redirecionar para o dashboard
        navigation.replace('Dashboard');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Erro ao salvar status do onboarding:', error);
      navigation.replace('Dashboard');
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Erro ao salvar status do onboarding:', error);
      navigation.replace('Dashboard');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});

export default OnboardingScreen;

