# Backlog Consolidado do Projeto GiroPro

# Tela de Login

## Épico: Melhorias na Tela de Login

### História de Usuário: Como usuário, quero poder fazer login de forma segura e eficiente para acessar o sistema.

#### Tarefas:

1.  **Implementar funcionalidade "Esqueceu sua senha?"**
    *   **Microtarefas:**
        *   Criar rota de API para solicitação de recuperação de senha (backend).
        *   Implementar lógica de envio de e-mail com token de recuperação (backend).
        *   Criar interface de usuário para solicitação de e-mail de recuperação (frontend).
        *   Criar interface de usuário para redefinição de senha com token (frontend).
        *   Integrar frontend com a API de recuperação de senha.
        *   Adicionar validações de formulário para e-mail e nova senha.
        *   Testar fluxo completo de recuperação de senha.

2.  **Melhorar feedback de erro no login**
    *   **Microtarefas:**
        *   Exibir mensagens de erro mais específicas para credenciais inválidas (ex: "Email ou senha incorretos").
        *   Limpar campos de senha após tentativa de login falha.
        *   Adicionar validação de formato de e-mail no frontend.

3.  **Adicionar opção "Lembrar-me" (Remember Me)**
    *   **Microtarefas:**
        *   Implementar armazenamento seguro de token de autenticação (ex: AsyncStorage, LocalStorage) no frontend.
        *   Configurar API para aceitar token de "Lembrar-me" para sessões estendidas.
        *   Testar persistência do login após fechar e reabrir o aplicativo/navegador.

4.  **Otimização de Performance da Tela de Login**
    *   **Microtarefas:**
        *   Analisar e otimizar o tempo de carregamento da tela.
        *   Reduzir o tamanho dos bundles JavaScript, se aplicável.
        *   Garantir que animações sejam suaves.

5.  **Refatorar código da tela de login (se necessário)**
    *   **Microtarefas:**
        *   Revisar a estrutura do código para melhor legibilidade e manutenção.
        *   Garantir que os componentes estejam seguindo os padrões de design do projeto.
        *   Remover código duplicado ou não utilizado.

6.  **Adicionar testes unitários e de integração para a tela de login**
    *   **Microtarefas:**
        *   Escrever testes unitários para os componentes da UI.
        *   Escrever testes de integração para o fluxo de login e autenticação.
        *   Configurar ambiente de CI/CD para rodar os testes automaticamente.

- Tarefa: P1 - Implementar APIs CRUD completas para Veículos
  - Quem: Backend
  - O que: Desenvolver endpoints CRUD completos para a entidade Veículos.
  - Porquê: Permitir o gerenciamento completo de veículos no backend.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P1 - Implementar APIs CRUD completas para Abastecimentos
  - Quem: Backend
  - O que: Desenvolver endpoints CRUD completos para a entidade Abastecimentos.
  - Porquê: Permitir o gerenciamento completo de abastecimentos no backend.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P1 - Implementar APIs CRUD completas para Despesas
  - Quem: Backend
  - O que: Desenvolver endpoints CRUD completos para a entidade Despesas.
  - Porquê: Permitir o gerenciamento completo de despesas no backend.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P1 - Desenvolver Tela de Jornadas
  - Quem: Frontend
  - O que: Criar um componente de tela para gerenciar as jornadas do usuário.
  - Porquê: Adicionar uma funcionalidade central de gestão de viagens.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P1 - Implementar APIs CRUD completas para Jornadas (Frontend - Integração)
  - Quem: Frontend
  - O que: Integrar a tela de Jornadas com as APIs CRUD do backend.
  - Porquê: Popular a tela com dados reais e permitir a interação do usuário.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P2 - Criar arquivo `.env.example`
  - Quem: Geral
  - O que: Criar um arquivo `.env.example` na raiz do projeto com todas as variáveis de ambiente necessárias.
  - Porquê: Facilitar a configuração do ambiente para novos desenvolvedores.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Atualizar `README.md` com instruções de setup e execução
  - Quem: Geral
  - O que: Revisar e atualizar o `README.md` principal com instruções claras e concisas para o setup e execução do projeto.
  - Porquê: Fornecer um guia rápido e preciso para iniciar o desenvolvimento.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Instalar `react-router-dom`
  - Quem: Frontend
  - O que: Executar `npm install react-router-dom` no diretório `frontend`.
  - Porquê: Habilitar a navegação declarativa na aplicação web.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Instalado `react-router-dom` e `react-native-web` para suportar roteamento web em um projeto React Native. Também foram instaladas as dependências do `react-navigation` para o roteamento mobile.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/package.json

- Tarefa: P2 - Criar componente `AppRouter`
  - Quem: Frontend
  - O que: Criar um novo arquivo `src/components/AppRouter.tsx` para encapsular a lógica de roteamento.
  - Porquê: Organizar as rotas e manter o `App.tsx` limpo.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Criado o componente `AppRouter.tsx` para gerenciar as rotas da aplicação web, incluindo rotas públicas e privadas.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/components/AppRouter.tsx

- Tarefa: P2 - Configurar `BrowserRouter`
  - Quem: Frontend
  - O que: Envolver o `AppContent` com `BrowserRouter` em `main.tsx` ou `App.tsx`.
  - Porquê: Habilitar o roteamento baseado em URL para a aplicação web.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O `App.tsx` foi modificado para renderizar o `AppRouter` (que contém o `BrowserRouter`) quando a plataforma for web, e o `AppNavigator` (do react-navigation) para plataformas móveis.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/App.tsx

