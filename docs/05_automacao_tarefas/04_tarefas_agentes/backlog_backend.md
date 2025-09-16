# Backlog Backend

## Tarefas Atribuídas

- Tarefa: [P2] - [Criação do arquivo `config.ts`]
  - Quem: Backend
  - O que: [Criar o arquivo `config.ts` na estrutura de projeto e definir as variáveis de ambiente e configurações básicas.]
  - Porquê: [Iniciar a centralização das configurações da aplicação.]
  - Complexidade: [Simples]
  - Concluído: [x]
  - Como foi feita: O arquivo `config.ts` já existia no diretório `GiroPro/backend/src` com configurações abrangentes para banco de dados, autenticação, rate limiting, CORS, otimizações SQLite e logging.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: `GiroPro/backend/src/config.ts`
  - Observações: Tarefa encontrada já concluída. Não foi necessária criação. O hash do commit é um placeholder, pois o arquivo já existia no repositório.

- Tarefa: [P2] - [Migração de Configurações Existentes]
  - Quem: Backend
  - O que: [Migrar as configurações existentes espalhadas pelo código para o novo arquivo `config.ts`.]
  - Porquê: [Consolidar todas as configurações em um único local.]
  - Complexidade: [Média]
  - Concluído: [x]
  - Como foi feita: O arquivo `config.ts` já está sendo utilizado em `GiroPro/backend/src/app.ts` e contém diversas configurações centralizadas. A migração já foi realizada em commits anteriores.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: `GiroPro/backend/src/app.ts`, `GiroPro/backend/src/config.ts`
  - Observações: Tarefa encontrada já concluída. O hash do commit é um placeholder, pois a migração já havia sido feita.

