# Documentação do Banco de Dados

Este documento descreve o esquema do banco de dados do GiroPro, incluindo tabelas, colunas, tipos de dados, relacionamentos e índices. O GiroPro utiliza SQLite para desenvolvimento e testes, e PostgreSQL para ambientes de produção, ambos gerenciados pelo Drizzle ORM.

## 1. Visão Geral do Esquema

O esquema do banco de dados é definido em `backend/src/db/schema.ts` e é composto pelas seguintes tabelas principais:

- `usuarios`: Armazena informações dos usuários.
- `veiculos`: Armazena detalhes dos veículos associados aos usuários.
- `jornadas`: Registra as viagens realizadas pelos motoristas.
- `abastecimentos`: Detalha os registros de abastecimento dos veículos.
- `despesas`: Armazena as despesas gerais dos veículos ou usuários.
- `historicoPrecoCombustivel`: Mantém um histórico dos preços de combustível.
- `logsAtividades`: Registra as atividades dos usuários e do sistema.
- `metas`: Gerencia as metas financeiras e de desempenho dos usuários.
- `progressoMetas`: Acompanha o progresso das metas.
- `notificacoes`: Armazena as notificações enviadas aos usuários.

## 2. Diagrama de Entidade-Relacionamento (ERD)

Um Diagrama de Entidade-Relacionamento (ERD) visualiza a estrutura do banco de dados e os relacionamentos entre as tabelas. Embora não seja gerado automaticamente neste documento, você pode utilizar ferramentas externas para visualizar o ERD a partir do seu esquema Drizzle ORM ou do arquivo SQLite (`giropro.db`).

**Ferramentas Sugeridas para Geração de ERD:**

- **Drizzle Studio**: `npm run db:studio` (para visualização interativa do banco de dados).
- **dbdiagram.io**: Uma ferramenta online que permite desenhar diagramas de banco de dados usando uma linguagem DSL simples. Você pode exportar seu esquema Drizzle para um formato compatível com DBML.
- **Luna Modeler**: Uma ferramenta desktop para design de banco de dados que suporta SQLite e pode gerar ERDs.
- **Atlas**: Ferramenta para gerenciar e visualizar esquemas de banco de dados, incluindo Drizzle ORM.

## 3. Detalhes das Tabelas

### 3.1. Tabela `usuarios`

Armazena os dados dos usuários do sistema.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do usuário | Chave Primária, UUID | 
| `nome` | `TEXT` | Nome completo do usuário | Não Nulo, Max 100 caracteres |
| `email` | `TEXT` | Endereço de e-mail do usuário | Não Nulo, Único, Max 255 caracteres |
| `senhaHash` | `TEXT` | Hash da senha do usuário | Não Nulo, Max 255 caracteres |
| `statusConta` | `TEXT` | Status da conta (ativo, inativo, suspenso) | Não Nulo, Padrão: "ativo" |
| `dataCadastro` | `INTEGER` | Timestamp de criação da conta | Não Nulo, Padrão: `unixepoch()` |
| `pontosTotal` | `INTEGER` | Pontuação total de gamificação | Não Nulo, Padrão: 0 |
| `nivelUsuario` | `TEXT` | Nível de gamificação do usuário | Não Nulo, Padrão: "iniciante" |
| `conquistasDesbloqueadas` | `INTEGER` | Número de conquistas desbloqueadas | Não Nulo, Padrão: 0 |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo (para contas ativas) |
| `tentativasLogin` | `INTEGER` | Número de tentativas de login falhas | Não Nulo, Padrão: 0 |
| `ultimoLoginFalhado` | `INTEGER` | Timestamp do último login falho | Nulo |
| `ultimaAtividade` | `INTEGER` | Timestamp da última atividade do usuário | Não Nulo, Padrão: `unixepoch()` |

**Índices:**
- `emailIdx`: Índice único em `email`.
- `statusIdx`: Índice em `statusConta`.
- `pontosIdx`: Índice em `pontosTotal`.
- `nivelIdx`: Índice em `nivelUsuario`.

