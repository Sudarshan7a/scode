"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface EditorContextValue {
  editorCode: string;
  languageId: string;
  setEditorCode: (code: string) => void;
  setLanguageId: (lang: string) => void;
  getEditorCode: () => string;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editorCode, setEditorCode] = useState("");
  const [languageId, setLanguageId] = useState("javascript");

  const getEditorCode = useCallback(() => editorCode, [editorCode]);

  return (
    <EditorContext.Provider
      value={{
        editorCode,
        languageId,
        setEditorCode,
        setLanguageId,
        getEditorCode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return context;
}
