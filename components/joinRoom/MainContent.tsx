import React from "react";
import NotesPage from "./notes/NotesPage";
import Call from "./call/call";
import AiChat from "./gemmini/AiChat";

type MainContentProps = {
  renderTab: "Notes" | "Call" | "AI chat";
};

function MainContent({ renderTab }: MainContentProps) {
  return (
    <div>
      {renderTab === "Notes" ? (
        <NotesPage sessionId="new session" />
      ) : renderTab === "Call" ? (
        <Call />
      ) : (
        <AiChat />
      )}
    </div>
  );
}

export default MainContent;
