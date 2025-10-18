import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Tabela de Usuários
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  role: text("role").default("user").notNull(),
  statusConta: text("status_conta").default("ativo").notNull(),
  dataNascimento: integer("data_nascimento", { mode: 'timestamp' }),
  cidade: text("cidade"),
  dataCadastro: integer("data_cadastro", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  pontosTotal: integer("pontos_total").default(0).notNull(),
  nivelUsuario: text("nivel_usuario").default("iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistas_desbloqueadas").default(0).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
  tentativasLogin: integer("tentativas_login").default(0).notNull(),
  ultimoLoginFalhado: integer("ultimo_login_falhado", { mode: 'timestamp' }),
  ultimaAtividade: integer("ultima_atividade", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tabela de Veículos
export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("id_usuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa").notNull().unique(),
  tipoCombustivel: text("tipo_combustivel").notNull(),
  tipoUso: text("tipo_uso").notNull(),
  valorAluguel: integer("valor_aluguel"),
  valorPrestacao: integer("valor_prestacao"),
  mediaConsumo: real("media_consumo"),
  dataCadastro: integer("data_cadastro", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});

// Tabela de Jornadas
export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("id_usuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("id_veiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataInicio: integer("data_inicio", { mode: 'timestamp' }).notNull(),
  kmInicio: integer("km_inicio").notNull(),
  dataFim: integer("data_fim", { mode: 'timestamp' }),
  kmFim: integer("km_fim"),
  ganhoBruto: integer("ganho_bruto"),
  lucroLiquidoEstimado: integer("lucro_liquido_estimado").default(0).notNull(),
  margemLucro: real("margem_lucro").default(0).notNull(),
  kmTotal: integer("km_total"),
  duracaoMinutos: integer("duracao_minutos"),
  custoCombustivelEstimado: integer("custo_combustivel_estimado").default(0).notNull(),
  outrasDespesas: integer("outras_despesas").default(0).notNull(),
  observacoes: text("observacoes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});

// Tabela de Abastecimentos
export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("id_usuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("id_veiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataAbastecimento: integer("data_abastecimento", { mode: 'timestamp' }).notNull(),
  tipoCombustivel: text("tipo_combustivel").notNull(),
  litros: real("litros").notNull(),
  valorLitro: integer("valor_litro").notNull(),
  valorTotal: integer("valor_total").notNull(),
  kmAtual: integer("km_atual"),
  nomePosto: text("nome_posto"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});

// Tabela de Despesas
export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("id_usuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("id_veiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  dataDespesa: integer("data_despesa", { mode: 'timestamp' }).notNull(),
  tipoDespesa: text("tipo_despesa").notNull(),
  valorDespesa: integer("valor_despesa").notNull(),
  descricao: text("descricao"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});

// Tabela de Plataformas
export const plataformas = sqliteTable("plataformas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("id_usuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  isPadrao: integer("is_padrao", { mode: 'boolean' }).default(false).notNull(),
  ativa: integer("ativa", { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});
// Tabela de Jornadas Faturamento Por Plataforma
export const jornadasFaturamentoPorPlataforma = sqliteTable("jornadas_faturamento_por_plataforma", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idJornada: text("id_jornada").notNull().references(() => jornadas.id, { onDelete: "cascade" }),
  idPlataforma: text("id_plataforma").notNull().references(() => plataformas.id, { onDelete: "cascade" }),
  valor: integer("valor").notNull(),
  valorAntesCorte: integer("valor_antes_corte"),
  valorDepoisCorte: integer("valor_depois_corte"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
