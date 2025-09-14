-- ===============================
-- SCRIPT DE OTIMIZAÇÃO DO BANCO DE DADOS GIROPRO
-- ===============================

-- Índices para a tabela usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(statusConta);
CREATE INDEX IF NOT EXISTS idx_usuarios_nivel ON usuarios(nivelUsuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_pontos ON usuarios(pontosTotal);
CREATE INDEX IF NOT EXISTS idx_usuarios_atividade ON usuarios(ultimaAtividade);

-- Índices para a tabela veiculos
CREATE INDEX IF NOT EXISTS idx_veiculos_usuario ON veiculos(idUsuario);
CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(statusVeiculo);
CREATE INDEX IF NOT EXISTS idx_veiculos_tipo ON veiculos(tipoUso);

-- Índices para a tabela jornadas (queries mais frequentes)
CREATE INDEX IF NOT EXISTS idx_jornadas_usuario ON jornadas(idUsuario);
CREATE INDEX IF NOT EXISTS idx_jornadas_veiculo ON jornadas(idVeiculo);
CREATE INDEX IF NOT EXISTS idx_jornadas_data_inicio ON jornadas(dataInicio);
CREATE INDEX IF NOT EXISTS idx_jornadas_data_fim ON jornadas(dataFim);
CREATE INDEX IF NOT EXISTS idx_jornadas_usuario_data ON jornadas(idUsuario, dataInicio);
CREATE INDEX IF NOT EXISTS idx_jornadas_veiculo_data ON jornadas(idVeiculo, dataInicio);
CREATE INDEX IF NOT EXISTS idx_jornadas_status ON jornadas(dataFim) WHERE dataFim IS NULL; -- Para jornadas em andamento
CREATE INDEX IF NOT EXISTS idx_jornadas_periodo ON jornadas(idUsuario, dataInicio, dataFim);

-- Índices para a tabela abastecimentos
CREATE INDEX IF NOT EXISTS idx_abastecimentos_usuario ON abastecimentos(idUsuario);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_veiculo ON abastecimentos(idVeiculo);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_data ON abastecimentos(dataAbastecimento);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_usuario_data ON abastecimentos(idUsuario, dataAbastecimento);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_veiculo_data ON abastecimentos(idVeiculo, dataAbastecimento);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_combustivel ON abastecimentos(tipoCombustivel);

-- Índices para a tabela despesas
CREATE INDEX IF NOT EXISTS idx_despesas_usuario ON despesas(idUsuario);
CREATE INDEX IF NOT EXISTS idx_despesas_veiculo ON despesas(idVeiculo);
CREATE INDEX IF NOT EXISTS idx_despesas_data ON despesas(dataDespesa);
CREATE INDEX IF NOT EXISTS idx_despesas_tipo ON despesas(tipoDespesa);
CREATE INDEX IF NOT EXISTS idx_despesas_usuario_data ON despesas(idUsuario, dataDespesa);
CREATE INDEX IF NOT EXISTS idx_despesas_veiculo_data ON despesas(idVeiculo, dataDespesa);

-- Índices compostos para queries de dashboard e relatórios
CREATE INDEX IF NOT EXISTS idx_jornadas_dashboard ON jornadas(idUsuario, dataInicio, dataFim, ganhoBruto);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_dashboard ON abastecimentos(idUsuario, dataAbastecimento, valorTotal);
CREATE INDEX IF NOT EXISTS idx_despesas_dashboard ON despesas(idUsuario, dataDespesa, valor);

-- Índices para soft delete (deletedAt)
CREATE INDEX IF NOT EXISTS idx_jornadas_active ON jornadas(deletedAt) WHERE deletedAt IS NULL;
CREATE INDEX IF NOT EXISTS idx_abastecimentos_active ON abastecimentos(deletedAt) WHERE deletedAt IS NULL;
CREATE INDEX IF NOT EXISTS idx_despesas_active ON despesas(deletedAt) WHERE deletedAt IS NULL;
CREATE INDEX IF NOT EXISTS idx_veiculos_active ON veiculos(deletedAt) WHERE deletedAt IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_active ON usuarios(deletedAt) WHERE deletedAt IS NULL;

-- ===============================
-- CONFIGURAÇÕES DE OTIMIZAÇÃO DO SQLITE
-- ===============================

-- Configurar WAL mode para melhor concorrência
PRAGMA journal_mode = WAL;

-- Configurar cache size (em páginas, -2000 = 2MB)
PRAGMA cache_size = -2000;

-- Configurar synchronous para melhor performance (NORMAL é um bom equilíbrio)
PRAGMA synchronous = NORMAL;

-- Configurar temp_store para usar memória
PRAGMA temp_store = MEMORY;

-- Configurar mmap_size para usar memory mapping (64MB)
PRAGMA mmap_size = 67108864;

-- Configurar page_size otimizado
PRAGMA page_size = 4096;

-- Habilitar foreign keys
PRAGMA foreign_keys = ON;

-- ===============================
-- ANÁLISE E ESTATÍSTICAS
-- ===============================

-- Atualizar estatísticas do banco
ANALYZE;

-- Verificar integridade do banco
PRAGMA integrity_check;

-- ===============================
-- VACUUM PARA OTIMIZAR ESPAÇO
-- ===============================

-- Executar VACUUM para reorganizar o banco
VACUUM;

-- ===============================
-- QUERIES DE VERIFICAÇÃO DE PERFORMANCE
-- ===============================

-- Verificar uso dos índices
-- SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL;

-- Verificar planos de execução para queries comuns
-- EXPLAIN QUERY PLAN SELECT * FROM jornadas WHERE idUsuario = ? ORDER BY dataInicio DESC LIMIT 10;
-- EXPLAIN QUERY PLAN SELECT * FROM abastecimentos WHERE idUsuario = ? AND dataAbastecimento >= ? ORDER BY dataAbastecimento DESC;
-- EXPLAIN QUERY PLAN SELECT j.*, v.marca, v.modelo FROM jornadas j JOIN veiculos v ON j.idVeiculo = v.id WHERE j.idUsuario = ?;

