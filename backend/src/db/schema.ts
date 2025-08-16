import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// ===============================
// ENUMS TIPADOS E OTIMIZADOS
// ===============================

export const statusContaEnum = text("statusConta").$type<"ativo" | "inativo" | "suspenso">().notNull();
export const tipoCombustivelEnum = text("tipoCombustivel").$type<"gasolina" | "etanol" | "diesel" | "gnv" | "flex">().notNull();
export const tipoUsoEnum = text("tipoUso").$type<"proprio" | "alugado" | "financiado">().notNull();
export const tipoDespesaEnum = text("tipoDespesa").$type<"manutencao" | "pneus" | "seguro" | "outros">().notNull();
export const tipoMetaEnum = text("tipoMeta").$type<"faturamento" | "quilometragem" | "jornadas" | "economia" | "lucro">().notNull();
export const periodoMetaEnum = text("periodoMeta").$type<"semanal" | "mensal" | "trimestral" | "anual">().notNull();
export const statusMetaEnum = text("statusMeta").$type<"ativa" | "pausada" | "concluida" | "expirada">().notNull();
export const tipoConquistaEnum = text("tipoConquista").$type<"faturamento" | "quilometragem" | "jornadas" | "eficiencia" | "consistencia" | "metas" | "especial">().notNull();
export const raridadeEnum = text("raridade").$type<"comum" | "raro" | "epico" | "lendario">().notNull();
export const nivelUsuarioEnum = text("nivelUsuario").$type<"iniciante" | "novato" | "experiente" | "motorista" | "profissional" | "especialista" | "mestre" | "lenda">().notNull();
export const tipoNotificacaoEnum = text("tipoNotificacao").$type<"sistema" | "alerta" | "promocao" | "suporte">().notNull();

// ===============================
// TABELAS PRINCIPAIS
// ===============================

export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  senhaHash: text("senhaHash", { length: 255 }).notNull(),
  statusConta: statusContaEnum.default("ativo").notNull(),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  
  // Gamificação
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: nivelUsuarioEnum.default("iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  
  // Auditoria
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
  
  // Campos adicionados para controle de login
  tentativasLogin: integer("tentativasLogin").default(0).notNull(),
  ultimoLoginFalhado: integer("ultimoLoginFalhado", { mode: "timestamp" }),
  ultimaAtividade: integer("ultimaAtividade", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  emailIdx: uniqueIndex("usuarios_email_idx").on(table.email),
  statusIdx: index("usuarios_status_idx").on(table.statusConta),
  pontosIdx: index("usuarios_pontos_idx").on(table.pontosTotal),
  nivelIdx: index("usuarios_nivel_idx").on(table.nivelUsuario),
}));

export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca", { length: 50 }).notNull(),
  modelo: text("modelo", { length: 100 }).notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa", { length: 8 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  tipoUso: tipoUsoEnum.notNull(),
  
  // Valores em centavos para precisão
  valorAluguel: integer("valorAluguel"), // Para tipo_uso = "alugado"
  valorPrestacao: integer("valorPrestacao"), // Para tipo_uso = "financiado"
  mediaConsumo: real("mediaConsumo"), // km/l - mais preciso como REAL
  
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("veiculos_usuario_idx").on(table.idUsuario),
  placaIdx: uniqueIndex("veiculos_placa_idx").on(table.placa),
  anoIdx: index("veiculos_ano_idx").on(table.ano),
  combustivelIdx: index("veiculos_combustivel_idx").on(table.tipoCombustivel),
  usuarioAtivoIdx: index("veiculos_usuario_ativo_idx").on(table.idUsuario, table.deletedAt),
}));

export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }),
  kmFim: integer("kmFim"),
  
  ganhoBruto: integer("ganhoBruto"), // Em centavos
  kmTotal: integer("kmTotal"), // Calculado: km_fim - km_inicio
  tempoTotal: integer("tempoTotal"), // Em minutos
  
  observacoes: text("observacoes", { length: 500 }),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("jornadas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("jornadas_veiculo_idx").on(table.idVeiculo),
  dataInicioIdx: index("jornadas_dataInicio_idx").on(table.dataInicio),
  periodoIdx: index("jornadas_periodo_idx").on(table.dataInicio, table.dataFim),
  usuarioDataIdx: index("jornadas_usuario_data_idx").on(table.idUsuario, table.dataInicio),
  statusIdx: index("jornadas_status_idx").on(table.dataFim), // Para identificar jornadas em andamento
}));

