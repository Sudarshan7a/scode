import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["app/**/*", "components/**/*", "hooks/**/*", "lib/**/*"],
      exclude: ["tests/**/*", "**/*.d.ts", "**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
