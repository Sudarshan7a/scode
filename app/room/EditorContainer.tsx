"use client";
import dynamic from "next/dynamic";
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
        const model = editorRef.current?.getModel();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (model as any)?.getValue?.() || "";
      },
      setCode: (code: string) => {
        const model = editorRef.current?.getModel();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (model && typeof (model as any).setValue === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (model as any).setValue(code);
        }
      },
    }));

    useEffect(() => {
      return () => cleanupRef.current();
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
      [languages]
    );

    // react to language changes at runtime (user selects a new language)
    useEffect(() => {
      if (!editorRef.current || !monacoRef.current) return;
      const selected = languages.find((l) => l.id === languageId);
      // ensure Monaco has the language contribution loaded, then update model
      (async () => {
        await loadLanguageContribution(
          monacoRef.current as MonacoLike,
          selected
        );
        applyLanguageLocally(languageId);
      })();
    }, [languageId, languages, applyLanguageLocally]);

    return (
      <Editor
        height="100%"
        theme="vs-dark"
        language={languageId}
        path={`inmemory://model/${roomId}.${languageId === 'typescript' ? 'ts' : languageId === 'javascript' ? 'js' : 'txt'}`}
        defaultValue="// Start coding together!"
        onMount={async (editor, monaco) => {
          editorRef.current = editor as EditorLike;
          monacoRef.current = monaco as unknown as MonacoLike;
          const cleanup = await initializeEditor({
            editor: editor as EditorLike,
            monaco: monaco as unknown as MonacoLike,
            roomId,
            languages,
            languageId,
            // provide a local apply that uses the container refs (parent's callback
            // may not have access to the container-local editor/monaco refs)
            applyLanguageToModel: applyLanguageLocally,
          });
          cleanupRef.current = cleanup;
        }}
      />
    );
  }
);

EditorContainer.displayName = "EditorContainer";

export default EditorContainer;
