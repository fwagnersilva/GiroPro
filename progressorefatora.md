# Guia de Refatoração e Otimização - Projeto GiroPro

Este documento serve como um guia conciso para a refatoração e otimização do projeto GiroPro. Ele detalha o processo de análise de código *realizada pelo Google AI Studio* e as tarefas subsequentes para um agente.

## Fluxo de Trabalho para Análise e Refatoração

Este documento guia o processo de análise de código com o Google AI Studio e a subsequente organização de tarefas de refatoração. Siga este fluxo de trabalho para garantir consistência e eficiência.

**Seu Papel (Usuário):**

1.  **Inicie o processo:** Simplesmente me diga para "continuar o trabalho no `progressorefatora.md`" ou algo semelhante.
2.  **Use o prompt:** Copie o prompt completo que eu fornecer e cole-o no Google AI Studio.
3.  **Forneça o feedback:** Copie o resultado completo do Google AI Studio e cole-o de volta para mim.

**Meu Papel (Manus):**

1.  **Identificar o próximo arquivo:** Eu lerei este arquivo para encontrar o próximo item na "Lista de Arquivos para Análise" que ainda não foi concluído.
2.  **Gerar o prompt completo:** Eu lerei o conteúdo do arquivo a ser analisado e criarei um prompt detalhado para você usar no Google AI Studio. Este prompt incluirá:
    *   Instruções claras para a IA.
    *   O conteúdo completo do arquivo a ser analisado.
    *   A exigência de que o feedback siga a estrutura de tarefas (Alta, Média, Baixa complexidade) e inclua uma contagem de tarefas.
3.  **Aguardar seu feedback:** Ficarei aguardando você me enviar a análise gerada pelo Google AI Studio.
4.  **Processar o feedback:** Ao receber o feedback, eu irei:
    *   Adicionar as novas tarefas de refatoração neste documento, sob a categoria apropriada.
    *   Atualizar a "Lista de Arquivos para Análise", marcando o arquivo como `(Análise concluída)`.
    *   Confirmar o número de tarefas adicionadas em cada categoria.

## Prompt para o Google AI Studio

```plaintext
O código abaixo é um arquivo de rotas de: [NOME_DO_ARQUIVO] para um aplicativo de gestão financeira. Ele define rotas para operações CRUD de: [TIPO_DE_RECURSO], todas protegidas por um middleware de autenticação e um rate limiter. Por favor, analise-o e forneça feedback sobre otimização, melhorias de performance, segurança e boas práticas de código, especialmente no contexto de gestão de recursos e proteção de dados. Inclua sugestões de refatoração, se aplicável.
```

## Lista de Arquivos para Análise no Google AI Studio

Esta seção serve como um guia para a análise de arquivos do projeto GiroPro no Google AI Studio. O objetivo é coletar feedback sobre cada arquivo e, a partir dele, criar tarefas de refatoração e otimização.

### Backend

*   `backend/src/app.ts` (Análise concluída)
*   `backend/src/routes/auth.ts` (Análise concluída)
*   `backend/src/routes/users.ts` (Análise concluída)
*   `backend/src/routes/vehicles.ts` (Análise concluída)
*   `backend/src/routes/journeys.ts` (Análise concluída)
*   `backend/src/routes/fuelings.ts` (Análise concluída)
*   `backend/src/routes/expenses.ts` (Análise concluída)
*   `backend/src/controllers/authController.ts` (Análise concluída)
*   `backend/src/controllers/userController.ts`
*   `backend/src/controllers/vehicleController.ts`
*   `backend/src/controllers/journeyController.ts`
*   `backend/src/controllers/fuelingController.ts`
*   `backend/src/controllers/expenseController.ts`
*   `backend/src/db/initTables.ts`
*   `backend/src/middlewares/errorHandler.ts`
*   `backend/src/middlewares/requestLogger.ts`

### Frontend

