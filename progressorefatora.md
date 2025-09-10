# Guia de Refatoração e Otimização - Projeto GiroPro

Este documento serve como um guia conciso para a refatoração e otimização do projeto GiroPro. Ele detalha o processo de análise de código *realizada pelo Google AI Studio* e as tarefas subsequentes para um agente.

## Instruções

Para continuar o processo de refatoração, siga os passos abaixo:

1.  Identifique o próximo arquivo não marcado na seção "Lista de Arquivos para Análise".
2.  Copie o conteúdo do arquivo correspondente no projeto.
3.  Use o prompt abaixo no Google AI Studio, substituindo `[NOME_DO_ARQUIVO]` e `[TIPO_DE_RECURSO]` pelos valores corretos.
4.  Cole o código do arquivo após o prompt no Google AI Studio.
5.  Receba o feedback da análise.
6.  Com base no feedback do Google AI Studio, adicione as novas tarefas detalhadas ao final deste documento, seguindo o formato das seções de tarefas existentes, tarefas existentes, existentes. Estas tarefas serão executadas posteriormente por um agente.
7.  Marque o arquivo como analisado na lista (ex: `[x]`).

## Prompt para o Google AI Studio

```plaintext
O código abaixo é um arquivo de rotas de: [NOME_DO_ARQUIVO] para um aplicativo de gestão financeira. Ele define rotas para operações CRUD de: [TIPO_DE_RECURSO], todas protegidas por um middleware de autenticação e um rate limiter. Por favor, analise-o e forneça feedback sobre otimização, melhorias de performance, segurança e boas práticas de código, especialmente no contexto de gestão de recursos e proteção de dados. Inclua sugestões de refatoração, se aplicável.
```

## Lista de Arquivos para Análise

### Backend

- [x] `backend/src/app.ts` (Análise concluída)
- [x] `backend/src/routes/auth.ts` (Análise concluída)
- [x] `backend/src/routes/users.ts` (Análise concluída)
- [x] `backend/src/routes/vehicles.ts` (Análise concluída)
- [x] `backend/src/routes/journeys.ts` (Análise concluída)
- [x] `backend/src/routes/fuelings.ts` (Análise concluída)
- [x] `backend/src/routes/expenses.ts`
- [x] `backend/src/controllers/authController.ts` (Análise pendente de feedback do Google AI Studio.)
- [ ] `backend/src/controllers/userController.ts`
- [ ] `backend/src/controllers/vehicleController.ts`
- [ ] `backend/src/controllers/journeyController.ts`
- [ ] `backend/src/controllers/fuelingController.ts`
- [ ] `backend/src/controllers/expenseController.ts`
- [ ] `backend/src/db/initTables.ts`
- [ ] `backend/src/middlewares/errorHandler.ts`
- [ ] `backend/src/middlewares/requestLogger.ts`

### Frontend

- [ ] `frontend/src/App.tsx`
- [ ] `frontend/src/navigation/AppNavigator.tsx`
- [ ] `frontend/src/screens/HomeScreen.tsx`
- [ ] `frontend/src/screens/LoginScreen.tsx`
- [ ] `frontend/src/screens/RegisterScreen.tsx`
- [ ] `frontend/src/components/Button.tsx`
- [ ] `frontend/src/components/Input.tsx`
- [ ] `frontend/src/services/api.ts`
- [ ] `frontend/src/contexts/AuthContext.tsx`

---

## Tarefas Detalhadas para o Agente

As tarefas a seguir são baseadas no feedback do Google AI Studio e devem ser executadas por um agente. Elas são categorizadas por complexidade e impacto.

### Tarefas de Alta Complexidade / Alto Impacto

#### 1. Refatoração do CORS para Produção

**Descrição:** Alterar a configuração do CORS para não usar `origin: "*"` em produção. Isso envolve identificar os domínios de frontend permitidos e configurá-los dinamicamente (via variáveis de ambiente ou arquivo de configuração).
**Localização no Código:** `backend/src/app.ts`
**Detalhes para o Agente:**

*   Identificar os domínios de produção do frontend.
*   Modificar a configuração `cors` em `app.ts` para aceitar uma lista de origens permitidas.
*   Garantir que a lista de origens seja carregada de forma segura (ex: variável de ambiente `CORS_ORIGINS`).
*   Testar a aplicação para garantir que o frontend ainda consiga se comunicar com o backend após a mudança.

#### 2. Implementação de Validação de Entrada (Input Validation)

