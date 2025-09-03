import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
// import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export const POST = withAuth(async (request: NextRequest, userId?: string) => {
  try {
    const body = await request.json();

    const title = (body.title || "").toString().trim();
    const duration = Number(body.duration || 0);

    if (!title || !duration) {
      return NextResponse.json(
        { error: "title and duration are required" },
        { status: 400 }
      );
    }

    // DB writes are disabled during development; keep the helper import for
    // future use but don't call it to avoid unused variable warnings.
    // const { roomsCollection } = await connectToMongo();

    // Build the room document with proper types
    const doc: {
      title: string;
      ownerId: ObjectId | null;
      isPrivate: boolean;
      createdAt: Date;
      duration: number;
      scheduledFor: Date | null;
      description: string | null;
      language: string | null;
      savedCodeId?: ObjectId;
      collaborators: unknown[];
      endedAt: Date | null;
      status: string;
    } = {
      title,
      ownerId: userId ? new ObjectId(userId) : null,
      isPrivate: Boolean(body.isPrivate),
      createdAt: new Date(),
      duration,
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
      description: body.description ?? null,
      language: body.language ?? null,
      savedCodeId: body.savedCodeId
        ? new ObjectId(body.savedCodeId)
        : undefined,
      collaborators: [],
      endedAt: null,
      status: body.status ?? "scheduled",
    };

    // Development mode: do not write to DB yet. Log the doc and return 202.
    // When ready, re-enable insertOne:
    // const result = await roomsCollection.insertOne(doc as Document);
    console.log("[rooms/create] doc (write disabled):", doc);

    return NextResponse.json(
      { message: "write-disabled", doc },
      { status: 202 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
