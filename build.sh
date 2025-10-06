#!/bin/bash
set -e

echo "🧹 Limpando diretórios..."
rm -rf node_modules package-lock.json .expo

echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

echo "🔍 Verificando expo-font..."
if [ ! -f "node_modules/expo-font/build/Font.js" ]; then
  echo "⚠️  Font.js não encontrado, reinstalando expo-font..."
  npm uninstall expo-font
  npm install expo-font@11.4.0 --legacy-peer-deps --force
fi

echo "🏗️  Construindo para web..."
npx expo export:web

echo "✅ Build concluído!"
ls -la web-build
