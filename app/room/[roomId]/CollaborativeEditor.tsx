"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Play } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useUser } from "@/hooks/useUser";
import { useEditorContext } from "@/contexts/EditorContext";

// All heavy/editor-specific libs (monaco, yjs, y-monaco, workers) are loaded only in the onMount handler.
// This file stays as lightweight as possible to avoid accidental SSR evaluation of browser globals.

import EditorContainer, {
  EditorContainerRef,
} from "@/app/room/EditorContainer";

import { SUPPORTED_LANGUAGES } from "@/app/room/editorHelpers";
import { LANGUAGE_FILE_NAMES } from "@/constants/languageFileNames";

// --- Component ---

// Disable complexity lint for this component; it orchestrates several
// client-only initialization steps and extracting further would add noise.
// Disable complexity check for this orchestration component.
export default function CollaborativeEditor({
  roomId,
  isHost = false,
  onEndSession,
  isEnding = false,
  onLeaveRoom,
  isLeaving = false,
}: {
  roomId: string;
  isHost?: boolean;
  onEndSession?: () => Promise<void>;
  isEnding?: boolean;
  onLeaveRoom?: () => Promise<void>;
  isLeaving?: boolean;
}) {
  // render a page and check if the room exists and live if not then show 404
  //if room schedule then show when will it start and if ended show  ended
  // otherwise show the editor
  // Monaco editor instance is created in EditorContainer on mount.
  // Monaco namespace subset used; the container handles editor refs and cleanup.
  // Supported languages (kept in a top-level constant for clarity)
  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);
  const [languageId, setLanguageId] = useState("javascript");
  
  // Sync with EditorContext for AI chat
  const { setEditorCode, setLanguageId: setContextLanguage } = useEditorContext();

  // Editor ref to access code for execution
  const editorRef = useRef<EditorContainerRef>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const selectLanguage = useCallback((lang: string) => {
    setLanguageId(lang);
    setContextLanguage(lang);
  }, [setContextLanguage]);

  // Sync editor code to context periodically for AI chat
  useEffect(() => {
    const interval = setInterval(() => {
      const code = editorRef.current?.getCode();
      if (code !== undefined) {
        setEditorCode(code);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [setEditorCode]);

  // Handle code execution
  const handleRunCode = useCallback(async () => {
    // Get code from editor using ref
    const code = editorRef.current?.getCode();

    if (!code || code.trim() === "") {
      setError("No code to execute");
      setOutput("");
      return;
    }

    setIsExecuting(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/code-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: languageId,
          fileName: LANGUAGE_FILE_NAMES[languageId],
        }),
      });

      const result = await response.json();

      if (result.ok) {
        // stderr might contain compilation errors, warnings, or runtime errors
        if (result.error && result.error.trim()) {
          setError(result.error);
          // Don't show output when there's an error
          setOutput("");
        } else {
          // Only show output when there's no error
          setOutput(
            result.output || "Program executed successfully (no output)"
          );
          setError("");
        }
      } else {
        // API-level errors (timeouts, service errors, etc.)
        setError(result.message || result.error || "Execution failed");
        setOutput("");
      }
    } catch (err) {
      setError("Failed to execute code. Please try again.");
      setOutput("");
      console.error("Code execution error:", err);
    } finally {
      setIsExecuting(false);
    }
  }, [languageId]);

  // Single event handler using data attributes
  const handleLanguageSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const langId = e.currentTarget.dataset.langId;
      if (langId) {
        selectLanguage(langId);
      }
    },
    [selectLanguage]
  );

  // container handles cleanup on unmount
  function LanguageSelector() {
    return (
      <div className="h-12 flex items-center justify-between gap-4 px-4 bg-background border-foreground border-b-1 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-mysecondary min-w-32 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-muted transition focus:outline-mysecondary">
            {languages.find((l) => l.id === languageId)?.label || languageId}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44 border-1 border-mysecodary">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((l) => (
              <DropdownMenuItem
                key={l.id}
                data-lang-id={l.id}
                onClick={handleLanguageSelect}
                className={l.id === languageId ? "font-semibold" : undefined}
              >
                {l.label}
                {l.id === languageId && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Run Code Button */}
        <Button
          onClick={handleRunCode}
          disabled={isExecuting}
          variant="default"
          size="sm"
          className="gap-2"
        >
          {isExecuting ? (
            <>
              <LoadingSpinner size="small" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Code
            </>
          )}
        </Button>

        {/* Host sees End Session; participants see Leave Room */}
        {isHost && onEndSession && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onEndSession}
            disabled={isEnding}
            className="ml-auto"
          >
            {isEnding ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Ending Session...
              </>
            ) : (
              "End Session"
            )}
          </Button>
        )}

        {!isHost && onLeaveRoom && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onLeaveRoom}
            disabled={isLeaving}
            className="ml-auto"
          >
            {isLeaving ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Leaving...
              </>
            ) : (
              "Leave Room"
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <LanguageSelector />
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Editor Panel */}
        <ResizablePanel minSize={30} defaultSize={output || error ? 70 : 100}>
          <EditorContainer
            ref={editorRef}
            roomId={roomId}
            languages={languages}
            languageId={languageId}
          />
        </ResizablePanel>

        {/* Output/Error Panel - Only show when there's output or error */}
        {(output || error) && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} defaultSize={30}>
              <div className="h-full bg-gray-900 text-white p-4 overflow-auto scrollbar-hide">
                {/* Show errors first (compilation/runtime errors) */}
                {error && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-400 font-semibold">
                        ⚠ Error
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-red-300 bg-red-950/30 p-3 rounded border border-red-800 overflow-auto scrollbar-hide">
                      {error}
                    </pre>
                  </div>
                )}
                {/* Show output (stdout) */}
                {output && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-semibold">
                        ✓ Output
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-sm text-green-300 bg-green-950/30 p-3 rounded border border-green-800 overflow-auto scrollbar-hide">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
