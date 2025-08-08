# ⚙️ Especificações Técnicas Completas do GiroPro

Este documento serve como a **BÍBLIA TÉCNICA** do projeto GiroPro, detalhando o stack tecnológico, padrões de desenvolvimento, configurações obrigatórias, fórmulas de negócio, considerações de design e UX, e a estrutura completa das APIs. Qualquer alteração nas tecnologias ou padrões deve ser aprovada e documentada aqui primeiro.

---

## 1. Stack Tecnológico Oficial

### 1.1. Backend
- **Runtime**: Node.js (versão LTS)
- **Linguagem**: TypeScript 5.8.3+
- **Framework Web**: Express 4.18.2 + Fastify 5.4.0 (híbrido)
- **ORM**: Drizzle ORM 0.44.3+
- **Validação**: Zod 3.22.4+
- **Autenticação**: JWT (jsonwebtoken 9.0.0+)
- **Hash de Senhas**: bcrypt 5.1.0+
- **Cache**: Redis (ioredis 5.6.1+)
- **Compressão**: compression 1.8.1+
- **Segurança**: helmet 8.1.0+, cors 2.8.5+
- **Rate Limiting**: express-rate-limit 8.0.1+

### 1.2. Frontend
- **Framework**: React Native 0.79.5+
- **Runtime**: Expo 53.0.20+
- **Linguagem**: TypeScript 5.8.3+
- **Navegação**: React Navigation 7.1.16+
- **Estado Global**: TanStack React Query 5.83.0+
- **HTTP Client**: Axios 1.11.0+
- **Storage**: AsyncStorage 2.1.2+
- **UI Components**: React Native built-in + custom components

### 1.3. Banco de Dados
- **Principal**: PostgreSQL 16+ (Alpine)
- **Alternativo**: SQLite (better-sqlite3 12.2.0+)
- **Migrations**: Drizzle Kit 0.31.4+
- **Connection Pooling**: pg 8.11.3+

### 1.4. Testes
- **Framework**: Jest 29.7.0+
- **E2E**: Playwright 1.54.1+
- **Testing Library**: React Native Testing Library 13.2.0+
- **Coverage**: Jest built-in coverage

### 1.5. DevOps e Deploy
- **Containerização**: Docker + Docker Compose
- **CI/CD**: Scripts npm personalizados
- **Linting**: ESLint 8.52.0+
- **Formatação**: Prettier 3.0.3+

---

## 2. Padrões de Dados Obrigatórios

### 2.1. Identificadores
- **Tipo**: UUID v4
- **Geração**: `crypto.randomUUID()`
- **Formato**: String (36 caracteres)

### 2.2. Valores Monetários
- **Unidade**: SEMPRE em centavos (integer)
- **Conversão**: R$ 10,50 = 1050 centavos
- **Campos**: `valorTotal`, `valorLitro`, `valorDespesa`, `ganhoBruto`

### 2.3. Timestamps
- **Tipo**: Unix timestamp (integer)
- **Modo**: `{ mode: "timestamp" }`
- **Default**: `sql\`(unixepoch())\``
- **Campos**: `createdAt`, `updatedAt`, `deletedAt`

### 2.4. Soft Delete
- **Campo**: `deletedAt` (integer timestamp nullable)
- **Lógica**: NULL = ativo, timestamp = deletado
- **Queries**: SEMPRE filtrar `isNull(tabela.deletedAt)`

### 2.5. Nomenclatura
- **Padrão**: camelCase (OBRIGATÓRIO)
- **Exemplos**: `idUsuario`, `dataAbastecimento`, `valorTotal`
- **Proibido**: snake_case (`id_usuario`, `data_abastecimento`)

---

## 3. Estrutura de APIs

### 3.1. Base URL
- **Padrão**: `/api/v1/`
- **Exemplo**: `POST /api/v1/auth/login`

### 3.2. Autenticação
- **Tipo**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Middleware**: `authMiddleware` (obrigatório em rotas protegidas)

