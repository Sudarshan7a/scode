import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();

    // Find user with matching token
    const user = await usersCollection.findOne({
      "pendingEmail.verificationToken": token,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 404 }
      );
    }

    // Check if token has expired
    const tokenExpiry = new Date(user.pendingEmail.tokenExpiry);
    if (tokenExpiry < new Date()) {
      // Clean up expired token
      await usersCollection.updateOne(
        { _id: user._id },
        { $unset: { pendingEmail: "" } }
      );
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 410 }
      );
    }

    // Update email and remove pending email
    const result = await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          email: user.pendingEmail.newEmail,
        },
        $unset: {
          pendingEmail: "",
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email successfully updated",
      newEmail: user.pendingEmail.newEmail,
    });
  } catch (error) {
    console.error("Error verifying email change:", error);
    return NextResponse.json(
      { error: "Failed to verify email change" },
      { status: 500 }
    );
  }
}
