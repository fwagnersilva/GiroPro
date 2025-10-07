import { existsSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontPath = join(__dirname, "../node_modules/expo-font/build/Font.js");

if (!existsSync(fontPath)) {
  console.log("expo-font/build/Font.js não encontrado. Criando stub...");
  const content = `export default {};`;
  writeFileSync(fontPath, content);
}
