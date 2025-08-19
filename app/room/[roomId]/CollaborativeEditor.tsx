"use client";
import dynamic from "next/dynamic";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// All heavy/editor-specific libs (monaco, yjs, y-monaco, workers) are loaded only in the onMount handler.
// This file stays as lightweight as possible to avoid accidental SSR evaluation of browser globals.

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 8, fontSize: 12 }}>Loading editor...</div>
  ),
});

export default function CollaborativeEditor({ roomId }: { roomId: string }) {
  // Type is imported lazily, so keep a minimal structural type here.
  type MinimalEditor = { getModel: () => { uri?: unknown } | null };
  // Monaco namespace subset used; typed as unknown then narrowed when used.
  const editorRef = useRef<MinimalEditor | null>(null);
  const monacoRef = useRef<unknown>(null);
  const cleanupRef = useRef<() => void>(() => {});
  // Supported languages (only the ones requested). "c" reuses Monaco's cpp tokenizer.
  const languages = useMemo(
    () => [
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
        contribution:
          "monaco-editor/esm/vs/basic-languages/java/java.contribution",
      },
      {
        id: "c",
        label: "C",
        monacoId: "cpp",
        contribution:
          "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution",
      },
      {
        id: "cpp",
        label: "C++",
        monacoId: "cpp",
        contribution:
          "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution",
      },
    ],
    []
  );
  const [languageId, setLanguageId] = useState("javascript");

  const applyLanguageToModel = useCallback(
    (lang: string) => {
      if (!monacoRef.current || !editorRef.current) return;
      const model = editorRef.current.getModel();
      const m = monacoRef.current as {
        editor?: { setModelLanguage?: (mdl: unknown, l: string) => void };
      };
      const def = languages.find((l) => l.id === lang) || languages[0];
      if (model && m.editor?.setModelLanguage) {
        m.editor.setModelLanguage(model, def.monacoId);
      }
    },
    [languages]
  );

  const selectLanguage = useCallback(
    (lang: string) => {
      setLanguageId(lang);
      applyLanguageToModel(lang);
    },
    [applyLanguageToModel]
  );

  useEffect(() => () => cleanupRef.current(), []); // run stored cleanup on unmount

  return (
    <div style={{ height: "100vh" }}>
      {/* <EditorNavBar /> */}{" "}
      <div className="h-12 flex items-center gap-4 px-4 bg-background border-foreground border-b-1 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-mysecondary min-w-32 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-muted transition focus:outline-mysecondary">
            {languages.find((l) => l.id === languageId)?.label || languageId}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((l) => (
              <DropdownMenuItem
                key={l.id}
                onClick={() => selectLanguage(l.id)}
                className={l.id === languageId ? "font-semibold" : undefined}
              >
                {l.label}
                {l.id === languageId && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage={languageId}
        defaultValue="// Start coding together!"
        onMount={async (editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
          // Defer heavy imports until editor is actually on the client.
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
              (event: {
                status: "connected" | "disconnected" | "connecting";
              }) => {
                console.log("WebSocket status:", event.status);
              }
            );

            const ytext = ydoc.getText("monaco");

            const { MonacoBinding } = await import("y-monaco");
            // Dynamically load basic language contribution if needed
            const selected = languages.find((l) => l.id === languageId);
            if (selected?.contribution) {
              const already = monaco.languages
                .getLanguages()
                .some((l) => l.id === selected.monacoId);
              if (!already) {
                try {
                  await import(selected.contribution);
                } catch (e) {
                  console.warn(
                    "Failed to load language contribution for",
                    selected.id,
                    e
                  );
                }
              }
            }
            const model = editor.getModel();
            if (model) {
              new MonacoBinding(
                ytext,
                model,
                new Set([editor]),
                provider.awareness
              );
              applyLanguageToModel(languageId);
            }

            cleanupRef.current = () => {
              provider.disconnect();
              ydoc.destroy();
            };
          } catch (err) {
            console.error("Editor collaborative setup failed", err);
          }
        }}
      />
    </div>
  );
}
