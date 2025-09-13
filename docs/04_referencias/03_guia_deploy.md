# Guia de Deploy do GiroPro

Este documento fornece um guia detalhado para o deploy da aplicação GiroPro em ambientes de produção.

## Visão Geral da Arquitetura de Deploy

O GiroPro é composto por dois principais componentes:

1.  **Backend:** Uma API RESTful desenvolvida com Node.js (Express.js) e Drizzle ORM, utilizando SQLite como banco de dados.
2.  **Frontend:** Uma aplicação móvel desenvolvida com React Native.

Para o deploy, é recomendável que o backend seja hospedado em um servidor ou serviço de cloud que suporte Node.js, enquanto o frontend é empacotado e distribuído através das lojas de aplicativos (Google Play Store e Apple App Store).

## Pré-requisitos

Antes de iniciar o processo de deploy, certifique-se de ter os seguintes pré-requisitos:

-   Servidor com Node.js (versão 18 ou superior) e npm/yarn instalados.
-   Git instalado.
-   Docker e Docker Compose (opcional, para deploy conteinerizado).
-   Credenciais de acesso às lojas de aplicativos (para o frontend).
-   Variáveis de ambiente configuradas (ver seção de Configuração).

## Deploy do Backend

### 1. Preparação do Servidor

-   **Instalar Node.js e npm/yarn:** Certifique-se de que o Node.js e um gerenciador de pacotes (npm ou yarn) estejam instalados no servidor.
-   **Clonar o Repositório:**

    ```bash
    git clone https://github.com/fwagnersilva/GiroPro.git
    cd GiroPro/backend
    ```

-   **Instalar Dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis:

```
PORT=3000
DATABASE_URL=./data/giropro.db
JWT_SECRET=sua_chave_secreta_jwt
# Outras variáveis de ambiente conforme necessário
```

### 3. Migrações do Banco de Dados

Execute as migrações do banco de dados para garantir que o esquema esteja atualizado:

```bash
npm run db:migrate
```

### 4. Iniciar a Aplicação

Para iniciar a aplicação em modo de produção, utilize um gerenciador de processos como PM2 ou systemd.

**Exemplo com PM2:**

```bash
npm install -g pm2
pm2 start dist/server.js --name giropro-backend
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

## Deploy do Frontend (React Native)

O deploy do frontend envolve a geração de builds para Android e iOS e a submissão para as respectivas lojas de aplicativos.

### 1. Preparação

-   Certifique-se de ter o ambiente de desenvolvimento React Native configurado (Android Studio, Xcode).
-   Navegue até o diretório `frontend`:

    ```bash
    cd GiroPro/frontend
    ```

-   Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    ```

### 2. Build para Android

Para gerar um APK ou AAB (Android App Bundle) assinado para produção:

```bash
npm run android -- --mode=release
```

O arquivo gerado estará em `android/app/build/outputs/apk/release/app-release.apk` ou `android/app/build/outputs/bundle/release/app-release.aab`.

### 3. Build para iOS

Para gerar um build para iOS, você precisará de um Mac e do Xcode.

```bash
npm run ios -- --mode=release
```

Abra o projeto no Xcode (`ios/GiroPro.xcworkspace`), configure as assinaturas e arquive o build para submissão à App Store Connect.

### 4. Submissão às Lojas de Aplicativos

Siga as diretrizes da Google Play Console e da Apple App Store Connect para submeter suas builds. Isso geralmente envolve:

-   Criação de listagens de aplicativos.
-   Upload dos arquivos APK/AAB (Android) ou IPA (iOS).
-   Configuração de informações de privacidade, preços e distribuição.

## Deploy com Docker (Opcional)

Para um deploy mais consistente e isolado, você pode utilizar Docker e Docker Compose.

### 1. Construir Imagens Docker

Na raiz do projeto, execute:

```bash
docker-compose build
```

### 2. Iniciar Contêineres

```bash
docker-compose up -d
```

Isso iniciará o backend e qualquer outro serviço definido no `docker-compose.yml`.

## Monitoramento e Manutenção

Após o deploy, é crucial monitorar a aplicação para garantir seu bom funcionamento. Utilize ferramentas de monitoramento de logs, performance e erros. Mantenha as dependências atualizadas e aplique patches de segurança regularmente.

