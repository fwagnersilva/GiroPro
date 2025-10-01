# Tecnologias e Padrões Utilizados no GiroPro

Este documento detalha o stack tecnológico oficial do projeto GiroPro e os padrões de dados obrigatórios, fornecendo uma visão clara das escolhas técnicas e suas justificativas.

## 1. Stack Tecnológico Oficial

O GiroPro é construído com um conjunto de tecnologias modernas e robustas, selecionadas para garantir performance, escalabilidade e manutenibilidade.

### 1.1. Backend

*   **Runtime**: Node.js (versão LTS)
*   **Linguagem**: TypeScript 5.8.3+
*   **Framework Web**: Express 4.18.2 - *A escolha do Express visa a flexibilidade e vasta comunidade.*
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
*   **Runtime**: Expo 55.0.20+ - *Facilita o desenvolvimento, teste e deploy de aplicações React Native.*
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
*   **CI/CD**: Scripts pnpm personalizados
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

---

**Última atualização**: 01/10/2025
**Versão**: 1.2

