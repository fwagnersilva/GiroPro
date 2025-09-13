# Backlog Global do Projeto GiroPro

<!-- ATENÇÃO: Não modifique ou remova este cabeçalho e a estrutura geral deste arquivo. Ele é essencial para o funcionamento do sistema. Novas demandas devem ser adicionadas na seção apropriada. -->

Este é o backlog central do projeto GiroPro. Ele contém todas as demandas, épicos, features, bugs e débitos técnicos que precisam ser trabalhados pelos agentes.

## Novas Demandas (P0 - Urgente, P1 - Alta, P2 - Média, P3 - Baixa)

- [x] **P1 - Implementar funcionalidade de Adicionar Despesa Manualmente**
  - Descrição: Permitir que o usuário adicione despesas manualmente através de um formulário na interface.
  - Status: Pendente de quebra de tarefas pelo Scrum Master.

## Demandas em Andamento

- [ ] **P0 - Corrigir bug de login**
  - Descrição: Usuários não conseguem fazer login após a última atualização.
  - Status: Em análise pelo Agente de Testes (Agent_19).

## Demandas Concluídas

- [x] **P2 - Atualizar documentação de API**
  - Descrição: Revisar e atualizar a documentação da API de autenticação.
  - Status: Concluído pelo Agente de Backend (Agent_09).




## Novas Demandas (Extraídas de 09_progresso.md)

### P0 - Urgente

