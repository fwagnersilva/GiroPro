#!/bin/bash

# Script de Setup Automatizado para o Projeto GiroPro
# Este script automatiza a configuração inicial do ambiente de desenvolvimento.
# Pode ser executado por desenvolvedores humanos ou agentes de IA.

log_info() { echo "[INFO] $1"; }
log_warn() { echo "[WARN] $1"; }
log_error() { echo "[ERROR] $1"; }

# --- 1. Verificar Pré-requisitos ---
log_info "Verificando pré-requisitos..."

check_command() {
  if ! command -v $1 &> /dev/null
  then
    log_error "$1 não encontrado. Por favor, instale $1 e tente novamente."
    exit 1
  fi
}

check_command node
check_command npm
check_command git

log_info "Pré-requisitos verificados com sucesso."

# --- 2. Configurar Backend ---
log_info "Configurando o Backend..."
cd backend || { log_error "Diretório 'backend' não encontrado."; exit 1; }

log_info "Instalando dependências do Backend..."
npm install || { log_error "Falha ao instalar dependências do Backend."; exit 1; }

log_info "Copiando .env.example para .env no Backend..."
if [ ! -f .env ]; then
  cp giropro.env .env || { log_error "Falha ao copiar .env.example no Backend."; exit 1; }
  log_warn "Lembre-se de editar o arquivo .env no diretório 'backend' com suas configurações de banco de dados e JWT_SECRET."
else
  log_info ".env já existe no Backend. Pulando cópia."
fi

log_info "Configuração do Backend concluída."
cd .. # Voltar para a raiz do projeto

# --- 3. Configurar Frontend ---
log_info "Configurando o Frontend..."
cd frontend || { log_error "Diretório 'frontend' não encontrado."; exit 1; }

log_info "Instalando dependências do Frontend..."
npm install || { log_error "Falha ao instalar dependências do Frontend."; exit 1; }

log_info "Copiando .env.example para .env no Frontend..."
if [ ! -f .env ]; then
  touch .env || { log_error "Falha ao criar .env vazio no Frontend."; exit 1; }
  log_warn "Lembre-se de editar o arquivo .env no diretório 'frontend' com a URL da API do Backend."
else
  log_info ".env já existe no Frontend. Pulando cópia."
fi

log_info "Configuração do Frontend concluída."
cd .. # Voltar para a raiz do projeto

# --- 4. Configurar Docker Compose (Banco de Dados) ---
log_info "Configurando Docker Compose para o Banco de Dados..."

if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
  log_warn "Docker ou Docker Compose não encontrados. O banco de dados não será iniciado automaticamente."
  log_warn "Por favor, instale Docker e Docker Compose e execute 'docker-compose up -d postgres_db' manualmente no diretório raiz do projeto."
  log_warn "Após iniciar o banco de dados, execute 'cd backend && npm run db:migrate' para as migrações."
else
  # Verificar se docker-compose.yml existe, se não, criar um básico
  if [ ! -f docker-compose.yml ]; then
    log_warn "docker-compose.yml não encontrado. Criando um arquivo básico para PostgreSQL."
    cat <<EOF > docker-compose.yml
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
EOF
    log_info "Arquivo docker-compose.yml básico criado. Verifique e ajuste conforme necessário."
  else
    log_info "docker-compose.yml já existe. Pulando criação."
  fi

  log_info "Iniciando contêiner do PostgreSQL via Docker Compose..."
  docker-compose up -d postgres_db || { log_error "Falha ao iniciar contêiner do PostgreSQL."; exit 1; }

  log_info "Aguardando o banco de dados ficar pronto..."
  # Esperar até que o serviço postgres_db esteja saudável
  # A verificação de saúde do Docker Compose pode ser um pouco lenta ou falhar em ambientes restritos.
  # Vamos simplificar para não bloquear o script em ambientes sem Docker.
  sleep 10 # Dar um tempo para o Docker iniciar, se presente

  log_info "Executando migrações do banco de dados no Backend..."
  cd backend || { log_error "Diretório 'backend' não encontrado."; exit 1; }
  npm run db:migrate || { log_error "Falha ao executar migrações do banco de dados."; exit 1; }
  cd .. # Voltar para a raiz do projeto

  log_info "Configuração do Docker Compose concluída."
fi

# --- 5. Instruções Finais ---
log_info "\n${GREEN}=====================================================${NC}"
log_info "${GREEN} SETUP DO GIROPRO CONCLUÍDO COM SUCESSO! ${NC}"
log_info "${GREEN}=====================================================${NC}"
log_info "\nPara iniciar o desenvolvimento, siga os passos abaixo:"
log_info "\n1. Iniciar o Backend:"
log_info "   cd backend && npm run dev"
log_info "\n2. Iniciar o Frontend (Web):"
log_info "   cd frontend && npm run web"
log_info "\n3. Rodar os Testes:"
log_info "   No diretório 'backend': npm test"
log_info "   No diretório 'frontend': npm test"
log_info "\nPara mais detalhes, consulte o README.md e o CONTRIBUTING.md."
log_info "${GREEN}=====================================================${NC}"


