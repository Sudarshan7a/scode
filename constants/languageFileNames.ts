/**
 * Default filenames for each supported programming language.
 * Used for code execution, file downloads, and other language-specific operations.
 */
export const LANGUAGE_FILE_NAMES: Record<string, string> = {
  javascript: "index.js",
  typescript: "index.ts",
  python: "index.py",
  go: "main.go",
  java: "Main.java",
  c: "main.c",
  cpp: "main.cpp",
};

/**
 * Get the default filename for a given language ID.
 * @param languageId - The language identifier (e.g., "python", "javascript")
 * @returns The default filename for that language, or "index.txt" if not found
 */
export function getLanguageFileName(languageId: string): string {
  return LANGUAGE_FILE_NAMES[languageId] || "index.txt";
}