### 3.3. Respostas Padrão
```typescript
// Sucesso
{
  "success": true,
  "data": any,
  "message"?: string
}

// Erro
{
  "success": false,
  "error": string,
  "details"?: any
}
```

### 3.4. Cache
- **TTL Dashboard**: 1800s (30min)
- **TTL Analytics**: 3600s (1h)
- **Middleware**: `dashboardCache(ttl)`

### 3.5. Rate Limiting
- **Padrão**: 100 req/15min por IP
- **Auth**: 5 req/15min por IP
- **Middleware**: `express-rate-limit`

### 3.6. Endpoints Principais (Exemplos)
- **Autenticação**: `/auth/register`, `/auth/login`, `/auth/me`
- **Dashboard**: `/dashboard/summary`, `/dashboard/evolution`, `/dashboard/vehicles`
- **Veículos**: CRUD completo via `/vehicles`
- **Abastecimentos**: CRUD completo via `/fuelings`
- **Despesas**: CRUD completo via `/expenses`
- **Jornadas**: CRUD completo via `/journeys`
- **Relatórios**: `/reports/weekly`, `/reports/monthly`, `/analytics`
- **Gamificação**: `/goals`, `/achievements`
- **Preços de Combustível**: `/fuel-prices`
- **Notificações**: `/notifications`
- **Insights**: `/insights`

---

## 4. Fórmulas de Métricas Financeiras

As seguintes fórmulas são utilizadas para calcular as métricas apresentadas nos relatórios e dashboards do GiroPro:

### 4.1. Dashboard de Lucratividade (Visão Geral)

- **Faturamento Bruto (FB):** Soma dos `ganhoBruto` de todas as jornadas finalizadas no período.
  `FB = SUM(jornadas.ganhoBruto) para jornadas.dataFim dentro do período.`

- **Total de Despesas (TD):** Soma dos `valorTotal` dos abastecimentos e `valorDespesa` das despesas no período.
  `TD = SUM(abastecimentos.valorTotal) + SUM(despesas.valorDespesa) para abastecimentos.dataAbastecimento e despesas.dataDespesa dentro do período.`

- **Lucro Líquido (LL):** Faturamento Bruto menos o Total de Despesas.
  `LL = FB - TD`

- **KM Total Rodado (KMT):** Soma dos `kmTotal` de todas as jornadas finalizadas no período.
  `KMT = SUM(jornadas.kmTotal) para jornadas.dataFim dentro do período.`

- **Custo por KM Rodado (CKM):** Total de Despesas dividido pelo KM Total Rodado.
  `CKM = TD / KMT (se KMT > 0)`

- **Ganho Médio por Jornada (GMJ):** Faturamento Bruto dividido pelo número de jornadas finalizadas no período.
  `GMJ = FB / COUNT(jornadas.id) para jornadas.dataFim dentro do período (se COUNT(jornadas.id) > 0)`

### 4.2. Relatório Detalhado de Ganhos por Jornada

- **Data e Hora de Início/Fim:** `jornadas.dataInicio`, `jornadas.dataFim`.

- **KM Inicial e Final:** `jornadas.kmInicial`, `jornadas.kmFim`.

- **KM Total Rodado (KMT_Jornada):** `jornadas.kmTotal` (calculado como `kmFim - kmInicial`).

- **Tempo Total da Jornada (TT_Jornada):** `jornadas.tempoTotal` (calculado como `dataFim - dataInicio` em minutos).

- **Ganho Bruto da Jornada (GB_Jornada):** `jornadas.ganhoBruto`.

- **Custo Estimado de Combustível por Jornada (CEC_Jornada):** `(KMT_Jornada / veiculos.mediaConsumo) * abastecimentos.valorLitroMedioPeriodo`.
  * `veiculos.mediaConsumo` é uma média pré-calculada ou estimada.
  * `abastecimentos.valorLitroMedioPeriodo` é o preço médio do litro de combustível pago pelo usuário no período da jornada (em centavos).

- **Lucro Líquido Estimado por Jornada (LLE_Jornada):** `GB_Jornada - CEC_Jornada`.

### 4.3. Relatório de Análise de Despesas

