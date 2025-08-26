# Documentação de Configurações de Ambiente e Dependências - Projeto GiroPro

Este documento detalha as configurações de ambiente e as dependências necessárias para o desenvolvimento, execução e implantação do projeto GiroPro. O projeto é dividido em duas partes principais: um backend (API) e um frontend (aplicativo móvel/web).

## 1. Visão Geral do Projeto

O GiroPro é uma aplicação desenvolvida para a gestão financeira de motoristas de aplicativo, auxiliando no controle de ganhos, despesas e outras informações relevantes para a sua atividade profissional.

## 2. Estrutura do Repositório

O repositório `GiroPro` possui a seguinte estrutura de diretórios relevante para a configuração do ambiente:

- `backend/`: Contém o código-fonte do servidor (API).
- `frontend/`: Contém o código-fonte do aplicativo cliente.
- `docker-compose.yml`: Arquivo de configuração para orquestração de contêineres Docker.
- `docs/`: Documentação adicional do projeto.
- `scripts/`: Scripts de auxílio para configuração e execução.




## 3. Configurações do Backend

O backend do GiroPro é construído utilizando Node.js e TypeScript, fornecendo uma API RESTful para comunicação com o frontend e persistência de dados.

### 3.1. Tecnologias e Dependências

As principais tecnologias e bibliotecas utilizadas no backend são:

- **Linguagem:** TypeScript (compilado para JavaScript)
- **Framework Web:** Express.js
- **ORM (Object-Relational Mapping):** Drizzle ORM
- **Testes:** Jest
- **Validação de Esquemas:** Zod

As dependências detalhadas podem ser encontradas no arquivo `backend/package.json`. Algumas das dependências notáveis incluem:

- `@types/better-sqlite3`: Tipagens para SQLite.
- `@types/ioredis`: Tipagens para IORedis.
- `bcrypt`: Biblioteca para hash de senhas, garantindo a segurança das credenciais dos usuários.
- `camelcase-keys`: Utilitário para converter chaves de objetos para camelCase.
- `compression`: Middleware para compressão de respostas HTTP, melhorando a performance.
- `cors`: Middleware para habilitar o Cross-Origin Resource Sharing (CORS), permitindo requisições de diferentes origens.
- `date-fns`: Biblioteca moderna para manipulação de datas e horas.
- `dotenv`: Carrega variáveis de ambiente de um arquivo `.env` para `process.env`, essencial para configurações sensíveis.
- `drizzle-orm`: ORM para interagir com o banco de dados de forma programática.
- `express`: Framework web rápido, flexível e minimalista para Node.js.
- `express-rate-limit`: Middleware para limitar o número de requisições por IP em um determinado período, prevenindo ataques de força bruta e DoS.
- `express-slow-down`: Middleware para atrasar respostas a requisições excessivas, complementando o rate limiting.
- `fastify`: Framework web alternativo, de alto desempenho, utilizado em algumas partes ou para testes.
- `fastify-type-provider-zod`: Integração entre Fastify e Zod para validação de tipos.
- `helmet`: Coleção de middlewares para configurar cabeçalhos HTTP relacionados à segurança da aplicação.
- `ioredis`: Cliente Redis de alto desempenho para Node.js, utilizado para caching ou gerenciamento de sessões.
- `jsonwebtoken`: Implementação de JSON Web Tokens (JWT) para autenticação e autorização.
- `pg`: Driver PostgreSQL para Node.js, permitindo a conexão e interação com o banco de dados PostgreSQL.
- `ts-node`: Executa arquivos TypeScript diretamente no Node.js, útil para desenvolvimento.
- `typescript`: Superset de JavaScript que adiciona tipagem estática.
- `uuid`: Geração de UUIDs (Universally Unique Identifiers).
- `zod`: Biblioteca de declaração e validação de esquemas com foco em inferência de tipos.

### 3.2. Scripts de Execução (backend/package.json)

