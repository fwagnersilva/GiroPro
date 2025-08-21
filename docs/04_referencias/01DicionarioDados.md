# Dicionário de Dados do GiroPro (Schemas do Banco de Dados)

Este documento fornece uma visão detalhada dos modelos de dados (schemas do banco de dados) utilizados no projeto **GiroPro**. Ele serve como referência para desenvolvedores que precisam entender a estrutura de dados e como as informações são persistidas.

Os modelos de dados são definidos usando **Drizzle ORM** no backend, mapeando diretamente para as tabelas do SQLite. As definições abaixo representam a estrutura lógica das tabelas, alinhadas com o arquivo `backend/src/db/schema.ts`.

## 1. 🌐 ENUMS Tipados e Otimizados

Para garantir a consistência e a integridade dos dados, o projeto utiliza enums tipados para campos com valores predefinidos. Estes enums são definidos diretamente no `schema.ts` e são usados em várias tabelas:

*   `statusContaEnum`: Define os possíveis status de uma conta de usuário (`ativo`, `inativo`, `suspenso`).
*   `tipoCombustivelEnum`: Define os tipos de combustível (`gasolina`, `etanol`, `diesel`, `gnv`, `flex`).
*   `tipoUsoEnum`: Define o tipo de uso de um veículo (`proprio`, `alugado`, `financiado`).
*   `tipoDespesaEnum`: Define as categorias de despesas (`manutencao`, `pneus`, `seguro`, `outros`).
*   `tipoMetaEnum`: Define os tipos de metas (`faturamento`, `quilometragem`, `jornadas`, `economia`, `lucro`).
*   `periodoMetaEnum`: Define os períodos das metas (`semanal`, `mensal`, `trimestral`, `anual`).
*   `statusMetaEnum`: Define os status das metas (`ativa`, `pausada`, `concluida`, `expirada`).
*   `tipoConquistaEnum`: Define os tipos de conquistas para gamificação (`faturamento`, `quilometragem`, `jornadas`, `eficiencia`, `consistencia`, `metas`, `especial`).
*   `raridadeEnum`: Define a raridade das conquistas (`comum`, `raro`, `epico`, `lendario`).
*   `nivelUsuarioEnum`: Define os níveis de usuário para gamificação (`iniciante`, `novato`, `experiente`, `motorista`, `profissional`, `especialista`, `mestre`, `lenda`).
*   `tipoNotificacaoEnum`: Define os tipos de notificação (`sistema`, `alerta`, `promocao`, `suporte`).

## 2. 👤 `usuarios`

Representa os usuários do aplicativo (motoristas), incluindo informações de autenticação, gamificação e auditoria.

```typescript
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  senhaHash: text("senhaHash", { length: 255 }).notNull(),
  statusConta: statusContaEnum.default("ativo").notNull(),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: nivelUsuarioEnum.default("iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
  tentativasLogin: integer("tentativasLogin").default(0).notNull(),
  ultimoLoginFalhado: integer("ultimoLoginFalhado", { mode: "timestamp" }),
  ultimaAtividade: integer("ultimaAtividade", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente com `crypto.randomUUID()` para garantir unicidade global.
*   `nome`: Nome completo do usuário, com limite de 100 caracteres.
*   `email`: Endereço de e-mail do usuário, único e com limite de 255 caracteres. Usado para login.
*   `senhaHash`: Hash da senha do usuário, armazenado de forma segura.
*   `statusConta`: Status atual da conta do usuário, utilizando `statusContaEnum` (`ativo`, `inativo`, `suspenso`). Padrão é `ativo`.
*   `dataCadastro`: Timestamp da criação da conta, em formato Unix epoch.
*   `pontosTotal`: Pontuação total do usuário no sistema de gamificação. Padrão é 0.
*   `nivelUsuario`: Nível atual do usuário, utilizando `nivelUsuarioEnum`. Padrão é `iniciante`.
*   `conquistasDesbloqueadas`: Número de conquistas desbloqueadas pelo usuário. Padrão é 0.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro, permitindo recuperação e histórico.
*   `tentativasLogin`: Contador de tentativas de login falhas. Padrão é 0.
*   `ultimoLoginFalhado`: Timestamp da última tentativa de login falha.
*   `ultimaAtividade`: Timestamp da última atividade do usuário no sistema, em formato Unix epoch.

## 3. 🚗 `veiculos`

Representa os veículos utilizados pelos motoristas, associados a um usuário.

```typescript
export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca", { length: 50 }).notNull(),
  modelo: text("modelo", { length: 100 }).notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa", { length: 8 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  tipoUso: tipoUsoEnum.notNull(),
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: real("mediaConsumo"),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `marca`: Marca do veículo, com limite de 50 caracteres.
*   `modelo`: Modelo do veículo, com limite de 100 caracteres.
*   `ano`: Ano de fabricação do veículo.
*   `placa`: Placa do veículo, única e com limite de 8 caracteres.
*   `tipoCombustivel`: Tipo de combustível do veículo, utilizando `tipoCombustivelEnum`.
*   `tipoUso`: Tipo de uso do veículo, utilizando `tipoUsoEnum`.
*   `valorAluguel`: Valor do aluguel (em centavos), aplicável se `tipoUso` for `alugado`.
*   `valorPrestacao`: Valor da prestação (em centavos), aplicável se `tipoUso` for `financiado`.
*   `mediaConsumo`: Média de consumo do veículo (km/l), armazenado como `REAL` para precisão.
*   `dataCadastro`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 4. 🗺️ `jornadas`

