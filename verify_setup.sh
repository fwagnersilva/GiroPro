#!/bin/bash

echo "Iniciando verificação do ambiente GiroPro..."

# 1. Verificar existência de arquivos essenciais
echo "\nVerificando arquivos essenciais..."
REQUIRED_FILES=(
  "backend/package.json"
  "frontend/package.json"
  "frontend/jest.config.js"
  "frontend/babel.config.js"
  "frontend/src/setupTests.ts"
  "docs/progresso.md"
  "docs/EspecificacoesTecnicasGiroPro.md"
  "docs/mapeamento_funcionalidades.md"
  "docs/analise_problemas.md"
  "docs/relatorio_testes_scripts.md"
  "docs/backend_correcoes_especificas.md"
  "docs/relatorios_e_dashboards.md"
  "docs/roadmap.md"
  "docs/estrategia_precificacao.md"
  "docs/detalhamento_apis_modelos_dados.md"
)ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Arquivo não encontrado: $file"
    ALL_FILES_EXIST=false
  else
    echo "✅ Arquivo encontrado: $file"
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo "⚠️ Alguns arquivos essenciais estão faltando. Por favor, verifique a integridade da sua extração do projeto."
  exit 1
fi

# 2. Verificar instalação de dependências
echo "\nVerificando dependências do Backend..."
cd backend || { echo "Erro: Diretório backend não encontrado."; exit 1; }
if npm list > /dev/null 2>&1; then
  echo "✅ Dependências do Backend instaladas."
else
  echo "❌ Dependências do Backend não instaladas. Execute 'npm install' no diretório backend."
  exit 1
fi
cd ..

echo "\nVerificando dependências do Frontend..."
cd frontend || { echo "Erro: Diretório frontend não encontrado."; exit 1; }
if npm list > /dev/null 2>&1; then
  echo "✅ Dependências do Frontend instaladas."
else
  echo "❌ Dependências do Frontend não instaladas. Execute 'npm install' no diretório frontend."
  exit 1
fi
cd ..

# 3. Verificar se os arquivos principais estão acessíveis
echo "\nVerificando estrutura básica do projeto..."
if [ -d "backend/src" ] && [ -d "frontend/src" ]; then
  echo "✅ Estrutura básica do projeto está correta."
else
  echo "❌ Estrutura básica do projeto está incorreta."
  exit 1
fi

echo "\nVerificação do ambiente concluída com sucesso!"


