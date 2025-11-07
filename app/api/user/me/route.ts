import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET endpoint to fetch current user's profile using httpOnly cookies
 * This solves the problem of client-side code unable to read httpOnly cookies
 */
export async function GET(request: NextRequest) {
  try {
    // Read userId from httpOnly cookie (server-side only)
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated", authenticated: false },
        { status: 401 }
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
