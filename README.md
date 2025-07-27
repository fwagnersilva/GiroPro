# 🚀 Projeto GiroPro

Bem-vindo ao repositório principal do GiroPro! Este projeto visa fornecer um aplicativo de gestão financeira robusto e intuitivo para motoristas de aplicativo, ajudando-os a otimizar seus ganhos e despesas.

Este `README.md` serve como seu guia de onboarding completo, projetado para que tanto desenvolvedores humanos quanto agentes de IA possam configurar, entender e contribuir para o projeto de forma rápida e eficiente.

## 🌟 Status do Projeto

- **Backend:** ✅ 100% COMPLETO (API robusta, segura e escalável)
- **Frontend:** ✅ FUNCIONALIDADES PRINCIPAIS IMPLEMENTADAS (login, cadastro, dashboard, gestão de abastecimentos, gestão de despesas, sistema de preços de combustível, persistência de autenticação)
- **Versão Atual:** `v0.5.0` (Refinamento da Experiência do Usuário e Implementação de Testes Automatizados)

## 🎯 Objetivos do Onboarding

Nosso objetivo é que você, seja um desenvolvedor humano ou uma IA, consiga:

1.  **Configurar o Ambiente:** Ter o projeto rodando em sua máquina local em minutos.
2.  **Entender a Estrutura:** Compreender a arquitetura e a organização do código.
3.  **Executar Testes:** Rodar os testes existentes para garantir a integridade do ambiente.
4.  **Contribuir:** Estar apto a desenvolver novas funcionalidades e corrigir bugs.

## 🛠️ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

-   **Node.js:** Versão 18.x ou superior. Recomendamos usar `nvm` para gerenciar versões.
    ```bash
    # Verificar versão do Node.js
    node -v
    ```
-   **npm:** Versão 8.x ou superior (geralmente vem com o Node.js).
    ```bash
    # Verificar versão do npm
    npm -v
    ```
-   **TypeScript:** Versão 5.x ou superior.
    ```bash
    # Verificar versão do TypeScript
    tsc -v
    ```
-   **Git:** Para clonar o repositório.
    ```bash
    # Verificar versão do Git
    git --version
    ```
-   **Docker & Docker Compose:** (Essencial para o setup automatizado do banco de dados PostgreSQL. Se você não usa Docker, consulte a seção 'Configuração Manual do Banco de Dados' abaixo.)
    ```bash
    # Verificar versão do Docker
    docker -v
    # Verificar versão do Docker Compose
    docker compose version
    ```

## 📦 Configuração do Projeto (Passo a Passo)

Siga estes passos para configurar o projeto GiroPro em seu ambiente local:

### Passo 1: Clonar o Repositório

Abra seu terminal ou prompt de comando e execute:

```bash
git clone https://github.com/GiroPro/GiroPro.git # Substitua pelo link real do seu repositório
cd GiroPro
```

### Passo 2: Configurar o Backend

O backend é construído com Node.js, Express e TypeScript, utilizando PostgreSQL como banco de dados.

1.  **Navegar para o diretório do Backend:**
    ```bash
    cd backend
    ```

2.  **Instalar Dependências:**
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `backend` com base no arquivo `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Edite o arquivo `.env` e preencha as variáveis, especialmente as de conexão com o banco de dados. Se estiver usando Docker Compose, as variáveis já estarão configuradas para o contêiner do PostgreSQL.

    Exemplo de `.env` (ajuste conforme necessário):
    ```
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/giropro_db"
    JWT_SECRET="sua_chave_secreta_jwt_aqui"
    ```

4.  **Configurar Banco de Dados (com Docker Compose - Recomendado):**
    Se você tem Docker e Docker Compose instalados, pode iniciar o banco de dados com um único comando:
    ```bash
    docker compose up -d postgres_db
    ```
    Isso iniciará um contêiner PostgreSQL em segundo plano. As credenciais e a URL de conexão estarão no seu arquivo `.env`.

5.  **Executar Migrações do Banco de Dados:**
    Após o banco de dados estar rodando, execute as migrações para criar as tabelas necessárias:
    ```bash
    npm run db:migrate
    ```

6.  **Iniciar o Backend:**
    Em modo de desenvolvimento (com `nodemon` para auto-reload):
    ```bash
    npm run dev
    ```
    Ou em modo de produção:
    ```bash
    npm start
    ```
    O backend estará rodando em `http://localhost:3000` (ou na porta configurada no `.env`).

