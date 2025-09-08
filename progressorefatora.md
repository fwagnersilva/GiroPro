# Guia de Refatoração e Otimização - Projeto GiroPro

Este documento serve como um guia conciso para a refatoração e otimização do projeto GiroPro. Ele detalha o processo de análise de código *realizada pelo Google AI Studio* e as tarefas subsequentes para um agente.

## Instruções para Análise e Organização de Dados de Refatoração

É crucial seguir estas instruções de forma rigorosa para garantir a coleta e organização adequadas dos dados de refatoração. O Manus (eu) não executará refatoramento ou atividades de refatoração diretamente, mas se concentrará em coletar e organizar os dados para posterior refatoração.

**Passo 1: Ler o que está escrito**
Leia atentamente o conteúdo deste arquivo e as instruções fornecidas.

**Passo 2: Seguir o que está escrito**
Execute as ações conforme detalhado nas instruções.

**Passo 3: Criar um prompt com o próximo arquivo a ser analisado**
Formule um prompt claro e conciso indicando o próximo arquivo ou seção de código a ser analisado para refatoração. Este prompt será usado para solicitar a análise do Google (ou outra ferramenta de IA).

**Passo 4: Esperar retorno do Google (ou outra IA)**
Aguarde o retorno da análise do Google (ou da IA utilizada). Uma vez recebido, copie integralmente o que for entregue, incluindo o arquivo analisado, o prompt utilizado e a resposta detalhada da IA.

**Passo 5: Com o recebimento do retorno, crie tarefas no arquivo obedecendo a classificação**
Com base no retorno da análise, crie tarefas detalhadas neste arquivo, classificando-as de acordo com a natureza da refatoração (ex: melhoria de legibilidade, otimização de desempenho, correção de bugs, etc.). As tarefas devem ser claras e acionáveis, servindo como um guia para futuras ações de refatoração.

## Prompt para o Google AI Studio

```plaintext
O código abaixo é um arquivo de rotas de: [NOME_DO_ARQUIVO] para um aplicativo de gestão financeira. Ele define rotas para operações CRUD de: [TIPO_DE_RECURSO], todas protegidas por um middleware de autenticação e um rate limiter. Por favor, analise-o e forneça feedback sobre otimização, melhorias de performance, segurança e boas práticas de código, especialmente no contexto de gestão de recursos e proteção de dados. Inclua sugestões de refatoração, se aplicável.
```





Lista de Arquivos para Análise no Google AI Studio

Esta seção serve como um guia para a análise de arquivos do projeto GiroPro no Google AI Studio. O objetivo é coletar feedback sobre cada arquivo e, a partir dele, criar tarefas de refatoração e otimização.

Backend




backend/src/app.ts (Análise concluída)




backend/src/routes/auth.ts (Análise concluída)




backend/src/routes/users.ts (Análise concluída)




backend/src/routes/vehicles.ts (Análise concluída)




backend/src/routes/journeys.ts (Análise concluída)




backend/src/routes/fuelings.ts (Análise concluída)




backend/src/routes/expenses.ts (Análise concluída)




backend/src/controllers/authController.ts




backend/src/controllers/userController.ts




backend/src/controllers/vehicleController.ts




backend/src/controllers/journeyController.ts




backend/src/controllers/fuelingController.ts




backend/src/controllers/expenseController.ts




backend/src/db/initTables.ts




backend/src/middlewares/errorHandler.ts




backend/src/middlewares/requestLogger.ts

Frontend




frontend/src/App.tsx




frontend/src/navigation/AppNavigator.tsx




frontend/src/screens/HomeScreen.tsx




frontend/src/screens/LoginScreen.tsx




frontend/src/screens/RegisterScreen.tsx




frontend/src/components/Button.tsx




frontend/src/components/Input.tsx




frontend/src/services/api.ts




frontend/src/contexts/AuthContext.tsx




