# Documentação da API GiroPro

Este documento serve como a documentação oficial da API do sistema GiroPro, fornecendo detalhes abrangentes sobre todos os endpoints disponíveis, métodos HTTP, parâmetros de requisição, formatos de resposta e requisitos de autenticação. O objetivo é capacitar desenvolvedores a integrar-se eficientemente com o backend do GiroPro.

## 1. Visão Geral da API

A API do GiroPro é uma API RESTful, projetada para ser intuitiva e fácil de usar. Ela utiliza JSON para o corpo das requisições e respostas, e códigos de status HTTP padrão para indicar o resultado das operações. Todos os endpoints são versionados sob `/api/v1/` para garantir compatibilidade retroativa e permitir futuras expansões sem impactar as integrações existentes.

### 1.1. Base URL

A URL base para todos os endpoints da API é `[SEU_DOMINIO_AQUI]/api/v1/`.

### 1.2. Autenticação

A maioria dos endpoints da API requer autenticação. O GiroPro utiliza JSON Web Tokens (JWT) para autenticação. Após o login bem-sucedido, um token JWT é emitido e deve ser incluído no cabeçalho `Authorization` de todas as requisições subsequentes, no formato `Bearer <token>`.

### 1.3. Formato de Requisição e Resposta

Todas as requisições e respostas que contêm um corpo de dados utilizam o formato JSON (`Content-Type: application/json`).

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
      "km_inicio": "integer"
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

*   **Descrição:** Finaliza uma jornada existente, registrando a quilometragem final e o faturamento por plataforma.
*   **Método:** `PUT`
*   **URL:** `/api/v1/journeys/:id/end`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da jornada a ser finalizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "km_fim": "integer",
      "faturamento_por_plataforma": [
        {
          "id_plataforma": "uuid",
          "valor_faturado": "integer"
        }
      ],
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
          "observacoes": "string",
          "faturamento_por_plataforma": [
            {
              "id_plataforma": "uuid",
              "nome_plataforma": "string",
              "valor_faturado": "integer"
            }
          ]
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
            "observacoes": "string",
            "faturamento_por_plataforma": [
              {
                "id_plataforma": "uuid",
                "nome_plataforma": "string",
                "valor_faturado": "integer"
              }
            ]
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.5. Plataformas

#### `POST /platforms`

*   **Descrição:** Cria uma nova plataforma customizada para o usuário autenticado.
*   **Método:** `POST`
*   **URL:** `/api/v1/platforms`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "nome": "string"
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Plataforma criada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "nome": "string",
          "is_predefinida": false,
          "ativa": true,
          "created_at": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos ou nome de plataforma já existente para o usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /platforms`

*   **Descrição:** Lista todas as plataformas (predefinidas e customizadas) do usuário autenticado.
*   **Método:** `GET`
*   **URL:** `/api/v1/platforms`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Lista de plataformas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "nome": "string",
            "is_predefinida": true,
            "ativa": true
          },
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "nome": "string",
            "is_predefinida": false,
            "ativa": false
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /platforms/:id`

*   **Descrição:** Atualiza uma plataforma existente (nome, status de ativação).
*   **Método:** `PUT`
*   **URL:** `/api/v1/platforms/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da plataforma a ser atualizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "nome": "string" (opcional),
      "ativa": "boolean" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Plataforma atualizada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "nome": "string",
          "is_predefinida": false,
          "ativa": true,
          "updated_at": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Plataforma não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /platforms/:id`

