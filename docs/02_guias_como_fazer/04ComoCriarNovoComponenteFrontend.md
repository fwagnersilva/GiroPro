# Como Criar um Novo Componente Frontend no GiroPro

Este guia fornece diretrizes para desenvolver componentes reutilizáveis no frontend do GiroPro, que é construído com React Native. Seguir estas práticas garante consistência, manutenibilidade e escalabilidade do código.

## 1. Entendendo a Estrutura do Frontend

O frontend do GiroPro é uma aplicação React Native, organizada para promover a reutilização e a separação de responsabilidades. As principais pastas de interesse para componentes são:

*   **`src/components/`**: Contém componentes genéricos e reutilizáveis que podem ser usados em diferentes telas (ex: botões, inputs, cards).
*   **`src/screens/`**: Contém os componentes que representam telas completas da aplicação (ex: `LoginScreen`, `DashboardScreen`).
*   **`src/assets/`**: Armazena imagens, ícones e outros recursos estáticos.
*   **`src/styles/`**: Define estilos globais, temas e utilitários de estilo.
*   **`src/utils/`**: Funções utilitárias e helpers.

## 2. Planejamento do Componente

Antes de começar a codificar, considere:

*   **Propósito**: Qual problema este componente resolve? Qual sua responsabilidade única?
*   **Reutilização**: Ele será usado em múltiplos lugares? Se sim, como torná-lo genérico o suficiente?
*   **Props**: Quais dados ele precisa receber para funcionar? Quais eventos ele precisa emitir?
*   **Estado**: Ele precisa gerenciar algum estado interno? Se sim, qual e como?
*   **Estilo**: Como ele se encaixa no design system existente? Ele precisa de estilos específicos ou pode usar estilos globais?

## 3. Criando o Arquivo do Componente

Crie uma nova pasta para o seu componente dentro de `src/components/` (ou `src/screens/` se for uma tela). Dentro dessa pasta, crie um arquivo TypeScript (`.tsx`) para o componente e um arquivo de estilos (`.ts` ou `.tsx` se usar `styled-components`).

Exemplo para um componente `CustomButton`:

```
src/
└── components/
    └── CustomButton/
        ├── index.tsx
        └── styles.ts
```

## 4. Implementando o Componente (`index.tsx`)

Use a sintaxe de função para criar componentes React. Defina as `Props` do componente usando interfaces TypeScript para garantir a tipagem forte.

```typescript
// src/components/CustomButton/index.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
```

## 5. Estilizando o Componente (`styles.ts`)

Utilize `StyleSheet.create` do React Native para definir os estilos. Isso otimiza o desempenho e facilita a leitura.

```typescript
// src/components/CustomButton/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});
```

## 6. Utilizando o Componente

Importe e utilize o componente em outras telas ou componentes:

```typescript
// src/screens/ExampleScreen.tsx
import React from 'react';
import { View, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';

const ExampleScreen: React.FC = () => {
  const handlePress = () => {
    Alert.alert('Botão Pressionado!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CustomButton title="Clique Aqui" onPress={handlePress} />
      <CustomButton title="Desabilitado" onPress={() => {}} disabled={true} />
    </View>
  );
};

export default ExampleScreen;
```

## 7. Testando o Componente

Escreva testes unitários para o seu componente para garantir que ele se comporte conforme o esperado em diferentes cenários. Utilize bibliotecas como `@testing-library/react-native`.

```typescript
// src/components/CustomButton/CustomButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from './index';

describe('CustomButton', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(<CustomButton title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Test Button" onPress={mockOnPress} />);
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Disabled Button" onPress={mockOnPress} disabled />);
    fireEvent.press(getByText('Disabled Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

## 8. Documentando o Componente

Para componentes mais complexos ou reutilizáveis, considere adicionar documentação inline (JSDoc) ou criar um arquivo `README.md` dentro da pasta do componente explicando seu uso, props e exemplos. Isso facilita a vida de outros desenvolvedores que forem utilizá-lo.

Seguindo estas diretrizes, você contribuirá para um frontend organizado, eficiente e fácil de manter no projeto GiroPro.

