


# Backlog Geral do Projeto GiroPro

## Novas Tarefas

- Tarefa: P3 - Implementar tela de Relatórios
  - Quem: Frontend
  - O que: Criar um componente para a tela de relatórios, exibindo gráficos e dados financeiros.
  - Porquê: Fornecer ao usuário uma visão geral de suas finanças.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Testes locais da aplicação
  - Quem: Frontend
  - O que: Testar a aplicação no browser para verificar funcionalidade completa.
  - Porquê: Garantir que a aplicação está funcionando corretamente antes do deploy.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Melhorias de UX/UI
  - Quem: Frontend
  - O que: Adicionar loading states e feedback visual para melhorar a experiência do usuário.
  - Porquê: Fornecer feedback claro ao usuário durante as operações.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Otimizações de performance
  - Quem: Frontend
  - O que: Implementar cache e outras otimizações de performance.
  - Porquê: Melhorar a velocidade e a responsividade da aplicação.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Preparar para deploy
  - Quem: Frontend
  - O que: Preparar a aplicação para deploy em produção.
  - Porquê: Tornar a aplicação acessível publicamente.
  - Complexidade: Média
  - Concluído: [ ]

## Demandas Concluídas

- Tarefa: P1 - Revisão de ORM/SQL (Otimização DB)
  - Quem: Backend
  - O que: Otimizar as queries escritas em SQL ou através do ORM, aplicando melhores práticas.
  - Porquê: Reduzir o tempo de execução das queries e o consumo de recursos.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Tratamento de Erros Assíncronos em Rotas (Async Handler)
  - Quem: Backend
  - O que: Implementar um wrapper para lidar com erros em rotas assíncronas.
  - Porquê: Evitar a repetição de blocos `try-catch` e centralizar o tratamento de exceções.
  - Complexidade: Complexa
  - Concluído: [x]

- Tarefa: P3 - Remoção/Desabilitação do Endpoint `/api/test` em Produção
  - Quem: Backend
  - O que: Remover ou desabilitar o endpoint `/api/test` em ambiente de produção.
  - Porquê: Evitar exposição desnecessária de informações.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P3 - Verificação e Uso de `fuelPricesRoutes`
  - Quem: Backend
  - O que: Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário.
  - Porquê: Manter o código limpo e remover rotas não utilizadas.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P3 - Organização de Imports
  - Quem: Backend
  - O que: Padronizar a organização dos imports em todos os arquivos.
  - Porquê: Melhorar a legibilidade e manutenção do código.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Atualizar documentação de API
  - Quem: Backend
  - O que: Revisar e atualizar a documentação da API de autenticação.
  - Porquê: Manter a documentação precisa e atualizada.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Criação/Otimização de Índices (Otimização DB)
  - Quem: Backend
  - O que: Criar novos índices ou otimizar os existentes com base na análise de queries lentas.
  - Porquê: Melhorar a performance de leitura do banco de dados.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Configuração do Banco de Dados (Otimização DB)
  - Quem: Backend
  - O que: Revisar e ajustar as configurações do servidor de banco de dados para melhor performance.
  - Porquê: Garantir que o banco de dados esteja operando com a máxima eficiência.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Implementação de Limitação de Taxa (Rate Limiting) - Subtarefa: Pesquisa e Seleção de Biblioteca/Método
  - Quem: Backend
  - O que: Pesquisar e selecionar a melhor biblioteca ou método para implementar rate limiting na API (ex: `express-rate-limit`, `helmet`, etc.).
  - Porquê: Garantir uma implementação eficiente e segura.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Criar um script de migração para renomear a primeira coluna identificada para camelCase.
  - Porquê: Iniciar a padronização do schema do banco de dados.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Compilar o projeto e listar os primeiros 5 erros de TypeScript.
  - Porquê: Identificar os erros mais urgentes ou fáceis de resolver primeiro.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Configurar Variáveis de Ambiente para Frontend Web
  - Quem: Frontend
  - O que: Criar arquivos .env.development e .env.production no diretório frontend e adicionar a variável VITE_API_URL.
  - Porquê: Permitir a configuração dinâmica da URL da API para diferentes ambientes (desenvolvimento, produção).
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P1 - Atualizar Frontend para Usar Variáveis de Ambiente
  - Quem: Frontend
  - O que: Modificar o arquivo vite.config.js para carregar as variáveis de ambiente e atualizar as chamadas fetch em web-app-improved.tsx para usar VITE_API_URL.
  - Porquê: Garantir que a aplicação web se conecte ao backend correto em qualquer ambiente.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Implementar Roteamento no Frontend Web
  - Quem: Frontend
  - O que: Instalar a biblioteca react-router-dom no frontend.
  - Porquê: Habilitar a navegação entre diferentes telas da aplicação web sem recarregar a página.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P2 - Definir Rotas Básicas para Autenticação e Dashboard
  - Quem: Frontend
  - O que: Configurar as rotas para LoginScreen e Dashboard usando react-router-dom em web-app-improved.tsx.
  - Porquê: Estruturar a navegação principal da aplicação web.
  - Complexidade: Média
  - Concluído: [x]

