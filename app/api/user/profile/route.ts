import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { readMediumLimiter, getUserIdOrIP } from "@/lib/rateLimiter";

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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
