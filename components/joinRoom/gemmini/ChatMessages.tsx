import React, { useEffect, useRef } from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
  codeSnippet?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
}

function ChatMessages({ messages, isLoading, error }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-6">
        <hr className="h-2" />
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-foreground py-8">
              <p>Ask me anything about programming or computer science!</p>
            </div>
          )}
          {messages.map((chat) => (
            <ChatMessage
              key={chat.id}
              type={chat.type}
              message={chat.message}
              timestamp={chat.timestamp}
              codeSnippet={chat.codeSnippet}
            />
          ))}
          {error && (
            <div className="text-center text-destructive py-2">
              <p>{error}</p>
            </div>
          )}
          {isLoading && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
        <hr className="h-2" />
      </ScrollArea>
    </main>
  );
}

export default ChatMessages;