### 3.2. Tabela `veiculos`

Armazena os dados dos veículos dos usuários.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do veículo | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário proprietário do veículo | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `marca` | `TEXT` | Marca do veículo | Não Nulo, Max 50 caracteres |
| `modelo` | `TEXT` | Modelo do veículo | Não Nulo, Max 100 caracteres |
| `ano` | `INTEGER` | Ano de fabricação do veículo | Não Nulo |
| `placa` | `TEXT` | Placa do veículo | Não Nulo, Único, Max 8 caracteres |
| `tipoCombustivel` | `TEXT` | Tipo de combustível (gasolina, etanol, diesel, gnv, flex) | Não Nulo |
| `tipoUso` | `TEXT` | Tipo de uso (proprio, alugado, financiado) | Não Nulo |
| `valorAluguel` | `INTEGER` | Valor do aluguel (em centavos) | Nulo (se `tipoUso` não for "alugado") |
| `valorPrestacao` | `INTEGER` | Valor da prestação (em centavos) | Nulo (se `tipoUso` não for "financiado") |
| `mediaConsumo` | `REAL` | Média de consumo (km/l) | Nulo |
| `dataCadastro` | `INTEGER` | Timestamp de cadastro do veículo | Não Nulo, Padrão: `unixepoch()` |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `placaIdx`: Índice único em `placa`.
- `anoIdx`: Índice em `ano`.
- `combustivelIdx`: Índice em `tipoCombustivel`.
- `usuarioAtivoIdx`: Índice em `idUsuario` e `deletedAt`.

### 3.3. Tabela `jornadas`

Registra as viagens realizadas pelos motoristas.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único da jornada | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário que realizou a jornada | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `idVeiculo` | `TEXT` | ID do veículo utilizado na jornada | Não Nulo, Chave Estrangeira para `veiculos.id` (ON DELETE CASCADE) |
| `dataInicio` | `INTEGER` | Timestamp de início da jornada | Não Nulo |
| `kmInicio` | `INTEGER` | Quilometragem no início da jornada | Não Nulo |
| `dataFim` | `INTEGER` | Timestamp de fim da jornada | Nulo |
| `kmFim` | `INTEGER` | Quilometragem no fim da jornada | Nulo |
| `ganhoBruto` | `INTEGER` | Ganho bruto da jornada (em centavos) | Nulo |
| `kmTotal` | `INTEGER` | Quilometragem total percorrida | Nulo |
| `tempoTotal` | `INTEGER` | Tempo total da jornada (em minutos) | Nulo |
| `observacoes` | `TEXT` | Observações sobre a jornada | Max 500 caracteres |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `veiculoIdx`: Índice em `idVeiculo`.
- `dataInicioIdx`: Índice em `dataInicio`.
- `periodoIdx`: Índice em `dataInicio` e `dataFim`.
- `usuarioDataIdx`: Índice em `idUsuario` e `dataInicio`.
- `statusIdx`: Índice em `dataFim` (para identificar jornadas em andamento).

### 3.4. Tabela `abastecimentos`

Registra os abastecimentos dos veículos.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do abastecimento | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário que registrou o abastecimento | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `idVeiculo` | `TEXT` | ID do veículo abastecido | Não Nulo, Chave Estrangeira para `veiculos.id` (ON DELETE CASCADE) |
| `dataAbastecimento` | `INTEGER` | Timestamp do abastecimento | Não Nulo |
| `tipoCombustivel` | `TEXT` | Tipo de combustível abastecido | Não Nulo |
| `quantidadeLitros` | `REAL` | Quantidade de litros abastecidos | Não Nulo |
| `valorLitro` | `INTEGER` | Valor por litro (em centavos) | Não Nulo |
| `valorTotal` | `INTEGER` | Valor total do abastecimento (em centavos) | Não Nulo |
| `kmAtual` | `INTEGER` | Quilometragem atual do veículo no abastecimento | Nulo |
| `nomePosto` | `TEXT` | Nome do posto de combustível | Max 100 caracteres |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `veiculoIdx`: Índice em `idVeiculo`.
- `dataIdx`: Índice em `dataAbastecimento`.
- `veiculoDataIdx`: Índice em `idVeiculo` e `dataAbastecimento`.
- `combustivelIdx`: Índice em `tipoCombustivel`.

