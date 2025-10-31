import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_MESSAGE_LENGTH = 5000;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const remainingChars = MAX_MESSAGE_LENGTH - message.length;

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
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  placeholder="Ask about code, programming, or computer science..."
                  className={`min-h-[2.5rem] pr-12 resize-none font-secondary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Message input"
                  disabled={isLoading}
                  maxLength={MAX_MESSAGE_LENGTH}
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
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            AI can make mistakes. Verify important information.
          </p>
          {message.length > 0 && (
            <p className={`text-xs ${remainingChars < 100 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {remainingChars} chars left
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

export default ChatInput;
