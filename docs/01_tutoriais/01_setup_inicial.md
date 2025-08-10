# Tutorial: Setup Inicial do Ambiente de Desenvolvimento do GiroPro

Este tutorial guiará você através do processo de configuração e execução do projeto GiroPro (backend e frontend) em sua máquina local. Ao final, você terá um ambiente de desenvolvimento funcional, pronto para codificar.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

*   **Node.js**: Versão LTS (Long Term Support) recomendada. [Download Node.js](https://nodejs.org/en/download/)
*   **npm**: Gerenciador de pacotes do Node.js (geralmente vem com o Node.js).
*   **Git**: Sistema de controle de versão. [Download Git](https://git-scm.com/downloads)
*   **Docker e Docker Compose**: Para gerenciar o banco de dados PostgreSQL (opcional, mas recomendado para produção). [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   **VS Code (ou IDE de sua preferência)**: Editor de código. [Download VS Code](https://code.visualstudio.com/)

## 2. Clonagem do Repositório

Primeiro, clone o repositório do GiroPro para sua máquina local. Abra seu terminal ou prompt de comando e execute:

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

## 3. Configuração e Execução do Backend

O backend do GiroPro é desenvolvido em TypeScript com Fastify e Drizzle ORM.

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
npm run db:migrate
```

*   **Nota Importante**: O comando `npm run db:migrate` pode ser interativo, solicitando confirmação para renomeação de colunas ou outras operações. Fique atento às mensagens no terminal e confirme as ações quando solicitado. Para um ambiente de CI/CD ou automação, considere a criação de um script não interativo ou a utilização de ferramentas que gerenciem migrações de forma programática.

*   **PostgreSQL para Desenvolvimento Local**: Se você preferir usar PostgreSQL para desenvolvimento local (mais próximo do ambiente de produção), você precisará configurar um servidor PostgreSQL e ajustar as variáveis de ambiente no arquivo `.env`. Consulte o guia [Como Realizar Migração de Banco de Dados](docs/02_guias_como_fazer/02_como_realizar_migracao_banco_dados.md) para mais detalhes sobre a configuração do Drizzle ORM com PostgreSQL.

### 3.3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis. Você pode copiar o arquivo de exemplo `giropro.env` como base. **Certifique-se de que o arquivo `.env` seja adicionado ao seu `.gitignore` para evitar que suas credenciais sejam versionadas!**

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
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

### 3.4. Iniciando o Servidor Backend

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
cd ../frontend # Se você ainda estiver no diretório 'backend'
npm install
```

### 4.2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `frontend`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API do backend:

```dotenv
REACT_APP_API_URL=http://localhost:3000/api/v1
```

### 4.3. Iniciando o Servidor Frontend

Com as dependências instaladas e o `.env` configurado, você pode iniciar o servidor de desenvolvimento do Expo:

```bash
npm start
```

Isso abrirá o Expo Dev Tools no seu navegador. Você pode então:

*   **Escanear o QR Code** com o aplicativo Expo Go no seu celular (iOS ou Android) para ver a aplicação no dispositivo.
*   Pressionar `w` no terminal para abrir a **versão web** da aplicação no seu navegador.
*   Pressionar `a` para abrir no **emulador Android** ou `i` para abrir no **simulador iOS** (se configurados).

## 5. Verificação Final

Após iniciar ambos os servidores (backend e frontend), verifique se a aplicação está funcionando corretamente:

1.  Acesse a aplicação frontend (via web ou dispositivo/emulador).
2.  Tente realizar um **registro de novo usuário**.
3.  Faça o **login** com o usuário recém-criado.
4.  Navegue pelas telas para garantir que os dados estão sendo carregados do backend (ex: dashboard, cadastro de veículo).

Se você encontrar algum problema, consulte a seção de Troubleshooting Básico abaixo.

## 6. Troubleshooting Básico

*   **Porta já em uso**: Se o backend ou frontend não iniciar devido a uma porta já em uso, você pode tentar:
    *   Mudar a porta no arquivo `.env` (ex: `PORT=3001` para o backend).
    *   Identificar e encerrar o processo que está usando a porta (ex: `lsof -i :3000` no Linux/macOS, `netstat -ano | findstr :3000` no Windows).
*   **Erros de Dependência**: Se `npm install` falhar, tente:
    *   Limpar o cache do npm: `npm cache clean --force`
    *   Remover `node_modules` e `package-lock.json` e tentar novamente: `rm -rf node_modules package-lock.json && npm install`
*   **Erros de Compilação TypeScript**: Se `npm run dev` (backend) ou `npm start` (frontend) apresentar erros de TypeScript, verifique:
    *   Se todas as dependências foram instaladas corretamente.
    *   Se você está usando a versão correta do Node.js.
    *   Consulte a documentação de `Lições Aprendidas` para problemas comuns de tipagem.
*   **Backend não se comunica com Frontend**: Verifique se `REACT_APP_API_URL` no frontend `.env` aponta para a porta correta do backend (`http://localhost:3000/api/v1`).

Parabéns! Seu ambiente de desenvolvimento GiroPro está configurado e pronto para uso.