- **Total Gasto por Categoria de Despesa (TGC):** Soma dos `valorDespesa` para cada `tipoDespesa` no período.
  `TGC(categoria) = SUM(despesas.valorDespesa) para despesas.dataDespesa dentro do período e despesas.tipoDespesa = categoria.`

- **Total Gasto por Veículo (TGV):** Soma dos `valorDespesa` associados a cada `idVeiculo` no período.
  `TGV(veiculo_id) = SUM(despesas.valorDespesa) para despesas.dataDespesa dentro do período e despesas.idVeiculo = veiculo_id.`

- **Evolução das Despesas:** Soma das despesas por período (diário, semanal, mensal) para análise de tendência.
  `Evolucao_Despesas(periodo) = SUM(despesas.valorDespesa) agrupado por periodo.`

### 4.4. Relatório de Consumo de Combustível

- **Total Gasto com Combustível (TGC):** Soma dos `valorTotal` de todos os abastecimentos no período.
  `TGC = SUM(abastecimentos.valorTotal) para abastecimentos.dataAbastecimento dentro do período.`

- **Média de Consumo (KM/Litro) por Veículo (MCV):** KM Total Rodado do Veículo / Total de Litros Abastecidos no Veículo.
  `MCV(veiculo_id) = SUM(jornadas.kmTotal WHERE jornadas.idVeiculo = veiculo_id) / SUM(abastecimentos.quantidadeLitros WHERE abastecimentos.idVeiculo = veiculo_id) para o período.`

- **Preço Médio do Litro Pago (PMLP):** Total Gasto com Combustível / Total de Litros Abastecidos.
  `PMLP = SUM(abastecimentos.valorTotal) / SUM(abastecimentos.quantidadeLitros) para o período.`

- **Total de Litros Abastecidos (TLA):** Soma dos `quantidadeLitros` de todos os abastecimentos no período.
  `TLA = SUM(abastecimentos.quantidadeLitros) para abastecimentos.dataAbastecimento dentro do período.`

---

## 5. Considerações de Design e UX

As seguintes diretrizes de design e experiência do usuário são aplicadas no desenvolvimento do GiroPro:

- **Simplicidade e Clareza:** As visualizações devem ser fáceis de entender, mesmo para usuários sem experiência em análise de dados.

- **Filtros Flexíveis:** Permitir que o usuário filtre os dados por período (dia, semana, mês, personalizado), veículo e outras dimensões relevantes.

- **Interatividade:** Possibilidade de clicar em elementos do dashboard para ver detalhes (drill-down) e, especialmente, a capacidade de expandir cards individuais para exibição em tela cheia. Esta funcionalidade permitirá que o motorista (ou um 'influencer' em uma apresentação) enfatize um dado específico, como o 'Lucro Líquido do Dia', mostrando-o de forma proeminente e isolada para maior impacto visual e clareza. Isso é crucial para apresentações rápidas e impactantes, como as que um influencer faria.

- **Performance:** Carregamento rápido das informações para garantir uma boa experiência do usuário.

- **Acessibilidade:** Design que atenda aos padrões de acessibilidade.

---

## 6. Relatórios e Dashboards Detalhados

### 6.1. Dashboard de Lucratividade (Visão Geral)

Um dashboard conciso que apresente as métricas mais importantes de lucratividade em um período selecionado (diário, semanal, mensal).

**Métricas Chave e Fórmulas:**
- Faturamento Bruto (FB): Soma dos ganhoBruto de todas as jornadas finalizadas no período
- Total de Despesas (TD): Soma dos valorTotal dos abastecimentos e valorDespesa das despesas no período
- Lucro Líquido (LL): Faturamento Bruto menos o Total de Despesas
- KM Total Rodado (KMT): Soma dos kmTotal de todas as jornadas finalizadas no período
- Custo por KM Rodado (CKM): Total de Despesas dividido pelo KM Total Rodado
- Ganho Médio por Jornada (GMJ): Faturamento Bruto dividido pelo número de jornadas finalizadas no período

