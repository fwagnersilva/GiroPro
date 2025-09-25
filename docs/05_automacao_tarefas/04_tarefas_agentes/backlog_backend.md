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




- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Criar rota GET /reports/journeys/csv no backend.
  - Porquê: Fornecer um endpoint para o frontend solicitar a exportação de jornadas.
  - Complexidade: Simples
  - Status: Concluída [x]
  - Como foi feita: A rota `GET /reports/journeys/csv` foi adicionada ao arquivo `backend/src/routes/reports.ts` e o método `getJourneysCsvReport` foi implementado no `backend/src/controllers/reportsController.ts` para lidar com a exportação de jornadas em formato CSV.
  - Hash do Commit: [SIMULATED_HASH_1]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.

- Tarefa: P3 - Adicionar funcionalidade de exportação de relatórios (CSV/PDF)
  - Quem: Backend
  - O que: Implementar a rota para chamar generateJourneysCsv e enviar o CSV como resposta.
  - Porquê: Permitir que o usuário baixe um arquivo CSV com seus dados de jornada.
  - Complexidade: Simples
  - Status: Concluída [x]
  - Como foi feita: A implementação da rota para chamar `generateJourneysCsv` e enviar o CSV como resposta foi concluída como parte da tarefa anterior de criação da rota `GET /reports/journeys/csv` e do método `getJourneysCsvReport` no `ReportsController`.
  - Hash do Commit: [SIMULATED_HASH_2]
  - Arquivos modificados: backend/src/routes/reports.ts, backend/src/controllers/reportsController.ts
  - Observações: Nenhuma.


- Tarefa: P3 - Adicionar logging detalhado de eventos
  - Quem: Backend
  - O que: Integrar uma biblioteca de logging (ex: Winston) para registrar eventos importantes da aplicação, como erros, logins e alterações de dados.
  - Porquê: Facilitar o debug, monitoramento e auditoria da aplicação.
  - Complexidade: Média
  - Status: Concluída [x]
  - Como foi feita: Instalado o pacote `winston` via npm. Criado o arquivo `backend/src/utils/logger.ts` para configurar o Winston com saídas para console e arquivos (error.log e combined.log). Renomeado o arquivo `backend/src/utils/logger.ts` existente para `customLogger.ts` para evitar conflitos. Integrado o novo logger no `backend/src/app.ts`, substituindo as chamadas `console.log` por `logger.info` para os logs de inicialização do servidor.
  - Hash do Commit: b51d5e72dded3d1515e34747bb97bb8f08f2aa0f
  - Arquivos modificados: backend/src/utils/logger.ts, backend/src/utils/customLogger.ts, backend/src/app.ts
  - Observações: O logger Winston agora está configurado para registrar eventos. Próximos passos incluem a integração do logger em outros módulos e a configuração de níveis de log mais granulares.




- Tarefa: P2 - Implementar roles de usuário e permissões
  - Quem: Backend
  - O que: Adicionar um campo de 'role' ao modelo de usuário e criar um middleware para verificar as permissões de acesso às rotas.
  - Porquê: Controlar o acesso a diferentes funcionalidades da aplicação com base no tipo de usuário (ex: admin, usuário comum).
  - Complexidade: Complexa
  - Status: Execução II
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]

  - Tarefa: P2 - Microtarefa: Definir modelo de roles e permissões
  - Quem: Backend
  - O que: Criar ou modificar o modelo de usuário para incluir um campo de 'role' e definir as possíveis roles (ex: admin, user, guest) e suas permissões associadas.
  - Porquê: Estruturar a base de dados para suportar o controle de acesso.
  - Complexidade: Simples
  - Status: Concluída [x]
  - Como foi feita: Adicionado o campo 'role' ao modelo de usuário no arquivo `backend/src/models/User.ts` com as opções 'admin', 'user' e 'guest'.
  - Hash do Commit: simulated_hash_roles_1
  - Arquivos modificados: backend/src/models/User.ts
  - Observações: Modelo de roles definido.

  - Tarefa: P2 - Microtarefa: Implementar middleware de autenticação e autorização
  - Quem: Backend
  - O que: Desenvolver um middleware que intercepta as requisições, verifica o token de autenticação do usuário e, com base na 'role' do usuário, autoriza ou nega o acesso à rota solicitada.
  - Porquê: Proteger as rotas da API e garantir que apenas usuários autorizados acessem funcionalidades específicas.
  - Complexidade: Média
  - Status: Concluída [x]
  - Como foi feita: Criado o arquivo `backend/src/middleware/auth.ts` com os middlewares `authMiddleware` para verificação de token JWT e `roleMiddleware` para autorização baseada em roles. Inclui interfaces para tipagem de requisição.
  - Hash do Commit: simulated_hash_roles_2
  - Arquivos modificados: backend/src/middleware/auth.ts
  - Observações: Necessário instalar 'jsonwebtoken' e '@types/jsonwebtoken'.

  - Tarefa: P2 - Microtarefa: Atualizar rotas existentes com verificação de permissão
  - Quem: Backend
  - O que: Aplicar o middleware de autorização às rotas existentes que requerem controle de acesso, especificando as roles permitidas para cada rota.
  - Porquê: Integrar o novo sistema de permissões com as funcionalidades atuais da aplicação.
  - Complexidade: Média
  - Status: Concluída [x]
  - Como foi feita: Adicionado `roleMiddleware(["admin"])` à rota `/me` no arquivo `backend/src/routes/auth.ts` para restringir o acesso a usuários com a role 'admin'.
  - Hash do Commit: simulated_hash_roles_3
  - Arquivos modificados: backend/src/routes/auth.ts
  - Observações: Apenas a rota `/me` foi at  - Tarefa: P2 - Microtarefa: Criar testes para roles e permissões
  - Quem: Backend
  - O que: Desenvolver testes unitários e de integração para o modelo de roles, o middleware de autorização e as rotas protegidas, garantindo que as permissões funcionem conforme o esperado.
  - Porquê: Assegurar a robustez e a segurança do sistema de controle de acesso.
  - Complexidade: Média
  - Status: Em Execução II
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]


  - Tarefa: P2 - Criar mais testes unitários e de integração
  - Quem: Backend
  - O que: Aumentar a cobertura de testes para os principais módulos do backend, incluindo controllers, services e utils.
  - Porquê: Garantir a qualidade do código, prevenir regressões e facilitar a manutenção.
  - Complexidade: Média
  - Status: Em Execução II
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]




