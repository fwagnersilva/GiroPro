import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { InteractiveButton, InteractiveCard } from '../components/InteractiveComponents';
import { TrashIcon, PlusIcon, TargetIcon, MoneyIcon } from '../components/EnhancedIcons';
import FormInput from '../components/FormInput';
import { lightTheme } from '../theme/enhancedTokens';

const TestRefactoredComponents: React.FC = () => {
  const [testValue, setTestValue] = React.useState('');
  const theme = lightTheme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Teste dos Componentes Refatorados
        </Text>
      </View>

      {/* Teste dos Botões Interativos */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Botões Interativos
        </Text>
        
        <View style={styles.buttonRow}>
          <InteractiveButton variant="primary" size="sm">
            Primary
          </InteractiveButton>
          
          <InteractiveButton variant="secondary" size="sm">
            Secondary
          </InteractiveButton>
          
          <InteractiveButton variant="outline" size="sm">
            Outline
          </InteractiveButton>
        </View>

        <View style={styles.buttonRow}>
          <InteractiveButton variant="ghost" size="sm">
            Ghost
          </InteractiveButton>
          
          <InteractiveButton variant="destructive" size="sm">
            Destructive
          </InteractiveButton>
        </View>
      </InteractiveCard>

      {/* Teste dos Ícones */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Ícones Melhorados
        </Text>
        
        <View style={styles.iconRow}>
          <TargetIcon size={32} />
          <MoneyIcon size={32} />
          <PlusIcon size={32} />
          <TrashIcon size={32} />
        </View>
      </InteractiveCard>

      {/* Teste do FormInput */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          FormInput Melhorado
        </Text>
        
        <FormInput
          label="Campo de Teste"
          required
          value={testValue}
          onChangeText={setTestValue}
          placeholder="Digite algo aqui..."
          leftIcon="text-outline"
        />
      </InteractiveCard>

      {/* Teste das Cores do Tema */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Paleta de Cores
        </Text>
        
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.success }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.warning }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.error }]} />
        </View>
      </InteractiveCard>

      {/* Teste da Tipografia */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Sistema de Tipografia
        </Text>
        
        <Text style={[{ 
          fontSize: theme.typography.fontSize['4xl'],
          color: theme.colors.textPrimary 
        }]}>
          Título Grande
        </Text>
        
        <Text style={[{ 
          fontSize: theme.typography.fontSize.xl,
          color: theme.colors.textSecondary 
        }]}>
          Subtítulo
        </Text>
        
        <Text style={[{ 
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.textTertiary 
        }]}>
          Texto normal do corpo
        </Text>
      </InteractiveCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: lightTheme.spacing[4],
  },
  section: {
    marginBottom: lightTheme.spacing[6],
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize['2xl'],
    fontWeight: '700' as any,
    textAlign: 'center',
  },
  card: {
    marginBottom: lightTheme.spacing[4],
    padding: lightTheme.spacing[4],
  },
  cardTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: '600' as any,
    marginBottom: lightTheme.spacing[4],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: lightTheme.spacing[2],
    marginBottom: lightTheme.spacing[2],
    flexWrap: 'wrap',
  },
  iconRow: {
    flexDirection: 'row',
    gap: lightTheme.spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: lightTheme.spacing[2],
    justifyContent: 'center',
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: lightTheme.borderRadius.md,
  },
});

export default TestRefactoredComponents;

