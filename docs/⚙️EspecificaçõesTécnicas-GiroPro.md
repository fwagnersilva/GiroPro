# ⚙️ Especificações Técnicas - GiroPro

Este documento detalha as especificações técnicas e fórmulas utilizadas no projeto GiroPro, com foco em relatórios, dashboards e considerações de design e UX.

## 1. Fórmulas de Métricas Financeiras

As seguintes fórmulas são utilizadas para calcular as métricas apresentadas nos relatórios e dashboards do GiroPro:

### 1.1. Dashboard de Lucratividade (Visão Geral)

- **Faturamento Bruto (FB):** Soma dos `ganho_bruto` de todas as jornadas finalizadas no período.
  `FB = SUM(jornadas.ganho_bruto) para jornadas.data_fim dentro do período.`

- **Total de Despesas (TD):** Soma dos `valor_total` dos abastecimentos e `valor_despesa` das despesas no período.
  `TD = SUM(abastecimentos.valor_total_centavos) + SUM(despesas.valor_despesa_centavos) para abastecimentos.data_abastecimento e despesas.data_despesa dentro do período.`

- **Lucro Líquido (LL):** Faturamento Bruto menos o Total de Despesas.
  `LL = FB - TD`

- **KM Total Rodado (KMT):** Soma dos `km_total` de todas as jornadas finalizadas no período.
  `KMT = SUM(jornadas.km_total) para jornadas.data_fim dentro do período.`

- **Custo por KM Rodado (CKM):** Total de Despesas dividido pelo KM Total Rodado.
  `CKM = TD / KMT (se KMT > 0)`

- **Ganho Médio por Jornada (GMJ):** Faturamento Bruto dividido pelo número de jornadas finalizadas no período.
  `GMJ = FB / COUNT(jornadas.id) para jornadas.data_fim dentro do período (se COUNT(jornadas.id) > 0)`

### 1.2. Relatório Detalhado de Ganhos por Jornada

- **Data e Hora de Início/Fim:** `jornadas.data_inicio`, `jornadas.data_fim`.

- **KM Inicial e Final:** `jornadas.km_inicio`, `jornadas.km_fim`.

- **KM Total Rodado (KMT_Jornada):** `jornadas.km_total` (calculado como `km_fim - km_inicio`).

- **Tempo Total da Jornada (TT_Jornada):** `jornadas.tempo_total` (calculado como `data_fim - data_inicio` em minutos).

- **Ganho Bruto da Jornada (GB_Jornada):** `jornadas.ganho_bruto`.

- **Custo Estimado de Combustível por Jornada (CEC_Jornada):** `(KMT_Jornada / veiculos.media_consumo) * abastecimentos.valor_litro_medio_periodo`.
  * `veiculos.media_consumo` é uma média pré-calculada ou estimada.
  * `abastecimentos.preco_litro_medio_periodo` é o preço médio do litro de combustível pago pelo usuário no período da jornada (em centavos).

- **Lucro Líquido Estimado por Jornada (LLE_Jornada):** `GB_Jornada - CEC_Jornada`.

### 1.3. Relatório de Análise de Despesas

- **Total Gasto por Categoria de Despesa (TGC):** Soma dos `valor_despesa` para cada `tipo_despesa` no período.
  `TGC(categoria) = SUM(despesas.valor_despesa) para despesas.data_despesa dentro do período e despesas.tipo_despesa = categoria.`

- **Total Gasto por Veículo (TGV):** Soma dos `valor_despesa` associados a cada `id_veiculo` no período.
  `TGV(veiculo_id) = SUM(despesas.valor_despesa) para despesas.data_despesa dentro do período e despesas.id_veiculo = veiculo_id.`

- **Evolução das Despesas:** Soma das despesas por período (diário, semanal, mensal) para análise de tendência.
  `Evolucao_Despesas(periodo) = SUM(despesas.valor_despesa) agrupado por periodo.`

### 1.4. Relatório de Consumo de Combustível

- **Total Gasto com Combustível (TGC):** Soma dos `valor_total` de todos os abastecimentos no período.
  `TGC = SUM(abastecimentos.valor_total_centavos) para abastecimentos.data_abastecimento dentro do período.`

- **Média de Consumo (KM/Litro) por Veículo (MCV):** KM Total Rodado do Veículo / Total de Litros Abastecidos no Veículo.
  `MCV(veiculo_id) = SUM(jornadas.km_total WHERE jornadas.id_veiculo = veiculo_id) / SUM(abastecimentos.quantidade_litros WHERE abastecimentos.id_veiculo = veiculo_id) para o período.`

- **Preço Médio do Litro Pago (PMLP):** Total Gasto com Combustível / Total de Litros Abastecidos.
  `PMLP = SUM(abastecimentos.valor_total) / SUM(abastecimentos.quantidade_litros) para o período.`

- **Total de Litros Abastecidos (TLA):** Soma dos `quantidade_litros` de todos os abastecimentos no período.
  `TLA = SUM(abastecimentos.quantidade_litros) para abastecimentos.data_abastecimento dentro do período.`

## 2. Considerações de Design e UX

As seguintes diretrizes de design e experiência do usuário são aplicadas no desenvolvimento do GiroPro:

- **Simplicidade e Clareza:** As visualizações devem ser fáceis de entender, mesmo para usuários sem experiência em análise de dados.

