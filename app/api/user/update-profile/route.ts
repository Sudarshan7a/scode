import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, pronouns, role, dateOfBirth, avatarId } = body;

    // Get userId from httpOnly cookie
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
