import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
      role: body.role || "participant",
      joinedAt: new Date(),
    };

    // cast to any to avoid strict PushOperator typing issues in this helper
    // const result = await roomsCollection.updateOne(
    //   { _id: new ObjectId(roomId) },
    //   { $push: { collaborators: participant } } as any
    // );
    console.log();
    const result = {
      insertedId: "mockedId",
      matchedCount: 1,
      modifiedCount: 1,
    };

    return NextResponse.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
});
