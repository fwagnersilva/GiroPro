# Backlog do Projeto GiroPro

### Épico: Implementação e Melhoria do Fluxo de Login e Autenticação

#### História de Usuário: Como usuário, quero poder realizar login e registro de forma segura, com feedback claro e opções de recuperação de senha, para acessar as funcionalidades do sistema em qualquer plataforma.

#### Tarefas de Login e Autenticação (Prioridade Alta)

1.  **Configuração Inicial de Roteamento (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Instalação de `react-router-dom` e `react-native-web` para roteamento web, e dependências de `react-navigation` para mobile. Criação do componente `AppRouter` para encapsular a lógica de roteamento e configuração do `BrowserRouter` no `App.tsx` para web, e `AppNavigator` para mobile.

2.  **Definição de Rotas Principais (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Rotas para `/login` (renderizando `LoginScreen`) e `/dashboard` (renderizando `Dashboard`) foram definidas no `AppRouter.tsx`. A rota `/dashboard` foi protegida por `PrivateRoutes`.

3.  **Implementação de Rotas Privadas (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** O componente `PrivateRoutes` foi implementado para verificar a autenticação do usuário e redirecionar para `/login` caso não esteja autenticado. Integrado ao `AppRouter.tsx` para proteger o dashboard.

4.  **Redirecionamento Pós-Autenticação (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** As telas de `LoginScreen.tsx` e `RegisterScreen.tsx` foram atualizadas para usar `useNavigate` (web) ou `navigation.navigate` (mobile) para redirecionar para `/dashboard` após login/registro bem-sucedido.

5.  **Implementar funcionalidade "Esqueceu sua senha?" (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Funcionalidade completamente implementada com backend e frontend integrados.
    *   **Microtarefas:**
        *   ✅ Criar rota de API para solicitação de recuperação de senha (backend).
        *   ✅ Implementar lógica de envio de e-mail com token de recuperação (backend).
        *   ✅ Criar interface de usuário para solicitação de e-mail de recuperação (frontend).
        *   ✅ Criar interface de usuário para redefinição de senha com token (frontend).
        *   ✅ Integrar frontend com a API de recuperação de senha.
        *   ✅ Adicionar validações de formulário para e-mail e nova senha.
        *   ✅ Testar fluxo completo de recuperação de senha.

6.  **Melhorar feedback de erro no login (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Implementadas melhorias significativas no feedback de erro da tela de login.
    *   **Microtarefas:**
        *   ✅ Exibir mensagens de erro mais específicas para credenciais inválidas (ex: "Email ou senha incorretos").
        *   ✅ Limpar campos de senha após tentativa de login falha.
        *   ✅ Adicionar validação de formato de e-mail no frontend.
        *   ✅ Implementar validação em tempo real do email.
        *   ✅ Adicionar tratamento específico para diferentes tipos de erro (conta bloqueada, inativa, etc.).
        *   ✅ Melhorar UX com limpeza automática de campos e feedback visual.

7.  **Adicionar opção "Lembrar-me" (Remember Me) (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Funcionalidade Remember Me implementada com armazenamento seguro e interface amigável.
    *   **Microtarefas:**
        *   ✅ Implementar armazenamento seguro de email (AsyncStorage, LocalStorage) no frontend.
        *   ✅ Criar checkbox "Lembrar-me" na tela de login.
        *   ✅ Implementar auto-preenchimento do email na próxima visita.
        *   ✅ Criar utilitário RememberMeStorage para gerenciar dados salvos.
        *   ✅ Adicionar validação e tratamento de erros.
        *   ✅ Testar persistência do email após fechar e reabrir o aplicativo/navegador.

8.  **Otimização de Performance da Tela de Login (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Implementadas otimizações significativas de performance na LoginScreen.
    *   **Microtarefas:**
        *   ✅ Analisar e otimizar o tempo de carregamento da tela.
        *   ✅ Implementar hooks de performance (useCallback, useMemo, useDebounce).
        *   ✅ Otimizar validação de email com debounce de 300ms.
        *   ✅ Pré-compilar regex para melhor performance.
        *   ✅ Memoizar estilos dinâmicos para evitar recriação.
        *   ✅ Reduzir re-renders desnecessários com memoização adequada.
        *   ✅ Garantir que animações sejam suaves e responsivas.

9.  **Refatorar código da tela de login (se necessário) (Concluído)**
    *   **Status:** Concluído
    *   **Microtarefas:**
        *   Revisar a estrutura do código para melhor legibilidade e manutenção.
        *   Garantir que os componentes estejam seguindo os padrões de design do projeto.
        *   Remover código duplicado ou não utilizado.

10. **Adicionar testes unitários e de integração para a tela de login (Pendente)**
    *   **Status:** Pendente
    *   **Microtarefas:**
        *   Escrever testes unitários para os componentes da UI.
        *   Escrever testes de integração para o fluxo de login e autenticação.
        *   Configurar ambiente de CI/CD para rodar os testes automaticamente.

### Épico: Correção e Implementação do Menu Lateral Multiplataforma

#### História de Usuário: Como usuário, quero ver e interagir com o menu lateral de navegação em todas as plataformas (Web, Android, iOS) para acessar as funcionalidades do sistema.

#### Tarefas do Sidebar (Prioridade Alta)

1.  **Investigar problema de renderização do Sidebar (Web) (Concluído)**
    *   **Status:** Concluído
    *   **Descobertas:** O `main.tsx` estava carregando `NewLoginScreen` em vez de `App.tsx`, ignorando o roteamento. Erros de compilação em `api.ts` e `ForgotPasswordScreen.tsx` também foram corrigidos.
    *   **Microtarefas Concluídas:** Corrigir `main.tsx` para carregar `App.tsx`, corrigir estrutura de `api.ts` e importação em `ForgotPasswordScreen.tsx`.

2.  **Criar o componente Sidebar.tsx (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um componente de menu lateral (sidebar) para navegação, fornecendo uma navegação intuitiva e consistente entre as telas.

3.  **Integrar o Sidebar no AppRouter.tsx e ajustar o layout (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Integrar o componente Sidebar no `AppRouter.tsx` e ajustar o layout para acomodá-lo, habilitando a navegação lateral em todas as telas protegidas.

4.  **Implementar solução para o Sidebar (Web) (Pendente)**
    *   **Status:** Pendente
    *   **Microtarefas:**
        *   Reavaliar a abordagem multiplataforma para o Sidebar (componente web específico vs. React Native Web).
        *   Ajustar o layout do `DashboardLayout` para acomodar o sidebar fixo e o conteúdo principal (Flexbox/Grid CSS, `marginLeft`/`paddingLeft`).
        *   Testar a navegação entre todas as telas do menu após a implementação.
        *   Garantir que o design do sidebar esteja conforme o exemplo fornecido.

## Outras Tarefas Pendentes (Prioridade Média/Baixa)

### Épico: Gerenciamento de Veículos

#### História de Usuário: Como usuário, quero poder visualizar, adicionar, editar e remover veículos para gerenciar minha frota.

#### Tarefas:

1.  **Criar componente `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um novo componente `src/components/VehicleList.tsx` para exibir a lista de veículos.

2.  **Adicionar rota para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Adicionar uma rota `/dashboard/vehicles` no `AppRouter.tsx` que renderize o `VehicleList`.

3.  **Criar serviço de API para Veículos (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um arquivo `src/services/vehicleService.ts` com funções para chamar a API de veículos do backend (ex: `getVehicles()`).

4.  **Integrar `vehicleService` ao `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** No componente `VehicleList`, usar `useEffect` para chamar `vehicleService.getVehicles()` e exibir os dados.

5.  **Adicionar tratamento de erro visual para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Exibir uma mensagem de erro amigável se a API de veículos falhar.

6.  **Adicionar estado de carregamento para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Exibir um `LoadingSpinner` enquanto os veículos estão sendo carregados.

### Épico: Notificações e Feedback ao Usuário

#### História de Usuário: Como usuário, quero receber feedback visual claro sobre as ações que realizo e os erros que ocorrem no sistema.

#### Tarefas:

1.  **Criar componente `ToastNotification` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um componente reutilizável para exibir mensagens de toast (sucesso, erro, informação).

2.  **Integrar `ToastNotification` ao `AuthContext` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Usar `ToastNotification` para exibir mensagens de erro do `signIn` e `handleRegister`.

3.  **Integrar `ToastNotification` ao `vehicleService` (Pendente)**
    *   **Status:** Pendente
    **Detalhes:** Usar `ToastNotification` para exibir erros de API no `vehicleService`.

### Épico: Otimização de Performance e PWA

#### História de Usuário: Como usuário, quero que o aplicativo seja rápido, responsivo e funcione offline para uma melhor experiência.

#### Tarefas:

1.  **Criar componente `ImageOptimizer` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um componente que implemente lazy loading para imagens e, se possível, converta para WebP.

2.  **Integrar `ImageOptimizer` aos componentes existentes (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Substituir tags `<img>` por `ImageOptimizer` onde aplicável.

3.  **Criar `manifest.json` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar o arquivo `manifest.json` na raiz do diretório `public` do frontend com metadados básicos do PWA.

4.  **Configurar `Service Worker` básico (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um arquivo `src/service-worker.js` e registrá-lo em `main.tsx` para cachear assets estáticos.






### Épico: Implementação da Funcionalidade de Login (Boilerplate)

#### História de Usuário: Como usuário, quero poder realizar login de forma segura e eficiente, com uma interface consistente em todas as plataformas, para acessar o sistema.

#### Tarefas de Login (Prioridade Alta)

1.  **Definir e Criar os Componentes de UI para a Tela de Login (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Criar uma interface de usuário moderna e responsiva para a tela de login.
    *   **Microtarefas:**
        *   Criar componentes de input customizados para email/usuário e senha (`src/components/Input.tsx`)
        *   Implementar botão de login com estados (normal, loading, disabled) (`src/components/Button.tsx`)
        *   Adicionar elementos visuais como logo, título e links auxiliares
        *   Criar layout responsivo que funcione em Web, Android e iOS
        *   Implementar validação visual dos campos (cores, ícones, mensagens)
        *   Adicionar opções como "Lembrar-me" e "Esqueci minha senha"
        *   Atualizar `app/login.tsx` com os novos componentes
    *   **Considerações Multiplataforma:** Usar NativeWind/TailwindCSS, garantir compatibilidade com react-native-web, testar em diferentes tamanhos de tela.

2.  **Implementar a Lógica de Estado e Validação para os Campos de Login (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Gerenciar o estado dos campos e implementar validações robustas.
    *   **Microtarefas:**
        *   Implementar gerenciamento de estado com React hooks (useState, useReducer)
        *   Criar validações para email/usuário (formato, obrigatoriedade) (`src/utils/validation.ts`)
        *   Implementar validação de senha (comprimento mínimo, caracteres especiais) (`src/utils/validation.ts`)
        *   Adicionar feedback visual em tempo real
        *   Gerenciar estados de loading e erro
        *   Implementar debounce para validações
        *   Criar hook `useLoginForm.ts` (`src/hooks/useLoginForm.ts`)
        *   Definir tipos de autenticação (`src/types/auth.ts`)
    *   **Validações a implementar:** Email: formato válido, não vazio; Senha: mínimo 8 caracteres, pelo menos 1 número; Feedback visual imediato; Prevenção de submit com dados inválidos.

3.  **Desenvolver a Lógica de Autenticação (Concluído)**
    *   **Status:** Concluído   **Objetivo:** Implementar o processo de autenticação (simulado ou real).
    *   **Microtarefas:**
        *   Criar serviço de autenticação (`src/services/authService.ts`)
        *   Implementar chamadas para API de login (ou mock)
        *   Gerenciar tokens de autenticação
        *   Implementar persistência de sessão (`src/utils/storage.ts`)
        *   Adicionar tratamento de erros de autenticação
        *   Criar contexto de autenticação global (`src/contexts/AuthContext.tsx`)
        *   Criar hook `useAuth.ts` (`src/hooks/useAuth.ts`)
    *   **Funcionalidades:** Login com credenciais; Armazenamento seguro de tokens; Verificação de sessão ativa; Logout automático por expiração; Tratamento de erros de rede.

4.  **Integrar a Funcionalidade de Login com o Roteamento (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Configurar navegação pós-login e proteção de rotas.
    *   **Microtarefas:**
        *   Criar rotas protegidas que requerem autenticação
        *   Implementar redirecionamento pós-login
        *   Configurar navegação condicional baseada no estado de auth
        *   Criar tela de dashboard/home pós-login (`app/(auth)/dashboard.tsx`)
        *   Implementar logout com redirecionamento
        *   Atualizar `app/_layout.tsx` com proteção de rotas
        *   Criar componente `ProtectedRoute.tsx` (`src/components/ProtectedRoute.tsx`)
        *   Atualizar `app/index.tsx` com lógica de redirecionamento
    *   **Roteamento:** `/login` - Tela de login; `/dashboard` - Tela principal (protegida); Redirecionamento automático baseado no estado de auth.

5.  **Testar a Funcionalidade de Login e Garantir a Experiência do Usuário (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Validar o funcionamento completo e a experiência do usuário.
    *   **Microtarefas:**
        *   Testar fluxo completo de login
        *   Verificar responsividade em diferentes dispositivos
        *   Testar cenários de erro (credenciais inválidas, rede offline)
        *   Validar persistência de sessão
        *   Testar performance e tempos de resposta
        *   Verificar acessibilidade
    *   **Cenários de Teste:** Login com credenciais válidas; Login com credenciais inválidas; Validação de campos em tempo real; Persistência de sessão após reload; Logout e redirecionamento; Comportamento offline.

6.  **Realizar Commit e Push das Alterações (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Versionar e compartilhar as implementações.
    *   **Microtarefas:**
        *   Organizar commits por funcionalidade
        *   Escrever mensagens de commit descritivas
        *   Atualizar documentação
        *   Realizar push para o repositório
        *   Criar pull request se necessário






### Épico: Configuração e Inicialização da Aplicação Web

#### História de Usuário: Como desenvolvedor, quero que a aplicação web inicie corretamente para poder testar e desenvolver funcionalidades.

#### Tarefas:

1.  **Investigar e Resolver `ConfigError: Cannot resolve entry file` (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** O campo `"main": "Main.tsx"` foi removido do `package.json`. Um arquivo `metro.config.js` foi criado na raiz do projeto com a configuração padrão do Expo Metro.

2.  **Corrigir Erro de MIME Type no Metro Bundler (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** O arquivo `metro.config.js` foi modificado para incluir as extensões de arquivo `sourceExts` e `assetExts`. A configuração do `app.json` foi atualizada para usar `"bundler": "metro"`.

3.  **Verificar e Atualizar Dependências Problemáticas (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** O pacote `@expo/webpack-config` foi removido. `tailwindcss` foi atualizado para `^3.4.0`. `nativewind` foi revertido para `^4.0.0` e `react` e `react-dom` foram fixados em `18.2.0` para compatibilidade.

4.  **Testar a aplicação após as correções e atualizações (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** A aplicação web foi iniciada com sucesso e carregou sem erros de `ConfigError` ou `MIME Type`.


### Épico: Implementação do Sistema de Login Completo

#### História de Usuário: Como usuário, quero poder realizar login de forma segura e eficiente, com uma interface consistente em todas as plataformas, para acessar o sistema.

#### Novas Tarefas de Login (Prioridade Alta)

1.  **Implementar a Integração com a API de Autenticação Real (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Substituir a lógica de autenticação simulada por chamadas reais à API de backend para login e registro.
    *   **Microtarefas:**
        *   Configurar variáveis de ambiente para a URL da API.
        *   Atualizar `authService.ts` para fazer requisições HTTP (e.g., com `axios` ou `fetch`).
        *   Tratar respostas da API (sucesso, erro, códigos de status).
        *   Implementar lógica de refresh token, se aplicável.

2.  **Gerenciar Sessão e Armazenamento de Tokens (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Implementar o armazenamento seguro de tokens de autenticação (JWT, etc.) e gerenciar o ciclo de vida da sessão do usuário.
    *   **Microtarefas:**
        *   Utilizar `AsyncStorage` para React Native e `localStorage` para Web para armazenar tokens.
        *   Criptografar tokens sensíveis, se necessário.
        *   Implementar verificação de expiração de token e renovação automática.
        *   Criar um mecanismo para limpar a sessão do usuário no logout.

3.  **Melhorias de UI/UX na Tela de Login (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Refinar a interface e a experiência do usuário na tela de login, incluindo animações, feedback visual e acessibilidade.
    *   **Microtarefas:**
        *   Adicionar animações sutis para transições de estado (loading, erro).
        *   Melhorar o feedback visual para validação de campos em tempo real.
        *   Garantir que a tela seja totalmente acessível (leitura de tela, navegação por teclado).
        *   Implementar um indicador de progresso global durante chamadas de API.

4.  **Implementar Fluxo de Registro de Usuário (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar a tela e a lógica para o registro de novos usuários, integrando com a API de backend.
    *   **Microtarefas:**
        *   Criar componente `RegisterScreen.tsx`.
        *   Implementar formulário de registro com validações (nome, email, senha, confirmação de senha).
        *   Integrar com a API de registro de usuário.
        *   Tratar feedback de sucesso e erro do registro.

5.  **Configurar Testes E2E para o Fluxo de Login (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Configurar e escrever testes end-to-end para o fluxo completo de login e registro, garantindo a funcionalidade em todas as plataformas.
    *   **Microtarefas:**
        *   Escolher uma ferramenta de testes E2E (e.g., Detox para mobile, Cypress/Playwright para web).
        *   Escrever cenários de teste para login bem-sucedido, login falho, recuperação de senha e registro.
        *   Integrar os testes no pipeline de CI/CD.



### Épico: Correção e Implementação do Menu Lateral Multiplataforma

#### História de Usuário: Como usuário, quero ver e interagir com o menu lateral de navegação em todas as plataformas (Web, Android, iOS) para acessar as funcionalidades do sistema.

#### Tarefas do Sidebar (Prioridade Alta)

1.  **Criar o componente Sidebar.tsx (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um componente de menu lateral (sidebar) para navegação, fornecendo uma navegação intuitiva e consistente entre as telas.

2.  **Integrar o Sidebar no AppRouter.tsx e ajustar o layout (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Integrar o componente Sidebar no `AppRouter.tsx` e ajustar o layout para acomodá-lo, habilitando a navegação lateral em todas as telas protegidas.

3.  **Implementar solução para o Sidebar (Web) (Pendente)**
    *   **Status:** Pendente
    *   **Microtarefas:**
        *   Reavaliar a abordagem multiplataforma para o Sidebar (componente web específico vs. React Native Web).
        *   Ajustar o layout do `DashboardLayout` para acomodar o sidebar fixo e o conteúdo principal (Flexbox/Grid CSS, `marginLeft`/`paddingLeft`).
        *   Testar a navegação entre todas as telas do menu após a implementação.
        *   Garantir que o design do sidebar esteja conforme o exemplo fornecido.

## Outras Tarefas Pendentes (Prioridade Média/Baixa)

### Épico: Gerenciamento de Veículos

#### História de Usuário: Como usuário, quero poder visualizar, adicionar, editar e remover veículos para gerenciar minha frota.

#### Tarefas:

1.  **Criar componente `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um novo componente `src/components/VehicleList.tsx` para exibir a lista de veículos.

2.  **Adicionar rota para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Adicionar uma rota `/dashboard/vehicles` no `AppRouter.tsx` que renderize o `VehicleList`.

3.  **Criar serviço de API para Veículos (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um arquivo `src/services/vehicleService.ts` com funções para chamar a API de veículos do backend (ex: `getVehicles()`).

4.  **Integrar `vehicleService` ao `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** No componente `VehicleList`, usar `useEffect` para chamar `vehicleService.getVehicles()` e exibir os dados.

5.  **Adicionar tratamento de erro visual para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Exibir uma mensagem de erro amigável se a API de veículos falhar.

6.  **Adicionar estado de carregamento para `VehicleList` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Exibir um `LoadingSpinner` enquanto os veículos estão sendo carregados.

### Épico: Notificações e Feedback ao Usuário

#### História de Usuário: Como usuário, quero receber feedback visual claro sobre as ações que realizo e os erros que ocorrem no sistema.

#### Tarefas:

1.  **Criar componente `ToastNotification` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um componente reutilizável para exibir mensagens de toast (sucesso, erro, informação).

2.  **Integrar `ToastNotification` ao `AuthContext` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Usar `ToastNotification` para exibir mensagens de erro do `signIn` e `handleRegister`.

3.  **Integrar `ToastNotification` ao `vehicleService` (Pendente)**
    *   **Status:** Pendente
    **Detalhes:** Usar `ToastNotification` para exibir erros de API no `vehicleService`.

### Épico: Otimização de Performance e PWA

#### História de Usuário: Como usuário, quero que o aplicativo seja rápido, responsivo e funcione offline para uma melhor experiência.

#### Tarefas:

1.  **Criar componente `ImageOptimizer` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um componente que implemente lazy loading para imagens e, se possível, converta para WebP.

2.  **Integrar `ImageOptimizer` aos componentes existentes (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Substituir tags `<img>` por `ImageOptimizer` onde aplicável.

3.  **Criar `manifest.json` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar o arquivo `manifest.json` na raiz do diretório `public` do frontend com metadados básicos do PWA.

4.  **Configurar `Service Worker` básico (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar um arquivo `src/service-worker.js` e registrá-lo em `main.tsx` para cachear assets estáticos.


### Épico: Melhorias em Testes e Scripts de Dados

#### História de Usuário: Como desenvolvedor, quero ter scripts de seed robustos e testes de integração que validem a lógica de negócio com dados realistas, para garantir a qualidade e a consistência do sistema.

#### Tarefas de Testes e Scripts (Prioridade Média)

1.  **Criar Script de Seed para o Banco de Dados (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um script automatizado para popular o banco de dados com um conjunto de dados de teste realistas e abrangentes, cobrindo todas as entidades principais do sistema.
    *   **Microtarefas:**
        *   Criar um arquivo `backend/src/seeds/run-seed.ts` para orquestrar a população dos dados.
        *   Adicionar lógica para inserir dados em `usuarios`, `veiculos`, `jornadas`, `abastecimentos` e `despesas`.
        *   Garantir que os dados inseridos sejam diversificados (múltiplos veículos, diferentes plataformas, etc.).
        *   Criar um comando `npm run seed` no `package.json` do backend para facilitar a execução do script.
        *   Documentar o uso do script de seed no `README.md`.

2.  **Expandir Testes de Integração para Cálculos Financeiros (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Adicionar testes de integração que validem a precisão dos cálculos financeiros realizados pelo backend, como lucratividade, custo por KM e outras métricas do dashboard.
    *   **Microtarefas:**
        *   Criar um novo arquivo de teste `backend/src/tests/integration/financials.test.ts`.
        *   Escrever testes para verificar os cálculos de `lucro`, `receita`, `despesas`, `km rodados` e `R$/KM`.
        *   Utilizar os dados gerados pelo script de seed para garantir a consistência dos testes.
        *   Validar os resultados retornados pelo endpoint do dashboard (`/api/v1/dashboard/summary`).

3.  **Adicionar Testes para Cenários com Múltiplos Veículos (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Implementar testes que simulem o uso do sistema por um usuário com múltiplos veículos, garantindo que os filtros e cálculos por veículo funcionem corretamente.
    *   **Microtarefas:**
        *   Atualizar o script de seed para incluir cenários com múltiplos veículos para um único usuário.
        *   Escrever testes de integração que filtrem jornadas, despesas e abastecimentos por veículo.
        *   Validar a precisão do endpoint de comparativo de veículos (`/api/v1/dashboard/veiculos`).

4.  **Refatorar e Corrigir Scripts de Setup do Banco de Dados (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Revisar e corrigir os scripts de setup do banco de dados para resolver inconsistências de schema e garantir que o ambiente de desenvolvimento possa ser configurado de forma confiável.
    *   **Microtarefas:**
        *   Revisar os scripts `setup_db_manual.sh` e `setup_sqlite.sh`.
        *   Corrigir inconsistências de schema identificadas (e.g., `veiculoId` vs `idVeiculo`, uso de `unixepoch()`).
        *   Garantir que os scripts sejam idempotentes e possam ser executados múltiplas vezes sem causar erros.
        *   Testar os scripts de setup em um ambiente limpo para validar a correção.

5.  **Implementar Testes de Performance para Consultas do Dashboard (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Criar testes específicos para medir e validar a performance das consultas do dashboard, especialmente com grandes volumes de dados.
    *   **Microtarefas:**
        *   Criar um dataset de teste com volume significativo (1000+ jornadas, 100+ abastecimentos).
        *   Implementar testes que meçam o tempo de resposta dos endpoints do dashboard.
        *   Estabelecer benchmarks de performance aceitáveis (ex: < 500ms para consultas do dashboard).
        *   Identificar e documentar consultas que precisam de otimização.

6.  **Adicionar Validação de Integridade de Dados nos Testes (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Implementar testes que validem a integridade referencial e a consistência dos dados inseridos no banco.
    *   **Microtarefas:**
        *   Criar testes que validem as foreign keys entre `usuarios`, `veiculos`, `jornadas`, etc.
        *   Verificar se os cálculos de totais estão consistentes com os dados individuais.
        *   Implementar testes que detectem dados órfãos ou inconsistentes.
        *   Validar que as datas e timestamps estão em formatos corretos e consistentes.
