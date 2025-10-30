import { useState, useCallback } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

interface Message {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
  codeSnippet?: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      message: userMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/ai/chat", {
        message: userMessage,
      });

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "ai",
        message: response.data.message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError("Failed to get AI response. Please try again.");
      console.error("AI chat error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
