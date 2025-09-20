#!/bin/bash

# Script para configuração manual do banco de dados PostgreSQL para o GiroPro

# Cores para saída do terminal
GREEN=\'\033[0;32m\'
RED=\'\033[0;31m\'
NC=\'\033[0m\'

echo -e \"${GREEN}Iniciando configuração manual do banco de dados PostgreSQL para o GiroPro...${NC}\"

# 1. Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null
then
    echo -e \"${RED}Erro: PostgreSQL não encontrado. Por favor, instale o PostgreSQL antes de executar este script.\"${NC}\"
    echo \"Consulte o README.md para instruções de instalação.\"
    exit 1
fi

# 2. Solicitar credenciais do banco de dados
read -p \"Digite o nome de usuário do banco de dados (ex: giropro_user): \" DB_USER
read -s -p \"Digite a senha do banco de dados: \" DB_PASSWORD
echo
read -p \"Digite o nome do banco de dados (ex: giropro_db): \" DB_NAME

# 3. Criar usuário e banco de dados
echo -e \"${GREEN}Criando usuário e banco de dados PostgreSQL...${NC}\"

# Tenta criar o usuário, ignorando erro se já existir
psql -U postgres -c \"CREATE USER $DB_USER WITH PASSWORD \'$DB_PASSWORD\';\" 2>/dev/null || true

# Tenta criar o banco de dados, ignorando erro se já existir e definindo o owner
psql -U postgres -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER;\" 2>/dev/null || true

if [ $? -eq 0 ]; then
    echo -e \"${GREEN}Usuário \'$DB_USER\' e banco de dados \'$DB_NAME\' criados/verificados com sucesso.${NC}\"
else
    echo -e \"${RED}Erro ao criar usuário ou banco de dados. Verifique as permissões ou se o PostgreSQL está rodando.\"${NC}\"
    exit 1
fi

# 4. Executar migrações do banco de dados
echo -e \"${GREEN}Executando migrações do banco de dados...${NC}\"

# Navegar para o diretório do backend
cd backend || {
    echo -e \"${RED}Erro: Não foi possível navegar para o diretório 'backend'. Certifique-se de que o script está na raiz do projeto GiroPro.\"${NC}\"
    exit 1
}

# Configurar DATABASE_URL temporariamente para as migrações
export DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\"

npm run db:migrate

if [ $? -eq 0 ]; then
    echo -e \"${GREEN}Migrações executadas com sucesso!${NC}\"
else
    echo -e \"${RED}Erro ao executar migrações. Verifique a configuração do seu banco de dados e as dependências do backend.\"${NC}\"
    exit 1
fi

echo -e \"${GREEN}Configuração manual do banco de dados concluída!${NC}\"
echo \"Agora você pode iniciar o backend com as credenciais configuradas no seu arquivo .env.\"


