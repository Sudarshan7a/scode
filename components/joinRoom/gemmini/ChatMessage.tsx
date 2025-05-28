import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  type: "ai" | "user";
  message: string;
  timestamp: string;
  codeSnippet?: string;
}

function ChatMessage({
  type,
  message,
  timestamp,
  codeSnippet,
}: ChatMessageProps) {
  if (type === "ai") {
    return (
      <div className="flex items-start space-x-3 mt-1">
        <Avatar className="w-8 h-8 bg-mysecondary">
          <AvatarFallback className="bg-mysecondary text-primary-foreground text-sm font-medium">
            AI
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className=" border border-border rounded-lg p-3 shadow-sm">
            <p className="text-foreground font-secondary mb-3">{message}</p>
            {codeSnippet && (
              <div className="bg-muted rounded-md p-3 mb-3">
                <code className="text-sm text-foreground font-mono">
                  {codeSnippet}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 justify-end">
      <div className="flex-1 max-w-2xl">
        <div className="bg-muted-foreground text-primary-foreground rounded-lg p-4 shadow-sm ml-auto">
          <p className="font-secondary">{message}</p>
        </div>{" "}
        <time className="text-xs text-foreground mt-1 block text-right">
          {timestamp}
        </time>
      </div>
      <Avatar className="w-8 h-8 bg-secondary">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
          U
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export default ChatMessage;
