"use client";
import React from "react";
import { useEffect, useState } from "react";

function Note({ sessionId }: { sessionId: string }) {
  const storageKey = `note-${sessionId}`;

  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setContent(saved);
  }, [storageKey]);

  useEffect(() => {
    if (content === "") return;

    setStatus("saving");
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, content);
      setStatus("saved");
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [content, storageKey]);
  return (
    <div className="flex-5 p-4 ">
      <div className="flex flex-col h-full">
        <div className="flex p-1 mb-3 px-2 justify-between items-center font-secondary text-md text-foreground">
          <div>Title of the page</div>
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
          onChange={(e) => {
            setContent(e.target.value);
            setStatus("unsaved");
          }}
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
