import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId, Document } from "mongodb";

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

    const { roomsCollection } = await connectToMongo();

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

    // Insert into DB and return inserted id.
    const result = await roomsCollection.insertOne(doc as Document);

    return NextResponse.json(
      { insertedId: result?.insertedId?.toString() ?? null },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
