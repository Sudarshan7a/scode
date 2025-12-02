import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { StreamClient } from "@stream-io/node-sdk";
import { videoTokenLimiter } from "@/lib/rateLimiter";

function respond(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  const store = await cookies();
  const userId = store.get("userId")?.value;
  if (!userId)
    return respond(401, { ok: false, message: "Authentication required" });
  if (!ObjectId.isValid(userId))
    return respond(400, { ok: false, message: "Invalid user id" });

  // Rate limiting by userId
  const { success } = await videoTokenLimiter.limit(userId);

  if (!success) {
    console.warn(
      `[RateLimit] Video token blocked: user ${userId} (too many token requests)`
    );
    return respond(429, {
      ok: false,
      message:
        "Too many video token requests. Maximum 20 per 5 minutes. Please slow down.",
    });
  }

  const apiKey =
    process.env.NEXT_PUBLIC_STREAM_API_KEY || process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return respond(500, {
      ok: false,
      message:
        "Video service not configured (missing STREAM_API_KEY / STREAM_API_SECRET)",
    });
  }

  // Build a basic user object (could be enriched from DB later)
  const user = {
    id: userId,
    role: "user",
    name: `User-${userId.slice(0, 6)}`,
    image: "https://wallpapercave.com/wp/wp7151807.jpg",
    custom: {
      color: "red",
    },
  } as const;

  try {
    const server = new StreamClient(apiKey, apiSecret);

    await server.upsertUsers([user]);

    const validitySeconds = 60 * 60; // 1 hour
    const token = server.generateUserToken({
      user_id: userId,
      validity_in_seconds: validitySeconds,
    });

    return respond(200, {
      ok: true,
      mode: "signed",
      token,
      userId,
      validitySeconds,
      user,
    });
  } catch (e) {
    void e;
    // Error during user upsert or token generation
    return respond(500, { ok: false, message: "Failed to generate token" });
  }
}
