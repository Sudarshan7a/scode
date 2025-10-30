import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <footer className="border-t border-border px-6  py-1 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about code, programming, or computer science..."
                  className="min-h-[2.5rem] pr-12 resize-none font-secondary"
                  aria-label="Message input"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 bottom-1 h-8 w-8"
                  aria-label="Send message"
                  disabled={!message.trim() || isLoading}
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
          </div>
        </form>
        <p className="text-xs text-foreground mt-1 text-center">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </footer>
  );
}

export default ChatInput;