**Descrição:** Adicionar validação rigorosa para todos os dados de entrada (corpo da requisição, query parameters, path parameters) em todas as rotas da API. Isso é crucial para a segurança e robustez da aplicação.
**Localização no Código:** Rotas e controllers em `backend/src/routes/` e `backend/src/controllers/`
**Detalhes para o Agente:**

*   Escolher uma biblioteca de validação (ex: `joi` ou `yup`).
*   Definir schemas de validação para cada tipo de dado de entrada esperado em cada rota.
*   Implementar a validação nos controllers antes de processar os dados.
*   Garantir que erros de validação retornem respostas HTTP `400 (Bad Request)` com mensagens claras.

#### 3. Otimização do Banco de Dados e Queries

**Descrição:** Analisar e otimizar as operações de banco de dados para melhorar a performance. Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados.
**Localização no Código:** `backend/src/db/` e controllers que interagem com o DB.
**Detalhes para o Agente:**

*   Identificar as queries mais lentas ou mais frequentemente executadas.
*   Analisar o schema do banco de dados para identificar oportunidades de indexação.
*   Otimizar queries existentes ou refatorar a forma como os dados são acessados.
*   Revisar a configuração do banco de dados (se aplicável) para garantir que esteja otimizada para o ambiente de produção.

### Tarefas de Média Complexidade / Médio Impacto

#### 1. Implementação de Compressão (Gzip)

**Descrição:** Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP, melhorando o tempo de carregamento para os clientes.
**Localização no Código:** `backend/src/app.ts`
**Detalhes para o Agente:**

*   Instalar a dependência `compression` (`npm install compression`).
*   Importar e usar o middleware `compression()` em `app.ts` antes da definição das rotas.
*   Testar para garantir que as respostas estão sendo comprimidas corretamente.

#### 2. Implementação de Limitação de Taxa (Rate Limiting)

**Descrição:** Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso, especialmente em endpoints de autenticação.
**Localização no Código:** `backend/src/app.ts` ou rotas específicas.
**Detalhes para o Agente:**

*   Instalar a dependência `express-rate-limit` (`npm install express-rate-limit`).
*   Configurar um rate limiter com `windowMs` e `max` apropriados.
*   Aplicar o rate limiter globalmente (`app.use`) ou em rotas específicas (ex: `/api/v1/auth/login`).
*   Testar o comportamento do rate limiter para garantir que está funcionando conforme o esperado.

#### 3. Centralização de Configurações

**Descrição:** Criar um arquivo `config.ts` para centralizar todas as configurações da aplicação, tornando-as mais fáceis de gerenciar e acessar.
**Localização no Código:** Criar `backend/src/config/config.ts` e refatorar `app.ts`.
**Detalhes para o Agente:**

*   Criar o arquivo `backend/src/config/config.ts`.
*   Mover configurações como `PORT`, `NODE_ENV`, `CORS_ORIGINS`, `JWT_SECRET` (se existirem) para este arquivo.
*   Exportar um objeto `config` com todas as variáveis.
*   Atualizar as referências a essas configurações em `app.ts` e outros arquivos relevantes.

#### 4. Tratamento de Erros Assíncronos em Rotas (Async Handler)

**Descrição:** Implementar um wrapper para lidar com erros em rotas assíncronas, evitando a repetição de blocos `try-catch` e centralizando o tratamento de exceções.
**Localização no Código:** `backend/src/middlewares/errorHandler.ts` e rotas.
**Detalhes para o Agente:**

*   Criar uma função `asyncHandler` que encapsula as funções de rota assíncronas.
*   Essa função deve capturar exceções e passá-las para o middleware de tratamento de erros.
*   Aplicar `asyncHandler` a todas as rotas assíncronas existentes.

### Tarefas de Baixa Complexidade / Baixo Impacto

#### 1. Validação de Variáveis de Ambiente (PORT)

**Descrição:** Adicionar validação para a variável de ambiente `PORT` para garantir que seja um número válido.
**Localização no Código:** `backend/src/app.ts` ou `backend/src/config/config.ts`.
**Detalhes para o Agente:**

*   Verificar se `process.env.PORT` é um número válido.
*   Definir um valor padrão se não for fornecido ou for inválido.
*   Registrar um aviso ou erro se a variável `PORT` for inválida.

#### 2. Organização de Imports

**Descrição:** Padronizar a organização dos imports em todos os arquivos para melhorar a legibilidade e manutenção do código.
**Localização no Código:** Todos os arquivos `.ts` no backend.
**Detalhes para o Agente:**

*   Definir uma ordem padrão para os imports (ex: módulos Node.js, módulos de terceiros, módulos locais).
*   Usar ferramentas de linting (ex: ESLint com plugin `import/order`) para automatizar a organização.
*   Aplicar a organização de imports em todos os arquivos existentes.

