import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a helpful AI coding assistant. You MUST ONLY respond to questions about:
- Programming and software development
- Computer science concepts
- Code debugging and optimization
- Software architecture and design patterns
- Development tools and technologies

If the user asks about anything outside these topics, politely decline and remind them you can only help with programming and computer science topics.

Keep responses concise, accurate, and include code examples when relevant.`;

const MAX_MESSAGE_LENGTH = 5000;
const MAX_CODE_LENGTH = 10000;

export async function POST(req: NextRequest) {
  try {
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
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` },
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

    let prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`;
    
    if (editorCode && editorCode.trim()) {
      prompt += `\n\nCurrent code in editor (${language || "unknown"}):\n\`\`\`${language || ""}\n${editorCode}\n\`\`\``;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Invalid response from AI service");
    }

    return NextResponse.json({
      message: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[SERVER] AI chat error:", errorMessage);
    
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
