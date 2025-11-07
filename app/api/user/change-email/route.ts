import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newEmail } = body;

    if (!userId || !newEmail) {
      return NextResponse.json(
        { error: "User ID and new email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();

    // Check if new email already exists
    const existingUser = await usersCollection.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already in use" },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update user with pending email change
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          pendingEmail: {
            newEmail,
            verificationToken,
            tokenExpiry,
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Send verification email
    // For now, return the token (in production, send via email)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email-change?token=${verificationToken}`;

    return NextResponse.json({
      success: true,
      message: "Verification link sent to your new email address",
      // Remove this in production, only send via email
      verificationUrl,
    });
  } catch (error) {
    console.error("Error initiating email change:", error);
    return NextResponse.json(
      { error: "Failed to initiate email change" },
      { status: 500 }
    );
  }
}
