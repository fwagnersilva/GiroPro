import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ENUMs
export const tipoCombustivelEnum = ['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex'] as const;
export const tipoUsoEnum = ['Proprio', 'Alugado', 'Financiado'] as const;
export const tipoDespesaEnum = ["Manutencao", "Pneus", "Seguro", "Outros"] as const;
export const tipoMetaEnum = ["Faturamento", "Economia", "Quilometragem"] as const;
export const periodoMetaEnum = ["Diaria", "Semanal", "Mensal"] as const;

// Tables
export const usuarios = sqliteTable("usuarios", {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  senha_hash: text('senha_hash').notNull(),
  status_conta: text('status_conta').default('Ativo').notNull(),
  data_cadastro: text('data_cadastro').notNull(),
  pontos_total: integer('pontos_total').default(0).notNull(),
  nivel_usuario: text('nivel_usuario').default('Iniciante').notNull(),
  conquistas_desbloqueadas: integer('conquistas_desbloqueadas').default(0).notNull(),
  deleted_at: text('deleted_at'),
});

export const veiculos = sqliteTable("veiculos", {
  id: text('id').primaryKey(),
  id_usuario: text('id_usuario').notNull().references(() => usuarios.id),
  marca: text('marca').notNull(),
  modelo: text('modelo').notNull(),
  ano: integer('ano').notNull(),
  placa: text('placa').notNull().unique(),
  tipo_combustivel: text('tipo_combustivel', { enum: tipoCombustivelEnum }).notNull(),
  tipo_uso: text('tipo_uso', { enum: tipoUsoEnum }).notNull(),
  valor_aluguel: integer('valor_aluguel'),
  valor_prestacao: integer('valor_prestacao'),
  media_consumo: integer('media_consumo'),
  data_cadastro: text('data_cadastro').notNull(),
  deleted_at: text('deleted_at'),
});

export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").notNull().references(() => veiculos.id),
  data_inicio: text('data_inicio').notNull(),
  km_inicio: integer('km_inicio').notNull(),
  data_fim: text('data_fim'),
  km_fim: integer('km_fim'),
  ganho_bruto: integer('ganho_bruto'),
  km_total: integer('km_total'),
  tempo_total: integer('tempo_total'),
  observacoes: text('observacoes'),
  deleted_at: text('deleted_at'),
});

export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").notNull().references(() => veiculos.id),
  data_abastecimento: text("data_abastecimento").notNull(),
  tipo_combustivel: text("tipo_combustivel", { enum: tipoCombustivelEnum }).notNull(),
  litros: real("litros").notNull(),
  preco_litro: integer("preco_litro").notNull(),
  valor_total: integer("valor_total").notNull(),
  km_atual: integer("km_atual"),
  nome_posto: text("nome_posto"),
  deleted_at: text('deleted_at'),
});

export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").references(() => veiculos.id),
  data_despesa: text("data_despesa").notNull(),
  tipo_despesa: text("tipo_despesa", { enum: tipoDespesaEnum }).notNull(),
  valor_despesa: integer('valor_despesa').notNull(),
  descricao: text('descricao'),
  deleted_at: text('deleted_at'),
});

export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey(),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  titulo: text('titulo').notNull(),
  mensagem: text('mensagem').notNull(),
  tipo: text('tipo').default('Sistema').notNull(),
  lida: integer('lida', { mode: "boolean" }).default(false).notNull(),
  data_envio: text('data_envio').notNull(),
  data_leitura: text('data_leitura'),
  dados_extras: text('dados_extras'),
  deleted_at: text('deleted_at'),
});

// Relations
export const usuariosRelations = relations(usuarios, ({ many }) => ({
  veiculos: many(veiculos),
  jornadas: many(jornadas),
  abastecimentos: many(abastecimentos),
  despesas: many(despesas),
  notificacoes: many(notificacoes),
}));

export const veiculosRelations = relations(veiculos, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [veiculos.id_usuario],
    references: [usuarios.id],
  }),
  jornadas: many(jornadas),
  abastecimentos: many(abastecimentos),
  despesas: many(despesas),
}));

export const jornadasRelations = relations(jornadas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [jornadas.id_usuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [jornadas.id_veiculo],
    references: [veiculos.id],
  }),
}));

export const abastecimentosRelations = relations(abastecimentos, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [abastecimentos.id_usuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [abastecimentos.id_veiculo],
    references: [veiculos.id],
  }),
}));

export const despesasRelations = relations(despesas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [despesas.id_usuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [despesas.id_veiculo],
    references: [veiculos.id],
  }),
}));

export const notificacoesRelations = relations(notificacoes, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [notificacoes.id_usuario],
    references: [usuarios.id],
  }),
}));

export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  id_usuario: text("id_usuario").notNull().references(() => usuarios.id),
  id_veiculo: text("id_veiculo").references(() => veiculos.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipo_meta: text("tipo_meta", { enum: tipoMetaEnum }).notNull(),
  periodo: text("periodo", { enum: periodoMetaEnum }).notNull(),
  valor_objetivo: integer('valor_objetivo').notNull(),
  valor_atual: integer('valor_atual').default(0).notNull(),
  percentual_concluido: integer('percentual_concluido').default(0).notNull(),
  data_inicio: text('data_inicio').notNull(),
  data_fim: text('data_fim').notNull(),
  data_conclusao: text('data_conclusao'),
  status: text('status').default('Ativa').notNull(),
  data_criacao: text('data_criacao').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  deleted_at: text('deleted_at'),
});

export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey(),
  id_meta: text("id_meta").notNull().references(() => metas.id),
  data_registro: text('data_registro').notNull(),
  valor_atual: integer('valor_atual').notNull(),
  valor_anterior: integer('valor_anterior').default(0).notNull(),
  incremento: integer('incremento').default(0).notNull(),
  percentual_atingido: integer('percentual_atingido').notNull(),
  deleted_at: text('deleted_at'),
});

// Relations para metas
export const metasRelations = relations(metas, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [metas.id_usuario],
    references: [usuarios.id],
  }),
  veiculo: one(veiculos, {
    fields: [metas.id_veiculo],
    references: [veiculos.id],
  }),
  progressos: many(progressoMetas),
}));

export const progressoMetasRelations = relations(progressoMetas, ({ one }) => ({
  meta: one(metas, {
    fields: [progressoMetas.id_meta],
    references: [metas.id],
  }),
}));