Este documento detalha as tarefas de refatoração e otimização para o projeto GiroPro, baseadas no feedback do Google AI Studio. As tarefas são categorizadas por complexidade e impacto, e são destinadas a serem executadas por um agente em um momento posterior.

Tarefas de Alta Complexidade / Alto Impacto

1. Refatoração do CORS para Produção

Descrição: Alterar a configuração do CORS para não usar origin: "*" em produção. Isso envolve identificar os domínios de frontend permitidos e configurá-los dinamicamente (via variáveis de ambiente ou arquivo de configuração).
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Identificar os domínios de produção do frontend.

•
Modificar a configuração cors em app.ts para aceitar uma lista de origens permitidas.

•
Garantir que a lista de origens seja carregada de forma segura (ex: variável de ambiente CORS_ORIGINS).

•
Testar a aplicação para garantir que o frontend ainda consiga se comunicar com o backend após a mudança.

2. Implementação de Validação de Entrada (Input Validation)

Descrição: Adicionar validação rigorosa para todos os dados de entrada (corpo da requisição, query parameters, path parameters) em todas as rotas da API. Isso é crucial para a segurança e robustez da aplicação.
Localização no Código: Rotas e controllers em backend/src/routes/ e backend/src/controllers/
Detalhes para o Agente:

•
Escolher uma biblioteca de validação (ex: joi ou yup).

•
Definir schemas de validação para cada tipo de dado de entrada esperado em cada rota.

•
Implementar a validação nos controllers antes de processar os dados.

•
Garantir que erros de validação retornem respostas HTTP 400 (Bad Request) com mensagens claras.

3. Otimização do Banco de Dados e Queries

Descrição: Analisar e otimizar as operações de banco de dados para melhorar a performance. Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados.
Localização no Código: backend/src/db/ e controllers que interagem com o DB.
Detalhes para o Agente:

•
Identificar as queries mais lentas ou mais frequentemente executadas.

•
Analisar o schema do banco de dados para identificar oportunidades de indexação.

•
Otimizar queries existentes ou refatorar a forma como os dados são acessados.

•
Revisar a configuração do banco de dados (se aplicável) para garantir que esteja otimizada para o ambiente de produção.

Tarefas de Média Complexidade / Médio Impacto

1. Implementação de Compressão (Gzip)

Descrição: Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP, melhorando o tempo de carregamento para os clientes.
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Instalar a dependência compression (npm install compression).

•
Importar e usar o middleware compression() em app.ts antes da definição das rotas.

•
Testar para garantir que as respostas estão sendo comprimidas corretamente.

2. Implementação de Limitação de Taxa (Rate Limiting)

Descrição: Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso, especialmente em endpoints de autenticação.
Localização no Código: backend/src/app.ts ou rotas específicas.
Detalhes para o Agente:

•
Instalar a dependência express-rate-limit (npm install express-rate-limit).

•
Configurar um rate limiter com windowMs e max apropriados.

•
Aplicar o rate limiter globalmente (app.use) ou em rotas específicas (ex: /api/v1/auth/login).

•
Testar o comportamento do rate limiter para garantir que está funcionando conforme o esperado.

3. Centralização de Configurações

Descrição: Criar um arquivo config.ts para centralizar todas as configurações da aplicação, tornando-as mais fáceis de gerenciar e acessar.
Localização no Código: Criar backend/src/config/config.ts e refatorar app.ts.
Detalhes para o Agente:

•
Criar o arquivo backend/src/config/config.ts.

•
Mover configurações como PORT, NODE_ENV, CORS_ORIGINS, JWT_SECRET (se existirem) para este arquivo.

•
Exportar um objeto config com todas as variáveis.

•
Atualizar app.ts e outros arquivos que usam essas variáveis para importá-las do novo arquivo de configuração.

4. Tratamento de Erros Assíncronos em Rotas (Async Handler)

