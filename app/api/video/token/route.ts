import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// Lazy import server SDK to avoid build failures if not installed yet in some environments
let StreamVideoServerClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  StreamVideoServerClient = require("@stream-io/node-sdk").StreamVideoServerClient;
} catch {
  // ignore, we'll report nicely if secure mode requested
}

function respond(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

/**
 * Video token endpoint
 * Priority order:
 * 1. If STREAM_VIDEO_DEFAULT_TOKEN is set -> return it (explicit dev override)
 * 2. Else if STREAM_API_SECRET + key available -> generate per-user short‑lived token
 * 3. Else -> configuration error
 */
export async function GET(req: NextRequest) {
  // 1. Static dev override
  const staticToken = process.env.STREAM_VIDEO_DEFAULT_TOKEN;
  if (staticToken) {
    return respond(200, {
      ok: true,
      mode: "static",
      token: staticToken,
      userId: process.env.STREAM_VIDEO_DEFAULT_USER_ID || "dev-user",
    });
  }

  // 2. Secure generation path
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;
  if (!apiKey || !apiSecret) {
    return respond(500, {
      ok: false,
      message: "Video service not configured (missing STREAM_API_KEY / STREAM_API_SECRET)",
    });
  }
  if (!StreamVideoServerClient) {
    return respond(500, {
      ok: false,
      message: "@stream-io/node-sdk not installed on server",
    });
  }

  // Identify user (cookie put in place by auth flow). Future: fall back to decrypting session JWT.
  const store = await cookies();
  const userId = store.get("userId")?.value;
  if (!userId) return respond(401, { ok: false, message: "Authentication required" });
  if (!ObjectId.isValid(userId)) return respond(400, { ok: false, message: "Invalid user id" });

  const exp = Math.floor(Date.now() / 1000) + 15 * 60; // 15m TTL
  try {
    const serverClient = new StreamVideoServerClient({ apiKey, apiSecret });
    const token = serverClient.generateUserToken({ user_id: userId, exp });
    return respond(200, {
      ok: true,
      mode: "signed",
      token,
      userId,
      expiresAt: exp,
    });
  } catch (e) {
    console.error("[video/token] generation error", e);
    return respond(500, { ok: false, message: "Failed to generate token" });
  }
}
