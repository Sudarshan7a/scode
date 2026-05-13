"use client";
import dynamic from "next/dynamic";
import { loader } from "@monaco-editor/react";
import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type {
  LanguageDef,
  EditorLike,
  MonacoLike,
} from "@/app/room/editorHelpers";
import {
  initializeEditor,
  loadLanguageContribution,
} from "@/app/room/editorHelpers";

loader.config({
  paths: {
    vs: "/monaco/vs",
  },
});

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 8, fontSize: 12 }}>Loading editor...</div>
  ),
});

// Export type for parent components to use
export type EditorContainerRef = {
  getCode: () => string;
  setCode: (code: string) => void;
};

type EditorContainerProps = {
  roomId: string;
  languages: LanguageDef[];
  languageId: string;
};

const EditorContainer = forwardRef<EditorContainerRef, EditorContainerProps>(
  ({ roomId, languages, languageId }, ref) => {
    const editorRef = useRef<EditorLike | null>(null);
    const monacoRef = useRef<MonacoLike | null>(null);
    const cleanupRef = useRef<() => void>(() => {});

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getCode: () => {
        const model = editorRef.current?.getModel() as {
          getValue?: () => string;
        } | null;
        return model?.getValue?.() || "";
      },
      setCode: (code: string) => {
        const model = editorRef.current?.getModel() as {
          setValue?: (value: string) => void;
        } | null;
        if (model && typeof model.setValue === "function") {
          model.setValue(code);
        }
      },
    }));

    useEffect(() => {
      return () => {
        try {
          cleanupRef.current();
        } catch (err) {
          console.error("Error during editor cleanup:", err);
        }
      };
    }, []);

    const applyLanguageLocally = useCallback(
      (lang: string) => {
        const m = monacoRef.current;
        const editor = editorRef.current;
        if (!m || !editor) return;
        const model = editor.getModel();
        const def = languages.find((l) => l.id === lang) || languages[0];
        if (model && m.editor?.setModelLanguage) {
          m.editor.setModelLanguage(model, def.monacoId);
        }
      },
      [languages],
    );

    // react to language changes at runtime (user selects a new language)
    useEffect(() => {
      if (!editorRef.current || !monacoRef.current) return;
      const selected =
        languages.find((l) => l.id === languageId) || languages[0];
      // ensure Monaco has the language contribution loaded, then update model
      (async () => {
        try {
          await loadLanguageContribution(
            monacoRef.current as MonacoLike,
            selected,
          );
          applyLanguageLocally(languageId);
        } catch (err) {
          console.error("Failed to load language contribution:", err);
        }
      })();
    }, [languageId, languages, applyLanguageLocally]);

    return (
      <Editor
        height="100%"
        theme="vs-dark"
        language={languageId}
        path={`inmemory://model/${roomId}`}
        defaultValue="// Start coding together!"
        onMount={async (editor, monaco) => {
          editorRef.current = editor as EditorLike;
          monacoRef.current = monaco as unknown as MonacoLike;
          try {
            const cleanup = await initializeEditor({
              editor: editor as EditorLike,
              monaco: monaco as unknown as MonacoLike,
              roomId,
              languages,
              languageId,
              applyLanguageToModel: applyLanguageLocally,
            });
            cleanupRef.current =
              typeof cleanup === "function" ? cleanup : () => {};
          } catch (err) {
            console.error("Failed to initialize editor:", err);
            cleanupRef.current = () => {};
          }
        }}
      />
    );
  },
);

EditorContainer.displayName = "EditorContainer";

export default EditorContainer;