- Tarefa: P2 - Definir rotas para Login e Dashboard
  - Quem: Frontend
  - O que: No `AppRouter.tsx`, definir rotas para `/login` (renderizando `LoginScreen`) e `/dashboard` (renderizando `Dashboard`).
  - Porquê: Permitir a navegação entre as telas principais.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: As rotas para `/login` e `/dashboard` foram definidas no `AppRouter.tsx`, com a rota `/dashboard` protegida por `PrivateRoutes`.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/components/AppRouter.tsx

- Tarefa: P2 - Implementar `PrivateRoutes`
  - Quem: Frontend
  - O que: Criar um componente `PrivateRoutes` que verifica a autenticação e redireciona para `/login` se o usuário não estiver autenticado.
  - Porquê: Proteger as rotas do dashboard e outras áreas restritas.
  - Complexidade: Média
  - Concluído: [x]
  - Como foi feita: O componente `PrivateRoutes` foi implementado no `AppRouter.tsx` para verificar a autenticação do usuário antes de renderizar a rota do dashboard. Se o usuário não estiver autenticado, ele é redirecionado para a tela de login.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/components/AppRouter.tsx

- Tarefa: P2 - Integrar `PrivateRoutes` ao `AppRouter`
  - Quem: Frontend
  - O que: Usar `PrivateRoutes` para envolver a rota do `/dashboard`.
  - Porquê: Aplicar a proteção de rota ao dashboard.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A rota do `/dashboard` no `AppRouter.tsx` foi envolvida pelo componente `PrivateRoutes` para garantir que apenas usuários autenticados possam acessá-la.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/components/AppRouter.tsx

- Tarefa: P2 - Redirecionar após Login/Registro
  - Quem: Frontend
  - O que: Após login/registro bem-sucedido, usar `useNavigate` do `react-router-dom` para redirecionar para `/dashboard` em vez de `window.location.reload()`.
  - Porquê: Melhorar a experiência do usuário com navegação suave.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: As telas de `LoginScreen.tsx` e `RegisterScreen.tsx` foram atualizadas para usar o hook `useNavigate` do `react-router-dom` para redirecionamento na plataforma web, e `navigation.navigate` para plataformas móveis.
  - Hash do Commit: e4a938d3b4769407e800683398850eaa45a51b5f
  - Arquivos modificados:
    - frontend/src/screens/LoginScreen.tsx
    - frontend/src/screens/RegisterScreen.tsx

- Tarefa: P3 - Criar componente `VehicleList`
  - Quem: Frontend
  - O que: Criar um novo componente `src/components/VehicleList.tsx` para exibir a lista de veículos.
  - Porquê: Modularizar a interface do usuário e preparar para a integração da API.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Adicionar rota para `VehicleList`
  - Quem: Frontend
  - O que: Adicionar uma rota `/dashboard/vehicles` no `AppRouter.tsx` que renderize o `VehicleList`.
  - Porquê: Permitir o acesso à tela de veículos através da navegação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Criar serviço de API para Veículos
  - Quem: Frontend
  - O que: Criar um arquivo `src/services/vehicleService.ts` com funções para chamar a API de veículos do backend (ex: `getVehicles()`).
  - Porquê: Centralizar a lógica de comunicação com a API de veículos.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Integrar `vehicleService` ao `VehicleList`
  - Quem: Frontend
  - O que: No componente `VehicleList`, usar `useEffect` para chamar `vehicleService.getVehicles()` e exibir os dados.
  - Porquê: Popular a lista de veículos com dados reais do backend.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Adicionar tratamento de erro visual para `VehicleList`
  - Quem: Frontend
  - O que: Exibir uma mensagem de erro amigável se a API de veículos falhar.
  - Porquê: Informar o usuário sobre problemas de carregamento de dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Adicionar estado de carregamento para `VehicleList`
  - Quem: Frontend
  - O que: Exibir um `LoadingSpinner` enquanto os veículos estão sendo carregados.
  - Porquê: Melhorar a experiência do usuário durante o carregamento de dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Criar componente `ToastNotification`
  - Quem: Frontend
  - O que: Desenvolver um componente reutilizável para exibir mensagens de toast (sucesso, erro, informação).
  - Porquê: Padronizar o feedback visual para o usuário em toda a aplicação.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Integrar `ToastNotification` ao `AuthContext`
  - Quem: Frontend
  - O que: Usar `ToastNotification` para exibir mensagens de erro do `signIn` e `handleRegister`.
  - Porquê: Fornecer feedback visual imediato para falhas de autenticação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Integrar `ToastNotification` ao `vehicleService`
  - Quem: Frontend
  - O que: Usar `ToastNotification` para exibir erros de API no `vehicleService`.
  - Porquê: Centralizar o tratamento de erros de API com feedback visual.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Criar componente `ImageOptimizer`
  - Quem: Frontend
  - O que: Desenvolver um componente que implemente lazy loading para imagens e, se possível, converta para WebP.
  - Porquê: Otimizar o carregamento de imagens e melhorar a performance geral.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Integrar `ImageOptimizer` aos componentes existentes
  - Quem: Frontend
  - O que: Substituir tags `<img>` por `ImageOptimizer` onde aplicável.
  - Porquê: Aplicar as otimizações de imagem em toda a aplicação.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P3 - Criar `manifest.json`
  - Quem: Frontend
  - O que: Criar o arquivo `manifest.json` na raiz do diretório `public` do frontend com metadados básicos do PWA.
  - Porquê: Permitir que o navegador reconheça a aplicação como um PWA e ofereça a instalação.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P3 - Configurar `Service Worker` básico
  - Quem: Frontend
  - O que: Criar um arquivo `src/service-worker.js` e registrá-lo em `main.tsx` para cachear assets estáticos.
  - Porquê: Habilitar o cache offline e melhorar a resiliência da aplicação.
  - Complexidade: Média
  - Concluído: [ ]


