import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { z } from "zod";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId, UpdateFilter, Document, Collection } from "mongodb";
import { roomJoinLimiter } from "@/lib/rateLimiter";

type RoomLike = Document & {
  status?: string;
  scheduledAt?: string | Date | null;
  collaborators?: Array<{ userId?: ObjectId }>;
  ownerId?: unknown;
  _id?: unknown;
};

// Accept either raw id or full URL like https://yourdomain/room/<id>
function extractRoomId(input: unknown): string | null {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;

  // If it looks like an ObjectId (24 hex chars) return as-is
  if (/^[0-9a-fA-F]{24}$/.test(s)) return s;

  try {
    const url = new URL(s);
    // path like /room/<id> or /room/<id>/
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "room");
    if (idx >= 0 && parts.length > idx + 1) {
      const candidate = parts[idx + 1];
      if (/^[0-9a-fA-F]{24}$/.test(candidate)) return candidate;
    }
  } catch {
    // not a valid URL; fallthrough
  }

  return null;
}

// helper: find a room by id string
async function findRoom(
  roomsCollection: Collection<Document>,
  roomIdStr: string,
): Promise<Document | null> {
  return await roomsCollection.findOne({ _id: new ObjectId(roomIdStr) });
}

// helper: check status and return a response if not joinable, otherwise null
function checkRoomStatus(
  room: RoomLike,
  roomIdStr: string,
): NextResponse | null {
  const status = room.status;
  if (status === "scheduled") {
    return NextResponse.json(
      {
        status: "scheduled",
        scheduledAt: room.scheduledAt ?? null,
        roomId: roomIdStr,
      },
      { status: 200 },
    );
  }

  if (room.status === "ended") {
    return NextResponse.json(
      { status: "ended", roomId: roomIdStr },
      { status: 200 },
    );
  }

  if (status !== "live") {
    return NextResponse.json({ error: "room not joinable" }, { status: 403 });
  }

  return null;
}

// helper: ensure collaborator exists on the room (idempotent)
async function ensureCollaborator(
  roomsCollection: Collection<Document>,
  room: RoomLike,
  userIdStr: string,
  role: string | undefined,
): Promise<void> {
  type Collaborator = {
    userId: ObjectId;
    role: string;
    joinedAt: Date;
  };

  const collaborator: Collaborator = {
    userId: new ObjectId(userIdStr),
    role: (role as string) || "participant",
    joinedAt: new Date(),
  };

  const existing =
    Array.isArray(room.collaborators) &&
    room.collaborators!.some((c) => String(c.userId) === String(userIdStr));

  if (!existing) {
    await roomsCollection.updateOne({ _id: new ObjectId(String(room._id)) }, {
      $push: { collaborators: collaborator },
    } as unknown as UpdateFilter<Document>);
  }
}

class HttpError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(typeof body === "string" ? body : JSON.stringify(body));
    this.status = status;
    this.body = body;
  }
}

function validateJoinPayload(body: unknown) {
  const joinSchema = z.object({
    roomId: z.string().optional(),
    roomName: z.string().optional(),
    url: z.string().optional(),
    id: z.string().optional(),
    role: z.string().optional(),
    password: z.string().optional(), // Password for private rooms
  });

  const parsedReq = joinSchema.safeParse(body);
  if (!parsedReq.success) {
    throw new HttpError(400, { error: parsedReq.error.flatten() });
  }
  return parsedReq.data;
}

function getRoomIdFromPayload(payload: {
  roomId?: string;
  roomName?: string;
  url?: string;
  id?: string;
}) {
  const rawId = payload.roomId ?? payload.roomName ?? payload.url ?? payload.id;
  const roomIdStr = extractRoomId(rawId);
  if (!roomIdStr) {
    throw new HttpError(400, { error: "roomId required" });
  }
  return roomIdStr;
}

async function findRoomOrThrow(
  roomsCollection: Collection<Document>,
  roomIdStr: string,
) {
  const room = await findRoom(roomsCollection, roomIdStr);
  if (!room) {
    throw new HttpError(404, { error: "room not found" });
  }
  return room;
}

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const payload = validateJoinPayload(body);
    const roomIdStr = getRoomIdFromPayload(payload);

    // Rate limiting by userId
    const { success } = await roomJoinLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] Room join blocked: user ${userId} (too many joins)`,
      );
      return NextResponse.json(
        {
          error:
            "Too many room joins. Maximum 30 joins per 10 minutes. Please slow down.",
        },
        { status: 429 },
      );
    }

    const { roomsCollection } = await connectToMongo();
    const room = await findRoomOrThrow(roomsCollection, roomIdStr);

    // Check if room is private and requires password (skip for owner)
    const isOwner = String(room.ownerId) === String(userId);
    if (room.isPrivate && room.roomPassword && !isOwner) {
      if (!payload.password) {
        return NextResponse.json(
          { error: "Password required", requiresPassword: true },
          { status: 403 },
        );
      }
      if (payload.password !== room.roomPassword) {
        return NextResponse.json(
          { error: "Incorrect password", requiresPassword: true },
          { status: 403 },
        );
      }
    }

    const statusResp = checkRoomStatus(room, roomIdStr);
    if (statusResp) return statusResp;

    if (isOwner) {
      return NextResponse.json(
        { role: "host", roomId: roomIdStr, room },
        { status: 200 },
      );
    }

    await ensureCollaborator(roomsCollection, room, userId, payload.role);

    return NextResponse.json(
      { role: "participant", roomId: roomIdStr, room },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("[API] /api/rooms/join error:", err);
    if (err instanceof HttpError) {
      return NextResponse.json(err.body, { status: err.status });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
