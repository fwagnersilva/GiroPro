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

*   **Descrição:** Registra um novo abastecimento para um veículo.
*   **Método:** `POST`
*   **URL:** `/api/v1/fuelings`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "id_veiculo": "uuid",
      "data_abastecimento": "timestamp (ISO 8601)",
      "tipo_combustivel": "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex",
      "quantidade_litros": "integer",
      "valor_litro": "integer",
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
          "quantidade_litros": "integer",
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
    *   `startDate` (ISO 8601): Data de início para filtrar os abastecimentos.
    *   `endDate` (ISO 8601): Data de fim para filtrar os abastecimentos.
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
            "quantidade_litros": "integer",
            "valor_litro": "integer",
            "valor_total": "integer",
            "km_atual": "integer",
            "nome_posto": "string"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.6. Despesas

#### `POST /expenses`

*   **Descrição:** Registra uma nova despesa.
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
      "descricao": "string" (opcional)
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
    *   `startDate` (ISO 8601): Data de início para filtrar as despesas.
    *   `endDate` (ISO 8601): Data de fim para filtrar as despesas.
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




### 2.7. Preços de Combustível

#### `GET /fuel-prices`

*   **Descrição:** Retorna os preços médios de combustível por tipo e localização.
*   **Método:** `GET`
*   **URL:** `/api/v1/fuel-prices`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `latitude` (float): Latitude para filtrar os preços por localização.
    *   `longitude` (float): Longitude para filtrar os preços por localização.
    *   `raio` (integer): Raio em km para a busca por localização (padrão: 50).
    *   `tipo_combustivel`: Tipo de combustível para filtrar (Gasolina, Etanol, Diesel, GNV, Flex).