Registra as jornadas de trabalho realizadas pelos motoristas.

```typescript
export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }),
  kmFim: integer("kmFim"),
  ganhoBruto: integer("ganhoBruto"),
  kmTotal: integer("kmTotal"),
  tempoTotal: integer("tempoTotal"),
  observacoes: text("observacoes", { length: 500 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataInicio`: Timestamp do início da jornada, em formato Unix epoch.
*   `kmInicio`: Quilometragem do veículo no início da jornada.
*   `dataFim`: Timestamp do fim da jornada, em formato Unix epoch (nulo se a jornada estiver em andamento).
*   `kmFim`: Quilometragem do veículo no fim da jornada (nulo se a jornada estiver em andamento).
*   `ganhoBruto`: Ganho bruto da jornada (em centavos).
*   `kmTotal`: Quilometragem total percorrida na jornada (calculado: `kmFim - kmInicio`).
*   `tempoTotal`: Tempo total da jornada (em minutos).
*   `observacoes`: Observações adicionais sobre a jornada, com limite de 500 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 5. ⛽ `abastecimentos`

Registra os abastecimentos de combustível realizados para os veículos.

```typescript
export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataAbastecimento: integer("dataAbastecimento", { mode: "timestamp" }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  quantidadeLitros: real("quantidadeLitros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(),
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataAbastecimento`: Timestamp do abastecimento, em formato Unix epoch.
*   `tipoCombustivel`: Tipo de combustível abastecido, utilizando `tipoCombustivelEnum`.
*   `quantidadeLitros`: Quantidade de litros abastecidos, armazenado como `REAL` para precisão.
*   `valorLitro`: Valor por litro (em centavos).
*   `valorTotal`: Valor total do abastecimento (em centavos).
*   `kmAtual`: Quilometragem do veículo no momento do abastecimento.
*   `nomePosto`: Nome do posto de combustível, com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 6. 💸 `despesas`

Registra as despesas diversas relacionadas ou não a veículos.

```typescript
export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  dataDespesa: integer("dataDespesa", { mode: "timestamp" }).notNull(),
  tipoDespesa: tipoDespesaEnum.notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata (nulo se a despesa não estiver ligada a um veículo específico).
*   `dataDespesa`: Timestamp da despesa, em formato Unix epoch.
*   `tipoDespesa`: Categoria da despesa, utilizando `tipoDespesaEnum`.
*   `valorDespesa`: Valor da despesa (em centavos).
*   `descricao`: Descrição detalhada da despesa, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 7. 📊 `historicoPrecoCombustivel`

Registra o histórico de preços médios de combustível por cidade e estado.

```typescript
export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  precoMedio: integer("precoMedio").notNull(),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `cidade`: Nome da cidade, com limite de 100 caracteres.
*   `estado`: Sigla do estado (UF), com limite de 2 caracteres.
*   `tipoCombustivel`: Tipo de combustível, utilizando `tipoCombustivelEnum`.
*   `precoMedio`: Preço médio do combustível (em centavos).
*   `dataRegistro`: Timestamp do registro do preço, em formato Unix epoch.
*   `fonte`: Fonte dos dados do preço (ex: ANP, app de terceiros), com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 8. 📝 `logsAtividades`