Descrição: Implementar um "wrapper" (asyncHandler) para lidar com erros em funções de controller assíncronas, evitando a repetição de blocos try/catch.
Localização no Código: Criar backend/src/utils/asyncHandler.ts e refatorar controllers.
Detalhes para o Agente:

•
Criar o arquivo backend/src/utils/asyncHandler.ts com a função asyncHandler fornecida no feedback.

•
Atualizar os controllers que usam funções assíncronas para envolvê-las com asyncHandler.

•
Testar as rotas para garantir que o tratamento de erros assíncronos continua funcionando corretamente.

Tarefas de Baixa Complexidade / Baixo Impacto

1. Validação de Variáveis de Ambiente (PORT)

Descrição: Adicionar validação explícita para a variável de ambiente PORT na inicialização da aplicação.
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Implementar o bloco de código fornecido no feedback para validar process.env.PORT.

•
Garantir que a aplicação encerre com um erro claro se a variável não for válida.

2. Organização de Imports

Descrição: Reorganizar os imports em app.ts (e outros arquivos, se aplicável) agrupando-os por tipo para melhorar a legibilidade.
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Seguir a sugestão de agrupamento: módulos externos, rotas, middlewares, configurações/DB.

•
Aplicar a mesma lógica a outros arquivos .ts no projeto, se necessário.

3. Remoção/Desabilitação do Endpoint /api/test em Produção

Descrição: Modificar o app.ts para que o endpoint /api/test seja desabilitado ou removido em ambientes de produção.
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Usar uma condição baseada em process.env.NODE_ENV para incluir ou excluir a rota /api/test.

•
Garantir que o endpoint não esteja acessível quando NODE_ENV for production.

4. Verificação e Uso de fuelPricesRoutes

Descrição: Verificar se a rota fuelPricesRoutes é realmente necessária e, se for, garantir que esteja sendo usada. Caso contrário, remover a importação e o código relacionado.
Localização no Código: backend/src/app.ts
Detalhes para o Agente:

•
Confirmar a necessidade da rota fuelPricesRoutes.

•
Se necessária, adicionar app.use("/api/v1/fuelPrices", fuelPricesRoutes);.

•
Se não for necessária, remover a importação e qualquer referência a ela.

Tarefas de Refatoração e Otimização - backend/src/routes/auth.ts

Tarefas de Alta Complexidade / Alto Impacto

1. Refatoração do authMiddleware e Tipagem

Descrição: Ajustar o authMiddleware para que ele popule o objeto req com as informações do usuário autenticado (req.user), eliminando a necessidade de as unknown as AuthenticatedRequest nos controllers. Isso envolve aprimorar a tipagem do AuthenticatedRequest.
Localização no Código: backend/src/middlewares/auth.ts, backend/src/types/common.ts, e controllers que utilizam authMiddleware.
Detalhes para o Agente:

•
Modificar middlewares/auth.ts para que authMiddleware decodifique o token JWT e atribua o payload do usuário (ex: id, email, roles) a req.user.

•
Atualizar a interface AuthenticatedRequest em types/common.ts para incluir a propriedade user com a tipagem correta do payload.

•
Remover todos os as unknown as AuthenticatedRequest das rotas e controllers que utilizam o authMiddleware.

•
Testar todas as rotas protegidas para garantir que a autenticação e o acesso aos dados do usuário funcionem corretamente.

2. Implementação de Validação de Entrada para Rotas de Autenticação

Descrição: Adicionar validação rigorosa para os corpos das requisições (/register, /login, /request-password-reset, /reset-password, /change-password) usando uma biblioteca de validação (ex: Joi ou Yup).
Localização no Código: backend/src/routes/auth.ts e possivelmente um novo middleware de validação.
Detalhes para o Agente:

•
Escolher e instalar uma biblioteca de validação (se ainda não estiver instalada).

•
Definir schemas de validação específicos para cada rota de autenticação (ex: registerSchema, loginSchema).