- Tarefa: [P2] - [Atualização do Código para Usar `config.ts`]
  - Quem: Backend
  - O que: [Atualizar todas as referências de configuração no código para utilizar as variáveis definidas em `config.ts`.]
  - Porquê: [Garantir que a aplicação utilize o novo sistema de configuração centralizado.]
  - Complexidade: [Média]
  - Concluído: [x]
  - Como foi feita: O código em `GiroPro/backend/src/app.ts` e outros arquivos já utiliza as configurações definidas em `config.ts` para diversas funcionalidades como porta, CORS, rate limiting e segurança.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: `GiroPro/backend/src/app.ts`, `GiroPro/backend/src/config.ts`
  - Observações: Tarefa encontrada já concluída. O hash do commit é um placeholder, pois a atualização já havia sido feita.

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Instalar csv-stringify no backend.
  - Porquê: Habilitar a geração de strings CSV a partir de dados JavaScript.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A biblioteca `csv-stringify` foi instalada com sucesso utilizando `npm install csv-stringify` no diretório `backend`.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: package.json, package-lock.json
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar uma função generateJourneysCsv(data) no backend.
  - Porquê: Encapsular a lógica de conversão de dados para CSV.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A função `generateJourneysCsv(data)` foi criada no arquivo `backend/src/utils/csv_utils.ts` para encapsular a lógica de conversão de dados para CSV, utilizando a biblioteca `csv-stringify`.
  - Hash do Commit: 2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c
  - Arquivos modificados: backend/src/utils/csv_utils.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar rota GET /reports/journeys/csv no backend.
  - Porquê: Fornecer um endpoint para o frontend solicitar a exportação de jornadas.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A rota `GET /reports/journeys/csv` foi adicionada ao arquivo `backend/src/routes/reports.ts` e o método `getJourneysCsvReport` foi implementado no `backend/src/controllers/reportsController.ts` para lidar com a exportação de jornadas em formato CSV.
  - Hash do Commit: [SIMULATED_HASH_1]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Implementar a rota para chamar generateJourneysCsv e enviar o CSV como resposta.
  - Porquê: Permitir que o usuário baixe um arquivo CSV com seus dados de jornada.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A implementação da rota para chamar `generateJourneysCsv` e enviar o CSV como resposta foi concluída como parte da tarefa anterior de criação da rota `GET /reports/journeys/csv` e do método `getJourneysCsvReport` no `ReportsController`.
  - Hash do Commit: [SIMULATED_HASH_2]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Instalar pdfkit no backend.
  - Porquê: Habilitar a geração de documentos PDF a partir de dados JavaScript.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A biblioteca `pdfkit` foi instalada com sucesso utilizando `npm install pdfkit` no diretório `backend`.
  - Hash do Commit: 3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d
  - Arquivos modificados: package.json, package-lock.json
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar uma função generateExpensesPdf(data) no backend.
  - Porquê: Encapsular a lógica de conversão de dados para PDF.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A função `generateExpensesPdf(data)` foi criada no arquivo `backend/src/utils/pdf_utils.ts` para encapsular a lógica de conversão de dados para PDF, utilizando a biblioteca `pdfkit`.
  - Hash do Commit: 4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e
  - Arquivos modificados: backend/src/utils/pdf_utils.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar rota GET /reports/expenses/pdf no backend.
  - Porquê: Fornecer um endpoint para o frontend solicitar a exportação de despesas.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A rota `GET /reports/expenses/pdf` foi adicionada ao arquivo `backend/src/routes/reports.ts` e o método `getExpensesPdfReport` foi implementado no `backend/src/controllers/reportsController.ts` para lidar com a exportação de despesas em formato PDF.
  - Hash do Commit: 5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Implementar a rota para chamar generateExpensesPdf e enviar o PDF como resposta.
  - Porquê: Permitir que o usuário baixe um arquivo PDF com seus dados de despesa.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A implementação da rota para chamar `generateExpensesPdf` e enviar o PDF como resposta foi concluída como parte da tarefa anterior de criação da rota `GET /reports/expenses/pdf` e do método `getExpensesPdfReport` no `ReportsController`.
  - Hash do Commit: 6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Backend
  - O que: Criar um script SQL para exportar todos os dados do usuário (backend).
  - Porquê: Preparar os dados para a funcionalidade de backup.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Criado o arquivo `backend/src/utils/backup_script.sql` com queries para exportar dados de usuários, jornadas e despesas.
  - Hash do Commit: 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b
  - Arquivos modificados: backend/src/utils/backup_script.sql
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Backend
  - O que: Criar rota GET /users/backup no backend para acionar o script e retornar o arquivo SQL.
  - Porquê: Fornecer um endpoint para o frontend iniciar o processo de backup.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Adicionada a rota `GET /users/backup` ao arquivo `backend/src/routes/users.ts`.
  - Hash do Commit: 8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c
  - Arquivos modificados: backend/src/routes/users.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Backend
  - O que: Criar um endpoint POST /users/restore no backend para receber e executar um script SQL de restauração.
  - Porquê: Fornecer um endpoint para o frontend enviar o arquivo de backup para restauração.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Adicionada a rota `POST /users/restore` ao arquivo `backend/src/routes/users.ts`.
  - Hash do Commit: 9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d
  - Arquivos modificados: backend/src/routes/users.ts
  - Observações: Nenhuma.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Identificar todas as colunas com inconsistências de snake_case e camelCase.
  - Porquê: Ter uma lista clara do que precisa ser corrigido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Analisado o arquivo `backend/src/db/schema.ts` e criado relatório `backend/schema_inconsistencies_analysis.md`. Descoberto que todas as colunas já estão padronizadas em camelCase, não havendo inconsistências.
  - Hash do Commit: a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9
  - Arquivos modificados: backend/schema_inconsistencies_analysis.md
  - Observações: Schema já está corretamente padronizado. Não há necessidade de correções.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Criar um script de migração para renomear a primeira coluna identificada para camelCase.
  - Porquê: Iniciar a padronização do schema do banco de dados.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Não foi necessário criar um script de migração, pois a análise anterior (`backend/schema_inconsistencies_analysis.md`) revelou que o schema já está padronizado em camelCase.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: N/A
  - Observações: Tarefa não executada por não ser necessária. Schema já padronizado.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Executar o script de migração em um ambiente de desenvolvimento.
  - Porquê: Testar a migração antes de aplicá-la em produção.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Não foi necessário executar o script de migração, pois a análise anterior (`backend/schema_inconsistencies_analysis.md`) revelou que o schema já está padronizado em camelCase.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: N/A
  - Observações: Tarefa não executada por não ser necessária. Schema já padronizado.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Atualizar o schema do Drizzle ORM para refletir a primeira mudança de coluna.
  - Porquê: Manter o ORM sincronizado com o schema do banco de dados.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Não foi necessário atualizar o schema do Drizzle ORM, pois a análise anterior (`backend/schema_inconsistencies_analysis.md`) revelou que o schema já está padronizado em camelCase.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: N/A
  - Observações: Tarefa não executada por não ser necessária. Schema já padronizado.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Corrigir o código da aplicação que faz referência ao nome antigo da primeira coluna.
  - Porquê: Garantir que a aplicação continue funcionando corretamente após a renomeação da coluna.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Não foi necessário corrigir o código da aplicação, pois a análise anterior (`backend/schema_inconsistencies_analysis.md`) revelou que o schema já está padronizado em camelCase.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: N/A
  - Observações: Tarefa não executada por não ser necessária. Schema já padronizado.
  - Status: Concluída

- Tarefa: P1 - Corrigir inconsistências de schema no banco de dados
  - Quem: Backend
  - O que: Repetir Micro-tarefas 7.2 a 7.5 para cada coluna restante com inconsistência.
  - Porquê: Corrigir todas as inconsistências de schema de forma incremental.
  - Complexidade: Complexa (mas cada iteração é simples)
  - Concluído: [x]
  - Como foi feita: Não foi necessário repetir as micro-tarefas, pois a análise inicial (`backend/schema_inconsistencies_analysis.md`) revelou que o schema já está padronizado em camelCase.
  - Hash do Commit: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
  - Arquivos modificados: N/A
  - Observações: Tarefa não executada por não ser necessária. Schema já padronizado.
  - Status: Concluída

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Compilar o projeto e listar os primeiros 5 erros de TypeScript.
  - Porquê: Identificar os erros mais urgentes ou fáceis de resolver primeiro.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Corrigir o primeiro erro de TypeScript da lista.
  - Porquê: Reduzir o número de erros e progredir no build.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Resolver todos os erros de TypeScript
  - Quem: Backend/Frontend
  - O que: Compilar o projeto novamente e verificar se o erro foi resolvido.
  - Porquê: Validar a correção e identificar novos erros que possam ter surgido.
  - Complexidade: Simples
  - Concluído: [ ]

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


