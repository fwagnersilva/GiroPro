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

## 9. Diretrizes Adicionais para Componentes de Qualidade

Para garantir que os novos componentes sigam as melhores práticas e se integrem perfeitamente ao projeto GiroPro, considere as seguintes diretrizes:

### 9.1. Padrões de Design e Design System

Ao criar um novo componente, é fundamental aderir ao sistema de design do GiroPro. Isso inclui:

*   **Design Tokens**: Utilize os tokens de design definidos para cores, tipografia, espaçamentos e tamanhos. Isso garante consistência visual e facilita a manutenção do tema da aplicação.
*   **Componentes Reutilizáveis Existentes**: Antes de criar um novo componente do zero, verifique se já existe um componente similar em `src/components/` que possa ser reutilizado ou estendido. Isso evita duplicação de código e promove a modularidade.
*   **Consistência Visual**: Mantenha a aparência e o comportamento do componente alinhados com o restante da interface do usuário do GiroPro.

### 9.2. Otimização de Performance

Componentes performáticos são essenciais para uma experiência de usuário fluida, especialmente em aplicações móveis. Considere:

*   **`React.memo`**: Utilize `React.memo` para componentes funcionais que não precisam ser renderizados novamente se suas props não mudarem. Isso evita re-renderizações desnecessárias.
*   **`useCallback` e `useMemo`**: Para funções e valores computados que são passados como props para componentes filhos, utilize `useCallback` e `useMemo` para memorizá-los. Isso previne que os componentes filhos sejam re-renderizados devido a referências de função ou objeto que mudam a cada renderização do pai.
*   **Animações Nativas**: Sempre que possível, utilize a `Animated API` do React Native com `useNativeDriver: true` para animações, delegando-as para a thread nativa e melhorando a fluidez.

### 9.3. Acessibilidade

Acessibilidade é um pilar fundamental no desenvolvimento do GiroPro. Certifique-se de que seu componente seja utilizável por todos os usuários, incluindo aqueles com deficiências:

*   **WCAG 2.1 AA**: Siga as diretrizes de acessibilidade do WCAG 2.1 AA para contraste de cores, tamanho de fonte e espaçamento.
*   **Touch Targets**: Garanta que os elementos interativos (botões, links) tenham um tamanho mínimo de 44x44 pixels para facilitar a interação em telas sensíveis ao toque.
*   **Labels Semânticos**: Utilize `accessibilityLabel` e `accessibilityHint` para fornecer descrições claras para leitores de tela. Para elementos de formulário, associe labels corretamente.
*   **Feedback Tátil**: Considere adicionar feedback tátil (haptic feedback) para interações importantes, como pressionar um botão ou confirmar uma ação.

### 9.4. Responsividade

O GiroPro deve funcionar bem em diversas plataformas (iOS, Android, Web) e tamanhos de tela. Projete seus componentes com a responsividade em mente:

*   **Flexbox e Grid System**: Utilize Flexbox e, se aplicável, um sistema de grid para criar layouts flexíveis que se adaptem a diferentes dimensões de tela.
*   **Breakpoints**: Se o design exigir mudanças significativas em diferentes tamanhos de tela, defina e utilize breakpoints para aplicar estilos específicos (ex: para mobile, tablet e desktop).
*   **Tipografia Escalável**: Evite tamanhos de fonte fixos. Utilize unidades relativas ou um sistema de tipografia escalável que se ajuste ao tamanho da tela.

### 9.5. Testes

Testes são cruciais para garantir a qualidade e a estabilidade do seu componente:

*   **Testes Unitários**: Escreva testes unitários abrangentes para cobrir a lógica interna do componente, suas props e estados. Utilize `@testing-library/react-native` para simular interações do usuário.
*   **Testes de Integração**: Se o componente interage com APIs ou outros serviços, considere escrever testes de integração para verificar a comunicação e o comportamento em conjunto.
*   **Testes de Snapshot**: Para componentes visuais, testes de snapshot podem ajudar a garantir que a UI não mude inesperadamente.

Ao incorporar estas diretrizes, você não apenas criará componentes funcionais, mas também contribuirá para a robustez, manutenibilidade e qualidade geral do projeto GiroPro.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