export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataAbastecimento: integer("dataAbastecimento", { mode: "timestamp" }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  quantidadeLitros: real("quantidadeLitros").notNull(), // REAL para precisão
  valorLitro: integer("valorLitro").notNull(), // Em centavos
  valorTotal: integer("valorTotal").notNull(), // Em centavos
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto", { length: 100 }),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("abastecimentos_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("abastecimentos_veiculo_idx").on(table.idVeiculo),
  dataIdx: index("abastecimentos_data_idx").on(table.dataAbastecimento),
  veiculoDataIdx: index("abastecimentos_veiculo_data_idx").on(table.idVeiculo, table.dataAbastecimento),
  combustivelIdx: index("abastecimentos_combustivel_idx").on(table.tipoCombustivel),
}));

export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataDespesa: integer("dataDespesa", { mode: "timestamp" }).notNull(),
  tipoDespesa: tipoDespesaEnum.notNull(),
  valorDespesa: integer("valorDespesa").notNull(), // Em centavos
  descricao: text("descricao", { length: 300 }),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("despesas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("despesas_veiculo_idx").on(table.idVeiculo),
  dataIdx: index("despesas_data_idx").on(table.dataDespesa),
  tipoIdx: index("despesas_tipo_idx").on(table.tipoDespesa),
  usuarioDataIdx: index("despesas_usuario_data_idx").on(table.idUsuario, table.dataDespesa),
}));

// ===============================
// TABELAS DE REFERÊNCIA E HISTÓRICO
// ===============================

export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(), // Sigla do estado
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  precoMedio: integer("precoMedio").notNull(), // Em centavos
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }), // Fonte dos dados
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  localIdx: index("historico_local_idx").on(table.cidade, table.estado),
  combustivelIdx: index("historico_combustivel_idx").on(table.tipoCombustivel),
  dataIdx: index("historico_data_idx").on(table.dataRegistro),
  localDataIdx: index("historico_local_data_idx").on(table.cidade, table.estado, table.dataRegistro),
}));

export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"), // JSON com dados extras
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("logs_usuario_idx").on(table.idUsuario),
  tipoIdx: index("logs_tipo_idx").on(table.tipoAcao),
  dataIdx: index("logs_data_idx").on(table.dataAcao),
  usuarioDataIdx: index("logs_usuario_data_idx").on(table.idUsuario, table.dataAcao),
}));

// ===============================
// SISTEMA DE METAS
// ===============================

export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  
  titulo: text("titulo", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  tipoMeta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  
  valorObjetivo: integer("valorObjetivo").notNull(), // Valor em centavos ou unidades
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMetaEnum.default("ativa").notNull(),
  
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(), // 0-100
  dataConclusao: integer("dataConclusao", { mode: "timestamp" }),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("metas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("metas_veiculo_idx").on(table.idVeiculo),
  statusIdx: index("metas_status_idx").on(table.status),
  tipoIdx: index("metas_tipo_idx").on(table.tipoMeta),
  periodoIdx: index("metas_periodo_idx").on(table.dataInicio, table.dataFim),
  usuarioStatusIdx: index("metas_usuario_status_idx").on(table.idUsuario, table.status),
  ativasIdx: index("metas_ativas_idx").on(table.status, table.dataFim), // Para metas expiradas
}));

export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idMeta: text("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(), // valor_atual - valor_anterior
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes", { length: 300 }),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  metaIdx: index("progresso_meta_idx").on(table.idMeta),
  dataIdx: index("progresso_data_idx").on(table.dataRegistro),
  metaDataIdx: index("progresso_meta_data_idx").on(table.idMeta, table.dataRegistro),
}));

// ===============================
// SISTEMA DE GAMIFICAÇÃO
// ===============================

