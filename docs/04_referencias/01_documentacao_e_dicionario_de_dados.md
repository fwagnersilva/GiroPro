# Documentação e Dicionário de Dados do GiroPro

Este documento consolida a documentação do esquema do banco de dados e o dicionário de dados detalhado do projeto GiroPro.

## Visão Geral do Esquema

O GiroPro utiliza SQLite para desenvolvimento e testes, e PostgreSQL para ambientes de produção, ambos gerenciados pelo Drizzle ORM. O esquema do banco de dados é definido em `backend/src/db/schema.ts` e é composto pelas seguintes tabelas principais:

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

## Diagrama de Entidade-Relacionamento (ERD)

Um Diagrama de Entidade-Relacionamento (ERD) visualiza a estrutura do banco de dados e os relacionamentos entre as tabelas. Embora não seja gerado automaticamente neste documento, você pode utilizar ferramentas externas para visualizar o ERD a partir do seu esquema Drizzle ORM ou do arquivo SQLite (`giropro.db`).

**Ferramentas Sugeridas para Geração de ERD:**

- **Drizzle Studio**: `npm run db:studio` (para visualização interativa do banco de dados).
- **dbdiagram.io**: Uma ferramenta online que permite desenhar diagramas de banco de dados usando uma linguagem DSL simples. Você pode exportar seu esquema Drizzle para um formato compatível com DBML.
- **Luna Modeler**: Uma ferramenta desktop para design de banco de dados que suporta SQLite e pode gerar ERDs.
- **Atlas**: Ferramenta para gerenciar e visualizar esquemas de banco de dados, incluindo Drizzle ORM.

## Detalhes das Tabelas

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

### Tabela: `historicoPrecoCombustivel`

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

#### Tabela: `logsAtividades`

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
| `periodoMeta` | `TEXT` | Período da meta (semanal, mensal, trimestral, anual) | Não Nulo |
| `valorObjetivo` | `INTEGER` | Valor objetivo da meta (em centavos ou unidades) | Não Nulo |
| `dataInicio` | `INTEGER` | Timestamp de início da meta | Não Nulo |
| `dataFim` | `INTEGER` | Timestamp de fim da meta | Não Nulo |
| `statusMeta` | `TEXT` | Status atual da meta (ativa, concluída, etc.). | `NOT NULL`, `DEFAULT 'ativa'` |
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
- `periodoIdx`: Índice em- `statusIdx`: Índice em `statusMeta`.
- `usuarioStatusIdx`: Índice em `idUsuario` e `statusMeta`.
- `ativasIdx`: Índice em `statusMeta` e `dataFim### Tabela: `progressoMetas`
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





## Migrações e Padrões de Acesso a Dados

### Migrações

As migrações do banco de dados são gerenciadas pelo Drizzle ORM. Elas permitem que o esquema do banco de dados seja versionado e atualizado de forma controlada. Os arquivos de migração SQL são gerados automaticamente pelo Drizzle e aplicados ao banco de dados para refletir as mudanças no esquema. Isso garante que o banco de dados esteja sempre sincronizado com o modelo de dados da aplicação.

**Comandos de Migração:**

- `npm run db:generate`: Gera um novo arquivo de migração baseado nas alterações detectadas no `schema.ts`.
- `npm run db:migrate`: Aplica as migrações pendentes ao banco de dados. É crucial executar este comando após qualquer alteração no esquema.
- `npm run db:check`: Verifica a consistência do esquema do banco de dados com as migrações aplicadas.

### Padrões de Acesso a Dados

O acesso aos dados é realizado através do Drizzle ORM, que fornece uma interface TypeScript-first para interagir com o banco de dados. Isso garante segurança de tipo e facilita a construção de queries complexas.

**Exemplos de Operações Comuns:**

```typescript
import { db } from "../db";
import { usuarios, veiculos } from "../db/schema";
import { eq, and, like } from "drizzle-orm";

// Inserir um novo usuário
export async function criarUsuario(novoUsuario: typeof usuarios.$inferInsert) {
  return db.insert(usuarios).values(novoUsuario).returning();
}

