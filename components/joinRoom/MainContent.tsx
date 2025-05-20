import React from "react";
import Notes from "./notes/Notes";
import Call from "./call/call";
import AiChat from "./gemmini/AiChat";

type MainContentProps = {
  renderTab: "Notes" | "Call" | "AI chat";
};

function MainContent({ renderTab }: MainContentProps) {
  return (
    <div className="h-7">
      {renderTab === "Notes" ? (
        <Notes />
      ) : renderTab === "Call" ? (
        <Call />
      ) : (
        <AiChat />
      )}
    </div>
  );
}

export default MainContent;