export const conquistas = sqliteTable("conquistas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 300 }).notNull(),
  tipoConquista: tipoConquistaEnum.notNull(),
  raridade: raridadeEnum.default("comum").notNull(),
  
  icone: text("icone", { length: 50 }),
  cor: text("cor", { length: 7 }).default("#4CAF50"), // Hex color
  criterioValor: integer("criterioValor"),
  criterioDescricao: text("criterioDescricao", { length: 500 }),
  pontosRecompensa: integer("pontosRecompensa").default(10).notNull(),
  
  ativa: integer("ativa", { mode: "boolean" }).default(true).notNull(),
  ordemExibicao: integer("ordemExibicao").default(0).notNull(),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  tipoIdx: index("conquistas_tipo_idx").on(table.tipoConquista),
  raridadeIdx: index("conquistas_raridade_idx").on(table.raridade),
  ativaIdx: index("conquistas_ativa_idx").on(table.ativa),
  ordemIdx: index("conquistas_ordem_idx").on(table.ordemExibicao),
}));

export const usuarioConquistas = sqliteTable("usuario_conquistas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idConquista: text("idConquista").notNull().references(() => conquistas.id, { onDelete: "cascade" }),
  
  dataDesbloqueio: integer("dataDesbloqueio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAtingido: integer("valorAtingido"),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  usuarioIdx: index("usuario_conquistas_usuario_idx").on(table.idUsuario),
  conquistaIdx: index("usuario_conquistas_conquista_idx").on(table.idConquista),
  dataIdx: index("usuario_conquistas_data_idx").on(table.dataDesbloqueio),
  usuarioConquistaIdx: uniqueIndex("usuario_conquistas_unique_idx").on(table.idUsuario, table.idConquista),
}));

export const niveisUsuario = sqliteTable("niveis_usuario", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nivel: nivelUsuarioEnum.notNull(),
  nomeExibicao: text("nomeExibicao", { length: 50 }).notNull(),
  pontosNecessarios: integer("pontosNecessarios").notNull(),
  cor: text("cor", { length: 7 }).default("#2196F3").notNull(),
  icone: text("icone", { length: 50 }),
  beneficios: text("beneficios", { length: 500 }),
  ordem: integer("ordem").notNull(),
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  nivelIdx: uniqueIndex("niveis_usuario_nivel_idx").on(table.nivel),
  pontosIdx: index("niveis_usuario_pontos_idx").on(table.pontosNecessarios),
  ordemIdx: uniqueIndex("niveis_usuario_ordem_idx").on(table.ordem),
}));

// ===============================
// RELAÇÕES ENTRE TABELAS
// ===============================

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  veiculos: many(veiculos),
  jornadas: many(jornadas),
  abastecimentos: many(abastecimentos),
  despesas: many(despesas),
  metas: many(metas),
  logsAtividades: many(logsAtividades),
  usuarioConquistas: many(usuarioConquistas),
}));

export const veiculosRelations = relations(veiculos, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [veiculos.idUsuario],
    references: [usuarios.id],
  }),
  jornadas: many(jornadas),
  abastecimentos: many(abastecimentos),
  despesas: many(despesas),
  metas: many(metas),
}));

export const jornadasRelations = relations(jornadas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [jornadas.idUsuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [jornadas.idVeiculo],
    references: [veiculos.id],
  }),
}));

export const abastecimentosRelations = relations(abastecimentos, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [abastecimentos.idUsuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [abastecimentos.idVeiculo],
    references: [veiculos.id],
  }),
}));

export const despesasRelations = relations(despesas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [despesas.idUsuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [despesas.idVeiculo],
    references: [veiculos.id],
  }),
}));

export const metasRelations = relations(metas, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [metas.idUsuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [metas.idVeiculo],
    references: [veiculos.id],
  }),
  progressoMetas: many(progressoMetas),
}));

export const progressoMetasRelations = relations(progressoMetas, ({ one }) => ({
  meta: one(metas, {
    fields: [progressoMetas.idMeta],
    references: [metas.id],
  }),
}));

export const logsAtividadesRelations = relations(logsAtividades, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [logsAtividades.idUsuario],
    references: [usuarios.id],
  }),
}));

export const conquistasRelations = relations(conquistas, ({ many }) => ({
  usuarioConquistas: many(usuarioConquistas),
}));

export const usuarioConquistasRelations = relations(usuarioConquistas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [usuarioConquistas.idUsuario],
    references: [usuarios.id],
  }),
  conquista: one(conquistas, {
    fields: [usuarioConquistas.idConquista],
    references: [conquistas.id],
  }),
}));

export const niveisUsuarioRelations = relations(niveisUsuario, ({}) => ({}));


