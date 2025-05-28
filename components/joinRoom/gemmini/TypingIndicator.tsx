import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <Avatar className="w-8 h-8 bg-mysecondary">
          <AvatarFallback className="bg-mysecondary text-primary-foreground text-sm font-medium">
            AI
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm w-16">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
