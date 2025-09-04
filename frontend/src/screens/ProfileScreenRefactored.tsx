import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { InteractiveButton } from '../components/InteractiveComponents';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import { lightTheme } from '../theme/enhancedTokens';
import { SettingsIcon } from '../components/EnhancedIcons';

const ProfileScreenRefactored: React.FC = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const theme = lightTheme;

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!name.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e e-mail não podem ser vazios.');
      return;
    }

    if (name === user.nome && email === user.email) {
      Alert.alert('Nenhuma alteração', 'Nenhuma alteração foi detectada.');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, { nome: name, email: email });
      updateUser(updatedUser); // Atualiza o contexto de autenticação
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <InteractiveButton
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          ←
        </InteractiveButton>
        <View style={styles.titleContainer}>
          <SettingsIcon size={24} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Meu Perfil</Text>
        </View>
      </View>

      <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
        <FormInput
          label="Nome Completo"
          required
          value={name}
          onChangeText={setName}
          placeholder="Seu nome completo"
          autoCapitalize="words"
          leftIcon="person-outline"
          validation={validators.required}
        />

        <FormInput
          label="E-mail"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="seu.email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
          validation={combineValidators(validators.required, validators.email)}
        />

        <InteractiveButton
          variant="primary"
          size="lg"
          onPress={handleSaveProfile}
          disabled={loading}
          style={styles.saveButton}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.textOnPrimary} />
          ) : (
            'Salvar Alterações'
          )}
        </InteractiveButton>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
            Informações da Conta
          </Text>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              ID do Usuário:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
              {user?.id}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Data de Cadastro:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <InteractiveButton
            variant="outline"
            size="md"
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.actionButton}
          >
            Alterar Senha
          </InteractiveButton>

          <InteractiveButton
            variant="destructive"
            size="md"
            onPress={() => {
              Alert.alert(
                'Sair da Conta',
                'Tem certeza que deseja sair da sua conta?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Sair', 
                    style: 'destructive',
                    onPress: () => {
                      // Implementar logout
                      navigation.navigate('Login');
                    }
                  }
                ]
              );
            }}
            style={styles.actionButton}
          >
            Sair da Conta
          </InteractiveButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing[4],
    paddingTop: lightTheme.spacing[8],
  },
  backButton: {
    marginRight: lightTheme.spacing[3],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: lightTheme.typography.fontSize['2xl'],
    fontWeight: lightTheme.typography.fontWeight.bold,
    marginLeft: lightTheme.spacing[2],
  },
  formContainer: {
    margin: lightTheme.spacing[4],
    padding: lightTheme.spacing[6],
    borderRadius: lightTheme.borderRadius.lg,
    ...lightTheme.shadows.base,
  },
  saveButton: {
    marginTop: lightTheme.spacing[6],
    marginBottom: lightTheme.spacing[8],
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    paddingTop: lightTheme.spacing[6],
    marginBottom: lightTheme.spacing[6],
  },
  infoTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.semibold,
    marginBottom: lightTheme.spacing[4],
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing[2],
  },
  infoLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.normal,
  },
  actionsSection: {
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
    paddingTop: lightTheme.spacing[6],
  },
  actionButton: {
    marginBottom: lightTheme.spacing[3],
  },
});

export default ProfileScreenRefactored;

