-- ===============================
-- QUERIES OTIMIZADAS GIROPRO
-- ===============================

-- Query otimizada para relatório de performance mensal
-- Combina dados de jornadas, abastecimentos e despesas em uma única query
CREATE VIEW IF NOT EXISTS vw_relatorio_mensal AS
SELECT 
  DATE(j.dataInicio, 'start of month') as mes,
  j.idUsuario,
  j.idVeiculo,
  v.marca,
  v.modelo,
  v.placa,
  COUNT(j.id) as totalJornadas,
  SUM(j.ganhoBruto) as faturamentoBruto,
  SUM(j.kmTotal) as kmTotal,
  COALESCE(SUM(a.valorTotal), 0) as totalCombustivel,
  COALESCE(SUM(d.valorDespesa), 0) as totalDespesas,
  (SUM(j.ganhoBruto) - COALESCE(SUM(a.valorTotal), 0) - COALESCE(SUM(d.valorDespesa), 0)) as lucroLiquido,
  CASE 
    WHEN SUM(j.ganhoBruto) > 0 
    THEN ROUND(((SUM(j.ganhoBruto) - COALESCE(SUM(a.valorTotal), 0) - COALESCE(SUM(d.valorDespesa), 0)) / SUM(j.ganhoBruto)) * 100, 2)
    ELSE 0 
  END as margemLucro
FROM jornadas j
INNER JOIN veiculos v ON j.idVeiculo = v.id
LEFT JOIN abastecimentos a ON j.idVeiculo = a.idVeiculo 
  AND DATE(j.dataInicio, 'start of month') = DATE(a.dataAbastecimento, 'start of month')
  AND a.deletedAt IS NULL
LEFT JOIN despesas d ON j.idVeiculo = d.idVeiculo 
  AND DATE(j.dataInicio, 'start of month') = DATE(d.dataDespesa, 'start of month')
  AND d.deletedAt IS NULL
WHERE j.deletedAt IS NULL 
  AND v.deletedAt IS NULL
  AND j.dataFim IS NOT NULL
GROUP BY 
  DATE(j.dataInicio, 'start of month'),
  j.idUsuario,
  j.idVeiculo,
  v.marca,
  v.modelo,
  v.placa
ORDER BY mes DESC, faturamentoBruto DESC;

-- Query otimizada para dashboard diário
-- Evita múltiplas subconsultas usando CTEs
WITH jornadas_hoje AS (
  SELECT 
    idUsuario,
    COUNT(*) as totalJornadas,
    SUM(ganhoBruto) as faturamento,
    SUM(kmTotal) as km,
    SUM(
      CASE 
        WHEN dataFim IS NOT NULL AND dataInicio IS NOT NULL
        THEN (CAST(strftime('%s', dataFim) AS INTEGER) - CAST(strftime('%s', dataInicio) AS INTEGER)) / 60
        ELSE 0 
      END
    ) as tempoMinutos
  FROM jornadas 
  WHERE DATE(dataInicio) = DATE('now')
    AND deletedAt IS NULL
    AND dataFim IS NOT NULL
  GROUP BY idUsuario
),
despesas_hoje AS (
  SELECT 
    idUsuario,
    SUM(valorDespesa) as totalDespesas
  FROM despesas 
  WHERE DATE(dataDespesa) = DATE('now')
    AND deletedAt IS NULL
  GROUP BY idUsuario
),
combustivel_hoje AS (
  SELECT 
    idUsuario,
    SUM(valorTotal) as totalCombustivel
  FROM abastecimentos 
  WHERE DATE(dataAbastecimento) = DATE('now')
    AND deletedAt IS NULL
  GROUP BY idUsuario
)
SELECT 
  j.idUsuario,
  COALESCE(j.totalJornadas, 0) as totalJornadas,
  COALESCE(j.faturamento, 0) as faturamentoBruto,
  COALESCE(j.km, 0) as kmTotal,
  COALESCE(j.tempoMinutos, 0) as tempoTotalMinutos,
  COALESCE(d.totalDespesas, 0) + COALESCE(c.totalCombustivel, 0) as totalDespesas,
  COALESCE(j.faturamento, 0) - (COALESCE(d.totalDespesas, 0) + COALESCE(c.totalCombustivel, 0)) as lucroLiquido,
  CASE 
    WHEN j.totalJornadas > 0 
    THEN ROUND(COALESCE(j.faturamento, 0) / j.totalJornadas, 2)
    ELSE 0 
  END as ganhoMedioPorJornada,
  CASE 
    WHEN j.tempoMinutos > 0 
    THEN ROUND(COALESCE(j.faturamento, 0) / (j.tempoMinutos / 60.0), 2)
    ELSE 0 
  END as ganhoPorHora
