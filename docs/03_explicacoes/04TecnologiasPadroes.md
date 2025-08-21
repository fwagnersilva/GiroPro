# Tecnologias e Padrões Utilizados no GiroPro

Este documento detalha o stack tecnológico oficial do projeto GiroPro, os padrões de dados obrigatórios e a estrutura de projeto, fornecendo uma visão clara das escolhas técnicas e suas justificativas.

## 1. Stack Tecnológico Oficial

O GiroPro é construído com um conjunto de tecnologias modernas e robustas, selecionadas para garantir performance, escalabilidade e manutenibilidade.

### 1.1. Backend

*   **Runtime**: Node.js (versão LTS)
*   **Linguagem**: TypeScript 5.8.3+
*   **Framework Web**: Express 4.18.2 + Fastify 5.4.0 (híbrido) - *A escolha híbrida visa aproveitar a flexibilidade do Express com a performance do Fastify para rotas críticas.*
*   **ORM**: Drizzle ORM 0.44.3+ - *Selecionado por sua tipagem forte e leveza, oferecendo uma experiência de desenvolvimento segura e eficiente para interações com o banco de dados.*
*   **Validação**: Zod 3.22.4+ - *Utilizado para validação de schemas de dados, garantindo a integridade das informações que entram e saem da API.*
*   **Autenticação**: JWT (jsonwebtoken 9.0.0+) - *Padrão da indústria para autenticação stateless, proporcionando segurança e escalabilidade.*
*   **Hash de Senhas**: bcrypt 5.1.0+ - *Algoritmo robusto para armazenamento seguro de senhas.*
*   **Cache**: Redis (ioredis 5.6.1+) - *Utilizado para otimizar o desempenho do dashboard e analytics, reduzindo a carga sobre o banco de dados.*
*   **Compressão**: compression 1.8.1+
*   **Segurança**: helmet 8.1.0+, cors 2.8.5+
*   **Rate Limiting**: express-rate-limit 8.0.1+

### 1.2. Frontend

*   **Framework**: React Native 0.79.5+ - *Permite o desenvolvimento de aplicações móveis multiplataforma (iOS e Android) a partir de uma única base de código.*
*   **Runtime**: Expo 53.0.20+ - *Facilita o desenvolvimento, teste e deploy de aplicações React Native.*
*   **Linguagem**: TypeScript 5.8.3+
*   **Navegação**: React Navigation 7.1.16+
*   **Estado Global**: TanStack React Query 5.83.0+ - *Gerenciamento eficiente de estado assíncrono e cache de dados.*
*   **HTTP Client**: Axios 1.11.0+
*   **Storage**: AsyncStorage 2.1.2+
*   **UI Components**: React Native built-in + custom components

### 1.3. Banco de Dados

*   **Principal**: PostgreSQL 16+ (Alpine) - *Escolha para ambientes de produção devido à sua robustez, escalabilidade e conjunto completo de recursos.*
*   **Alternativo**: SQLite (better-sqlite3 12.2.0+) - *Utilizado para desenvolvimento local e testes, oferecendo uma solução leve e sem a necessidade de configuração de um servidor de banco de dados externo.*
*   **Migrations**: Drizzle Kit 0.31.4+ - *Ferramenta para gerenciar as alterações no schema do banco de dados de forma versionada e controlada.*
*   **Connection Pooling**: pg 8.11.3+

### 1.4. Testes

*   **Framework**: Jest 29.7.0+ - *Utilizado para testes unitários e de integração no backend e frontend.*
*   **E2E**: Playwright 1.54.1+ - *Para testes end-to-end, simulando a interação do usuário com a aplicação completa.*
*   **Testing Library**: React Native Testing Library 13.2.0+
*   **Coverage**: Jest built-in coverage

### 1.5. DevOps e Deploy

*   **Containerização**: Docker + Docker Compose - *Garante ambientes de desenvolvimento e produção consistentes e isolados.*
*   **CI/CD**: Scripts npm personalizados
*   **Linting**: ESLint 8.52.0+ - *Ferramenta para garantir a qualidade do código e a conformidade com os padrões de estilo.*
*   **Formatação**: Prettier 3.0.3+ - *Ferramenta para formatação automática de código, garantindo consistência visual.*

## 2. Padrões de Dados Obrigatórios

Para garantir a consistência e a integridade dos dados em todo o sistema, o GiroPro adota os seguintes padrões obrigatórios:

### 2.1. Identificadores