### 3.5. Tabela `despesas`

Armazena as despesas gerais dos veículos ou usuários.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único da despesa | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário que registrou a despesa | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `idVeiculo` | `TEXT` | ID do veículo associado à despesa | Nulo, Chave Estrangeira para `veiculos.id` (ON DELETE CASCADE) |
| `dataDespesa` | `INTEGER` | Timestamp da despesa | Não Nulo |
| `tipoDespesa` | `TEXT` | Tipo de despesa (manutencao, pneus, seguro, outros) | Não Nulo |
| `valorDespesa` | `INTEGER` | Valor da despesa (em centavos) | Não Nulo |
| `descricao` | `TEXT` | Descrição detalhada da despesa | Max 300 caracteres |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `veiculoIdx`: Índice em `idVeiculo`.
- `dataIdx`: Índice em `dataDespesa`.
- `tipoIdx`: Índice em `tipoDespesa`.
- `usuarioDataIdx`: Índice em `idUsuario` e `dataDespesa`.

### 3.6. Tabela `historicoPrecoCombustivel`

Mantém um histórico dos preços de combustível por localidade.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do registro | Chave Primária, UUID |
| `cidade` | `TEXT` | Cidade do registro de preço | Não Nulo, Max 100 caracteres |
| `estado` | `TEXT` | Sigla do estado do registro de preço | Não Nulo, Max 2 caracteres |
| `tipoCombustivel` | `TEXT` | Tipo de combustível | Não Nulo |
| `precoMedio` | `INTEGER` | Preço médio do combustível (em centavos) | Não Nulo |
| `dataRegistro` | `INTEGER` | Timestamp do registro de preço | Não Nulo, Padrão: `unixepoch()` |
| `fonte` | `TEXT` | Fonte dos dados do preço | Max 100 caracteres |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `localIdx`: Índice em `cidade` e `estado`.
- `combustivelIdx`: Índice em `tipoCombustivel`.
- `dataIdx`: Índice em `dataRegistro`.
- `localDataIdx`: Índice em `cidade`, `estado` e `dataRegistro`.

### 3.7. Tabela `logsAtividades`

Registra as atividades dos usuários e do sistema.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do log | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário associado à atividade | Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE SET NULL) |
| `tipoAcao` | `TEXT` | Tipo de ação registrada | Não Nulo, Max 50 caracteres |
| `descricao` | `TEXT` | Descrição da atividade | Max 500 caracteres |
| `metadados` | `TEXT` | Metadados adicionais em formato JSON | Nulo |
| `dataAcao` | `INTEGER` | Timestamp da ação | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `tipoIdx`: Índice em `tipoAcao`.
- `dataIdx`: Índice em `dataAcao`.
- `usuarioDataIdx`: Índice em `idUsuario` e `dataAcao`.

### 3.8. Tabela `metas`

