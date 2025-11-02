import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { roomId, userId } = await req.json();
    console.log(
      "Notify request received for roomId:",
      roomId,
      "userId:",
      userId
    );

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: "roomId and userId are required" },
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

    const isCollaborator = room.collaborators?.some(
      (collab: { userId: ObjectId }) => collab.userId.toString() === userId
    );

    if (isCollaborator) {
      return NextResponse.json(
        { message: "Already subscribed to notifications" },
        { status: 200 }
      );
    }

    if (!room.collaborators) {
      await roomsCollection.updateOne(
        { _id: new ObjectId(roomId) },
        { $set: { collaborators: [] } }
      );
    }

    await roomsCollection.updateOne({ _id: new ObjectId(roomId) }, {
      $push: {
        collaborators: {
          userId: new ObjectId(userId),
          role: "participant",
          joinedAt: new Date(),
        },
      },
    } as any);

    return NextResponse.json(
      { message: "Successfully subscribed to room notifications" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
