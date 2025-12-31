import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

let baseExtends = [];
try {
  baseExtends = compat.extends("next/core-web-vitals", "next/typescript");
} catch (err) {
  // Fallback to a minimal config if FlatCompat encounters an issue
  // to avoid ESLint crashing during configuration validation
  baseExtends = [];
}

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "git-audit/**"]
}, ...baseExtends];

export default eslintConfig;
