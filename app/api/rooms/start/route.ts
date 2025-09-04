import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";

class HttpError extends Error {
  status: number;
  body: unknown;
  constructor(body: unknown, status = 500) {
    super(typeof body === "string" ? body : JSON.stringify(body));
    this.status = status;
    this.body = body;
  }
}

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

type StartPayload = z.infer<typeof startSchema>;

function validateStart(body: unknown): StartPayload {
  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError({ error: parsed.error.flatten() }, 400);
  }
  return parsed.data;
}

function getUserIdFromRequest(request: NextRequest): string {
  const userCookieID = request.cookies.get("userId");
  if (!userCookieID?.value) {
    throw new HttpError({ error: "Unauthorized" }, 401);
  }
  return userCookieID.value;
}

function buildRoomDoc(payload: StartPayload, userId: string) {
  const title = (payload.title || payload.roomName || payload.name || "")
    .toString()
    .trim();
  const duration = payload.duration ?? 30;

  if (!title) {
    throw new HttpError({ error: "title is required" }, 400);
  }

  const startedAt = new Date();

  return {
    title,
    ownerId: new ObjectId(userId),
    isPrivate: Boolean(payload.isPrivate),
    createdAt: startedAt,
    duration,
    // start immediately: set scheduledAt to startedAt
    scheduledAt: startedAt,
    startedAt: startedAt,
    description: payload.description ?? null,
    language: payload.language ?? null,
    status: payload.status ?? "live",
  };
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const payload = validateStart(body);

    const userId = getUserIdFromRequest(request);
    const doc = buildRoomDoc(payload, userId);

    const { roomsCollection } = await connectToMongo();
    const result = await roomsCollection.insertOne(doc);
    console.log("Inserted room with id:", result.insertedId.toString());

    return NextResponse.json(
      {
        message: "Room started successfully",
        roomId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return NextResponse.json(err.body, { status: err.status });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
