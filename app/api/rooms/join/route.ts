import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

export const POST = withAuth(async (request: NextRequest, userId?: string) => {
  try {
    const body = await request.json();

    const rawId = body.roomId ?? body.roomName ?? body.url ?? body.id;
    const roomIdStr = extractRoomId(rawId);
    if (!roomIdStr) {
      return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    // resolve user
    const userCookie = request.cookies.get("userId");
    const resolvedUserId = userId ?? userCookie?.value;
    if (!resolvedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomsCollection } = await connectToMongo();

    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomIdStr),
    });
    if (!room)
      return NextResponse.json({ error: "room not found" }, { status: 404 });

    // If room is scheduled, inform client with scheduled time (don't allow join yet)
    if (room.status === "scheduled") {
      return NextResponse.json(
        {
          status: "scheduled",
          scheduledAt: room.scheduledAt ?? null,
          roomId: roomIdStr,
        },
        { status: 200 }
      );
    }

    // If room has ended, inform client that it's ended (no join)
    if (room.status === "ended") {
      return NextResponse.json(
        { status: "ended", roomId: roomIdStr },
        { status: 200 }
      );
    }

    // allow joining only when live
    if (room.status !== "live") {
      return NextResponse.json({ error: "room not joinable" }, { status: 403 });
    }

    // // check privacy: if private, ensure invited or owner
    // if (room.isPrivate) {
    //   const isOwner = String(room.ownerId) === String(resolvedUserId);
    //   const invited =
    //     Array.isArray(room.invited) &&
    //     room.invited.some(
    //       (id: unknown) => String(id) === String(resolvedUserId)
    //     );
    //   if (!isOwner && !invited) {
    //     return NextResponse.json(
    //       { error: "not invited to private room" },
    //       { status: 403 }
    //     );
    //   }
    // }

    const isOwner = String(room.ownerId) === String(resolvedUserId);

    if (isOwner) {
      return NextResponse.json(
        { role: "host", roomId: roomIdStr, room },
        { status: 200 }
      );
    }

    // otherwise add as participant if not already present
    const collaborator = {
      userId: new ObjectId(resolvedUserId),
      role: (body.role as string) || "participant",
      joinedAt: new Date(),
    };

    // push to collaborators array if not present
    const existing =
      Array.isArray(room.collaborators) &&
      room.collaborators.some(
        (c: any) => String(c.userId) === String(resolvedUserId)
      );
    if (!existing) {
      await roomsCollection.updateOne(
        { _id: new ObjectId(roomIdStr) },
        { $push: { collaborators: collaborator as any } }
      );
    }

    return NextResponse.json(
      { role: "participant", roomId: roomIdStr, room },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
