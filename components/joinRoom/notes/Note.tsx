"use client";
import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { savePage, loadPage } from "@/lib/notesDB";
import { Trash2 } from "lucide-react";

interface NoteProps {
  sessionId: string;
  pageNumber: number;
  onTitleChange?: (title: string) => void;
  onDelete?: () => void;
}

function Note({ sessionId, pageNumber, onTitleChange, onDelete }: NoteProps) {
  const [title, setTitle] = useState(`Page ${pageNumber}`);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadNote = useCallback(async () => {
    try {
      const page = await loadPage(sessionId, pageNumber);
      if (page) {
        setTitle(page.title);
        setContent(page.content);
      } else {
        setTitle(`Page ${pageNumber}`);
        setContent("");
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load note:", error);
      setIsLoaded(true);
    }
  }, [sessionId, pageNumber]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      setStatus("unsaved");
      onTitleChange?.(newTitle);
    },
    [onTitleChange]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value.slice(0, 5000);
      setContent(newContent);
      setStatus("unsaved");
    },
    []
  );

  const saveNote = useCallback(async () => {
    setStatus("saving");
    try {
      await savePage({
        id: `${sessionId}-page-${pageNumber}`,
        roomId: sessionId,
        pageNumber,
        title,
        content,
        updatedAt: Date.now(),
      });
      setStatus("saved");
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save note:", error);
      setStatus("unsaved");
    }
  }, [sessionId, pageNumber, title, content]);

  // Debounced auto-save when user stops typing
  useEffect(() => {
    if (!isLoaded || status !== "unsaved") return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout - save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, title, isLoaded, status, saveNote]);
  return (
    <div className="flex-5 p-4 ">
      <div className="flex flex-col h-full">
        <div className="flex p-1 mb-3 px-2 justify-between items-center font-secondary text-md text-foreground">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="bg-transparent outline-none border-b border-transparent hover:border-foreground focus:border-mysecondary transition-colors"
            placeholder="Page title"
          />
          <div className="flex items-center gap-3">
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-500"
                title="Delete page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm ">
              <span className="text-xs text-gray-500">{content.length}/5000</span>
              <span>
                {status === "saving" && "Saving..."}
                {status === "saved" &&
                  lastSaved &&
                  `Saved at ${lastSaved.toLocaleTimeString()}`}
                {status === "unsaved" && "⚠️ Unsaved changes"}
              </span>
            </div>
          </div>
        </div>

        <textarea
          value={content}
          onChange={handleContentChange}
          maxLength={5000}
          style={{
            lineHeight: "24px",
            backgroundSize: "100% 24px",
            backgroundRepeat: "repeat-y",
            backgroundImage: `
          linear-gradient(
          to bottom,
          transparent 0px,
          transparent 23px,
          var(--color-mybackground) 23px,
          var(--color-myforeground) 24px
          )
          `,
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE and Edge
          }}
          className="w-full h-full flex-grow px-3 text-foreground text-sm resize-none outline-none bg-background dark:bg-zinc-900 dark:text-white no-scrollbar"
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
}

export default Note;