*   **Descrição:** Remove uma plataforma customizada. Plataformas predefinidas (Uber, 99) não podem ser excluídas.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/platforms/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da plataforma a ser excluída.
*   **Respostas:**
    *   **`204 No Content`:** Plataforma excluída com sucesso.
    *   **`400 Bad Request`:** Tentativa de excluir plataforma predefinida.
    *   **`404 Not Found`:** Plataforma não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.6. Abastecimentos

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
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex",
      "quantidade_litros": "number",
      "valor_litro": "integer",
      "valor_total": "integer",
      "km_atual": "integer" (opcional),
      "nome_posto": "string" (opcional)
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
          "tipo_combustivel": "string",
          "quantidade_litros": "number",
          "valor_litro": "integer",
          "valor_total": "integer",
          "km_atual": "integer",
          "nome_posto": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /fuelings`

*   **Descrição:** Lista os abastecimentos do usuário autenticado, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuelings`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `id_veiculo` (UUID): Filtra por veículo.
    *   `start_date` (ISO 8601): Data de início para filtrar.
    *   `end_date` (ISO 8601): Data de fim para filtrar.
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
*   **Respostas:**
    *   **`200 OK`:** Lista de abastecimentos retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "id_veiculo": "uuid",
            "data_abastecimento": "timestamp",
            "tipo_combustivel": "string",
            "quantidade_litros": "number",
            "valor_litro": "integer",
            "valor_total": "integer",
            "km_atual": "integer",
            "nome_posto": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /fuelings/:id`

*   **Descrição:** Retorna os detalhes de um abastecimento específico pelo seu ID.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuelings/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do abastecimento.
*   **Respostas:**
    *   **`200 OK`:** Detalhes do abastecimento retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_abastecimento": "timestamp",
          "tipo_combustivel": "string",
          "quantidade_litros": "number",
          "valor_litro": "integer",
          "valor_total": "integer",
          "km_atual": "integer",
          "nome_posto": "string"
        }
        ```
    *   **`404 Not Found`:** Abastecimento não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /fuelings/:id`

*   **Descrição:** Atualiza os detalhes de um abastecimento existente.
*   **Método:** `PUT`
*   **URL:** `/api/v1/fuelings/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do abastecimento a ser atualizado.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid" (opcional),
      "data_abastecimento": "timestamp (ISO 8601)" (opcional),
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex" (opcional),
      "quantidade_litros": "number" (opcional),
      "valor_litro": "integer" (opcional),
      "valor_total": "integer" (opcional),
      "km_atual": "integer" (opcional),
      "nome_posto": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Abastecimento atualizado com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_abastecimento": "timestamp",
          "tipo_combustivel": "string",
          "quantidade_litros": "number",
          "valor_litro": "integer",
          "valor_total": "integer",
          "km_atual": "integer",
          "nome_posto": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Abastecimento não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /fuelings/:id`

*   **Descrição:** Exclui um abastecimento existente.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/fuelings/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do abastecimento a ser excluído.
*   **Respostas:**
    *   **`204 No Content`:** Abastecimento excluído com sucesso.
    *   **`404 Not Found`:** Abastecimento não encontrado ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.7. Despesas

#### `POST /expenses`

*   **Descrição:** Registra uma nova despesa para o usuário autenticado.
*   **Método:** `POST`
*   **URL:** `/api/v1/expenses`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid" (opcional),
      "data_despesa": "timestamp (ISO 8601)",
      "tipo_despesa": "Manutencao" | "Pneus" | "Seguro" | "Outros",
      "valor_despesa": "integer",
      "descricao": "string"
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
          "valor_despesa": "integer",
          "descricao": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /expenses`

*   **Descrição:** Lista as despesas do usuário autenticado, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/expenses`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `id_veiculo` (UUID): Filtra por veículo.
    *   `tipo_despesa` (string): Filtra por tipo de despesa.
    *   `start_date` (ISO 8601): Data de início para filtrar.
    *   `end_date` (ISO 8601): Data de fim para filtrar.
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
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
            "valor_despesa": "integer",
            "descricao": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /expenses/:id`

