import { existsSync, writeFileSync, symlinkSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Fix expo-font stub
const fontPath = join(rootDir, "node_modules/expo-font/build/Font.js");
if (!existsSync(fontPath)) {
  console.log("expo-font/build/Font.js não encontrado. Criando stub...");
  const content = `export default {};`;
  writeFileSync(fontPath, content);
}

// Função para criar link simbólico seguro
function createSymlink(target, linkPath, description) {
  try {
    // Remove o link se já existir
    if (existsSync(linkPath)) {
      rmSync(linkPath, { recursive: true, force: true });
    }
    
    // Cria o link simbólico
    symlinkSync(target, linkPath, 'junction');
    console.log(`✅ ${description} criado com sucesso`);
  } catch (error) {
    console.warn(`⚠️  Não foi possível criar ${description}:`, error.message);
  }
}

// Fix react-native-worklets
// react-native-reanimated procura por 'react-native-worklets' mas o pacote é 'react-native-worklets-core'
const workletsCorePath = join(rootDir, "node_modules/react-native-worklets-core");
const workletsLinkPath = join(rootDir, "node_modules/react-native-worklets");

if (existsSync(workletsCorePath)) {
  createSymlink(
    "react-native-worklets-core",
    workletsLinkPath,
    "Link simbólico: react-native-worklets -> react-native-worklets-core"
  );
}

// Fix babel plugins
// Alguns pacotes procuram pelos nomes antigos dos plugins babel (proposal-* ao invés de transform-*)
const babelPlugins = [
  {
    target: "plugin-transform-optional-chaining",
    link: "plugin-proposal-optional-chaining",
    description: "Babel plugin: optional-chaining"
  },
  {
    target: "plugin-transform-nullish-coalescing-operator",
    link: "plugin-proposal-nullish-coalescing-operator",
    description: "Babel plugin: nullish-coalescing"
  }
];

const babelDir = join(rootDir, "node_modules/@babel");
if (existsSync(babelDir)) {
  babelPlugins.forEach(({ target, link, description }) => {
    const targetPath = join(babelDir, target);
    const linkPath = join(babelDir, link);
    
    if (existsSync(targetPath)) {
      createSymlink(target, linkPath, description);
    }
  });
}

console.log("\n✨ Postinstall concluído com sucesso!\n");