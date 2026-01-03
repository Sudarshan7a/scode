import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { readMediumLimiter, getUserIdOrIP } from "@/lib/rateLimiter";
import { getAuthUserId } from "@/lib/getAuthUserId";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting by userId or IP (public endpoint)
    const identifier = getUserIdOrIP(request);
    const { success } = await readMediumLimiter.limit(identifier);

    if (!success) {
      console.warn(
        `[RateLimit] User profile blocked: ${identifier} (too many requests)`
      );
      return NextResponse.json(
        {
          error:
            "Too many requests. Maximum 30 profile requests per minute. Please slow down.",
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get authenticated user (if any)
    const currentUserId = await getAuthUserId(request);
    const isOwnProfile = currentUserId === targetUserId;

    const { usersCollection } = await connectToMongo();

    const user = await usersCollection.findOne({
      _id: new ObjectId(targetUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return full profile for own profile, limited for others
    if (isOwnProfile) {
      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "",
          avatarId: user.avatarId ?? 0,
          pronouns: user.pronouns || "",
          dateOfBirth: user.dateOfBirth || "",
          oauth: user.oauth || {},
        },
      });
    }

    // Public profile - only non-sensitive fields
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        avatarId: user.avatarId ?? 0,
        pronouns: user.pronouns || "",
        role: user.role || "",
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}