*   **Descrição:** Retorna os detalhes de uma despesa específica pelo seu ID.
*   **Método:** `GET`
*   **URL:** `/api/v1/expenses/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da despesa.
*   **Respostas:**
    *   **`200 OK`:** Detalhes da despesa retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_despesa": "timestamp",
          "tipo_despesa": "string",
          "valor_despesa": "integer",
          "descricao": "string"
        }
        ```
    *   **`404 Not Found`:** Despesa não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /expenses/:id`

*   **Descrição:** Atualiza os detalhes de uma despesa existente.
*   **Método:** `PUT`
*   **URL:** `/api/v1/expenses/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da despesa a ser atualizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid" (opcional),
      "data_despesa": "timestamp (ISO 8601)" (opcional),
      "tipo_despesa": "Manutencao" | "Pneus" | "Seguro" | "Outros" (opcional),
      "valor_despesa": "integer" (opcional),
      "descricao": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Despesa atualizada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "id_veiculo": "uuid",
          "data_despesa": "timestamp",
          "tipo_despesa": "string",
          "valor_despesa": "integer",
          "descricao": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Despesa não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /expenses/:id`

*   **Descrição:** Exclui uma despesa existente.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/expenses/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da despesa a ser excluída.
*   **Respostas:**
    *   **`204 No Content`:** Despesa excluída com sucesso.
    *   **`404 Not Found`:** Despesa não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.8. Dashboard

#### `GET /dashboard/summary`

*   **Descrição:** Retorna um resumo consolidado de lucratividade e métricas chave para o período selecionado.
*   **Método:** `GET`
*   **URL:** `/api/v1/dashboard/summary`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `start_date` (ISO 8601): Data de início para o resumo.
    *   `end_date` (ISO 8601): Data de fim para o resumo.
*   **Respostas:**
    *   **`200 OK`:** Resumo retornado com sucesso.

        ```json
        {
          "faturamento_bruto": "integer",
          "total_despesas": "integer",
          "total_combustivel": "integer",
          "lucro_liquido": "integer",
          "km_rodados": "integer",
          "total_jornadas": "integer",
          "faturamento_por_plataforma": [
            {
              "nome_plataforma": "string",
              "valor": "integer"
            }
          ]
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /dashboard/evolution`

*   **Descrição:** Retorna dados para gráficos de evolução temporal de receitas e despesas.
*   **Método:** `GET`
*   **URL:** `/api/v1/dashboard/evolution`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `period` (string): Período da evolução (ex: "week", "month", "year").
*   **Respostas:**
    *   **`200 OK`:** Dados de evolução retornados com sucesso.

        ```json
        [
          {
            "data": "string (YYYY-MM-DD)",
            "receita": "integer",
            "despesa": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /dashboard/vehicles`

*   **Descrição:** Retorna dados para comparativo de desempenho entre veículos.
*   **Método:** `GET`
*   **URL:** `/api/v1/dashboard/vehicles`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Dados de veículos retornados com sucesso.

        ```json
        [
          {
            "id_veiculo": "uuid",
            "modelo": "string",
            "km_rodados": "integer",
            "lucro_liquido": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.9. Preços de Combustível

#### `GET /fuel-prices`

*   **Descrição:** Retorna os preços de combustível para uma determinada localização.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuel-prices`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `city` (string): Cidade para buscar os preços.
    *   `state` (string): Estado para buscar os preços.
    *   `fuel_type` (string): Tipo de combustível (ex: "Gasolina", "Etanol").
*   **Respostas:**
    *   **`200 OK`:** Preços de combustível retornados com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "city": "string",
            "state": "string",
            "fuel_type": "string",
            "average_price": "integer",
            "last_updated": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /fuel-prices/history`

*   **Descrição:** Retorna o histórico de preços de combustível para uma determinada localização e tipo de combustível.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuel-prices/history`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `city` (string): Cidade para buscar o histórico.
    *   `state` (string): Estado para buscar o histórico.
    *   `fuel_type` (string): Tipo de combustível.
    *   `start_date` (ISO 8601): Data de início para o histórico.
    *   `end_date` (ISO 8601): Data de fim para o histórico.
*   **Respostas:**
    *   **`200 OK`:** Histórico de preços retornado com sucesso.

        ```json
        [
          {
            "date": "string (YYYY-MM-DD)",
            "average_price": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.10. Metas

#### `POST /goals`

*   **Descrição:** Cria uma nova meta para o usuário autenticado.
*   **Método:** `POST`
*   **URL:** `/api/v1/goals`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid" (opcional),
      "titulo": "string",
      "descricao": "string" (opcional),
      "tipo_meta": "Faturamento" | "Quilometragem" | "Jornadas" | "Economia" | "Lucro",
      "periodo_meta": "Semanal" | "Mensal" | "Trimestral" | "Anual",
      "valor_objetivo": "integer",
      "data_inicio": "timestamp (ISO 8601)",
      "data_fim": "timestamp (ISO 8601)"
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Meta criada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "titulo": "string",
          "tipo_meta": "string",
          "valor_objetivo": "integer",
          "status_meta": "ativa"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /goals`

*   **Descrição:** Lista as metas do usuário autenticado, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/goals`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `status` (string): Filtra por status da meta (ex: "ativa", "concluida").
    *   `type` (string): Filtra por tipo de meta.
    *   `period` (string): Filtra por período da meta.
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
*   **Respostas:**
    *   **`200 OK`:** Lista de metas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "titulo": "string",
            "tipo_meta": "string",
            "valor_objetivo": "integer",
            "valor_atual": "integer",
            "percentual_concluido": "integer",
            "status_meta": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /goals/:id`

*   **Descrição:** Retorna os detalhes de uma meta específica pelo seu ID.
*   **Método:** `GET`
*   **URL:** `/api/v1/goals/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da meta.
*   **Respostas:**
    *   **`200 OK`:** Detalhes da meta retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "titulo": "string",
          "descricao": "string",
          "tipo_meta": "string",
          "periodo_meta": "string",
          "valor_objetivo": "integer",
          "data_inicio": "timestamp",
          "data_fim": "timestamp",
          "status_meta": "string",
          "valor_atual": "integer",
          "percentual_concluido": "integer"
        }
        ```
    *   **`404 Not Found`:** Meta não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /goals/:id`

*   **Descrição:** Atualiza os detalhes de uma meta existente.
*   **Método:** `PUT`
*   **URL:** `/api/v1/goals/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da meta a ser atualizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "titulo": "string" (opcional),
      "descricao": "string" (opcional),
      "tipo_meta": "Faturamento" | "Quilometragem" | "Jornadas" | "Economia" | "Lucro" (opcional),
      "periodo_meta": "Semanal" | "Mensal" | "Trimestral" | "Anual" (opcional),
      "valor_objetivo": "integer" (opcional),
      "data_inicio": "timestamp (ISO 8601)" (opcional),
      "data_fim": "timestamp (ISO 8601)" (opcional),
      "status_meta": "ativa" | "pausada" | "concluida" | "expirada" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Meta atualizada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "titulo": "string",
          "tipo_meta": "string",
          "valor_objetivo": "integer",
          "valor_atual": "integer",
          "percentual_concluido": "integer",
          "status_meta": "string"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Meta não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /goals/:id`

*   **Descrição:** Exclui uma meta existente.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/goals/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da meta a ser excluída.
*   **Respostas:**
    *   **`204 No Content`:** Meta excluída com sucesso.
    *   **`404 Not Found`:** Meta não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

### 2.11. Notificações

#### `GET /notifications`

*   **Descrição:** Lista as notificações do usuário autenticado, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/notifications`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `read` (boolean): Filtra por notificações lidas ou não lidas.
    *   `type` (string): Filtra por tipo de notificação (ex: "sistema", "alerta").
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
*   **Respostas:**
    *   **`200 OK`:** Lista de notificações retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "type": "string",
            "title": "string",
            "message": "string",
            "read": "boolean",
            "sent_at": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /notifications/:id/read`

*   **Descrição:** Marca uma notificação como lida.
*   **Método:** `PUT`
*   **URL:** `/api/v1/notifications/:id/read`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da notificação a ser marcada como lida.
*   **Respostas:**
    *   **`200 OK`:** Notificação marcada como lida com sucesso.

        ```json
        {
          "id": "uuid",
          "read": true
        }
        ```
    *   **`404 Not Found`:** Notificação não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /notifications/:id`

*   **Descrição:** Exclui uma notificação existente.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/notifications/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da notificação a ser excluída.
*   **Respostas:**
    *   **`204 No Content`:** Notificação excluída com sucesso.
    *   **`404 Not Found`:** Notificação não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

