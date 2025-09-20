#!/bin/bash

# Script para configuração do ambiente SQLite para o GiroPro

# Cores para saída do terminal

# Variáveis padrão
DB_PATH="giropro.db"
SKIP_INSTALL=false
SKIP_MIGRATE=false

# Função de ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES]"
    echo "Configura o ambiente SQLite para o GiroPro."
    echo ""
    echo "Opções:"
    echo "  -d, --db-path <caminho>  Define o caminho para o arquivo do banco de dados SQLite (padrão: giropro.db)"
    echo "  -s, --skip-install     Pula a instalação de dependências npm (better-sqlite3, @types/better-sqlite3)"
    echo "  -m, --skip-migrate     Pula a geração e execução de migrações do Drizzle Kit"
    echo "  -h, --help             Exibe esta mensagem de ajuda"
    echo ""
    echo "Exemplo: $0 --db-path ./data/my_giropro.db --skip-install"
}

# Parsear argumentos da linha de comando
while getopts ":d:smh" opt; do
    case ${opt} in
        d ) DB_PATH=$OPTARG
        ;;
        s ) SKIP_INSTALL=true
        ;;
        m ) SKIP_MIGRATE=true
        ;;
        h ) show_help
            exit 0
        ;;
        \? ) echo "Erro: Opção inválida: -$OPTARG" >&2
            show_help
            exit 1
        ;;
        : ) echo "Erro: A opção -$OPTARG requer um argumento." >&2
            show_help
            exit 1
        ;;
    esac
done
shift $((OPTIND -1))

echo "Configurando ambiente SQLite para o GiroPro..."

# 1. Navegar para o diretório do backend
cd backend || {
  echo "Erro: Não foi possível navegar para o diretório 'backend'. Certifique-se de que o script está na raiz do projeto GiroPro."
    exit 1
}

# 2. Instalar dependências SQLite (se não for para pular)
if [ "$SKIP_INSTALL" = false ]; then
    echo "Instalando dependências SQLite..."
    npm install better-sqlite3 @types/better-sqlite3 || {
        echo "Erro: Falha ao instalar dependências SQLite."
        exit 1
    }
else
    echo "Pulando instalação de dependências SQLite."
fi

# 3. Configurar variáveis de ambiente para SQLite
echo "Configurando variáveis de ambiente..."# Atualizar DB_TYPE para sqlite no .env
if grep -q "DB_TYPE=" .env; then
    sed -i "s/^DB_TYPE=.*/DB_TYPE=sqlite/" .env
else
    echo "DB_TYPE=sqlite" >> .env
fi

# Configurar caminho do SQLite
if grep -q "SQLITE_DB_PATH=" .env; then
    sed -i "s|^SQLITE_DB_PATH=.*|SQLITE_DB_PATH=${DB_PATH}|" .env
else
    echo "SQLITE_DB_PATH=${DB_PATH}" >> .env
fi

echo "Variáveis de ambiente configuradas para SQLite"

# 4. Gerar e Executar migrações (se não for para pular)
if [ "$SKIP_MIGRATE" = false ]; then
    echo "Gerando migrações para SQLite..."
    npx drizzle-kit generate --config=drizzle.config.sqlite.ts || {
        echo "Erro: Falha ao gerar migrações do Drizzle Kit."
        exit 1
    }

    echo "Executando migrações SQLite..."
    npx drizzle-kit migrate --config=drizzle.config.sqlite.ts || {
        echo "Erro: Falha ao executar migrações do Drizzle Kit."
        exit 1
    }
else
    echo "Pulando geração e execução de migrações."
fi

echo "Configuração SQLite concluída!"
echo "Para usar SQLite, certifique-se de que DB_TYPE=sqlite no seu arquivo .env"
echo "Para voltar ao PostgreSQL, altere DB_TYPE=postgresql no arquivo .env"
