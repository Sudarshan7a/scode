import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { issueRefreshSession, setAuthCookies } from "@/lib/refreshSession";
import { redis } from "@/lib/rateLimiter";
import { ObjectId } from "mongodb";

function validateEnv() {
  if (!process.env.MONGODB_URI) {
    console.error("[verify] Missing MONGODB_URI env var");
    return "Server not configured. Please try again later.";
  }
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.error("[verify] Missing Upstash Redis env vars");
    return "Server not configured. Please try again later.";
  }
  return null;
}

async function fetchUserIdFromRedis(
  token: string
): Promise<string | null | { error: string; status: number }> {
  try {
    const userId = await redis.get(`verify:${token}`);
    if (!userId) {
      return { error: "Invalid or expired verification token", status: 400 };
    }
    const userIdStr = String(userId);
    if (!ObjectId.isValid(userIdStr)) {
      console.warn("[verify] Invalid ObjectId from redis:", userId);
      return { error: "Invalid or expired verification token", status: 400 };
    }
    return userIdStr;
  } catch (e) {
    console.error("[verify] Redis get failed:", e);
    return {
      error: "Unable to verify token. Please try again later.",
      status: 500,
    };
  }
}

async function updateUserVerified(userId: string) {
  const { usersCollection } = await connectToMongo();
  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { emailVerified: true } }
    );
    if (result.matchedCount === 0) {
      return { error: "User not found", status: 404 };
    }
    return { ok: true };
  } catch (e) {
    console.error("[verify] Mongo update failed:", e);
    return {
      error: "Unable to complete verification. Please try again later.",
      status: 500,
    };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    const envError = validateEnv();
    if (envError) {
      return NextResponse.json({ message: envError }, { status: 500 });
    }

    const userIdResult = await fetchUserIdFromRedis(token);
    if (userIdResult === null) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }
    if (typeof userIdResult !== "string") {
      return NextResponse.json(
        { message: userIdResult.error },
        { status: userIdResult.status }
      );
    }

    const update = await updateUserVerified(userIdResult);
    if (update.error) {
      return NextResponse.json(
        { message: update.error },
        { status: update.status }
      );
    }

    try {
      await redis.del(`verify:${token}`);
    } catch (e) {
      console.warn("[verify] Failed to clean up token in redis:", e);
    }

    // Auto-issue refresh session & auth cookies so user goes straight to dashboard
    const refreshToken = await issueRefreshSession(userIdResult, { rotate: true });
    const res = NextResponse.json({
      ok: true,
      message: "Email verified successfully",
      redirect: "/dashboard",
    });
    setAuthCookies(res, refreshToken, userIdResult);
    return res;
  } catch (error) {
    console.error("[verify] Email verification unhandled error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
