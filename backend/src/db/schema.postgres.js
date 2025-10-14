"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jornadasFaturamentoPorPlataformaRelations = exports.plataformasRelations = exports.notificacoesRelations = exports.jornadasFaturamentoPorPlataforma = exports.plataformas = exports.notificacoes = exports.progressoMetas = exports.metas = exports.logsAtividades = exports.despesas = exports.abastecimentos = exports.jornadas = exports.veiculos = exports.usuarios = exports.tipoNotificacao = exports.nivelUsuario = exports.raridade = exports.tipoConquista = exports.statusMeta = exports.goalPeriod = exports.goalType = exports.expenseType = exports.usageType = exports.fuelType = exports.accountStatus = exports.userRole = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
// ===============================
// ENUMS TIPADOS
// ===============================
exports.userRole = (0, pg_core_1.text)("role").$type().notNull();
exports.accountStatus = (0, pg_core_1.text)("statusConta").$type().notNull();
exports.fuelType = (0, pg_core_1.text)("tipoCombustivel").$type().notNull();
exports.usageType = (0, pg_core_1.text)("tipoUso").$type().notNull();
exports.expenseType = (0, pg_core_1.text)("tipoDespesa").$type().notNull();
exports.goalType = (0, pg_core_1.text)("tipoMeta").$type().notNull();
exports.goalPeriod = (0, pg_core_1.text)("periodoMeta").$type().notNull();
exports.statusMeta = (0, pg_core_1.text)("statusMeta").$type().notNull();
exports.tipoConquista = (0, pg_core_1.text)("tipoConquista").$type().notNull();
exports.raridade = (0, pg_core_1.text)("raridade").$type().notNull();
exports.nivelUsuario = (0, pg_core_1.text)("nivelUsuario").$type().notNull();
exports.tipoNotificacao = (0, pg_core_1.text)("tipoNotificacao").$type().notNull();
// ===============================
// TABELA DE USUÁRIOS
// ===============================
exports.usuarios = (0, pg_core_1.pgTable)("usuarios", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    nome: (0, pg_core_1.text)("nome").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    senhaHash: (0, pg_core_1.text)("senhaHash").notNull(),
    role: exports.userRole.default("user"),
    statusConta: exports.accountStatus.default("ativo"),
    // Campos opcionais
    dataNascimento: (0, pg_core_1.timestamp)("dataNascimento", { withTimezone: true }),
    cidade: (0, pg_core_1.text)("cidade"),
    dataCadastro: (0, pg_core_1.timestamp)("dataCadastro", { withTimezone: true }).defaultNow().notNull(),
    // Gamificação
    pontosTotal: (0, pg_core_1.integer)("pontosTotal").default(0).notNull(),
    nivelUsuario: exports.nivelUsuario.default("iniciante"),
    conquistasDesbloqueadas: (0, pg_core_1.integer)("conquistasDesbloqueadas").default(0).notNull(),
    // Auditoria
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
    // Controle de login
    tentativasLogin: (0, pg_core_1.integer)("tentativasLogin").default(0).notNull(),
    ultimoLoginFalhado: (0, pg_core_1.timestamp)("ultimoLoginFalhado", { withTimezone: true }),
    ultimaAtividade: (0, pg_core_1.timestamp)("ultimaAtividade", { withTimezone: true }).defaultNow().notNull(),
}, function (table) { return ({
    emailIdx: (0, pg_core_1.uniqueIndex)("usuarios_email_idx").on(table.email),
    statusIdx: (0, pg_core_1.index)("usuarios_status_idx").on(table.statusConta),
    pontosIdx: (0, pg_core_1.index)("usuarios_pontos_idx").on(table.pontosTotal),
    nivelIdx: (0, pg_core_1.index)("usuarios_nivel_idx").on(table.nivelUsuario),
}); });
// ===============================
// TABELA DE VEÍCULOS
// ===============================
exports.veiculos = (0, pg_core_1.pgTable)("veiculos", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    marca: (0, pg_core_1.text)("marca").notNull(),
    modelo: (0, pg_core_1.text)("modelo").notNull(),
    ano: (0, pg_core_1.integer)("ano").notNull(),
    placa: (0, pg_core_1.text)("placa").notNull(),
    tipoCombustivel: exports.fuelType.notNull(),
    tipoUso: exports.usageType.notNull(),
    // Valores em centavos
    valorAluguel: (0, pg_core_1.integer)("valorAluguel"),
    valorPrestacao: (0, pg_core_1.integer)("valorPrestacao"),
    mediaConsumo: (0, pg_core_1.real)("mediaConsumo"), // km/l
    dataCadastro: (0, pg_core_1.timestamp)("dataCadastro", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("veiculos_usuario_idx").on(table.idUsuario),
    placaIdx: (0, pg_core_1.uniqueIndex)("veiculos_placa_idx").on(table.placa),
    anoIdx: (0, pg_core_1.index)("veiculos_ano_idx").on(table.ano),
    combustivelIdx: (0, pg_core_1.index)("veiculos_combustivel_idx").on(table.tipoCombustivel),
    usuarioAtivoIdx: (0, pg_core_1.index)("veiculos_usuario_ativo_idx").on(table.idUsuario, table.deletedAt),
}); });
// ===============================
// TABELA DE JORNADAS
// ===============================
exports.jornadas = (0, pg_core_1.pgTable)("jornadas", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    idVeiculo: (0, pg_core_1.uuid)("idVeiculo").notNull().references(function () { return exports.veiculos.id; }, { onDelete: "cascade" }),
    dataInicio: (0, pg_core_1.timestamp)("dataInicio", { withTimezone: true }).notNull(),
    kmInicio: (0, pg_core_1.integer)("kmInicio").notNull(),
    dataFim: (0, pg_core_1.timestamp)("dataFim", { withTimezone: true }),
    kmFim: (0, pg_core_1.integer)("kmFim"),
    ganhoBruto: (0, pg_core_1.integer)("ganhoBruto"), // Em centavos
    lucroLiquidoEstimado: (0, pg_core_1.integer)("lucroLiquidoEstimado").default(0).notNull(),
    margemLucro: (0, pg_core_1.real)("margemLucro").default(0).notNull(),
    kmTotal: (0, pg_core_1.integer)("kmTotal"), // Calculado: kmFim - kmInicio
    duracaoMinutos: (0, pg_core_1.integer)("duracaoMinutos"), // Duração em minutos
    custoCombustivelEstimado: (0, pg_core_1.integer)("custoCombustivelEstimado").default(0).notNull(),
    outrasDespesas: (0, pg_core_1.integer)("outrasDespesas").default(0).notNull(),
    observacoes: (0, pg_core_1.text)("observacoes"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("jornadas_usuario_idx").on(table.idUsuario),
    veiculoIdx: (0, pg_core_1.index)("jornadas_veiculo_idx").on(table.idVeiculo),
    dataInicioIdx: (0, pg_core_1.index)("jornadas_dataInicio_idx").on(table.dataInicio),
    periodoIdx: (0, pg_core_1.index)("jornadas_periodo_idx").on(table.dataInicio, table.dataFim),
    usuarioDataIdx: (0, pg_core_1.index)("jornadas_usuario_data_idx").on(table.idUsuario, table.dataInicio),
    statusIdx: (0, pg_core_1.index)("jornadas_status_idx").on(table.dataFim),
}); });
// ===============================
// TABELA DE ABASTECIMENTOS
// ===============================
exports.abastecimentos = (0, pg_core_1.pgTable)("abastecimentos", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    idVeiculo: (0, pg_core_1.uuid)("idVeiculo").notNull().references(function () { return exports.veiculos.id; }, { onDelete: "cascade" }),
    dataAbastecimento: (0, pg_core_1.timestamp)("dataAbastecimento", { withTimezone: true }).notNull(),
    tipoCombustivel: exports.fuelType.notNull(),
    litros: (0, pg_core_1.real)("litros").notNull(),
    valorLitro: (0, pg_core_1.integer)("valorLitro").notNull(), // Preço por litro em centavos
    valorTotal: (0, pg_core_1.integer)("valorTotal").notNull(), // Em centavos
    kmAtual: (0, pg_core_1.integer)("kmAtual"),
    nomePosto: (0, pg_core_1.text)("nomePosto"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("abastecimentos_usuario_idx").on(table.idUsuario),
    veiculoIdx: (0, pg_core_1.index)("abastecimentos_veiculo_idx").on(table.idVeiculo),
    dataIdx: (0, pg_core_1.index)("abastecimentos_data_idx").on(table.dataAbastecimento),
    veiculoDataIdx: (0, pg_core_1.index)("abastecimentos_veiculo_data_idx").on(table.idVeiculo, table.dataAbastecimento),
    combustivelIdx: (0, pg_core_1.index)("abastecimentos_combustivel_idx").on(table.tipoCombustivel),
}); });
// ===============================
// TABELA DE DESPESAS
// ===============================
exports.despesas = (0, pg_core_1.pgTable)("despesas", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    idVeiculo: (0, pg_core_1.uuid)("idVeiculo").references(function () { return exports.veiculos.id; }, { onDelete: "cascade" }),
    dataDespesa: (0, pg_core_1.timestamp)("dataDespesa", { withTimezone: true }).notNull(),
    tipoDespesa: exports.expenseType.notNull(),
    valorDespesa: (0, pg_core_1.integer)("valorDespesa").notNull(), // Em centavos
    descricao: (0, pg_core_1.text)("descricao"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("despesas_usuario_idx").on(table.idUsuario),
    veiculoIdx: (0, pg_core_1.index)("despesas_veiculo_idx").on(table.idVeiculo),
    dataIdx: (0, pg_core_1.index)("despesas_data_idx").on(table.dataDespesa),
    tipoIdx: (0, pg_core_1.index)("despesas_tipo_idx").on(table.tipoDespesa),
    usuarioDataIdx: (0, pg_core_1.index)("despesas_usuario_data_idx").on(table.idUsuario, table.dataDespesa),
}); });
// ===============================
// LOGS DE ATIVIDADES
// ===============================
exports.logsAtividades = (0, pg_core_1.pgTable)("logsAtividades", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").references(function () { return exports.usuarios.id; }, { onDelete: "set null" }),
    tipoAcao: (0, pg_core_1.text)("tipoAcao").notNull(),
    descricao: (0, pg_core_1.text)("descricao"),
    metadados: (0, pg_core_1.text)("metadados"), // JSON stringify
    dataAcao: (0, pg_core_1.timestamp)("dataAcao", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    logsUsuarioIdx: (0, pg_core_1.index)("logsAtividades_usuario_idx").on(table.idUsuario),
    logsTipoIdx: (0, pg_core_1.index)("logsAtividades_tipo_idx").on(table.tipoAcao),
    logsDataIdx: (0, pg_core_1.index)("logsAtividades_data_idx").on(table.dataAcao),
    logsUsuarioDataIdx: (0, pg_core_1.index)("logsAtividades_usuario_data_idx").on(table.idUsuario, table.dataAcao),
}); });
// ===============================
// SISTEMA DE METAS
// ===============================
exports.metas = (0, pg_core_1.pgTable)("metas", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    idVeiculo: (0, pg_core_1.uuid)("idVeiculo").references(function () { return exports.veiculos.id; }, { onDelete: "cascade" }),
    titulo: (0, pg_core_1.text)("titulo").notNull(),
    descricao: (0, pg_core_1.text)("descricao"),
    tipoMeta: exports.goalType.notNull(),
    periodoMeta: exports.goalPeriod.notNull(),
    valorObjetivo: (0, pg_core_1.integer)("valorObjetivo").notNull(), // Valor alvo em centavos ou unidades
    dataInicio: (0, pg_core_1.timestamp)("dataInicio", { withTimezone: true }).notNull(),
    dataFim: (0, pg_core_1.timestamp)("dataFim", { withTimezone: true }).notNull(),
    status: exports.statusMeta.default("ativa"),
    valorAtual: (0, pg_core_1.integer)("valorAtual").default(0).notNull(),
    percentualConcluido: (0, pg_core_1.integer)("percentualConcluido").default(0).notNull(), // 0-100
    dataConclusao: (0, pg_core_1.timestamp)("dataConclusao", { withTimezone: true }),
    notificacaoEnviada: (0, pg_core_1.boolean)("notificacaoEnviada").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("metas_usuario_idx").on(table.idUsuario),
    veiculoIdx: (0, pg_core_1.index)("metas_veiculo_idx").on(table.idVeiculo),
    statusIdx: (0, pg_core_1.index)("metas_status_idx").on(table.status),
    tipoIdx: (0, pg_core_1.index)("metas_tipo_idx").on(table.tipoMeta),
    periodoIdx: (0, pg_core_1.index)("metas_periodo_idx").on(table.dataInicio, table.dataFim),
    usuarioStatusIdx: (0, pg_core_1.index)("metas_usuario_status_idx").on(table.idUsuario, table.status),
    ativasIdx: (0, pg_core_1.index)("metas_ativas_idx").on(table.status, table.dataFim),
}); });
exports.progressoMetas = (0, pg_core_1.pgTable)("progressoMetas", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idMeta: (0, pg_core_1.uuid)("idMeta").notNull().references(function () { return exports.metas.id; }, { onDelete: "cascade" }),
    dataRegistro: (0, pg_core_1.timestamp)("dataRegistro", { withTimezone: true }).defaultNow().notNull(),
    valorAnterior: (0, pg_core_1.integer)("valorAnterior").notNull(),
    valorAtual: (0, pg_core_1.integer)("valorAtual").notNull(),
    incremento: (0, pg_core_1.integer)("incremento").notNull(),
    percentualAnterior: (0, pg_core_1.integer)("percentualAnterior").notNull(),
    percentualAtual: (0, pg_core_1.integer)("percentualAtual").notNull(),
    observacoes: (0, pg_core_1.text)("observacoes"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, function (table) { return ({
    metaIdx: (0, pg_core_1.index)("progressoMetas_meta_idx").on(table.idMeta),
    dataIdx: (0, pg_core_1.index)("progressoMetas_data_idx").on(table.dataRegistro),
    metaDataIdx: (0, pg_core_1.index)("progressoMetas_meta_data_idx").on(table.idMeta, table.dataRegistro),
}); });
// ===============================
// NOTIFICAÇÕES
// ===============================
exports.notificacoes = (0, pg_core_1.pgTable)("notificacoes", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    tipo: exports.tipoNotificacao.notNull(),
    titulo: (0, pg_core_1.text)("titulo").notNull(),
    mensagem: (0, pg_core_1.text)("mensagem").notNull(),
    dadosExtras: (0, pg_core_1.text)("dadosExtras"), // JSON stringify
    lida: (0, pg_core_1.boolean)("lida").default(false).notNull(),
    dataEnvio: (0, pg_core_1.timestamp)("dataEnvio", { withTimezone: true }).defaultNow().notNull(),
    dataLeitura: (0, pg_core_1.timestamp)("dataLeitura", { withTimezone: true }),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("notificacoes_usuario_idx").on(table.userId),
    tipoIdx: (0, pg_core_1.index)("notificacoes_tipo_idx").on(table.tipo),
    dataEnvioIdx: (0, pg_core_1.index)("notificacoes_dataEnvio_idx").on(table.dataEnvio),
    usuarioLidaIdx: (0, pg_core_1.index)("notificacoes_usuario_lida_idx").on(table.userId, table.lida),
}); });
// ===============================
// PLATAFORMAS
// ===============================
exports.plataformas = (0, pg_core_1.pgTable)("plataformas", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idUsuario: (0, pg_core_1.uuid)("idUsuario").notNull().references(function () { return exports.usuarios.id; }, { onDelete: "cascade" }),
    nome: (0, pg_core_1.text)("nome").notNull(),
    isPadrao: (0, pg_core_1.boolean)("isPadrao").default(false).notNull(),
    ativa: (0, pg_core_1.boolean)("ativa").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)("deletedAt", { withTimezone: true }),
}, function (table) { return ({
    usuarioIdx: (0, pg_core_1.index)("plataformas_usuario_idx").on(table.idUsuario),
    nomeUnicoIdx: (0, pg_core_1.uniqueIndex)("plataformas_nome_unico_idx").on(table.idUsuario, table.nome),
}); });
exports.jornadasFaturamentoPorPlataforma = (0, pg_core_1.pgTable)("jornadasFaturamentoPorPlataforma", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    idJornada: (0, pg_core_1.uuid)("idJornada").notNull().references(function () { return exports.jornadas.id; }, { onDelete: "cascade" }),
    idPlataforma: (0, pg_core_1.uuid)("idPlataforma").notNull().references(function () { return exports.plataformas.id; }, { onDelete: "cascade" }),
    valor: (0, pg_core_1.integer)("valor").notNull(), // Em centavos
    valorAntesCorte: (0, pg_core_1.integer)("valorAntesCorte"),
    valorDepoisCorte: (0, pg_core_1.integer)("valorDepoisCorte"),
    createdAt: (0, pg_core_1.timestamp)("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, function (table) { return ({
    jornadaPlataformaIdx: (0, pg_core_1.uniqueIndex)("jornadasFaturamento_jornada_plataforma_idx").on(table.idJornada, table.idPlataforma),
    jornadaIdx: (0, pg_core_1.index)("jornadasFaturamento_jornada_idx").on(table.idJornada),
    plataformaIdx: (0, pg_core_1.index)("jornadasFaturamento_plataforma_idx").on(table.idPlataforma),
}); });
// ===============================
// RELATIONS
// ===============================
exports.notificacoesRelations = (0, drizzle_orm_1.relations)(exports.notificacoes, function (_a) {
    var one = _a.one;
    return ({
        usuario: one(exports.usuarios, { fields: [exports.notificacoes.userId], references: [exports.usuarios.id] }),
    });
});
exports.plataformasRelations = (0, drizzle_orm_1.relations)(exports.plataformas, function (_a) {
    var one = _a.one;
    return ({
        usuario: one(exports.usuarios, { fields: [exports.plataformas.idUsuario], references: [exports.usuarios.id] }),
    });
});
exports.jornadasFaturamentoPorPlataformaRelations = (0, drizzle_orm_1.relations)(exports.jornadasFaturamentoPorPlataforma, function (_a) {
    var one = _a.one;
    return ({
        jornada: one(exports.jornadas, { fields: [exports.jornadasFaturamentoPorPlataforma.idJornada], references: [exports.jornadas.id] }),
        plataforma: one(exports.plataformas, { fields: [exports.jornadasFaturamentoPorPlataforma.idPlataforma], references: [exports.plataformas.id] }),
    });
});
