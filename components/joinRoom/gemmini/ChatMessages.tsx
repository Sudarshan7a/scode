import React from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const chatHistory = [
  {
    id: 1,
    type: "ai" as const,
    message:
      "Hello! I'm your AI coding assistant. I'm here to help you with programming questions, code reviews, and technical guidance. How can I assist you today?",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    codeSnippet: "",
  },
];

function ChatMessages() {
  return (
    <>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6 ">
          <hr className="h-2" />
          <div className="max-w-4xl mx-auto space-y-3">
            {chatHistory.map((chat) => (
              <ChatMessage
                key={chat.id}
                type={chat.type}
                message={chat.message}
                timestamp={chat.timestamp}
                codeSnippet={chat.codeSnippet}
              />
            ))}
          </div>
          <hr className="h-2" />
        </ScrollArea>
      </main>
    </>
  );
}

export default ChatMessages;