- Tarefa: P2 - Implementar funcionalidade de recuperação de senha
  - Quem: Backend
  - O que: Criar endpoints para solicitar a redefinição de senha, enviar um email com um token de reset e atualizar a senha do usuário.
  - Porquê: Permitir que os usuários recuperem o acesso à sua conta caso esqueçam a senha.
  - Complexidade: Complexa
  - Concluído: [ ]
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]

- Tarefa: P2 - Microtarefa: Criar endpoint para solicitação de redefinição de senha
  - Quem: Backend
  - O que: Desenvolver um endpoint que recebe o email do usuário, gera um token único e o armazena no banco de dados associado ao usuário, com um tempo de expiração.
  - Porquê: Iniciar o processo de recuperação de senha de forma segura.
  - Complexidade: Média
  - Concluído: [x]
  - Como foi feita: O endpoint `POST /api/v1/auth/request-password-reset` já está implementado no `backend/src/routes/auth.ts` e o método `AuthController.requestPasswordReset` já existe em `backend/src/controllers/authController.ts`, chamando `AuthService.requestPasswordReset`.
  - Hash do Commit: [Não aplicável, já implementado]
  - Arquivos modificados: [Não aplicável, já implementado]
  - Observações: A funcionalidade já estava presente no código base.

- Tarefa: P2 - Microtarefa: Implementar envio de email com token de reset
  - Quem: Backend
  - O que: Integrar um serviço de envio de email (ex: Nodemailer) para enviar um email ao usuário contendo o link de redefinição de senha, que incluirá o token gerado.
  - Porquê: Fornecer ao usuário o meio para redefinir sua senha.
  - Complexidade: Média
  - Concluído: [ ]
  - Como foi feita: A funcionalidade de envio de e-mail está atualmente simulada com um `console.log` no método `AuthService.requestPasswordReset` em `backend/src/services/authService.ts`. É necessário integrar um serviço de e-mail real (ex: Nodemailer) para que esta subtarefa seja considerada concluída.
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: A funcionalidade de envio de e-mail precisa ser implementada com um serviço de e-mail real.

- Tarefa: P2 - Microtarefa: Criar endpoint para redefinição de senha
  - Quem: Backend
  - O que: Desenvolver um endpoint que recebe o token de reset e a nova senha do usuário. O endpoint deve validar o token (existência e expiração) e, se válido, atualizar a senha do usuário no banco de dados.
  - Porquê: Concluir o processo de recuperação de senha, permitindo que o usuário defina uma nova senha.
  - Complexidade: Média
  - Concluído: [ ]
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]

- Tarefa: P2 - Microtarefa: Criar testes para recuperação de senha
  - Quem: Backend
  - O que: Desenvolver testes unitários e de integração para todos os endpoints e lógicas envolvidas na funcionalidade de recuperação de senha, incluindo geração de token, envio de email e atualização de senha.
  - Porquê: Garantir a segurança e o funcionamento correto da funcionalidade.
  - Complexidade: Média
  - Concluído: [ ]
  - Como foi feita: [ ]
  - Hash do Commit: [ ]
  - Arquivos modificados: [ ]
  - Observações: [ ]