•
Integrar a validação nas rotas, preferencialmente como um middleware antes de chamar o controller.

•
Garantir que mensagens de erro de validação sejam claras e retornem status HTTP 400.

Tarefas de Média Complexidade / Médio Impacto

1. Otimização dos Controladores de Autenticação

Descrição: Otimizar os métodos dentro de AuthController, focando em eficiência no hashing de senhas, consultas ao banco de dados e geração de tokens.
Localização no Código: backend/src/controllers/authController.ts
Detalhes para o Agente:

•
Revisar o algoritmo de hashing de senhas (ex: bcrypt) para garantir um work factor adequado para segurança e performance.

•
Otimizar as consultas ao banco de dados realizadas pelos métodos do AuthController.

•
Garantir que a geração de tokens JWT seja eficiente.

2. Tratamento de Erros Específicos em Controladores de Autenticação

Descrição: Implementar tratamento de erros mais granular dentro dos controladores de autenticação para retornar respostas HTTP apropriadas (400, 401, 403) para cenários específicos (usuário não encontrado, senha incorreta, token inválido).
Localização no Código: backend/src/controllers/authController.ts
Detalhes para o Agente:

•
Identificar cenários de erro comuns em cada método do AuthController.

•
Implementar lógica try/catch ou usar o asyncHandler (se já implementado) para capturar erros e retornar respostas HTTP adequadas.

•
Garantir que as mensagens de erro para o cliente sejam genéricas para evitar vazamento de informações.

Tarefas de Baixa Complexidade / Baixo Impacto

1. Geração de Chaves JWT Seguras

Descrição: Assegurar que a chave secreta para assinatura de JWTs (process.env.JWT_SECRET) seja forte, longa e aleatória, e que nunca seja exposta no código-fonte ou em logs.
Localização no Código: Configuração de variáveis de ambiente (.env) e uso em authMiddleware.
Detalhes para o Agente:

•
Verificar a força da chave JWT_SECRET atual.

•
Se necessário, gerar uma nova chave forte (ex: usando crypto.randomBytes(64).toString("hex")).

•
Garantir que a chave seja carregada apenas via variáveis de ambiente.

2. Revisão do Endpoint /me

Descrição: Garantir que a rota /me (GET /api/v1/auth/me) não retorne informações sensíveis demais do usuário (ex: senha hash, segredos internos), apenas o perfil público ou dados necessários para o frontend.
Localização no Código: backend/src/controllers/authController.ts (método me).
Detalhes para o Agente:

•
Revisar o método me em AuthController.

•
Filtrar os dados do usuário para retornar apenas informações seguras e relevantes para o frontend.

3. Mensagens de Erro Genéricas para Login/Registro

Descrição: Modificar as mensagens de erro para as rotas /register e /login para serem genéricas, evitando que invasores descubram se um email existe ou se apenas a senha está errada.
Localização no Código: backend/src/controllers/authController.ts (métodos register e login).
Detalhes para o Agente:

•
Alterar as mensagens de erro para cenários como "email já em uso" ou "usuário não encontrado" para algo como "Credenciais inválidas" ou "Não foi possível completar a operação".

Tarefas de Refatoração e Otimização - backend/src/routes/users.ts

Tarefas de Alta Complexidade / Alto Impacto

1. Criação e Implementação de UserController

Descrição: Mover a lógica de negócios das rotas de usuário para um UserController dedicado, seguindo o padrão de separação de responsabilidades.
Localização no Código: Criar backend/src/controllers/userController.ts e refatorar backend/src/routes/users.ts.
Detalhes para o Agente:

•
Criar o arquivo backend/src/controllers/userController.ts com métodos estáticos para getProfile e updateProfile.

•
Mover a lógica de busca e atualização de perfil para esses métodos.

•
Atualizar backend/src/routes/users.ts para importar e usar os métodos do UserController.

•
Garantir que o authMiddleware preencha req.user com o ID do usuário autenticado para que o UserController possa utilizá-lo.

