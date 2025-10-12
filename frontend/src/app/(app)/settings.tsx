import React, { useState } from 'react';
import { ScrollView, Alert, Switch, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import {
  colors,
  FocusAwareStatusBar,
  Text,
  View,
  Button,
} from '@/components/ui';
import { useAuth } from '@/lib';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  isToggle?: boolean;
  isDangerous?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  onValueChange,
  isToggle,
  isDangerous,
}) => {
  return (
    <View className={`flex-row items-center justify-between py-4 px-4 border-b border-gray-100 ${isDangerous ? 'bg-red-50' : 'bg-white'}`}>
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${isDangerous ? 'bg-red-100' : 'bg-blue-100'}`}>
          <Ionicons 
            name={icon as any} 
            size={22} 
            color={isDangerous ? '#DC2626' : '#0066CC'} 
          />
        </View>
        <View className="flex-1">
          <Text className={`font-semibold text-base ${isDangerous ? 'text-red-600' : 'text-gray-900'}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
      </View>

      {isToggle ? (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          thumbColor={value ? '#0066CC' : '#D1D5DB'}
          trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
        />
      ) : value ? (
        <Text className="text-gray-600 text-sm font-medium">{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      )}
    </View>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <View className="px-4 pt-6 pb-3">
    <Text className="text-sm font-bold text-gray-500 uppercase tracking-wide">
      {title}
    </Text>
  </View>
);

const SectionContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mx-4 mb-4">
    {children}
  </View>
);

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair do GiroPro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            signOut();
          }
        }
      ]
    );
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    });
  };

  const handleThemeToggle = (value: boolean) => {
    setDarkMode(value);
    toggleColorScheme();
  };

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView className="flex-1 bg-gradient-to-b from-blue-50 to-white" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">Configurações</Text>
          <Text className="text-gray-600 mt-1">Personalize sua experiência</Text>
        </View>

        {/* Perfil Section */}
        <SectionTitle title="Perfil" />
        <SectionContainer>
          <View className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center mr-3">
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900">fwagnersilva@gmail.com</Text>
                <Text className="text-sm text-gray-600 mt-1">Conta Ativa</Text>
              </View>
            </View>
          </View>
          <SettingItem
            icon="create"
            title="Editar Perfil"
            subtitle="Atualize seus dados"
            onPress={() => Alert.alert('Em Desenvolvimento', 'Edição de perfil em breve')}
          />
          <SettingItem
            icon="lock-closed"
            title="Alterar Senha"
            subtitle="Mude sua senha regularmente"
            onPress={() => Alert.alert('Em Desenvolvimento', 'Alteração de senha em breve')}
          />
        </SectionContainer>

        {/* App Settings */}
        <SectionTitle title="Aplicativo" />
        <SectionContainer>
          <SettingItem
            icon="moon"
            title="Modo Escuro"
            subtitle="Ativa o tema escuro"
            value={darkMode}
            onValueChange={handleThemeToggle}
            isToggle
          />
          <SettingItem
            icon="notifications"
            title="Notificações"
            subtitle="Receba atualizações"
            value={notifications}
            onValueChange={setNotifications}
            isToggle
          />
          <SettingItem
            icon="volume-high"
            title="Sons"
            subtitle="Habilita efeitos sonoros"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            isToggle
          />
        </SectionContainer>

        {/* About App */}
        <SectionTitle title="Sobre" />
        <SectionContainer>
          <SettingItem
            icon="information-circle"
            title="Versão"
            value="1.0.0"
          />
          <SettingItem
            icon="build"
            title="Build"
            value="001"
          />
          <SettingItem
            icon="calendar"
            title="Lançamento"
            value="Out 2025"
          />
        </SectionContainer>

        {/* Support */}
        <SectionTitle title="Suporte" />
        <SectionContainer>
          <SettingItem
            icon="help-circle"
            title="Centro de Ajuda"
            subtitle="Dúvidas frequentes e tutoriais"
            onPress={() => handleOpenLink('https://help.giropro.com')}
          />
          <SettingItem
            icon="bug"
            title="Reportar Problema"
            subtitle="Nos ajude a melhorar"
            onPress={() => Alert.alert('Reportar Problema', 'Descreva o problema encontrado')}
          />
          <SettingItem
            icon="star"
            title="Avaliar Aplicativo"
            subtitle="Deixe sua avaliação"
            onPress={() => handleOpenLink('https://play.google.com/store/apps/details?id=com.giropro')}
          />
          <SettingItem
            icon="share-social"
            title="Compartilhar"
            subtitle="Indique para amigos"
            onPress={() => Alert.alert('Compartilhar', 'Baixe o GiroPro no App Store ou Play Store')}
          />
        </SectionContainer>

        {/* Legal */}
        <SectionTitle title="Legal" />
        <SectionContainer>
          <SettingItem
            icon="document-text"
            title="Termos de Serviço"
            onPress={() => handleOpenLink('https://giropro.com/terms')}
          />
          <SettingItem
            icon="shield-checkmark"
            title="Política de Privacidade"
            onPress={() => handleOpenLink('https://giropro.com/privacy')}
          />
        </SectionContainer>

        {/* Social Links */}
        <SectionTitle title="Redes Sociais" />
        <SectionContainer>
          <SettingItem
            icon="logo-github"
            title="GitHub"
            onPress={() => handleOpenLink('https://github.com/giropro')}
          />
          <SettingItem
            icon="globe"
            title="Website"
            onPress={() => handleOpenLink('https://giropro.com')}
          />
        </SectionContainer>

        {/* Danger Zone */}
        <SectionTitle title="Segurança" />
        <SectionContainer>
          <SettingItem
            icon="trash"
            title="Limpar Cache"
            subtitle="Libera espaço do dispositivo"
            isDangerous={false}
            onPress={() => Alert.alert('Cache Limpo', 'O cache foi removido com sucesso')}
          />
          <SettingItem
            icon="warning"
            title="Logout"
            subtitle="Sair da sua conta"
            isDangerous={true}
            onPress={handleLogout}
          />
        </SectionContainer>

        {/* Footer */}
        <View className="items-center py-8 px-4">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-3">
            <Ionicons name="car" size={24} color="#0066CC" />
          </View>
          <Text className="text-sm text-gray-600 text-center">
            GiroPro v1.0.0
          </Text>
          <Text className="text-xs text-gray-400 text-center mt-2">
            © 2025 GiroPro. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}