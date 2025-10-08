# Estrutura de Testes do Projeto GiroPro

## 1. Visão Geral

O projeto GiroPro já possui uma estrutura de testes implementada, focada principalmente no frontend, conforme evidenciado pela presença de arquivos de teste e configurações relacionadas. A documentação existente (`docs/05_funcionalidades_implementadas.md`) corrobora a existência de testes unitários e de integração para a tela de login.

## 2. Localização dos Testes

Os testes de frontend estão localizados no diretório `frontend/src/components/` e são identificados pelo padrão `.spec.tsx`. Um exemplo encontrado é `frontend/src/components/login-form.spec.tsx`.

## 3. Configuração de Testes

A configuração do ambiente de testes é gerenciada pelo arquivo `frontend/jest-setup.ts`, que inclui mocks para bibliotecas como `@react-navigation/native`, `@gorhom/bottom-sheet` e `react-native-safe-area-context`, garantindo a execução dos testes em um ambiente multiplataforma.

## 4. Proposta de Organização e Melhorias

Para otimizar a manutenção e escalabilidade dos testes, sugere-se as seguintes práticas:

### 4.1. Padronização de Nomenclatura

Manter o padrão `*.spec.tsx` para testes unitários e de integração. Para testes end-to-end (E2E), pode-se adotar `*.e2e.tsx` ou `*.test.e2e.tsx`.

### 4.2. Estrutura de Diretórios

Recomenda-se organizar os arquivos de teste em subdiretórios `__tests__` adjacentes aos componentes ou módulos que estão sendo testados. Por exemplo:

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── __tests__/
│   │       └── LoginForm.spec.tsx
│   └── utils/
│       └── helpers.ts
│       └── __tests__/
│           └── helpers.spec.ts
```

Alternativamente, pode-se ter um diretório `tests/` na raiz do `frontend/` que espelha a estrutura de `src/`:

```
frontend/
├── src/
│   ├── components/
│   │   └── LoginForm.tsx
├── tests/
│   ├── components/
│   │   └── LoginForm.spec.tsx
```

### 4.3. Separação de Tipos de Testes

Considerar a criação de diretórios distintos para diferentes tipos de testes (unitários, integração, E2E) se o volume de testes for muito grande. Por exemplo:

```
frontend/
├── tests/
│   ├── unit/
│   │   └── components/
│   │       └── LoginForm.spec.tsx
│   ├── integration/
│   │   └── flows/
│   │       └── LoginFlow.spec.tsx
│   └── e2e/
│       └── cypress/
│           └── specs/
│               └── Login.e2e.ts
```

### 4.4. Documentação de Testes

Expandir a documentação em `docs/` para incluir um guia detalhado sobre como escrever, executar e manter os testes, abrangendo:

*   **Ferramentas:** Jest, React Native Testing Library, Cypress (se aplicável).
*   **Convenções:** Nomenclatura de arquivos, organização de mocks, padrões de escrita de testes.
*   **Fluxo de Trabalho:** Como integrar testes no pipeline de CI/CD.

## 5. Próximos Passos

1.  **Refatorar:** Mover os testes existentes para a estrutura de diretórios proposta.
2.  **Expandir:** Adicionar cobertura de testes para outros componentes e funcionalidades críticas.
3.  **Documentar:** Criar um guia completo de testes no diretório `docs/`.
