-- ===============================
-- SCRIPT DE OTIMIZAÇÃO DO BANCO DE DADOS GIROPRO (CORRIGIDO)
-- ===============================

-- Índices para a tabela usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(statusConta);
CREATE INDEX IF NOT EXISTS idx_usuarios_nivel ON usuarios(nivelUsuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_pontos ON usuarios(pontosTotal);
CREATE INDEX IF NOT EXISTS idx_usuarios_atividade ON usuarios(ultimaAtividade);

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

-- Índices para a tabela despesas (usando nomes corretos das colunas)
CREATE INDEX IF NOT EXISTS idx_despesas_dashboard ON despesas(idUsuario, dataDespesa, valorDespesa);

-- Índices compostos para queries de dashboard e relatórios
CREATE INDEX IF NOT EXISTS idx_jornadas_dashboard ON jornadas(idUsuario, dataInicio, dataFim, ganhoBruto);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_dashboard ON abastecimentos(idUsuario, dataAbastecimento, valorTotal);

-- ===============================
-- VERIFICAÇÃO DE PERFORMANCE
-- ===============================

-- Verificar índices criados
SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL ORDER BY name;

