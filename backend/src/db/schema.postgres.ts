import { pgTable, text, integer, real, timestamp, boolean, index, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ===============================
// ENUMS TIPADOS
// ===============================

export const userRole = text("role").$type<"admin" | "user" | "guest">().notNull();
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
// TABELA DE USUÁRIOS
// ===============================

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  senhaHash: text("senhaHash").notNull(),
  role: userRole.default("user"),
  statusConta: accountStatus.default("ativo"),
  
  // CAMPOS OPCIONAIS - CORRIGIDO
  dataNascimento: timestamp("dataNascimento", { withTimezone: true }),
  cidade: text("cidade"),
  
  dataCadastro: timestamp("dataCadastro", { withTimezone: true }).defaultNow().notNull(),
  
  // Gamificação
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: nivelUsuario.default("iniciante"),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  
  // Auditoria
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  
  // Controle de login
  tentativasLogin: integer("tentativasLogin").default(0).notNull(),
  ultimoLoginFalhado: timestamp("ultimoLoginFalhado", { withTimezone: true }),
  ultimaAtividade: timestamp("ultimaAtividade", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex("usuarios_email_idx").on(table.email),
  statusIdx: index("usuarios_status_idx").on(table.statusConta),
  pontosIdx: index("usuarios_pontos_idx").on(table.pontosTotal),
  nivelIdx: index("usuarios_nivel_idx").on(table.nivelUsuario),
}));

// ===============================
// TABELA DE VEÍCULOS
// ===============================

export const veiculos = pgTable("veiculos", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull(),
  tipoCombustivel: fuelType.notNull(),
  tipoUso: usageType.notNull(),
  
  // Valores em centavos
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: real("mediaConsumo"),
  
  dataCadastro: timestamp("dataCadastro", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("veiculos_usuario_idx").on(table.idUsuario),
  placaIdx: uniqueIndex("veiculos_placa_idx").on(table.placa),
  anoIdx: index("veiculos_ano_idx").on(table.ano),
  combustivelIdx: index("veiculos_combustivel_idx").on(table.tipoCombustivel),
  usuarioAtivoIdx: index("veiculos_usuario_ativo_idx").on(table.idUsuario, table.deletedAt),
}));

// ===============================
// TABELA DE JORNADAS
// ===============================

export const jornadas = pgTable("jornadas", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: uuid("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataInicio: timestamp("dataInicio", { withTimezone: true }).notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: timestamp("dataFim", { withTimezone: true }),
  kmFim: integer("kmFim"),
  
  ganhoBruto: integer("ganhoBruto"),
  lucroLiquidoEstimado: integer("lucroLiquidoEstimado").default(0).notNull(),
  margemLucro: real("margemLucro").default(0).notNull(),
  kmTotal: integer("kmTotal"),
  tempoTotal: integer("tempoTotal"),
  duracaoMinutos: integer("duracaoMinutos"),
  custoCombustivelEstimado: integer("custoCombustivelEstimado").default(0).notNull(),
  outrasDespesas: integer("outrasDespesas").default(0).notNull(),
  
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("jornadas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("jornadas_veiculo_idx").on(table.idVeiculo),
  dataInicioIdx: index("jornadas_dataInicio_idx").on(table.dataInicio),
  periodoIdx: index("jornadas_periodo_idx").on(table.dataInicio, table.dataFim),
  usuarioDataIdx: index("jornadas_usuario_data_idx").on(table.idUsuario, table.dataInicio),
  statusIdx: index("jornadas_status_idx").on(table.dataFim),
}));

// ===============================
// TABELA DE ABASTECIMENTOS
// ===============================

export const abastecimentos = pgTable("abastecimentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: uuid("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataAbastecimento: timestamp("dataAbastecimento", { withTimezone: true }).notNull(),
  tipoCombustivel: fuelType.notNull(),
  litros: real("litros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  precoPorLitro: real("precoPorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(),
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto"),
  
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("abastecimentos_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("abastecimentos_veiculo_idx").on(table.idVeiculo),
  dataIdx: index("abastecimentos_data_idx").on(table.dataAbastecimento),
  veiculoDataIdx: index("abastecimentos_veiculo_data_idx").on(table.idVeiculo, table.dataAbastecimento),
  combustivelIdx: index("abastecimentos_combustivel_idx").on(table.tipoCombustivel),
}));

// ===============================
// TABELA DE DESPESAS
// ===============================

export const despesas = pgTable("despesas", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: uuid("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataDespesa: timestamp("dataDespesa", { withTimezone: true }).notNull(),
  tipoDespesa: expenseType.notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao"),
  
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("despesas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("despesas_veiculo_idx").on(table.idVeiculo),
  dataIdx: index("despesas_data_idx").on(table.dataDespesa),
  tipoIdx: index("despesas_tipo_idx").on(table.tipoDespesa),
  usuarioDataIdx: index("despesas_usuario_data_idx").on(table.idUsuario, table.dataDespesa),
}));

// ===============================
// LOGS DE ATIVIDADES
// ===============================

