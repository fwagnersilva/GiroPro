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

1.  **Investigar e Resolver `ConfigError: Cannot resolve entry file` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** O Metro Bundler está reportando `ConfigError: Cannot resolve entry file: The `main` field defined in your `package.json` points to an unresolvable or non-existent path.`, mesmo após a remoção do campo `main` e a criação de `Main.tsx`.
    *   **Microtarefas:**
        *   Verificar se o `package.json` está sendo lido corretamente após as alterações.
        *   Investigar se há algum cache persistente do Expo ou Metro que precisa ser limpo de forma mais agressiva.
        *   Garantir que o `Main.tsx` recém-criado está sendo reconhecido como ponto de entrada.
        *   Consultar a documentação mais recente do Expo Router e Metro Bundler para web sobre a configuração do ponto de entrada.

2.  **Corrigir Erro de MIME Type no Metro Bundler (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** O `AppEntry.bundle` está sendo servido com `application/json` em vez de `application/javascript`, impedindo a execução do script no navegador.
    *   **Microtarefas:**
        *   Investigar a configuração do Metro Bundler para garantir que ele sirva arquivos JavaScript com o MIME type correto.
        *   Verificar se há alguma configuração específica no `metro.config.js` ou `app.json` que possa estar causando isso.

3.  **Verificar e Atualizar Dependências Problemáticas (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Durante o `expo upgrade`, alguns pacotes não foram atualizados automaticamente. É necessário verificar a compatibilidade e atualizar manualmente se necessário.
    *   **Microtarefas:**
        *   Revisar a lista de pacotes não atualizados (`@expo/webpack-config`, `nativewind`, etc.).
        *   Consultar a documentação de cada pacote para verificar a compatibilidade com o Expo SDK 54 e React Native 0.81.
        *   Atualizar os pacotes para versões compatíveis, se houver.
        *   Testar a aplicação após cada atualização para identificar regressões.




### Épico: Resolução de Problemas de Inicialização da Aplicação Web

#### História de Usuário: Como desenvolvedor, quero que a aplicação web inicie corretamente para poder testar e desenvolver funcionalidades, superando os desafios de configuração e compatibilidade.

#### Tarefas:

1.  **Diagnosticar e Resolver `ConfigError: Cannot resolve entry file` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** O Metro Bundler continua reportando `ConfigError: Cannot resolve entry file: The `main` field defined in your `package.json` points to an unresolvable or non-existent path.`, mesmo após a remoção do campo `main` do `package.json` e a criação de um `Main.tsx` de fallback.
    *   **Microtarefas:**
        *   Verificar a ordem de leitura dos arquivos de configuração pelo Expo/Metro.
        *   Explorar opções de configuração do `metro.config.js` para forçar o ponto de entrada.
        *   Considerar a possibilidade de um `package.json` em cache ou um problema de resolução de módulos.
        *   Pesquisar por soluções específicas para Expo SDK 54 e Expo Router com Metro Bundler para este erro.

2.  **Corrigir Erro de MIME Type (`application/json`) para `AppEntry.bundle` (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** O `AppEntry.bundle` está sendo servido com `application/json` em vez de `application/javascript`, impedindo a execução do script no navegador.
    *   **Microtarefas:**
        *   Investigar a configuração do Metro Bundler para garantir o `Content-Type` correto para arquivos JavaScript.
        *   Verificar se há alguma configuração no `app.json` ou `metro.config.js` que afete o tipo MIME dos bundles.
        *   Procurar por problemas conhecidos de MIME type com Expo SDK 54 e Metro Bundler para web.

3.  **Verificar e Atualizar Dependências Problemáticas Pós-Upgrade (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Alguns pacotes não foram atualizados automaticamente durante o `expo upgrade` para o SDK 54, e podem estar causando incompatibilidades.
    *   **Microtarefas:**
        *   Revisar a lista completa de dependências e `devDependencies` no `package.json`.
        *   Consultar a documentação de cada dependência para verificar a compatibilidade com Expo SDK 54 e React Native 0.81.
        *   Atualizar manualmente as dependências para versões compatíveis, se aplicável.
        *   Realizar testes de regressão após cada atualização de dependência.

4.  **Garantir a Persistência das Alterações no Repositório (Concluído)**
    *   **Status:** Concluído
    *   **Detalhes:** Realizar `git add`, `git commit` e `git push` para salvar todas as alterações no `backlog.md` e outros arquivos modificados no repositório remoto.
    *   **Microtarefas:**
        *   `git add backlog.md`
        *   `git commit -m "Adicionado épico de resolução de problemas de inicialização da aplicação web ao backlog."`
        *   `git push`




### Épico: Resolução de Problemas de Renderização da Aplicação Web

#### História de Usuário: Como desenvolvedor, quero que a aplicação web renderize corretamente o conteúdo, incluindo estilos e componentes, para que a interface de usuário seja visível e interativa.

#### Tarefas:

1.  **Investigar e Resolver Problema de Página em Branco (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** A aplicação web inicia sem erros no console, mas a página permanece em branco, indicando que o conteúdo não está sendo renderizado.
    *   **Microtarefas:**
        *   Verificar a árvore de componentes renderizada no navegador (usando ferramentas de desenvolvedor).
        *   Confirmar se o `app/_layout.tsx` e `app/index.tsx` estão sendo executados e retornando componentes válidos.
        *   Analisar possíveis conflitos de renderização ou erros silenciosos que impedem a exibição do conteúdo.

2.  **Configurar NativeWind para Web (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** O `NativeWind` pode não estar aplicando os estilos corretamente na versão web, especialmente com a linha `NativeWindStyleSheet.setOutput({ default: 'native' });`.
    *   **Microtarefas:**
        *   Revisar a documentação do `NativeWind` para configuração específica de web em projetos Expo Router com Metro Bundler.
        *   Verificar e ajustar o `tailwind.config.js` e `babel.config.js` para garantir a compatibilidade com a web.
        *   Testar a aplicação de estilos básicos do Tailwind CSS em componentes simples.

3.  **Revisar Configuração do Metro Bundler para Web (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Apesar da correção do erro de `entry file` e do MIME type, é fundamental garantir que o Metro Bundler esteja configurado de forma otimizada para a web.
    *   **Microtarefas:**
        *   Confirmar que o `metro.config.js` está configurado para lidar com assets e módulos de forma adequada para a web.
        *   Verificar se há alguma configuração adicional necessária para o Metro Bundler servir corretamente todos os arquivos da aplicação web.

4.  **Realizar Commit e Push das Alterações (Concluído)**
    *   **Status:** Concluído
    *   **Objetivo:** Versionar e compartilhar as implementações.
    *   **Microtarefas:**
        *   `git add backlog.md`
        *   `git commit -m "Adicionado épico de resolução de problemas de renderização da aplicação web ao backlog."`
        *   `git push`