#### 3. Remoção/Desabilitação do Endpoint `/api/test` em Produção

**Descrição:** Remover ou desabilitar o endpoint `/api/test` em ambiente de produção para evitar exposição desnecessária de informações.
**Localização no Código:** `backend/src/app.ts` ou `backend/src/routes/`.
**Detalhes para o Agente:**

*   Identificar o endpoint `/api/test`.
*   Implementar uma lógica para que este endpoint só esteja ativo em ambiente de desenvolvimento (`NODE_ENV === \'development\'`).
*   Remover completamente o endpoint se não houver necessidade de mantê-lo nem mesmo em desenvolvimento.

#### 4. Verificação e Uso de `fuelPricesRoutes`

**Descrição:** Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário. Se não for, remover.
**Localização no Código:** `backend/src/app.ts` e `backend/src/routes/fuelPricesRoutes.ts`.
**Detalhes para o Agente:**

*   Analisar o código para determinar se `fuelPricesRoutes` é importado e utilizado em alguma parte da aplicação.
*   Se não for utilizado, remover a importação e o arquivo `fuelPricesRoutes.ts`.
*   Se for utilizado, garantir que está configurado corretamente e que suas rotas estão protegidas.

### Tarefas de Refatoração e Otimização - `backend/src/routes/auth.ts`

#### Tarefas de Alta Complexidade / Alto Impacto

##### 1. Refatoração do `authMiddleware` e Tipagem

**Descrição:** Refatorar o `authMiddleware` para ser mais robusto, com melhor tratamento de erros e tipagem explícita para o `Request` do Express, incluindo as informações do usuário autenticado.
**Localização no Código:** `backend/src/middlewares/authMiddleware.ts` e `backend/src/routes/auth.ts`.
**Detalhes para o Agente:**

*   Criar uma interface para estender o objeto `Request` do Express, adicionando uma propriedade `user` com o tipo de dados do usuário autenticado.
*   Atualizar o `authMiddleware` para usar essa interface e garantir que as informações do usuário sejam corretamente anexadas ao objeto `req`.
*   Implementar tratamento de erros mais detalhado para tokens inválidos ou expirados.

##### 2. Implementação de Validação de Entrada para Rotas de Autenticação

**Descrição:** Adicionar validação rigorosa para os dados de entrada nas rotas de autenticação (registro, login, etc.) para garantir a integridade e segurança dos dados.
**Localização no Código:** `backend/src/routes/auth.ts` e `backend/src/controllers/authController.ts`.
**Detalhes para o Agente:**

*   Definir schemas de validação (ex: com `joi` ou `yup`) para os payloads de registro e login.
*   Aplicar esses schemas como middleware nas rotas `POST /register` e `POST /login`.
*   Garantir que mensagens de erro claras sejam retornadas em caso de falha na validação.

#### Tarefas de Média Complexidade / Médio Impacto

##### 1. Otimização dos Controladores de Autenticação

**Descrição:** Otimizar a lógica dentro dos controladores de autenticação para melhorar a performance e a legibilidade, possivelmente extraindo lógica de negócios para serviços separados.
**Localização no Código:** `backend/src/controllers/authController.ts`.
**Detalhes para o Agente:**

*   Revisar a lógica de registro e login para identificar gargalos ou repetições.
*   Considerar a criação de um serviço de autenticação (`authService.ts`) para encapsular a lógica de negócios (ex: criação de usuário, verificação de senha, geração de token).
*   Garantir que as operações de banco de dados sejam eficientes.

##### 2. Tratamento de Erros Específicos em Controladores de Autenticação

**Descrição:** Implementar tratamento de erros mais específico nos controladores de autenticação, retornando mensagens de erro claras e códigos de status HTTP apropriados para diferentes cenários (ex: usuário já existe, credenciais inválidas).
**Localização no Código:** `backend/src/controllers/authController.ts`.
**Detalhes para o Agente:**

*   Capturar erros específicos (ex: `UserAlreadyExistsError`, `InvalidCredentialsError`).
*   Retornar respostas HTTP com status codes como `409 Conflict` para usuário existente e `401 Unauthorized` para credenciais inválidas.
*   Fornecer mensagens de erro genéricas para falhas de login/registro para evitar vazamento de informações.

#### Tarefas de Baixa Complexidade / Baixo Impacto

##### 1. Geração de Chaves JWT Seguras

**Descrição:** Garantir que a chave secreta JWT seja gerada de forma segura e armazenada corretamente (ex: em variáveis de ambiente).
**Localização no Código:** `backend/src/config/config.ts` ou onde a chave JWT é acessada.
**Detalhes para o Agente:**

