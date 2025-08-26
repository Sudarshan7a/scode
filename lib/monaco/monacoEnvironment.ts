// Configure Monaco's web workers in a Next.js (app router) environment without bundler plugins.
// This avoids dynamic <moduleId> resolution issues by mapping known labels to the ESM worker entry files.

// We lazy create blob worker URLs per label so they can be revoked on hot reload if needed.
const workerBlobUrlCache: Record<string, string> = {};

function buildWorker(label: string) {
  if (workerBlobUrlCache[label]) return workerBlobUrlCache[label];

  // Monaco publishes ESM worker entry points at these paths inside monaco-editor package
  // We inline a small loader that imports the real worker script.
  const workerPathMap: Record<string, string> = {
    json: "vs/language/json/jsonWorker",
    css: "vs/language/css/cssWorker",
    html: "vs/language/html/htmlWorker",
    typescript: "vs/language/typescript/tsWorker",
    javascript: "vs/language/typescript/tsWorker",
    default: "vs/editor/editorWorker",
  };

  const moduleId = workerPathMap[label] || workerPathMap.default;
  const loaderSource = `
  import * as worker from 'monaco-editor/esm/${moduleId}.js';
  self.MonacoEnvironment = { baseUrl: 'monaco-editor/esm/' };
  // Ensure the worker actually runs
  self.onmessage = (event) => worker.default && worker.default(event);
`;

  const blob = new Blob([loaderSource], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  workerBlobUrlCache[label] = url;
  return url;
}

// Attach to globalThis so @monaco-editor/react picks it up.
interface MonacoEnvironmentShape {
  getWorker(moduleId: string | undefined, label: string): Worker;
}

export function setupMonacoEnvironment() {
  (
    self as unknown as { MonacoEnvironment: MonacoEnvironmentShape }
  ).MonacoEnvironment = {
    getWorker(_moduleId: string | undefined, label: string) {
      const url = buildWorker(label);
      return new Worker(url, {
        type: "module",
        name: `monaco-${label}-worker`,
      });
    },
  };
}

// Auto-run if in a browser context.
if (typeof window !== "undefined") {
  setupMonacoEnvironment();
}

export {}; // ensure module scope
