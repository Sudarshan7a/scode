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

    const { usersCollection } = await connectToMongo();

    // Get user ID from Redis using the verification token
    const userId = await redis.get(`verify:${token}`);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user as verified using the userId
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId as string) },
      {
        $set: { emailVerified: true },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove the verification token from Redis after successful verification
    // await redis.del(`verify:${token}`);

    return NextResponse.json({
      message: "Email verified successfully",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