- [ ] **Corrigir renderização do Dashboard após login (Web)**
  - Descrição: O frontend não está atualizando o estado do usuário após o login bem-sucedido, impedindo a renderização do Dashboard. A API retorna sucesso, o localStorage é atualizado, mas o componente Dashboard não renderiza. (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Investigar `AuthProvider` e `useAuth` hook: Adicionar `console.log` na função `signIn`, verificar se `setUser` está sendo executado e confirmar se `isAuthenticated` está sendo atualizado. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Debug do fluxo React: Adicionar logs em cada etapa do processo de login, verificar se `useEffect` está sendo chamado e testar forçar re-render após login. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Verificar renderização condicional do componente Dashboard e testar isoladamente. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar navegação entre estados após login. (Complexidade: Média)

- [ ] **Corrigir interatividade do formulário de login no frontend React (Web)**
  - Descrição: O formulário de login no React não está processando o submit corretamente. Campos são limpos após clique, mas nenhuma ação subsequente. Console não mostra logs de debug do JavaScript, indicando possível problema de execução. (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Investigar problema de eventos JavaScript: Verificar conflitos entre React Native Web e React puro. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Testar versão HTML pura para isolar o problema. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Verificar se o Vite está compilando corretamente o TypeScript. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Debug do fluxo de eventos: Adicionar event listeners nativos JavaScript, testar submit via Enter key e verificar se `preventDefault` está funcionando. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar versão HTML pura funcional de login com JavaScript vanilla como fallback. (Complexidade: Média)

### P1 - Alta

- [ ] **Implementar Seleção de Veículos nos Formulários (Web, Android, iOS)**
  - Descrição: Adicionar dropdown/picker para seleção de veículos cadastrados nos formulários de despesas e abastecimentos. (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Criar/Atualizar endpoint para listar veículos do usuário. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Desenvolver componente de seleção (dropdown/picker) reutilizável. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Integrar componente de seleção nos formulários de despesas e abastecimentos (Web). (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Integrar componente de seleção nos formulários de despesas e abastecimentos (Android/iOS). (Complexidade: Média)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de integração para a seleção de veículos. (Complexidade: Média)

- [ ] **Implementar Navegação Web Completa**
  - Descrição: Configurar o React Navigation ou solução alternativa para funcionar no ambiente web, permitindo a transição entre as telas. (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Pesquisar e avaliar soluções de navegação compatíveis com React para web. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar a solução de navegação escolhida. (Complexidade: Alta)
    - [ ] **Agente_Frontend (Agent_11/12):** Adaptar as telas existentes para usar a nova navegação. (Complexidade: Média)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de navegação para o fluxo web. (Complexidade: Média)

- [ ] **Refatorar Componentes Incompatíveis**
  - Descrição: Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`). (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Identificar todos os componentes que usam elementos nativos do React Native. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar versões web-compatíveis para cada componente identificado. (Complexidade: Alta)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes unitários para os novos componentes web. (Complexidade: Média)

- [ ] **Otimização do Banco de Dados e Queries**
  - Descrição: Analisar e otimizar as operações de banco de dados para melhorar a performance. Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados. (Complexidade: Alta)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_06/09):** Analisar queries mais lentas e identificar gargalos. (Complexidade: Média)
    - [ ] **Agente_Backend (Agent_06/09):** Criar índices para tabelas frequentemente consultadas. (Complexidade: Média)
    - [ ] **Agente_Backend (Agent_06/09):** Otimizar queries SQL/ORM existentes. (Complexidade: Alta)
    - [ ] **Agente_DevOps (Agent_27/28):** Revisar e ajustar a configuração do banco de dados. (Complexidade: Média)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de performance para as operações de banco de dados. (Complexidade: Média)

### P2 - Média

- [ ] **Decidir Estratégia de Frontend**
  - Descrição: Avaliar se manter duas versões (React Native para mobile + React para web) ou migrar completamente para React com React Native Web. Documentar decisão arquitetural. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Pesquisar prós e contras de cada abordagem (React Native + React Web vs. React Native Web). (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar um documento de decisão arquitetural com as recomendações. (Complexidade: Média)
    - [ ] **Agente_Scrum_Master (Agent_41):** Facilitar a discussão e garantir a documentação da decisão. (Complexidade: Simples)

- [ ] **Implementar Funcionalidades Principais na Versão Web**
  - Descrição: Expandir `web-app.tsx` com CRUD de veículos, despesas, abastecimentos e dashboard com gráficos e relatórios. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar CRUD de veículos na versão web. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar CRUD de despesas na versão web. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar CRUD de abastecimentos na versão web. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Desenvolver dashboard com gráficos e relatórios na versão web. (Complexidade: Alta)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de integração para as novas funcionalidades web. (Complexidade: Média)

- [ ] **Implementação de Compressão (Gzip)**
  - Descrição: Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP, melhorando o tempo de carregamento para os clientes. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Pesquisar e implementar middleware de Gzip no backend. (Complexidade: Média)
    - [ ] **Agente_DevOps (Agent_27/28):** Configurar servidor web (se aplicável) para usar compressão Gzip. (Complexidade: Simples)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de performance para verificar a redução do tamanho das respostas. (Complexidade: Média)

- [ ] **Implementação de Limitação de Taxa (Rate Limiting)**
  - Descrição: Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso, especialmente em endpoints de autenticação. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Pesquisar e implementar solução de rate limiting no backend. (Complexidade: Média)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes de segurança para validar o rate limiting. (Complexidade: Média)

- [ ] **Centralização de Configurações**
  - Descrição: Criar um arquivo `config.ts` para centralizar todas as configurações da aplicação, tornando-as mais fáceis de gerenciar e acessar. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Criar `config.ts` no backend e migrar configurações existentes. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar `config.ts` no frontend e migrar configurações existentes. (Complexidade: Média)
    - [ ] **Agente_DevOps (Agent_27/28):** Atualizar pipelines de CI/CD para usar o novo arquivo de configuração. (Complexidade: Simples)

- [ ] **Tratamento de Erros Assíncronos em Rotas (Async Handler)**
  - Descrição: Implementar um wrapper para lidar com erros em rotas assíncronas, evitando a repetição de blocos `try-catch` e centralizando o tratamento de exceções. (Complexidade: Média)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Desenvolver um `asyncHandler` para rotas. (Complexidade: Média)
    - [ ] **Agente_Backend (Agent_09):** Aplicar o `asyncHandler` em todas as rotas assíncronas existentes. (Complexidade: Média)
    - [ ] **Agente_Testes (Agent_19/23):** Criar testes para garantir que o tratamento de erros funcione corretamente. (Complexidade: Média)

### P3 - Baixa

- [ ] **Atualizar Credenciais de Teste Hardcoded**
  - Descrição: Atualizar a interface para mostrar as credenciais de teste corretas (`teste@teste.com` / `Teste123@`). (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Localizar e atualizar as credenciais de teste na interface. (Complexidade: Simples)

- [ ] **Organização de Imports**
  - Descrição: Padronizar a organização dos imports em todos os arquivos para melhorar a legibilidade e manutenção do código. (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Configurar ESLint para padronizar a organização de imports. (Complexidade: Simples)
    - [ ] **Agente_Backend (Agent_09):** Configurar ESLint para padronizar a organização de imports. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Aplicar formatação de imports nos arquivos existentes. (Complexidade: Média)
    - [ ] **Agente_Backend (Agent_09):** Aplicar formatação de imports nos arquivos existentes. (Complexidade: Média)

- [ ] **Remoção/Desabilitação do Endpoint `/api/test` em Produção**
  - Descrição: Remover ou desabilitar o endpoint `/api/test` em ambiente de produção para evitar exposição desnecessária de informações. (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Implementar lógica para desabilitar `/api/test` em produção. (Complexidade: Simples)
    - [ ] **Agente_DevOps (Agent_27/28):** Verificar que o endpoint está desabilitado em ambientes de produção. (Complexidade: Simples)

- [ ] **Verificação e Uso de `fuelPricesRoutes`**
  - Descrição: Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário. Se não for, remover. (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Backend (Agent_09):** Analisar o uso de `fuelPricesRoutes`. (Complexidade: Simples)
    - [ ] **Agente_Backend (Agent_09):** Remover `fuelPricesRoutes` se não for necessário. (Complexidade: Simples)

- [ ] **Adicionar Validação de Campos Específicos (Android, iOS)**
  - Descrição: Implementar validações específicas como formato de placa, valores monetários e datas nos formulários. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Adicionar validação de formato de placa nos formulários mobile. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Adicionar validação de valores monetários nos formulários mobile. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Adicionar validação de datas nos formulários mobile. (Complexidade: Simples)

- [ ] **Melhorar Feedback Visual (Web, Android, iOS)**
  - Descrição: Adicionar loading states, success messages e error handling mais robustos nas operações CRUD. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar loading states para operações CRUD. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar mensagens de sucesso para operações CRUD. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar tratamento de erros mais robusto para operações CRUD. (Complexidade: Média)

- [ ] **Reorganizar Hierarquia de Campos (Android, iOS)**
  - Descrição: Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, priorizando campos obrigatórios e de maior impacto visual. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Analisar e propor nova hierarquia de campos para formulários mobile. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar a nova hierarquia de campos nos formulários mobile. (Complexidade: Média)

- [ ] **Adicionar Validação em Tempo Real (Android, iOS)**
  - Descrição: Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar validação em tempo real para campos de formulário mobile. (Complexidade: Média)

- [ ] **Melhorar Feedback Visual e Microinterações (Web, Android, iOS)**
  - Descrição: Tornar a interface mais dinâmica e responsiva através de animações e microinterações. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Adicionar microinterações em elementos chave da interface. (Complexidade: Média)

- [ ] **Ícones e Elementos Visuais (Web, Android, iOS)**
  - Descrição: Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Selecionar e integrar bibliotecas de ícones. (Complexidade: Simples)
    - [ ] **Agente_Frontend (Agent_11/12):** Aplicar ícones em elementos relevantes da interface. (Complexidade: Média)

- [ ] **Cores e Contraste (Web, Android, iOS)**
  - Descrição: Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Revisar e ajustar a paleta de cores para acessibilidade. (Complexidade: Média)

- [ ] **Layout e Espaçamento (Web, Android, iOS)**
  - Descrição: Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Otimizar layout e espaçamento para diferentes tamanhos de tela. (Complexidade: Média)

- [ ] **Animações e Transições (Web, Android, iOS)**
  - Descrição: Adicionar movimento à interface para torná-la mais dinâmica e engajante. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar animações e transições em elementos chave. (Complexidade: Média)

- [ ] **Feedback Háptico (Mobile)**
  - Descrição: Utilizar a vibração do dispositivo para fornecer feedback físico em interações importantes. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar feedback háptico para interações mobile. (Complexidade: Simples)

- [ ] **Estados Interativos (Web, Android, iOS)**
  - Descrição: Fornecer feedback visual claro para todas as interações do usuário. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar estados visuais para interações (hover, focus, active). (Complexidade: Média)

- [ ] **Implementar Adaptações por Plataforma**
  - Descrição: Criar variações específicas dos componentes para iOS, Android e Web seguindo as diretrizes de design de cada plataforma. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Criar variações de componentes para iOS. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar variações de componentes para Android. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Criar variações de componentes para Web. (Complexidade: Média)

- [ ] **Otimizar Performance das Animações (Web, Android, iOS)**
  - Descrição: Garantir que as animações sejam fluidas e não impactem a performance, especialmente em dispositivos mais antigos. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Otimizar animações para garantir fluidez. (Complexidade: Média)

- [ ] **Criar Sistema de Temas Dinâmico (Web, Android, iOS)**
  - Descrição: Implementar alternância entre tema claro e escuro com persistência de preferência do usuário. (Complexidade: Baixa)
  - Microtarefas:
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar lógica de alternância de temas. (Complexidade: Média)
    - [ ] **Agente_Frontend (Agent_11/12):** Implementar persistência da preferência do usuário. (Complexidade: Simples)




### P1 - Alta

- [ ] **Criar prompt de exemplo para agentes de Testes**
  - Descrição: Desenvolver um prompt que defina a missão, responsabilidades e fluxo de trabalho para agentes de Testes.
  - Microtarefas:
    - [ ] **Agente_Scrum_Master (Agent_41):** Definir missão e responsabilidades do agente de Testes. (Complexidade: Simples)
    - [ ] **Agente_Scrum_Master (Agent_41):** Esboçar fluxo de trabalho para testes unitários, de integração e E2E. (Complexidade: Média)
    - [ ] **Agente_Scrum_Master (Agent_41):** Incluir exemplos de tarefas de teste no prompt. (Complexidade: Simples)

- [ ] **Criar arquivo de tarefas para agentes de Testes**
  - Descrição: Criar o arquivo `agent_testes_tasks.md` na pasta `docs/05_automacao_tarefas/tarefas_agentes/testes/` para que o Scrum Master possa delegar tarefas de teste. (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Scrum_Master (Agent_41):** Criar o arquivo `agent_testes_tasks.md` com cabeçalho de aviso e estrutura inicial. (Complexidade: Simples)

- [ ] **Criar prompt de exemplo para agentes de DevOps**
  - Descrição: Desenvolver um prompt que defina a missão, responsabilidades e fluxo de trabalho para agentes de DevOps.
  - Microtarefas:
    - [ ] **Agente_Scrum_Master (Agent_41):** Definir missão e responsabilidades do agente de DevOps. (Complexidade: Simples)
    - [ ] **Agente_Scrum_Master (Agent_41):** Esboçar fluxo de trabalho para CI/CD, monitoramento e infraestrutura. (Complexidade: Média)
    - [ ] **Agente_Scrum_Master (Agent_41):** Incluir exemplos de tarefas de DevOps no prompt. (Complexidade: Simples)

- [ ] **Criar arquivo de tarefas para agentes de DevOps**
  - Descrição: Criar o arquivo `agent_devops_tasks.md` na pasta `docs/05_automacao_tarefas/tarefas_agentes/devops/` para que o Scrum Master possa delegar tarefas de DevOps. (Complexidade: Simples)
  - Microtarefas:
    - [ ] **Agente_Scrum_Master (Agent_41):** Criar o arquivo `agent_devops_tasks.md` com cabeçalho de aviso e estrutura inicial. (Complexidade: Simples)


