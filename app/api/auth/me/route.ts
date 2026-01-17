import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { getAuthUserId } from "@/lib/getAuthUserId";
import { ObjectId } from "mongodb";

/**
 * GET endpoint to fetch current user's basic profile
 * Handles both OAuth and custom auth users
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Use unified auth helper - works for both OAuth and custom auth
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user from database
    const { usersCollection } = await connectToMongo();

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding password)
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatarId: user.avatarId,
        notifications: user.notifications,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
