# Referência: API Endpoints do GiroPro

Este documento fornece uma visão detalhada das APIs do backend do projeto **GiroPro**. Ele serve como referência para desenvolvedores que precisam interagir com a API.

As APIs são construídas seguindo o padrão RESTful, utilizando JSON para comunicação. Os endpoints são versionados (`/api/v1/`) para permitir evoluções futuras sem quebrar clientes existentes.

## 1. 🔑 Autenticação

### 1.1. `POST /api/v1/auth/register`

*   **Descrição:** Registra um novo usuário.
*   **Payload (Request Body):**

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string"
}
```

*   **Resposta (Status 201 Created):**

```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "status_conta": "Ativo",
  "data_cadastro": "timestamp"
}
```

### 1.2. `POST /api/v1/auth/login`

*   **Descrição:** Autentica um usuário e retorna um token JWT.
*   **Payload (Request Body):**

```json
{
  "email": "string",
  "senha": "string"
}
```

*   **Resposta (Status 200 OK):**

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

## 2. 🧑‍💻 Usuários

### 2.1. `GET /api/v1/users/me`

*   **Descrição:** Retorna os dados do usuário autenticado.
*   **Autenticação:** Requer token JWT válido no cabeçalho `Authorization: Bearer <token>`.
*   **Resposta (Status 200 OK):**

```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "status_conta": "Ativo",
  "data_cadastro": "timestamp"
}
```

## 3. 🚚 Veículos

### 3.1. `POST /api/v1/vehicles`

*   **Descrição:** Cadastra um novo veículo para o usuário autenticado.
*   **Autenticação:** Requer token JWT válido.
*   **Payload (Request Body):**

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

*   **Resposta (Status 201 Created):**

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

### 3.2. `GET /api/v1/vehicles`

*   **Descrição:** Lista os veículos do usuário autenticado.
*   **Autenticação:** Requer token JWT válido.
*   **Resposta (Status 200 OK):**

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

## 4. 🛣️ Jornadas

### 4.1. `POST /api/v1/journeys/start`

*   **Descrição:** Inicia uma nova jornada.
*   **Autenticação:** Requer token JWT válido.
*   **Payload (Request Body):**

```json
{
  "id_veiculo": "uuid",
  "km_inicio": "integer",
  "data_inicio": "timestamp (ISO 8601)"
}
```

*   **Resposta (Status 201 Created):**

```json
{
  "id": "uuid",
  "id_usuario": "uuid",
  "id_veiculo": "uuid",
  "data_inicio": "timestamp",
  "km_inicio": "integer"
}
```

### 4.2. `PUT /api/v1/journeys/:id/end`

*   **Descrição:** Finaliza uma jornada existente.
*   **Autenticação:** Requer token JWT válido.
*   **Parâmetros de Rota:** `id` (UUID da jornada).
*   **Payload (Request Body):**

```json
{
  "km_fim": "integer",
  "data_fim": "timestamp (ISO 8601)",
  "ganho_bruto": "integer",
  "observacoes": "string" (opcional)
}
```

*   **Resposta (Status 200 OK):**

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

### 4.3. `GET /api/v1/journeys`

*   **Descrição:** Lista as jornadas do usuário autenticado.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):**
    *   `startDate`: Data de início para filtro (ISO 8601).
    *   `endDate`: Data de fim para filtro (ISO 8601).
    *   `page`: Número da página (default: 1).
    *   `limit`: Itens por página (default: 10).

*   **Resposta (Status 200 OK):**

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

## 5. ⛽ Abastecimentos

### 5.1. `POST /api/v1/fuelings`

*   **Descrição:** Registra um novo abastecimento.
*   **Autenticação:** Requer token JWT válido.
*   **Payload (Request Body):**

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

*   **Resposta (Status 201 Created):**

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

### 5.2. `GET /api/v1/fuelings`

*   **Descrição:** Lista os abastecimentos do usuário autenticado.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):** `startDate`, `endDate`, `page`, `limit`.
*   **Resposta (Status 200 OK):**

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

## 6. 💸 Despesas

### 6.1. `POST /api/v1/expenses`

*   **Descrição:** Registra uma nova despesa.
*   **Autenticação:** Requer token JWT válido.
*   **Payload (Request Body):**

```json
{
  "id_veiculo": "uuid" (opcional),
  "data_despesa": "timestamp (ISO 8601)",
  "tipo_despesa": "Manutencao" | "Pneus" | "Seguro" | "Outros",
  "valor_despesa": "integer",
  "descricao": "string" (opcional)
}
```

*   **Resposta (Status 201 Created):**

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

### 6.2. `GET /api/v1/expenses`

*   **Descrição:** Lista as despesas do usuário autenticado.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):** `startDate`, `endDate`, `page`, `limit`.
*   **Resposta (Status 200 OK):**

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

