# Fórmulas de Métricas Financeiras do GiroPro

Este documento detalha as fórmulas utilizadas para calcular as métricas financeiras apresentadas nos relatórios e dashboards do GiroPro. A compreensão dessas fórmulas é essencial para interpretar corretamente os dados e para o desenvolvimento de novas funcionalidades que dependam desses cálculos.

## 1. Dashboard de Lucratividade (Visão Geral)

As seguintes métricas são apresentadas no dashboard de visão geral, fornecendo um panorama rápido da saúde financeira do motorista em um período selecionado.

*   **Faturamento Bruto (FB):** Representa a soma dos ganhos brutos de todas as jornadas finalizadas dentro do período de análise.
    `FB = SUM(jornadas.ganhoBruto) para jornadas.dataFim dentro do período.`

*   **Total de Despesas (TD):** Corresponde à soma dos valores totais dos abastecimentos (`abastecimentos.valorTotal` - custo total do abastecimento, incluindo o valor do combustível) e dos valores das despesas diversas (`despesas.valorDespesa`) registradas no período.
    `TD = SUM(abastecimentos.valorTotal) + SUM(despesas.valorDespesa) para abastecimentos.dataAbastecimento e despesas.dataDespesa dentro do período.`

*   **Lucro Líquido (LL):** É o resultado da subtração do Total de Despesas do Faturamento Bruto, indicando o lucro real obtido após cobrir os custos.
    `LL = FB - TD`

*   **KM Total Rodado (KMT):** Soma da quilometragem total de todas as jornadas concluídas no período.
    `KMT = SUM(jornadas.kmTotal) para jornadas.dataFim dentro do período.`

*   **Jornadas (Contagem):** Número total de jornadas concluídas no período.
    `Jornadas = COUNT(jornadas.id) para jornadas.dataFim dentro do período.`

*   **Custo Abrangente por KM Rodado (CKM_Abrangente):** Calcula o custo médio por quilômetro percorrido, considerando todas as despesas (abastecimentos e outras despesas). É uma métrica chave para avaliar a eficiência dos gastos totais.
    `CKM_Abrangente = TD / KMT (se KMT > 0)`

*   **Custo de Combustível por KM Rodado (CKM_Combustivel):** Calcula o custo médio por quilômetro percorrido, considerando apenas os gastos com combustível.
    `CKM_Combustivel = SUM(abastecimentos.valorTotal) / KMT (se KMT > 0)`

*   **Ganho Bruto Médio por Jornada (GBMJ):** Representa o ganho bruto médio por cada jornada finalizada no período.
    `GBMJ = FB / COUNT(jornadas.id) para jornadas.dataFim dentro do período (se COUNT(jornadas.id) > 0)`

*   **Lucro Líquido Médio por Jornada (LLMJ):** Representa o lucro líquido médio por cada jornada finalizada no período.
    `LLMJ = LL / COUNT(jornadas.id) para jornadas.dataFim dentro do período (se COUNT(jornadas.id) > 0)`

*   **Faturamento por Plataforma:** O faturamento por plataforma é registrado manualmente pelo motorista ao finalizar cada jornada. Os valores são somados para apresentar o total por plataforma no período selecionado. Este detalhe é armazenado na tabela `jornadasFaturamentoPorPlataforma` e agregado para exibição no dashboard.

## 2. Relatório Detalhado de Ganhos por Jornada

Este relatório oferece uma análise mais granular do desempenho financeiro de cada jornada individualmente.

*   **Data e Hora de Início/Fim:** `jornadas.dataInicio`, `jornadas.dataFim` - Registram o período de duração da jornada.

*   **KM Inicial e Final:** `jornadas.kmInicial`, `jornadas.kmFim` - Quilometragem do veículo no início e no fim da jornada.

*   **KM Total Rodado (KMT_Jornada):** A distância total percorrida em uma jornada específica.
    `KMT_Jornada = jornadas.kmTotal (calculado como kmFim - kmInicial)`

*   **Tempo Total da Jornada (TT_Jornada):** A duração total da jornada em minutos.
    `TT_Jornada = jornadas.tempoTotal (calculado como dataFim - dataInicio em minutos)`

*   **Ganho Bruto da Jornada (GB_Jornada):** O valor total recebido por uma jornada antes da dedução de custos. Este valor é a soma dos faturamentos registrados para cada plataforma na tabela `jornadasFaturamentoPorPlataforma`.
    `GB_Jornada = SUM(jornadasFaturamentoPorPlataforma.valor) para a jornada específica.`

