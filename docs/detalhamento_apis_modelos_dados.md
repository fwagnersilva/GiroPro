# 🚀 Detalhamento de APIs e Modelos de Dados do GiroPro

Este documento fornece uma visão detalhada das APIs do backend e dos modelos de dados (schemas do banco de dados) utilizados no projeto **GiroPro**. Ele serve como referência para desenvolvedores que precisam interagir com a API ou entender a estrutura de dados.

## 1. 🗄️ Modelos de Dados (Schemas do Banco de Dados)

Os modelos de dados são definidos usando **Drizzle ORM** no backend, mapeando diretamente para as tabelas do PostgreSQL. As definições abaixo representam a estrutura lógica das tabelas.

### 1.1. 👤 `usuarios`

Representa os usuários do aplicativo (motoristas).

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  senha_hash: text("senha_hash").notNull(),
  status_conta: text("status_conta").default("Ativo").notNull(),
  data_cadastro: text("data_cadastro").notNull(),
  pontos_total: integer("pontos_total").default(0).notNull(),
  nivel_usuario: text("nivel_usuario").default("Iniciante").notNull(),
  conquistas_desbloqueadas: integer("conquistas_desbloqueadas").default(0).notNull(),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id` (UUID): Garante unicidade global e facilita a escalabilidade em ambientes distribuídos.
*   `email` (UNIQUE): Garante que cada usuário tenha um email único para login.
*   `senha_hash`: Armazena o hash da senha, nunca a senha em texto claro, para segurança.
*   `status_conta`: ENUM para estados predefinidos da conta, garantindo consistência.
*   `deleted_at`: Implementa *soft delete*, preservando dados históricos e permitindo recuperação.

### 1.2. 🚗 `veiculos`

Representa os veículos utilizados pelos motoristas.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';

export const tipoCombustivelEnum = ['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex'] as const;
export const tipoUsoEnum = ['Proprio', 'Alugado', 'Financiado'] as const;

export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull().unique(),
  tipo_combustivel: text("tipo_combustivel", { enum: tipoCombustivelEnum }).notNull(),
  tipo_uso: text("tipo_uso", { enum: tipoUsoEnum }).notNull(),
  valor_aluguel: integer("valor_aluguel"),
  valor_prestacao: integer("valor_prestacao"),
  media_consumo: integer("media_consumo"),
  data_cadastro: text("data_cadastro").notNull(),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_usuario`: Chave estrangeira para `usuarios`, indicando o proprietário do veículo.
*   `placa` (UNIQUE): Garante que cada placa seja única no sistema.
*   `tipo_combustivel`, `tipo_uso`: ENUMs para padronizar as opções.
*   `valor_aluguel`, `valor_prestacao`: Campos opcionais para tipos de uso específicos. No futuro, pode ser refatorado para um modelo mais flexível (e.g., JSONB ou tabela de atributos).
*   `media_consumo`: Campo para armazenar a média de consumo, a ser atualizado por gatilho ou serviço.

### 1.3. 🗺️ `jornadas`

Registra as jornadas de trabalho dos motoristas.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';
import { veiculos } from './veiculos';

export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").notNull().references(() => veiculos.id),
  data_inicio: text("data_inicio").notNull(),
  km_inicio: integer("km_inicio").notNull(),
  data_fim: text("data_fim"),
  km_fim: integer("km_fim"),
  ganho_bruto: integer("ganho_bruto"),
  km_total: integer("km_total"),
  tempo_total: integer("tempo_total"),
  observacoes: text("observacoes"),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_usuario`, `id_veiculo`: Chaves estrangeiras para associar a jornada ao usuário e veículo.
*   `data_inicio`, `data_fim` (`withTimezone: true`): Armazenam datas e horas com fuso horário, preferencialmente em UTC, para evitar problemas de fuso horário.
*   `km_total`, `tempo_total`: Campos calculados para facilitar consultas e relatórios.

### 1.4. ⛽ `abastecimentos`

Registra os abastecimentos de combustível.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';
import { veiculos, tipoCombustivelEnum } from './veiculos';

export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").notNull().references(() => veiculos.id),
  data_abastecimento: text("data_abastecimento").notNull(),
  tipo_combustivel: text("tipo_combustivel", { enum: tipoCombustivelEnum }).notNull(),
  litros: integer("litros").notNull(),
  preco_litro: integer("preco_litro").notNull(),
  valor_total: integer("valor_total").notNull(),
  km_atual: integer("km_atual"),
  nome_posto: text("nome_posto"),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_usuario`, `id_veiculo`: Chaves estrangeiras.
