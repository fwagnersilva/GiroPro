# Documentação da API GiroPro - Atualizada

Este documento serve como a documentação oficial da API do sistema GiroPro, fornecendo detalhes abrangentes sobre todos os endpoints disponíveis, métodos HTTP, parâmetros de requisição, formatos de resposta e requisitos de autenticação. O objetivo é capacitar desenvolvedores a integrar-se eficientemente com o backend do GiroPro.

## 1. Visão Geral da API

A API do GiroPro é uma API RESTful, projetada para ser intuitiva e fácil de usar. Ela utiliza JSON para o corpo das requisições e respostas, e códigos de status HTTP padrão para indicar o resultado das operações. Todos os endpoints são versionados sob `/api/v1/` para garantir compatibilidade retroativa e permitir futuras expansões sem impactar as integrações existentes.

### 1.1. Base URL

A URL base para todos os endpoints da API é `[SEU_DOMINIO_AQUI]/api/v1/`.

### 1.2. Autenticação

A maioria dos endpoints da API requer autenticação. O GiroPro utiliza JSON Web Tokens (JWT) para autenticação. Após o login bem-sucedido, um token JWT é emitido e deve ser incluído no cabeçalho `Authorization` de todas as requisições subsequentes, no formato `Bearer <token>`.

### 1.3. Formato de Requisição e Resposta

Todas as requisições e respostas que contêm um corpo de dados utilizam o formato JSON (`Content-Type: application/json`).

### 1.4. Tratamento de Erros

A API utiliza um middleware de tratamento de erros assíncronos (`asyncHandler`) para centralizar o tratamento de exceções em rotas assíncronas. Isso garante que todos os erros sejam capturados e tratados de forma consistente, evitando a repetição de blocos `try-catch` em cada rota.

### 1.5. Segurança

- O endpoint `/api/test` foi removido em produção para evitar exposição desnecessária de informações
- Utilização do middleware Helmet para configurações de segurança
- Desabilitação do cabeçalho `X-Powered-By`
- Configuração CORS para permitir origens específicas

## 2. Endpoints da API

Esta seção detalha cada endpoint da API, incluindo seu propósito, método HTTP, URL, parâmetros de requisição (path, query, body) e exemplos de respostas.

### 2.1. Autenticação

#### `POST /auth/register`

