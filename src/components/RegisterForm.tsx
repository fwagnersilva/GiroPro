import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BRAZILIAN_CITIES } from '../data/cities';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string, confirmPassword: string, dateOfBirth: string, city: string) => Promise<void>;
  onBackToLogin: () => void;
  loading?: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onBackToLogin,
  loading = false,
  error = null,
}) => {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [city, setCity] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validar nome
    if (!nome.trim()) {
      errors.push('Nome é obrigatório');
    } else if (nome.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar email
    if (!email.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email inválido');
    }

    // Validar data de nascimento
    if (!dateOfBirth.trim()) {
      errors.push('Data de nascimento é obrigatória');
    } else {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime())) {
        errors.push('Data de nascimento inválida');
      } else if (age < 18) {
        errors.push('Você deve ter pelo menos 18 anos');
      } else if (age > 120) {
        errors.push('Data de nascimento inválida');
      }
    }

    // Validar cidade
    if (!city.trim()) {
      errors.push('Cidade é obrigatória');
    }

    // Validar senha
    if (!senha) {
      errors.push('Senha é obrigatória');
    } else if (senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    // Validar confirmação de senha
    if (senha !== confirmarSenha) {
      errors.push('As senhas não coincidem');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    await onRegister(nome.trim(), email.trim().toLowerCase(), senha, confirmarSenha, dateOfBirth, city);
  };

  const isFormValid = nome.trim() && email.trim() && senha && confirmarSenha && dateOfBirth.trim() && city.trim();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo e Título */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>GP</Text>
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para criar sua conta no GiroPro
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Campo Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Campo Data de Nascimento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dateOfBirth}
              onChangeText={(text) => {
                // Formatação automática da data
                let formatted = text.replace(/\D/g, '');
                if (formatted.length >= 2) {
                  formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
                }
                if (formatted.length >= 5) {
                  formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
                }
                setDateOfBirth(formatted);
              }}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Campo Cidade */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cidade *</Text>
            {Platform.OS === 'web' ? (
              <View style={styles.selectContainer}>
                <select
                  style={styles.webSelect}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Selecione sua cidade</option>
                  {BRAZILIAN_CITIES.map((cityOption) => (
                    <option key={cityOption.displayName} value={cityOption.displayName}>
                      {cityOption.displayName}
                    </option>
                  ))}
                </select>
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={city}
                  onValueChange={(itemValue) => setCity(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione sua cidade" value="" />
                  {BRAZILIAN_CITIES.map((cityOption) => (
                    <Picker.Item
                      key={cityOption.displayName}
                      label={cityOption.displayName}
                      value={cityOption.displayName}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Digite sua senha novamente"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mensagens de Erro de Validação */}
          {validationErrors.length > 0 && (
            <View style={styles.errorContainer}>
              {validationErrors.map((err, index) => (
                <Text key={index} style={styles.errorText}>
                  • {err}
                </Text>
              ))}
            </View>
          )}

          {/* Mensagem de Erro do Servidor */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Informações de Segurança */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Requisitos da senha:</Text>
            <Text style={styles.infoText}>• Mínimo de 6 caracteres</Text>
            <Text style={styles.infoText}>
              • Recomendado: use letras, números e símbolos
            </Text>
          </View>

          {/* Botão de Cadastro */}
          <TouchableOpacity
            style={[styles.button, (loading || !isFormValid) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Link para Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.backToLogin}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © 2024 GiroPro. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#2563eb',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 80,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  showPasswordText: {
    color: '#6b7280',
    fontSize: 12,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 4,
  },
  infoContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#3b82f6',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  backToLogin: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  copyright: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  copyrightText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  webSelect: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
});

export default RegisterForm;
