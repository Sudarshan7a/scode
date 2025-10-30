import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
        <AvatarFallback className="bg-transparent text-white text-sm font-bold">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-xl p-4 shadow-sm w-20 backdrop-blur-sm">
          <div className="flex space-x-1.5 justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
