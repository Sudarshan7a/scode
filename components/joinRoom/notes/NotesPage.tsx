import React from "react";
import Pages from "./pagesPanel";
import Note from "./Note";

interface NotesPageProps {
  sessionId: string;
}

function NotesPage({ sessionId }: NotesPageProps) {
  return (
    <div className="flex text-center h-[94vh] ">
      <Pages />
      <Note sessionId={sessionId} />
    </div>
  );
}

export default NotesPage;
