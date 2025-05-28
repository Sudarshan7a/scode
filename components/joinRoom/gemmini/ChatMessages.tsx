import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

// Sample chat data with more history
const chatHistory = [
  {
    id: 1,
    type: "ai" as const,
    message:
      "Hello! I am your AI assistant. How can I help you today? I am here to answer questions, provide information, and assist with various tasks.",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    type: "user" as const,
    message: "Hi! I need help setting up a new React project with TypeScript.",
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    type: "ai" as const,
    message:
      "I would be happy to help you set up a React project with TypeScript! Here are the steps:",
    timestamp: "10:31 AM",
    codeSnippet: `npx create-react-app my-app --template typescript
cd my-app
npm start`,
  },
  {
    id: 4,
    type: "user" as const,
    message: "Great! What about adding Tailwind CSS to this setup?",
    timestamp: "10:33 AM",
  },
  {
    id: 5,
    type: "ai" as const,
    message:
      "Excellent choice! Here is how to add Tailwind CSS to your React TypeScript project:",
    timestamp: "10:33 AM",
    codeSnippet: `npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`,
  },
  {
    id: 6,
    type: "user" as const,
    message:
      "Thanks! Now I need to configure the tailwind.config.js file. What should I include?",
    timestamp: "10:35 AM",
  },
  {
    id: 7,
    type: "ai" as const,
    message: "Here is a basic Tailwind configuration for your React project:",
    timestamp: "10:35 AM",
    codeSnippet: `module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
  },
  {
    id: 8,
    type: "user" as const,
    message: "Perfect! What about adding custom fonts and colors to the theme?",
    timestamp: "10:37 AM",
  },
  {
    id: 9,
    type: "ai" as const,
    message: "You can extend the theme with custom fonts and colors like this:",
    timestamp: "10:37 AM",
    codeSnippet: `theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#EF4444',
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif'],
      'serif': ['Merriweather', 'ui-serif'],
    },
  },
}`,
  },
  {
    id: 10,
    type: "user" as const,
    message: "Can you help me understand how to implement a React component?",
    timestamp: "10:40 AM",
  },
  {
    id: 11,
    type: "ai" as const,
    message:
      "I would be happy to help you with React components! Here is a basic structure:",
    timestamp: "10:40 AM",
    codeSnippet: `function MyComponent() {
  return (
    <div className="my-component">
      <h1>Hello World</h1>
    </div>
  );
}`,
  },
];

function ChatMessages() {
  return (
    <>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6 ">
          <hr className="h-2" />
          <div className="max-w-4xl mx-auto space-y-3">
            {chatHistory.map((chat) => (
              <ChatMessage
                key={chat.id}
                type={chat.type}
                message={chat.message}
                timestamp={chat.timestamp}
                codeSnippet={chat.codeSnippet}
              />
            ))}

            {/* Typing Indicator */}
            <TypingIndicator />
          </div>
          <hr className="h-2" />
        </ScrollArea>
      </main>
    </>
  );
}

export default ChatMessages;
