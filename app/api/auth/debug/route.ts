import { NextResponse } from "next/server";

/**
 * SECURITY: This debug route has been disabled in production.
 * In development, it only shows boolean flags, never actual tokens.
 */
export async function GET() {
  // Block in production - this route should not exist in prod
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Even in development, don't expose sensitive data
  return NextResponse.json({
    message: "Debug route disabled for security reasons",
    hint: "Use browser DevTools to inspect cookies and network requests",
    timestamp: new Date().toISOString(),
  });
}