import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // resolve owner id from middleware or cookie
    const userCookieID = request.cookies.get("userId");
    console.log("ran till here :");
    if (!userCookieID?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // accept title from common keys, and make duration optional with a default
    const title = (body.title || body.roomName || body.name || "")
      .toString()
      .trim();
    const duration = Number(body.duration ?? 30) || 30;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const createdAt = new Date();

    const doc: {
      title: string;
      ownerId: ObjectId;
      isPrivate: boolean;
      createdAt: Date;
      duration: number;
      scheduledAt: Date | null;
      startedAt: Date | null;
      description: string | null;
      language: string | null;
      status: string;
    } = {
      title,
      ownerId: new ObjectId(userCookieID.value),
      isPrivate: Boolean(body.isPrivate),
      createdAt,
      duration: duration,
      // start immediately: set scheduledAt to createdAt
      scheduledAt: createdAt,
      startedAt: createdAt,
      description: body.description ?? null,
      language: body.language ?? null,
      status: body.status ?? "live",
    };

    // now insert this to rooms collection in db
    const { roomsCollection } = await connectToMongo();
    const result = await roomsCollection.insertOne(doc);
    console.log("Inserted room with id:", result.insertedId.toString());

    const roomId = result.insertedId.toString();

    return NextResponse.json(
      { message: "Room started successfully", roomId },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