2. Implementação de Validação de Entrada para PUT /profile

Descrição: Adicionar validação rigorosa para os dados de entrada na rota PUT /api/v1/users/profile para garantir a integridade dos dados e prevenir ataques.
Localização no Código: backend/src/routes/users.ts e possivelmente um novo middleware de validação.
Detalhes para o Agente:

•
Escolher e instalar uma biblioteca de validação (ex: joi ou yup).

•
Definir um schema de validação para os campos permitidos na atualização do perfil (ex: username, email).

•
Implementar a validação como um middleware antes de chamar o método updateProfile no UserController.

•
Garantir que a validação rejeite campos não permitidos ou sensíveis (ex: isAdmin, role).

•
Retornar respostas HTTP 400 (Bad Request) com mensagens claras em caso de falha na validação.

Tarefas de Média Complexidade / Médio Impacto

1. Otimização de Consultas ao Banco de Dados para Perfil

Descrição: Otimizar as consultas ao banco de dados para buscar e atualizar o perfil do usuário, garantindo eficiência e performance.
Localização no Código: backend/src/controllers/userController.ts (métodos getProfile e updateProfile).
Detalhes para o Agente:

•
Revisar as queries de busca e atualização de perfil para garantir que sejam eficientes.

•
Verificar a existência de índices apropriados nas tabelas de usuário.

•
Garantir que apenas os campos necessários sejam selecionados nas consultas de leitura.

2. Implementação de Autorização (RBAC) para Rotas de Usuário (Futuro)

Descrição: Considerar a implementação de um sistema de controle de acesso baseado em roles (RBAC) se houver diferentes tipos de usuários com permissões distintas (ex: admin vs. motorista).
Localização no Código: backend/src/routes/users.ts e novos middlewares de autorização.
Detalhes para o Agente:

•
Avaliar a necessidade de diferentes roles de usuário.

•
Se necessário, criar um middleware de autorização que verifique a role do usuário antes de permitir o acesso a certas rotas.

Tarefas de Refatoração e Otimização - backend/src/routes/journeys.ts

Tarefas de Alta Complexidade / Alto Impacto

1. Implementação de Autorização por Recurso (Ownership)




Garantir que todas as operações CRUD (create, get, update, delete) em journeysController verifiquem se o userId autenticado é o proprietário da viagem.




createJourney: Associar userId automaticamente ao novo registro.




getJourneys: Retornar apenas viagens do userId autenticado.




getJourneyById, updateJourney, deleteJourney: Verificar propriedade antes da operação; retornar 404/403 se não pertencer.



2. Implementação de Validação de Entrada




Adicionar validação rigorosa para createJourney e updateJourney (ex: Joi, Yup) para todos os campos de entrada.




Incluir validação de lógica (ex: quilometragem final > inicial, datas coerentes).




Criar middlewares de validação de esquema.



3. Tipagem Forte com AuthenticatedRequest




Tipar as funções no journeysController para receber AuthenticatedRequest e acessar req.user de forma segura.

Tarefas de Média Complexidade / Médio Impacto

1. Adição de Rate Limiter




Implementar um rateLimit específico para as rotas de viagens em backend/src/routes/journeys.ts.

2. Otimização dos Controladores de Viagens




Otimizar getJourneys com paginação, filtragem e ordenação.




Garantir que as queries CRUD no journeysController utilizem índices adequados no banco de dados.

3. Tratamento de ID do Veículo Associado




Em createJourney e updateJourney, verificar se o vehicleId fornecido pertence ao userId autenticado.

Tarefas de Baixa Complexidade / Baixo Impacto

1. Centralização de Middlewares




Aplicar authMiddleware e journeysLimiter usando router.use() no início do arquivo de rotas para maior consistência.




## Análise e Feedback - backend/src/routes/expenses.ts




### 1. Estrutura e Boas Práticas