*   Verificar se a chave JWT está sendo carregada de uma variável de ambiente (`process.env.JWT_SECRET`).
*   Recomendar o uso de uma chave com comprimento adequado e gerada criptograficamente segura.
*   Adicionar um aviso ou erro se a chave não for segura ou não estiver configurada.

##### 2. Revisão do Endpoint `/me`

**Descrição:** Revisar o endpoint `/me` para garantir que ele retorne apenas as informações necessárias do usuário autenticado, evitando exposição de dados sensíveis.
**Localização no Código:** `backend/src/routes/auth.ts` e `backend/src/controllers/authController.ts`.
**Detalhes para o Agente:**

*   Verificar quais dados do objeto `user` estão sendo retornados pelo endpoint `/me`.
*   Filtrar quaisquer dados sensíveis (ex: senhas hash, tokens de sessão) antes de enviar a resposta.
*   Garantir que apenas informações públicas ou necessárias para o frontend sejam expostas.

##### 3. Mensagens de Erro Genéricas para Login/Registro

**Descrição:** Assegurar que as mensagens de erro para falhas de login e registro sejam genéricas para evitar a enumeração de usuários ou outras vulnerabilidades de segurança.
**Localização no Código:** `backend/src/controllers/authController.ts`.
**Detalhes para o Agente:**

*   Revisar as mensagens de erro retornadas para falhas de login e registro.
*   Garantir que mensagens como "Usuário não encontrado" ou "Senha incorreta" sejam substituídas por uma mensagem genérica como "Credenciais inválidas".

### Tarefas de Refatoração e Otimização - `backend/src/routes/users.ts`

#### Tarefas de Alta Complexidade / Alto Impacto

##### 1. Criação e Implementação de `UserController`

**Descrição:** Criar um `UserController` para encapsular a lógica de negócios relacionada aos usuários, separando-a das rotas.
**Localização no Código:** `backend/src/controllers/userController.ts` e `backend/src/routes/users.ts`.
**Detalhes para o Agente:**

*   Criar o arquivo `backend/src/controllers/userController.ts`.
*   Mover a lógica de manipulação de usuários das rotas para métodos dentro do `UserController`.
*   Atualizar as rotas em `backend/src/routes/users.ts` para chamar os métodos apropriados do `UserController`.

##### 2. Implementação de Validação de Entrada para `PUT /profile`

**Descrição:** Adicionar validação rigorosa para os dados de entrada na rota `PUT /profile` para garantir a integridade e segurança dos dados do perfil do usuário.
**Localização no Código:** `backend/src/routes/users.ts` e `backend/src/controllers/userController.ts`.
**Detalhes para o Agente:**

*   Definir um schema de validação para o payload de atualização de perfil.
*   Aplicar esse schema como middleware na rota `PUT /profile`.
*   Garantir que mensagens de erro claras sejam retornadas em caso de falha na validação.

#### Tarefas de Média Complexidade / Médio Impacto

##### 1. Otimização dos Controladores de Usuário

**Descrição:** Otimizar a lógica dentro dos controladores de usuário para melhorar a performance e a legibilidade, possivelmente extraindo lógica de negócios para serviços separados.
**Localização no Código:** `backend/src/controllers/userController.ts`.
**Detalhes para o Agente:**

*   Revisar a lógica de busca e atualização de perfil para identificar gargalos ou repetições.
*   Considerar a criação de um serviço de usuário (`userService.ts`) para encapsular a lógica de negócios (ex: busca de usuário, atualização de dados).
*   Garantir que as operações de banco de dados sejam eficientes.

##### 2. Implementação de Autorização (RBAC) para Rotas de Usuário (Futuro)

**Descrição:** Considerar a implementação de um sistema de controle de acesso baseado em roles (RBAC) se houver diferentes tipos de usuários com permissões distintas (ex: admin vs. motorista).
**Localização no Código:** `backend/src/routes/users.ts` e novos middlewares de autorização.
**Detalhes para o Agente:**

*   Avaliar a necessidade de diferentes roles de usuário.
*   Se necessário, criar um middleware de autorização que verifica a role do usuário autenticado.
*   Aplicar este middleware a rotas que exigem permissões específicas (ex: `GET /api/v1/users/:id` para administradores).

### Tarefas de Baixa Complexidade / Baixo Impacto

##### 1. Filtragem de Dados Sensíveis no Retorno do Perfil

**Descrição:** Garantir que a rota `GET /api/v1/users/profile` retorne apenas os dados do perfil que o usuário tem permissão para ver, excluindo informações sensíveis como senhas hashed ou chaves internas.
**Localização no Código:** `backend/src/controllers/userController.ts` (método `getProfile`).
**Detalhes para o Agente:**

