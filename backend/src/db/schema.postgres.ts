import { pgTable, text, integer, real, index, uniqueIndex, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ===============================
// ENUMS TIPADOS
// ===============================

export const userRoleEnum = text("role").$type<"admin" | "user" | "guest">();
export const accountStatusEnum = text("statusConta").$type<"ativo" | "inativo" | "suspenso">();
export const fuelTypeEnum = text("tipoCombustivel").$type<"gasolina" | "etanol" | "diesel" | "gnv" | "flex">();
export const usageTypeEnum = text("tipoUso").$type<"proprio" | "alugado" | "financiado">();
export const expenseTypeEnum = text("expenseType").$type<"manutencao" | "pneus" | "seguro" | "outros">();
export const goalTypeEnum = text("goalType").$type<"faturamento" | "quilometragem" | "jornadas" | "economia" | "lucro">();
export const goalPeriodEnum = text("goalPeriod").$type<"semanal" | "mensal" | "trimestral" | "anual">();
export const statusMetaEnum = text("statusMeta").$type<"ativa" | "pausada" | "concluida" | "expirada">();
export const nivelUsuarioEnum = text("nivelUsuario").$type<"iniciante" | "novato" | "experiente" | "motorista" | "profissional" | "especialista" | "mestre" | "lenda">();
export const tipoNotificacaoEnum = text("tipoNotificacao").$type<"sistema" | "alerta" | "promocao" | "suporte">();

// ===============================
// TABELAS PRINCIPAIS
// ===============================

export const usuarios = pgTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  senhaHash: text("senhaHash").notNull(),
  role: text("role").default("user").notNull(),
  statusConta: text("statusConta").default("ativo").notNull(),
  dataNascimento: timestamp("dataNascimento"),
  cidade: text("cidade"),
  dataCadastro: timestamp("dataCadastro").defaultNow().notNull(),
  
  // Gamificação
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: text("nivelUsuario").default("iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  
  // Auditoria
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
  
  // Controle de login
  tentativasLogin: integer("tentativasLogin").default(0).notNull(),
  ultimoLoginFalhado: timestamp("ultimoLoginFalhado"),
  ultimaAtividade: timestamp("ultimaAtividade").defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex("usuarios_email_idx").on(table.email),
  statusIdx: index("usuarios_status_idx").on(table.statusConta),
  pontosIdx: index("usuarios_pontos_idx").on(table.pontosTotal),
  nivelIdx: index("usuarios_nivel_idx").on(table.nivelUsuario),
}));

export const veiculos = pgTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull(),
  tipoCombustivel: text("tipoCombustivel").notNull(),
  tipoUso: text("tipoUso").notNull(),
  
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: real("mediaConsumo"),
  
  dataCadastro: timestamp("dataCadastro").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, (table) => ({
  usuarioIdx: index("veiculos_usuario_idx").on(table.idUsuario),
  placaIdx: uniqueIndex("veiculos_placa_idx").on(table.placa),
  anoIdx: index("veiculos_ano_idx").on(table.ano),
  combustivelIdx: index("veiculos_combustivel_idx").on(table.tipoCombustivel),
}));

export const jornadas = pgTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  
  dataInicio: timestamp("dataInicio").notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: timestamp("dataFim"),
  kmFim: integer("kmFim"),
  
  ganhoBruto: integer("ganhoBruto"),
  lucroLiquidoEstimado: integer("lucroLiquidoEstimado").default(0).notNull(),
  margemLucro: real("margemLuc