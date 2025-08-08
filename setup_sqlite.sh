#!/bin/bash

# Script para configuração do ambiente SQLite para o GiroPro

# Cores para saída do terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}Configurando ambiente SQLite para o GiroPro...${NC}"

# 1. Navegar para o diretório do backend
cd backend || {
    echo -e "${RED}Erro: Não foi possível navegar para o diretório 'backend'. Certifique-se de que o script está na raiz do projeto GiroPro.${NC}"
    exit 1
}

# 2. Instalar dependências SQLite
echo -e "${BLUE}Instalando dependências SQLite...${NC}"
npm install better-sqlite3 @types/better-sqlite3

# 3. Configurar variáveis de ambiente para SQLite
echo -e "${BLUE}Configurando variáveis de ambiente...${NC}"

# Criar ou atualizar arquivo .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}Arquivo .env criado a partir do .env.example${NC}"
fi

# Atualizar DB_TYPE para sqlite no .env
if grep -q "DB_TYPE=" .env; then
    sed -i 's/DB_TYPE=.*/DB_TYPE=sqlite/' .env
else
    echo "DB_TYPE=sqlite" >> .env
fi

# Configurar caminho do SQLite se não existir
if ! grep -q "SQLITE_DB_PATH=" .env; then
    echo "SQLITE_DB_PATH=giropro.db" >> .env
fi

echo -e "${GREEN}Variáveis de ambiente configuradas para SQLite${NC}"

# 4. Gerar migrações SQLite
echo -e "${BLUE}Gerando migrações para SQLite...${NC}"
npx drizzle-kit generate --config=drizzle.config.sqlite.ts

# 5. Executar migrações
echo -e "${BLUE}Executando migrações SQLite...${NC}"
npx drizzle-kit migrate --config=drizzle.config.sqlite.ts

echo -e "${GREEN}Configuração SQLite concluída!${NC}"
echo -e "${BLUE}Para usar SQLite, certifique-se de que DB_TYPE=sqlite no seu arquivo .env${NC}"
echo -e "${BLUE}Para voltar ao PostgreSQL, altere DB_TYPE=postgresql no arquivo .env${NC}"

