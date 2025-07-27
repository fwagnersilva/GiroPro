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
  "README.md"
  "docs/CONTRIBUTING.md"
  "docs/next_steps.md"
  "docs/ROADMAP.md"
  "docs/DEVELOPMENT_PRINCIPLES.md"
  "docs/setup_troubleshooting.md"
)

ALL_FILES_EXIST=true
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

# 3. Executar testes de sanidade (ex: testes de utilitários)
echo "\nExecutando testes de sanidade do Frontend..."
cd frontend || { echo "Erro: Diretório frontend não encontrado."; exit 1; }
if npm test src/utils/__tests__/formatters.test.ts; then
  echo "✅ Testes de sanidade do Frontend passaram."
else
  echo "❌ Testes de sanidade do Frontend falharam. Verifique a configuração de testes."
  exit 1
fi
cd ..

echo "\nVerificação do ambiente concluída com sucesso!"


