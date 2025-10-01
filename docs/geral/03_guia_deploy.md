# Guia de Deploy do GiroPro

Este documento fornece um guia detalhado para o deploy da aplicação GiroPro em ambientes de produção.

## Visão Geral da Arquitetura de Deploy

O GiroPro é composto por dois principais componentes:

1.  **Backend:** Uma API RESTful desenvolvida com Node.js (Express.js) e Drizzle ORM.
2.  **Frontend:** Uma aplicação móvel/web desenvolvida com React Native/Expo.

Para o deploy, é recomendável que o backend seja hospedado em um servidor ou serviço de cloud que suporte Node.js, enquanto o frontend é empacotado e distribuído através das lojas de aplicativos (Google Play Store e Apple App Store) ou hospedado como PWA/Web App.

## Pré-requisitos

Antes de iniciar o processo de deploy, certifique-se de ter os seguintes pré-requisitos:

*   Servidor com Node.js (versão 18 ou superior) e pnpm instalados.
*   Git instalado.
*   Docker e Docker Compose (opcional, para deploy conteinerizado).
*   Credenciais de acesso às lojas de aplicativos (para o frontend mobile).
*   Variáveis de ambiente configuradas (ver seção de Configuração).

## Deploy do Backend

### 1. Preparação do Servidor

*   **Instalar Node.js e pnpm:** Certifique-se de que o Node.js e o pnpm estejam instalados no servidor.
*   **Clonar o Repositório:**

    ```bash
    git clone https://github.com/fwagnersilva/GiroPro.git
    cd GiroPro/backend
    ```

*   **Instalar Dependências:**

    ```bash
    pnpm install
    ```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as variáveis de ambiente necessárias para produção. Consulte o [Guia de Setup Completo](./01_setup_completo.md) para detalhes.

```env
PORT=3000
DB_TYPE=postgresql
DATABASE_URL="postgresql://user:password@host:port/giropro_db"
JWT_SECRET="sua_chave_secreta_jwt_producao"
JWT_REFRESH_SECRET="seu_refresh_secret_producao"
NODE_ENV=production
LOG_LEVEL=error
ALLOWED_ORIGINS="https://seudominio.com"
```

### 3. Migrações do Banco de Dados

Execute as migrações do banco de dados para garantir que o esquema esteja atualizado. Para PostgreSQL:

```bash
pnpm run db:migrate
```

### 4. Iniciar a Aplicação

Para iniciar a aplicação em modo de produção, compile e execute:

```bash
pnpm run build
pnpm start
```

Recomenda-se utilizar um gerenciador de processos como PM2 ou systemd para manter a aplicação rodando em segundo plano e gerenciar reinícios.

**Exemplo com PM2:**

```bash
pnpm install -g pm2
pm2 start dist/app.js --name giropro-backend
pm2 save
```

### 5. Configuração do Reverse Proxy (Nginx/Apache)

É altamente recomendável configurar um reverse proxy (como Nginx ou Apache) para gerenciar o tráfego, SSL/TLS e balanceamento de carga.

**Exemplo de configuração Nginx:**

```nginx
server {
    listen 80;
    server_name api.seusite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deploy do Frontend (React Native/Expo)

O deploy do frontend envolve a geração de builds para Android, iOS e Web (PWA) e a submissão para as respectivas lojas de aplicativos ou hospedagem web.

### 1. Preparação

*   Certifique-se de ter o ambiente de desenvolvimento React Native/Expo configurado.
*   Navegue até o diretório `frontend`:

    ```bash
    cd GiroPro/frontend
    ```

*   Instale as dependências:

    ```bash
    pnpm install
    ```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` no diretório `frontend` com as variáveis de ambiente para produção, apontando para a URL do backend em produção.

```env
REACT_APP_API_URL=https://api.seusite.com/api/v1
EXPO_PUBLIC_API_URL=https://api.seusite.com/api/v1
```

### 3. Build para Web (PWA)

Para gerar um build otimizado para a web (PWA):

```bash
pnpm run build-web
```

Os arquivos estáticos gerados estarão no diretório `web-build/` e podem ser hospedados em serviços como Vercel, Netlify, GitHub Pages, etc.

### 4. Build para Android e iOS

Para gerar builds para Android (APK/AAB) e iOS (IPA), utilize o Expo Application Services (EAS):

*   **Instalar EAS CLI:**

    ```bash
    pnpm install -g eas-cli
    ```

*   **Fazer Login no Expo:**

    ```bash
    eas login
    ```

*   **Configurar Projeto EAS:**

    ```bash
    eas build:configure
    ```

*   **Gerar Build para Android:**

    ```bash
    eas build -p android --profile production
    ```

*   **Gerar Build para iOS:**

    ```bash
    eas build -p ios --profile production
    ```

Os artefatos de build (AAB para Android, IPA para iOS) serão gerados e disponibilizados para download no painel do EAS.

### 5. Submissão às Lojas de Aplicativos

Siga as diretrizes da Google Play Console e da Apple App Store Connect para submeter suas builds. Isso geralmente envolve:

*   Criação de listagens de aplicativos.
*   Upload dos arquivos AAB (Android) ou IPA (iOS).
*   Configuração de informações de privacidade, preços e distribuição.

## Deploy com Docker (Opcional)

Para um deploy mais consistente e isolado, você pode utilizar Docker e Docker Compose. Certifique-se de que os `Dockerfile`s e o `docker-compose.yml` estejam configurados para o ambiente de produção.

### 1. Construir Imagens Docker

Na raiz do projeto, execute:

```bash
docker-compose build
```

### 2. Iniciar Contêineres

```bash
docker-compose up -d
```

Isso iniciará o backend, o banco de dados PostgreSQL e qualquer outro serviço definido no `docker-compose.yml`.

## Monitoramento e Manutenção

Após o deploy, é crucial monitorar a aplicação para garantir seu bom funcionamento. Utilize ferramentas de monitoramento de logs, performance e erros. Mantenha as dependências atualizadas e aplique patches de segurança regularmente.

---

**Última atualização**: 01/10/2025
**Versão**: 1.2