**Pontos Positivos:**
*   **Modularização:** O arquivo é dedicado às rotas de despesas, o que contribui para a organização e facilita a manutenção.
*   **Separação de Responsabilidades:** As rotas chamam funções específicas (createExpense, getExpenses, etc.) do `expensesController`, seguindo o padrão de manter a lógica de negócios separada da camada de roteamento.
*   **Aplicação por Rota de `authMiddleware`:** O `authMiddleware` é aplicado a cada rota individualmente, garantindo que todas as operações com despesas exijam autenticação.

**Observações:**
*   **Faltou o Rate Limiter:** Assim como nos arquivos `fuelings.ts` e `journeys.ts` que analisamos anteriormente, este arquivo não inclui um `rateLimit` explicitamente configurado. Para operações CRUD que podem ser alvo de abuso, um rate limiter é uma camada adicional importante de segurança e proteção contra uso excessivo.

### 2. Otimização e Performance

*   **Eficiência do `authMiddleware`:** A performance do `authMiddleware` é sempre um fator. Ele deve ser otimizado para não adicionar latência significativa a cada requisição autenticada.
*   **Rate Limiting:** Sugestão de otimização/segurança: Adicionar um `rateLimit` específico para as rotas de despesas. Isso ajuda a proteger contra ataques DoS e uso excessivo da API, especialmente em rotas de criação ou leitura de dados financeiros.

```typescript
// Exemplo de como adicionar o rate limiter
import rateLimit from "express-rate-limit";

const expensesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP a cada 15 minutos
  message: "Muitas requisições para despesas deste IP, por favor tente novamente mais tarde."
});

router.use(expensesLimiter); // Aplicar a todas as rotas de despesas
```

*   **Otimização dos Controladores:** As funções no `expensesController` serão o principal foco para a performance da aplicação:
    *   `getExpenses`: Usuários podem ter muitos registros de despesas. Paginação, filtragem (por data, categoria, veículo associado) e ordenação são cruciais para um desempenho aceitável e uma boa experiência de usuário. Evite retornar conjuntos de dados muito grandes.
    *   **Queries ao Banco de Dados:** Garanta que as queries CRUD subjacentes sejam eficientes, utilizando índices adequados no banco de dados para garantir respostas rápidas.

### 3. Segurança (Foco em Autenticação, Autorização e Proteção de Dados)

Os princípios de segurança são consistentes com os recursos anteriores e são críticos para dados financeiros.

*   **`authMiddleware` Essencial:** Garante que apenas usuários autenticados possam interagir com os recursos de despesas.
*   **Autorização por Recurso (Ownership/Resource-Based Authorization):** Este é, sem dúvida, o ponto mais crítico. Cada função CRUD no `expensesController` DEVE verificar que o `userId` (obtido do `req.user` do token JWT) é o proprietário da despesa que está sendo acessada, modificada ou deletada.
    *   `createExpense`: O `userId` do usuário autenticado deve ser automaticamente associado ao novo registro de despesa como seu proprietário.
    *   `getExpenses`: Deve retornar apenas os registros de despesas que pertencem ao `userId` autenticado.
    *   `getExpenseById`, `updateExpense`, `deleteExpense`: Antes de executar a operação, o controlador deve verificar se a despesa com o `:id` especificado pertence ao `userId` autenticado. Se não pertencer, retorne 404 Not Found (para evitar vazar a existência do recurso) ou 403 Forbidden.
*   **Validação de Entrada (Joi, Yup):**
    *   `createExpense` e `updateExpense`: É fundamental validar rigorosamente todos os campos enviados pelo cliente (valor, descrição, categoria, data, veículo associado, etc.). Isso previne dados inválidos, maliciosos ou inconsistentes.
    *   **Validação de Lógica:** Por exemplo, o valor da despesa não pode ser negativo ou zero, a data deve ser válida, a categoria deve ser uma das categorias permitidas, o `vehicleId` (se aplicável) deve ser válido e pertencer ao usuário.
