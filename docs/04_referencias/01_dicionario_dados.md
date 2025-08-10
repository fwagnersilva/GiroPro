# Dicionário de Dados do GiroPro (Schemas do Banco de Dados)

Este documento fornece uma visão detalhada dos modelos de dados (schemas do banco de dados) utilizados no projeto **GiroPro**. Ele serve como referência para desenvolvedores que precisam entender a estrutura de dados e como as informações são persistidas.

Os modelos de dados são definidos usando **Drizzle ORM** no backend, mapeando diretamente para as tabelas do PostgreSQL/SQLite. As definições abaixo representam a estrutura lógica das tabelas.

## 1. 👤 `usuarios`

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

## 2. 🚗 `veiculos`

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

## 3. 🗺️ `jornadas`

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

## 4. ⛽ `abastecimentos`

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

## 5. 💸 `despesas`

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

## 6. 📊 `historico_preco_combustivel`

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

## 7. 📝 `logs_atividades`

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

## 8. 🎯 `metas` (Pendente para fase futura)

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