// Buscar usuário por email
export async function buscarUsuarioPorEmail(email: string) {
  return db.select().from(usuarios).where(eq(usuarios.email, email)).get();
}

// Atualizar status de um veículo
export async function atualizarStatusVeiculo(idVeiculo: string, novoStatus: string) {
  return db.update(veiculos).set({ status: novoStatus }).where(eq(veiculos.id, idVeiculo)).returning();
}

// Buscar jornadas de um usuário em um período
export async function buscarJornadasPorPeriodo(idUsuario: string, dataInicio: number, dataFim: number) {
  return db.select()
    .from(jornadas)
    .where(and(eq(jornadas.idUsuario, idUsuario), gte(jornadas.dataInicio, dataInicio), lte(jornadas.dataFim, dataFim)))
    .orderBy(jornadas.dataInicio)
    .all();
}
```

**Boas Práticas de Acesso a Dados:**

- **Camada de Serviço/Repositório**: Encapsular a lógica de acesso a dados em uma camada separada para manter o código limpo e modular.
- **Transações**: Utilizar transações para operações que envolvem múltiplas escritas no banco de dados, garantindo atomicidade.
- **Tratamento de Erros**: Implementar tratamento robusto de erros para falhas de banco de dados.
- **Segurança**: Evitar SQL Injection utilizando ORMs e queries parametrizadas.

## 1. 🌐 ENUMS Tipados e Otimizados

Para garantir a consistência e a integridade dos dados, o projeto utiliza enums tipados para campos com valores predefinidos. Estes enums são definidos diretamente no `schema.ts` e são usados em várias tabelas:

*   `statusContaEnum`: Define os possíveis status de uma conta de usuário (`ativo`, `inativo`, `suspenso`).
*   `tipoCombustivelEnum`: Define os tipos de combustível (`gasolina`, `etanol`, `diesel`, `gnv`, `flex`).
*   `tipoUsoEnum`: Define o tipo de uso de um veículo (`proprio`, `alugado`, `financiado`).
*   `tipoDespesaEnum`: Define as categorias de despesas (`manutencao`, `pneus`, `seguro`, `outros`).
*   `tipoMetaEnum`: Define os tipos de metas (`faturamento`, `quilometragem`, `jornadas`, `economia`, `lucro`).
*   `periodoMetaEnum`: Define os períodos das metas (`semanal`, `mensal`, `trimestral`, `anual`).
*   `statusMetaEnum`: Define os status das metas (`ativa`, `pausada`, `concluida`, `expirada`).
*   `tipoConquistaEnum`: Define os tipos de conquistas para gamificação (`faturamento`, `quilometragem`, `jornadas`, `eficiencia`, `consistencia`, `metas`, `especial`).
*   `raridadeEnum`: Define a raridade das conquistas (`comum`, `raro`, `epico`, `lendario`).
*   `nivelUsuarioEnum`: Define os níveis de usuário para gamificação (`iniciante`, `novato`, `experiente`, `motorista`, `profissional`, `especialista`, `mestre`, `lenda`).
*   `tipoNotificacaoEnum`: Define os tipos de notificação (`sistema`, `alerta`, `promocao`, `suporte`).

## 2. 👤 `usuarios`

Representa os usuários do aplicativo (motoristas), incluindo informações de autenticação, gamificação e auditoria.

```typescript
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  senhaHash: text("senhaHash", { length: 255 }).notNull(),
  statusConta: statusContaEnum.default("ativo").notNull(),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  pontosTotal: integer("pontosTotal").default(0).notNull(),
  nivelUsuario: nivelUsuarioEnum.default("iniciante").notNull(),
  conquistasDesbloqueadas: integer("conquistasDesbloqueadas").default(0).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
  tentativasLogin: integer("tentativasLogin").default(0).notNull(),
  ultimoLoginFalhado: integer("ultimoLoginFalhado", { mode: "timestamp" }),
  ultimaAtividade: integer("ultimaAtividade", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente com `crypto.randomUUID()` para garantir unicidade global.
*   `nome`: Nome completo do usuário, com limite de 100 caracteres.
*   `email`: Endereço de e-mail do usuário, único e com limite de 255 caracteres. Usado para login.
*   `senhaHash`: Hash da senha do usuário, armazenado de forma segura.
*   `statusConta`: Status atual da conta do usuário, utilizando `statusContaEnum` (`ativo`, `inativo`, `suspenso`). Padrão é `ativo`.
*   `dataCadastro`: Timestamp da criação da conta, em formato Unix epoch.
*   `pontosTotal`: Pontuação total do usuário no sistema de gamificação. Padrão é 0.
*   `nivelUsuario`: Nível atual do usuário, utilizando `nivelUsuarioEnum`. Padrão é `iniciante`.
*   `conquistasDesbloqueadas`: Número de conquistas desbloqueadas pelo usuário. Padrão é 0.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro, permitindo recuperação e histórico.
*   `tentativasLogin`: Contador de tentativas de login falhas. Padrão é 0.
*   `ultimoLoginFalhado`: Timestamp da última tentativa de login falha.
*   `ultimaAtividade`: Timestamp da última atividade do usuário no sistema, em formato Unix epoch.

## 3. 🚗 `veiculos`

Representa os veículos utilizados pelos motoristas, associados a um usuário.

```typescript
export const veiculos = sqliteTable("veiculos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  marca: text("marca", { length: 50 }).notNull(),
  modelo: text("modelo", { length: 100 }).notNull(),
  ano: integer("ano").notNull(),
  placa: text("placa", { length: 8 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  tipoUso: tipoUsoEnum.notNull(),
  valorAluguel: integer("valorAluguel"),
  valorPrestacao: integer("valorPrestacao"),
  mediaConsumo: real("mediaConsumo"),
  dataCadastro: integer("dataCadastro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `marca`: Marca do veículo, com limite de 50 caracteres.
*   `modelo`: Modelo do veículo, com limite de 100 caracteres.
*   `ano`: Ano de fabricação do veículo.
*   `placa`: Placa do veículo, única e com limite de 8 caracteres.
*   `tipoCombustivel`: Tipo de combustível do veículo, utilizando `tipoCombustivelEnum`.
*   `tipoUso`: Tipo de uso do veículo, utilizando `tipoUsoEnum`.
*   `valorAluguel`: Valor do aluguel (em centavos), aplicável se `tipoUso` for `alugado`.
*   `valorPrestacao`: Valor da prestação (em centavos), aplicável se `tipoUso` for `financiado`.
*   `mediaConsumo`: Média de consumo do veículo (km/l), armazenado como `REAL` para precisão.
*   `dataCadastro`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 4. 🗺️ `jornadas`

Registra as jornadas de trabalho realizadas pelos motoristas.

```typescript
export const jornadas = sqliteTable("jornadas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  kmInicio: integer("kmInicio").notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }),
  kmFim: integer("kmFim"),
  ganhoBruto: integer("ganhoBruto"),
  kmTotal: integer("kmTotal"),
  tempoTotal: integer("tempoTotal"),
  observacoes: text("observacoes", { length: 500 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataInicio`: Timestamp do início da jornada, em formato Unix epoch.
*   `kmInicio`: Quilometragem do veículo no início da jornada.
*   `dataFim`: Timestamp do fim da jornada, em formato Unix epoch (nulo se a jornada estiver em andamento).
*   `kmFim`: Quilometragem do veículo no fim da jornada (nulo se a jornada estiver em andamento).
*   `ganhoBruto`: Ganho bruto da jornada (em centavos).
*   `kmTotal`: Quilometragem total percorrida na jornada (calculado: `kmFim - kmInicio`).
*   `tempoTotal`: Tempo total da jornada (em minutos).
*   `observacoes`: Observações adicionais sobre a jornada, com limite de 500 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 5. ⛽ `abastecimentos`

Registra os abastecimentos de combustível realizados para os veículos.

```typescript
export const abastecimentos = sqliteTable("abastecimentos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").notNull().references(() => veiculos.id, { onDelete: "cascade" }),
  dataAbastecimento: integer("dataAbastecimento", { mode: "timestamp" }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  quantidadeLitros: real("quantidadeLitros").notNull(),
  valorLitro: integer("valorLitro").notNull(),
  valorTotal: integer("valorTotal").notNull(),
  kmAtual: integer("kmAtual"),
  nomePosto: text("nomePosto", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira para a tabela `veiculos`, com exclusão em cascata.
*   `dataAbastecimento`: Timestamp do abastecimento, em formato Unix epoch.
*   `tipoCombustivel`: Tipo de combustível abastecido, utilizando `tipoCombustivelEnum`.
*   `quantidadeLitros`: Quantidade de litros abastecidos, armazenado como `REAL` para precisão.
*   `valorLitro`: Valor por litro (em centavos).
*   `valorTotal`: Valor total do abastecimento (em centavos).
*   `kmAtual`: Quilometragem do veículo no momento do abastecimento.
*   `nomePosto`: Nome do posto de combustível, com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 6. 💸 `despesas`

Registra as despesas diversas relacionadas ou não a veículos.

```typescript
export const despesas = sqliteTable("despesas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  dataDespesa: integer("dataDespesa", { mode: "timestamp" }).notNull(),
  tipoDespesa: tipoDespesaEnum.notNull(),
  valorDespesa: integer("valorDespesa").notNull(),
  descricao: text("descricao", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata (nulo se a despesa não estiver ligada a um veículo específico).
*   `dataDespesa`: Timestamp da despesa, em formato Unix epoch.
*   `tipoDespesa`: Categoria da despesa, utilizando `tipoDespesaEnum`.
*   `valorDespesa`: Valor da despesa (em centavos).
*   `descricao`: Descrição detalhada da despesa, com limite de 300 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `updatedAt`: Timestamp da última atualização do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 7. 📊 `historicoPrecoCombustivel`

Registra o histórico de preços médios de combustível por cidade e estado.

```typescript
export const historicoPrecoCombustivel = sqliteTable("historico_preco_combustivel", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cidade: text("cidade", { length: 100 }).notNull(),
  estado: text("estado", { length: 2 }).notNull(),
  tipoCombustivel: tipoCombustivelEnum.notNull(),
  precoMedio: integer("precoMedio").notNull(),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  fonte: text("fonte", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `cidade`: Nome da cidade, com limite de 100 caracteres.
*   `estado`: Sigla do estado (UF), com limite de 2 caracteres.
*   `tipoCombustivel`: Tipo de combustível, utilizando `tipoCombustivelEnum`.
*   `precoMedio`: Preço médio do combustível (em centavos).
*   `dataRegistro`: Timestamp do registro do preço, em formato Unix epoch.
*   `fonte`: Fonte dos dados do preço (ex: ANP, app de terceiros), com limite de 100 caracteres.
*   `createdAt`: Timestamp da criação do registro, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 8. 📝 `logsAtividades`

Registra atividades importantes do usuário e do sistema para auditoria.

```typescript
export const logsAtividades = sqliteTable("logs_atividades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").references(() => usuarios.id, { onDelete: "set null" }),
  tipoAcao: text("tipoAcao", { length: 50 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  metadados: text("metadados"),
  dataAcao: integer("dataAcao", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira opcional para a tabela `usuarios` (nulo se a ação for do sistema ou anônima).
*   `tipoAcao`: Categoria da ação (ex: `login`, `cadastro`, `atualizacao`), com limite de 50 caracteres.
*   `descricao`: Descrição detalhada da atividade, com limite de 500 caracteres.
*   `metadados`: Campo para armazenar dados extras da atividade em formato JSON.
*   `dataAcao`: Timestamp da ação, em formato Unix epoch.
*   `deletedAt`: Timestamp do soft delete do registro.

## 9. 🎯 `metas`

Representa as metas financeiras ou de produtividade definidas pelos motoristas.

```typescript
export const metas = sqliteTable("metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  idVeiculo: text("idVeiculo").references(() => veiculos.id, { onDelete: "cascade" }),
  titulo: text("titulo", { length: 100 }).notNull(),
  descricao: text("descricao", { length: 500 }),
  tipoMeta: tipoMetaEnum.notNull(),
  periodo: periodoMetaEnum.notNull(),
  valorObjetivo: integer("valorObjetivo").notNull(),
  dataInicio: integer("dataInicio", { mode: "timestamp" }).notNull(),
  dataFim: integer("dataFim", { mode: "timestamp" }).notNull(),
  status: statusMetaEnum.default("ativa").notNull(),
  valorAtual: integer("valorAtual").default(0).notNull(),
  percentualConcluido: integer("percentualConcluido").default(0).notNull(),
  dataConclusao: integer("dataConclusao", { mode: "timestamp" }),
  notificacaoEnviada: integer("notificacaoEnviada", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `idVeiculo`: Chave estrangeira opcional para a tabela `veiculos`, com exclusão em cascata.
*   `titulo`: Título da meta, com limite de 100 caracteres.
*   `descricao`: Descrição detalhada da meta, com limite de 500 caracteres.
*   `tipoMeta`: Tipo de meta, utilizando `tipoMetaEnum`.
*   `periodo`: Período da meta, utilizando `periodoMetaEnum`.
*   `valorObjetivo`: Valor objetivo da meta (em centavos ou unidades).
*   `dataInicio`: Timestamp de início da meta.
*   `dataFim`: Timestamp de fim da meta.
*   `status`: Status atual da meta, utilizando `statusMetaEnum`. Padrão é `ativa`.
*   `valorAtual`: Valor atual da meta. Padrão é 0.
*   `percentualConcluido`: Percentual de conclusão da meta. Padrão é 0.
*   `dataConclusao`: Timestamp de conclusão da meta.
*   `notificacaoEnviada`: Indica se a notificação de conclusão foi enviada. Padrão é `false`.
*   `createdAt`: Timestamp da criação do registro.
*   `updatedAt`: Timestamp da última atualização do registro.
*   `deletedAt`: Timestamp do soft delete do registro.

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `veiculoIdx`: Índice em `idVeiculo`.
- `statusIdx`: Índice em `status`.
- `tipoIdx`: Índice em `tipoMeta`.
- `periodoIdx`: Índice em `periodo`.
- `usuarioStatusIdx`: Índice em `idUsuario` e `status`.
- `ativasIdx`: Índice em `status` e `dataFim`.

## 10. 📈 `progressoMetas`

Acompanha o progresso das metas ao longo do tempo.

```typescript
export const progressoMetas = sqliteTable("progresso_metas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idMeta: text("idMeta").notNull().references(() => metas.id, { onDelete: "cascade" }),
  dataRegistro: integer("dataRegistro", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  valorAnterior: integer("valorAnterior").notNull(),
  valorAtual: integer("valorAtual").notNull(),
  incremento: integer("incremento").notNull(),
  percentualAnterior: integer("percentualAnterior").notNull(),
  percentualAtual: integer("percentualAtual").notNull(),
  observacoes: text("observacoes", { length: 300 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idMeta`: Chave estrangeira para a tabela `metas`, com exclusão em cascata.
*   `dataRegistro`: Timestamp do registro de progresso.
*   `valorAnterior`: Valor da meta antes do incremento.
*   `valorAtual`: Valor atual da meta.
*   `incremento`: Valor do incremento.
*   `percentualAnterior`: Percentual de conclusão anterior.
*   `percentualAtual`: Percentual de conclusão atual.
*   `observacoes`: Observações sobre o progresso.
*   `createdAt`: Timestamp da criação do registro.

**Índices:**
- `metaIdx`: Índice em `idMeta`.
- `dataIdx`: Índice em `dataRegistro`.
- `metaDataIdx`: Índice em `idMeta` e `dataRegistro`.

## 11. 🔔 `notificacoes`

Armazena as notificações enviadas aos usuários.

```typescript
export const notificacoes = sqliteTable("notificacoes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idUsuario: text("idUsuario").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: tipoNotificacaoEnum.notNull(),
  titulo: text("titulo", { length: 200 }).notNull(),
  mensagem: text("mensagem", { length: 1000 }).notNull(),
  dadosExtras: text("dadosExtras"),
  lida: integer("lida", { mode: "boolean" }).default(false).notNull(),
  dataEnvio: integer("dataEnvio", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  dataLeitura: integer("dataLeitura", { mode: "timestamp" }),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
});
```

**Justificativas:**

*   `id` (UUID): Chave primária, gerada automaticamente.
*   `idUsuario`: Chave estrangeira para a tabela `usuarios`, com exclusão em cascata.
*   `tipo`: Tipo de notificação, utilizando `tipoNotificacaoEnum`.
*   `titulo`: Título da notificação.
*   `mensagem`: Conteúdo da mensagem.
*   `dadosExtras`: Dados extras em formato JSON.
*   `lida`: Indica se a notificação foi lida. Padrão é `false`.
*   `dataEnvio`: Timestamp de envio da notificação.
*   `dataLeitura`: Timestamp de leitura da notificação.
*   `deletedAt`: Timestamp do soft delete do registro.

**Índices:**
- `usuarioIdx`: Índice em `idUsuario`.
- `tipoIdx`: Índice em `tipo`.
- `dataEnvioIdx`: Índice em `dataEnvio`.
- `usuarioLidaIdx`: Índice em `idUsuario` e `lida`.

## Migrações e Padrões de Acesso a Dados

### Migrações

As migrações do banco de dados são gerenciadas pelo Drizzle ORM. Elas permitem que o esquema do banco de dados seja versionado e atualizado de forma controlada. Os arquivos de migração SQL são gerados automaticamente pelo Drizzle e aplicados ao banco de dados para refletir as mudanças no esquema. Isso garante que o banco de dados esteja sempre sincronizado com o modelo de dados da aplicação.

**Comandos de Migração:**

- `npm run db:generate`: Gera um novo arquivo de migração baseado nas alterações detectadas no `schema.ts`.
- `npm run db:migrate`: Aplica as migrações pendentes ao banco de dados. É crucial executar este comando após qualquer alteração no esquema.
- `npm run db:check`: Verifica a consistência do esquema do banco de dados com as migrações aplicadas.

### Padrões de Acesso a Dados

O acesso aos dados é realizado através do Drizzle ORM, que fornece uma interface TypeScript-first para interagir com o banco de dados. Isso garante segurança de tipo e facilita a construção de queries complexas.

**Exemplos de Operações Comuns:**

```typescript
import { db } from "../db";
import { usuarios, veiculos } from "../db/schema";
import { eq, and, like } from "drizzle-orm";

// Inserir um novo usuário
export async function criarUsuario(novoUsuario: typeof usuarios.$inferInsert) {
  return db.insert(usuarios).values(novoUsuario).returning();
}

// Buscar usuário por email
export async function buscarUsuarioPorEmail(email: string) {
  return db.select().from(usuarios).where(eq(usuarios.email, email)).get();
}

// Atualizar status de um veículo
export async function atualizarStatusVeiculo(idVeiculo: string, novoStatus: string) {
  return db.update(veiculos).set({ status: novoStatus }).where(eq(veiculos.id, idVeiculo)).returning();
}

// Buscar jornadas de um usuário em um período
export async function buscarJornadasPorPeriodo(idUsuario: string, dataInicio: number, dataFim: number) {
  return db.select()
    .from(jornadas)
    .where(and(eq(jornadas.idUsuario, idUsuario), gte(jornadas.dataInicio, dataInicio), lte(jornadas.dataFim, dataFim)))
    .orderBy(jornadas.dataInicio)
    .all();
}
```

**Boas Práticas de Acesso a Dados:**

- **Camada de Serviço/Repositório**: Encapsular a lógica de acesso a dados em uma camada separada para manter o código limpo e modular.
- **Transações**: Utilizar transações para operações que envolvem múltiplas escritas no banco de dados, garantindo atomicidade.
- **Tratamento de Erros**: Implementar tratamento robusto de erros para falhas de banco de dados.
- **Segurança**: Evitar SQL Injection utilizando ORMs e queries parametrizadas.


