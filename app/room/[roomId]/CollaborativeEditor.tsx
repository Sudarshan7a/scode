"use client";
import { useState, useCallback, useMemo } from "react";
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

// All heavy/editor-specific libs (monaco, yjs, y-monaco, workers) are loaded only in the onMount handler.
// This file stays as lightweight as possible to avoid accidental SSR evaluation of browser globals.

import EditorContainer from "@/app/room/EditorContainer";

import { SUPPORTED_LANGUAGES } from "@/app/room/editorHelpers";

// --- Component ---

// Disable complexity lint for this component; it orchestrates several
// client-only initialization steps and extracting further would add noise.
// Disable complexity check for this orchestration component.
export default function CollaborativeEditor({
  roomId,
  isHost = false,
  onEndSession,
  isEnding = false,
}: {
  roomId: string;
  isHost?: boolean;
  onEndSession?: () => Promise<void>;
  isEnding?: boolean;
}) {
  // render a page and check if the room exists and live if not then show 404
  //if room schedule then show when will it start and if ended show  ended
  // otherwise show the editor
  // Monaco editor instance is created in EditorContainer on mount.
  // Monaco namespace subset used; the container handles editor refs and cleanup.
  // Supported languages (kept in a top-level constant for clarity)
  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);
  const [languageId, setLanguageId] = useState("javascript");

  const selectLanguage = useCallback((lang: string) => setLanguageId(lang), []);
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
                onClick={() => selectLanguage(l.id)}
                className={l.id === languageId ? "font-semibold" : undefined}
              >
                {l.label}
                {l.id === languageId && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* End Session Button - Only shown for hosts */}
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
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <LanguageSelector />
      <EditorContainer
        roomId={roomId}
        languages={languages}
        languageId={languageId}
      />
    </div>
  );
}
