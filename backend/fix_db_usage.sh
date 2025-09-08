#!/bin/bash

# Arquivos que precisam ser corrigidos
files=(
  "src/controllers/advancedAnalyticsController.ts"
  "src/controllers/reportsController.ts"
  "src/controllers/vehiclesController.ts"
  "src/services/advancedAnalyticsService.ts"
  "src/services/expenseService.ts"
  "src/services/notificationService.ts"
  "src/services/reportsService.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Corrigindo $file..."
    # Adicionar const db = await getDb(); no início de cada método que usa db
    sed -i 's/async \([^(]*\)([^)]*) {/async \1(\&) {\n    const db = await getDb();/g' "$file"
    # Remover linhas duplicadas
    sed -i '/const db = await getDb();/{N;s/const db = await getDb();\n.*const db = await getDb();/const db = await getDb();/}' "$file"
  fi
done

echo "Correção concluída!"
