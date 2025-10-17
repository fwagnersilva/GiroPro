#!/bin/bash

# Script para corrigir os ícones GNV com sintaxe correta

echo "🔧 Corrigindo ícones GNV..."
echo "=================================================="

# Arquivo 1: edit-fueling.tsx
echo "Corrigindo: ./frontend/src/app/(app)/edit-fueling.tsx"
sed -i "s/icon: 'leaf, color:/icon: 'leaf', color:/g" "./frontend/src/app/(app)/edit-fueling.tsx"

# Arquivo 2: fuelings.tsx
echo "Corrigindo: ./frontend/src/app/(app)/fuelings.tsx"
sed -i "s/gnv: 'leaf,/gnv: 'leaf',/g" "./frontend/src/app/(app)/fuelings.tsx"

# Arquivo 3: edit-vehicle.tsx
echo "Corrigindo: ./frontend/src/app/(app)/edit-vehicle.tsx"
sed -i "s/icon: 'leaf }/icon: 'leaf' }/g" "./frontend/src/app/(app)/edit-vehicle.tsx"

echo ""
echo "✅ Correções aplicadas!"
echo "=================================================="
echo ""
echo "Verificando resultado:"
grep -n "icon: 'leaf'\|gnv: 'leaf'" ./frontend/src/app/\(app\)/edit-fueling.tsx ./frontend/src/app/\(app\)/fuelings.tsx ./frontend/src/app/\(app\)/edit-vehicle.tsx

echo ""
echo "Pronto! Reinicie o servidor com: npm run dev"