"use client";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CollaborativeEditor({ roomId }: { roomId: string }) {
  return (
    <div style={{ height: "100vh" }}>
      {/* <EditorNavBar /> */}{" "}
      <div className="h-12 bg-background border-foreground border-b-1"> </div>
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// Monaco loaded ✔ — Yjs wiring next"
      />
    </div>
  );
}