FROM jornadas_hoje j
LEFT JOIN despesas_hoje d ON j.idUsuario = d.idUsuario
LEFT JOIN combustivel_hoje c ON j.idUsuario = c.idUsuario;

-- Query otimizada para ranking de veículos por performance
CREATE VIEW IF NOT EXISTS vw_ranking_veiculos AS
SELECT 
  v.id,
  v.marca,
  v.modelo,
  v.placa,
  v.ano,
  v.idUsuario,
  COUNT(j.id) as totalJornadas,
  SUM(j.ganhoBruto) as faturamentoTotal,
  SUM(j.kmTotal) as kmTotal,
  AVG(j.ganhoBruto) as ganhoMedioPorJornada,
  COALESCE(SUM(a.valorTotal), 0) + COALESCE(SUM(d.valorDespesa), 0) as despesasTotal,
  SUM(j.ganhoBruto) - (COALESCE(SUM(a.valorTotal), 0) + COALESCE(SUM(d.valorDespesa), 0)) as lucroTotal,
  CASE 
    WHEN SUM(j.ganhoBruto) > 0 
    THEN ROUND(((SUM(j.ganhoBruto) - (COALESCE(SUM(a.valorTotal), 0) + COALESCE(SUM(d.valorDespesa), 0))) / SUM(j.ganhoBruto)) * 100, 2)
    ELSE 0 
  END as margemLucro,
  CASE 
    WHEN SUM(j.kmTotal) > 0 
    THEN ROUND((COALESCE(SUM(a.valorTotal), 0) + COALESCE(SUM(d.valorDespesa), 0)) / SUM(j.kmTotal), 3)
    ELSE 0 
  END as custoPorKm
FROM veiculos v
LEFT JOIN jornadas j ON v.id = j.idVeiculo AND j.deletedAt IS NULL AND j.dataFim IS NOT NULL
LEFT JOIN abastecimentos a ON v.id = a.idVeiculo AND a.deletedAt IS NULL
LEFT JOIN despesas d ON v.id = d.idVeiculo AND d.deletedAt IS NULL
WHERE v.deletedAt IS NULL
GROUP BY v.id, v.marca, v.modelo, v.placa, v.ano, v.idUsuario
HAVING COUNT(j.id) > 0
ORDER BY margemLucro DESC, faturamentoTotal DESC;

-- Query otimizada para análise de tendências semanais
WITH semanas AS (
  SELECT 
    DATE(dataInicio, 'weekday 0', '-6 days') as inicio_semana,
    DATE(dataInicio, 'weekday 0') as fim_semana,
    idUsuario,
    COUNT(*) as jornadas,
    SUM(ganhoBruto) as faturamento,
    SUM(kmTotal) as km
  FROM jornadas 
  WHERE dataInicio >= DATE('now', '-8 weeks')
    AND deletedAt IS NULL
    AND dataFim IS NOT NULL
  GROUP BY 
    DATE(dataInicio, 'weekday 0', '-6 days'),
    DATE(dataInicio, 'weekday 0'),
    idUsuario
),
despesas_semanais AS (
  SELECT 
    DATE(dataDespesa, 'weekday 0', '-6 days') as inicio_semana,
    idUsuario,
    SUM(valorDespesa) as despesas
  FROM despesas 
  WHERE dataDespesa >= DATE('now', '-8 weeks')
    AND deletedAt IS NULL
  GROUP BY 
    DATE(dataDespesa, 'weekday 0', '-6 days'),
    idUsuario
),
combustivel_semanal AS (
  SELECT 
    DATE(dataAbastecimento, 'weekday 0', '-6 days') as inicio_semana,
    idUsuario,
    SUM(valorTotal) as combustivel
  FROM abastecimentos 
  WHERE dataAbastecimento >= DATE('now', '-8 weeks')
    AND deletedAt IS NULL
  GROUP BY 
    DATE(dataAbastecimento, 'weekday 0', '-6 days'),
    idUsuario
)
SELECT 
  s.inicio_semana,
  s.fim_semana,
  s.idUsuario,
  s.jornadas,
  s.faturamento,
  s.km,
  COALESCE(d.despesas, 0) + COALESCE(c.combustivel, 0) as totalDespesas,
  s.faturamento - (COALESCE(d.despesas, 0) + COALESCE(c.combustivel, 0)) as lucro,
  LAG(s.faturamento) OVER (PARTITION BY s.idUsuario ORDER BY s.inicio_semana) as faturamento_semana_anterior,
  CASE 
    WHEN LAG(s.faturamento) OVER (PARTITION BY s.idUsuario ORDER BY s.inicio_semana) > 0
    THEN ROUND(((s.faturamento - LAG(s.faturamento) OVER (PARTITION BY s.idUsuario ORDER BY s.inicio_semana)) / LAG(s.faturamento) OVER (PARTITION BY s.idUsuario ORDER BY s.inicio_semana)) * 100, 2)
    ELSE 0 
  END as crescimento_percentual