export const logsAtividades = pgTable("logsAtividades", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao").notNull(),
  descricao: text("descricao"),
  metadados: text("metadados"),
  dataAcao: timestamp("dataAcao", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  logsUsuarioIdx: index("logsUsuarioIdx").on(table.idUsuario),
  logsTipoIdx: index("logsTipoIdx").on(table.tipoAcao),
  logsDataIdx: index("logsDataIdx").on(table.dataAcao),
  logsUsuarioDataIdx: index("logsUsuarioDataIdx").on(table.idUsuario, table.dataAcao),
}));

// ===============================
// SISTEMA DE METAS
// ===============================

export const metas = pgTable("metas", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: uuid("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipoMeta: goalType.notNull(),
  period: goalPeriod.notNull(),
  
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: timestamp("dataInicio", { withTimezone: true }).notNull(),
  dataFim: timestamp("dataFim", { withTimezone: true }).notNull(),
  status: statusMeta.default("ativa"),
  
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: timestamp("dataConclusao", { withTimezone: true }),
  notificacaoEnviada: boolean("notificacaoEnviada").default(false).notNull(),
  
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("metas_usuario_idx").on(table.idUsuario),
  veiculoIdx: index("metas_veiculo_idx").on(table.idVeiculo),
  statusIdx: index("metas_status_idx").on(table.status),
  tipoIdx: index("metas_tipo_idx").on(table.tipoMeta),
  periodoIdx: index("metas_periodo_idx").on(table.dataInicio, table.dataFim),
  usuarioStatusIdx: index("metas_usuario_status_idx").on(table.idUsuario, table.status),
  ativasIdx: index("metas_ativas_idx").on(table.status, table.dataFim),
}));

export const progressoMetas = pgTable("progresso_metas", {
  id: uuid("id").primaryKey().defaultRandom(),
  idMeta: uuid("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  
  dataRegistro: timestamp("dataRegistro", { withTimezone: true }).defaultNow().notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  metaIdx: index("progresso_meta_idx").on(table.idMeta),
  dataIdx: index("progresso_data_idx").on(table.dataRegistro),
  metaDataIdx: index("progresso_meta_data_idx").on(table.idMeta, table.dataRegistro),
}));

// ===============================
// NOTIFICAÇÕES
// ===============================

export const notificacoes = pgTable("notificacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacao.notNull(),
  titulo: text("titulo").notNull(),
  mensagem: text("mensagem").notNull(),
  dadosExtras: text("dadosExtras"),
  lida: boolean("lida").default(false).notNull(),
  dataEnvio: timestamp("dataEnvio", { withTimezone: true }).defaultNow().notNull(),
  dataLeitura: timestamp("dataLeitura", { withTimezone: true }),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("notificacoes_usuario_idx").on(table.userId),
  tipoIdx: index("notificacoes_tipo_idx").on(table.tipo),
  dataEnvioIdx: index("notificacoes_dataEnvio_idx").on(table.dataEnvio),
  usuarioLidaIdx: index("notificacoes_usuario_lida_idx").on(table.userId, table.lida),
}));

// ===============================
// PLATAFORMAS
// ===============================

export const plataformas = pgTable("plataformas", {
  id: uuid("id").primaryKey().defaultRandom(),
  idUsuario: uuid("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  isPadrao: boolean("isPadrao").default(false).notNull(),
  ativa: boolean("ativa").default(true).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
}, (table) => ({
  usuarioIdx: index("plataformas_usuario_idx").on(table.idUsuario),
  nomeUnicoIdx: uniqueIndex("plataformas_nome_unico_idx").on(table.idUsuario, table.nome),
}));

export const jornadasFaturamentoPorPlataforma = pgTable("jornadasFaturamentoPorPlataforma", {
  id: uuid("id").primaryKey().defaultRandom(),
  idJornada: uuid("idJornada").notNull().references(() => jornadas.id, { onDelete: "cascade" }),
  idPlataforma: uuid("idPlataforma").notNull().references(() => plataformas.id, { onDelete: "cascade" }),
  valor: integer("valor").notNull(),
  valorAntesCorte: integer("valorAntesCorte"),
  valorDepoisCorte: integer("valorDepoisCorte"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jornadaPlataformaIdx: uniqueIndex("jornadasFaturamentoPorPlataforma_jornada_plataforma_idx").on(table.idJornada, table.idPlataforma),
  jornadaIdx: index("jornadasFaturamentoPorPlataforma_jornada_idx").on(table.idJornada),
  plataformaIdx: index("jornadasFaturamentoPorPlataforma_plataforma_idx").on(table.idPlataforma),
}));

// ===============================
// RELATIONS
// ===============================

export const notificacoesRelations = relations(notificacoes, ({ one }) => ({
  usuario: one(usuarios, { fields: [notificacoes.userId], references: [usuarios.id] }),
}));

export const plataformasRelations = relations(plataformas, ({ one }) => ({
  usuario: one(usuarios, { fields: [plataformas.idUsuario], references: [usuarios.id] }),
}));

export const jornadasFaturamentoPorPlataformaRelations = relations(jornadasFaturamentoPorPlataforma, ({ one }) => ({
  jornada: one(jornadas, { fields: [jornadasFaturamentoPorPlataforma.idJornada], references: [jornadas.id] }),
  plataforma: one(plataformas, { fields: [jornadasFaturamentoPorPlataforma.idPlataforma], references: [plataformas.id] }),
}));