- Tarefa: P2 - Proteger Rotas Autenticadas no Frontend Web
  - Quem: Frontend
  - O que: Implementar um componente de rota privada para redirecionar usuários não autenticados para a tela de login.
  - Porquê: Garantir que apenas usuários logados possam acessar o Dashboard e outras áreas restritas.
  - Complexidade: Média
  - Concluído: [x]

- Tarefa: P3 - Desenvolver Tela de Meus Veículos (Frontend Web)
  - Quem: Frontend
  - O que: Criar um novo componente para exibir a lista de veículos do usuário.
  - Porquê: Começar a implementar as funcionalidades do Dashboard.
  - Complexidade: Média
  - Concluído: [x]

- Tarefa: P3 - Integrar API de Veículos (Frontend Web)
  - Quem: Frontend
  - O que: Fazer requisições à API do backend para buscar e exibir os veículos do usuário na tela de Meus Veículos.
  - Porquê: Popular a tela com dados reais do usuário.
  - Complexidade: Média
  - Concluído: [x]

- Tarefa: P3 - Melhorar Tratamento de Erros de API no Frontend
  - Quem: Frontend
  - O que: Implementar um sistema de notificação (ex: toasts, alertas) para exibir erros de API de forma mais clara e amigável ao usuário.
  - Porquê: Fornecer feedback imediato e compreensível sobre falhas na comunicação com o backend.
  - Complexidade: Média
  - Concluído: [x]

- Tarefa: P3 - Otimizar Imagens para Web
  - Quem: Frontend
  - O que: Implementar lazy loading para imagens e considerar formatos otimizados (ex: WebP) para melhorar o desempenho de carregamento.
  - Porquê: Reduzir o tempo de carregamento da página e o consumo de dados.
  - Complexidade: Simples
  - Concluído: [x]

- Tarefa: P3 - Adicionar Suporte Básico a PWA (Progressive Web App)
  - Quem: Frontend
  - O que: Criar um manifest.json e configurar um Service Worker básico para permitir a instalação do aplicativo web na tela inicial e cache de assets estáticos.
  - Porquê: Melhorar a experiência do usuário, permitindo acesso offline e instalação na tela inicial.
  - Complexidade: Simples
  - Concluído: [x]

---





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
  - Concluído: [ ]

- Tarefa: P2 - Atualizar `README.md` com instruções de setup e execução
  - Quem: Geral
  - O que: Revisar e atualizar o `README.md` principal com instruções claras e concisas para o setup e execução do projeto.
  - Porquê: Fornecer um guia rápido e preciso para iniciar o desenvolvimento.
  - Complexidade: Simples
  - Concluído: [ ]




