import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Text } from './ui/text';
import { ThemeToggle } from './ui/theme-toggle';

/**
 * Componente de demonstração das novas cores e funcionalidades de tema
 * Este componente mostra como os diferentes elementos da UI se comportam
 * nos modos claro e escuro
 */
export const ThemeDemo: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <ScrollView className="flex-1 bg-theme-background">
      <View className="p-6 space-y-6">
        {/* Header */}
        <View className="items-center space-y-2">
          <Text className="text-2xl font-bold text-theme-primary">
            GiroPro Design System
          </Text>
          <Text variant="secondary" className="text-center">
            Demonstração das novas paletas de cores e modo claro/escuro
          </Text>
        </View>

        {/* Theme Toggle Section */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Controle de Tema
          </Text>
          
          <View className="space-y-4">
            <View>
              <Text variant="secondary" className="mb-2">Botão Simples:</Text>
              <ThemeToggle variant="button" showLabel />
            </View>
            
            <View>
              <Text variant="secondary" className="mb-2">Switch de Opções:</Text>
              <ThemeToggle variant="switch" showLabel />
            </View>
            
            <View>
              <Text variant="secondary" className="mb-2">Lista de Opções:</Text>
              <ThemeToggle variant="dropdown" />
            </View>
          </View>
        </View>

        {/* Buttons Section */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Botões
          </Text>
          
          <View className="space-y-3">
            <Button label="Botão Primário" variant="default" />
            <Button label="Botão Secundário" variant="secondary" />
            <Button label="Botão com Borda" variant="outline" />
            <Button label="Botão de Sucesso" variant="success" />
            <Button label="Botão de Aviso" variant="warning" />
            <Button label="Botão de Erro" variant="destructive" />
            <Button label="Botão Fantasma" variant="ghost" />
            <Button label="Botão Link" variant="link" />
            <Button label="Botão Desabilitado" variant="default" disabled />
            <Button label="Carregando..." variant="default" loading />
          </View>
        </View>

        {/* Text Variants Section */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Variações de Texto
          </Text>
          
          <View className="space-y-2">
            <Text variant="primary" className="text-xl">
              Texto Primário (Título)
            </Text>
            <Text variant="secondary">
              Texto Secundário (Subtítulo ou descrição)
            </Text>
            <Text variant="disabled">
              Texto Desabilitado (Informações menos importantes)
            </Text>
            <Text variant="success">
              Texto de Sucesso (Confirmações)
            </Text>
            <Text variant="warning">
              Texto de Aviso (Alertas)
            </Text>
            <Text variant="error">
              Texto de Erro (Mensagens de erro)
            </Text>
          </View>
        </View>

        {/* Input Section */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Campos de Entrada
          </Text>
          
          <View className="space-y-4">
            <Input
              label="Campo Normal"
              placeholder="Digite algo aqui..."
              value={inputValue}
              onChangeText={setInputValue}
            />
            
            <Input
              label="Campo com Foco"
              placeholder="Este campo está focado"
              autoFocus
            />
            
            <Input
              label="Campo com Erro"
              placeholder="Campo inválido"
              error="Este campo é obrigatório"
            />
            
            <Input
              label="Campo Desabilitado"
              placeholder="Campo desabilitado"
              disabled
              value="Valor fixo"
            />
          </View>
        </View>

        {/* Color Palette Preview */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Paleta de Cores
          </Text>
          
          <View className="space-y-4">
            {/* Primary Colors */}
            <View>
              <Text variant="secondary" className="mb-2">Cores Primárias:</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="w-12 h-12 bg-primary-500 dark:bg-primary-dark-500 rounded" />
                <View className="w-12 h-12 bg-primary-400 dark:bg-primary-dark-400 rounded" />
                <View className="w-12 h-12 bg-primary-300 dark:bg-primary-dark-300 rounded" />
                <View className="w-12 h-12 bg-primary-200 dark:bg-primary-dark-200 rounded" />
              </View>
            </View>
            
            {/* Secondary Colors */}
            <View>
              <Text variant="secondary" className="mb-2">Cores Secundárias:</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="w-12 h-12 bg-secondary-500 dark:bg-secondary-dark-500 rounded" />
                <View className="w-12 h-12 bg-secondary-400 dark:bg-secondary-dark-400 rounded" />
                <View className="w-12 h-12 bg-secondary-300 dark:bg-secondary-dark-300 rounded" />
                <View className="w-12 h-12 bg-secondary-200 dark:bg-secondary-dark-200 rounded" />
              </View>
            </View>
            
            {/* Feedback Colors */}
            <View>
              <Text variant="secondary" className="mb-2">Cores de Feedback:</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="w-12 h-12 bg-success-500 dark:bg-success-dark-500 rounded" />
                <View className="w-12 h-12 bg-warning-500 dark:bg-warning-dark-500 rounded" />
                <View className="w-12 h-12 bg-error-500 dark:bg-error-dark-500 rounded" />
              </View>
            </View>
          </View>
        </View>

        {/* Surface Examples */}
        <View className="bg-theme-surface p-4 rounded-lg border border-theme">
          <Text className="text-lg font-semibold mb-4 text-theme-primary">
            Superfícies e Elevação
          </Text>
          
          <View className="space-y-4">
            <View className="bg-theme-background p-4 rounded border border-theme">
              <Text variant="secondary">Fundo Principal</Text>
            </View>
            
            <View className="bg-theme-surface p-4 rounded border border-theme">
              <Text variant="secondary">Superfície Primária</Text>
            </View>
            
            <View className="bg-theme-surface-secondary p-4 rounded border border-theme">
              <Text variant="secondary">Superfície Secundária</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text variant="secondary" className="text-sm text-center">
            Sistema de Design GiroPro v2.0{'\n'}
            Implementação de Modo Claro/Escuro
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
