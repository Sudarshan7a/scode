import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { withAuth } from "@/lib/authMiddleware";
import { ObjectId } from "mongodb";

export const GET = withAuth(
  async (request: NextRequest, userId: string): Promise<NextResponse> => {
    try {
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
          createdAt: user.createdAt,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
