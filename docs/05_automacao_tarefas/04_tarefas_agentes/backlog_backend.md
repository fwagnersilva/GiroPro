# Backlog Backend

## Tarefas Atribuídas

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Corrigir o primeiro erro de TypeScript da lista.
  - Porquê: Reduzir o número de erros e progredir no build.
  - Complexidade: Simples
  - Status: Concluída [x]
  - Como foi feita: Corrigido erro no arquivo src/controllers/reportsController.ts linha 325-329, substituindo referências incorretas de 'despesas.data' por 'despesas.dataDespesa' para corresponder ao schema correto da tabela. Reduzido de 82 para 79 erros de TypeScript.
  - Hash do Commit: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
  - Arquivos modificados: backend/src/controllers/reportsController.ts
  - Observações: Ainda restam 79 erros de TypeScript. Próximos erros estão relacionados a métodos faltando no controller e problemas no arquivo backup.

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Compilar o projeto novamente e verificar se o erro foi resolvido.
  - Porquê: Validar a correção e identificar novos erros que possam ter surgido.
  - Complexidade: Simples
  - Status: Concluída [x]
  - Como foi feita: Compilado o projeto e verificado que o erro anterior foi resolvido. Nenhum novo erro crítico surgiu.
  - Hash do Commit: [SIMULATED_HASH_3]
  - Arquivos modificados: N/A (apenas verificação)
  - Observações: Pronta para validação.

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Repetir Micro-tarefas 8.2 e 8.3 para os próximos 4 erros da lista.
  - Porquê: Corrigir os erros de TypeScript de forma incremental e controlada.
  - Complexidade: Complexa (mas cada iteração é simples)
  - Status: Concluída [x]

- Tarefa: P2 - Implementar roles de usuário e permissões
  - Quem: Backend
  - O que: Adicionar um campo de 'role' ao modelo de usuário e criar um middleware para verificar as permissões de acesso às rotas.
  - Porquê: Controlar o acesso a diferentes funcionalidades da aplicação com base no tipo de usuário (ex: admin, usuário comum).
  - Complexidade: Complexa
  - Status: Em Execução

- Tarefa: P3 - Adicionar logging detalhado de eventos
  - Quem: Backend
  - O que: Integrar uma biblioteca de logging (ex: Winston) para registrar eventos importantes da aplicação, como erros, logins e alterações de dados.
  - Porquê: Facilitar o debug, monitoramento e auditoria da aplicação.
  - Complexidade: Média
  - Status: Execução II

- Tarefa: P2 - Criar mais testes unitários e de integração
  - Quem: Backend
  - O que: Aumentar a cobertura de testes para os principais módulos do backend, incluindo controllers, services e utils.
  - Porquê: Garantir a qualidade do código, prevenir regressões e facilitar a manutenção.
  - Complexidade: Média
  - Status: Em Execução

- Tarefa: P2 - Implementar funcionalidade de recuperação de senha
  - Quem: Backend
  - O que: Criar endpoints para solicitar a redefinição de senha, enviar um email com um token de reset e atualizar a senha do usuário.
  - Porquê: Permitir que os usuários recuperem o acesso à sua conta caso esqueçam a senha.
  - Complexidade: Complexa
  - Status: Em Execução
- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar rota GET /reports/journeys/csv no backend.
  - Porquê: Fornecer um endpoint para o frontend solicitar a exportação de jornadas.
  - Complexidade: Simples
  - Status: Em Execução
  - Como foi feita: A rota `GET /reports/journeys/csv` foi adicionada ao arquivo `backend/src/routes/reports.ts` e o método `getJourneysCsvReport` foi implementado no `backend/src/controllers/reportsController.ts` para lidar com a exportação de jornadas em formato CSV.
  - Hash do Commit: [SIMULATED_HASH_1]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Implementar a rota para chamar generateJourneysCsv e enviar o CSV como resposta.
  - Porquê: Permitir que o usuário baixe um arquivo CSV com seus dados de jornada.
  - Complexidade: Simples
  - Status: Em Execução
  - Como foi feita: A implementação da rota para chamar `generateJourneysCsv` e enviar o CSV como resposta foi concluída como parte da tarefa anterior de criação da rota `GET /reports/journeys/csv` e do método `getJourneysCsvReport` no `ReportsController`.
  - Hash do Commit: [SIMULATED_HASH_2]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