- `start`: `node dist/app.js` - Inicia a aplicação em modo de produção.
- `dev`: `nodemon src/app.ts` - Inicia a aplicação em modo de desenvolvimento com recarregamento automático.
- `build`: `tsc` - Compila o código TypeScript para JavaScript.
- `db:generate`: `drizzle-kit generate` - Gera migrações do banco de dados com Drizzle ORM.
- `db:migrate`: `drizzle-kit push` - Aplica as migrações ao banco de dados.
- `db:check`: `drizzle-kit check` - Verifica a consistência do esquema do banco de dados.
- `db:studio`: `drizzle-kit studio` - Inicia a interface de estúdio do Drizzle ORM.
- `test`: `jest` - Executa todos os testes unitários e de integração.
- `test:watch`: `jest --watch` - Executa testes e os observa para mudanças.
- `test:coverage`: `jest --coverage` - Executa testes e gera um relatório de cobertura de código.
- `test:integration`: `jest --testPathPattern=integration` - Executa apenas testes de integração.
- `test:e2e`: `jest --testPathPattern=e2e` - Executa apenas testes end-to-end.
- `test:ci`: `jest --ci --coverage --watchAll=false` - Executa testes para integração contínua.
- `lint`: `eslint src --ext .ts` - Executa o linter para verificar a qualidade do código.
- `format`: `prettier --write "src/**/*.ts"` - Formata o código automaticamente.




## 4. Configurações do Frontend

O frontend do GiroPro é um aplicativo móvel/web desenvolvido com React Native e Expo, permitindo uma experiência de usuário consistente em diferentes plataformas.

### 4.1. Tecnologias e Dependências

As principais tecnologias e bibliotecas utilizadas no frontend são:

- **Linguagem:** TypeScript (com JSX/TSX)
- **Framework:** React Native
- **Plataforma de Desenvolvimento:** Expo
- **Navegação:** React Navigation
- **Gerenciamento de Estado/Dados:** TanStack React Query
- **Testes:** Jest

As dependências detalhadas podem ser encontradas no arquivo `frontend/package.json`. Algumas das dependências notáveis incluem:

- `@expo/metro-runtime`: Runtime do Metro para Expo.
- `@react-native-async-storage/async-storage`: Armazenamento persistente assíncrono para React Native.
- `@react-native-picker/picker`: Componente de seleção (dropdown) para React Native.
- `@react-navigation/bottom-tabs`: Navegação por abas na parte inferior.
- `@react-navigation/native`: Core de navegação para React Native.
- `@react-navigation/stack`: Navegação por pilha (stack) para React Native.
- `@tanstack/react-query`: Biblioteca poderosa para gerenciamento de estado assíncrono, caching e sincronização de dados.
- `axios`: Cliente HTTP baseado em Promises para fazer requisições a APIs.
- `expo`: Framework e plataforma para construir aplicativos universais React Native.
- `expo-status-bar`: Componente para controlar a barra de status do dispositivo.
- `react`: Biblioteca JavaScript para construir interfaces de usuário.
- `react-dom`: Pacote para renderização do React para a web.
- `react-native`: Framework para construir aplicativos móveis nativos usando React.
- `react-native-gesture-handler`: Sistema declarativo para lidar com gestos no React Native.
- `react-native-safe-area-context`: Utilitário para lidar com áreas seguras em dispositivos com entalhes ou barras de sistema.
- `react-native-screens`: Otimiza o uso de telas em aplicativos React Native.
- `react-native-web`: Executa componentes React Native na web.
- `react-native-reanimated`: Biblioteca para animações e interações baseadas em gestos de alto desempenho.

### 4.2. Scripts de Execução (frontend/package.json)

- `start`: `expo start` - Inicia o servidor de desenvolvimento do Expo.
- `android`: `expo run:android` - Constrói e executa o aplicativo no emulador/dispositivo Android.
- `ios`: `expo run:ios` - Constrói e executa o aplicativo no simulador/dispositivo iOS.
- `web`: `expo start --web` - Inicia o aplicativo no navegador web.
- `test`: `jest` - Executa todos os testes unitários e de integração.
- `test:watch`: `jest --watch` - Executa testes e os observa para mudanças.
- `test:coverage`: `jest --coverage` - Executa testes e gera um relatório de cobertura de código.
- `test:ci`: `jest --ci --coverage --watchAll=false` - Executa testes para integração contínua.




