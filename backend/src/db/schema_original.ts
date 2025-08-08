import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Enums
export const statusContaEnum = text("status_conta").$type<"Ativo" | "Inativo" | "Suspenso">().notNull();
export const tipoCombustivelEnum = text("tipoCombustivel").$type<"Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex">().notNull();
export const tipoUsoEnum = text("tipo_uso").$type<"Proprio" | "Alugado" | "Financiado">().notNull();
export const tipoDespesaEnum = text("tipoDespesa").$type<"Manutencao" | "Pneus" | "Seguro" | "Outros">().notNull();
export const tipoMetaEnum = text("tipo_meta").$type<"Faturamento" | "Quilometragem" | "Jornadas" | "Economia" | "Lucro">().notNull();
export const periodoMetaEnum = text("periodo_meta").$type<"Semanal" | "Mensal" | "Trimestral" | "Anual">().notNull();
export const statusMetaEnum = text("status_meta").$type<"Ativa" | "Pausada" | "Concluida" | "Expirada">().notNull();
export const tipoConquistaEnum = text("tipo_conquista").$type<"Faturamento" | "Quilometragem" | "Jornadas" | "Eficiencia" | "Consistencia" | "Metas" | "Especial">().notNull();
export const raridadeEnum = text("raridade").$type<"Comum" | "Raro" | "Epico" | "Lendario">().notNull();
export const nivelUsuarioEnum = text("nivel_usuario").$type<"Iniciante" | "Novato" | "Experiente" | "Motorista" | "Profissional" | "Especialista" | "Mestre" | "Lenda">().notNull();
export const tipoNotificacaoEnum = text("tipo_notificacao").$type<"Sistema" | "Alerta" | "Promocao" | "Suporte">().notNull();

// Tables
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  nome: text("nome", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  senha_hash: text("senha_hash").notNull(),
  status_conta: statusContaEnum.default("Ativo").notNull(),
  data_cadastro: text("data_cadastro").default(sql`CURRENT_TIMESTAMP`).notNull(),
  // Campos de gamificação
  pontos_total: integer("pontos_total").default(0).notNull(),
  nivel_usuario: nivelUsuarioEnum.default("Iniciante").notNull(),
  conquistas_desbloqueadas: integer("conquistas_desbloqueadas").default(0).notNull(),
  deletedAt: text("deletedAt"), // Soft delete
});

export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull().unique(), // Formato Mercosul ou antigo
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  tipo_uso: tipoUsoEnum.notNull(),
  valor_aluguel: integer("valor_aluguel"), // Apenas se tipo_uso = "Alugado"
  valor_prestacao: integer("valor_prestacao"), // Apenas se tipo_uso = "Financiado"
  media_consumo: integer("media_consumo"), // Calculado com base nos abastecimentos
  data_cadastro: text("data_cadastro").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: text("deletedAt"),
});

export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataInicio: text("dataInicio").notNull(),
  km_inicio: integer("km_inicio").notNull(),
  dataFim: text("dataFim"),
  km_fim: integer("km_fim"),
  ganho_bruto: integer("ganho_bruto"),
  km_total: integer("km_total"), // Calculado
  tempo_total: integer("tempo_total"), // Calculado em minutos
  observacoes: text("observacoes"),
  deletedAt: text("deletedAt"),
});

export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataAbastecimento: text("dataAbastecimento").notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  quantidadeLitros: integer("quantidadeLitros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(), // Calculado
  kmAtual: integer("kmAtual"), // Quilometragem do veículo no momento do abastecimento
  nomePosto: text("nomePosto"),
  deletedAt: text("deletedAt"),
});

export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }), // Opcional
  dataDespesa: text("dataDespesa").notNull(),
  tipoDespesa: tipoDespesaEnum.notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao"),
  deletedAt: text("deletedAt"),
});

export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  cidade: text("cidade").notNull(),
  estado: text("estado").notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  preco_medio: integer("preco_medio").notNull(), // Preço em centavos
  data_registro: text("data_registro").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: text("deletedAt"),
});

export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }), // Pode ser nulo para atividades do sistema
  tipo_acao: text("tipo_acao").notNull(),
  descricao: text("descricao"),
  data_acao: text("data_acao").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: text("deletedAt"),
});