Gerencia as metas financeiras e de desempenho dos usuários.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único da meta | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário proprietário da meta | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `idVeiculo` | `TEXT` | ID do veículo associado à meta | Nulo, Chave Estrangeira para `veiculos.id` (ON DELETE CASCADE) |
| `titulo` | `TEXT` | Título da meta | Não Nulo, Max 100 caracteres |
| `descricao` | `TEXT` | Descrição detalhada da meta | Max 500 caracteres |
| `tipoMeta` | `TEXT` | Tipo de meta (faturamento, quilometragem, jornadas, economia, lucro) | Não Nulo |
| `periodo` | `TEXT` | Período da meta (semanal, mensal, trimestral, anual) | Não Nulo |
| `valorObjetivo` | `INTEGER` | Valor objetivo da meta (em centavos ou unidades) | Não Nulo |
| `dataInicio` | `INTEGER` | Timestamp de início da meta | Não Nulo |
| `dataFim` | `INTEGER` | Timestamp de fim da meta | Não Nulo |
| `status` | `TEXT` | Status da meta (ativa, pausada, concluida, expirada) | Não Nulo, Padrão: "ativa" |
| `valorAtual` | `INTEGER` | Valor atual da meta | Não Nulo, Padrão: 0 |
| `percentualConcluido` | `INTEGER` | Percentual de conclusão da meta (0-100) | Não Nulo, Padrão: 0 |
| `dataConclusao` | `INTEGER` | Timestamp de conclusão da meta | Nulo |
| `notificacaoEnviada` | `INTEGER` | Indica se a notificação de conclusão foi enviada | Não Nulo, Padrão: `false` |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |
| `updatedAt` | `INTEGER` | Timestamp da última atualização | Não Nulo, Padrão: `unixepoch()` |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `veiculoIdx`: Índice em `idVeiculo`.
- `statusIdx`: Índice em `status`.
- `tipoIdx`: Índice em `tipoMeta`.
- `periodoIdx`: Índice em `dataInicio` e `dataFim`.
- `usuarioStatusIdx`: Índice em `idUsuario` e `status`.
- `ativasIdx`: Índice em `status` e `dataFim`.

### 3.9. Tabela `progressoMetas`

Acompanha o progresso das metas ao longo do tempo.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único do registro de progresso | Chave Primária, UUID |
| `idMeta` | `TEXT` | ID da meta associada | Não Nulo, Chave Estrangeira para `metas.id` (ON DELETE CASCADE) |
| `dataRegistro` | `INTEGER` | Timestamp do registro de progresso | Não Nulo, Padrão: `unixepoch()` |
| `valorAnterior` | `INTEGER` | Valor da meta antes do incremento | Não Nulo |
| `valorAtual` | `INTEGER` | Valor atual da meta | Não Nulo |
| `incremento` | `INTEGER` | Valor do incremento | Não Nulo |
| `percentualAnterior` | `INTEGER` | Percentual de conclusão anterior | Não Nulo |
| `percentualAtual` | `INTEGER` | Percentual de conclusão atual | Não Nulo |
| `observacoes` | `TEXT` | Observações sobre o progresso | Max 300 caracteres |
| `createdAt` | `INTEGER` | Timestamp de criação do registro | Não Nulo, Padrão: `unixepoch()` |

**Índices:**
- `metaIdx`: Índice em `idMeta`.
- `dataIdx`: Índice em `dataRegistro`.
- `metaDataIdx`: Índice em `idMeta` e `dataRegistro`.

### 3.10. Tabela `notificacoes`

Armazena as notificações enviadas aos usuários.

| Coluna | Tipo de Dado | Descrição | Restrições |
|---|---|---|---|
| `id` | `TEXT` | Identificador único da notificação | Chave Primária, UUID |
| `idUsuario` | `TEXT` | ID do usuário que recebeu a notificação | Não Nulo, Chave Estrangeira para `usuarios.id` (ON DELETE CASCADE) |
| `tipo` | `TEXT` | Tipo de notificação (sistema, alerta, promocao, suporte) | Não Nulo |
| `titulo` | `TEXT` | Título da notificação | Não Nulo, Max 200 caracteres |
| `mensagem` | `TEXT` | Conteúdo da mensagem | Não Nulo, Max 1000 caracteres |
| `dadosExtras` | `TEXT` | Dados extras em formato JSON | Nulo |
| `lida` | `INTEGER` | Indica se a notificação foi lida | Não Nulo, Padrão: `false` |
| `dataEnvio` | `INTEGER` | Timestamp de envio da notificação | Não Nulo, Padrão: `unixepoch()` |
| `dataLeitura` | `INTEGER` | Timestamp de leitura da notificação | Nulo |
| `deletedAt` | `INTEGER` | Timestamp de exclusão lógica | Nulo |

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `tipoIdx`: Índice em `tipo`.
- `dataEnvioIdx`: Índice em `dataEnvio`.
- `usuarioLidaIdx`: Índice em `idUsuario` e `lida`.