### Passo 3: Configurar o Frontend

O frontend é desenvolvido com React Native (compatível com Web, iOS e Android) e TypeScript.

1.  **Navegar para o diretório do Frontend:**
    ```bash
    cd ../frontend # Se você estiver no diretório 'backend'
    # ou
    # cd frontend # Se você estiver na raiz do projeto
    ```

2.  **Instalar Dependências:**
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `frontend` com base no arquivo `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Edite o arquivo `.env` e preencha as variáveis, especialmente a URL da API do backend.

    Exemplo de `.env`:
    ```
    EXPO_PUBLIC_API_URL="http://localhost:3000/api/v1"
    ```

4.  **Iniciar o Frontend:**
    Para rodar a versão web (recomendado para desenvolvimento rápido):
    ```bash
    npm run web
    ```
    Isso abrirá o aplicativo no seu navegador padrão em `http://localhost:8081`.

    Para rodar em emulador iOS/Android ou dispositivo físico (requer Expo Go):
    ```bash
    npm start
    ```
    Siga as instruções no terminal para abrir no emulador ou escanear o QR code com o Expo Go.

## 🧪 Executando Testes

É crucial rodar os testes para garantir que seu ambiente está configurado corretamente e que nenhuma alteração quebre funcionalidades existentes.

### Testes do Backend

No diretório `backend`:

```bash
npm test
```

### Testes do Frontend

No diretório `frontend`:

```bash
npm test
```

## 📂 Estrutura do Projeto

```
GiroPro/
├── backend/                # Código-fonte do backend (Node.js, Express, TypeScript)
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio das rotas
│   │   ├── db/             # Configuração do banco de dados e schemas (Drizzle ORM)
│   │   ├── middlewares/    # Middlewares (autenticação, tratamento de erros)
│   │   ├── routes/         # Definição das rotas da API
│   │   ├── services/       # Lógica de serviço (interação com o banco, etc.)
│   │   ├── utils/          # Funções utilitárias e validações
│   │   └── app.ts          # Ponto de entrada da aplicação
│   ├── __tests__/          # Testes unitários e de integração do backend
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   ├── package.json        # Dependências e scripts do backend
│   └── tsconfig.json       # Configuração do TypeScript
├── frontend/               # Código-fonte do frontend (React Native, TypeScript)
│   ├── src/
│   │   ├── assets/         # Imagens, fontes, etc.
│   │   ├── components/     # Componentes reutilizáveis da UI
│   │   ├── contexts/       # Contextos globais (autenticação, temas)
│   │   ├── hooks/          # Hooks customizados
│   │   ├── navigation/     # Configuração de navegação (React Navigation)
│   │   ├── screens/        # Telas principais do aplicativo
│   │   ├── services/       # Integração com a API do backend
│   │   ├── styles/         # Definição de estilos e temas
│   │   ├── utils/          # Funções utilitárias
│   │   └── App.tsx         # Ponto de entrada da aplicação
│   ├── __tests__/          # Testes unitários de componentes e telas do frontend
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   ├── package.json        # Dependências e scripts do frontend
│   ├── tsconfig.json       # Configuração do TypeScript
│   └── jest.config.js      # Configuração do Jest
├── docs/                   # Documentação adicional do projeto
│   ├── development-progress-report-v0.5.0.md # Relatório de progresso
│   ├── release-notes-v0.5.0.md             # Notas de lançamento da v0.5.0
│   └── plano_desenvolvimento_v0.5.0.md     # Plano de desenvolvimento original
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
├── CHANGELOG_v0.5.0.md     # Histórico de mudanças da v0.5.0
└── README.md               # Este arquivo
```