*   `frontend/src/App.tsx`
*   `frontend/src/navigation/AppNavigator.tsx`
*   `frontend/src/screens/HomeScreen.tsx`
*   `frontend/src/screens/LoginScreen.tsx`
*   `frontend/src/screens/RegisterScreen.tsx`
*   `frontend/src/components/Button.tsx`
*   `frontend/src/components/Input.tsx`
*   `frontend/src/services/api.ts`
*   `frontend/src/contexts/AuthContext.tsx`

Este documento detalha as tarefas de refatoração e otimização para o projeto GiroPro, baseadas no feedback do Google AI Studio. As tarefas são categorizadas por complexidade e impacto, e são destinadas a serem executadas por um agente em um momento posterior.

## Tarefas de Refatoração e Otimização - Geral

### Tarefas de Alta Complexidade / Alto Impacto

1.  **Refatoração do CORS para Produção**
    *   **Descrição:** Alterar a configuração do CORS para não usar `origin: "*"` em produção. Isso envolve identificar os domínios de frontend permitidos e configurá-los dinamicamente (via variáveis de ambiente ou arquivo de configuração).
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Identificar os domínios de produção do frontend.
        *   Modificar a configuração `cors` em `app.ts` para aceitar uma lista de origens permitidas.
        *   Garantir que a lista de origens seja carregada de forma segura (ex: variável de ambiente `CORS_ORIGINS`).
        *   Testar a aplicação para garantir que o frontend ainda consiga se comunicar com o backend após a mudança.

2.  **Implementação de Validação de Entrada (Input Validation)**
    *   **Descrição:** Adicionar validação rigorosa para todos os dados de entrada (corpo da requisição, query parameters, path parameters) em todas as rotas da API. Isso é crucial para a segurança e robustez da aplicação.
    *   **Localização no Código:** Rotas e controllers em `backend/src/routes/` e `backend/src/controllers/`
    *   **Detalhes para o Agente:**
        *   Escolher uma biblioteca de validação (ex: `joi` ou `yup`).
        *   Definir schemas de validação para cada tipo de dado de entrada esperado em cada rota.
        *   Implementar a validação nos controllers antes de processar os dados.
        *   Garantir que erros de validação retornem respostas HTTP 400 (Bad Request) com mensagens claras.

3.  **Otimização do Banco de Dados e Queries**
    *   **Descrição:** Analisar e otimizar as operações de banco de dados para melhorar a performance. Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados.
    *   **Localização no Código:** `backend/src/db/` e controllers que interagem com o DB.
    *   **Detalhes para o Agente:**
        *   Identificar as queries mais lentas ou mais frequentemente executadas.
        *   Analisar o schema do banco de dados para identificar oportunidades de indexação.
        *   Otimizar queries existentes ou refatorar a forma como os dados são acessados.
        *   Revisar a configuração do banco de dados (se aplicável) para garantir que esteja otimizada para o ambiente de produção.

### Tarefas de Média Complexidade / Médio Impacto

1.  **Implementação de Compressão (Gzip)**
    *   **Descrição:** Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP, melhorando o tempo de carregamento para os clientes.
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Instalar a dependência `compression` (`npm install compression`).
        *   Importar e usar o middleware `compression()` em `app.ts` antes da definição das rotas.
        *   Testar para garantir que as respostas estão sendo comprimidas corretamente.

2.  **Implementação de Limitação de Taxa (Rate Limiting)**
    *   **Descrição:** Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso, especialmente em endpoints de autenticação.
    *   **Localização no Código:** `backend/src/app.ts` ou rotas específicas.
    *   **Detalhes para o Agente:**
        *   Instalar a dependência `express-rate-limit` (`npm install express-rate-limit`).
        *   Configurar um rate limiter com `windowMs` e `max` apropriados.
        *   Aplicar o rate limiter globalmente (`app.use`) ou em rotas específicas (ex: `/api/v1/auth/login`).
        *   Testar o comportamento do rate limiter para garantir que está funcionando conforme o esperado.

