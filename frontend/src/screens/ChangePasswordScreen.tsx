import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../services/api';

const ChangePasswordScreen: React.FC = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isCurrentPasswordFocused, setIsCurrentPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmNewPasswordFocused, setIsConfirmNewPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const length = newPassword.length >= 6;
    const uppercase = /[A-Z]/.test(newPassword);
    const lowercase = /[a-z]/.test(newPassword);
    const number = /[0-9]/.test(newPassword);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    setPasswordRequirements({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    });

    if (newPassword && newPassword.length < 6) {
      setNewPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
    } else if (newPassword && (!uppercase || !lowercase || !number || !specialChar)) {
      setNewPasswordError("A nova senha deve conter maiúscula, minúscula, número e caractere especial.");
    } else {
      setNewPasswordError("");
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("A nova senha e a confirmação não coincidem.");
    } else {
      setConfirmNewPasswordError("");
    }
  }, [newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");

    if (!currentPassword) {
      setCurrentPasswordError("A senha atual é obrigatória.");
      return;
    }

    if (!newPassword) {
      setNewPasswordError("A nova senha é obrigatória.");
      return;
    }

    if (!confirmNewPassword) {
      setConfirmNewPasswordError("A confirmação da nova senha é obrigatória.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (newPassword.length < 6 || !passwordRequirements.uppercase || !passwordRequirements.lowercase || !passwordRequirements.number || !passwordRequirements.specialChar) {
      setNewPasswordError("A nova senha não atende a todos os requisitos.");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });
      setLoading(false);
      Vibration.vibrate(50); // Feedback tátil de sucesso
      setSuccessMessage("Senha Alterada!");
      setTimeout(() => {
        setSuccessMessage("");
        navigation.goBack();
      }, 1500); // Volta após 1.5 segundos
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      Vibration.vibrate(100); // Feedback tátil de erro
      Alert.alert("Erro", error.message || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Alterar Senha</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Senha Atual</Text>
        <View style={[styles.inputContainer, isCurrentPasswordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Sua senha atual"
            onFocus={() => setIsCurrentPasswordFocused(true)}
            onBlur={() => setIsCurrentPasswordFocused(false)}
          secureTextEntry={!showCurrentPassword}
        />
        {currentPasswordError ? (
          <Text style={styles.errorText}>{currentPasswordError}</Text>
        ) : null}
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Ionicons
              name={showCurrentPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nova Senha</Text>
        <View style={[styles.inputContainer, isNewPasswordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Mínimo 6 caracteres"
            onFocus={() => setIsNewPasswordFocused(true)}
            onBlur={() => setIsNewPasswordFocused(false)}
          secureTextEntry={!showNewPassword}
        />
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null}
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementText}>
            <Ionicons
              name={passwordRequirements.length ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passwordRequirements.length ? 'green' : 'red'}
            />{' '}
            Mínimo de 6 caracteres
          </Text>
          <Text style={styles.requirementText}>
            <Ionicons
              name={passwordRequirements.uppercase ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passwordRequirements.uppercase ? 'green' : 'red'}
            />{' '}
            Pelo menos uma letra maiúscula
          </Text>
          <Text style={styles.requirementText}>
            <Ionicons
              name={passwordRequirements.lowercase ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passwordRequirements.lowercase ? 'green' : 'red'}
            />{' '}
            Pelo menos uma letra minúscula
          </Text>
          <Text style={styles.requirementText}>
            <Ionicons
              name={passwordRequirements.number ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passwordRequirements.number ? 'green' : 'red'}
            />{' '}
            Pelo menos um número
          </Text>
          <Text style={styles.requirementText}>
            <Ionicons
              name={passwordRequirements.specialChar ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={passwordRequirements.specialChar ? 'green' : 'red'}
            />{' '}
            Pelo menos um caractere especial
          </Text>
        </View>
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar Nova Senha</Text>
        <View style={[styles.inputContainer, isConfirmNewPasswordFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholder="Confirme sua nova senha"
            onFocus={() => setIsConfirmNewPasswordFocused(true)}
            onBlur={() => setIsConfirmNewPasswordFocused(false)}
          secureTextEntry={!showConfirmNewPassword}
        />
        {confirmNewPasswordError ? (
          <Text style={styles.errorText}>{confirmNewPasswordError}</Text>
        ) : null}
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
          >
            <Ionicons
              name={showConfirmNewPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (successMessage ? (
            <Text style={styles.saveButtonText}>{successMessage}</Text>
          ) : (
            <Text style={styles.saveButtonText}>Alterar Senha</Text>
          ))}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  inputContainerFocused: {
    borderColor: '#0056b3',
    shadowColor: '#0056b3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#0056b3', // Um azul um pouco mais escuro para o botão de salvar
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -15, // Ajuste para ficar mais próximo do input
  },
  requirementsContainer: {
    marginTop: -10,
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
});

export default ChangePasswordScreen;
