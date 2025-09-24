import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  ImageOptimizer,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  image?: any;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Bem-vindo ao GiroPro',
    description: 'Sua ferramenta completa para gestão financeira como motorista de aplicativo. Controle seus ganhos, despesas e maximize sua lucratividade.',
    icon: 'car-outline',
    color: '#4A90E2',
  },
  {
    id: 2,
    title: 'Registre suas Jornadas',
    description: 'Acompanhe todas as suas viagens, ganhos por corrida e tempo trabalhado. Tenha controle total sobre sua atividade diária.',
    icon: 'map-outline',
    color: '#7ED321',
  },
  {
    id: 3,
    title: 'Controle suas Despesas',
    description: 'Registre combustível, manutenção e outras despesas. Saiba exatamente quanto você está gastando e onde pode economizar.',
    icon: 'receipt-outline',
    color: '#F5A623',
  },
  {
    id: 4,
    title: 'Relatórios Inteligentes',
    description: 'Visualize seu desempenho com gráficos e relatórios detalhados. Tome decisões baseadas em dados reais.',
    icon: 'analytics-outline',
    color: '#BD10E0',
  },
];

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      {/* Header com botão Skip */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Indicadores de progresso */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index <= currentStep ? currentStepData.color : '#E0E0E0',
                transform: [{ scale: index === currentStep ? 1.2 : 1 }],
              },
            ]}
          />
        ))}
      </View>

      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Ícone */}
        <View style={[styles.iconContainer, { backgroundColor: currentStepData.color + '20' }]}>
          <Ionicons
            name={currentStepData.icon as any}
            size={80}
            color={currentStepData.color}
          />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: currentStepData.color }]}>
          {currentStepData.title}
        </Text>

        {/* Descrição */}
        <Text style={styles.description}>
          {currentStepData.description}
        </Text>
      </Animated.View>

      {/* Botões de navegação */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={prevStep}
          style={[
            styles.navButton,
            styles.prevButton,
            { opacity: currentStep === 0 ? 0.3 : 1 },
          ]}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
          <Text style={styles.prevButtonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextStep}
          style={[styles.navButton, styles.nextButton, { backgroundColor: currentStepData.color }]}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Texto de ajuda */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          Dica: Você pode pular o tutorial e explorá-lo mais tarde nas configurações
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  prevButton: {
    backgroundColor: 'transparent',
  },
  nextButton: {
    minWidth: 120,
    justifyContent: 'center',
  },
  prevButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginRight: 5,
  },
  helpContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default OnboardingWizard;

