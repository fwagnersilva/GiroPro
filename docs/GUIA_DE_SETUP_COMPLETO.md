# Guia de Setup Completo




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
npm test

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



# Tutorial: Setup Inicial do Ambiente de Desenvolvimento do GiroPro

Este tutorial guiará você através do processo de configuração e execução do projeto GiroPro (backend e frontend) em sua máquina local. Ao final, você terá um ambiente de desenvolvimento funcional, pronto para codificar.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

*   **Node.js**: Versão LTS (Long Term Support) recomendada. [Download Node.js](https://nodejs.org/en/download/)
*   **npm**: Gerenciador de pacotes do Node.js (geralmente vem com o Node.js).
*   **Git**: Sistema de controle de versão. [Download Git](https://git-scm.com/downloads)
*   **VS Code (ou IDE de sua preferência)**: Editor de código. [Download VS Code](https://code.visualstudio.com/)

### Extensões VS Code Recomendadas
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- SQLite Viewer
- React Native Tools

## 2. Clonagem do Repositório

Primeiro, clone o repositório do GiroPro para sua máquina local. Abra seu terminal ou prompt de comando e execute:

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

## 3. Configuração e Execução do Backend

O backend do GiroPro é desenvolvido em TypeScript com Express.js e Drizzle ORM.

### 3.1. Instalação de Dependências

Navegue até o diretório do backend e instale as dependências:

```bash
cd backend
npm install
```

### 3.2. Configuração do Banco de Dados (SQLite para Desenvolvimento)

Para desenvolvimento local, o GiroPro utiliza SQLite, que é um banco de dados baseado em arquivo e não requer um servidor separado. O arquivo do banco de dados (`giropro.db`) será criado automaticamente.

Execute o script de setup do SQLite para garantir que o banco de dados esteja pronto e as migrações sejam aplicadas:

```bash
./setup_sqlite.sh
```

**Nota sobre Interatividade**: O script `setup_sqlite.sh` pode ser interativo, especialmente durante migrações que envolvem renomeação de colunas ou alterações que podem causar perda de dados. Siga as instruções no terminal e confirme as ações quando solicitado.

### 3.3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis. Você pode copiar o arquivo de exemplo `giropro.env` como base:

```bash
cp giropro.env .env
```

Edite o arquivo `.env` e preencha as variáveis. Para desenvolvimento local com SQLite, as principais são:

```dotenv
# Banco de Dados
DB_TYPE=sqlite
SQLITE_DB_PATH=./giropro.db

# Autenticação
JWT_SECRET=sua_chave_secreta_muito_forte_aqui # **MUDE ISSO EM PRODUÇÃO!**
# Para gerar uma chave forte, você pode usar: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"
JWT_EXPIRES_IN=7d

# Cache (opcional para desenvolvimento local)
REDIS_URL=redis://localhost:6379

# Servidor
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081
```

**Importante**: Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas!

### 3.4. Comandos de Migração do Banco de Dados

O projeto utiliza Drizzle ORM para gerenciamento do banco de dados. Os comandos disponíveis são:

```bash
# Gerar arquivos de migração baseados nas mudanças no schema
npm run db:generate

# Aplicar migrações ao banco de dados (push direto do schema)
npm run db:migrate

# Verificar o status das migrações
npm run db:check

# Abrir o Drizzle Studio para visualizar/editar dados
npm run db:studio
```

**Nota**: O comando `npm run db:migrate` utiliza `drizzle-kit push`, que aplica as mudanças do schema diretamente ao banco sem gerar arquivos de migração. Para ambientes de produção, considere usar `drizzle-kit migrate` com arquivos de migração gerados.

### 3.5. Iniciando o Servidor Backend

Com as dependências instaladas e o `.env` configurado, você pode iniciar o servidor backend:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta que você configurou no `.env`).

## 4. Configuração e Execução do Frontend

O frontend do GiroPro é desenvolvido em React Native com Expo.

### 4.1. Instalação de Dependências

Abra um **novo terminal** (mantenha o backend rodando no primeiro) e navegue até o diretório do frontend. Instale as dependências:

```bash
cd ../frontend # Se você ainda estiver no diretório \'backend\'
npm install
```

### 4.2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `frontend` (se não existir):

```bash
# Se houver um arquivo de exemplo, copie-o
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API do backend:

```dotenv
REACT_APP_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 4.3. Iniciando o Servidor Frontend

Com as dependências instaladas e o `.env` configurado, você pode iniciar o servidor de desenvolvimento:

```bash
# Para desenvolvimento web
npm run web

# Ou para iniciar o Expo (todas as plataformas)
npm start
```

**Para desenvolvimento web**: Use `npm run web` para abrir diretamente no navegador.

**Para desenvolvimento mobile**: Use `npm start` para abrir o Expo Dev Tools, onde você pode:
*   **Escanear o QR Code** com o aplicativo Expo Go no seu celular (iOS ou Android)
*   Pressionar `w` no terminal para abrir a **versão web**
*   Pressionar `a` para abrir no **emulador Android** ou `i` para abrir no **simulador iOS**

## 5. Verificação Final

Após iniciar ambos os servidores (backend e frontend), verifique se a aplicação está funcionando corretamente:

1.  Acesse a aplicação frontend (via web ou dispositivo/emulador).
2.  Tente realizar um **registro de novo usuário**.
3.  Faça o **login** com o usuário recém-criado.
4.  Navegue pelas telas para garantir que os dados estão sendo carregados do backend.

Se você encontrar algum problema, consulte a seção de Troubleshooting Básico abaixo.

## 6. Troubleshooting Básico

### 6.1. Problemas Comuns do Backend

*   **Erros de Compilação TypeScript**: Se `npm run dev` apresentar erros de TypeScript:
    *   Verifique se todas as dependências foram instaladas: `npm install`
    *   Consulte o guia [Como Resolver Erros de Compilação](../02_guias_como_fazer/05ComoResolverErrosCompilacao.md)
    *   Problemas comuns incluem incompatibilidade de tipos entre Drizzle ORM e Zod

*   **Problemas de Migração**: Se o script `setup_sqlite.sh` falhar:
    *   Certifique-se de que o arquivo `giropro.env` existe
    *   Verifique se as dependências do SQLite foram instaladas: `npm install better-sqlite3`
    *   Consulte o guia [Como Realizar Migração de Banco de Dados](../02_guias_como_fazer/02ComoRealizarMigracaoBancoDados.md)

### 6.2. Problemas Comuns do Frontend

*   **Porta já em uso**: Se o frontend não iniciar devido a uma porta já em uso:
    *   Tente usar uma porta diferente: `npm run web -- --port 8082`
    *   Identifique e encerre o processo: `lsof -i :8081` (Linux/macOS) ou `netstat -ano | findstr :8081` (Windows)

*   **Erro de conexão com API**: Se o frontend não conseguir se comunicar com o backend:
    *   Verifique se o backend está rodando em `http://localhost:3000`
    *   Confirme se `REACT_APP_API_URL` e `EXPO_PUBLIC_API_URL` estão corretos no `.env`
    *   Verifique se o CORS está configurado corretamente no backend

### 6.3. Problemas Gerais

*   **Erros de Dependência**: Se `npm install` falhar:
    *   Limpe o cache: `npm cache clean --force`
    *   Remova e reinstale: `rm -rf node_modules package-lock.json && npm install`
    *   Verifique se está usando a versão correta do Node.js (LTS recomendada)

*   **Problemas de Permissão**: No Linux/macOS, se houver problemas de permissão:
    *   Torne o script executável: `chmod +x setup_sqlite.sh`
    *   Evite usar `sudo` com npm; configure o npm para usar um diretório local

## 7. Próximos Passos

Após configurar o ambiente com sucesso:

1.  **Explore a documentação**: Leia os guias em `docs/02_guias_como_fazer/` para entender como trabalhar com o projeto
2.  **Entenda a arquitetura**: Consulte `docs/03_explicacoes/01ArquiteturaGeral.md`
3.  **Veja as funcionalidades**: Confira `docs/04_referencias/05_funcionalidades_implementadas.md`
4.  **Contribua**: Consulte o `docs/progresso.md` para ver o que está sendo trabalhado

Parabéns! Seu ambiente de desenvolvimento GiroPro está configurado e pronto para uso.




## 3.3.1. Boas Práticas e Detalhes do Arquivo `.env`

O arquivo `.env` é crucial para a configuração do ambiente, pois armazena variáveis de ambiente sensíveis e específicas de cada instalação (desenvolvimento, teste, produção). É fundamental que este arquivo **NUNCA seja versionado** no controle de código (Git), por isso ele deve ser listado no `.gitignore`.

### Estrutura e Exemplos

As variáveis no `.env` são pares chave-valor. O GiroPro utiliza as seguintes categorias de variáveis:

*   **Banco de Dados**: Define o tipo de banco de dados e seu caminho/conexão.
*   **Autenticação**: Chaves secretas para JWT (JSON Web Tokens) e tempo de expiração.
*   **Cache**: Configurações para serviços de cache como Redis.
*   **Servidor**: Porta de execução e ambiente (desenvolvimento, produção).
*   **CORS**: Origens permitidas para requisições cross-origin.

**Exemplo de `.env` para Desenvolvimento Local (SQLite)**:

```dotenv
# Configurações do Banco de Dados
DB_TYPE=sqlite
SQLITE_DB_PATH=./giropro.db

# Configurações de Autenticação (JWT)
JWT_SECRET=suaChaveSecretaMuitoForteAqui # **MUDE ISSO EM PRODUÇÃO!**
# Dica: Para gerar uma chave segura, use: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"
JWT_EXPIRES_IN=7d

# Configurações de Cache (Opcional para Desenvolvimento)
REDIS_URL=redis://localhost:6379

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações de CORS (Cross-Origin Resource Sharing)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081
```

### Geração de Chaves Secretas

Para `JWT_SECRET`, é altamente recomendável gerar uma chave aleatória e forte para cada ambiente. A documentação sugere o uso de `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"`. Execute este comando no seu terminal e substitua `suaChaveSecretaMuitoForteAqui` pelo valor gerado.

### Importância do `.gitignore`

Certifique-se de que a linha `.env` esteja presente no arquivo `.gitignore` na raiz do seu projeto. Isso impede que o arquivo `.env` seja acidentalmente enviado para o repositório Git, protegendo suas credenciais e configurações sensíveis.

```
# .gitignore
.env
node_modules
build
dist
...
```

Ao seguir estas práticas, você garante um ambiente de desenvolvimento seguro e consistente, facilitando a colaboração e a implantação em diferentes ambientes.





**Nota sobre Interatividade**: O script `setup_sqlite.sh` pode ser interativo, especialmente durante migrações que envolvem renomeação de colunas ou alterações que podem causar perda de dados. Siga as instruções no terminal e confirme as ações quando solicitado. O comando `npm run db:migrate` também é interativo e pode solicitar confirmação.




## 6. Troubleshooting Básico

### 6.1. Problemas Comuns do Backend

*   **Erros de Compilação TypeScript**: Se `npm run dev` apresentar erros de TypeScript:
    *   Verifique se todas as dependências foram instaladas: `npm install`
    *   Consulte o guia [Como Resolver Erros de Compilação](../02_guias_como_fazer/05ComoResolverErrosCompilacao.md)
    *   Problemas comuns incluem incompatibilidade de tipos entre Drizzle ORM e Zod

*   **Problemas de Migração**: Se o script `setup_sqlite.sh` falhar:
    *   Certifique-se de que o arquivo `giropro.env` existe
    *   Verifique se as dependências do SQLite foram instaladas: `npm install better-sqlite3`
    *   Consulte o guia [Como Realizar Migração de Banco de Dados](../02_guias_como_fazer/02ComoRealizarMigracaoBancoDados.md)

### 6.2. Problemas Comuns do Frontend

*   **Porta já em uso**: Se o frontend não iniciar devido a uma porta já em uso:
    *   Tente usar uma porta diferente: `npm run web -- --port 8082`
    *   Identifique e encerre o processo: `lsof -i :8081` (Linux/macOS) ou `netstat -ano | findstr :8081` (Windows)

*   **Erro de conexão com API**: Se o frontend não conseguir se comunicar com o backend:
    *   Verifique se o backend está rodando em `http://localhost:3000`
    *   Confirme se `REACT_APP_API_URL` e `EXPO_PUBLIC_API_URL` estão corretos no `.env`
    *   Verifique se o CORS está configurado corretamente no backend

### 6.3. Problemas Gerais

*   **Erros de Dependência**: Se `npm install` falhar:
    *   Limpe o cache: `npm cache clean --force`
    *   Remova e reinstale: `rm -rf node_modules package-lock.json && npm install`
    *   Verifique se está usando a versão correta do Node.js (LTS recomendada)

*   **Problemas de Permissão**: No Linux/macOS, se houver problemas de permissão:
    *   Torne o script executável: `chmod +x setup_sqlite.sh`
    *   Evite usar `sudo` com npm; configure o npm para usar um diretório local

## 7. Próximos Passos

Após configurar o ambiente com sucesso:

1.  **Explore a documentação**: Leia os guias em `docs/02_guias_como_fazer/` para entender como trabalhar com o projeto
2.  **Entenda a arquitetura**: Consulte `docs/03_explicacoes/01ArquiteturaGeral.md`
3.  **Veja as funcionalidades**: Confira `docs/04_referencias/05_funcionalidades_implementadas.md`
4.  **Contribua**: Consulte o `docs/progresso.md` para ver o que está sendo trabalhado

Parabéns! Seu ambiente de desenvolvimento GiroPro está configurado e pronto para uso.

## 3. Checklist de Setup Rápido para Desenvolvedores

Para agilizar o processo de setup e garantir que você não perca tempo com problemas comuns, siga este checklist antes e durante a execução dos scripts de setup:

### Antes de Clonar o Repositório:

- Instalar Pré-requisitos: Certifique-se de ter Node.js (LTS), npm, Git e Docker/Docker Compose (se for usar PostgreSQL) instalados e configurados. Consulte 01_tutoriais/01_setup_inicial.md.

### Após Clonar o Repositório (cd GiroPro):

- Navegar para o Backend: cd backend
- Instalar Dependências do Backend: npm install
- Configurar .env do Backend: Copie giropro.env para .env (cp giropro.env .env) e edite o arquivo .env com suas configurações (especialmente DB_TYPE=sqlite para desenvolvimento local).
- Executar Setup do SQLite: ./setup_sqlite.sh (este script pode ser interativo, esteja pronto para confirmar).
- Iniciar Backend: npm run dev (verifique se o servidor inicia sem erros).

### Em um Novo Terminal (para o Frontend):

- Navegar para o Frontend: cd ../frontend
- Instalar Dependências do Frontend: npm install
- Configurar .env do Frontend: Copie .env.example para .env (cp .env.example .env) e configure REACT_APP_API_URL para http://localhost:3000/api/v1.
- Iniciar Frontend: npm start (verifique se o Expo Dev Tools abre no navegador).

### Verificação Final:

- Testar Fluxo de Login/Registro: Tente registrar um novo usuário e fazer login na aplicação frontend.
- Verificar Dados: Navegue pelas telas para garantir que os dados estão sendo carregados do backend (ex: dashboard, cadastro de veículo).
- Executar verify_setup.sh: Volte para o diretório raiz do projeto (cd ..) e execute ./verify_setup.sh para uma verificação rápida da estrutura.




## 6. Troubleshooting Básico

### 6.1. Problemas Comuns do Backend

*   **Erros de Compilação TypeScript**: Se `npm run dev` apresentar erros de TypeScript:
    *   Verifique se todas as dependências foram instaladas: `npm install`
    *   Consulte o guia [Como Resolver Erros de Compilação](../02_guias_como_fazer/05ComoResolverErrosCompilacao.md)
    *   Problemas comuns incluem incompatibilidade de tipos entre Drizzle ORM e Zod

*   **Problemas de Migração**: Se o script `setup_sqlite.sh` falhar:
    *   Certifique-se de que o arquivo `giropro.env` existe
    *   Verifique se as dependências do SQLite foram instaladas: `npm install better-sqlite3`
    *   Consulte o guia [Como Realizar Migração de Banco de Dados](../02_guias_como_fazer/02ComoRealizarMigracaoBancoDados.md)

### 6.2. Problemas Comuns do Frontend

*   **Porta já em uso**: Se o frontend não iniciar devido a uma porta já em uso:
    *   Tente usar uma porta diferente: `npm run web -- --port 8082`
    *   Identifique e encerre o processo: `lsof -i :8081` (Linux/macOS) ou `netstat -ano | findstr :8081` (Windows)

*   **Erro de conexão com API**: Se o frontend não conseguir se comunicar com o backend:
    *   Verifique se o backend está rodando em `http://localhost:3000`
    *   Confirme se `REACT_APP_API_URL` e `EXPO_PUBLIC_API_URL` estão corretos no `.env`
    *   Verifique se o CORS está configurado corretamente no backend

### 6.3. Problemas Gerais

*   **Erros de Dependência**: Se `npm install` falhar:
    *   Limpe o cache: `npm cache clean --force`
    *   Remova e reinstale: `rm -rf node_modules package-lock.json && npm install`
    *   Verifique se está usando a versão correta do Node.js (LTS recomendada)

*   **Problemas de Permissão**: No Linux/macOS, se houver problemas de permissão:
    *   Torne o script executável: `chmod +x setup_sqlite.sh`
    *   Evite usar `sudo` com npm; configure o npm para usar um diretório local

## 7. Próximos Passos

Após configurar o ambiente com sucesso:

1.  **Explore a documentação**: Leia os guias em `docs/02_guias_como_fazer/` para entender como trabalhar com o projeto
2.  **Entenda a arquitetura**: Consulte `docs/03_explicacoes/01ArquiteturaGeral.md`
3.  **Veja as funcionalidades**: Confira `docs/04_referencias/05_funcionalidades_implementadas.md`
4.  **Contribua**: Consulte o `docs/progresso.md` para ver o que está sendo trabalhado

Parabéns! Seu ambiente de desenvolvimento GiroPro está configurado e pronto para uso.

## 3. Checklist de Setup Rápido para Desenvolvedores

Para agilizar o processo de setup e garantir que você não perca tempo com problemas comuns, siga este checklist antes e durante a execução dos scripts de setup:

### Antes de Clonar o Repositório:

- Instalar Pré-requisitos: Certifique-se de ter Node.js (LTS), npm, Git e Docker/Docker Compose (se for usar PostgreSQL) instalados e configurados. Consulte 01_tutoriais/01_setup_inicial.md.

### Após Clonar o Repositório (cd GiroPro):

- Navegar para o Backend: cd backend
- Instalar Dependências do Backend: npm install
- Configurar .env do Backend: Copie giropro.env para .env (cp giropro.env .env) e edite o arquivo .env com suas configurações (especialmente DB_TYPE=sqlite para desenvolvimento local).
- Executar Setup do SQLite: ./setup_sqlite.sh (este script pode ser interativo, esteja pronto para confirmar).
- Iniciar Backend: npm run dev (verifique se o servidor inicia sem erros).

### Em um Novo Terminal (para o Frontend):

- Navegar para o Frontend: cd ../frontend
- Instalar Dependências do Frontend: npm install
- Configurar .env do Frontend: Copie .env.example para .env (cp .env.example .env) e configure REACT_APP_API_URL para http://localhost:3000/api/v1.
- Iniciar Frontend: npm start (verifique se o Expo Dev Tools abre no navegador).

### Verificação Final:

- Testar Fluxo de Login/Registro: Tente registrar um novo usuário e fazer login na aplicação frontend.
- Verificar Dados: Navegue pelas telas para garantir que os dados estão sendo carregados do backend (ex: dashboard, cadastro de veículo).
- Executar verify_setup.sh: Volte para o diretório raiz do projeto (cd ..) e execute ./verify_setup.sh para uma verificação rápida da estrutura.




## 6. Troubleshooting Básico

### 6.1. Problemas Comuns do Backend

*   **Erros de Compilação TypeScript**: Se `npm run dev` apresentar erros de TypeScript:
    *   Verifique se todas as dependências foram instaladas: `npm install`
    *   Consulte o guia [Como Resolver Erros de Compilação](../02_guias_como_fazer/05ComoResolverErrosCompilacao.md)
    *   Problemas comuns incluem incompatibilidade de tipos entre Drizzle ORM e Zod

*   **Problemas de Migração**: Se o script `setup_sqlite.sh` falhar:
    *   Certifique-se de que o arquivo `giropro.env` existe
    *   Verifique se as dependências do SQLite foram instaladas: `npm install better-sqlite3`
    *   Consulte o guia [Como Realizar Migração de Banco de Dados](../02_guias_como_fazer/02ComoRealizarMigracaoBancoDados.md)

### 6.2. Problemas Comuns do Frontend

*   **Porta já em uso**: Se o frontend não iniciar devido a uma porta já em uso:
    *   Tente usar uma porta diferente: `npm run web -- --port 8082`
    *   Identifique e encerre o processo: `lsof -i :8081` (Linux/macOS) ou `netstat -ano | findstr :8081` (Windows)

*   **Erro de conexão com API**: Se o frontend não conseguir se comunicar com o backend:
    *   Verifique se o backend está rodando em `http://localhost:3000`
    *   Confirme se `REACT_APP_API_URL` e `EXPO_PUBLIC_API_URL` estão corretos no `.env`
    *   Verifique se o CORS está configurado corretamente no backend

### 6.3. Problemas Gerais

*   **Erros de Dependência**: Se `npm install` falhar:
    *   Limpe o cache: `npm cache clean --force`
    *   Remova e reinstale: `rm -rf node_modules package-lock.json && npm install`
    *   Verifique se está usando a versão correta do Node.js (LTS recomendada)

*   **Problemas de Permissão**: No Linux/macOS, se houver problemas de permissão:
    *   Torne o script executável: `chmod +x setup_sqlite.sh`
    *   Evite usar `sudo` com npm; configure o npm para usar um diretório local


