# Backlog Global do Projeto GiroPro

<!-- ATENÇÃO: Não modifique ou remova este cabeçalho e a estrutura geral deste arquivo. Ele é essencial para o funcionamento do sistema.

**Instruções Importantes:**
1.  **Não Deletar Tarefas:** Nenhuma tarefa deve ser deletada deste backlog. Se uma tarefa não for mais relevante, marque-a como 'Cancelada' e adicione uma justificativa.
2.  **Requisitos para Tarefas Concluídas:** Para que uma tarefa seja considerada 'Concluída' (marcada com [x]), é obrigatório incluir as seguintes informações:
    *   **Arquivos Afetados:** Listar quais arquivos foram editados, criados ou removidos.
    *   **Data de Conclusão:** Registrar a data em que a tarefa foi finalizada.

Novas demandas devem ser adicionadas na seção apropriada. -->

Este é o backlog central do projeto GiroPro. Ele contém todas as demandas, épicos, features, bugs e débitos técnicos que precisam ser trabalhados pelos agentes.

## Novas Demandas (P0 - Urgente, P1 - Alta, P2 - Média, P3 - Baixa)

- [ ] **P0 - Corrigir renderização do Dashboard após login (Web)**
  - Descrição: O frontend não está atualizando o estado do usuário após o login bem-sucedido, impedindo a renderização do Dashboard. A API retorna sucesso, o localStorage é atualizado, mas o componente Dashboard não renderiza. (Complexidade: Alta)
- [ ] **P0 - Corrigir interatividade do formulário de login no frontend React (Web)**
  - Descrição: O formulário de login no React não está processando o submit corretamente. Campos são limpos após clique, mas nenhuma ação subsequente. Console não mostra logs de debug do JavaScript, indicando possível problema de execução. (Complexidade: Alta)
- [ ] **P1 - Implementar Seleção de Veículos nos Formulários (Web, Android, iOS)**
  - Descrição: Adicionar dropdown/picker para seleção de veículos cadastrados nos formulários de despesas e abastecimentos. (Complexidade: Alta)
- [ ] **P1 - Implementar Navegação Web Completa**
  - Descrição: Configurar o React Navigation ou solução alternativa para funcionar no ambiente web, permitindo a transição entre as telas. (Complexidade: Alta)
- [ ] **P1 - Refatorar Componentes Incompatíveis**
  - Descrição: Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`). (Complexidade: Alta)
- [ ] **P1 - Otimização do Banco de Dados e Queries**
  - Descrição: Analisar e otimizar as operações de banco de dados para melhorar a performance. Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados. (Complexidade: Alta)
- [ ] **P2 - Decidir Estratégia de Frontend**
  - Descrição: Avaliar se manter duas versões (React Native para mobile + React para web) ou migrar completamente para React com React Native Web. Documentar decisão arquitetural. (Complexidade: Média)
- [ ] **P2 - Implementar Funcionalidades Principais na Versão Web**
  - Descrição: Expandir `web-app.tsx` com CRUD de veículos, despesas, abastecimentos e dashboard com gráficos e relatórios. (Complexidade: Média)
- [ ] **P2 - Implementação de Compressão (Gzip)**
  - Descrição: Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP, melhorando o tempo de carregamento para os clientes. (Complexidade: Média)
- [ ] **P2 - Implementação de Limitação de Taxa (Rate Limiting)**
  - Descrição: Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso, especialmente em endpoints de autenticação. (Complexidade: Média)
- [ ] **P2 - Centralização de Configurações**
  - Descrição: Criar um arquivo `config.ts` para centralizar todas as configurações da aplicação, tornando-as mais fáceis de gerenciar e acessar. (Complexidade: Média)
- [ ] **P2 - Tratamento de Erros Assíncronos em Rotas (Async Handler)**
  - Descrição: Implementar um wrapper para lidar com erros em rotas assíncronas, evitando a repetição de blocos `try-catch` e centralizando o tratamento de exceções. (Complexidade: Média)
- [ ] **P3 - Atualizar Credenciais de Teste Hardcoded**
  - Descrição: Atualizar a interface para mostrar as credenciais de teste corretas (`teste@teste.com` / `Teste123@`). (Complexidade: Simples)
- [ ] **P3 - Organização de Imports**
  - Descrição: Padronizar a organização dos imports em todos os arquivos para melhorar a legibilidade e manutenção do código. (Complexidade: Simples)
- [ ] **P3 - Remoção/Desabilitação do Endpoint `/api/test` em Produção**
  - Descrição: Remover ou desabilitar o endpoint `/api/test` em ambiente de produção para evitar exposição desnecessária de informações. (Complexidade: Simples)
- [ ] **P3 - Verificação e Uso de `fuelPricesRoutes`**
  - Descrição: Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário. Se não for, remover. (Complexidade: Simples)
- [ ] **P3 - Adicionar Validação de Campos Específicos (Android, iOS)**
  - Descrição: Implementar validações específicas como formato de placa, valores monetários e datas nos formulários. (Complexidade: Baixa)
- [ ] **P3 - Melhorar Feedback Visual (Web, Android, iOS)**
  - Descrição: Adicionar loading states, success messages e error handling mais robustos nas operações CRUD. (Complexidade: Baixa)
- [ ] **P3 - Reorganizar Hierarquia de Campos (Android, iOS)**
  - Descrição: Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, priorizando campos obrigatórios e de maior impacto visual. (Complexidade: Baixa)
- [ ] **P3 - Adicionar Validação em Tempo Real (Android, iOS)**
  - Descrição: Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos. (Complexidade: Baixa)
- [ ] **P3 - Melhorar Feedback Visual e Microinterações (Web, Android, iOS)**
  - Descrição: Tornar a interface mais dinâmica e responsiva através de animações e microinterações. (Complexidade: Baixa)
- [ ] **P3 - Ícones e Elementos Visuais (Web, Android, iOS)**
  - Descrição: Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos. (Complexidade: Baixa)
- [ ] **P3 - Cores e Contraste (Web, Android, iOS)**
  - Descrição: Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível. (Complexidade: Baixa)
- [ ] **P3 - Layout e Espaçamento (Web, Android, iOS)**
  - Descrição: Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela. (Complexidade: Baixa)
- [ ] **P3 - Animações e Transições (Web, Android, iOS)**
  - Descrição: Adicionar movimento à interface para torná-la mais dinâmica e engajante. (Complexidade: Baixa)
- [ ] **P3 - Feedback Háptico (Mobile)**
  - Descrição: Utilizar a vibração do dispositivo para fornecer feedback.

## Demandas em Andamento

- [ ] **P0 - Corrigir bug de login**
  - Descrição: Usuários não conseguem fazer login após a última atualização.
  - Status: Em análise pelo Agente de Testes (Agent_19).

## Demandas Concluídas

- [ ] **P2 - Atualizar documentação de API**
  - Descrição: Revisar e atualizar a documentação da API de autenticação.
  - [ ] **P1 - Implementar funcionalidade de Adicionar Despesa Manualmente**
  - Descrição: Desenvolver a funcionalidade para que os usuários possam adicionar despesas manualmente através de um formulário na aplicação. (Complexidade: Média)



- [ ] **[P1-SIMPLES]** Criar componente de botão reutilizável (Frontend)
  - **Descrição**: Desenvolver um componente de botão genérico para ser usado em toda a aplicação.
  - **Equipe**: Frontend
  - **Status**: Pendente
  - **Branch Sugerida**: feature/reusable-button-component
  - **Última Atualização**: 2025-09-14 11:00:00



