# Guia de Setup Completo - GiroPro

## Visão Geral

O GiroPro é uma aplicação para gestão financeira de motoristas de aplicativo, composta por:
- **Backend**: API REST em Node.js/TypeScript com Express.js
- **Frontend**: Aplicação React Native/Expo (Web, iOS, Android)
- **Banco de Dados**: SQLite em memória (desenvolvimento) / PostgreSQL (produção)

## Pré-requisitos

### Ferramentas Necessárias
- **Node.js**: versão 18+ (recomendado: 20.x)
- **pnpm**: Gerenciador de pacotes para Node.js (utilizado no projeto)
- **Git**: para controle de versão
- **Docker**: Para a execução do banco de dados PostgreSQL e, opcionalmente, para conteinerizar o backend.
- **Docker Compose**: Ferramenta para definir e executar aplicativos Docker multi-contêineres.
- **Expo CLI**: Ferramenta de linha de comando para desenvolvimento com Expo/React Native.
- **Editor de código**: VS Code (recomendado)

### Extensões VS Code Recomendadas
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- React Native Tools

## Configuração do Ambiente

### 1. Clonagem do Repositório

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

### 2. Configuração do Banco de Dados

O projeto GiroPro suporta múltiplas opções de banco de dados:

#### Opção 1: SQLite em Memória (Recomendado para Desenvolvimento)
- **Vantagens**: Rápido, sem configuração adicional, ideal para testes
- **Desvantagens**: Dados não persistem entre reinicializações
- **Configuração**: Já configurado por padrão

#### Opção 2: PostgreSQL (Produção)
- **Vantagens**: Dados persistentes, robusto, escalável
- **Configuração**: Requer Docker/PostgreSQL instalado

**Para desenvolvimento rápido, use SQLite em memória (padrão atual).**

### 3. Configuração do Backend

O backend do GiroPro é construído utilizando Node.js e TypeScript, fornecendo uma API RESTful para comunicação com o frontend e persistência de dados.

#### 3.1. Instalação das Dependências
```bash
cd backend
pnpm install
```

#### 3.2. Configuração do Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as variáveis de ambiente necessárias:

**Para desenvolvimento com SQLite em memória (padrão):**
```env
# Configuração do Banco de Dados
DB_TYPE=sqlite_memory
SQLITE_DB_PATH=":memory:"

# Configurações da API
JWT_SECRET="seu_segredo_jwt_aqui"
JWT_REFRESH_SECRET="seu_refresh_secret_aqui"
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006,http://localhost:8081"
```

**Para produção com PostgreSQL:**
```env
# Configuração do Banco de Dados
DB_TYPE=postgresql
DATABASE_URL="postgresql://user:password@localhost:5432/giropro_db"

# Configurações da API
JWT_SECRET="seu_segredo_jwt_aqui"
JWT_REFRESH_SECRET="seu_refresh_secret_aqui"
PORT=3000
NODE_ENV=production
LOG_LEVEL=error
ALLOWED_ORIGINS="https://seudominio.com"
```

**Importante**: Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas.

#### 3.3. Configuração do Banco de Dados

**Para SQLite em memória (desenvolvimento):**
As tabelas são criadas automaticamente na inicialização. Não são necessárias migrações.

**Para PostgreSQL (produção):**
Execute as migrações do banco de dados para criar as tabelas:
```bash
pnpm run db:migrate
```

**ATENÇÃO - Interatividade do Script**: Durante a execução de `pnpm run db:migrate`, o script pode solicitar confirmação no terminal (ex: `Is historicoPrecoCombustivel table created or renamed from another table?`). **É crucial observar o terminal e responder com `+` (para criar) ou a opção apropriada para continuar a migração.** A falta de resposta pode fazer o script parecer travado.

Comandos de migração adicionais disponíveis:
```bash
# Gerar arquivos de migração baseados nas mudanças no schema
pnpm run db:generate

# Verificar o status das migrações
pnpm run db:check

# Abrir o Drizzle Studio para visualizar/editar dados
pnpm run db:studio
```

#### 3.4. Compilação e Execução

Inicie o servidor backend em modo de desenvolvimento:
```bash
pnpm run dev
```
O backend estará disponível em `http://localhost:3000` (ou na porta configurada).

Para compilar e executar em modo de produção:
```bash
pnpm run build
pnpm start
```

### 4. Configuração do Frontend

O frontend do GiroPro é um aplicativo móvel/web desenvolvido com React Native e Expo, permitindo uma experiência de usuário consistente em diferentes plataformas.

#### 4.1. Instalação das Dependências
```bash
cd ../frontend
pnpm install
```