Registra atividades importantes do usuário e do sistema para auditoria.

```typescript
export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"),
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira opcional para a tabela `usuarios` (nulo se a ação for do sistema ou anônima).
*   `tipoAcao`: Categoria da ação (ex: `login`, `cadastro`, `atualizacao`), com limite de 50 caracteres.
*   `descricao`: Descrição detalhada da atividade, com limite de 500 caracteres.
*   `metadados`: Campo para armazenar dados extras da atividade em formato JSON.
*   `dataAcao`: Timestamp da ação, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 9. 🎯 `metas`

Representa as metas financeiras ou de produtividade definidas pelos motoristas.

```typescript
export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  titulo: text("titulo", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  tipoMeta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMetaEnum.default("ativa").notNull(),
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: integer("dataConclusao", { mode: "timestamp" }),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata.
*   `titulo`: Título da meta, com limite de 100 caracteres.
*   `descricao`: Descrição detalhada da meta, com limite de 500 caracteres.
*   `tipoMeta`: Tipo da meta, utilizando `tipoMetaEnum`.
*   `periodo`: Período da meta, utilizando `periodoMetaEnum`.
*   `valorObjetivo`: Valor objetivo da meta (em centavos ou unidades).
*   `dataInicio`: Timestamp do início da meta, em formato Unix epoch.
*   `dataFim`: Timestamp do fim da meta, em formato Unix epoch.
*   `status`: Status atual da meta, utilizando `statusMetaEnum`. Padrão é `ativa`.
*   `valorAtual`: Valor atual do progresso da meta. Padrão é 0.
*   `percentualConcluido`: Percentual de conclusão da meta (0-100). Padrão é 0.
*   `dataConclusao`: Timestamp da conclusão da meta.
*   `notificacaoEnviada`: Flag booleana para indicar se a notificação de conclusão foi enviada. Padrão é `false`.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 10. 📈 `progressoMetas`

Registra o progresso de cada meta ao longo do tempo, permitindo o acompanhamento detalhado.

```typescript
export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idMeta: text("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idMeta`: Chave estrangeira para a tabela `metas`, com exclusão em cascata.
*   `dataRegistro`: Timestamp do registro do progresso, em formato Unix epoch.
*   `valorAnterior`: Valor da meta antes desta atualização de progresso.
*   `valorAtual`: Valor da meta após esta atualização de progresso.
*   `incremento`: Diferença entre `valorAtual` e `valorAnterior`.
*   `percentualAnterior`: Percentual de conclusão da meta antes desta atualização.
*   `percentualAtual`: Percentual de conclusão da meta após esta atualização.
*   `observacoes`: Observações adicionais sobre o progresso, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.

## 11. 🔔 `notificacoes`

Registra notificações enviadas aos usuários.

```typescript
export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacaoEnum.notNull(),
  titulo: text("titulo", { length: 200 }).notNull(),
  mensagem: text("mensagem", { length: 1000 }).notNull(),
  dadosExtras: text("dadosExtras"),
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  dataEnvio: integer("dataEnvio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  dataLeitura: integer("dataLeitura", { mode: "timestamp" }),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `tipo`: Tipo da notificação, utilizando `tipoNotificacaoEnum`.
*   `titulo`: Título da notificação, com limite de 200 caracteres.
*   `mensagem`: Conteúdo da mensagem da notificação, com limite de 1000 caracteres.
*   `dadosExtras`: Campo para armazenar dados extras da notificação em formato JSON.
*   `lida`: Flag booleana para indicar se a notificação foi lida. Padrão é `false`.
*   `dataEnvio`: Timestamp do envio da notificação, em formato Unix epoch.
*   `dataLeitura`: Timestamp da leitura da notificação.
*   `deletedAt`: Timestamp do soft delete do registro.




## 3. 🚗 `veiculos`

Representa os veículos utilizados pelos motoristas, associados a um usuário.

```typescript
export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca", { length: 50 }).notNull(),
  modelo: text("modelo", { length: 100 }).notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa", { length: 8 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  tipoUso: tipoUsoEnum.notNull(),
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: real("mediaConsumo"),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `marca`: Marca do veículo, com limite de 50 caracteres.
*   `modelo`: Modelo do veículo, com limite de 100 caracteres.
*   `ano`: Ano de fabricação do veículo.
*   `placa`: Placa do veículo, única e com limite de 8 caracteres.
*   `tipoCombustivel`: Tipo de combustível do veículo, utilizando `tipoCombustivelEnum`.
*   `tipoUso`: Tipo de uso do veículo, utilizando `tipoUsoEnum`.
*   `valorAluguel`: Valor do aluguel (em centavos), aplicável se `tipoUso` for `alugado`.
*   `valorPrestacao`: Valor da prestação (em centavos), aplicável se `tipoUso` for `financiado`.
*   `mediaConsumo`: Média de consumo do veículo (km/l), armazenado como `REAL` para precisão.
*   `dataCadastro`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 4. 🗺️ `jornadas`

Registra as jornadas de trabalho realizadas pelos motoristas.

```typescript
export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }),
  kmFim: integer("kmFim"),
  ganhoBruto: integer("ganhoBruto"),
  kmTotal: integer("kmTotal"),
  tempoTotal: integer("tempoTotal"),
  observacoes: text("observacoes", { length: 500 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataInicio`: Timestamp do início da jornada, em formato Unix epoch.
*   `kmInicio`: Quilometragem do veículo no início da jornada.
*   `dataFim`: Timestamp do fim da jornada, em formato Unix epoch (nulo se a jornada estiver em andamento).
*   `kmFim`: Quilometragem do veículo no fim da jornada (nulo se a jornada estiver em andamento).
*   `ganhoBruto`: Ganho bruto da jornada (em centavos).
*   `kmTotal`: Quilometragem total percorrida na jornada (calculado: `kmFim - kmInicio`).
*   `tempoTotal`: Tempo total da jornada (em minutos).
*   `observacoes`: Observações adicionais sobre a jornada, com limite de 500 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 5. ⛽ `abastecimentos`

Registra os abastecimentos de combustível realizados para os veículos.

```typescript
export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataAbastecimento: integer("dataAbastecimento", { mode: "timestamp" }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  quantidadeLitros: real("quantidadeLitros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(),
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataAbastecimento`: Timestamp do abastecimento, em formato Unix epoch.
*   `tipoCombustivel`: Tipo de combustível abastecido, utilizando `tipoCombustivelEnum`.
*   `quantidadeLitros`: Quantidade de litros abastecidos, armazenado como `REAL` para precisão.
*   `valorLitro`: Valor por litro (em centavos).
*   `valorTotal`: Valor total do abastecimento (em centavos).
*   `kmAtual`: Quilometragem do veículo no momento do abastecimento.
*   `nomePosto`: Nome do posto de combustível, com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 6. 💸 `despesas`

Registra as despesas diversas relacionadas ou não a veículos.

```typescript
export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  dataDespesa: integer("dataDespesa", { mode: "timestamp" }).notNull(),
  tipoDespesa: tipoDespesaEnum.notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata (nulo se a despesa não estiver ligada a um veículo específico).
*   `dataDespesa`: Timestamp da despesa, em formato Unix epoch.
*   `tipoDespesa`: Categoria da despesa, utilizando `tipoDespesaEnum`.
*   `valorDespesa`: Valor da despesa (em centavos).
*   `descricao`: Descrição detalhada da despesa, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 7. 📊 `historicoPrecoCombustivel`

Registra o histórico de preços médios de combustível por cidade e estado.

```typescript
export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  precoMedio: integer("precoMedio").notNull(),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `cidade`: Nome da cidade, com limite de 100 caracteres.
*   `estado`: Sigla do estado (UF), com limite de 2 caracteres.
*   `tipoCombustivel`: Tipo de combustível, utilizando `tipoCombustivelEnum`.
*   `precoMedio`: Preço médio do combustível (em centavos).
*   `dataRegistro`: Timestamp do registro do preço, em formato Unix epoch.
*   `fonte`: Fonte dos dados do preço (ex: ANP, app de terceiros), com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 8. 📝 `logsAtividades`

Registra atividades importantes do usuário e do sistema para auditoria.

```typescript
export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"),
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira opcional para a tabela `usuarios` (nulo se a ação for do sistema ou anônima).
*   `tipoAcao`: Categoria da ação (ex: `login`, `cadastro`, `atualizacao`), com limite de 50 caracteres.
*   `descricao`: Descrição detalhada da atividade, com limite de 500 caracteres.
*   `metadados`: Campo para armazenar dados extras da atividade em formato JSON.
*   `dataAcao`: Timestamp da ação, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 9. 🎯 `metas`

Representa as metas financeiras ou de produtividade definidas pelos motoristas.

```typescript
export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  titulo: text("titulo", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  tipoMeta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMetaEnum.default("ativa").notNull(),
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: integer("dataConclusao", { mode: "timestamp" }),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata.
*   `titulo`: Título da meta, com limite de 100 caracteres.
*   `descricao`: Descrição detalhada da meta, com limite de 500 caracteres.
*   `tipoMeta`: Tipo da meta, utilizando `tipoMetaEnum`.
*   `periodo`: Período da meta, utilizando `periodoMetaEnum`.
*   `valorObjetivo`: Valor objetivo da meta (em centavos ou unidades).
*   `dataInicio`: Timestamp do início da meta, em formato Unix epoch.
*   `dataFim`: Timestamp do fim da meta, em formato Unix epoch.
*   `status`: Status atual da meta, utilizando `statusMetaEnum`. Padrão é `ativa`.
*   `valorAtual`: Valor atual do progresso da meta. Padrão é 0.
*   `percentualConcluido`: Percentual de conclusão da meta (0-100). Padrão é 0.
*   `dataConclusao`: Timestamp da conclusão da meta.
*   `notificacaoEnviada`: Flag booleana para indicar se a notificação de conclusão foi enviada. Padrão é `false`.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 10. 📈 `progressoMetas`

Registra o progresso de cada meta ao longo do tempo, permitindo o acompanhamento detalhado.

```typescript
export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idMeta: text("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idMeta`: Chave estrangeira para a tabela `metas`, com exclusão em cascata.
*   `dataRegistro`: Timestamp do registro do progresso, em formato Unix epoch.
*   `valorAnterior`: Valor da meta antes desta atualização de progresso.
*   `valorAtual`: Valor da meta após esta atualização de progresso.
*   `incremento`: Diferença entre `valorAtual` e `valorAnterior`.
*   `percentualAnterior`: Percentual de conclusão da meta antes desta atualização.
*   `percentualAtual`: Percentual de conclusão da meta após esta atualização.
*   `observacoes`: Observações adicionais sobre o progresso, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.

## 11. 🔔 `notificacoes`

Registra notificações enviadas aos usuários.

```typescript
export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacaoEnum.notNull(),
  titulo: text("titulo", { length: 200 }).notNull(),
  mensagem: text("mensagem", { length: 1000 }).notNull(),
  dadosExtras: text("dadosExtras"),
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  dataEnvio: integer("dataEnvio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  dataLeitura: integer("dataLeitura", { mode: "timestamp" }),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `tipo`: Tipo da notificação, utilizando `tipoNotificacaoEnum`.
*   `titulo`: Título da notificação, com limite de 200 caracteres.
*   `mensagem`: Conteúdo da mensagem da notificação, com limite de 1000 caracteres.
*   `dadosExtras`: Campo para armazenar dados extras da notificação em formato JSON.
*   `lida`: Flag booleana para indicar se a notificação foi lida. Padrão é `false`.
*   `dataEnvio`: Timestamp do envio da notificação, em formato Unix epoch.
*   `dataLeitura`: Timestamp da leitura da notificação.
*   `deletedAt`: Timestamp do soft delete do registro.




## 7. 📊 `historicoPrecoCombustivel`

Registra o histórico de preços médios de combustível por cidade e estado.

```typescript
export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  precoMedio: integer("precoMedio").notNull(),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `cidade`: Nome da cidade, com limite de 100 caracteres.
*   `estado`: Sigla do estado (UF), com limite de 2 caracteres.
*   `tipoCombustivel`: Tipo de combustível, utilizando `tipoCombustivelEnum`.
*   `precoMedio`: Preço médio do combustível (em centavos).
*   `dataRegistro`: Timestamp do registro do preço, em formato Unix epoch.
*   `fonte`: Fonte dos dados do preço (ex: ANP, app de terceiros), com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 8. 📝 `logsAtividades`

Registra atividades importantes do usuário e do sistema para auditoria.

```typescript
export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"),
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira opcional para a tabela `usuarios` (nulo se a ação for do sistema ou anônima).
*   `tipoAcao`: Categoria da ação (ex: `login`, `cadastro`, `atualizacao`), com limite de 50 caracteres.
*   `descricao`: Descrição detalhada da atividade, com limite de 500 caracteres.
*   `metadados`: Campo para armazenar dados extras da atividade em formato JSON.
*   `dataAcao`: Timestamp da ação, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 9. 🎯 `metas`

Representa as metas financeiras ou de produtividade definidas pelos motoristas.

```typescript
export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  titulo: text("titulo", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  tipoMeta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMetaEnum.default("ativa").notNull(),
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: integer("dataConclusao", { mode: "timestamp" }),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata.
*   `titulo`: Título da meta, com limite de 100 caracteres.
*   `descricao`: Descrição detalhada da meta, com limite de 500 caracteres.
*   `tipoMeta`: Tipo da meta, utilizando `tipoMetaEnum`.
*   `periodo`: Período da meta, utilizando `periodoMetaEnum`.
*   `valorObjetivo`: Valor objetivo da meta (em centavos ou unidades).
*   `dataInicio`: Timestamp do início da meta, em formato Unix epoch.
*   `dataFim`: Timestamp do fim da meta, em formato Unix epoch.
*   `status`: Status atual da meta, utilizando `statusMetaEnum`. Padrão é `ativa`.
*   `valorAtual`: Valor atual do progresso da meta. Padrão é 0.
*   `percentualConcluido`: Percentual de conclusão da meta (0-100). Padrão é 0.
*   `dataConclusao`: Timestamp da conclusão da meta.
*   `notificacaoEnviada`: Flag booleana para indicar se a notificação de conclusão foi enviada. Padrão é `false`.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 10. 📈 `progressoMetas`

Registra o progresso de cada meta ao longo do tempo, permitindo o acompanhamento detalhado.

```typescript
export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idMeta: text("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idMeta`: Chave estrangeira para a tabela `metas`, com exclusão em cascata.
*   `dataRegistro`: Timestamp do registro do progresso, em formato Unix epoch.
*   `valorAnterior`: Valor da meta antes desta atualização de progresso.
*   `valorAtual`: Valor da meta após esta atualização de progresso.
*   `incremento`: Diferença entre `valorAtual` e `valorAnterior`.
*   `percentualAnterior`: Percentual de conclusão da meta antes desta atualização.
*   `percentualAtual`: Percentual de conclusão da meta após esta atualização.
*   `observacoes`: Observações adicionais sobre o progresso, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.

## 11. 🔔 `notificacoes`

Registra notificações enviadas aos usuários.

```typescript
export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacaoEnum.notNull(),
  titulo: text("titulo", { length: 200 }).notNull(),
  mensagem: text("mensagem", { length: 1000 }).notNull(),
  dadosExtras: text("dadosExtras"),
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  dataEnvio: integer("dataEnvio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  dataLeitura: integer("dataLeitura", { mode: "timestamp" }),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `tipo`: Tipo da notificação, utilizando `tipoNotificacaoEnum`.
*   `titulo`: Título da notificação, com limite de 200 caracteres.
*   `mensagem`: Conteúdo da mensagem da notificação, com limite de 1000 caracteres.
*   `dadosExtras`: Campo para armazenar dados extras da notificação em formato JSON.
*   `lida`: Flag booleana para indicar se a notificação foi lida. Padrão é `false`.
*   `dataEnvio`: Timestamp do envio da notificação, em formato Unix epoch.
*   `dataLeitura`: Timestamp da leitura da notificação.
*   `deletedAt`: Timestamp do soft delete do registro.


