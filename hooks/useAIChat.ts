import { useState, useCallback } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

interface Message {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
  codeSnippet?: string;
}

const INITIAL_MESSAGE: Message = {
  id: 0,
  type: "ai",
  message: "Hello! I'm your AI coding assistant. I can help you with programming questions, code debugging, computer science concepts, and software development. How can I assist you today?",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

function extractCodeSnippet(text: string): { message: string; codeSnippet?: string } {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);
  
  if (match) {
    const codeSnippet = match[1].trim();
    const message = text.replace(codeBlockRegex, "").trim();
    return { message, codeSnippet };
  }
  
  return { message: text };
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
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

      const { message, codeSnippet } = extractCodeSnippet(response.data.message);

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "ai",
        message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        codeSnippet,
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
    setMessages([INITIAL_MESSAGE]);
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
