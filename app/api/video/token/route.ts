import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { StreamClient } from "@stream-io/node-sdk";
import { videoTokenLimiter } from "@/lib/rateLimiter";
import { connectToMongo } from "@/lib/mongodb";
import { getAuthUserId } from "@/lib/getAuthUserId";

function respond(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function GET(request: NextRequest) {
  // Use unified auth helper - works for both OAuth and custom auth
  const userId = await getAuthUserId(request);

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

  // Fetch user data from database to get real name and avatarId
  try {
    const { usersCollection } = await connectToMongo();
    const dbUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!dbUser) {
      return respond(404, { ok: false, message: "User not found" });
    }

    // Build user object with real data from database
    const user = {
      id: userId,
      role: "user",
      name: dbUser.name,
      image: "www.s-code.live/avatars/" + (dbUser.avatarId || 0) + ".png",
      custom: {
        color: "red",
      },
    };

    const server = new StreamClient(apiKey, apiSecret);

    await server.upsertUsers([user]);

    // Use recommended 4-hour token validity for better UX
    // Short enough for security, long enough to avoid mid-call refreshes
    const validitySeconds = 4 * 60 * 60; // 4 hours
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
    console.error("Failed to generate video token:", e);
    return respond(500, { ok: false, message: "Failed to generate token" });
  }
}