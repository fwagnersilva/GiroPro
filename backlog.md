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

7.  **Adicionar opção "Lembrar-me" (Remember Me) (Pendente)**
    *   **Status:** Pendente
    *   **Microtarefas:**
        *   Implementar armazenamento seguro de token de autenticação (ex: AsyncStorage, LocalStorage) no frontend.
        *   Configurar API para aceitar token de "Lembrar-me" para sessões estendidas.
        *   Testar persistência do login após fechar e reabrir o aplicativo/navegador.

8.  **Otimização de Performance da Tela de Login (Pendente)**
    *   **Status:** Pendente
    *   **Microtarefas:**
        *   Analisar e otimizar o tempo de carregamento da tela.
        *   Reduzir o tamanho dos bundles JavaScript, se aplicável.
        *   Garantir que animações sejam suaves.

9.  **Refatorar código da tela de login (se necessário) (Pendente)**
    *   **Status:** Pendente
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
    *   **Detalhes:** Usar `ToastNotification` para exibir erros de API no `vehicleService`.

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