// Tabelas do Sistema de Metas
export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }), // Opcional - meta pode ser geral ou específica de um veículo
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipo_meta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  valor_objetivo: integer("valor_objetivo").notNull(), // Valor em centavos ou unidade específica
  dataInicio: text("dataInicio").notNull(),
  dataFim: text("dataFim").notNull(),
  status: statusMetaEnum.default("Ativa").notNull(),
  valor_atual: integer("valor_atual").default(0).notNull(), // Progresso atual
  percentual_concluido: integer("percentual_concluido").default(0).notNull(), // 0-100
  data_conclusao: text("data_conclusao"), // Quando foi atingida
  notificacao_enviada: integer("notificacao_enviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: text("deletedAt"),
});

export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  id_meta: text("id_meta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  data_registro: text("data_registro").default(sql`CURRENT_TIMESTAMP`).notNull(),
  valor_anterior: integer("valor_anterior").notNull(),
  valor_atual: integer("valor_atual").notNull(),
  incremento: integer("incremento").notNull(), // valor_atual - valor_anterior
  percentual_anterior: integer("percentual_anterior").notNull(),
  percentual_atual: integer("percentual_atual").notNull(),
  observacoes: text("observacoes"),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabelas do Sistema de Gamificação
export const conquistas = sqliteTable("conquistas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  nome: text("nome", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  tipo_conquista: tipoConquistaEnum.notNull(),
  raridade: raridadeEnum.default("Comum").notNull(),
  icone: text("icone"),
  cor: text("cor").default("#4CAF50"),
  criterio_valor: integer("criterio_valor"), // Valor necessário para desbloquear
  criterio_descricao: text("criterio_descricao"), // Descrição detalhada do critério
  pontos_recompensa: integer("pontos_recompensa").default(10).notNull(),
  ativa: integer("ativa", { mode: "boolean" }).default(sql`TRUE`).notNull(),
  ordem_exibicao: integer("ordem_exibicao").default(0).notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const usuarioConquistas = sqliteTable("usuario_conquistas", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  id_conquista: text("id_conquista").notNull().references(() => conquistas.id, { onDelete: "cascade" }),
  data_desbloqueio: text("data_desbloqueio").default(sql`CURRENT_TIMESTAMP`).notNull(),
  valor_atingido: integer("valor_atingido"), // Valor que o usuário atingiu para desbloquear
  notificacao_enviada: integer("notificacao_enviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const nivelUsuario = sqliteTable("nivel_usuario", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  nivel: nivelUsuarioEnum.notNull().unique(),
  nome_exibicao: text("nome_exibicao").notNull(),
  pontos_necessarios: integer("pontos_necessarios").notNull(),
  cor: text("cor").default("#2196F3").notNull(),
  icone: text("icone"),
  beneficios: text("beneficios"), // Descrição dos benefícios do nível
  ordem: integer("ordem").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().default(sql`uuid_generate_v4()`),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  mensagem: text("mensagem").notNull(),
  tipo: tipoNotificacaoEnum.default("Sistema").notNull(),
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  data_envio: text("data_envio").default(sql`CURRENT_TIMESTAMP`).notNull(),
  data_leitura: text("data_leitura"), // Adicionado
  dados_extras: text("dados_extras"), // Adicionado
  deletedAt: text("deletedAt"),
});

// Relations
export const usuariosRelations = relations(usuarios, ({ many }) => ({
  veiculos: many(veiculos),
  jornadas: many(jornadas),
  abastecimentos: many(abastecimentos),
  despesas: many(despesas),
  logsAtividades: many(logsAtividades),
  metas: many(metas),
  usuarioConquistas: many(usuarioConquistas),
  notificacoes: many(notificacoes),
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

export const logsAtividadesRelations = relations(logsAtividades, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [logsAtividades.idUsuario],
    references: [usuarios.id],
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
  progressos: many(progressoMetas),
}));

export const progressoMetasRelations = relations(progressoMetas, ({ one }) => ({
  meta: one(metas, {
    fields: [progressoMetas.id_meta],
    references: [metas.id],
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
    fields: [usuarioConquistas.id_conquista],
    references: [conquistas.id],
  }),
}));

export const notificacoesRelations = relations(notificacoes, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [notificacoes.idUsuario],
    references: [usuarios.id],
  }),
}));