3.  **Centralização de Configurações**
    *   **Descrição:** Criar um arquivo `config.ts` para centralizar todas as configurações da aplicação, tornando-as mais fáceis de gerenciar e acessar.
    *   **Localização no Código:** Criar `backend/src/config/config.ts` e refatorar `app.ts`.
    *   **Detalhes para o Agente:**
        *   Criar o arquivo `backend/src/config/config.ts`.
        *   Mover configurações como `PORT`, `NODE_ENV`, `CORS_ORIGINS`, `JWT_SECRET` (se existirem) para este arquivo.
        *   Exportar um objeto `config` com todas as variáveis.
        *   Atualizar `app.ts` e outros arquivos que usam essas variáveis para importá-las do novo arquivo de configuração.

4.  **Tratamento de Erros Assíncronos em Rotas (Async Handler)**
    *   **Descrição:** Implementar um "wrapper" (`asyncHandler`) para lidar com erros em funções de controller assíncronas, evitando a repetição de blocos `try/catch`.
    *   **Localização no Código:** Criar `backend/src/utils/asyncHandler.ts` e refatorar controllers.
    *   **Detalhes para o Agente:**
        *   Criar o arquivo `backend/src/utils/asyncHandler.ts` com a função `asyncHandler` fornecida no feedback.
        *   Atualizar os controllers que usam funções assíncronas para envolvê-las com `asyncHandler`.
        *   Testar as rotas para garantir que o tratamento de erros assíncronos continua funcionando corretamente.

### Tarefas de Baixa Complexidade / Baixo Impacto

1.  **Validação de Variáveis de Ambiente (PORT)**
    *   **Descrição:** Adicionar validação explícita para a variável de ambiente `PORT` na inicialização da aplicação.
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Implementar o bloco de código fornecido no feedback para validar `process.env.PORT`.
        *   Garantir que a aplicação encerre com um erro claro se a variável não for válida.

2.  **Organização de Imports**
    *   **Descrição:** Reorganizar os imports em `app.ts` (e outros arquivos, se aplicável) agrupando-os por tipo para melhorar a legibilidade.
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Seguir a sugestão de agrupamento: módulos externos, rotas, middlewares, configurações/DB.
        *   Aplicar a mesma lógica a outros arquivos `.ts` no projeto, se necessário.

3.  **Remoção/Desabilitação do Endpoint `/api/test` em Produção**
    *   **Descrição:** Modificar o `app.ts` para que o endpoint `/api/test` seja desabilitado ou removido em ambientes de produção.
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Usar uma condição baseada em `process.env.NODE_ENV` para incluir ou excluir a rota `/api/test`.
        *   Garantir que o endpoint não esteja acessível quando `NODE_ENV` for `production`.

4.  **Verificação e Uso de `fuelPricesRoutes`**
    *   **Descrição:** Verificar se a rota `fuelPricesRoutes` é realmente necessária e, se for, garantir que esteja sendo usada. Caso contrário, remover a importação e o código relacionado.
    *   **Localização no Código:** `backend/src/app.ts`
    *   **Detalhes para o Agente:**
        *   Confirmar a necessidade da rota `fuelPricesRoutes`.
        *   Se necessária, adicionar `app.use("/api/v1/fuelPrices", fuelPricesRoutes);`.
        *   Se não for necessária, remover a importação e qualquer referência a ela.

## Tarefas de Refatoração e Otimização - `backend/src/routes/auth.ts`

### Tarefas de Alta Complexidade / Alto Impacto

1.  **Refatoração do `authMiddleware` e Tipagem**
    *   **Descrição:** Ajustar o `authMiddleware` para que ele popule o objeto `req` com as informações do usuário autenticado (`req.user`), eliminando a necessidade de `as unknown as AuthenticatedRequest` nos controllers. Isso envolve aprimorar a tipagem do `AuthenticatedRequest`.
    *   **Localização no Código:** `backend/src/middlewares/auth.ts`, `backend/src/types/common.ts`, e controllers que utilizam `authMiddleware`.
    *   **Detalhes para o Agente:**
        *   Modificar `middlewares/auth.ts` para que `authMiddleware` decodifique o token JWT e atribua o payload do usuário (ex: `id`, `email`, `roles`) a `req.user`.
        *   Atualizar a interface `AuthenticatedRequest` em `types/common.ts` para incluir a propriedade `user` com a tipagem correta do payload.
        *   Remover todos os `as unknown as AuthenticatedRequest` das rotas e controllers que utilizam o `authMiddleware`.
        *   Testar todas as rotas protegidas para garantir que a autenticação e o acesso aos dados do usuário funcionem corretamente.

