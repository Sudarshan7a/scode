"use client";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";

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
  const editorRef = useRef<{ getModel: () => unknown } | null>(null);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => () => cleanupRef.current(), []); // run stored cleanup on unmount

  return (
    <div style={{ height: "80vh" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Start coding together!"
        onMount={async (editor) => {
          editorRef.current = editor;
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
              process.env.MY_WEBSOCKET_DOMAIN as string,
              roomId,
              ydoc
            );
            const ytext = ydoc.getText("monaco");

            const { MonacoBinding } = await import("y-monaco");
            const model = editor.getModel();
            if (model) {
              new MonacoBinding(
                ytext,
                model,
                new Set([editor]),
                provider.awareness
              );
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