**Visualizações:**
- Cards de resumo para as métricas chave (LL, FB, TD, CKM, GMJ)
- Gráfico de linha mostrando a evolução do Lucro Líquido ao longo do tempo
- Gráfico de barras comparando Faturamento Bruto vs. Total de Despesas

### 6.2. Relatório Detalhado de Ganhos por Jornada

Um relatório que permita ao motorista analisar o desempenho financeiro de cada jornada individualmente.

**Métricas Chave por Jornada e Fórmulas:**
- Data e Hora de Início/Fim: jornadas.dataInicio, jornadas.dataFim
- KM Inicial e Final: jornadas.kmInicial, jornadas.kmFim
- KM Total Rodado (KMT_Jornada): jornadas.kmTotal (calculado como kmFim - kmInicial)
- Tempo Total da Jornada (TT_Jornada): jornadas.tempoTotal (calculado como dataFim - dataInicio em minutos)
- Ganho Bruto da Jornada (GB_Jornada): jornadas.ganhoBruto
- Custo Estimado de Combustível por Jornada (CEC_Jornada): (KMT_Jornada / veiculos.mediaConsumo) * abastecimentos.valorLitroMedioPeriodo
- Lucro Líquido Estimado por Jornada (LLE_Jornada): GB_Jornada - CEC_Jornada

**Visualizações:**
- Tabela detalhada com filtros por data, veículo e status (finalizada)
- Possibilidade de exportação para CSV/Excel

### 6.3. Relatório de Análise de Despesas

Um relatório que detalhe os gastos do motorista, permitindo identificar onde o dinheiro está sendo gasto e possíveis áreas para economia.

**Métricas Chave e Fórmulas:**
- Total Gasto por Categoria de Despesa (TGC): Soma dos valorDespesa para cada tipoDespesa no período
- Total Gasto por Veículo (TGV): Soma dos valorDespesa associados a cada idVeiculo no período
- Evolução das Despesas: Soma das despesas por período (diário, semanal, mensal) para análise de tendência

**Visualizações:**
- Gráfico de pizza/barras mostrando a distribuição percentual das despesas por categoria
- Tabela detalhada de todas as despesas com filtros por data, categoria e veículo

### 6.4. Relatório de Consumo de Combustível

Focado especificamente nos gastos com combustível, uma das maiores despesas para motoristas.

**Métricas Chave e Fórmulas:**
- Total Gasto com Combustível (TGC): Soma dos valorTotal de todos os abastecimentos no período
- Média de Consumo (KM/Litro) por Veículo (MCV): KM Total Rodado do Veículo / Total de Litros Abastecidos no Veículo
- Preço Médio do Litro Pago (PMLP): Total Gasto com Combustível / Total de Litros Abastecidos
- Total de Litros Abastecidos (TLA): Soma dos quantidadeLitros de todos os abastecimentos no período

**Visualizações:**
- Gráfico de linha mostrando a evolução do preço médio do litro pago
- Gráfico de barras comparando o consumo médio entre diferentes tipos de combustível ou veículos

---

## 7. Fontes de Dados

Os relatórios e dashboards serão construídos a partir dos dados já existentes no banco de dados do GiroPro, utilizando as seguintes tabelas:

- **jornadas:** Para ganhos brutos, KM rodado e tempo de jornada
- **abastecimentos:** Para gastos com combustível, quantidade de litros e KM atual
- **despesas:** Para outras despesas e suas categorias
- **veiculos:** Para informações do veículo e cálculo de consumo médio
- **usuarios:** Para associar os dados ao motorista correto

---

## 8. Configurações de Ambiente