*   **Tratamento de Erros:** As funções do controlador devem capturar erros específicos (ex: validação falha, recurso não encontrado/não autorizado) e retornar status HTTP apropriados e mensagens de erro genéricas para o cliente em produção, registrando os detalhes internamente.
*   **Proteção de Dados:** Garanta que os registros de despesas não contenham dados sensíveis que não devam ser expostos na API.

### 4. Refatoração e Melhorias Sugeridas

*   **Centralização do `authMiddleware` e Adição do Rate Limiter:** Para maior consistência e limpeza do código, aplique ambos os middlewares usando `router.use()` no início do arquivo de rotas.

```typescript
import { Router } from 'express';
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } from '../controllers/expensesController';
import { authMiddleware } from '../middlewares/auth';
import rateLimit from "express-rate-limit";

const router = Router();

// Rate Limiter específico para despesas
const expensesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Ajuste conforme necessário
  message: "Muitas requisições para despesas deste IP, por favor tente novamente mais tarde."
});

router.use(authMiddleware); // Aplica autenticação a todas as rotas
router.use(expensesLimiter); // Aplica o rate limiter a todas as rotas

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export const expenseRoutes = router;
```

*   **Tipagem Forte com `AuthenticatedRequest`:** As funções no `expensesController` devem ser tipadas para receber `AuthenticatedRequest` para acesso seguro ao `userId` e outras informações do usuário autenticado.
*   **Middlewares de Validação:** Crie middlewares de validação de esquema (Joi, Yup) para `createExpense` e `updateExpense` para garantir a integridade dos dados antes que cheguem ao controlador.

```typescript
// Exemplo (conceitual)
// import { validateCreateExpense, validateUpdateExpense } from '../middlewares/expenseValidation';

// router.post('/', validateCreateExpense, createExpense);
// router.put('/:id', validateUpdateExpense, updateExpense);
```

*   **Tratamento de ID do Veículo Associado (se aplicável):** As despesas podem estar ligadas a veículos específicos.
    *   **Na criação (`createExpense`):** Se o `req.body` incluir um `vehicleId`, o controlador DEVE verificar se este `vehicleId` pertence ao `userId` autenticado. Isso evita que um usuário registre uma despesa para o veículo de outra pessoa.
    *   **Na leitura/atualização/deleção:** Ao buscar, atualizar ou deletar uma despesa, o controlador deve garantir que a despesa pertence ao `userId` E, se for o caso, que o `vehicleId` associado à despesa também pertence ao `userId`.
*   **Exemplo Visual: Fluxo de Criação de Despesa**
    Para ilustrar o fluxo de uma requisição para a rota `POST /api/v1/expenses`, aqui está um diagrama atualizado:

```mermaid
graph TD
    A[Cliente] --> B(POST /api/v1/expenses com Bearer Token e dados da Despesa)
    B --> C{Servidor Express}

    C -- Middlewares Globais --> D[expenses.ts]

    D -- Router.use(authMiddleware) --> E[authMiddleware]

    E -- Token Válido? --> F{Payload do Token no req.user}
    F -- Não --> G(401 Unauthorized / 403 Forbidden)
    F -- Sim --> H[expensesLimiter (Verificar Limite de Requisições)]
    H -- Limite Excedido --> I(429 Too Many Requests)
    H -- Limite OK --> J[validateCreateExpense (Middleware de Validação de Input)]
    J -- Input Inválido --> K(400 Bad Request)
    J -- Input Válido --> L[createExpense (Controller)]

    L -- Extrair userId de req.user --> M[Verificar se VehicleId (se fornecido) pertence a userId]
    M -- VehicleId Não Pertence --> N(403 Forbidden / 404 Not Found)
    M -- VehicleId OK --> O[Salvar Despesa no DB com owner = userId]

    O -- Sucesso/Erro no DB --> P(Resposta)
    P --> A
```


