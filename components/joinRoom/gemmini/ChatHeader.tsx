import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  onClearChat?: () => void;
}

function ChatHeader({ onClearChat }: ChatHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background via-muted/20 to-background px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg ring-2 ring-orange-500/20">
            <AvatarFallback className="bg-transparent text-white text-sm font-bold">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base font-bold text-foreground font-secondary">
              AI Coding Assistant
            </h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online • Ready to help
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Clear chat" onClick={onClearChat}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
}

export default ChatHeader;
