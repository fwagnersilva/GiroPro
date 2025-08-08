# 🔧 Especificações Técnicas Completas - GiroPro

**Documento Complementar às Especificações Técnicas Principais**

Este documento define o stack tecnológico completo, padrões de desenvolvimento e configurações obrigatórias do projeto GiroPro.

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

---

## 4. Configurações de Ambiente

### 4.1. Variáveis Obrigatórias (.env)
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

### 4.2. Configurações de Produção
- **HTTPS**: Obrigatório
- **Helmet**: Configurado com CSP
- **CORS**: Origins específicos
- **Rate Limiting**: Mais restritivo
- **Logs**: Estruturados (JSON)

---

## 5. Estrutura de Projeto

### 5.1. Backend (`/backend/src/`)
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

### 5.2. Frontend (`/frontend/src/`)
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

## 6. Funcionalidades Implementadas

### 6.1. Módulos Principais
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

### 6.2. Recursos Técnicos
- ✅ **Cache Redis**: Performance otimizada
- ✅ **Soft Delete**: Recuperação de dados
- ✅ **Auditoria**: createdAt/updatedAt
- ✅ **Validação**: Zod schemas
- ✅ **Testes**: Unitários e E2E
- ✅ **TypeScript**: Tipagem completa

---

## 7. Comandos de Desenvolvimento

### 7.1. Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Iniciar produção
npm run test         # Testes
npm run db:generate  # Gerar migrations
npm run db:migrate   # Executar migrations
npm run db:studio    # Interface visual DB
```

### 7.2. Frontend
```bash
npm run start        # Expo dev server
npm run web          # Versão web
npm run android      # Build Android
npm run ios          # Build iOS
npm run test         # Testes
```

---

## 8. Regras de Desenvolvimento

### 8.1. Código
- **Sempre** usar TypeScript
- **Sempre** usar camelCase
- **Sempre** validar com Zod
- **Sempre** tratar erros
- **Sempre** usar soft delete

### 8.2. Commits
- **Formato**: `tipo: descrição`
- **Tipos**: feat, fix, docs, style, refactor, test
- **Exemplo**: `feat: adicionar dashboard de lucratividade`

### 8.3. Testes
- **Cobertura mínima**: 80%
- **Testes obrigatórios**: Controllers, Services
- **E2E**: Fluxos principais

---

## 9. Segurança

### 9.1. Autenticação
- **Senhas**: bcrypt com salt rounds 12
- **JWT**: Expiração 7 dias
- **Refresh**: Não implementado (usar re-login)

### 9.2. Validação
- **Input**: Zod schemas obrigatórios
- **SQL**: Drizzle ORM (proteção automática)
- **XSS**: Helmet configurado

### 9.3. CORS
- **Desenvolvimento**: Liberado para localhost
- **Produção**: Origins específicos apenas

---

## 10. Performance

### 10.1. Cache
- **Redis**: Dados frequentes
- **TTL**: Baseado na criticidade
- **Invalidação**: Manual quando necessário

### 10.2. Banco
- **Índices**: Criados para queries frequentes
- **Paginação**: Implementada em listas
- **Soft Delete**: Filtros automáticos

### 10.3. Frontend
- **React Query**: Cache de requisições
- **Lazy Loading**: Componentes pesados
- **Otimização**: Bundle size monitorado

---

**⚠️ IMPORTANTE**: Este documento é a **BÍBLIA TÉCNICA** do projeto. Qualquer alteração deve ser aprovada e documentada aqui primeiro.

**Desenvolvido por Manus AI**  
*Última Atualização: 8 de Agosto de 2025*

