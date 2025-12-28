import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { profileUpdateLimiter } from "@/lib/rateLimiter";
import { getAuthUserId } from "@/lib/getAuthUserId";

export async function PUT(request: NextRequest) {
  try {
    // Use unified auth helper - works for both OAuth and custom auth
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Rate limiting by userId
    const { success } = await profileUpdateLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] Profile update blocked: user ${userId} (too many updates)`
      );
      return NextResponse.json(
        {
          error:
            "Too many profile updates. Maximum 5 updates per 10 minutes. Please slow down.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, pronouns, role, dateOfBirth, avatarId } = body;

    // Validate avatarId if provided
    if (avatarId !== undefined && (avatarId < 0 || avatarId > 6)) {
      return NextResponse.json(
        { error: "Avatar ID must be between 0 and 6" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();

    // Build update object
    const updateData: Record<string, string | number | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (pronouns !== undefined) updateData.pronouns = pronouns;
    if (role !== undefined) updateData.role = role;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (avatarId !== undefined) updateData.avatarId = avatarId;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch updated user data
    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser?._id.toString(),
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        avatarId: updatedUser?.avatarId,
        pronouns: updatedUser?.pronouns,
        dateOfBirth: updatedUser?.dateOfBirth,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