## 5. Banco de Dados e Orquestração

O projeto GiroPro utiliza PostgreSQL como banco de dados e Docker/Docker Compose para orquestração dos serviços.

### 5.1. Banco de Dados

- **Tipo:** PostgreSQL
- **Versão:** `16-alpine` (conforme `docker-compose.yml`)
- **Nome do Banco de Dados (padrão):** `giropro_db`
- **Usuário (padrão):** `user`
- **Senha (padrão):** `password`

O banco de dados é configurado para persistir os dados em um volume Docker (`postgres_data`), garantindo que os dados não sejam perdidos ao reiniciar os contêineres.

### 5.2. Orquestração com Docker Compose

O arquivo `docker-compose.yml` define os serviços necessários para rodar o projeto:

- `postgres_db`: Contêiner do banco de dados PostgreSQL.

**Exemplo de `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  postgres_db:
    image: postgres:16-alpine
    container_name: giropro_postgres_db
    environment:
      POSTGRES_DB: giropro_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d giropro_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## 6. Requisitos de Ambiente

Para configurar e executar o projeto GiroPro, os seguintes softwares e ferramentas são necessários:

- **Node.js:** Versão 18.x ou superior (recomendado para compatibilidade com as dependências do projeto).
- **npm** ou **Yarn:** Gerenciadores de pacotes para Node.js. O `package-lock.json` indica que `npm` é o gerenciador de pacotes padrão.
- **Docker:** Para a execução do banco de dados PostgreSQL e, opcionalmente, para conteinerizar o backend.
- **Docker Compose:** Ferramenta para definir e executar aplicativos Docker multi-contêineres.
- **Expo CLI:** Ferramenta de linha de comando para desenvolvimento com Expo/React Native.
- **Git:** Para clonar o repositório do projeto.




## 7. Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto GiroPro em seu ambiente local.

### 7.1. Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/) (versão 18.x ou superior, que inclui o npm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclui Docker Engine e Docker Compose)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

### 7.2. Passos para Configuração

1. **Clonar o Repositório:**

   Abra seu terminal ou prompt de comando e execute:
   ```bash
   git clone https://github.com/fwagnersilva/GiroPro.git
   cd GiroPro
   ```

2. **Configurar o Banco de Dados com Docker Compose:**

   Navegue até o diretório raiz do projeto (`GiroPro`) e inicie o contêiner do PostgreSQL:
   ```bash
   docker-compose up -d postgres_db
   ```
   Aguarde alguns segundos para que o banco de dados seja inicializado completamente. Você pode verificar o status com `docker-compose ps`.

3. **Configurar e Iniciar o Backend:**

   Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
   Instale as dependências:
   ```bash
   npm install
   ```
   Crie um arquivo `.env` na raiz do diretório `backend` com as variáveis de ambiente necessárias. Um exemplo pode ser:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/giropro_db"
   JWT_SECRET="seu_segredo_jwt_aqui"
   PORT=3000
   ```
   *Ajuste `DATABASE_URL` se seu banco de dados não estiver rodando em `localhost:5432` ou se as credenciais forem diferentes.*

   Execute as migrações do banco de dados para criar as tabelas:
   ```bash
   npm run db:migrate
   ```
   Inicie o servidor backend em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   O backend estará disponível em `http://localhost:3000` (ou na porta configurada).

4. **Configurar e Iniciar o Frontend:**

   Abra um novo terminal e navegue até o diretório do frontend:
   ```bash
   cd ../frontend
   ```
   Instale as dependências:
   ```bash
   npm install
   ```
   Inicie o aplicativo Expo:
   ```bash
   expo start
   ```
   Isso abrirá uma página no seu navegador com opções para abrir o aplicativo em um emulador Android/iOS, no seu dispositivo físico (usando o aplicativo Expo Go) ou no navegador web.

## 8. Considerações Finais

Esta documentação visa fornecer um guia completo para a configuração e execução do projeto GiroPro. Em caso de dúvidas ou problemas, consulte a documentação oficial das tecnologias envolvidas (Node.js, Express, Drizzle, React Native, Expo, Docker, PostgreSQL) ou os arquivos de script e configuração presentes no repositório.



