import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";
import { roomStartLimiter } from "@/lib/rateLimiter";

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
  roomId: z.string().optional(), // For starting existing scheduled rooms
  title: z.string().min(1).optional(),
  roomName: z.string().optional(),
  name: z.string().optional(),
  duration: z.number().int().positive().optional(),
  description: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  isPrivate: z.boolean().optional(),
  roomPassword: z.string().optional().nullable(), // Password for private rooms
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
    roomPassword:
      payload.isPrivate && payload.roomPassword ? payload.roomPassword : null,
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

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Rate limiting by userId
    const { success } = await roomStartLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] Room start blocked: user ${userId} (too many starts)`,
      );
      return NextResponse.json(
        {
          error:
            "Too many room starts. Maximum 20 starts per 10 minutes. Please slow down.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const payload = validateStart(body);
    const { roomsCollection } = await connectToMongo();

    // Case 1: Starting an existing scheduled room
    if (payload.roomId) {
      // Validate ObjectId format
      if (!ObjectId.isValid(payload.roomId)) {
        return NextResponse.json(
          { error: "Invalid room ID format" },
          { status: 400 },
        );
      }

      const room = await roomsCollection.findOne({
        _id: new ObjectId(payload.roomId),
      });

      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      // Verify that the current user is the owner/host
      if (String(room.ownerId) !== userId) {
        return NextResponse.json(
          { error: "Only the room owner can start the session" },
          { status: 403 },
        );
      }

      // Check if room is scheduled
      if (room.status !== "scheduled") {
        return NextResponse.json(
          { error: "Room is not in scheduled state" },
          { status: 400 },
        );
      }

      // Update room status to live and set startedAt
      const startedAt = new Date();
      await roomsCollection.updateOne(
        { _id: new ObjectId(payload.roomId) },
        {
          $set: {
            status: "live",
            startedAt: startedAt,
            updatedAt: startedAt,
          },
        },
      );

      return NextResponse.json(
        {
          message: "Room started successfully",
          roomId: payload.roomId,
          status: "live",
        },
        { status: 200 },
      );
    }

    // Case 2: Creating a new room (existing functionality)
    const doc = buildRoomDoc(payload, userId);
    const result = await roomsCollection.insertOne(doc);

    return NextResponse.json(
      {
        message: "Room started successfully",
        roomId: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return NextResponse.json(err.body, { status: err.status });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
