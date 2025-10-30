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

export async function POST(req: NextRequest) {
  try {
    const { message, editorCode, language } = await req.json();

    // Server-side logging
    console.log("[SERVER] Received AI request:", {
      message,
      language,
      hasEditorCode: !!editorCode,
      editorCodeLength: editorCode?.length || 0,
      editorCodePreview: editorCode ? editorCode.slice(0, 100) + (editorCode.length > 100 ? "..." : "") : "(no code)",
    });

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`;
    
    if (editorCode && editorCode.trim()) {
      prompt += `\n\nCurrent code in editor (${language}):\n\`\`\`${language}\n${editorCode}\n\`\`\``;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return NextResponse.json({
      message: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