*   **Descrição:** Registra um novo usuário no sistema. Este endpoint é público e não requer autenticação.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/register`
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "nome": "string",
      "email": "string",
      "senha": "string"
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Usuário registrado com sucesso.

        ```json
        {
          "id": "uuid",
          "nome": "string",
          "email": "string",
          "status_conta": "Ativo",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos ou email já cadastrado.

#### `POST /auth/login`

*   **Descrição:** Autentica um usuário existente e retorna um token JWT para acesso a endpoints protegidos.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/login`
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "email": "string",
      "senha": "string"
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Autenticação bem-sucedida. Retorna o token JWT e informações básicas do usuário.

        ```json
        {
          "token": "string",
          "usuario": {
            "id": "uuid",
            "nome": "string",
            "email": "string"
          }
        }
        ```
    *   **`401 Unauthorized`:** Credenciais inválidas.

#### `POST /auth/request-password-reset`

*   **Descrição:** Inicia o processo de redefinição de senha, enviando um email com instruções.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/request-password-reset`
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "email": "string"
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Email de redefinição enviado (mesmo que o email não exista, para evitar enumeração de usuários).

#### `POST /auth/reset-password`

*   **Descrição:** Redefine a senha do usuário usando um token de redefinição.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/reset-password`
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "token": "string",
      "nova_senha": "string"
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Senha redefinida com sucesso.
    *   **`400 Bad Request`:** Token inválido ou expirado, ou nova senha não atende aos requisitos.

#### `POST /auth/refresh-token`

*   **Descrição:** Renova um token JWT expirado, emitindo um novo token de acesso.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/refresh-token`
*   **Autenticação:** Requer um token de atualização (refresh token) válido no corpo da requisição ou como cookie.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "refreshToken": "string"
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Novo token de acesso emitido.

        ```json
        {
          "token": "string"
        }
        ```
    *   **`401 Unauthorized`:** Token de atualização inválido ou expirado.

#### `POST /auth/change-password`

*   **Descrição:** Permite que um usuário autenticado altere sua senha atual.
*   **Método:** `POST`
*   **URL:** `/api/v1/auth/change-password`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "senha_atual": "string",
      "nova_senha": "string"
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Senha alterada com sucesso.
    *   **`401 Unauthorized`:** Token JWT inválido ou senha atual incorreta.
    *   **`400 Bad Request`:** Nova senha não atende aos requisitos.

#### `GET /auth/me`

*   **Descrição:** Retorna os dados do usuário autenticado.
*   **Método:** `GET`
*   **URL:** `/api/v1/auth/me`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Dados do usuário retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "nome": "string",
          "email": "string",
          "status_conta": "Ativo",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.2. Usuários

#### `GET /users/profile`

*   **Descrição:** Retorna o perfil do usuário autenticado.
*   **Método:** `GET`
*   **URL:** `/api/v1/users/profile`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Perfil do usuário retornado com sucesso.

        ```json
        {
          "message": "Rota de perfil do usuário - Em desenvolvimento"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /users/profile`

*   **Descrição:** Atualiza o perfil do usuário autenticado.
*   **Método:** `PUT`
*   **URL:** `/api/v1/users/profile`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "nome": "string" (opcional),
      "email": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Perfil do usuário atualizado com sucesso.

        ```json
        {
          "message": "Atualização de perfil - Em desenvolvimento"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.
    *   **`400 Bad Request`:** Dados inválidos.

### 2.3. Veículos

#### `POST /vehicles`

*   **Descrição:** Cadastra um novo veículo para o usuário autenticado.
*   **Método:** `POST`
*   **URL:** `/api/v1/vehicles`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "marca": "string",
      "modelo": "string",
      "ano": "integer",
      "placa": "string",
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex",
      "tipo_uso": "Proprio" | "Alugado" | "Financiado",
      "valor_aluguel": "integer" (opcional, se tipo_uso = 'Alugado'),
      "valor_prestacao": "integer" (opcional, se tipo_uso = 'Financiado')
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Veículo cadastrado com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "marca": "string",
          "modelo": "string",
          "ano": "integer",
          "placa": "string",
          "tipo_combustivel": "string",
          "tipo_uso": "string",
          "media_consumo": "integer",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /vehicles`

*   **Descrição:** Lista todos os veículos cadastrados para o usuário autenticado.
*   **Método:** `GET`
*   **URL:** `/api/v1/vehicles`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Lista de veículos retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "marca": "string",
            "modelo": "string",
            "ano": "integer",
            "placa": "string",
            "tipo_combustivel": "string",
            "tipo_uso": "string",
            "media_consumo": "integer",
            "data_cadastro": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /vehicles/:id`

*   **Descrição:** Retorna os detalhes de um veículo específico pelo seu ID.
*   **Método:** `GET`
*   **URL:** `/api/v1/vehicles/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do veículo.
*   **Respostas:**
    *   **`200 OK`:** Detalhes do veículo retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "marca": "string",
          "modelo": "string",
          "ano": "integer",
          "placa": "string",
          "tipo_combustivel": "string",
          "tipo_uso": "string",
          "media_consumo": "integer",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`404 Not Found`:** Veículo não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /vehicles/:id`

*   **Descrição:** Atualiza os detalhes de um veículo existente.
*   **Método:** `PUT`
*   **URL:** `/api/v1/vehicles/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do veículo a ser atualizado.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "marca": "string" (opcional),
      "modelo": "string" (opcional),
      "ano": "integer" (opcional),
      "placa": "string" (opcional),
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex" (opcional),
      "tipo_uso": "Proprio" | "Alugado" | "Financiado" (opcional),
      "valor_aluguel": "integer" (opcional, se tipo_uso = 'Alugado'),
      "valor_prestacao": "integer" (opcional, se tipo_uso = 'Financiado')
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Veículo atualizado com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "marca": "string",
          "modelo": "string",
          "ano": "integer",
          "placa": "string",
          "tipo_combustivel": "string",
          "tipo_uso": "string",
          "media_consumo": "integer",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Veículo não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /vehicles/:id`

*   **Descrição:** Exclui um veículo existente.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/vehicles/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do veículo a ser excluído.
*   **Respostas:**
    *   **`204 No Content`:** Veículo excluído com sucesso.
    *   **`404 Not Found`:** Veículo não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.4. Jornadas

#### `POST /journeys/start`

*   **Descrição:** Inicia uma nova jornada para um veículo específico.
*   **Método:** `POST`
*   **URL:** `/api/v1/journeys/start`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid",
      "km_inicio": "integer",
      "data_inicio": "timestamp (ISO 8601)"
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Jornada iniciada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_inicio": "timestamp",
          "km_inicio": "integer"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /journeys/:id/end`

*   **Descrição:** Finaliza uma jornada existente, registrando o ganho e a quilometragem final.
*   **Método:** `PUT`
*   **URL:** `/api/v1/journeys/:id/end`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da jornada a ser finalizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "km_fim": "integer",
      "data_fim": "timestamp (ISO 8601)",
      "ganho_bruto": "integer",
      "observacoes": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Jornada finalizada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_inicio": "timestamp",
          "km_inicio": "integer",
          "data_fim": "timestamp",
          "km_fim": "integer",
          "ganho_bruto": "integer",
          "km_total": "integer",
          "tempo_total": "integer",
          "observacoes": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Jornada não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /journeys`

*   **Descrição:** Lista as jornadas do usuário autenticado, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/journeys`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `startDate` (ISO 8601): Data de início para filtrar as jornadas.
    *   `endDate` (ISO 8601): Data de fim para filtrar as jornadas.
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
*   **Respostas:**
    *   **`200 OK`:** Lista de jornadas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "id_veiculo": "uuid",
            "data_inicio": "timestamp",
            "km_inicio": "integer",
            "data_fim": "timestamp",
            "km_fim": "integer",
            "ganho_bruto": "integer",
            "km_total": "integer",
            "tempo_total": "integer",
            "observacoes": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.5. Abastecimentos

#### `POST /fuelings`

*   **Descrição:** Registra um novo abastecimento para um veículo específico.
*   **Método:** `POST`
*   **URL:** `/api/v1/fuelings`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid",
      "data_abastecimento": "timestamp (ISO 8601)",
      "km_atual": "integer",
      "litros": "decimal",
      "valor_total": "decimal",
      "preco_litro": "decimal",
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV",
      "posto": "string" (opcional),
      "observacoes": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Abastecimento registrado com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_abastecimento": "timestamp",
          "km_atual": "integer",
          "litros": "decimal",
          "valor_total": "decimal",
          "preco_litro": "decimal",
          "tipo_combustivel": "string",
          "posto": "string",
          "observacoes": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /fuelings`

*   **Descrição:** Lista os abastecimentos do usuário autenticado, com opções de filtro.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuelings`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `vehicleId` (UUID): Filtrar por veículo específico.
    *   `startDate` (ISO 8601): Data de início para filtrar os abastecimentos.
    *   `endDate` (ISO 8601): Data de fim para filtrar os abastecimentos.
*   **Respostas:**
    *   **`200 OK`:** Lista de abastecimentos retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "id_veiculo": "uuid",
            "data_abastecimento": "timestamp",
            "km_atual": "integer",
            "litros": "decimal",
            "valor_total": "decimal",
            "preco_litro": "decimal",
            "tipo_combustivel": "string",
            "posto": "string",
            "observacoes": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.6. Despesas

#### `POST /expenses`

*   **Descrição:** Registra uma nova despesa relacionada a um veículo.
*   **Método:** `POST`
*   **URL:** `/api/v1/expenses`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid",
      "data_despesa": "timestamp (ISO 8601)",
      "tipo_despesa": "Manutenção" | "Seguro" | "IPVA" | "Multa" | "Outros",
      "descricao": "string",
      "valor": "decimal",
      "observacoes": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Despesa registrada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_despesa": "timestamp",
          "tipo_despesa": "string",
          "descricao": "string",
          "valor": "decimal",
          "observacoes": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /expenses`

*   **Descrição:** Lista as despesas do usuário autenticado, com opções de filtro.
*   **Método:** `GET`
*   **URL:** `/api/v1/expenses`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `vehicleId` (UUID): Filtrar por veículo específico.
    *   `startDate` (ISO 8601): Data de início para filtrar as despesas.
    *   `endDate` (ISO 8601): Data de fim para filtrar as despesas.
    *   `type` (string): Filtrar por tipo de despesa.
*   **Respostas:**
    *   **`200 OK`:** Lista de despesas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "id_veiculo": "uuid",
            "data_despesa": "timestamp",
            "tipo_despesa": "string",
            "descricao": "string",
            "valor": "decimal",
            "observacoes": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

## 3. Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação bem-sucedida sem conteúdo de retorno
- **400 Bad Request**: Dados inválidos na requisição
- **401 Unauthorized**: Token JWT inválido ou ausente
- **403 Forbidden**: Acesso negado
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## 4. Exemplos de Uso

### 4.1. Autenticação

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "senha": "minhasenha"}'

# Usar token em requisições subsequentes
curl -X GET http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

### 4.2. Cadastro de Veículo

```bash
curl -X POST http://localhost:3000/api/v1/vehicles \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Toyota",
    "modelo": "Corolla",
    "ano": 2020,
    "placa": "ABC-1234",
    "tipo_combustivel": "Flex",
    "tipo_uso": "Proprio"
  }'
