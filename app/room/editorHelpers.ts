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
  languages: {
    getLanguages: () => Array<{ id?: string }>;
  };
  editor?: { setModelLanguage?: (mdl: unknown, l: string) => void };
};

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
    .some((l) => l.id === selected.monacoId);
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
      { WebsocketProvider },
      { IndexeddbPersistence },
    ] = await Promise.all([
      import("@/lib/monaco/monacoEnvironment"),
      import("yjs"),
      import("y-websocket"),
      import("y-indexeddb"),
    ]);
    setupMonacoEnvironment();

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(roomId, ydoc);
    persistence.on("synced", () =>
      console.log("Loaded content from IndexedDB")
    );

    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN as string,
      roomId,
      ydoc
    );
    provider.on(
      "status",
      (event: { status: "connected" | "disconnected" | "connecting" }) => {
        console.log("WebSocket status:", event.status);
      }
    );

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
