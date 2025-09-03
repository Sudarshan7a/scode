import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId, Document } from "mongodb";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const roomId = body.roomId;
    if (!roomId)
      return NextResponse.json({ error: "roomId required" }, { status: 400 });

    const { roomsCollection } = await connectToMongo();

    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });
    if (!room)
      return NextResponse.json({ error: "room not found" }, { status: 404 });
    const participant = {
      userId: new ObjectId(userId),
      role: (body.role as string) || "participant",
      joinedAt: new Date(),
    };

    // Use a typed update for pushing collaborator
    const updateResult = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $push: { collaborators: participant } } as unknown as Document
    );

    return NextResponse.json({
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
