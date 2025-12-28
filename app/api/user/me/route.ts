import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { readHeavyLimiter } from "@/lib/rateLimiter";
import { getAuthUserId } from "@/lib/getAuthUserId";

/**
 * GET endpoint to fetch current user's profile
 * Handles both OAuth and custom auth users
 */
export async function GET(request: NextRequest) {
  try {
    // Use unified auth helper - works for both OAuth and custom auth
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated", authenticated: false },
        { status: 401 }
      );
    }

    // Rate limiting by userId (frequent client calls)
    const { success } = await readHeavyLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] User me blocked: user ${userId} (too many requests)`
      );
      return NextResponse.json(
        {
          error: "Too many requests. Maximum 60 per minute. Please slow down.",
          authenticated: false,
        },
        { status: 429 }
      );
    }

    const { usersCollection } = await connectToMongo();

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", authenticated: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "",
        avatarId: user.avatarId ?? 0,
        pronouns: user.pronouns || "",
        dateOfBirth: user.dateOfBirth || "",
        oauth: user.oauth || {},
        pendingEmail: user.pendingEmail || null,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", authenticated: false },
      { status: 500 }
    );
  }
}
