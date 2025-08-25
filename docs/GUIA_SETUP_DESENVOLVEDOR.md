# Guia de Setup - GiroPro

## Visão Geral

O GiroPro é uma aplicação para gestão financeira de motoristas de aplicativo, composta por:
- **Backend**: API REST em Node.js/TypeScript com Express
- **Frontend**: Aplicação React Native/Expo
- **Banco de Dados**: SQLite com Drizzle ORM

## Pré-requisitos

### Ferramentas Necessárias
- **Node.js**: versão 18+ (recomendado: 20.x)
- **npm**: versão 8+ (incluído com Node.js)
- **Git**: para controle de versão
- **Editor de código**: VS Code (recomendado)

### Extensões VS Code Recomendadas
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- SQLite Viewer
- React Native Tools

## Configuração do Ambiente

### 1. Clonagem do Repositório

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

### 2. Configuração do Backend

#### 2.1. Instalação das Dependências
```bash
cd backend
npm install
```

#### 2.2. Configuração do Ambiente
```bash
# Copiar arquivo de configuração
cp giropro.env .env

# Editar as configurações se necessário
nano .env
```

#### 2.3. Configurações Principais (.env)
```env
# Banco de Dados
SQLITE_DB_PATH=./giropro.db

# Servidor
PORT=3000
HOST=0.0.0.0

# API
API_VERSION=v1
API_PREFIX=/api

# Segurança
JWT_SECRET=seu_jwt_secret_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_diferente_aqui
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Features
COMPRESSION_ENABLED=true
LOG_LEVEL=info
```

#### 2.4. Compilação e Execução
```bash
# Compilar TypeScript
npm run build

# Executar em modo desenvolvimento
npm run dev

# Ou executar versão compilada
npm start
```

### 3. Configuração do Frontend

#### 3.1. Instalação das Dependências
```bash
cd ../frontend
npm install
```

#### 3.2. Execução do Frontend
```bash
# Iniciar Expo
npm start

# Ou executar diretamente
expo start
```

## Estrutura do Projeto

### Backend (`/backend`)
```
backend/
├── src/
│   ├── controllers/          # Controladores das rotas
│   ├── routes/              # Definições de rotas
│   ├── middlewares/         # Middlewares customizados
│   ├── schemas/             # Schemas de validação Zod
│   ├── services/            # Lógica de negócio
│   ├── db/                  # Configuração do banco
│   ├── types/               # Tipos TypeScript
│   ├── utils/               # Utilitários
│   └── app.ts              # Aplicação principal
├── drizzle/                 # Migrações do banco
├── package.json
├── tsconfig.json
└── .env
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/          # Componentes React Native
│   ├── screens/            # Telas da aplicação
│   ├── navigation/         # Configuração de navegação
│   ├── services/           # Serviços de API
│   ├── utils/              # Utilitários
│   └── App.tsx            # Componente principal
├── assets/                 # Recursos estáticos
├── package.json
└── app.json
```

## Scripts Disponíveis

### Backend
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Compilar TypeScript
npm start            # Executar versão compilada
npm test             # Executar testes
npm run lint         # Verificar código com ESLint
npm run format       # Formatar código com Prettier

# Scripts de banco de dados
npm run db:generate  # Gerar migrações
npm run db:migrate   # Aplicar migrações
npm run db:studio    # Abrir Drizzle Studio
```

### Frontend
```bash
npm start            # Iniciar Expo
npm run android      # Executar no Android
npm run ios          # Executar no iOS
npm run web          # Executar na web
```

## Banco de Dados

### Configuração SQLite
O projeto usa SQLite como banco de dados padrão com Drizzle ORM.

#### Arquivo de Banco
- **Localização**: `backend/giropro.db`
- **ORM**: Drizzle
- **Migrações**: `backend/drizzle/`

#### Comandos Úteis
```bash
# Gerar nova migração
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Visualizar banco (Drizzle Studio)
npm run db:studio
```

## Endpoints da API

### Endpoints Principais
- **Health Check**: `GET /health`
- **Test**: `GET /api/test`
- **Auth**: `/api/v1/auth`
- **Users**: `/api/v1/users`
- **Vehicles**: `/api/v1/vehicles`
- **Journeys**: `/api/v1/journeys`
- **Fuelings**: `/api/v1/fuelings`
- **Expenses**: `/api/v1/expenses`

### Testando a API
```bash
# Health check
curl http://localhost:3000/health

# Test endpoint
curl http://localhost:3000/api/test
```

## Solução de Problemas Comuns

### 1. Erro de Compilação TypeScript
```bash
# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar configuração TypeScript
npx tsc --noEmit
```

### 2. Problemas de Porta
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000

# Matar processo na porta
kill -9 $(lsof -t -i:3000)
```

### 3. Problemas de Banco de Dados
```bash
# Resetar banco (cuidado: apaga dados!)
rm giropro.db
npm run db:migrate
```

### 4. Vulnerabilidades de Segurança
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente (cuidado com breaking changes)
npm audit fix
```

## Desenvolvimento

### Fluxo de Trabalho Recomendado
1. Criar branch para feature: `git checkout -b feature/nova-funcionalidade`
2. Fazer alterações e commits frequentes
3. Executar testes: `npm test`
4. Verificar lint: `npm run lint`
5. Criar Pull Request

### Padrões de Código
- **Formatação**: Prettier (configurado automaticamente)
- **Linting**: ESLint com regras TypeScript
- **Commits**: Mensagens descritivas em português
- **Branches**: `feature/`, `bugfix/`, `hotfix/`

## Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm run test:coverage

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

## Deploy

### Preparação para Deploy
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

### Variáveis de Ambiente para Produção
- Alterar `JWT_SECRET` e `JWT_REFRESH_SECRET`
- Configurar `ALLOWED_ORIGINS` adequadamente
- Definir `LOG_LEVEL=error` para produção
- Configurar banco de dados de produção se necessário

## Recursos Adicionais

### Documentação
- **Drizzle ORM**: https://orm.drizzle.team/
- **Express.js**: https://expressjs.com/
- **React Native**: https://reactnative.dev/
- **Expo**: https://expo.dev/

### Ferramentas de Debug
- **Drizzle Studio**: Interface visual para o banco
- **Postman/Insomnia**: Testar APIs
- **React Native Debugger**: Debug do frontend

## Contato e Suporte

Para dúvidas ou problemas:
1. Verificar este guia primeiro
2. Consultar documentação oficial das tecnologias
3. Verificar issues no repositório GitHub
4. Contatar a equipe de desenvolvimento

---

**Última atualização**: 25/08/2025
**Versão do guia**: 1.0
