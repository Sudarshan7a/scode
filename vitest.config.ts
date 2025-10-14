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
      reporter: ["text", "lcov", "json", "html"],
      include: ["app/**/*", "components/**/*", "hooks/**/*", "lib/**/*"],
      exclude: [
        "tests/**/*",
        "**/*.d.ts",
        "**/index.ts",
        "**/*.config.*",
        "**/types.ts",
        "**/*.test.*",
        "**/*.spec.*",
      ],
      // Coverage thresholds - enforced in CI
      thresholds: {
        lines: 80,
        functions: 66,
        branches: 76,
        statements: 11,
      },
    },
    // Reporter configuration for CI/CD
    reporters: process.env.CI
      ? ["default", "junit"]
      : ["default"],
    outputFile: {
      junit: "./vitest-results.xml",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