```

### 4.3. Registro de Abastecimento

```bash
curl -X POST http://localhost:3000/api/v1/fuelings \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "id_veiculo": "uuid-do-veiculo",
    "data_abastecimento": "2023-10-15T10:30:00Z",
    "km_atual": 50000,
    "litros": 40.5,
    "valor_total": 200.00,
    "preco_litro": 4.94,
    "tipo_combustivel": "Gasolina",
    "posto": "Posto Shell"
  }'
```

## 5. Notas de Implementação

### 5.1. Middleware de Tratamento de Erros

A API utiliza um middleware personalizado (`asyncHandler`) para tratar erros em rotas assíncronas de forma centralizada. Isso garante que todas as exceções sejam capturadas e tratadas adequadamente.

### 5.2. Segurança

- O endpoint `/api/test` foi removido em produção para evitar exposição de informações desnecessárias
- Utilização de middlewares de segurança como Helmet
- Configuração adequada de CORS para controle de acesso

### 5.3. Organização do Código

- Imports organizados por categoria (bibliotecas externas, rotas, middlewares, configurações)
- Estrutura modular para facilitar manutenção e escalabilidade

## 6. Changelog

### Versão 1.1 (Atual)
- Adicionado middleware de tratamento de erros assíncronos
- Removido endpoint `/api/test` em produção
- Reorganização dos imports para melhor legibilidade
- Remoção de rotas não utilizadas (`fuelPricesRoutes`)
- Atualização da documentação com novos endpoints e melhorias de segurança

### Versão 1.0
- Versão inicial da API com endpoints básicos de autenticação, usuários, veículos, jornadas, abastecimentos e despesas

