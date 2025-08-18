import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function fixturePath(name) {
  return path.resolve(__dirname, "text", name);
}