*   **Tipo**: UUID v4
*   **Geração**: `crypto.randomUUID()`
*   **Formato**: String (36 caracteres)

### 2.2. Valores Monetários

*   **Unidade**: SEMPRE em centavos (integer) - *Essa abordagem evita problemas de precisão com números de ponto flutuante em cálculos financeiros.*
*   **Conversão**: R$ 10,50 = 1050 centavos
*   **Campos**: `valorTotal`, `valorLitro`, `valorDespesa`, `ganhoBruto`

### 2.3. Timestamps

*   **Tipo**: Unix timestamp (integer) - *Armazenamento eficiente e compatível com diferentes sistemas.*
*   **Modo**: `{ mode: "timestamp" }` no Drizzle ORM - *Permite que o Drizzle mapeie automaticamente para objetos `Date` ou `number` no TypeScript.*
*   **Default**: `sql\`(unixepoch())\`` - *Garante que o timestamp de criação seja registrado automaticamente pelo banco de dados.*
*   **Campos**: `createdAt`, `updatedAt`, `deletedAt`

### 2.4. Soft Delete

*   **Campo**: `deletedAt` (integer timestamp nullable) - *Permite a recuperação de dados e a manutenção do histórico, sem a exclusão física.*
*   **Lógica**: `NULL` = ativo, timestamp = deletado
*   **Queries**: SEMPRE filtrar `isNull(tabela.deletedAt)` - *Essencial para garantir que apenas registros ativos sejam considerados nas consultas padrão.*

### 2.5. Nomenclatura

*   **Padrão**: `camelCase` (OBRIGATÓRIO) - *Este padrão é crucial para a consistência em todo o projeto, desde o schema do banco de dados até o código TypeScript e as APIs. Ele alinha a nomenclatura com as convenções da linguagem JavaScript/TypeScript, facilitando a leitura e manutenção do código.*
*   **Exemplos**: `idUsuario`, `dataAbastecimento`, `valorTotal`
*   **Proibido**: `snake_case` (`id_usuario`, `data_abastecimento`) - *A mistura de padrões de nomenclatura leva a erros de referência, dificuldade de leitura e aumento do débito técnico.*

## 3. Estrutura de Projeto

O projeto GiroPro segue uma estrutura modular e organizada para facilitar o desenvolvimento e a manutenção.

### 3.1. Backend (`/backend/src/`)

```
├── controllers/     # Controladores de rotas, responsáveis por receber requisições e chamar a lógica de negócio.
├── services/       # Lógica de negócio principal da aplicação, onde as regras de negócio são implementadas.
├── routes/         # Definição das rotas da API e associação com os controladores.
├── middlewares/    # Middlewares customizados para autenticação, validação, etc.
├── db/            # Schema do banco de dados (Drizzle ORM) e configurações de conexão.
├── utils/         # Utilitários e funções auxiliares reutilizáveis.
├── types/         # Definições de tipos TypeScript globais e interfaces.
└── tests/         # Testes unitários e de integração do backend.
```

### 3.2. Frontend (`/frontend/src/`)

```
├── screens/       # Telas principais da aplicação, que representam as diferentes views.
├── components/    # Componentes reutilizáveis da interface do usuário.
├── navigation/    # Configuração de navegação entre as telas da aplicação.
├── contexts/      # Contextos React para gerenciamento de estado global.
├── services/      # Chamadas à API do backend e lógica de interação com serviços externos.
├── utils/         # Utilitários e funções auxiliares específicas do frontend.
└── types/         # Definições de tipos TypeScript para o frontend.
```

## 4. Regras de Desenvolvimento

Para manter a qualidade e a consistência do código, as seguintes regras de desenvolvimento são mandatórias:

### 4.1. Código

*   **Sempre** usar TypeScript: Garante tipagem forte e detecção de erros em tempo de compilação.
*   **Sempre** usar `camelCase`: Essencial para a padronização de nomenclatura em todo o código.
*   **Sempre** validar com Zod: Garante a integridade dos dados de entrada e saída.
*   **Sempre** tratar erros: Implementar mecanismos robustos de tratamento de erros em todas as camadas.
*   **Sempre** usar soft delete: Para preservar o histórico e permitir a recuperação de dados.

### 4.2. Commits

