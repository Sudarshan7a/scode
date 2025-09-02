import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const GET = withAuth(
  async (_request: NextRequest, userId: string): Promise<NextResponse> => {
    try {
      const { usersCollection } = await connectToMongo();
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      return NextResponse.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
