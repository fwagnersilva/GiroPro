import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FormInput, { validators } from '../components/FormInput';
import { InteractiveCard } from '../components/InteractiveComponents';
import { lightTheme } from '../theme/enhancedTokens';
import { 
  validatePassword, 
  getPasswordStrength, 
  getPasswordStrengthText, 
  getPasswordStrengthColor 
} from '../utils/passwordValidation';

const PasswordValidationTest: React.FC = () => {
  const [password, setPassword] = useState('');
  const theme = lightTheme;

  const validationResult = validatePassword(password);
  const strength = getPasswordStrength(password);
  const strengthText = getPasswordStrengthText(password);
  const strengthColor = getPasswordStrengthColor(password);

  // Senhas de teste
  const testPasswords = [
    { label: 'Senha fraca', value: '123' },
    { label: 'Sem maiúscula', value: 'senha123!' },
    { label: 'Sem minúscula', value: 'SENHA123!' },
    { label: 'Sem número', value: 'SenhaForte!' },
    { label: 'Sem especial', value: 'SenhaForte123' },
    { label: 'Caractere inválido', value: 'SenhaForte123#' },
    { label: 'Senha válida', value: 'MinhaSenh@123' },
    { label: 'Senha forte', value: 'SuperSenh@Forte2024!' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Teste de Validação de Senha
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Validação baseada nos critérios do backend
        </Text>
      </View>

      {/* Campo de entrada */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Digite uma senha para testar
        </Text>
        
        <FormInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha..."
          secureTextEntry={false} // Mostrar senha para teste
          leftIcon="lock-closed-outline"
          validation={validators.password}
        />

        {/* Indicador de força */}
        {password.length > 0 && (
          <View style={styles.strengthContainer}>
            <Text style={[styles.strengthLabel, { color: theme.colors.textSecondary }]}>
              Força da senha:
            </Text>
            <View style={styles.strengthIndicator}>
              <Text style={[styles.strengthText, { color: strengthColor }]}>
                {strengthText} ({strength}/5)
              </Text>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBarSegment,
                      {
                        backgroundColor: level <= strength ? strengthColor : theme.colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </InteractiveCard>

      {/* Critérios de validação */}
      {password.length > 0 && (
        <InteractiveCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Critérios de Validação
          </Text>
          
          {validationResult.criteria.map((criterion, index) => (
            <View key={criterion.key} style={styles.criterionItem}>
              <Text style={[
                styles.criterionIcon,
                { color: criterion.valid ? theme.colors.success : theme.colors.error }
              ]}>
                {criterion.valid ? '✓' : '✗'}
              </Text>
              <Text style={[
                styles.criterionText,
                { color: criterion.valid ? theme.colors.success : theme.colors.textSecondary }
              ]}>
                {criterion.text}
              </Text>
            </View>
          ))}

          {/* Resultado final */}
          <View style={[
            styles.resultContainer,
            { backgroundColor: validationResult.isValid ? theme.colors.successLight : theme.colors.errorLight }
          ]}>
            <Text style={[
              styles.resultText,
              { color: validationResult.isValid ? theme.colors.success : theme.colors.error }
            ]}>
              {validationResult.isValid ? 'Senha válida!' : validationResult.message || 'Senha inválida'}
            </Text>
          </View>
        </InteractiveCard>
      )}

      {/* Senhas de teste */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Senhas de Teste
        </Text>
        
        {testPasswords.map((test, index) => {
          const testResult = validatePassword(test.value);
          const testStrength = getPasswordStrength(test.value);
          const testColor = getPasswordStrengthColor(test.value);
          
          return (
            <View key={index} style={styles.testItem}>
              <View style={styles.testHeader}>
                <Text style={[styles.testLabel, { color: theme.colors.textPrimary }]}>
                  {test.label}
                </Text>
                <Text style={[styles.testStrength, { color: testColor }]}>
                  {testStrength}/5
                </Text>
              </View>
              <Text style={[styles.testPassword, { color: theme.colors.textSecondary }]}>
                {test.value}
              </Text>
              <Text style={[
                styles.testResult,
                { color: testResult.isValid ? theme.colors.success : theme.colors.error }
              ]}>
                {testResult.isValid ? '✓ Válida' : `✗ ${testResult.message}`}
              </Text>
            </View>
          );
        })}
      </InteractiveCard>

      {/* Informações técnicas */}
      <InteractiveCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Informações Técnicas
        </Text>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            Regex do Backend:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            Caracteres Especiais Permitidos:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
            @$!%*?&
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            Comprimento Mínimo:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
            8 caracteres
          </Text>
        </View>
      </InteractiveCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: lightTheme.spacing[4],
  },
  header: {
    alignItems: 'center',
    marginBottom: lightTheme.spacing[6],
  },
  title: {
    fontSize: lightTheme.typography.fontSize['2xl'],
    fontWeight: '700' as any,
    marginBottom: lightTheme.spacing[2],
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.base,
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
  strengthContainer: {
    marginTop: lightTheme.spacing[4],
  },
  strengthLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    marginBottom: lightTheme.spacing[2],
  },
  strengthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
  },
  strengthBar: {
    flexDirection: 'row',
    gap: lightTheme.spacing[1],
  },
  strengthBarSegment: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  criterionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[2],
  },
  criterionIcon: {
    fontSize: lightTheme.typography.fontSize.base,
    marginRight: lightTheme.spacing[3],
    width: 20,
    textAlign: 'center',
  },
  criterionText: {
    fontSize: lightTheme.typography.fontSize.sm,
    flex: 1,
  },
  resultContainer: {
    padding: lightTheme.spacing[3],
    borderRadius: lightTheme.borderRadius.md,
    marginTop: lightTheme.spacing[4],
  },
  resultText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
    textAlign: 'center',
  },
  testItem: {
    marginBottom: lightTheme.spacing[4],
    paddingBottom: lightTheme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[1],
  },
  testLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
  },
  testStrength: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
  },
  testPassword: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: 'monospace',
    marginBottom: lightTheme.spacing[1],
  },
  testResult: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontWeight: '500' as any,
  },
  infoItem: {
    marginBottom: lightTheme.spacing[3],
  },
  infoLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
    marginBottom: lightTheme.spacing[1],
  },
  infoValue: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: 'monospace',
  },
});

export default PasswordValidationTest;

