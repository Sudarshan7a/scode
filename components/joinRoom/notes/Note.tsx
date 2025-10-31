"use client";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import { savePage, loadPage } from "@/lib/notesDB";

interface NoteProps {
  sessionId: string;
  pageNumber: number;
  onTitleChange?: (title: string) => void;
}

function Note({ sessionId, pageNumber, onTitleChange }: NoteProps) {
  const [title, setTitle] = useState(`Page ${pageNumber}`);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadNote();
  }, [sessionId, pageNumber]);

  const loadNote = async () => {
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
  };

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
      setContent(e.target.value);
      setStatus("unsaved");
    },
    []
  );

  useEffect(() => {
    if (!isLoaded) return;

    setStatus("saving");
    const timeout = setTimeout(async () => {
      try {
        await savePage({
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
    }, 1000);

    return () => clearTimeout(timeout);
  }, [content, title, sessionId, pageNumber, isLoaded]);
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
          <div className="text-sm ">
            {status === "saving" && "Saving..."}
            {status === "saved" &&
              lastSaved &&
              `Saved at ${lastSaved.toLocaleTimeString()}`}
            {status === "unsaved" && "⚠️ Unsaved changes"}
          </div>
        </div>

        <textarea
          value={content}
          onChange={handleContentChange}
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