*   `valor_total`: Campo calculado (`quantidade_litros * valor_litro`).
*   `km_atual`: Importante para calcular a média de consumo.
*   `nome_posto`: Adicionado para permitir análises futuras por posto, se necessário.

### 1.5. 💸 `despesas`

Registra as despesas diversas do motorista.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';
import { veiculos } from './veiculos';

export const tipoDespesaEnum = ['Manutencao', 'Pneus', 'Seguro', 'Outros'] as const;

export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").references(() => veiculos.id),
  data_despesa: text("data_despesa").notNull(),
  tipo_despesa: text("tipo_despesa", { enum: tipoDespesaEnum }).notNull(),
  valor_despesa: integer("valor_despesa").notNull(),
  descricao: text("descricao"),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_veiculo`: Opcional, pois algumas despesas podem não estar diretamente ligadas a um veículo específico.
*   `tipo_despesa`: ENUM para categorias básicas. Para o futuro, pode ser uma tabela separada para maior flexibilidade.

### 1.6. 📊 `historico_preco_combustivel`

Registra o histórico de preços médios de combustível por cidade/região.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { tipoCombustivelEnum } from './veiculos';

export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey(),
  cidade: text("cidade").notNull(),
  estado: text("estado").notNull(),
  tipo_combustivel: text("tipo_combustivel", { enum: tipoCombustivelEnum }).notNull(),
  preco_medio: integer("preco_medio").notNull(),
  data_registro: text("data_registro").notNull(),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_usuario` removido: Conforme decisão, este histórico é global/regional.
*   `cidade`, `estado`: Para granularidade regional dos preços.
*   `preco_medio`: Preço médio do combustível na região.

### 1.7. 📝 `logs_atividades`

Registra atividades importantes do usuário para auditoria.

```typescript
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';

export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").references(() => usuarios.id),
  tipo_acao: text("tipo_acao").notNull(),
  descricao: text("descricao"),
  data_acao: text("data_acao").notNull(),
  deleted_at: text("deleted_at"),
});
```

**Justificativas:**

*   `id_usuario`: Opcional, para registrar ações do sistema ou anônimas.
*   `tipo_acao`, `descricao`: Para categorizar e detalhar a atividade.

### 1.8. 🎯 `metas` (Pendente para fase futura)

Representa as metas financeiras ou de produtividade do motorista.

```typescript
// Modelo de dados pendente para versões futuras (v0.4.0+)
// Exemplo de estrutura:
/*
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';

export const tipoMetaEnum = ["Faturamento", "Economia", "Quilometragem"] as const;
export const periodoMetaEnum = ["Diaria", "Semanal", "Mensal"] as const;

export const metas = sqliteTable("metas", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  tipo_meta: text("tipo_meta", { enum: tipoMetaEnum }).notNull(),
  periodo_meta: text("periodo_meta", { enum: periodoMetaEnum }).notNull(),
  valor_alvo: integer("valor_alvo").notNull(),
  data_inicio: text("data_inicio").notNull(),
  data_fim: text("data_fim").notNull(),
  progresso_atual: integer("progresso_atual").default(0).notNull(),
  atingida: integer("atingida", { mode: "boolean" }).default(0).notNull(),
  deleted_at: text("deleted_at"),
});
*/
```

**Justificativas:**

*   Será implementado na v0.4.0. A estrutura proposta permite flexibilidade na definição de metas.

## 2. 🔌 APIs (Endpoints)

As APIs são construídas seguindo o padrão RESTful, utilizando JSON para comunicação. Os endpoints são versionados (`/api/v1/`) para permitir evoluções futuras sem quebrar clientes existentes.

### 2.1. 🔑 Autenticação

#### `POST /api/v1/auth/register`

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

#### `POST /api/v1/auth/login`

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

### 2.2. 🧑‍💻 Usuários

#### `GET /api/v1/users/me`

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

### 2.3. 🚚 Veículos

#### `POST /api/v1/vehicles`

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

#### `GET /api/v1/vehicles`

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

### 2.4. 🛣️ Jornadas

#### `POST /api/v1/journeys/start`

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

#### `PUT /api/v1/journeys/:id/end`

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

#### `GET /api/v1/journeys`

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

### 2.5. ⛽ Abastecimentos

#### `POST /api/v1/fuelings`

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

#### `GET /api/v1/fuelings`

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

### 2.6. 💸 Despesas

#### `POST /api/v1/expenses`

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

#### `GET /api/v1/expenses`

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

### 2.7. 📊 Relatórios

#### `GET /api/v1/reports/dashboard`

*   **Descrição:** Retorna dados do dashboard de lucratividade.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):**
    *   `startDate`: Data de início para filtro (ISO 8601).
    *   `endDate`: Data de fim para filtro (ISO 8601).
    *   `period`: Período para agrupamento ('day', 'week', 'month').

