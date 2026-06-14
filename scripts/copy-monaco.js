const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "monaco-editor", "min", "vs");
const dest = path.join(__dirname, "..", "public", "monaco", "vs");

try {
  if (fs.existsSync(src)) {
    // Ensure target directory's parent (public/monaco) exists
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    // Copy recursively
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log("Successfully copied Monaco Editor files to public/monaco/vs");
  } else {
    console.error("Monaco source directory not found at:", src);
    process.exit(1);
  }
} catch (error) {
  console.error("Failed to copy Monaco files:", error);
  process.exit(1);
}