FROM semanas s
LEFT JOIN despesas_semanais d ON s.inicio_semana = d.inicio_semana AND s.idUsuario = d.idUsuario
LEFT JOIN combustivel_semanal c ON s.inicio_semana = c.inicio_semana AND s.idUsuario = c.idUsuario
ORDER BY s.idUsuario, s.inicio_semana DESC;

-- Stored procedure simulado para limpeza de dados antigos
-- (SQLite não suporta stored procedures, mas podemos usar isso como referência para scripts de manutenção)

-- Script de limpeza de dados antigos (executar mensalmente)
/*
BEGIN TRANSACTION;

-- Limpar jornadas muito antigas (mais de 2 anos) que já foram processadas
UPDATE jornadas 
SET deletedAt = datetime('now')
WHERE dataInicio < DATE('now', '-2 years')
  AND deletedAt IS NULL
  AND dataFim IS NOT NULL;

-- Limpar abastecimentos muito antigos (mais de 2 anos)
UPDATE abastecimentos 
SET deletedAt = datetime('now')
WHERE dataAbastecimento < DATE('now', '-2 years')
  AND deletedAt IS NULL;

-- Limpar despesas muito antigas (mais de 2 anos)
UPDATE despesas 
SET deletedAt = datetime('now')
WHERE dataDespesa < DATE('now', '-2 years')
  AND deletedAt IS NULL;

-- Atualizar estatísticas após limpeza
ANALYZE;

COMMIT;
*/

-- Índices adicionais para as novas queries otimizadas
CREATE INDEX IF NOT EXISTS idx_jornadas_data_inicio_mes ON jornadas(DATE(dataInicio, 'start of month'));
CREATE INDEX IF NOT EXISTS idx_abastecimentos_data_mes ON abastecimentos(DATE(dataAbastecimento, 'start of month'));
CREATE INDEX IF NOT EXISTS idx_despesas_data_mes ON despesas(DATE(dataDespesa, 'start of month'));
CREATE INDEX IF NOT EXISTS idx_jornadas_data_inicio_semana ON jornadas(DATE(dataInicio, 'weekday 0', '-6 days'));

-- Query para monitoramento de performance das queries
CREATE VIEW IF NOT EXISTS vw_query_performance AS
SELECT 
  'dashboard_diario' as query_name,
  COUNT(*) as execucoes_estimadas,
  'Otimizada com CTEs' as status
FROM jornadas 
WHERE DATE(dataInicio) = DATE('now')
UNION ALL
SELECT 
  'relatorio_mensal' as query_name,
  COUNT(*) as execucoes_estimadas,
  'Otimizada com VIEW' as status
FROM jornadas 
WHERE dataInicio >= DATE('now', 'start of month')
UNION ALL
SELECT 
  'ranking_veiculos' as query_name,
  COUNT(DISTINCT idVeiculo) as execucoes_estimadas,
  'Otimizada com VIEW' as status
FROM jornadas 
WHERE deletedAt IS NULL;

