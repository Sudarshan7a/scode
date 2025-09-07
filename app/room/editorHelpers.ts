// Helpers for CollaborativeEditor extracted to reduce component complexity.

export type LanguageDef = {
  id: string;
  label: string;
  monacoId: string;
  contribution?: string;
};

export type EditorLike = { getModel: () => { uri?: unknown } | null };

// Minimal shape of the Monaco API surface used by this file.
export type MonacoLike = {
  // Keep the shape loose since we load Monaco dynamically in the browser.
  // We intentionally allow accessing the `typescript` namespace at runtime.
  languages: {
    getLanguages: () => Array<{ id?: string }>;
    typescript?: unknown;
    // allow reading other language surfaces
    [key: string]: unknown;
  };
  editor?: { setModelLanguage?: (mdl: unknown, l: string) => void };
};

// Configure Monaco's JS/TS language service for better editor IntelliSense.
export function configureMonacoForTsJs(monaco: MonacoLike) {
  if (!monaco || !monaco.languages || !monaco.languages.typescript) return;

  try {
    // Minimal TS/JS surface we rely on from Monaco. Keep it local to avoid
    // depending on Monaco types in the repo.
    type TsNamespace = {
      javascriptDefaults?: {
        setCompilerOptions: (opts: Record<string, unknown>) => void;
        setDiagnosticsOptions: (opts: Record<string, unknown>) => void;
        setEagerModelSync?: (b: boolean) => void;
        addExtraLib?: (code: string, uri?: string) => void;
      };
      typescriptDefaults?: {
        setCompilerOptions: (opts: Record<string, unknown>) => void;
        setDiagnosticsOptions: (opts: Record<string, unknown>) => void;
        setEagerModelSync?: (b: boolean) => void;
      };
    };

    const tsns = monaco.languages as unknown as TsNamespace;

    // JavaScript defaults
    if (tsns.javascriptDefaults) {
      tsns.javascriptDefaults.setCompilerOptions({
        allowJs: true,
        checkJs: true,
        jsx: "preserve",
      });
      tsns.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      // Keep models in sync eagerly so suggestions reflect file changes quickly
      if (typeof tsns.javascriptDefaults.setEagerModelSync === "function") {
        tsns.javascriptDefaults.setEagerModelSync(true);
      }
      // Minimal extra lib so editor offers DOM/JS globals in JS files.
      try {
        if (typeof tsns.javascriptDefaults.addExtraLib === "function") {
          tsns.javascriptDefaults.addExtraLib(
            "declare const globalThis: any; declare const window: any;",
            "inmemory://global-js.d.ts"
          );
        }
      } catch {
        // ignore if API not available in this runtime
      }
    }

    // TypeScript defaults
    if (tsns.typescriptDefaults) {
      tsns.typescriptDefaults.setCompilerOptions({
        jsx: "preserve",
        allowJs: true,
      });
      tsns.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      if (typeof tsns.typescriptDefaults.setEagerModelSync === "function") {
        tsns.typescriptDefaults.setEagerModelSync(true);
      }
    }
  } catch (err) {
    // Non-fatal: if Monaco surface differs, fall back silently.
    // Caller will still proceed with basic editor features.
    console.warn("configureMonacoForTsJs failed:", err);
  }
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
  { id: "typescript", label: "TypeScript", monacoId: "typescript" },
  {
    id: "python",
    label: "Python",
    monacoId: "python",
    contribution:
      "monaco-editor/esm/vs/basic-languages/python/python.contribution",
  },
  {
    id: "go",
    label: "Go",
    monacoId: "go",
    contribution: "monaco-editor/esm/vs/basic-languages/go/go.contribution",
  },
  {
    id: "java",
    label: "Java",
    monacoId: "java",
    contribution: "monaco-editor/esm/vs/basic-languages/java/java.contribution",
  },
  {
    id: "c",
    label: "C",
    monacoId: "cpp",
    contribution: "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution",
  },
  {
    id: "cpp",
    label: "C++",
    monacoId: "cpp",
    contribution: "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution",
  },
];

