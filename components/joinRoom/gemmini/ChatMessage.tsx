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
        <Avatar className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
          <AvatarFallback className="bg-transparent text-white text-sm font-bold">
            AI
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-xl p-4 shadow-sm backdrop-blur-sm">
            <p className="text-foreground font-secondary leading-relaxed">{message}</p>
            {codeSnippet && (
              <div className="bg-black/40 border border-border/30 rounded-lg p-4 mt-3 overflow-x-auto">
                <code className="text-sm text-green-400 font-mono whitespace-pre">
                  {codeSnippet}
                </code>
              </div>
            )}
          </div>
          <time className="text-xs text-muted-foreground mt-1 block">
            {timestamp}
          </time>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 justify-end">
      <div className="flex-1 max-w-2xl">
        <div className="bg-mysecondary/80 text-white rounded-xl p-4 shadow-md ml-auto border border-mysecondary/30">
          <p className="font-secondary leading-relaxed">{message}</p>
        </div>
        <time className="text-xs text-muted-foreground mt-1 block text-right">
          {timestamp}
        </time>
      </div>
      <Avatar className="w-8 h-8 bg-mysecondary/90 shadow-md ring-2 ring-mysecondary/20">
        <AvatarFallback className="bg-transparent text-white text-sm font-bold">
          U
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export default ChatMessage;
