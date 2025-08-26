import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function ChatHeader() {
  return (
    <header className="border-b border-border border-b-myforeground bg-card px-6 py-0.5 max-h-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 bg-mysecondary">
            <AvatarFallback className="bg-mysecondary text-primary-foreground text-sm font-medium">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-md font-semibold text-foreground font-secondary">
              AI Assistant
            </h1>
            <p className="text-sm text-foreground">Online • Ready to help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Clear chat">
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