export async function loadLanguageContribution(
  monaco: MonacoLike,
  selected: LanguageDef | undefined
) {
  if (!selected?.contribution) return;
  const already = monaco.languages
    .getLanguages()
    .some((l: { id?: string }) => l.id === selected.monacoId);
  if (already) return;
  const loaders: Record<string, () => Promise<unknown>> = {
    "monaco-editor/esm/vs/basic-languages/python/python.contribution": () =>
      import("monaco-editor/esm/vs/basic-languages/python/python.contribution"),
    "monaco-editor/esm/vs/basic-languages/go/go.contribution": () =>
      import("monaco-editor/esm/vs/basic-languages/go/go.contribution"),
    "monaco-editor/esm/vs/basic-languages/java/java.contribution": () =>
      import("monaco-editor/esm/vs/basic-languages/java/java.contribution"),
    "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution": () =>
      import("monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution"),
  };

  const loader = loaders[selected.contribution];
  if (!loader) {
    console.warn("Unknown Monaco contribution:", selected.contribution);
    return;
  }

  try {
    await loader();
  } catch (e) {
    console.warn("Failed to load language contribution for", selected.id, e);
  }
}

export async function initializeEditor(opts: {
  editor: EditorLike;
  monaco: MonacoLike;
  roomId: string;
  languages: LanguageDef[];
  languageId: string;
  applyLanguageToModel: (lang: string) => void;
}) {
  const {
    editor,
    monaco,
    roomId,
    languages,
    languageId,
    applyLanguageToModel,
  } = opts;
  try {
    const [
      { setupMonacoEnvironment },
      Y,
      websocketModule,
      { IndexeddbPersistence },
    ] = await Promise.all([
      import("@/lib/monaco/monacoEnvironment"),
      import("yjs"),
      import("y-websocket"),
      import("y-indexeddb"),
    ]);
    
    // Get WebsocketProvider from y-websocket module
    const WebsocketProvider = websocketModule.WebsocketProvider;
    
    if (!WebsocketProvider) {
      throw new Error("WebsocketProvider not found in y-websocket module");
    }
    
    setupMonacoEnvironment();
    // Configure Monaco's JS/TS language service for better IntelliSense
    // (this sets compilerOptions, diagnostics and eager model sync).
    try {
      configureMonacoForTsJs(monaco);
    } catch (e) {
      // non-fatal
      console.warn("Failed to configure Monaco TS/JS defaults:", e);
    }

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(roomId, ydoc);

    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN as string,
      roomId,
      ydoc
    );

    // Listen for custom room-ended messages
    provider.ws?.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room-ended') {
          // Trigger a page reload to show the ended state
          window.location.reload();
        }
      } catch (e) {
        // Ignore non-JSON messages (Y.js binary messages)
      }
    });

    const ytext = ydoc.getText("monaco");

    const { MonacoBinding } = await import("y-monaco");

    const selected = languages.find((l) => l.id === languageId);
    await loadLanguageContribution(monaco, selected);

    const model = editor.getModel();
    if (model) {
      // MonacoBinding's actual types are provided by the monaco/y-monaco packages.
      // To avoid pulling those types into this helper (and to satisfy the
      // no-explicit-any lint rule) we use `unknown` for the constructor shape
      // and perform a safe runtime call.
      type Newable = new (...args: unknown[]) => unknown;
      const BindingCtor = MonacoBinding as unknown as Newable;
      new BindingCtor(
        ytext,
        model as unknown,
        new Set([editor as unknown]),
        (provider as unknown as { awareness?: unknown }).awareness
      );
      applyLanguageToModel(languageId);
    }

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  } catch (err) {
    console.error("Editor collaborative setup failed", err);
    return () => {};
  }
}