<<<<<<< Updated upstream
- Tarefa: P2 - Instalar `react-router-dom`
  - Quem: Frontend
  - O que: Executar `npm install react-router-dom` no diretório `frontend`.
  - Porquê: Habilitar a navegação declarativa na aplicação web.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Criar componente `AppRouter`
  - Quem: Frontend
  - O que: Criar um novo arquivo `src/components/AppRouter.tsx` para encapsular a lógica de roteamento.
  - Porquê: Organizar as rotas e manter o `App.tsx` limpo.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Configurar `BrowserRouter`
  - Quem: Frontend
  - O que: Envolver o `AppContent` com `BrowserRouter` em `main.tsx` ou `App.tsx`.
  - Porquê: Habilitar o roteamento baseado em URL para a aplicação web.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Definir rotas para Login e Dashboard
  - Quem: Frontend
  - O que: No `AppRouter.tsx`, definir rotas para `/login` (renderizando `LoginScreen`) e `/dashboard` (renderizando `Dashboard`).
  - Porquê: Permitir a navegação entre as telas principais.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar `PrivateRoutes`
  - Quem: Frontend
  - O que: Criar um componente `PrivateRoutes` que verifica a autenticação e redireciona para `/login` se o usuário não estiver autenticado.
  - Porquê: Proteger as rotas do dashboard e outras áreas restritas.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P2 - Integrar `PrivateRoutes` ao `AppRouter`
  - Quem: Frontend
  - O que: Usar `PrivateRoutes` para envolver a rota do `/dashboard`.
  - Porquê: Aplicar a proteção de rota ao dashboard.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Redirecionar após Login/Registro
  - Quem: Frontend
  - O que: Após login/registro bem-sucedido, usar `useNavigate` do `react-router-dom` para redirecionar para `/dashboard` em vez de `window.location.reload()`.
  - Porquê: Melhorar a experiência do usuário com navegação suave.
  - Complexidade: Simples
  - Concluído: [ ]

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
  - Concluído: [ ]

- Tarefa: P3 - Criar `manifest.json`
  - Quem: Frontend
  - O que: Criar o arquivo `manifest.json` na raiz do diretório `public` do frontend com metadados básicos do PWA.
  - Porquê: Permitir que o navegador reconheça a aplicação como um PWA e ofereça a instalação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Configurar `Service Worker` básico
  - Quem: Frontend
  - O que: Criar um arquivo `src/service-worker.js` e registrá-lo em `main.tsx` para cachear assets estáticos.
  - Porquê: Habilitar o cache offline e melhorar a resiliência da aplicação.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P4 - Migrar estilos inline para CSS Modules (LoginScreen)
  - Quem: Frontend
  - O que: Criar um arquivo `LoginScreen.module.css` e mover os estilos inline da `LoginScreen` para ele.
  - Porquê: Iniciar a refatoração dos estilos para uma abordagem mais escalável e manutenível.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P4 - Migrar estilos inline para CSS Modules (Dashboard)
  - Quem: Frontend
  - O que: Criar um arquivo `Dashboard.module.css` e mover os estilos inline do `Dashboard` para ele.
  - Porquê: Continuar a refatoração dos estilos.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P4 - Refatorar `FormInput` para reutilização mobile
  - Quem: Frontend
  - O que: Separar a lógica de `FormInput` da sua apresentação visual, criando uma interface mais genérica.
  - Porquê: Facilitar a adaptação do componente para React Native no futuro.
  - Complexidade: Complexa
  - Concluído: [ ]

- Tarefa: P4 - Instalar Cypress para testes E2E
  - Quem: Frontend
  - O que: Executar `npm install cypress --save-dev` no diretório `frontend`.
  - Porquê: Configurar o ambiente para testes end-to-end.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P4 - Escrever teste E2E para fluxo de Login
  - Quem: Frontend
  - O que: Criar um arquivo `cypress/e2e/login.cy.ts` e escrever um teste para o fluxo completo de login.
  - Porquê: Garantir que o login funcione corretamente em um ambiente de navegador real.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P4 - Escrever teste E2E para fluxo de Registro
  - Quem: Frontend
  - O que: Criar um arquivo `cypress/e2e/register.cy.ts` e escrever um teste para o fluxo completo de registro.
  - Porquê: Garantir que o registro funcione corretamente em um ambiente de navegador real.
  - Complexidade: Média
  - Concluído: [ ]

=======
- Tarefa: P2 - Criar arquivo .env.example
  - Quem: Geral
  - O que: Criar um arquivo .env.example na raiz do projeto com todas as variáveis de ambiente necessárias.
  - Porquê: Facilitar a configuração do ambiente para novos desenvolvedores.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Atualizar README.md com instruções de setup e execução
  - Quem: Geral
  - O que: Revisar e atualizar o README.md principal com instruções claras e concisas para o setup e execução do projeto.
  - Porquê: Fornecer um guia rápido e preciso para iniciar o desenvolvimento.
  - Complexidade: Simples
  - Concluído: [ ]

>>>>>>> Stashed changes



