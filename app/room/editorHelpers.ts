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
  languages: {
    getLanguages: () => Array<{ id?: string }>;
    // allow reading other language surfaces
    [key: string]: unknown;
  };
  editor?: { setModelLanguage?: (mdl: unknown, l: string) => void };
};

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
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

    const ydoc = new Y.Doc();
    new IndexeddbPersistence(roomId, ydoc);

    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN as string,
      roomId,
      ydoc
    );

    // Listen for custom room-ended messages
    provider.ws?.addEventListener("message", (event) => {
      // Only log JSON messages to reduce noise from Y.js binary messages
      try {
        const data = JSON.parse(event.data);
        if (data.type === "room-ended") {
          // Trigger a page reload to show the ended state
          window.location.reload();
        }
      } catch {
        // Y.js binary messages are expected and normal - don't log them
      }
    });

    const ytext = ydoc.getText("monaco");

    const { MonacoBinding } = await import("y-monaco");

    const selected = languages.find((l) => l.id === languageId);
    await loadLanguageContribution(monaco, selected);

    const model = editor.getModel();
    if (model) {
      type Newable = new (...args: unknown[]) => unknown;
      const BindingCtor = MonacoBinding as unknown as Newable;
      new BindingCtor(
        ytext,
        model as unknown,
        new Set([editor as unknown])
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
