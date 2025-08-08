import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { redis } from "@/lib/rateLimiter";
import { ObjectId } from "mongodb";

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

    // Fail fast if required envs are missing (avoid opaque 500s in prod)
    if (!process.env.MONGODB_URI) {
      console.error("[verify] Missing MONGODB_URI env var");
      return NextResponse.json(
        { message: "Server not configured. Please try again later." },
        { status: 500 }
      );
    }
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      console.error("[verify] Missing Upstash Redis env vars");
      return NextResponse.json(
        { message: "Server not configured. Please try again later." },
        { status: 500 }
      );
    }

    const { usersCollection } = await connectToMongo();

    // Get user ID from Redis using the verification token (with explicit error handling)
    let userId: unknown = null;
    try {
      userId = await redis.get(`verify:${token}`);
    } catch (e) {
      console.error("[verify] Redis get failed:", e);
      return NextResponse.json(
        { message: "Unable to verify token. Please try again later." },
        { status: 500 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Validate ObjectId and update user
    const userIdStr = String(userId);
    if (!ObjectId.isValid(userIdStr)) {
      console.warn("[verify] Invalid ObjectId from redis:", userId);
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }
    let updateResult;
    try {
      updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userIdStr) },
        { $set: { emailVerified: true } }
      );
    } catch (e) {
      console.error("[verify] Mongo update failed:", e);
      return NextResponse.json(
        { message: "Unable to complete verification. Please try again later." },
        { status: 500 }
      );
    }

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove the verification token from Redis after successful verification (best-effort)
    try {
      // await redis.del(`verify:${token}`);
    } catch (e) {
      console.warn("[verify] Failed to clean up token in redis:", e);
    }

    return NextResponse.json({
      message: "Email verified successfully",
      redirect: "/login",
    });
  } catch (error) {
    console.error("[verify] Email verification unhandled error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