### 8.1. Variáveis Obrigatórias (.env)
```bash
# Banco de Dados
DB_TYPE=postgresql|sqlite
DATABASE_URL=postgresql://user:pass@host:port/db
SQLITE_DB_PATH=giropro.db

# Autenticação
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d

# Cache
REDIS_URL=redis://localhost:6379

# Servidor
PORT=3000
NODE_ENV=development|production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

### 8.2. Configurações de Produção
- **HTTPS**: Obrigatório
- **Helmet**: Configurado com CSP
- **CORS**: Origins específicos
- **Rate Limiting**: Mais restritivo
- **Logs**: Estruturados (JSON)

---

## 9. Estrutura de Projeto

### 9.1. Backend (`/backend/src/`)
```
├── controllers/     # Controladores de rotas
├── services/       # Lógica de negócio
├── routes/         # Definição de rotas
├── middlewares/    # Middlewares customizados
├── db/            # Schema e conexões
├── utils/         # Utilitários
├── types/         # Definições TypeScript
└── tests/         # Testes
```

### 9.2. Frontend (`/frontend/src/`)
```
├── screens/       # Telas da aplicação
├── components/    # Componentes reutilizáveis
├── navigation/    # Configuração de navegação
├── contexts/      # Contextos React
├── services/      # Chamadas API
├── utils/         # Utilitários
└── types/         # Definições TypeScript
```

---

## 10. Funcionalidades Implementadas

### 10.1. Módulos Principais
- ✅ **Autenticação**: Login, registro, JWT
- ✅ **Dashboard**: Métricas de lucratividade
- ✅ **Veículos**: CRUD multi-veículo
- ✅ **Abastecimentos**: Registro e histórico
- ✅ **Despesas**: Categorização e análise
- ✅ **Viagens**: Controle de jornadas
- ✅ **Relatórios**: Semanais/mensais
- ✅ **Gamificação**: Conquistas e metas
- ✅ **Notificações**: Sistema completo
- ✅ **Analytics**: Insights avançados

### 10.2. Recursos Técnicos
- ✅ **Cache Redis**: Performance otimizada
- ✅ **Soft Delete**: Recuperação de dados
- ✅ **Auditoria**: createdAt/updatedAt
- ✅ **Validação**: Zod schemas
- ✅ **Testes**: Unitários e E2E
- ✅ **TypeScript**: Tipagem completa

---

## 11. Comandos de Desenvolvimento

### 11.1. Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Iniciar produção
npm run test         # Testes
npm run db:generate  # Gerar migrations
npm run db:migrate   # Executar migrations
npm run db:studio    # Interface visual DB
```

### 11.2. Frontend
```bash
npm run start        # Expo dev server
npm run web          # Versão web
npm run android      # Build Android
npm run ios          # Build iOS
npm run test         # Testes
```

---

## 12. Regras de Desenvolvimento

### 12.1. Código
- **Sempre** usar TypeScript
- **Sempre** usar camelCase
- **Sempre** validar com Zod
- **Sempre** tratar erros
- **Sempre** usar soft delete

### 12.2. Commits
- **Formato**: `tipo: descrição`
- **Tipos**: feat, fix, docs, style, refactor, test
- **Exemplo**: `feat: adicionar dashboard de lucratividade`

### 12.3. Testes
- **Cobertura mínima**: 80%
- **Testes obrigatórios**: Controllers, Services
- **E2E**: Fluxos principais

---

## 13. Segurança

### 13.1. Autenticação
- **Senhas**: bcrypt com salt rounds 12
- **JWT**: Expiração 7 dias
- **Refresh**: Não implementado (usar re-login)

### 13.2. Validação
- **Input**: Zod schemas obrigatórios
- **SQL**: Drizzle ORM (proteção automática)
- **XSS**: Helmet configurado

### 13.3. CORS
- **Desenvolvimento**: Liberado para localhost
- **Produção**: Origins específicos apenas

---

## 14. Performance

### 14.1. Cache
- **Redis**: Dados frequentes
- **TTL**: Baseado na criticidade
- **Invalidação**: Manual quando necessário

### 14.2. Banco
- **Índices**: Criados para queries frequentes
- **Paginação**: Implementada em listas
- **Soft Delete**: Filtros automáticos

### 14.3. Frontend
- **React Query**: Cache de requisições
- **Lazy Loading**: Componentes pesados
- **Otimização**: Bundle size monitorado

---

**Desenvolvido por Manus AI**  
*Última Atualização: 8 de Agosto de 2025*

