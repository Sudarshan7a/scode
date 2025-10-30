import { useState, useCallback } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { useEditorContext } from "@/contexts/EditorContext";

interface Message {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
  codeSnippet?: string;
}

const MAX_MESSAGE_LENGTH = 5000;

function getFormattedTimestamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INITIAL_MESSAGE: Message = {
  id: 0,
  type: "ai",
  message: "Hello! I'm your AI coding assistant. I can help you with programming questions, code debugging, computer science concepts, and software development. How can I assist you today?",
  timestamp: getFormattedTimestamp(),
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
  const { editorCode, languageId } = useEditorContext();

  const sendMessage = useCallback(async (userMessage: string, retryCount = 0) => {
    if (!userMessage.trim()) return;

    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      message: userMessage,
      timestamp: getFormattedTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Client-side logging
    console.log("[CLIENT] AI request:", {
      messageLength: userMessage.length,
      language: languageId,
      hasCode: !!editorCode.trim(),
      codeLength: editorCode.length,
    });

    try {
      const response = await axiosInstance.post("/api/ai/chat", {
        message: userMessage,
        editorCode: editorCode.trim() ? editorCode : undefined,
        language: languageId,
      });

      if (!response.data?.message) {
        throw new Error("Invalid response from server");
      }

      const { message, codeSnippet } = extractCodeSnippet(response.data.message);

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "ai",
        message,
        timestamp: getFormattedTimestamp(),
        codeSnippet,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("[CLIENT] AI error:", errorMsg);
      
      if (retryCount < 2) {
        console.log(`[CLIENT] Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => sendMessage(userMessage, retryCount + 1), 1000);
      } else {
        setError("Failed to get AI response. Please try again.");
      }
    } finally {
      if (retryCount >= 2 || !error) {
        setIsLoading(false);
      }
    }
  }, [editorCode, languageId, error]);

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