*   Revisar o método `getProfile` para filtrar explicitamente campos sensíveis antes de enviar a resposta ao cliente.
*   Considerar o uso de projeções no ORM/ODM para excluir campos sensíveis diretamente na consulta ao banco de dados.

##### 2. Garantia de Identidade do Usuário na Atualização

**Descrição:** Assegurar que o usuário que está tentando acessar ou modificar o perfil é o mesmo usuário cujo ID está no token de autenticação.
**Localização no Código:** `backend/src/controllers/userController.ts` (método `updateProfile`).
**Detalhes para o Agente:**

*   No método `updateProfile`, comparar o ID do usuário extraído do token (`req.user.id`) com o ID do perfil que está sendo solicitado para atualização (se aplicável).
*   Retornar um erro `403 Forbidden` se o usuário tentar modificar um perfil que não lhe pertence.

### Tarefas de Refatoração e Otimização - `backend/src/routes/vehicles.ts`

#### Tarefas de Alta Complexidade / Alto Impacto

##### 1. Implementação de Validação de Entrada para Rotas de Veículos

**Descrição:** Adicionar validação rigorosa para os dados de entrada nas rotas de veículos (criação e atualização) para garantir a integridade e segurança dos dados.
**Localização no Código:** `backend/src/routes/vehicles.ts` e `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   Definir schemas de validação (ex: com `joi` ou `yup`) para os payloads de criação e atualização de veículos.
*   Aplicar esses schemas como middleware nas rotas `POST /vehicles` e `PUT /vehicles/:id`.
*   Garantir que mensagens de erro claras sejam retornadas em caso de falha na validação.

##### 2. Otimização das Operações CRUD de Veículos

**Descrição:** Otimizar a lógica dentro dos controladores de veículos para melhorar a performance das operações CRUD, especialmente em relação às interações com o banco de dados.
**Localização no Código:** `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   Revisar as queries de banco de dados para `getAll`, `create`, `getById`, `update` e `delete`.
*   Garantir o uso eficiente de índices e evitar N+1 queries.
*   Considerar a paginação para `getAll` se a quantidade de veículos puder ser grande.

### Tarefas de Média Complexidade / Médio Impacto

##### 1. Tratamento de Erros Específicos em Controladores de Veículos

**Descrição:** Implementar tratamento de erros mais específico nos controladores de veículos, retornando mensagens de erro claras e códigos de status HTTP apropriados para diferentes cenários (ex: veículo não encontrado, dados inválidos).
**Localização no Código:** `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   Capturar erros específicos (ex: `VehicleNotFoundException`, `InvalidVehicleDataException`).
*   Retornar respostas HTTP com status codes como `404 Not Found` para veículos não encontrados e `400 Bad Request` para dados inválidos.
*   Fornecer mensagens de erro genéricas para o cliente em produção.

##### 2. Garantia de Propriedade do Veículo

**Descrição:** Assegurar que um usuário só possa acessar, criar, atualizar ou deletar veículos que realmente pertencem a ele.
**Localização no Código:** `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   No `authMiddleware`, garantir que o ID do usuário autenticado esteja disponível em `req.user.id`.
*   Em cada método do `VehiclesController` (exceto `create`), verificar se o `userId` do veículo corresponde ao `req.user.id`.
*   Retornar um erro `403 Forbidden` se o usuário tentar acessar ou modificar um veículo que não lhe pertence.

### Tarefas de Baixa Complexidade / Baixo Impacto

##### 1. Refatoração de Mensagens de Resposta

**Descrição:** Padronizar as mensagens de resposta da API para as operações de veículos, tornando-as mais consistentes e informativas.
**Localização no Código:** `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   Revisar as mensagens de sucesso e erro retornadas pelos métodos do `VehiclesController`.
*   Garantir que as mensagens sejam claras, concisas e sigam um padrão.

##### 2. Documentação de Rotas de Veículos

**Descrição:** Adicionar comentários JSDoc ou usar uma ferramenta como Swagger/OpenAPI para documentar as rotas de veículos, seus parâmetros, e respostas esperadas.
**Localização no Código:** `backend/src/routes/vehicles.ts` e `backend/src/controllers/vehiclesController.ts`.
**Detalhes para o Agente:**

*   Adicionar comentários JSDoc para cada rota e método do controller, descrevendo sua funcionalidade, parâmetros de entrada e estrutura de resposta.
*   Considerar a integração com uma ferramenta de documentação automática (ex: Swagger) para gerar uma documentação interativa da API.





