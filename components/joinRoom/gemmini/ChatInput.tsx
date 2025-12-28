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
  const [showLimitError, setShowLimitError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.length > MAX_MESSAGE_LENGTH) {
      setShowLimitError(true);
      return;
    }
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      setShowLimitError(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setMessage(newValue);
    if (showLimitError && newValue.length <= MAX_MESSAGE_LENGTH) {
      setShowLimitError(false);
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
                  onChange={handleMessageChange}
                  placeholder="Ask about code, programming, or computer science..."
                  className={`min-h-10 pr-12 resize-none font-secondary ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
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
        <div className="mt-1">
          {showLimitError ? (
            <p className="text-xs text-red-500">
              Message too long. Please reduce the input length.
            </p>
          ) : (
            <p className="text-xs text-foreground">
              AI can make mistakes. Verify important information.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

export default ChatInput;