*   **Custo Estimado de Combustível por Jornada (CEC_Jornada):** Uma estimativa do custo de combustível para uma jornada, que pode ser calculada de duas formas:
    1.  **Com Valor do Litro Informado na Jornada:** Se o motorista informar o `valorLitroCombustivelJornada` ao finalizar a jornada:
        `CEC_Jornada = (KMT_Jornada / veiculos.mediaConsumoCadastrada) * jornadas.valorLitroCombustivelJornada`
        *   `veiculos.mediaConsumoCadastrada`: Média de consumo (KM/L) cadastrada pelo usuário para o veículo.
        *   `jornadas.valorLitroCombustivelJornada`: Valor do litro de combustível informado pelo motorista ao finalizar a jornada.
    2.  **Com Média Real de Abastecimentos:** Se o `valorLitroCombustivelJornada` não for informado, o sistema utilizará a média real de consumo e preço do litro calculada a partir dos abastecimentos registrados para o veículo.
        `CEC_Jornada = (KMT_Jornada / veiculos.mediaConsumoReal) * veiculos.precoLitroMedioReal`
        *   `veiculos.mediaConsumoReal`: Média de consumo (KM/L) calculada dinamicamente a partir dos abastecimentos do veículo.
        *   `veiculos.precoLitroMedioReal`: Preço médio do litro de combustível calculado dinamicamente a partir dos abastecimentos do veículo.

*   **Lucro Líquido Estimado por Jornada (LLE_Jornada):** O lucro estimado de uma jornada após a dedução do custo estimado de combustível. As outras despesas não são consideradas neste cálculo para simplificação inicial.
    `LLE_Jornada = GB_Jornada - CEC_Jornada`

## 3. Relatório de Análise de Despesas

Este relatório ajuda o motorista a entender seus gastos, identificando onde o dinheiro está sendo gasto e potenciais áreas para economia.

*   **Total Gasto por Categoria de Despesa (TGC):** Soma dos valores das despesas agrupadas por categoria em um determinado período.
    `TGC(categoria) = SUM(despesas.valorDespesa) para despesas.dataDespesa dentro do período e despesas.tipoDespesa = categoria.`

*   **Total Gasto por Veículo (TGV):** Soma dos valores das despesas associadas a um veículo específico no período.
    `TGV(veiculo_id) = SUM(despesas.valorDespesa) para despesas.dataDespesa dentro do período e despesas.idVeiculo = veiculo_id.`

*   **Evolução das Despesas:** Apresenta a soma das despesas por períodos menores (diário, semanal, mensal) para análise de tendência e identificação de picos de gastos.
    `Evolucao_Despesas(periodo) = SUM(despesas.valorDespesa) agrupado por periodo.`

## 4. Relatório de Consumo de Combustível

Focado especificamente nos gastos e eficiência relacionados ao combustível, que geralmente representa uma das maiores despesas para motoristas.

*   **Total Gasto com Combustível (TGC):** Soma dos valores totais de todos os abastecimentos registrados no período.
    `TGC = SUM(abastecimentos.valorTotal) para abastecimentos.dataAbastecimento dentro do período.`

*   **Média de Consumo (KM/Litro) por Veículo (MCV):** Calcula a eficiência do consumo de combustível de um veículo, dividindo a quilometragem total rodada pelo total de litros abastecidos. Esta é a `veiculos.mediaConsumoReal`.
    `MCV(veiculo_id) = SUM(jornadas.kmTotal WHERE jornadas.idVeiculo = veiculo_id) / SUM(abastecimentos.quantidadeLitros WHERE abastecimentos.idVeiculo = veiculo_id) para o período.`

*   **Preço Médio do Litro Pago (PMLP):** O preço médio que o motorista pagou por litro de combustível no período. Esta é a `veiculos.precoLitroMedioReal`.
    `PMLP = SUM(abastecimentos.valorTotal) / SUM(abastecimentos.quantidadeLitros) para o período.`

*   **Total de Litros Abastecidos (TLA):** A soma da quantidade de litros de todos os abastecimentos no período.
    `TLA = SUM(abastecimentos.quantidadeLitros) para abastecimentos.dataAbastecimento dentro do período.`

## 5. Fontes de Dados

Os relatórios e dashboards são construídos a partir dos dados persistidos no banco de dados do GiroPro, utilizando as seguintes tabelas como fontes primárias:

*   **`jornadas`**: Contém informações sobre as viagens realizadas, incluindo ganhos brutos, quilometragem rodada, tempo de jornada e o `valorLitroCombustivelJornada` (se informado).
*   **`jornadasFaturamentoPorPlataforma`**: Detalha o faturamento de cada jornada por plataforma.
*   **`abastecimentos`**: Registra todos os detalhes dos abastecimentos, como gastos com combustível, quantidade de litros e quilometragem atual do veículo.
*   **`despesas`**: Armazena informações sobre outras despesas do veículo e suas respectivas categorias.
*   **`veiculos`**: Fornece dados cadastrais dos veículos, incluindo `mediaConsumoCadastrada`, `mediaConsumoReal` e `precoLitroMedioReal`.
*   **`plataformas`**: Contém as plataformas configuradas pelo usuário, sejam elas predefinidas ou customizadas.
*   **`usuarios`**: Utilizada para associar todos os dados ao motorista correto e garantir a segregação das informações por usuário.

---

**Última atualização**: 01/10/2025
**Versão**: 1.5

