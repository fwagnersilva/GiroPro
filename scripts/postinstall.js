import { existsSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontPath = join(__dirname, "../node_modules/expo-font/build/Font.js");

if (!existsSync(fontPath)) {
  console.log("⚙️  Corrigindo expo-font: criando build/Font.js faltando...");
  writeFileSync(fontPath, "export default {};");
}