*   **Respostas:**
    *   **`200 OK`:** Lista de preços de combustível retornada com sucesso.

        ```json
        [
          {
            "tipo_combustivel": "string",
            "preco_medio": "float",
            "unidade": "string",
            "localizacao": {
              "latitude": "float",
              "longitude": "float"
            }
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.8. Administração

#### `GET /admin/users`

*   **Descrição:** Lista todos os usuários do sistema (acesso restrito a administradores).
*   **Método:** `GET`
*   **URL:** `/api/v1/admin/users`
*   **Autenticação:** Requer token JWT válido com permissões de administrador.
*   **Parâmetros de Query (Opcional):**
    *   `page` (integer): Número da página (padrão: 1).
    *   `limit` (integer): Quantidade de itens por página (padrão: 10).
*   **Respostas:**
    *   **`200 OK`:** Lista de usuários retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "nome": "string",
            "email": "string",
            "status_conta": "Ativo",
            "data_cadastro": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido ou sem permissões de administrador.

#### `GET /admin/users/:id`

*   **Descrição:** Retorna os detalhes de um usuário específico pelo seu ID (acesso restrito a administradores).
*   **Método:** `GET`
*   **URL:** `/api/v1/admin/users/:id`
*   **Autenticação:** Requer token JWT válido com permissões de administrador.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do usuário.
*   **Respostas:**
    *   **`200 OK`:** Detalhes do usuário retornados com sucesso.

        ```json
        {
          "id": "uuid",
          "nome": "string",
          "email": "string",
          "status_conta": "Ativo",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`404 Not Found`:** Usuário não encontrado.
    *   **`401 Unauthorized`:** Token JWT inválido ou sem permissões de administrador.

#### `PUT /admin/users/:id`

*   **Descrição:** Atualiza os detalhes de um usuário existente (acesso restrito a administradores).
*   **Método:** `PUT`
*   **URL:** `/api/v1/admin/users/:id`
*   **Autenticação:** Requer token JWT válido com permissões de administrador.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do usuário a ser atualizado.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "nome": "string" (opcional),
      "email": "string" (opcional),
      "status_conta": "Ativo" | "Inativo" | "Bloqueado" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Usuário atualizado com sucesso.

        ```json
        {
          "id": "uuid",
          "nome": "string",
          "email": "string",
          "status_conta": "Ativo",
          "data_cadastro": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`404 Not Found`:** Usuário não encontrado.
    *   **`401 Unauthorized`:** Token JWT inválido ou sem permissões de administrador.

#### `DELETE /admin/users/:id`

*   **Descrição:** Exclui um usuário existente (acesso restrito a administradores).
*   **Método:** `DELETE`
*   **URL:** `/api/v1/admin/users/:id`
*   **Autenticação:** Requer token JWT válido com permissões de administrador.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID do usuário a ser excluído.
*   **Respostas:**
    *   **`204 No Content`:** Usuário excluído com sucesso.
    *   **`404 Not Found`:** Usuário não encontrado.
    *   **`401 Unauthorized`:** Token JWT inválido ou sem permissões de administrador.




### 2.9. Análises

#### `GET /analytics/summary`

*   **Descrição:** Retorna um resumo das principais métricas financeiras e operacionais do usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/analytics/summary`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `periodo` (string): Período para o resumo (ex: 'semana', 'mes', 'ano').
*   **Respostas:**
    *   **`200 OK`:** Resumo analítico retornado com sucesso.

        ```json
        {
          "total_ganhos": "integer",
          "total_despesas": "integer",
          "lucro_liquido": "integer",
          "km_rodados": "integer",
          "media_ganho_por_km": "float",
          "media_despesa_por_km": "float"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /analytics/trends`

*   **Descrição:** Retorna dados de tendências para ganhos, despesas e lucro ao longo do tempo.
*   **Método:** `GET`
*   **URL:** `/api/v1/analytics/trends`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `tipo` (string): Tipo de tendência (ex: 'diario', 'semanal', 'mensal').
    *   `periodo` (integer): Número de períodos a serem considerados.
*   **Respostas:**
    *   **`200 OK`:** Dados de tendências retornados com sucesso.

        ```json
        [
          {
            "data": "string (YYYY-MM-DD)",
            "ganhos": "integer",
            "despesas": "integer",
            "lucro": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.10. Dashboard

#### `GET /dashboard/summary`

*   **Descrição:** Retorna dados resumidos para exibição no dashboard principal do usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/dashboard/summary`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Dados do dashboard retornados com sucesso.

        ```json
        {
          "ganhos_hoje": "integer",
          "despesas_hoje": "integer",
          "lucro_hoje": "integer",
          "km_rodados_hoje": "integer",
          "ganhos_semana": "integer",
          "despesas_semana": "integer",
          "lucro_semana": "integer",
          "km_rodados_semana": "integer",
          "veiculos_ativos": "integer",
          "proxima_manutencao": "timestamp" (opcional)
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.11. Gamificação

#### `GET /gamification/achievements`

*   **Descrição:** Retorna a lista de conquistas do usuário e seu status.
*   **Método:** `GET`
*   **URL:** `/api/v1/gamification/achievements`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Lista de conquistas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "nome": "string",
            "descricao": "string",
            "progresso": "integer",
            "total": "integer",
            "concluida": "boolean",
            "data_conclusao": "timestamp" (opcional)
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /gamification/leaderboard`

*   **Descrição:** Retorna o ranking de usuários baseado em métricas de gamificação.
*   **Método:** `GET`
*   **URL:** `/api/v1/gamification/leaderboard`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `top` (integer): Número de usuários no topo do ranking (padrão: 10).
    *   `criterio` (string): Critério de ranking (ex: 'ganhos', 'km_rodados', 'conquistas').
*   **Respostas:**
    *   **`200 OK`:** Ranking retornado com sucesso.

        ```json
        [
          {
            "id_usuario": "uuid",
            "nome_usuario": "string",
            "valor": "integer",
            "posicao": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.12. Metas

#### `POST /goals`

*   **Descrição:** Cria uma nova meta para o usuário.
*   **Método:** `POST`
*   **URL:** `/api/v1/goals`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "tipo_meta": "Ganho" | "Economia" | "KM",
      "valor_alvo": "integer",
      "data_limite": "timestamp (ISO 8601)",
      "descricao": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Meta criada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "tipo_meta": "string",
          "valor_alvo": "integer",
          "data_limite": "timestamp",
          "progresso_atual": "integer",
          "status": "Em Andamento",
          "data_criacao": "timestamp"
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /goals`

*   **Descrição:** Lista as metas do usuário, com opções de filtro.
*   **Método:** `GET`
*   **URL:** `/api/v1/goals`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `status`: Filtrar por status (Em Andamento, Concluída, Atrasada).
*   **Respostas:**
    *   **`200 OK`:** Lista de metas retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "tipo_meta": "string",
            "valor_alvo": "integer",
            "data_limite": "timestamp",
            "progresso_atual": "integer",
            "status": "Em Andamento",
            "data_criacao": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /goals/:id`

*   **Descrição:** Atualiza uma meta existente.
*   **Método:** `PUT`
*   **URL:** `/api/v1/goals/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da meta a ser atualizada.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "valor_alvo": "integer" (opcional),
      "data_limite": "timestamp (ISO 8601)" (opcional),
      "descricao": "string" (opcional)
    }
    ```

*   **Respostas:**
    *   **`200 OK`:** Meta atualizada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "tipo_meta": "string",
          "valor_alvo": "integer",
          "data_limite": "timestamp",
          "progresso_atual": "integer",
          "status": "Em Andamento",
          "data_criacao": "timestamp"
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




### 2.13. Insights

#### `GET /insights`

*   **Descrição:** Retorna insights e recomendações personalizadas para o usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/insights`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `tipo` (string): Filtrar por tipo de insight (ex: 'economia', 'performance', 'manutencao').
    *   `periodo` (string): Período para os insights (ex: 'semana', 'mes').