2.  **Implementação de Validação de Entrada para Rotas de Autenticação**
    *   **Descrição:** Adicionar validação rigorosa para os corpos das requisições (`/register`, `/login`, `/request-password-reset`, `/reset-password`, `/change-password`) usando uma biblioteca de validação (ex: Joi ou Yup).
    *   **Localização no Código:** `backend/src/routes/auth.ts` e possivelmente um novo middleware de validação.
    *   **Detalhes para o Agente:**
        *   Escolher e instalar uma biblioteca de validação (se ainda não estiver instalada).
        *   Definir schemas de validação específicos para cada rota de autenticação (ex: `registerSchema`, `loginSchema`).
        *   Integrar a validação nas rotas, preferencialmente como um middleware antes de chamar o controller.
        *   Garantir que mensagens de erro de validação sejam claras e retornem status HTTP 400.

### Tarefas de Média Complexidade / Médio Impacto

1.  **Otimização dos Controladores de Autenticação**
    *   **Descrição:** Otimizar os métodos dentro de `AuthController`, focando em eficiência no hashing de senhas, consultas ao banco de dados e geração de tokens.
    *   **Localização no Código:** `backend/src/controllers/authController.ts`
    *   **Detalhes para o Agente:**
        *   Revisar o algoritmo de hashing de senhas (ex: `bcrypt`) para garantir um work factor adequado para segurança e performance.
        *   Otimizar as consultas ao banco de dados realizadas pelos métodos do `AuthController`.
        *   Garantir que a geração de tokens JWT seja eficiente.

2.  **Tratamento de Erros Específicos em Controladores de Autenticação**
    *   **Descrição:** Implementar tratamento de erros mais granular dentro dos controladores de autenticação para retornar respostas HTTP apropriadas (400, 401, 403) para cenários específicos (usuário não encontrado, senha incorreta, token inválido).
    *   **Localização no Código:** `backend/src/controllers/authController.ts`
    *   **Detalhes para o Agente:**
        *   Identificar cenários de erro comuns em cada método do `AuthController`.
        *   Implementar lógica `try/catch` ou usar o `asyncHandler` (se já implementado) para capturar erros e retornar respostas HTTP adequadas.
        *   Garantir que as mensagens de erro para o cliente sejam genéricas para evitar vazamento de informações.

### Tarefas de Baixa Complexidade / Baixo Impacto

1.  **Geração de Chaves JWT Seguras**
    *   **Descrição:** Assegurar que a chave secreta para assinatura de JWTs (`process.env.JWT_SECRET`) seja forte, longa e aleatória, e que nunca seja exposta no código-fonte ou em logs.
    *   **Localização no Código:** Configuração de variáveis de ambiente (`.env`) e uso em `authMiddleware`.
    *   **Detalhes para o Agente:**
        *   Verificar a força da chave `JWT_SECRET` atual.
        *   Se necessário, gerar uma nova chave forte (ex: usando `crypto.randomBytes(64).toString("hex")`).
        *   Garantir que a chave seja carregada apenas via variáveis de ambiente.

2.  **Revisão do Endpoint `/me`**
    *   **Descrição:** Garantir que a rota `/me` (`GET /api/v1/auth/me`) não retorne informações sensíveis demais do usuário (ex: senha hash, segredos internos), apenas o perfil público ou dados necessários para o frontend.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (método `me`).
    *   **Detalhes para o Agente:**
        *   Revisar o método `me` em `AuthController`.
        *   Filtrar os dados do usuário para retornar apenas informações seguras e relevantes para o frontend.

3.  **Mensagens de Erro Genéricas para Login/Registro**
    *   **Descrição:** Modificar as mensagens de erro para as rotas `/register` e `/login` para serem genéricas, evitando que invasores descubram se um email existe ou se apenas a senha está errada.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (métodos `register` e `login`).
    *   **Detalhes para o Agente:**
        *   Alterar as mensagens de erro para cenários como "email já em uso" ou "usuário não encontrado" para algo como "Credenciais inválidas" ou "Não foi possível completar a operação".

