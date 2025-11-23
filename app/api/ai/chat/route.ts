import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  aiChatLimiter,
  aiChatHourlyLimiter,
  getUserIdOrIP,
} from "@/lib/rateLimiter";

const SYSTEM_PROMPT = `You are a helpful AI coding assistant. You MUST ONLY respond to questions about:
- Programming and software development
- Computer science concepts
- Code debugging and optimization
- Software architecture and design patterns
- Development tools and technologies

If the user asks about anything outside these topics, politely decline and remind them you can only help with programming and computer science topics.

Formatting rules:
- Break responses into short, readable paragraphs (2-3 sentences max per paragraph)
- Use bullet points or numbered lists for multiple items
- Add line breaks between sections for better readability
- Never write one large block of text
- Include code examples when relevant, properly formatted with markdown

Keep responses concise, accurate, and well-structured.`;

const MAX_MESSAGE_LENGTH = 5000;
const MAX_CODE_LENGTH = 10000;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - dual tier protection
    const identifier = getUserIdOrIP(req);

    // Check per-minute limit
    const { success: minuteOk } = await aiChatLimiter.limit(identifier);
    if (!minuteOk) {
      console.warn(
        `[RateLimit] AI chat blocked: ${identifier} (minute limit exceeded)`
      );
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Maximum 10 AI requests per minute. Please slow down.",
        },
        { status: 429 }
      );
    }

    // Check per-hour limit
    const { success: hourlyOk } = await aiChatHourlyLimiter.limit(identifier);
    if (!hourlyOk) {
      console.warn(
        `[RateLimit] AI chat blocked: ${identifier} (hourly limit exceeded)`
      );
      return NextResponse.json(
        {
          error:
            "Hourly rate limit exceeded. Maximum 50 AI requests per hour. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, editorCode, language } = body;

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (editorCode && editorCode.length > MAX_CODE_LENGTH) {
      return NextResponse.json(
        { error: `Code too long. Maximum ${MAX_CODE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Server-side logging (sanitized)
    console.log("[SERVER] AI request:", {
      messageLength: message.length,
      language: language || "none",
      hasCode: !!editorCode,
      codeLength: editorCode?.length || 0,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[SERVER] GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.models.get("gemini-2.0-flash-exp");

    let prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`;

    if (editorCode && editorCode.trim()) {
      prompt += `\n\nCurrent code in editor (${
        language || "unknown"
      })::\n\`\`\`${language || ""}\n${editorCode}\n\`\`\``;
    }

    const response = await model.generateContent(prompt);
    const result = await response.response;
    const text = result.text();

    if (!text) {
      throw new Error("Invalid response from AI service");
    }

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[SERVER] AI chat error:", errorMessage);
    if (errorStack) {
      console.error("[SERVER] Error stack:", errorStack);
    }

    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