*   **Formato**: `tipo: descrição` - Seguir um padrão de mensagens de commit claro e conciso.
*   **Tipos**: `feat` (nova funcionalidade), `fix` (correção de bug), `docs` (alterações na documentação), `style` (formatação, sem mudança de lógica), `refactor` (refatoração de código), `test` (adição/correção de testes).
*   **Exemplo**: `feat: adicionar dashboard de lucratividade`

### 4.3. Testes

*   **Cobertura mínima**: 80% - Meta para garantir a qualidade e a robustez do código.
*   **Testes obrigatórios**: Controllers, Services - As camadas mais críticas devem ter cobertura de teste abrangente.
*   **E2E**: Fluxos principais - Testes end-to-end para validar a funcionalidade da aplicação de ponta a ponta.

## 5. Segurança

A segurança é uma prioridade no GiroPro e é abordada em diversas camadas da aplicação.

### 5.1. Autenticação

*   **Senhas**: `bcrypt` com `salt rounds 12` - Armazenamento seguro de senhas através de hashing.
*   **JWT**: Expiração 7 dias - Tokens de acesso com tempo de vida limitado para maior segurança.
*   **Refresh**: Não implementado (usar re-login) - Simplifica a gestão de tokens, exigindo novo login após a expiração do JWT.

### 5.2. Validação

*   **Input**: Zod schemas obrigatórios - Validação rigorosa de todas as entradas para prevenir ataques de injeção e dados maliciosos.
*   **SQL**: Drizzle ORM (proteção automática) - O ORM ajuda a prevenir ataques de injeção SQL ao parametrizar as consultas.
*   **XSS**: Helmet configurado - Proteção contra ataques de Cross-Site Scripting.

### 5.3. CORS

*   **Desenvolvimento**: Liberado para `localhost` - Facilita o desenvolvimento local.
*   **Produção**: Origins específicos apenas - Restrição de acesso para origens confiáveis em ambiente de produção.

## 6. Comandos de Desenvolvimento

Comandos úteis para o desenvolvimento e manutenção do projeto.

### 6.1. Backend

```bash
npm run dev          # Inicia o servidor de desenvolvimento do backend.
npm run build        # Compila o código TypeScript para produção.
npm run start        # Inicia o servidor de produção.
npm run test         # Executa todos os testes do backend.
npm run db:generate  # Gera as migrações do Drizzle ORM com base nas alterações do schema.
npm run db:migrate   # Executa as migrações pendentes no banco de dados.
npm run db:studio    # Abre a interface visual do Drizzle Studio para gerenciar o banco de dados.
```

### 6.2. Frontend

```bash
npm run start        # Inicia o servidor de desenvolvimento do Expo.
npm run web          # Inicia a versão web da aplicação React Native.
npm run android      # Compila e executa a aplicação no emulador/dispositivo Android.
npm run ios          # Compila e executa a aplicação no emulador/dispositivo iOS.
npm run test         # Executa todos os testes do frontend.
```

## 7. Configurações de Ambiente

As configurações de ambiente são gerenciadas através de variáveis de ambiente, garantindo flexibilidade e segurança.

### 7.1. Variáveis Obrigatórias (`.env`)

```bash
# Banco de Dados
DB_TYPE=postgresql|sqlite # Tipo de banco de dados a ser utilizado (postgresql ou sqlite).
DATABASE_URL=postgresql://user:pass@host:port/db # URL de conexão para PostgreSQL.
SQLITE_DB_PATH=giropro.db # Caminho para o arquivo do banco de dados SQLite.

# Autenticação
JWT_SECRET=<strong-secret> # Chave secreta para assinatura dos tokens JWT.
JWT_EXPIRES_IN=7d # Tempo de expiração do token JWT (ex: 7 dias).

# Cache
REDIS_URL=redis://localhost:6379 # URL de conexão para o servidor Redis.

# Servidor
PORT=3000 # Porta em que o servidor backend será executado.
NODE_ENV=development|production # Ambiente de execução (desenvolvimento ou produção).

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006 # Origens permitidas para requisições CORS.
```

### 7.2. Configurações de Produção

*   **HTTPS**: Obrigatório - Todas as comunicações devem ser criptografadas.
*   **Helmet**: Configurado com CSP (Content Security Policy) - Proteção adicional contra ataques.
*   **CORS**: Origins específicos - Restrição de acesso para origens confiáveis.
*   **Rate Limiting**: Mais restritivo - Limites de requisição mais rigorosos para proteger contra ataques de negação de serviço.
*   **Logs**: Estruturados (JSON) - Facilita a análise e monitoramento em ambientes de produção.