## Tarefas de Refatoração e Otimização - `backend/src/controllers/authController.ts`

### Tarefas de Alta Complexidade / Alto Impacto

1.  **Centralização do Tratamento de Erros e Uso de Async Handler**
    *   **Descrição:** Refatorar o tratamento de erros nos métodos do `AuthController` para usar um middleware de tratamento de erros centralizado e um `asyncHandler` para evitar blocos `try-catch` repetitivos. Isso tornará o código dos controladores mais limpo e focado na lógica de sucesso.
    *   **Localização no Código:** `backend/src/controllers/authController.ts`, `backend/src/middlewares/errorHandler.ts` (aprimoramento), e possivelmente um novo `backend/src/utils/asyncHandler.ts`.
    *   **Detalhes para o Agente:**
        *   Criar ou aprimorar `backend/src/utils/asyncHandler.ts` com a função `asyncHandler`.
        *   Atualizar `backend/src/controllers/authController.ts` para envolver os métodos com `asyncHandler`.
        *   Aprimorar `backend/src/middlewares/errorHandler.ts` para lidar com `CustomErrors` e `z.ZodError` de forma consistente.
        *   Remover os blocos `try-catch` repetitivos dos métodos do `AuthController`.
        *   Testar todas as rotas para garantir que o tratamento de erros assíncronos e a formatação das respostas de erro funcionem corretamente.

2.  **Remoção Segura de Senha do Objeto de Usuário Retornado**
    *   **Descrição:** Garantir que o campo de senha (ou hash da senha) seja explicitamente removido do objeto de usuário antes de ser retornado em qualquer resposta da API, especialmente nos endpoints de registro e `me`.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (métodos `register` e `me`), e possivelmente `backend/src/services/authService.ts`.
    *   **Detalhes para o Agente:**
        *   Modificar os métodos `register` e `me` no `AuthController` para filtrar o objeto `user` antes de enviá-lo na resposta.
        *   Considerar implementar essa filtragem no `AuthService` para garantir que nenhuma lógica de negócios retorne dados sensíveis.
        *   Testar os endpoints para confirmar que a senha não é exposta nas respostas.

3.  **Gerenciamento Seguro de Refresh Tokens (Cookies HttpOnly e Secure)**
    *   **Descrição:** Alterar a forma como os refresh tokens são enviados e armazenados, preferindo cookies `HttpOnly` e `Secure` em vez de retorná-los no corpo da resposta. Isso aumenta a segurança contra ataques XSS.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (método `refreshToken`), e possivelmente `backend/src/services/authService.ts`.
    *   **Detalhes para o Agente:**
        *   Modificar o método `refreshToken` no `AuthController` para definir o `refreshToken` como um cookie `HttpOnly` e `Secure`.
        *   Garantir que o frontend esteja configurado para enviar cookies automaticamente com as requisições.
        *   Testar o fluxo de atualização de token para garantir que funcione corretamente com cookies.

### Tarefas de Média Complexidade / Médio Impacto

1.  **Otimização dos Controladores de Autenticação**
    *   **Descrição:** Otimizar os métodos dentro de `AuthController`, focando em eficiência no hashing de senhas, consultas ao banco de dados e geração de tokens.
    *   **Localização no Código:** `backend/src/controllers/authController.ts`
    *   **Detalhes para o Agente:**
        *   Revisar o algoritmo de hashing de senhas (ex: `bcrypt`) para garantir um work factor adequado para segurança e performance.
        *   Otimizar as consultas ao banco de dados realizadas pelos métodos do `AuthController`.
        *   Garantir que a geração de tokens JWT seja eficiente.

