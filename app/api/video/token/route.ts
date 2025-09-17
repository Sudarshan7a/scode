import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { StreamClient } from "@stream-io/node-sdk";

function respond(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function GET(req: NextRequest) {
  // 1. Static dev override
  // const staticToken = process.env.STREAM_VIDEO_DEFAULT_TOKEN;
  // if (staticToken) {
  //   return respond(200, {
  //     ok: true,
  //     mode: "static",
  //     token: staticToken,
  //     userId: process.env.STREAM_VIDEO_DEFAULT_USER_ID || null,
  //   });
  // }

  // 2. Signed token path with user upsert
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

  const store = await cookies();
  const userId = store.get("userId")?.value;
  if (!userId)
    return respond(401, { ok: false, message: "Authentication required" });
  if (!ObjectId.isValid(userId))
    return respond(400, { ok: false, message: "Invalid user id" });

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
    console.error("[video/token] user upsert or token generation error", e);
    return respond(500, { ok: false, message: "Failed to generate token" });
  }
}
