import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
// import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const roomId = body.roomId;
    if (!roomId)
      return NextResponse.json({ error: "roomId required" }, { status: 400 });

    // DB writes disabled; don't call connectToMongo to avoid unused vars.
    // const { roomsCollection } = await connectToMongo();

    // DB writes disabled: mock that the room exists for now.
    const _room = { _id: roomId };
    const participant = {
      userId: new ObjectId(userId),
      role: (body.role as string) || "participant",
      joinedAt: new Date(),
    };

    // Development: do not write to DB yet. Log attempt and return accepted.
    console.log("[rooms/join] add participant (write-disabled):", participant);

    return NextResponse.json({ matched: 1, modified: 1, writeDisabled: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
