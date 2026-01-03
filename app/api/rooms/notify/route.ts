import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAuthUserId } from "@/lib/getAuthUserId";

export async function POST(req: NextRequest) {
  try {
    // Use unified auth helper - works for both OAuth and custom auth
    const userId = await getAuthUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json(
        { error: "Invalid roomId format" },
        { status: 400 }
      );
    }

    const { roomsCollection } = await connectToMongo();
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.ownerId.toString() === userId) {
      return NextResponse.json(
        { error: "Room owner cannot subscribe to notifications" },
        { status: 400 }
      );
    }

    // Use $addToSet for atomic operation - prevents duplicates and creates array if missing
    const updateResult = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      {
        $addToSet: {
          collaborators: {
            userId: new ObjectId(userId),
            role: "participant",
            joinedAt: new Date(),
          },
        },
      }
    );

    const message =
      updateResult.modifiedCount > 0
        ? "Successfully subscribed to room notifications"
        : "Already subscribed to notifications";

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}