2.  **Tratamento de Erros Específicos em Controladores de Autenticação**
    *   **Descrição:** Implementar tratamento de erros mais granular dentro dos controladores de autenticação para retornar respostas HTTP apropriadas (400, 401, 403) para cenários específicos (usuário não encontrado, senha incorreta, token inválido).
    *   **Localização no Código:** `backend/src/controllers/authController.ts`
    *   **Detalhes para o Agente:**
        *   Identificar cenários de erro comuns em cada método do `AuthController`.
        *   Implementar lógica `try/catch` ou usar o `asyncHandler` (se já implementado) para capturar erros e retornar respostas HTTP adequadas.
        *   Garantir que as mensagens de erro para o cliente sejam genéricas para evitar vazamento de informações.

### Tarefas de Baixa Complexidade / Baixo Impacto

1.  **Geração de Chaves JWT Seguras**
    *   **Descrição:** Assegurar que a chave secreta para assinatura de JWTs (`process.env.JWT_SECRET`) seja forte, longa e aleatória, e que nunca seja exposta no código-fonte ou em logs.
    *   **Localização no Código:** Configuração de variáveis de ambiente (`.env`) e uso em `authMiddleware`.
    *   **Detalhes para o Agente:**
        *   Verificar a força da chave `JWT_SECRET` atual.
        *   Se necessário, gerar uma nova chave forte (ex: usando `crypto.randomBytes(64).toString("hex")`).
        *   Garantir que a chave seja carregada apenas via variáveis de ambiente.

2.  **Revisão do Endpoint `/me`**
    *   **Descrição:** Garantir que a rota `/me` (`GET /api/v1/auth/me`) não retorne informações sensíveis demais do usuário (ex: senha hash, segredos internos), apenas o perfil público ou dados necessários para o frontend.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (método `me`).
    *   **Detalhes para o Agente:**
        *   Revisar o método `me` em `AuthController`.
        *   Filtrar os dados do usuário para retornar apenas informações seguras e relevantes para o frontend.

3.  **Mensagens de Erro Genéricas para Login/Registro**
    *   **Descrição:** Modificar as mensagens de erro para as rotas `/register` e `/login` para serem genéricas, evitando que invasores descubram se um email existe ou se apenas a senha está errada.
    *   **Localização no Código:** `backend/src/controllers/authController.ts` (métodos `register` e `login`).
    *   **Detalhes para o Agente:**
        *   Alterar as mensagens de erro para cenários como "email já em uso" ou "usuário não encontrado" para algo como "Credenciais inválidas" ou "Não foi possível completar a operação".

## Tarefas de Refatoração e Otimização - `backend/src/routes/users.ts`

### Tarefas de Alta Complexidade / Alto Impacto

1.  **Criação e Implementação de UserController**
    *   **Descrição:** Mover a lógica de negócios das rotas de usuário para um `UserController` dedicado, seguindo o padrão de separação de responsabilidades.
    *   **Localização no Código:** Criar `backend/src/controllers/userController.ts` e refatorar `backend/src/routes/users.ts`.
    *   **Detalhes para o Agente:**
        *   Criar o arquivo `backend/src/controllers/userController.ts` com métodos estáticos para `getProfile` e `updateProfile`.
        *   Mover a lógica de busca e atualização de perfil para esses métodos.
        *   Atualizar `backend/src/routes/users.ts` para importar e usar os métodos do `UserController`.
        *   Garantir que o `authMiddleware` preencha `req.user` com o ID do usuário autenticado para que o `UserController` possa utilizá-lo.

2.  **Implementação de Validação de Entrada para PUT /profile**
    *   **Descrição:** Adicionar validação rigorosa para os dados de entrada na rota `PUT /api/v1/users/profile` para garantir a integridade dos dados e prevenir ataques.
    *   **Localização no Código:** `backend/src/routes/users.ts` e possivelmente um novo middleware de validação.
    *   **Detalhes para o Agente:**
        *   Escolher e instalar uma biblioteca de validação (ex: `joi` ou `yup`).
        *   Definir um schema de validação específico para a rota `PUT /api/v1/users/profile`.
        *   Integrar a validação na rota, preferencialmente como um middleware antes de chamar o controller.
        *   Garantir que mensagens de erro de validação sejam claras e retornem status HTTP 400.


