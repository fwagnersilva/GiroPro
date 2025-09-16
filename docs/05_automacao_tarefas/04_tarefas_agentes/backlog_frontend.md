# Backlog Frontend

## Tarefas Atribuídas

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Instalar a biblioteca de validação (Zod) no projeto frontend.
  - Porquê: Habilitar a criação de schemas de validação para os formulários.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A biblioteca Zod foi instalada utilizando `npm install zod`.
  - Hash do Commit: 4575a33bfcace047c4897ad1a2b4972e45cb3da3


- **Tarefa:** P0 - Corrigir renderização do Dashboard após login (Web)
  - **Quem:** Frontend
  - **O que:** O frontend não está atualizando o estado do usuário após o login bem-sucedido, impedindo a renderização do Dashboard.
  - **Porquê:** A API retorna sucesso, o localStorage é atualizado, mas o componente Dashboard não renderiza.
  - **Complexidade:** Complexa
  - **Concluído:** Em Execução
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P0 - Corrigir interatividade do formulário de login no frontend React (Web)
  - **Quem:** Frontend
  - **O que:** O formulário de login no React não está processando o submit corretamente.
  - **Porquê:** Campos são limpos após clique, mas nenhuma ação subsequente. Console não mostra logs de debug do JavaScript, indicando possível problema de execução.
  - **Complexidade:** Complexa
  - **Concluído:** Em Execução
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P1 - Implementar Seleção de Veículos nos Formulários (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Adicionar dropdown/picker para seleção de veículos cadastrados nos formulários de despesas e abastecimentos.
  - **Porquê:** Melhorar a usabilidade e evitar erros de digitação.
  - **Complexidade:** Simples
  - **Concluído:** [x]
  - **Como foi feita:** Adicionada validação para garantir que um veículo seja selecionado nos formulários de despesa (`AddExpenseScreen.tsx`) e abastecimento (`AddFuelingScreen.tsx`). O label "(Opcional)" foi removido do campo de seleção de veículo em `AddExpenseScreen.tsx`.
  - **Hash do Commit:** 9aa810b

- **Tarefa:** P1 - Implementar Navegação Web Completa
  - **Quem:** Frontend
  - **O que:** Configurar o React Navigation ou solução alternativa para funcionar no ambiente web, permitindo a transição entre as telas.
  - **Porquê:** Permitir que o usuário navegue entre as diferentes seções da aplicação web.
  - **Complexidade:** Complexa
  - **Concluído:** [x]
  - **Como foi feita:** Criado o arquivo `LinkingConfiguration.ts` para definir as rotas web e integrado ao `NavigationContainer` em `AppNavigator.tsx`. Instaladas as dependências `expo-linking` e `@react-navigation/native`.
  - **Hash do Commit:** eb1bf90

- **Tarefa:** P1 - Refatorar Componentes Incompatíveis
  - **Quem:** Frontend
  - **O que:** Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`).
  - **Porquê:** Garantir a compatibilidade e o funcionamento correto da aplicação na plataforma web.
  - **Complexidade:** Complexa
  - **Concluído:** [x]
  - **Como foi feita:** Criado um novo arquivo `web-app-improved.tsx` que integra componentes web-compatíveis diretamente no arquivo principal. O componente `FormInput` foi refatorado para usar elementos HTML nativos (input, div, span) em vez de componentes React Native. Implementada validação em tempo real, tratamento de erros melhorado, e componente `LoadingSpinner` web-compatível. O arquivo `index.ts` foi atualizado para usar a nova versão melhorada.
  - **Arquivos modificados:** `frontend/web-app-improved.tsx` (criado), `frontend/index.ts` (atualizado)
  - **Hash do Commit:** ad6df80

- **Tarefa:** P2 - Decidir Estratégia de Frontend
  - **Quem:** Frontend
  - **O que:** Avaliar se manter duas versões (React Native para mobile + React para web) ou migrar completamente para React com React Native Web.
  - **Porquê:** Definir a arquitetura de frontend para o projeto, visando a otimização de recursos e a manutenibilidade.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Implementar Funcionalidades Principais na Versão Web
  - **Quem:** Frontend
  - **O que:** Expandir `web-app.tsx` com CRUD de veículos, despesas, abastecimentos e dashboard com gráficos e relatórios.
  - **Porquê:** Tornar a versão web da aplicação funcional e útil para o usuário.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Atualizar Credenciais de Teste Hardcoded
  - **Quem:** Frontend
  - **O que:** Atualizar a interface para mostrar as credenciais de teste corretas (`teste@teste.com` / `Teste123@`).
  - **Porquê:** Facilitar o acesso e os testes da aplicação.
  - **Complexidade:** Simples
  - **Concluído:** [x]
  - **Como foi feita:** Atualizadas as credenciais de teste em dois arquivos: `frontend/web-app-improved.tsx` e `frontend/LoginScreen.simple.web.tsx`. As credenciais foram alteradas de `test@test.com` / `123456` para `teste@teste.com` / `Teste123@` conforme especificado na tarefa.
  - **Arquivos modificados:** `frontend/web-app-improved.tsx`, `frontend/LoginScreen.simple.web.tsx`
  - **Hash do Commit:** 937b914

- **Tarefa:** P3 - Organização de Imports
  - **Quem:** Frontend
  - **O que:** Padronizar a organização dos imports em todos os arquivos.
  - **Porquê:** Melhorar a legibilidade e manutenção do código.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Adicionar Validação de Campos Específicos (Android, iOS)
  - **Quem:** Frontend (Mobile)
  - **O que:** Implementar validações específicas como formato de placa, valores monetários e datas nos formulários.
  - **Porquê:** Garantir a integridade dos dados e melhorar a experiência do usuário.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Melhorar Feedback Visual (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Adicionar loading states, success messages e error handling mais robustos nas operações CRUD.
  - **Porquê:** Fornecer uma experiência de usuário mais clara e responsiva.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Reorganizar Hierarquia de Campos (Android, iOS)
  - **Quem:** Frontend (Mobile)
  - **O que:** Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento.
  - **Porquê:** Priorizar campos obrigatórios e de maior impacto visual para melhorar a usabilidade.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Adicionar Validação em Tempo Real (Android, iOS)
  - **Quem:** Frontend (Mobile)
  - **O que:** Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos.
  - **Porquê:** Melhorar a experiência do usuário e reduzir erros de entrada.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Melhorar Feedback Visual e Microinterações (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Tornar a interface mais dinâmica e responsiva através de animações e microinterações.
  - **Porquê:** Aumentar o engajamento e a satisfação do usuário.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Ícones e Elementos Visuais (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos.
  - **Porquê:** Melhorar a compreensão e a estética da interface.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Cores e Contraste (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível.
  - **Porquê:** Melhorar a experiência visual e a acessibilidade para todos os usuários.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Layout e Espaçamento (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela.
  - **Porquê:** Garantir uma experiência consistente e agradável em diversos dispositivos.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Animações e Transições (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Adicionar movimento à interface para torná-la mais dinâmica e engajante.
  - **Porquê:** Melhorar a fluidez e a percepção de responsividade da aplicação.
  - **Complexidade:** Complexa
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Feedback Háptico (Mobile)
  - **Quem:** Frontend (Mobile)
  - **O que:** Utilizar a vibração do dispositivo para fornecer feedback.
  - **Porquê:** Aumentar a imersão e a resposta tátil do usuário em dispositivos móveis.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P1 - Criar componente de botão reutilizável (Frontend)
  - **Quem:** Frontend
  - **O que:** Desenvolver um componente de botão genérico para ser usado em toda a aplicação.
  - **Porquê:** Padronizar a interface e facilitar o desenvolvimento.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
  - **Comentários:** 
  - **Hash do Commit:**

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Instalar a biblioteca de validação (Zod) no projeto frontend.
  - Porquê: Habilitar a criação de schemas de validação para os formulários.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'marca' do formulário de veículos.
  - Porquê: Garantir que a marca do veículo seja um dado válido antes de enviar ao backend.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'marca' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário sobre a validade da entrada.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'modelo' do formulário de veículos.
  - Porquê: Garantir que o modelo do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'modelo' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'ano' do formulário de veículos.
  - Porquê: Garantir que o ano do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'ano' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'placa' do formulário de veículos.
  - Porquê: Garantir que a placa do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'placa' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'tipoCombustivel' do formulário de veículos.
  - Porquê: Garantir que o tipo de combustível seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoCombustivel' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'tipoUso' do formulário de veículos.
  - Porquê: Garantir que o tipo de uso seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoUso' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'kmInicio' do formulário de jornadas.
  - Porquê: Garantir que a quilometragem inicial seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'kmInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'dataInicio' do formulário de jornadas.
  - Porquê: Garantir que a data de início seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'dataInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'quantidadeLitros' do formulário de abastecimentos.
  - Porquê: Garantir que a quantidade de litros seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'quantidadeLitros' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorLitro' do formulário de abastecimentos.
  - Porquê: Garantir que o valor do litro seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorLitro' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorDespesa' do formulário de despesas.
  - Porquê: Garantir que o valor da despesa seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorDespesa' ao formulário de despesas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar um componente básico de Toast/Notificação (apenas UI).
  - Porquê: Ter uma base visual para exibir erros e mensagens de feedback.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Adicionar o componente de Toast ao layout principal da aplicação.
  - Porquê: Permitir que qualquer parte da aplicação possa disparar notificações.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar uma função utilitária showErrorToast(message).
  - Porquê: Centralizar a lógica de exibição de erros e facilitar o uso em toda a aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de login para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o login.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de registro para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o registro.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Instalar Playwright como dependência de desenvolvimento.
  - Porquê: Habilitar a escrita e execução de testes End-to-End.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Criar arquivo de configuração inicial do Playwright.
  - Porquê: Definir o ambiente e as opções de execução dos testes E2E.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de registro.
  - Porquê: Verificar se a página de registro é acessível.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de registro (campos válidos).
  - Porquê: Simular a entrada de dados de um usuário real.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de registro.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do registro (redirecionamento/mensagem).
  - Porquê: Validar o comportamento esperado após um registro bem-sucedido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de login.
  - Porquê: Verificar se a página de login é acessível.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de login (credenciais válidas).
  - Porquê: Simular a entrada de credenciais de um usuário real.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de login.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do login (redirecionamento para dashboard).
  - Porquê: Validar o comportamento esperado após um login bem-sucedido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Instalar react-query no projeto frontend.
  - Porquê: Habilitar o uso de hooks para gerenciamento de estado de dados e cache.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Configurar QueryClientProvider no componente raiz do frontend.
  - Porquê: Disponibilizar o contexto do React Query para toda a aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Criar uma função fetchDashboardSummary para buscar dados do dashboard.
  - Porquê: Encapsular a lógica de busca de dados para ser usada com useQuery.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Substituir a chamada de API existente no DashboardScreen por useQuery('dashboardSummary', fetchDashboardSummary).
  - Porquê: Aproveitar os benefícios de cache, re-fetch e gerenciamento de estado do React Query.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Adicionar um if (isLoading) para exibir um LoadingSpinner simples no DashboardScreen.
  - Porquê: Melhorar a experiência do usuário, indicando que a aplicação está processando.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um botão na tela de perfil do frontend para acionar a rota de backup.
  - Porquê: Permitir que o usuário inicie o download de seu backup de dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um formulário de upload na tela de perfil do frontend para enviar o arquivo de backup para restauração.
  - Porquê: Permitir que o usuário faça o upload de seu backup para restaurar os dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Criar um formulário de feedback simples no frontend (apenas UI).
  - Porquê: Fornecer uma interface para o usuário enviar feedback.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Integrar o formulário de feedback com o endpoint do backend.
  - Porquê: Permitir que o feedback seja enviado e processado pela aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Adicionar autenticação de dois fatores (2FA)
  - Quem: Frontend
  - O que: Adicionar campo de entrada para o código TOTP na tela de login do frontend.
  - Porquê: Permitir que o usuário forneça o segundo fator de autenticação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Adicionar autenticação de dois fatores (2FA)
  - Quem: Frontend
  - O que: Integrar a tela de configuração de 2FA no frontend.
  - Porquê: Fornecer uma interface para o usuário gerenciar suas configurações de 2FA.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar notificações push
  - Quem: Frontend
  - O que: Configurar o Firebase Cloud Messaging (FCM) no projeto frontend.
  - Porquê: Habilitar o frontend para receber notificações push.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P0 - Debugar falha de login no frontend (Web)
  - Quem: Frontend
  - O que: Investigar por que o login falha mesmo com credenciais corretas e o backend respondendo com erro.
  - Porquê: O login é uma funcionalidade crítica e precisa ser corrigida para que o restante do frontend possa ser testado.
  - Complexidade: Complexa
  - Concluído: Em Execução

- Tarefa: P1 - Adicionar tratamento de erro visual para login no frontend (Web)
  - Quem: Frontend
  - O que: Exibir uma mensagem de erro amigável ao usuário quando o login falhar.
  - Porquê: Melhorar a experiência do usuário, informando sobre o problema.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Verificar e corrigir comunicação do frontend com o backend (Web)
  - Quem: Frontend
  - O que: Analisar as requisições e respostas da API no console do navegador para identificar problemas de comunicação.
  - Porquê: Garantir que o frontend está enviando e recebendo dados corretamente do backend.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P2 - Implementar tela de registro de usuário no frontend (Web)
  - Quem: Frontend
  - O que: Criar a interface e a lógica para permitir que novos usuários se registrem na aplicação.
  - Porquê: Habilitar novos usuários a utilizar o sistema.
  - Complexidade: Complexa
  - Concluído: [ ]

- Tarefa: P2 - Implementar navegação básica entre telas de login e registro (Web)
  - Quem: Frontend
  - O que: Adicionar links ou botões para alternar entre as telas de login e registro.
  - Porquê: Permitir que o usuário navegue entre as funcionalidades de autenticação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Refatorar componentes de formulário para reuso (Web)
  - Quem: Frontend
  - O que: Identificar elementos comuns em formulários (inputs, botões) e criar componentes reutilizáveis.
  - Porquê: Reduzir duplicação de código e manter consistência visual.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P3 - Adicionar validação de campos de email e senha no formulário de login (Web)
  - Quem: Frontend
  - O que: Implementar validação básica para os campos de email (formato) e senha (tamanho mínimo) no lado do cliente.
  - Porquê: Fornecer feedback imediato ao usuário e reduzir requisições inválidas ao backend.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Adicionar ícone de carregamento no botão de login (Web)
  - Quem: Frontend
  - O que: Exibir um spinner ou ícone de carregamento no botão 'Entrar' enquanto a requisição de login está em andamento.
  - Porquê: Melhorar a experiência do usuário, indicando que a ação está sendo processada.
  - Complexidade: Simples
  - Concluído: [ ]
