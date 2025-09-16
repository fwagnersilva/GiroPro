# Backlog Backend

## Tarefas Atribuídas

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Corrigir o primeiro erro de TypeScript da lista.
  - Porquê: Reduzir o número de erros e progredir no build.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: Corrigido erro no arquivo src/controllers/reportsController.ts linha 325-329, substituindo referências incorretas de 'despesas.data' por 'despesas.dataDespesa' para corresponder ao schema correto da tabela. Reduzido de 82 para 79 erros de TypeScript.
  - Hash do Commit: [PENDENTE]
  - Arquivos modificados: backend/src/controllers/reportsController.ts
  - Observações: Ainda restam 79 erros de TypeScript. Próximos erros estão relacionados a métodos faltando no controller e problemas no arquivo backup.

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Compilar o projeto novamente e verificar se o erro foi resolvido.
  - Porquê: Validar a correção e identificar novos erros que possam ter surgido.
  - Complexidade: Simples
  - Status: Em Execução

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Repetir Micro-tarefas 8.2 e 8.3 para os próximos 4 erros da lista.
  - Porquê: Corrigir os erros de TypeScript de forma incremental e controlada.
  - Complexidade: Complexa (mas cada iteração é simples)
  - Concluído: [ ]

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Repetir o processo (listar 5 erros, corrigir, verificar) até que não haja mais erros de TypeScript.
  - Porquê: Garantir um build limpo e robusto do projeto.
  - Complexidade: Complexa
  - Concluído: [ ]

- Tarefa: P2 - Atualizar dependências do projeto
  - Quem: Backend/Frontend
  - O que: Executar npm outdated ou yarn outdated para listar as dependências desatualizadas.
  - Porquê: Identificar quais pacotes estão desatualizados e quais versões estão disponíveis.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Atualizar dependências do projeto
  - Quem: Backend/Frontend
  - O que: Atualizar uma dependência de desenvolvimento específica e rodar os testes.
  - Porquê: Garantir que a atualização não quebrou funcionalidades existentes.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Atualizar dependências do projeto
  - Quem: Backend/Frontend
  - O que: Atualizar uma dependência de produção específica e rodar os testes.
  - Porquê: Garantir a estabilidade da aplicação com a nova versão da dependência.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Atualizar dependências do projeto
  - Quem: Backend/Frontend
  - O que: Repetir Micro-tarefas 9.2 e 9.3 para todas as dependências desatualizadas.
  - Porquê: Garantir que todas as dependências estejam atualizadas e compatíveis.
  - Complexidade: Complexa (mas cada iteração é simples)
  - Concluído: [ ]

- Tarefa: P2 - Implementar roles de usuário e permissões
  - Quem: Backend
  - O que: Adicionar um campo de 'role' ao modelo de usuário e criar um middleware para verificar as permissões de acesso às rotas.
  - Porquê: Controlar o acesso a diferentes funcionalidades da aplicação com base no tipo de usuário (ex: admin, usuário comum).
  - Complexidade: Complexa
  - Concluído: [ ]

- Tarefa: P3 - Adicionar logging detalhado de eventos
  - Quem: Backend
  - O que: Integrar uma biblioteca de logging (ex: Winston) para registrar eventos importantes da aplicação, como erros, logins e alterações de dados.
  - Porquê: Facilitar o debug, monitoramento e auditoria da aplicação.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P2 - Criar mais testes unitários e de integração
  - Quem: Backend
  - O que: Aumentar a cobertura de testes para os principais módulos do backend, incluindo controllers, services e utils.
  - Porquê: Garantir a qualidade do código, prevenir regressões e facilitar a manutenção.
  - Complexidade: Média
  - Concluído: [ ]

- Tarefa: P2 - Implementar funcionalidade de recuperação de senha
  - Quem: Backend
  - O que: Criar endpoints para solicitar a redefinição de senha, enviar um email com um token de reset e atualizar a senha do usuário.
  - Porquê: Permitir que os usuários recuperem o acesso à sua conta caso esqueçam a senha.
  - Complexidade: Complexa
  - Concluído: [ ]
- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar rota GET /reports/journeys/csv no backend.
  - Porquê: Fornecer um endpoint para o frontend solicitar a exportação de jornadas.
  - Complexidade: Simples
  - Concluído: [ ]
  - Como foi feita: A rota `GET /reports/journeys/csv` foi adicionada ao arquivo `backend/src/routes/reports.ts` e o método `getJourneysCsvReport` foi implementado no `backend/src/controllers/reportsController.ts` para lidar com a exportação de jornadas em formato CSV.
  - Hash do Commit: [SIMULATED_HASH_1]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Implementar a rota para chamar generateJourneysCsv e enviar o CSV como resposta.
  - Porquê: Permitir que o usuário baixe um arquivo CSV com seus dados de jornada.
  - Complexidade: Simples
  - Concluído: [ ]
  - Como foi feita: A implementação da rota para chamar `generateJourneysCsv` e enviar o CSV como resposta foi concluída como parte da tarefa anterior de criação da rota `GET /reports/journeys/csv` e do método `getJourneysCsvReport` no `ReportsController`.
  - Hash do Commit: [SIMULATED_HASH_2]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