## 🤝 Como Contribuir

Valorizamos muito suas contribuições! Para garantir um fluxo de trabalho eficiente e de alta qualidade, siga estas diretrizes:

1.  **Fork e Clone:** Faça um fork do repositório e clone sua cópia local.
2.  **Crie uma Branch:** Crie uma nova branch para sua funcionalidade ou correção (`git checkout -b feature/minha-nova-feature` ou `bugfix/corrigir-erro-x`).
3.  **Desenvolva:** Implemente suas mudanças, seguindo os padrões de código e as melhores práticas.
4.  **Testes:** Escreva testes para suas novas funcionalidades ou para reproduzir e corrigir bugs. Certifique-se de que todos os testes existentes continuem passando.
5.  **Lint e Formate:** Utilize o ESLint e o Prettier para garantir a qualidade e a consistência do código. Você pode rodar manualmente:
    ```bash
    # No diretório do backend
    npm run lint
    npm run format
    # No diretório do frontend
    npm run lint
    npm run format
    ```
    Recomendamos configurar seu editor de código para formatar automaticamente ao salvar.
6.  **Commits Semânticos:** Escreva mensagens de commit claras e descritivas, seguindo a convenção de commits semânticos (ex: `feat: adicionar nova funcionalidade de dashboard`, `fix: corrigir erro de login`).
7.  **Pull Request (PR):** Abra um Pull Request para a branch `main` (ou `develop`, se houver). Descreva suas mudanças detalhadamente, incluindo o problema que resolve e como ele foi resolvido.
8.  **Revisão de Código:** Participe ativamente da revisão de código, respondendo a comentários e fazendo as alterações solicitadas.

## ❓ Suporte e Dúvidas

Se você tiver alguma dúvida ou encontrar algum problema durante o onboarding ou desenvolvimento, por favor, abra uma [Issue](https://github.com/GiroPro/GiroPro/issues) neste repositório. Descreva seu problema com o máximo de detalhes possível, incluindo passos para reproduzir, mensagens de erro e seu ambiente.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com 💙 por Manus AI**

*Última Atualização: 27 de Julho de 2025*



### Configuração Manual do Banco de Dados (Sem Docker)

Se você não pode ou não deseja usar Docker, siga estas instruções para configurar o PostgreSQL manualmente:

1.  **Instalar PostgreSQL:**
    Instale o PostgreSQL em seu sistema. As instruções variam de acordo com o sistema operacional:
    -   **Ubuntu/Debian:** `sudo apt update && sudo apt install postgresql postgresql-contrib`
    -   **macOS (Homebrew):** `brew install postgresql`
    -   **Windows:** Baixe o instalador em [postgresql.org/download/](https://www.postgresql.org/download/)

2.  **Criar Usuário e Banco de Dados:**
    Após a instalação, acesse o terminal do PostgreSQL (geralmente `psql -U postgres`) e crie um usuário e um banco de dados para o GiroPro. Certifique-se de que as credenciais correspondam às do seu arquivo `.env`.
    ```sql
    CREATE USER giropro_user WITH PASSWORD 'giropro_password';
    CREATE DATABASE giropro_db OWNER giropro_user;
    \q
    ```
    *Substitua `giropro_user` e `giropro_password` pelas credenciais que você usará no seu `.env`.*

3.  **Configurar Variáveis de Ambiente:**
    No seu arquivo `.env` do backend, certifique-se de que `DATABASE_URL` aponte para sua instalação manual do PostgreSQL:
    ```
    DATABASE_URL="postgresql://giropro_user:giropro_password@localhost:5432/giropro_db"
    ```

4.  **Executar Migrações:**
    Com o banco de dados rodando e configurado, execute as migrações conforme o Passo 2.5 da seção de configuração do backend:
    ```bash
    npm run db:migrate
    ```

Para facilitar este processo, você pode usar o script `setup_db_manual.sh` (disponível na raiz do projeto) que automatiza os passos 2 e 4. Certifique-se de ter o PostgreSQL instalado e o usuário `postgres` configurado corretamente antes de executá-lo.

