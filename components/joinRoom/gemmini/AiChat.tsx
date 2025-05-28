import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

function AiChat() {
  return (
    <div className="h-[94vh] bg-background flex flex-col">
      <ChatHeader />

      <ChatMessages />
      <ChatInput />
    </div>
  );
}

export default AiChat;
