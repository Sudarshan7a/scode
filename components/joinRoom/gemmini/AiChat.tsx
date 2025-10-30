"use client";
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useAIChat } from "@/hooks/useAIChat";

function AiChat() {
  const { messages, isLoading, error, sendMessage } = useAIChat();

  return (
    <div className="h-[94vh] bg-background flex flex-col">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} error={error} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default AiChat;
