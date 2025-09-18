# Análise de Inconsistências de Schema - Snake_case vs CamelCase

## Resumo da Análise

Após análise do arquivo `backend/src/db/schema.ts`, identifiquei as seguintes inconsistências de nomenclatura entre snake_case e camelCase:

## Colunas com Inconsistências Identificadas

### Tabela: usuarios
- **Inconsistente**: `senhaHash` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataCadastro` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `pontosTotal` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `nivelUsuario` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `conquistasDesbloqueadas` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tentativasLogin` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `ultimoLoginFalhado` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `ultimaAtividade` (camelCase) vs outras colunas em camelCase

### Tabela: veiculos
- **Inconsistente**: `idUsuario` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tipoCombustivel` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tipoUso` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `valorAluguel` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `valorPrestacao` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `mediaConsumo` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataCadastro` (camelCase) vs outras colunas em camelCase

### Tabela: jornadas
- **Inconsistente**: `idUsuario` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `idVeiculo` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataInicio` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `kmInicio` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataFim` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `kmFim` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `ganhoBruto` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `kmTotal` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tempoTotal` (camelCase) vs outras colunas em camelCase

### Tabela: abastecimentos
- **Inconsistente**: `idUsuario` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `idVeiculo` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataAbastecimento` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tipoCombustivel` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `quantidadeLitros` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `valorLitro` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `valorTotal` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `kmAtual` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `nomePosto` (camelCase) vs outras colunas em camelCase

### Tabela: despesas
- **Inconsistente**: `idUsuario` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `idVeiculo` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `dataDespesa` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `tipoDespesa` (camelCase) vs outras colunas em camelCase
- **Inconsistente**: `valorDespesa` (camelCase) vs outras colunas em camelCase

## Observação Importante

Na verdade, após análise mais detalhada, percebi que **TODAS as colunas já estão em camelCase**. Não há inconsistências de snake_case vs camelCase no schema atual. O schema está padronizado e consistente usando camelCase.

## Conclusão

O schema do banco de dados já está corretamente padronizado em camelCase. Não há necessidade de correções de inconsistências de nomenclatura.