*   **Respostas:**
    *   **`200 OK`:** Lista de insights retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "titulo": "string",
            "mensagem": "string",
            "tipo": "string",
            "data_geracao": "timestamp"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.14. Multi-Veículo

#### `GET /multi-vehicle/summary`

*   **Descrição:** Retorna um resumo consolidado de métricas para todos os veículos do usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/multi-vehicle/summary`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Resumo multi-veículo retornado com sucesso.

        ```json
        {
          "total_veiculos": "integer",
          "ganhos_consolidados": "integer",
          "despesas_consolidadas": "integer",
          "lucro_consolidado": "integer",
          "km_consolidados": "integer"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /multi-vehicle/performance`

*   **Descrição:** Retorna dados de performance individual para cada veículo do usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/multi-vehicle/performance`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Dados de performance por veículo retornados com sucesso.

        ```json
        [
          {
            "id_veiculo": "uuid",
            "modelo_veiculo": "string",
            "ganhos": "integer",
            "despesas": "integer",
            "lucro": "integer",
            "km_rodados": "integer",
            "media_consumo": "float"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.15. Notificações

#### `POST /notifications`

*   **Descrição:** Cria uma nova notificação para o usuário.
*   **Método:** `POST`
*   **URL:** `/api/v1/notifications`
*   **Autenticação:** Requer token JWT válido.
*   **Corpo da Requisição (JSON):**

    ```json
    {
      "tipo": "info" | "warning" | "success" | "error" | "insight" | "recommendation",
      "titulo": "string" (max 100 chars),
      "mensagem": "string" (max 500 chars),
      "dados_extras": "object" (opcional)
    }
    ```

*   **Respostas:**
    *   **`201 Created`:** Notificação criada com sucesso.

        ```json
        {
          "id": "uuid",
          "id_usuario": "uuid",
          "tipo": "string",
          "titulo": "string",
          "mensagem": "string",
          "lida": "boolean",
          "data_criacao": "timestamp",
          "dados_extras": "object" (opcional)
        }
        ```
    *   **`400 Bad Request`:** Dados inválidos.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /notifications`

*   **Descrição:** Retorna a lista de notificações do usuário, com opções de filtro e paginação.
*   **Método:** `GET`
*   **URL:** `/api/v1/notifications`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `limit` (integer): Limite de notificações por página (1-100, padrão: 20).
    *   `offset` (integer): Offset para paginação (padrão: 0).
    *   `onlyUnread` (boolean): Se `true`, retorna apenas notificações não lidas.
    *   `tipo` (string): Filtrar por tipo de notificação.
*   **Respostas:**
    *   **`200 OK`:** Lista de notificações retornada com sucesso.

        ```json
        [
          {
            "id": "uuid",
            "id_usuario": "uuid",
            "tipo": "string",
            "titulo": "string",
            "mensagem": "string",
            "lida": "boolean",
            "data_criacao": "timestamp",
            "dados_extras": "object" (opcional)
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /notifications/:id/read`

*   **Descrição:** Marca uma notificação específica como lida.
*   **Método:** `PUT`
*   **URL:** `/api/v1/notifications/:id/read`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da notificação a ser marcada como lida.
*   **Respostas:**
    *   **`200 OK`:** Notificação marcada como lida com sucesso.
    *   **`404 Not Found`:** Notificação não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `PUT /notifications/read-all`

*   **Descrição:** Marca todas as notificações do usuário como lidas.
*   **Método:** `PUT`
*   **URL:** `/api/v1/notifications/read-all`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Todas as notificações marcadas como lidas com sucesso.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /notifications/unread-count`

*   **Descrição:** Retorna a contagem de notificações não lidas para o usuário.
*   **Método:** `GET`
*   **URL:** `/api/v1/notifications/unread-count`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Contagem de notificações não lidas retornada com sucesso.

        ```json
        {
          "count": "integer"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `DELETE /notifications/:id`

*   **Descrição:** Deleta uma notificação específica.
*   **Método:** `DELETE`
*   **URL:** `/api/v1/notifications/:id`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:**
    *   `id` (UUID): O ID da notificação a ser deletada.
*   **Respostas:**
    *   **`204 No Content`:** Notificação deletada com sucesso.
    *   **`404 Not Found`:** Notificação não encontrada ou não pertence ao usuário.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `POST /notifications/process-automatic`

*   **Descrição:** Processa e gera notificações automáticas baseadas em insights e regras de negócio.
*   **Método:** `POST`
*   **URL:** `/api/v1/notifications/process-automatic`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Notificações automáticas processadas com sucesso.
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `POST /notifications/test`

*   **Descrição:** Gera uma notificação de teste para o usuário autenticado.
*   **Método:** `POST`
*   **URL:** `/api/v1/notifications/test`
*   **Autenticação:** Requer token JWT válido.
*   **Respostas:**
    *   **`200 OK`:** Notificação de teste gerada com sucesso.
    *   **`401 Unauthorized`:** Token JWT inválido.




### 2.16. Relatórios

#### `GET /reports/journey-earnings`

*   **Descrição:** Retorna um relatório detalhado dos ganhos por jornada.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/journey-earnings`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `startDate` (ISO 8601): Data de início para o relatório.
    *   `endDate` (ISO 8601): Data de fim para o relatório.
*   **Respostas:**
    *   **`200 OK`:** Relatório de ganhos por jornada retornado com sucesso.

        ```json
        [
          {
            "jornada_id": "uuid",
            "data_inicio": "timestamp",
            "data_fim": "timestamp",
            "ganho_bruto": "integer",
            "km_rodados": "integer",
            "ganho_por_km": "float"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/expense-analysis`

*   **Descrição:** Retorna um relatório de análise de despesas por categoria.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/expense-analysis`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `startDate` (ISO 8601): Data de início para o relatório.
    *   `endDate` (ISO 8601): Data de fim para o relatório.
*   **Respostas:**
    *   **`200 OK`:** Relatório de análise de despesas retornado com sucesso.

        ```json
        [
          {
            "tipo_despesa": "string",
            "total_gasto": "integer",
            "percentual": "float"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/fuel-consumption`

*   **Descrição:** Retorna um relatório de consumo de combustível por veículo.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/fuel-consumption`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `startDate` (ISO 8601): Data de início para o relatório.
    *   `endDate` (ISO 8601): Data de fim para o relatório.
    *   `id_veiculo` (uuid): Filtrar por veículo específico.
*   **Respostas:**
    *   **`200 OK`:** Relatório de consumo de combustível retornado com sucesso.

        ```json
        [
          {
            "id_veiculo": "uuid",
            "modelo_veiculo": "string",
            "total_litros": "integer",
            "total_gasto": "integer",
            "media_km_por_litro": "float"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/weekly`

*   **Descrição:** Retorna um relatório semanal de faturamento, despesas e lucro.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/weekly`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `data_referencia` (ISO 8601): Data para referência da semana (qualquer dia da semana desejada).
*   **Respostas:**
    *   **`200 OK`:** Relatório semanal retornado com sucesso.

        ```json
        {
          "semana": "string (YYYY-WW)",
          "ganhos": "integer",
          "despesas": "integer",
          "lucro": "integer"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/monthly`

*   **Descrição:** Retorna um relatório mensal de faturamento, despesas e lucro.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/monthly`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `data_referencia` (ISO 8601): Data para referência do mês (qualquer dia do mês desejado).
*   **Respostas:**
    *   **`200 OK`:** Relatório mensal retornado com sucesso.

        ```json
        {
          "mes": "string (YYYY-MM)",
          "ganhos": "integer",
          "despesas": "integer",
          "lucro": "integer"
        }
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/weekly-comparison`

*   **Descrição:** Retorna um comparativo de múltiplas semanas para ganhos, despesas e lucro.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/weekly-comparison`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `num_semanas` (integer): Número de semanas para comparar (padrão: 4).
*   **Respostas:**
    *   **`200 OK`:** Comparativo semanal retornado com sucesso.

        ```json
        [
          {
            "semana": "string (YYYY-WW)",
            "ganhos": "integer",
            "despesas": "integer",
            "lucro": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.

#### `GET /reports/monthly-comparison`

*   **Descrição:** Retorna um comparativo de múltiplos meses para ganhos, despesas e lucro.
*   **Método:** `GET`
*   **URL:** `/api/v1/reports/monthly-comparison`
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Query (Opcional):**
    *   `num_meses` (integer): Número de meses para comparar (padrão: 3).
*   **Respostas:**
    *   **`200 OK`:** Comparativo mensal retornado com sucesso.

        ```json
        [
          {
            "mes": "string (YYYY-MM)",
            "ganhos": "integer",
            "despesas": "integer",
            "lucro": "integer"
          }
        ]
        ```
    *   **`401 Unauthorized`:** Token JWT inválido.



