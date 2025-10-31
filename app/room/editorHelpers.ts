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
  userInfo?: { name: string; email: string; id: string };
}) {
  const {
    editor,
    monaco,
    roomId,
    languages,
    languageId,
    applyLanguageToModel,
    userInfo,
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

    // Generate user info for collaborative cursors
    let userAwarenessData = null;
    if (userInfo && provider.awareness) {
      // Generate a consistent color based on user ID
      const colors = [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#ffeaa7",
        "#dfe6e9",
        "#74b9ff",
        "#a29bfe",
        "#fd79a8",
        "#fdcb6e",
      ];
      const colorIndex =
        userInfo.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

      userAwarenessData = {
        name: userInfo.name || userInfo.email.split("@")[0],
        color: colors[colorIndex],
        email: userInfo.email,
      };
    }

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

    // Variables for cursor tracking cleanup
    let cursorUpdateTimeout: NodeJS.Timeout | null = null;

    const model = editor.getModel();
    if (model) {
      // MonacoBinding automatically syncs text but we need custom rendering for cursors
      type Newable = new (...args: unknown[]) => unknown;
      const BindingCtor = MonacoBinding as unknown as Newable;
      new BindingCtor(
        ytext,
        model as unknown,
        new Set([editor as unknown]),
        (provider as unknown as { awareness?: unknown }).awareness
      );

      applyLanguageToModel(languageId);

      // Set user awareness info AFTER binding is created
      if (userAwarenessData && provider.awareness) {
        console.log("👤 Setting user awareness data:", userAwarenessData);
        provider.awareness.setLocalStateField("user", userAwarenessData);
      }

      // Track local cursor position and update awareness
      // Use a flag to prevent recursive updates
      let isUpdatingCursor = false;

      const updateLocalCursor = () => {
        // Prevent recursive updates
        if (isUpdatingCursor) {
          console.log("🔄 Skipping cursor update - already updating");
          return;
        }

        // Debounce to avoid excessive updates
        if (cursorUpdateTimeout) {
          clearTimeout(cursorUpdateTimeout);
        }

        cursorUpdateTimeout = setTimeout(() => {
          const editorWithMethods = editor as { getSelection?: () => unknown };
          const selection = editorWithMethods.getSelection?.() as {
            startLineNumber?: number;
            startColumn?: number;
            endLineNumber?: number;
            endColumn?: number;
          } | null | undefined;
          if (selection && provider.awareness) {
            isUpdatingCursor = true;
            try {
              const cursorData = {
                startLineNumber: selection.startLineNumber,
                startColumn: selection.startColumn,
                endLineNumber: selection.endLineNumber,
                endColumn: selection.endColumn,
              };
              console.log("📍 Setting local cursor position:", cursorData);

              // Get current state to preserve user info
              const currentState = provider.awareness.getLocalState() || {};
              console.log("Current state before update:", currentState);

              // Update entire state to preserve user info
              provider.awareness.setLocalState({
                ...currentState,
                selection: cursorData,
              });

              console.log(
                "✅ Local awareness state after update:",
                provider.awareness.getLocalState()
              );
            } finally {
              isUpdatingCursor = false;
            }
          }
        }, 50); // 50ms debounce
      };

      // Listen to cursor changes
      const editorWithEvents = editor as {
        onDidChangeCursorPosition?: (callback: () => void) => void;
        onDidChangeCursorSelection?: (callback: () => void) => void;
      };
      editorWithEvents.onDidChangeCursorPosition?.(updateLocalCursor);
      editorWithEvents.onDidChangeCursorSelection?.(updateLocalCursor);

      // Custom remote cursor rendering
      const decorationsMap = new Map<number, string[]>();

      const updateRemoteCursors = () => {
        const states = provider.awareness?.getStates?.();
        if (!states) {
          console.log("⚠️ No awareness states available");
          return;
        }

        console.log("👥 Total awareness states:", states.size);
        console.log("🆔 My client ID:", provider.awareness?.clientID);

        const decorationsToSet: Array<{
          clientId: number;
          decorations: unknown[];
        }> = [];

        states.forEach((state: unknown, clientId: number) => {
          console.log(`\n👤 Client ${clientId}:`, state);

          // Skip our own cursor
          if (clientId === provider.awareness?.clientID) {
            console.log("⏭️ Skipping own cursor");
            return;
          }

          const stateAny = state as Record<string, unknown>;
          const user = stateAny?.user as { name?: string; color?: string } | undefined;
          const selection = stateAny?.selection as {
            startLineNumber?: number;
            startColumn?: number;
            endLineNumber?: number;
            endColumn?: number;
          } | undefined;

          console.log(`   User:`, user);
          console.log(`   Selection:`, selection);

          // Render cursor/selection if we have user info and selection data
          if (user && selection) {
            console.log(
              `✨ Rendering cursor for ${user.name || "Anonymous"} at`,
              selection
            );
            // selection is in Monaco's IRange format: { startLineNumber, startColumn, endLineNumber, endColumn }
            const decorations = [
              {
                range: {
                  startLineNumber: selection.startLineNumber || 1,
                  startColumn: selection.startColumn || 1,
                  endLineNumber: selection.endLineNumber || 1,
                  endColumn: selection.endColumn || 1,
                },
                options: {
                  className: `remote-selection-${clientId}`,
                  hoverMessage: { value: `👤 ${user.name || "Anonymous"}` },
                  beforeContentClassName: `remote-cursor-${clientId}`,
                },
              },
            ];

            decorationsToSet.push({ clientId, decorations });

            // Inject CSS for this user's cursor/selection color
            if (!document.getElementById(`remote-cursor-style-${clientId}`)) {
              const style = document.createElement("style");
              style.id = `remote-cursor-style-${clientId}`;
              const userColor = user.color || "#ff6b6b";
              style.textContent = `
                .remote-selection-${clientId} {
                  background-color: ${userColor}33 !important;
                }
                .remote-cursor-${clientId}::before {
                  content: "";
                  position: absolute;
                  width: 2px !important;
                  height: 1.2em !important;
                  background-color: ${userColor} !important;
                  animation: cursorBlink${clientId} 1s infinite;
                  margin-left: -1px;
                  z-index: 1000;
                }
                @keyframes cursorBlink${clientId} {
                  0%, 49% { opacity: 1; }
                  50%, 100% { opacity: 0.4; }
                }
              `;
              document.head.appendChild(style);
            }
          }
        });

        // Apply all decorations
        const editorWithDecorations = editor as {
          deltaDecorations?: (oldDecorations: string[], newDecorations: unknown[]) => string[];
        };
        decorationsToSet.forEach(({ clientId, decorations }) => {
          const oldDecorations = decorationsMap.get(clientId) || [];
          const newDecorations =
            editorWithDecorations.deltaDecorations?.(oldDecorations, decorations) || [];
          decorationsMap.set(clientId, newDecorations);
        });

        // Remove decorations for users who left
        decorationsMap.forEach((oldDecorations, clientId) => {
          if (!states.has(clientId)) {
            editorWithDecorations.deltaDecorations?.(oldDecorations, []);
            decorationsMap.delete(clientId);

            // Remove CSS
            const styleElement = document.getElementById(
              `remote-cursor-style-${clientId}`
            );
            if (styleElement) {
              styleElement.remove();
            }
          }
        });
      };

      // Listen for awareness changes
      console.log("🎧 Setting up awareness change listener");
      provider.awareness?.on?.("change", (changes: unknown) => {
        console.log("🔔 Awareness changed!", changes);
        updateRemoteCursors();
      });

      // Initial render
      console.log("🎬 Initial render of remote cursors");
      updateRemoteCursors();
    }

    return () => {
      // Clean up cursor update timeout
      if (cursorUpdateTimeout) {
        clearTimeout(cursorUpdateTimeout);
      }

      provider.disconnect();
      ydoc.destroy();
    };
  } catch (err) {
    console.error("Editor collaborative setup failed", err);
    return () => {};
  }
}
