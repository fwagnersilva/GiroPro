import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import FormInput from '../components/FormInput';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

const ProfileScreenOptimized: React.FC = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    if (!name.trim() || !email.trim()) {
      if (isWeb()) {
        alert('Nome e e-mail não podem ser vazios.');
      } else {
        Alert.alert('Erro', 'Nome e e-mail não podem ser vazios.');
      }
      return;
    }

    if (name === user.nome && email === user.email) {
      if (isWeb()) {
        alert('Nenhuma alteração foi detectada.');
      } else {
        Alert.alert('Nenhuma alteração', 'Nenhuma alteração foi detectada.');
      }
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, { nome: name, email: email });
      updateUser(updatedUser); // Atualiza o contexto de autenticação
      if (isWeb()) {
        alert('Perfil atualizado com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const message = error.message || 'Não foi possível atualizar o perfil.';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }, [user, name, email, updateUser]);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      paddingTop: getSafePadding().paddingTop + spacing.md,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    backButton: {
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    title: {
      ...typography.h2,
      color: '#333',
      flex: 1,
      textAlign: 'center',
      marginRight: spacing.lg, // Para compensar o backButton
    },
    formContainer: {
      backgroundColor: '#FFF',
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: components.card.borderRadius,
      ...components.card,
      ...platformStyles.web({
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    label: {
      ...typography.body,
      fontWeight: '600',
      color: '#333',
      marginBottom: spacing.xs,
    },
    input: {
      ...components.input,
      backgroundColor: '#F9F9F9',
      marginBottom: spacing.md,
      ...platformStyles.web({
        outline: 'none',
        ':focus': {
          borderColor: '#007AFF',
        },
      }),
    },
    saveButton: {
      backgroundColor: '#007AFF',
      padding: spacing.md,
      borderRadius: components.button.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    saveButtonText: {
      color: '#FFF',
      ...typography.buttonText,
    },
  }), [getSafePadding]);

  return (
    <ScrollView style={responsiveStyles.container} showsVerticalScrollIndicator={false}>
      <View style={responsiveStyles.header}>
        <TouchableOpacity
          style={responsiveStyles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={responsiveStyles.title}>Meu Perfil</Text>
      </View>

      <View style={responsiveStyles.formContainer}>
        <FormInput
          label="Nome Completo"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome completo"
          autoCapitalize="words"
          leftIcon="person-outline"
        />

        <FormInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu.email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />

        <TouchableOpacity
          style={responsiveStyles.saveButton}
          onPress={handleSaveProfile}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={responsiveStyles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreenOptimized;


