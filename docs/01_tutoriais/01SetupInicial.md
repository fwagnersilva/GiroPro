# Tutorial: Setup Inicial do Ambiente de Desenvolvimento do GiroPro

Este tutorial guiará você através do processo de configuração e execução do projeto GiroPro (backend e frontend) em sua máquina local. Ao final, você terá um ambiente de desenvolvimento funcional, pronto para codificar.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

*   **Node.js**: Versão LTS (Long Term Support) recomendada. [Download Node.js](https://nodejs.org/en/download/)
*   **npm**: Gerenciador de pacotes do Node.js (geralmente vem com o Node.js).
*   **Git**: Sistema de controle de versão. [Download Git](https://git-scm.com/downloads)
*   **VS Code (ou IDE de sua preferência)**: Editor de código. [Download VS Code](https://code.visualstudio.com/)

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
# Para gerar uma chave forte, você pode usar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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
cd ../frontend # Se você ainda estiver no diretório 'backend'
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
# Dica: Para gerar uma chave segura, use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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

Para `JWT_SECRET`, é altamente recomendável gerar uma chave aleatória e forte para cada ambiente. A documentação sugere o uso de `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Execute este comando no seu terminal e substitua `suaChaveSecretaMuitoForteAqui` pelo valor gerado.

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

