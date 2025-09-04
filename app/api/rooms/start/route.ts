import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const startSchema = z.object({
      title: z.string().min(1).optional(),
      roomName: z.string().optional(),
      name: z.string().optional(),
      duration: z.number().int().positive().optional(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      isPrivate: z.boolean().optional(),
      status: z.string().optional(),
    });

    const parsed = startSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const payload = parsed.data;

    // resolve owner id from middleware or cookie
    const userCookieID = request.cookies.get("userId");
    console.log("ran till here :");
    if (!userCookieID?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // accept title from common keys, and make duration optional with a default
    const title = (payload.title || payload.roomName || payload.name || "").toString().trim();
    const duration = payload.duration ?? 30;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const startedAt = new Date();

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
  isPrivate: Boolean(payload.isPrivate),
  createdAt: startedAt,
  duration: duration,
  // start immediately: set scheduledAt to startedAt
  scheduledAt: startedAt,
  startedAt: startedAt,
  description: payload.description ?? null,
  language: payload.language ?? null,
  status: payload.status ?? "live",
    };

    // now insert this to rooms collection in db
    const { roomsCollection } = await connectToMongo();
    const result = await roomsCollection.insertOne(doc);
    console.log("Inserted room with id:", result.insertedId.toString());

    return NextResponse.json(
      { message: "Room started successfully", roomId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