#### 4.2. Configuração do Ambiente

Crie um arquivo `.env` no diretório `frontend` com as seguintes variáveis, garantindo que a URL da API aponte para o backend local (porta 3000):
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**Importante**: Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas.

#### 4.3. Execução do Frontend

Para desenvolvimento web com Vite (recomendado):
```bash
pnpm run web-vite
```

Para desenvolvimento com Expo (mobile):
```bash
pnpm start

# Para Android
pnpm run android

# Para iOS
pnpm run ios
```

## Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/health` | GET | Health check |
| `/api/test` | GET | Endpoint de teste |
| `/api/v1/auth` | * | Autenticação |
| `/api/v1/users` | * | Usuários |
| `/api/v1/vehicles` | * | Veículos |
| `/api/v1/journeys` | * | Jornadas |
| `/api/v1/fuelings` | * | Abastecimentos |
| `/api/v1/expenses` | * | Despesas |
| `/api/v1/platforms` | * | Plataformas (NOVO) |

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
- [ ] pnpm instalado
- [ ] Git instalado
- [ ] Docker Desktop (inclui Docker Engine e Docker Compose) instalado
- [ ] Expo CLI instalado
- [ ] VS Code (opcional)

### Backend
- [ ] `cd backend`
- [ ] `pnpm install`
- [ ] Criar e configurar `.env`
- [ ] `pnpm run db:migrate`
- [ ] `pnpm run dev`

### Frontend
- [ ] `cd ../frontend`
- [ ] `pnpm install`
- [ ] Criar e configurar `.env`
- [ ] `pnpm run web-vite` (para web) ou `pnpm start` (para mobile)

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
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar configuração TypeScript
npx tsc --noEmit
```

**Problemas de Migração**:
```bash
# Verificar se o banco de dados Docker está rodando
docker-compose ps

# Verificar logs do contêiner do banco de dados
docker-compose logs postgres_db

# Reinstalar dependências do Drizzle ORM e driver PG
pnpm install drizzle-orm pg
```

**Porta já em uso**:
```bash
# Verificar processos na porta
netstat -tulpn | grep :3000

# Matar processo
kill -9 $(lsof -t -i:3000)
```

### Problemas Comuns do Frontend

**Porta já em uso (Vite)**:
```bash
# Usar porta diferente
pnpm run web-vite -- --port 19007
```

**Erro de conexão com API**:
- Verificar se backend está rodando
- Confirmar URLs no `.env`
- Verificar configuração CORS no backend

### Problemas Gerais

**Erros de Dependência**:
```bash
# Limpar cache e reinstalar
pnpm cache clean --force
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Problemas de Permissão** (Linux/macOS):
```bash
# Tornar script executável
chmod +x setup_sqlite.sh (se ainda usar)

# Configurar pnpm para diretório local (evitar sudo)
pnpm config set prefix ~/.pnpm-global
```

## Desenvolvimento

### Fluxo de Trabalho Recomendado
1. Criar branch para feature: `git checkout -b feature/nova-funcionalidade`
2. Fazer alterações e commits frequentes
3. Executar testes: `pnpm test`
4. Verificar lint: `pnpm run lint`
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
pnpm test

# Testes em modo watch
pnpm run test:watch

# Testes com coverage
pnpm run test:coverage

# Testes de integração
pnpm run test:integration

# Testes E2E
pnpm run test:e2e
```

## Deploy

### Preparação para Deploy
```bash
# Backend
cd backend
pnpm run build
pnpm start

# Frontend (Vite)
cd frontend
pnpm run build-vite
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
- **Docker**: https://www.docker.com/
- **PostgreSQL**: https://www.postgresql.org/

### Ferramentas de Debug
- **Drizzle Studio**: Interface visual para o banco
- **Postman/Insomnia**: Testar APIs
- **React Native Debugger**: Debug do frontend

## Próximos Passos

Após configurar o ambiente com sucesso:

1. **Explore a documentação**: Leia os guias em `docs/geral/`
2. **Entenda a arquitetura**: Consulte `docs/geral/01_arquitetura_geral.md`
3. **Veja as funcionalidades**: Confira `docs/geral/06_funcionalidades_detalhadas.md`
4. **Contribua**: Consulte o `docs/geral/08_roadmap_do_projeto.md` para ver o que está sendo trabalhado

## Contato e Suporte

Para dúvidas ou problemas:
1. Verificar este guia primeiro
2. Consultar documentação oficial das tecnologias
3. Verificar issues no repositório GitHub
4. Contatar a equipe de desenvolvimento

---

**Última atualização**: 01/10/2025
**Versão do guia**: 2.3

