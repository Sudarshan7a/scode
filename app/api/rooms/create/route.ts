import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { connectToMongo } from "@/lib/mongodb";
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

    const { roomsCollection } = await connectToMongo();

    const doc: Record<string, any> = {
      title,
      ownerId: new ObjectId(userId),
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

    // const result = await roomsCollection.insertOne(doc);
    console.log(doc);
    const result = { insertedId: "mockedId" };

    return NextResponse.json(
      { insertedId: result?.insertedId.toString() },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
});
