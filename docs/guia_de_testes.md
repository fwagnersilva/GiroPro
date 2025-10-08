# Guia de Testes do Projeto GiroPro

## 1. Introdução

Este guia detalha a estrutura, as convenções e as melhores práticas para a escrita e manutenção de testes no projeto GiroPro. O objetivo é garantir a qualidade do código, prevenir regressões e facilitar o desenvolvimento contínuo.

## 2. Ferramentas de Teste

O projeto utiliza as seguintes ferramentas para testes:

*   **Jest:** Framework de teste JavaScript para testes unitários e de integração.
*   **React Native Testing Library:** Conjunto de utilitários para testar componentes React Native de forma a simular o comportamento do usuário.

## 3. Estrutura de Diretórios

Os arquivos de teste são organizados em subdiretórios `__tests__` adjacentes aos componentes ou módulos que estão sendo testados. Esta abordagem facilita a localização dos testes e a manutenção da estrutura do projeto.

**Exemplo:**

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── __tests__/
│   │       └── LoginForm.spec.tsx
│   ├── utils/
│   │   └── helpers.ts
│   │   └── __tests__/
│   │       └── helpers.spec.ts
```

## 4. Convenções de Nomenclatura

*   **Arquivos de Teste:** Devem seguir o padrão `[NomeDoComponente/Modulo].spec.tsx` para testes unitários e de integração. Para testes de utilitários ou funções, pode-se usar `[NomeDoArquivo].spec.ts`.
*   **Suítes de Teste:** Devem ser descritivas e refletir a funcionalidade que está sendo testada.
*   **Casos de Teste:** Devem ser claros e concisos, descrevendo o comportamento esperado de uma funcionalidade específica.

## 5. Configuração de Testes (`jest-setup.ts`)

O arquivo `frontend/jest-setup.ts` é responsável por configurar o ambiente de testes, incluindo a criação de mocks para bibliotecas externas. Isso é crucial para garantir que os testes possam ser executados de forma isolada e consistente, simulando o comportamento de dependências externas sem a necessidade de carregá-las completamente.

**Exemplo de Mocks:**

```typescript
import '@testing-library/react-native/extend-expect';

// Mocks para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

// Mocks para react-native-css-interop
jest.mock('react-native-css-interop', () => ({
  cssInterop: jest.fn((component: any, mapping: any) => component),
}));

// Mocks para @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  useNavigation: () => ({ navigate: jest.fn() }),
}));

// Mocks para @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  ...jest.requireActual('@gorhom/bottom-sheet'),
  BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
}));
```

## 6. Exemplo de Teste (LoginForm.spec.tsx)

Este exemplo demonstra como um teste unitário para o `LoginForm` pode ser estruturado, verificando a navegação para a tela de recuperação de senha.

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginForm from '../LoginForm'; // Ajuste o caminho conforme necessário

describe('LoginForm', () => {
  it('should navigate to PasswordRecovery screen when "Esqueceu sua senha?" is pressed', () => {
    const navigate = jest.fn();
    // Mock useNavigation hook
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({ navigate }),
    }));

    const { getByText } = render(<LoginForm />);
    fireEvent.press(getByText('Esqueceu sua senha?'));
    expect(navigate).toHaveBeenCalledWith('PasswordRecovery');
  });
});
```

## 7. Execução de Testes

Os testes podem ser executados via linha de comando utilizando o Jest. Certifique-se de que as dependências estejam instaladas e que o script de teste esteja configurado no `package.json`.

```bash
npm test
# ou
yarn test
```

## 8. Integração Contínua (CI/CD)

Recomenda-se integrar a execução dos testes no pipeline de CI/CD para garantir que todas as alterações de código passem pelos testes antes de serem mescladas ou implantadas. Isso ajuda a identificar regressões precocemente e a manter a qualidade do código.

## 9. Próximos Passos e Melhorias Futuras

*   **Cobertura de Testes:** Aumentar a cobertura de testes para outros módulos e funcionalidades críticas do sistema.
*   **Testes E2E:** Avaliar a implementação de testes end-to-end com ferramentas como Cypress ou Detox para cenários de usuário completos.
*   **Relatórios de Teste:** Configurar a geração de relatórios de cobertura de testes para monitorar o progresso e identificar áreas que necessitam de mais testes.
*   **Testes de Performance:** Implementar testes de performance para garantir que o aplicativo mantenha um bom desempenho sob carga.

