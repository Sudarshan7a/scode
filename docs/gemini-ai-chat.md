# Gemini AI Chat Integration

## Overview

The AI chat feature provides real-time coding assistance using Google's Gemini AI. It's context-aware, understanding both your questions and the code in your editor.

## Architecture

### Components Flow

```
User Input → ChatInput.tsx
    ↓
useAIChat Hook → API Route (/api/ai/chat)
    ↓
Google Gemini API → Response Processing
    ↓
ChatMessages.tsx → Display
```

## Key Files

### 1. Hook: `hooks/useAIChat.ts`

**Purpose**: Manages chat state and API communication

**Key Features**:
- Message state management
- API request handling with retry logic (up to 2 retries)
- Code snippet extraction from responses
- Editor context integration
- Error handling

**Main Functions**:
- `sendMessage(userMessage)` - Sends message to AI with editor context
- `clearMessages()` - Resets chat to initial state
- `extractCodeSnippet(text)` - Parses code blocks from AI responses

**State**:
```typescript
{
  messages: Message[],      // Chat history
  isLoading: boolean,        // Request in progress
  error: string | null,      // Error message
  sendMessage: Function,     // Send message function
  clearMessages: Function    // Clear chat function
}
```

### 2. API Route: `app/api/ai/chat/route.ts`

**Purpose**: Server-side handler for AI requests

**Request Body**:
```typescript
{
  message: string,           // User's question (max 5000 chars)
  editorCode?: string,       // Current editor code (max 10000 chars)
  language?: string          // Programming language
}
```

**Response**:
```typescript
{
  message: string,           // AI response
  timestamp: string          // ISO timestamp
}
```

**Security**:
- Input validation (message length, code length)
- API key stored in environment variables
- Sanitized logging (no sensitive data)
- Rate limiting ready

### 3. UI Components

**ChatMessages.tsx**
- Displays message history
- Auto-scrolls to latest message
- Shows typing indicator during loading
- Handles error display

**ChatMessage.tsx**
- Renders individual messages
- Supports markdown formatting
- Displays code snippets with syntax highlighting
- Shows timestamps

**ChatInput.tsx**
- Text input with send button
- Character count validation
- Enter key to send (Shift+Enter for new line)
- Disabled during loading

## How It Works

### 1. User Sends Message

```typescript
// User types in ChatInput
const handleSend = () => {
  sendMessage(inputValue);
};
```

### 2. Hook Processes Request

```typescript
// useAIChat.ts
const sendMessage = async (userMessage: string) => {
  // Add user message to chat
  setMessages(prev => [...prev, userMsg]);
  
  // Send to API with editor context
  const response = await axiosInstance.post("/api/ai/chat", {
    message: userMessage,
    editorCode: editorCode.trim() ? editorCode : undefined,
    language: languageId,
  });
  
  // Extract code snippets and add AI response
  const { message, codeSnippet } = extractCodeSnippet(response.data.message);
  setMessages(prev => [...prev, aiMsg]);
};
```

### 3. API Route Calls Gemini

```typescript
// route.ts
const ai = new GoogleGenAI({ apiKey });

// Build prompt with system instructions + user message + editor code
let prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`;
if (editorCode) {
  prompt += `\n\nCurrent code in editor (${language}):\n\`\`\`${language}\n${editorCode}\n\`\`\``;
}

// Get AI response
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-exp",
  contents: prompt,
});
```

### 4. Response Displayed

```typescript
// ChatMessages.tsx renders the response
<ChatMessage
  type="ai"
  message={aiResponse.message}
  codeSnippet={aiResponse.codeSnippet}
  timestamp={aiResponse.timestamp}
/>
```

## System Prompt

The AI is instructed to:
- Only answer programming/CS questions
- Format responses with short paragraphs
- Use bullet points and lists
- Include code examples when relevant
- Decline non-programming questions politely

## Context Awareness

The AI receives:
1. **User's question** - The actual query
2. **Editor code** - Current code in the Monaco editor
3. **Language** - Programming language selected
4. **System prompt** - Behavior instructions

Example prompt sent to Gemini:
```
You are a helpful AI coding assistant...

User question: How do I fix this error?

Current code in editor (typescript):
```typescript
function hello() {
  console.log("Hello")
}
```
```

## Error Handling

### Client-Side (useAIChat.ts)
- Validates message length before sending
- Retries failed requests (up to 2 times)
- Shows user-friendly error messages
- Logs errors for debugging

### Server-Side (route.ts)
- Validates all inputs
- Checks API key configuration
- Handles Gemini API errors
- Returns appropriate HTTP status codes

## Configuration

### Environment Variables

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

### Limits

```typescript
MAX_MESSAGE_LENGTH = 5000    // User message max chars
MAX_CODE_LENGTH = 10000      // Editor code max chars
```

### Retry Logic

- Max retries: 2
- Retry delay: 1000ms
- Exponential backoff: No (fixed delay)

## Usage Example

```typescript
import { useAIChat } from "@/hooks/useAIChat";

function ChatComponent() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  
  return (
    <div>
      <ChatMessages messages={messages} isLoading={isLoading} error={error} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

## Message Format

```typescript
interface Message {
  id: number;              // Unique identifier (timestamp)
  type: "user" | "ai";     // Message sender
  message: string;         // Text content
  timestamp: string;       // Display time (HH:MM format)
  codeSnippet?: string;    // Extracted code block (optional)
}
```

## Code Snippet Extraction

AI responses with code blocks are automatically parsed:

**Input** (from Gemini):
```
Here's how to fix it:
```typescript
function hello() {
  console.log("Hello!");
}
```
That should work!
```

**Output**:
```typescript
{
  message: "Here's how to fix it:\n\nThat should work!",
  codeSnippet: "function hello() {\n  console.log(\"Hello!\");\n}"
}
```

## Best Practices

1. **Keep messages focused** - Ask specific programming questions
2. **Provide context** - Have relevant code in the editor
3. **Select correct language** - Helps AI understand your code
4. **Clear chat periodically** - Prevents context overload
5. **Check error messages** - They provide helpful debugging info

## Troubleshooting

### "AI service not configured"
- Check `GEMINI_API_KEY` in `.env.local`
- Restart development server after adding key

### "Failed to get AI response"
- Check internet connection
- Verify Gemini API quota/limits
- Check browser console for detailed errors

### "Message too long"
- Reduce message length (max 5000 chars)
- Simplify your question

### "Code too long"
- Reduce editor code (max 10000 chars)
- Focus on relevant code sections

## Future Enhancements

- [ ] Streaming responses for faster feedback
- [ ] Chat history persistence
- [ ] Multi-turn conversation context
- [ ] Code execution and testing
- [ ] File upload support
- [ ] Voice input/output
- [ ] Custom system prompts per room
- [ ] AI model selection (GPT-4, Claude, etc.)

## Security Considerations

- API key never exposed to client
- Input validation on both client and server
- No PII logged
- Rate limiting ready (implement with Upstash Redis)
- Sanitized error messages (no internal details leaked)

---

**Related Files**:
- `hooks/useAIChat.ts` - Chat logic
- `app/api/ai/chat/route.ts` - API endpoint
- `components/joinRoom/gemmini/ChatMessages.tsx` - Message display
- `components/joinRoom/gemmini/ChatMessage.tsx` - Individual message
- `components/joinRoom/gemmini/ChatInput.tsx` - User input
- `contexts/EditorContext.tsx` - Editor state provider
