import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { roomId, userId } = await req.json();
    console.log("Notify request received");

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: "roomId and userId are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid roomId or userId format" },
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