*   **Resposta (Status 200 OK):**

```json
{
  "faturamento_bruto": "integer",
  "total_despesas": "integer",
  "lucro_liquido": "integer",
  "km_total_rodado": "integer",
  "custo_por_km": "float",
  "ganho_medio_jornada": "float",
  "evolucao_lucro": [
    {
      "periodo": "string",
      "valor": "integer"
    }
  ]
}
```

#### `GET /api/v1/reports/journeys`

*   **Descrição:** Retorna relatório detalhado de ganhos por jornada.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):** `startDate`, `endDate`, `page`, `limit`.
*   **Resposta (Status 200 OK):**

```json
[
  {
    "id": "uuid",
    "data_inicio": "timestamp",
    "data_fim": "timestamp",
    "km_inicio": "integer",
    "km_fim": "integer",
    "km_total": "integer",
    "tempo_total": "integer",
    "ganho_bruto": "integer",
    "custo_estimado_combustivel": "float",
    "lucro_liquido_estimado": "float"
  }
]
```

#### `GET /api/v1/reports/expenses`

*   **Descrição:** Retorna relatório de análise de despesas.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):** `startDate`, `endDate`.
*   **Resposta (Status 200 OK):**

```json
{
  "total_despesas": "integer",
  "despesas_por_categoria": [
    {
      "categoria": "string",
      "valor": "integer",
      "percentual": "float"
    }
  ],
  "despesas_por_veiculo": [
    {
      "veiculo_id": "uuid",
      "veiculo_info": "string",
      "valor": "integer"
    }
  ],
  "evolucao_despesas": [
    {
      "periodo": "string",
      "valor": "integer"
    }
  ]
}
```

#### `GET /api/v1/reports/fuel`

*   **Descrição:** Retorna relatório de consumo de combustível.
*   **Autenticação:** Requer token JWT válido.
*   **Query Params (Opcional):** `startDate`, `endDate`.
*   **Resposta (Status 200 OK):**

```json
{
  "total_gasto_combustivel": "integer",
  "total_litros_abastecidos": "float",
  "preco_medio_litro": "float",
  "consumo_por_veiculo": [
    {
      "veiculo_id": "uuid",
      "veiculo_info": "string",
      "media_consumo": "float",
      "total_gasto": "integer"
    }
  ],
  "evolucao_preco": [
    {
      "periodo": "string",
      "preco_medio": "float"
    }
  ]
}
```

## 3. Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

- **200 OK:** Requisição bem-sucedida
- **201 Created:** Recurso criado com sucesso
- **400 Bad Request:** Dados inválidos na requisição
- **401 Unauthorized:** Token de autenticação inválido ou ausente
- **403 Forbidden:** Usuário não tem permissão para acessar o recurso
- **404 Not Found:** Recurso não encontrado
- **409 Conflict:** Conflito de dados (ex: email já cadastrado)
- **422 Unprocessable Entity:** Dados válidos mas não processáveis
- **500 Internal Server Error:** Erro interno do servidor

## 4. Autenticação e Segurança

### 4.1. JWT (JSON Web Token)

A API utiliza JWT para autenticação. O token deve ser incluído no cabeçalho `Authorization` de todas as requisições que requerem autenticação:

```
Authorization: Bearer <token>
```

### 4.2. Estrutura do Token JWT

```json
{
  "sub": "uuid_do_usuario",
  "email": "email_do_usuario",
  "iat": "timestamp_issued_at",
  "exp": "timestamp_expires_at"
}
```

### 4.3. Expiração e Renovação

- **Tempo de Expiração:** 24 horas
- **Renovação:** O cliente deve fazer login novamente após a expiração

## 5. Paginação

Para endpoints que retornam listas, a API suporta paginação através dos seguintes parâmetros:

- **page:** Número da página (padrão: 1)
- **limit:** Itens por página (padrão: 10, máximo: 100)

### Resposta com Metadados de Paginação

```json
{
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 150,
    "total_pages": 15,
    "has_next": true,
    "has_prev": false
  }
}
```

## 6. Tratamento de Erros

### Formato Padrão de Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      }
    ]
  }
}
```

### Códigos de Erro Comuns

- **VALIDATION_ERROR:** Erro de validação de dados
- **AUTHENTICATION_ERROR:** Erro de autenticação
- **AUTHORIZATION_ERROR:** Erro de autorização
- **NOT_FOUND:** Recurso não encontrado
- **CONFLICT:** Conflito de dados
- **INTERNAL_ERROR:** Erro interno do servidor

---

**Desenvolvido por Manus AI**

*Última Atualização: 30 de Julho de 2025*

