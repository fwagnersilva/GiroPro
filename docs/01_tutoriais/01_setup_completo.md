# Guia de Setup Completo - GiroPro

## Visão Geral

O GiroPro é uma aplicação para gestão financeira de motoristas de aplicativo, composta por:
- **Backend**: API REST em Node.js/TypeScript com Express.js
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
DB_TYPE=sqlite
SQLITE_DB_PATH=./giropro.db

# Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# API
API_VERSION=v1
API_PREFIX=/api

# Segurança
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
JWT_REFRESH_SECRET=sua_refresh_secret_diferente_aqui
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081

# Features
COMPRESSION_ENABLED=true
LOG_LEVEL=info

# Cache (opcional para desenvolvimento)
REDIS_URL=redis://localhost:6379
```

**Importante**: 
- Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore`
- Para gerar uma chave JWT segura, use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### 2.4. Configuração do Banco de Dados

Execute o script de setup do SQLite:

```bash
./setup_sqlite.sh
```

**ATENÇÃO - Interatividade do Script**: Durante a execução do `setup_sqlite.sh` e `npm run db:migrate`, o script pode solicitar confirmação no terminal (ex: `Is historicoPrecoCombustivel table created or renamed from another table?`). **É crucial observar o terminal e responder com `+` (para criar) ou a opção apropriada para continuar a migração.** A falta de resposta pode fazer o script parecer travado.

Comandos de migração disponíveis:
```bash
# Gerar arquivos de migração baseados nas mudanças no schema
npm run db:generate

# Aplicar migrações ao banco de dados
npm run db:migrate

# Verificar o status das migrações
npm run db:check

# Abrir o Drizzle Studio para visualizar/editar dados
npm run db:studio
```

#### 2.5. Compilação e Execução
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

#### 3.2. Configuração do Ambiente
```bash
# Criar arquivo de configuração .env no diretório frontend
touch .env
```

Configure o arquivo `.env` com as seguintes variáveis, garantindo que a URL da API aponte para o backend local (porta 3000):
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**Importante**: Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas.

#### 3.3. Execução do Frontend
```bash
# Para desenvolvimento web
npm run web

# Para iniciar o Expo (todas as plataformas)
npm start

# Para Android
npm run android

# Para iOS
npm run ios
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
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Executar em modo desenvolvimento |
| `npm run build` | Compilar TypeScript |
| `npm start` | Executar versão compilada |
| `npm test` | Executar testes |
| `npm run lint` | Verificar código com ESLint |
| `npm run format` | Formatar código com Prettier |
| `npm run db:generate` | Gerar migrações |
| `npm run db:migrate` | Aplicar migrações |
| `npm run db:studio` | Abrir Drizzle Studio |

### Frontend
| Script | Descrição |
|--------|-----------|
| `npm start` | Iniciar Expo |
| `npm run android` | Executar no Android |
| `npm run ios` | Executar no iOS |
| `npm run web` | Executar na web |

## Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/health` | GET | Health check |
| `/api/test` | GET | Endpoint de teste |
| `/api/v1/auth` | * | Autenticação |
| `/api/v1/users` | * | Usuários |
| `/api/v1/vehicles` | * | Veículos |
| `/api/v1/journeys` | * | Viagens |
| `/api/v1/fuelings` | * | Abastecimentos |
| `/api/v1/expenses` | * | Despesas |

### Testando a API
```bash
# Health check
curl http://localhost:3000/health

# Test endpoint
curl http://localhost:3000/api/test
```

## Checklist de Setup Rápido

### Pré-requisitos
- [ ] Node.js (LTS) instalado
- [ ] npm instalado
- [ ] Git instalado
- [ ] VS Code (opcional)

### Backend
- [ ] `cd backend`
- [ ] `npm install`
- [ ] `cp giropro.env .env`
- [ ] Editar `.env` com configurações apropriadas
- [ ] `./setup_sqlite.sh`
- [ ] `npm run dev`

### Frontend
- [ ] `cd ../frontend`
- [ ] `npm install`
- [ ] `cp .env.example .env` (se existir)
- [ ] Configurar `REACT_APP_API_URL` no `.env`
- [ ] `npm start` ou `npm run web`

### Verificação
- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend acessível via Expo ou web
- [ ] Testar registro/login de usuário
- [ ] Verificar comunicação entre frontend e backend

## Troubleshooting

### Problemas Comuns do Backend

**Erros de Compilação TypeScript**:
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar configuração TypeScript
npx tsc --noEmit
```

**Problemas de Migração**:
```bash
# Verificar se giropro.env existe
ls -la giropro.env

# Reinstalar dependências do SQLite
npm install better-sqlite3
```

**Porta já em uso**:
```bash
# Verificar processos na porta
netstat -tulpn | grep :3000

# Matar processo
kill -9 $(lsof -t -i:3000)
```

### Problemas Comuns do Frontend

**Porta já em uso**:
```bash
# Usar porta diferente
npm run web -- --port 8082
```

**Erro de conexão com API**:
- Verificar se backend está rodando
- Confirmar URLs no `.env`
- Verificar configuração CORS no backend

### Problemas Gerais

**Erros de Dependência**:
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problemas de Permissão** (Linux/macOS):
```bash
# Tornar script executável
chmod +x setup_sqlite.sh

# Configurar npm para diretório local (evitar sudo)
npm config set prefix ~/.npm-global
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
- **Nomenclatura**: camelCase (padrão do projeto)

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

## Próximos Passos

Após configurar o ambiente com sucesso:

1. **Explore a documentação**: Leia os guias em `docs/02_guias_como_fazer/`
2. **Entenda a arquitetura**: Consulte `docs/03_explicacoes/01ArquiteturaGeral.md`
3. **Veja as funcionalidades**: Confira `docs/04_referencias/05_funcionalidades_implementadas.md`
4. **Contribua**: Consulte o `docs/progresso.md` para ver o que está sendo trabalhado

## Contato e Suporte

Para dúvidas ou problemas:
1. Verificar este guia primeiro
2. Consultar documentação oficial das tecnologias
3. Verificar issues no repositório GitHub
4. Contatar a equipe de desenvolvimento

---

**Última atualização**: 25/08/2025
**Versão do guia**: 2.0

