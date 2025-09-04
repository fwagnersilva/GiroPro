# Guia de Setup Completo - GiroPro

## Visão Geral

O GiroPro é uma aplicação para gestão financeira de motoristas de aplicativo, composta por:
- **Backend**: API REST em Node.js/TypeScript com Express.js
- **Frontend**: Aplicação React Native/Expo
- **Banco de Dados**: PostgreSQL com Drizzle ORM

## Pré-requisitos

### Ferramentas Necessárias
- **Node.js**: versão 18+ (recomendado: 20.x)
- **npm** ou **Yarn**: Gerenciadores de pacotes para Node.js.
- **Git**: para controle de versão
- **Docker**: Para a execução do banco de dados PostgreSQL e, opcionalmente, para conteinerizar o backend.
- **Docker Compose**: Ferramenta para definir e executar aplicativos Docker multi-contêineres.
- **Expo CLI**: Ferramenta de linha de comando para desenvolvimento com Expo/React Native.
- **Editor de código**: VS Code (recomendado)

### Extensões VS Code Recomendadas
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- SQLite Viewer (se ainda usar SQLite em algum contexto)
- React Native Tools

## Configuração do Ambiente

### 1. Clonagem do Repositório

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

### 2. Configuração do Banco de Dados com Docker Compose

O projeto GiroPro utiliza PostgreSQL como banco de dados e Docker/Docker Compose para orquestração dos serviços.

- **Tipo:** PostgreSQL
- **Versão:** `16-alpine` (conforme `docker-compose.yml`)
- **Nome do Banco de Dados (padrão):** `giropro_db`
- **Usuário (padrão):** `user`
- **Senha (padrão):** `password`

O banco de dados é configurado para persistir os dados em um volume Docker (`postgres_data`), garantindo que os dados não sejam perdidos ao reiniciar os contêineres.

Navegue até o diretório raiz do projeto (`GiroPro`) e inicie o contêiner do PostgreSQL:
```bash
docker-compose up -d postgres_db
```
Aguarde alguns segundos para que o banco de dados seja inicializado completamente. Você pode verificar o status com `docker-compose ps`.

### 3. Configuração do Backend

O backend do GiroPro é construído utilizando Node.js e TypeScript, fornecendo uma API RESTful para comunicação com o frontend e persistência de dados.

#### 3.1. Instalação das Dependências
```bash
cd backend
npm install
```

#### 3.2. Configuração do Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as variáveis de ambiente necessárias. Um exemplo pode ser:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/giropro_db"
JWT_SECRET="seu_segredo_jwt_aqui"
PORT=3000
```
*Ajuste `DATABASE_URL` se seu banco de dados não estiver rodando em `localhost:5432` ou se as credenciais forem diferentes.*

**Importante**: Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas.

#### 3.3. Configuração do Banco de Dados (Migrações)

Execute as migrações do banco de dados para criar as tabelas:
```bash
npm run db:migrate
```

**ATENÇÃO - Interatividade do Script**: Durante a execução de `npm run db:migrate`, o script pode solicitar confirmação no terminal (ex: `Is historicoPrecoCombustivel table created or renamed from another table?`). **É crucial observar o terminal e responder com `+` (para criar) ou a opção apropriada para continuar a migração.** A falta de resposta pode fazer o script parecer travado.

Comandos de migração adicionais disponíveis:
```bash
# Gerar arquivos de migração baseados nas mudanças no schema
npm run db:generate

# Verificar o status das migrações
npm run db:check

# Abrir o Drizzle Studio para visualizar/editar dados
npm run db:studio
```

#### 3.4. Compilação e Execução

Inicie o servidor backend em modo de desenvolvimento:
```bash
npm run dev
```
O backend estará disponível em `http://localhost:3000` (ou na porta configurada).

Para compilar e executar em modo de produção:
```bash
npm run build
npm start
```

### 4. Configuração do Frontend

O frontend do GiroPro é um aplicativo móvel/web desenvolvido com React Native e Expo, permitindo uma experiência de usuário consistente em diferentes plataformas.

#### 4.1. Instalação das Dependências
```bash
cd ../frontend
npm install
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
npm run web-vite
```

Para desenvolvimento com Expo (mobile):
```bash
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## Estrutura do Projeto

O repositório `GiroPro` possui a seguinte estrutura de diretórios relevante para a configuração do ambiente:

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

### Outros Diretórios Relevantes

- `docker-compose.yml`: Arquivo de configuração para orquestração de contêineres Docker.
- `docs/`: Documentação adicional do projeto.
- `scripts/`: Scripts de auxílio para configuração e execução.

## Scripts Disponíveis

### Backend
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Executar em modo desenvolvimento |
| `npm run build` | Compilar TypeScript |
| `npm start` | Executar versão compilada |
| `npm test` | Executar todos os testes unitários e de integração |
| `npm run test:watch` | Executar testes e os observar para mudanças |
| `npm run test:coverage` | Executar testes e gerar um relatório de cobertura de código |
| `npm run test:integration` | Executar apenas testes de integração |
| `npm run test:e2e` | Executar apenas testes end-to-end |
| `npm run test:ci` | Executar testes para integração contínua |
| `npm run lint` | Executar o linter para verificar a qualidade do código |
| `npm run format` | Formatar o código automaticamente |
| `npm run db:generate` | Gerar migrações do banco de dados com Drizzle ORM |
| `npm run db:migrate` | Aplicar as migrações ao banco de dados |
| `npm run db:check` | Verificar a consistência do esquema do banco de dados |
| `npm run db:studio` | Iniciar a interface de estúdio do Drizzle ORM |

### Frontend
| Script | Descrição |
|--------|-----------|
| `npm start` | Iniciar o servidor de desenvolvimento do Expo |
| `npm run android` | Constrói e executa o aplicativo no emulador/dispositivo Android |
| `npm run ios` | Constrói e executa o aplicativo no simulador/dispositivo iOS |
| `npm run web` | Iniciar o aplicativo no navegador web (legado) |
| `npm run web-vite` | Iniciar o aplicativo no navegador web com Vite (recomendado) |
| `npm test` | Executar todos os testes unitários e de integração |
| `npm run test:watch` | Executar testes e os observar para mudanças |
| `npm run test:coverage` | Executar testes e gerar um relatório de cobertura de código |
| `npm run test:ci` | Executar testes para integração contínua |

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
- [ ] Docker Desktop (inclui Docker Engine e Docker Compose) instalado
- [ ] Expo CLI instalado
- [ ] VS Code (opcional)

### Backend
- [ ] `cd backend`
- [ ] `npm install`
- [ ] Criar e configurar `.env`
- [ ] `npm run db:migrate`
- [ ] `npm run dev`

### Frontend
- [ ] `cd ../frontend`
- [ ] `npm install`
- [ ] Criar e configurar `.env`
- [ ] `npm run web-vite` (para web) ou `npm start` (para mobile)

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
# Verificar se o banco de dados Docker está rodando
docker-compose ps

# Verificar logs do contêiner do banco de dados
docker-compose logs postgres_db

# Reinstalar dependências do Drizzle ORM e driver PG
npm install drizzle-orm pg
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
npm run web-vite -- --port 19007
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
chmod +x setup_sqlite.sh (se ainda usar)

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

# Frontend (Vite)
cd frontend
npm run build-vite
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

**Última atualização**: 04/09/2025
**Versão do guia**: 2.1


