import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ChatInput() {
  return (
    <footer className="border-t border-border px-6  py-1 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Type your message here..."
                className="min-h-[2.5rem] pr-12 resize-none font-secondary"
                aria-label="Message input"
              />
              <Button
                size="icon"
                className="absolute right-1 bottom-1 h-8 w-8"
                aria-label="Send message"
              >
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Voice input">
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </Button>
        </div>
        <p className="text-xs text-foreground mt-1 text-center">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </footer>
  );
}

export default ChatInput;
