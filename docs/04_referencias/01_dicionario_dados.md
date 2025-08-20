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
  senhaHash: text("senhaHash").notNull(),
  statusConta: text("statusConta").default("Ativo").notNull(),
  dataCadastro: text("dataCadastro").notNull(),
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: text("nivelUsuario").default("Iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  deletedAt: text("deletedAt"),
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
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull().unique(),
  tipoCombustivel: text("tipoCombustivel", { enum: tipoCombustivelEnum }).notNull(),
  tipoUso: text("tipoUso", { enum: tipoUsoEnum }).notNull(),
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: integer("mediaConsumo"),
  dataCadastro: text("dataCadastro").notNull(),
  deletedAt: text("deletedAt"),
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
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id),
  dataInicio: text("dataInicio").notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: text("dataFim"),
  kmFim: integer("kmFim"),
  ganhoBruto: integer("ganhoBruto"),
  kmTotal: integer("kmTotal"),
  tempoTotal: integer("tempoTotal"),
  observacoes: text("observacoes"),
  deletedAt: text("deletedAt"),
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
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id),
  dataAbastecimento: text("dataAbastecimento").notNull(),
  tipoCombustivel: text("tipoCombustivel", { enum: tipoCombustivelEnum }).notNull(),
  quantidadeLitros: integer("quantidadeLitros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(),
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto"),
  deletedAt: text("deletedAt"),
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
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  idVeiculo: text("idVeiculo").references(() => veiculos.id),
  dataDespesa: text("dataDespesa").notNull(),
  tipoDespesa: text("tipoDespesa", { enum: tipoDespesaEnum }).notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao"),
  deletedAt: text("deletedAt"),
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
  tipoCombustivel: text("tipoCombustivel", { enum: tipoCombustivelEnum }).notNull(),
  precoMedio: integer("precoMedio").notNull(),
  dataRegistro: text("dataRegistro").notNull(),
  deletedAt: text("deletedAt"),
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
  idUsuario: text("idUsuario").references(() => usuarios.id),
  tipoAcao: text("tipoAcao").notNull(),
  descricao: text("descricao"),
  dataAcao: text("dataAcao").notNull(),
  deletedAt: text("deletedAt"),
});
```

**Justificativas:**

*   `id_usuario`: Opcional, para registrar ações do sistema ou anônimas.
*   `tipo_acao`, `descricao`: Para categorizar e detalhar a atividade.

## 8. 🎯 `metas`

Representa as metas financeiras ou de produtividade do motorista.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';

export const tipoMetaEnum = ["Faturamento", "Economia", "Quilometragem", "Jornadas", "Lucro"] as const;
export const periodoMetaEnum = ["Diaria", "Semanal", "Mensal", "Trimestral", "Anual"] as const;
export const statusMetaEnum = ["Ativa", "Pausada", "Concluida", "Expirada"] as const;

export const metas = sqliteTable("metas", {
  id: text("id").primaryKey(),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  idVeiculo: text("idVeiculo").references(() => veiculos.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipoMeta: text("tipoMeta", { enum: tipoMetaEnum }).notNull(),
  periodo: text("periodo", { enum: periodoMetaEnum }).notNull(),
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: text("dataInicio").notNull(),
  dataFim: text("dataFim").notNull(),
  status: text("status", { enum: statusMetaEnum }).default("Ativa").notNull(),
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: text("dataConclusao"),
  notificacaoEnviada: integer("notificacaoEnviada").default(0).notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  deletedAt: text("deletedAt"),
});
```

**Justificativas:**

*   `idUsuario`, `idVeiculo`: Chaves estrangeiras para associar a meta ao usuário e, opcionalmente, ao veículo.
*   `titulo`, `descricao`: Informações descritivas da meta.
*   `tipoMeta`, `periodo`: ENUMs para categorizar o tipo e o período da meta.
*   `valorObjetivo`: O valor alvo da meta (em centavos ou unidades).
*   `dataInicio`, `dataFim`: Período de validade da meta.
*   `status`: Status atual da meta (ativa, pausada, concluída, expirada).
*   `valorAtual`, `percentualConcluido`: Progresso atual da meta.
*   `dataConclusao`: Data em que a meta foi concluída.
*   `notificacaoEnviada`: Flag para controlar o envio de notificações relacionadas à meta.
*   `createdAt`, `updatedAt`, `deletedAt`: Campos de auditoria.



*   `updatedAt`: Timestamp da última atualização do registro.
*   `tentativasLogin`: Contador de tentativas de login falhas.
*   `ultimoLoginFalhado`: Timestamp da última tentativa de login falha.
*   `ultimaAtividade`: Timestamp da última atividade do usuário no sistema.



*   `updatedAt`: Timestamp da última atualização do registro.



*   `createdAt`: Timestamp da criação do registro.
*   `updatedAt`: Timestamp da última atualização do registro.



*   `createdAt`: Timestamp da criação do registro.
*   `updatedAt`: Timestamp da última atualização do registro.



*   `createdAt`: Timestamp da criação do registro.
*   `updatedAt`: Timestamp da última atualização do registro.



*   `fonte`: Fonte dos dados do preço (ex: ANP, app de terceiros).
*   `createdAt`: Timestamp da criação do registro.



*   `metadados`: Campo JSON para dados extras da atividade.




## 9. 📈 `progressoMetas`

Registra o progresso de cada meta ao longo do tempo.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { metas } from './metas';

export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey(),
  idMeta: text("idMeta").notNull().references(() => metas.id),
  dataRegistro: text("dataRegistro").notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes"),
  createdAt: text("createdAt").notNull(),
});
```

**Justificativas:**

*   `idMeta`: Chave estrangeira para a meta associada.
*   `dataRegistro`: Data do registro do progresso.
*   `valorAnterior`, `valorAtual`: Valores da meta antes e depois do registro.
*   `incremento`: Diferença entre o valor atual e o anterior.
*   `percentualAnterior`, `percentualAtual`: Percentuais de conclusão antes e depois do registro.
*   `observacoes`: Observações adicionais sobre o progresso.
*   `createdAt`: Timestamp da criação do registro.





## 10. 🔔 `notificacoes`

Registra notificações enviadas aos usuários.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usuarios } from './usuarios';

export const tipoNotificacaoEnum = ["sistema", "alerta", "promocao", "suporte"] as const;

export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey(),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id),
  tipo: text("tipo", { enum: tipoNotificacaoEnum }).notNull(),
  titulo: text("titulo").notNull(),
  mensagem: text("mensagem").notNull(),
  dadosExtras: text("dadosExtras"),
  lida: integer("lida").default(0).notNull(),
  dataEnvio: text("dataEnvio").notNull(),
  dataLeitura: text("dataLeitura"),
  deletedAt: text("deletedAt"),
});
```

**Justificativas:**

*   `idUsuario`: Chave estrangeira para o usuário que receberá a notificação.
*   `tipo`: Tipo da notificação (sistema, alerta, promoção, suporte).
*   `titulo`, `mensagem`: Conteúdo da notificação.
*   `dadosExtras`: Campo JSON para dados adicionais da notificação.
*   `lida`: Flag para indicar se a notificação foi lida (0 = não lida, 1 = lida).
*   `dataEnvio`: Timestamp do envio da notificação.
*   `dataLeitura`: Timestamp da leitura da notificação.
*   `deletedAt`: Campo para soft delete.


