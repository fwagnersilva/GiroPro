import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const userRole = text("role").$type<"admin" | "user" | "guest">().notNull();

// ===============================
// ENUMS TIPADOS E OTIMIZADOS
// ===============================

export const accountStatus = text("statusConta").$type<"ativo" | "inativo" | "suspenso">().notNull();
export const fuelType = text("tipoCombustivel").$type<"gasolina" | "etanol" | "diesel" | "gnv" | "flex">().notNull();
export const usageType = text("tipoUso").$type<"proprio" | "alugado" | "financiado">().notNull();
export const expenseType = text("expenseType").$type<"manutencao" | "pneus" | "seguro" | "outros">().notNull();
export const goalType = text("goalType").$type<"faturamento" | "quilometragem" | "jornadas" | "economia" | "lucro">().notNull();
export const goalPeriod = text("goalPeriod").$type<"semanal" | "mensal" | "trimestral" | "anual">().notNull();
export const statusMeta = text("statusMeta").$type<"ativa" | "pausada" | "concluida" | "expirada">().notNull();
export const tipoConquista = text("tipoConquista").$type<"faturamento" | "quilometragem" | "jornadas" | "eficiencia" | "consistencia" | "metas" | "especial">().notNull();
export const raridade = text("raridade").$type<"comum" | "raro" | "epico" | "lendario">().notNull();
export const nivelUsuario = text("nivelUsuario").$type<"iniciante" | "novato" | "experiente" | "motorista" | "profissional" | "especialista" | "mestre" | "lenda">().notNull();
export const tipoNotificacao = text("tipoNotificacao").$type<"sistema" | "alerta" | "promocao" | "suporte">().notNull();

// ===============================
// TABELAS PRINCIPAIS
// ===============================

export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  senhaHash: text("senhaHash", { length: 255 }).notNull(),
  role: userRole.default("user").notNull(),
  statusConta: accountStatus.default("ativo").notNull(),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  
  // Gamificação
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: nivelUsuario.default("iniciante").notNull(),
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
  tipoCombustivel: fuelType.notNull(),
  tipoUso: usageType.notNull(),
  
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
  lucroLiquidoEstimado: integer("lucroLiquidoEstimado").default(0).notNull(),
  margemLucro: real("margemLucro").default(0).notNull(),
  kmTotal: integer("kmTotal"), // Calculado: km_fim - km_inicio
  tempoTotal: integer("tempoTotal"), // Em minutos
  duracaoMinutos: integer("duracaoMinutos"),
  custoCombustivelEstimado: integer("custoCombustivelEstimado").default(0).notNull(),
  outrasDespesas: integer("outrasDespesas").default(0).notNull(),
  
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
  tipoCombustivel: fuelType.notNull(),
  litros: real("litros").notNull(), // REAL para precisão
  valorLitro: integer("valorLitro").notNull(), // Em centavos
  precoPorLitro: real("precoPorLitro").notNull(), // REAL para precisão
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
  tipoDespesa: expenseType.notNull(),
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

export const historicoPrecoCombustivel = sqliteTable("historicoPrecoCombustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(), // Sigla do estado
  tipoCombustivel: fuelType.notNull(),
  precoMedio: integer("precoMedio").notNull(), // Em centavos
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }), // Fonte dos dados
  
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  historicoLocalIdx: index("historicoLocalIdx").on(table.cidade, table.estado),
  historicoCombustivelIdx: index("historicoCombustivelIdx").on(table.tipoCombustivel),
  historicoDataIdx: index("historicoDataIdx").on(table.dataRegistro),
  historicoLocalDataIdx: index("historicoLocalDataIdx").on(table.cidade, table.estado, table.dataRegistro),
}));

export const logsAtividades = sqliteTable("logsAtividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"), // JSON com dados extras
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  logsUsuarioIdx: index("logsUsuarioIdx").on(table.idUsuario),
  logsTipoIdx: index("logsTipoIdx").on(table.tipoAcao),
  logsDataIdx: index("logsDataIdx").on(table.dataAcao),
  logsUsuarioDataIdx: index("logsUsuarioDataIdx").on(table.idUsuario, table.dataAcao),
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
  tipoMeta: goalType.notNull(),
  period: goalPeriod.notNull(),
  
  valorObjetivo: integer("valorObjetivo").notNull(), // Valor em centavos ou unidades
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMeta.default("ativa").notNull(),
  
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






export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacao.notNull(),
  titulo: text("titulo", { length: 200 }).notNull(),
  mensagem: text("mensagem", { length: 1000 }).notNull(),
  dadosExtras: text("dadosExtras"), // JSON com dados extras
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  dataEnvio: integer("dataEnvio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  dataLeitura: integer("dataLeitura", { mode: "timestamp" }),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
}, (table) => ({
  usuarioIdx: index("notificacoes_usuario_idx").on(table.userId),
  tipoIdx: index("notificacoes_tipo_idx").on(table.tipo),
  dataEnvioIdx: index("notificacoes_dataEnvio_idx").on(table.dataEnvio),
  usuarioLidaIdx: index("notificacoes_usuario_lida_idx").on(table.userId, table.lida),
}));

export const notificacoesRelations = relations(notificacoes, ({ one }) => ({
  usuario: one(usuarios, { fields: [notificacoes.userId], references: [usuarios.id] }),
}));