- **Filtros Flexíveis:** Permitir que o usuário filtre os dados por período (dia, semana, mês, personalizado), veículo e outras dimensões relevantes.

- **Interatividade:** Possibilidade de clicar em elementos do dashboard para ver detalhes (drill-down) e, especialmente, a capacidade de expandir cards individuais para exibição em tela cheia. Esta funcionalidade permitirá que o motorista (ou um 'influencer' em uma apresentação) enfatize um dado específico, como o 'Lucro Líquido do Dia', mostrando-o de forma proeminente e isolada para maior impacto visual e clareza. Isso é crucial para apresentações rápidas e impactantes, como as que um influencer faria.

- **Performance:** Carregamento rápido das informações para garantir uma boa experiência do usuário.

- **Acessibilidade:** Design que atenda aos padrões de acessibilidade.

## 3. Relatórios e Dashboards Detalhados

### 3.1. Dashboard de Lucratividade (Visão Geral)

Um dashboard conciso que apresente as métricas mais importantes de lucratividade em um período selecionado (diário, semanal, mensal).

**Métricas Chave e Fórmulas:**
- Faturamento Bruto (FB): Soma dos ganho_bruto de todas as jornadas finalizadas no período
- Total de Despesas (TD): Soma dos valor_total dos abastecimentos e valor_despesa das despesas no período
- Lucro Líquido (LL): Faturamento Bruto menos o Total de Despesas
- KM Total Rodado (KMT): Soma dos km_total de todas as jornadas finalizadas no período
- Custo por KM Rodado (CKM): Total de Despesas dividido pelo KM Total Rodado
- Ganho Médio por Jornada (GMJ): Faturamento Bruto dividido pelo número de jornadas finalizadas no período

**Visualizações:**
- Cards de resumo para as métricas chave (LL, FB, TD, CKM, GMJ)
- Gráfico de linha mostrando a evolução do Lucro Líquido ao longo do tempo
- Gráfico de barras comparando Faturamento Bruto vs. Total de Despesas

### 3.2. Relatório Detalhado de Ganhos por Jornada

Um relatório que permita ao motorista analisar o desempenho financeiro de cada jornada individualmente.

**Métricas Chave por Jornada e Fórmulas:**
- Data e Hora de Início/Fim: jornadas.data_inicio, jornadas.data_fim
- KM Inicial e Final: jornadas.km_inicio, jornadas.km_fim
- KM Total Rodado (KMT_Jornada): jornadas.km_total (calculado como km_fim - km_inicio)
- Tempo Total da Jornada (TT_Jornada): jornadas.tempo_total (calculado como data_fim - data_inicio em minutos)
- Ganho Bruto da Jornada (GB_Jornada): jornadas.ganho_bruto
- Custo Estimado de Combustível por Jornada (CEC_Jornada): (KMT_Jornada / veiculos.media_consumo) * abastecimentos.valor_litro_medio_periodo
- Lucro Líquido Estimado por Jornada (LLE_Jornada): GB_Jornada - CEC_Jornada

**Visualizações:**
- Tabela detalhada com filtros por data, veículo e status (finalizada)
- Possibilidade de exportação para CSV/Excel

### 3.3. Relatório de Análise de Despesas

Um relatório que detalhe os gastos do motorista, permitindo identificar onde o dinheiro está sendo gasto e possíveis áreas para economia.

**Métricas Chave e Fórmulas:**
- Total Gasto por Categoria de Despesa (TGC): Soma dos valor_despesa para cada tipo_despesa no período
- Total Gasto por Veículo (TGV): Soma dos valor_despesa associados a cada id_veiculo no período
- Evolução das Despesas: Soma das despesas por período (diário, semanal, mensal) para análise de tendência

**Visualizações:**
- Gráfico de pizza/barras mostrando a distribuição percentual das despesas por categoria
- Tabela detalhada de todas as despesas com filtros por data, categoria e veículo

### 3.4. Relatório de Consumo de Combustível

Focado especificamente nos gastos com combustível, uma das maiores despesas para motoristas.

**Métricas Chave e Fórmulas:**
- Total Gasto com Combustível (TGC): Soma dos valor_total de todos os abastecimentos no período
- Média de Consumo (KM/Litro) por Veículo (MCV): KM Total Rodado do Veículo / Total de Litros Abastecidos no Veículo
- Preço Médio do Litro Pago (PMLP): Total Gasto com Combustível / Total de Litros Abastecidos
- Total de Litros Abastecidos (TLA): Soma dos quantidade_litros de todos os abastecimentos no período

**Visualizações:**
- Gráfico de linha mostrando a evolução do preço médio do litro pago
- Gráfico de barras comparando o consumo médio entre diferentes tipos de combustível ou veículos

## 4. Fontes de Dados

Os relatórios e dashboards serão construídos a partir dos dados já existentes no banco de dados do GiroPro, utilizando as seguintes tabelas:

- **jornadas:** Para ganhos brutos, KM rodado e tempo de jornada
- **abastecimentos:** Para gastos com combustível, quantidade de litros e KM atual
- **despesas:** Para outras despesas e suas categorias
- **veiculos:** Para informações do veículo e cálculo de consumo médio
- **usuarios:** Para associar os dados ao motorista correto

---

**Desenvolvido por Manus AI**

*Última Atualização: 8 de Março de 2025*

