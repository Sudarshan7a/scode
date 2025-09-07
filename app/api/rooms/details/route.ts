import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { z } from "zod";
import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const detailsSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
});

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const parsed = detailsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { roomId } = parsed.data;

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID format" },
        { status: 400 }
      );
    }

    const { roomsCollection } = await connectToMongo();

    // Find the room by ID
    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if current user is the host/owner
    const isHost = String(room.ownerId) === userId;

    // Return room details with host status
    return NextResponse.json(
      {
        roomId: roomId,
        isHost: isHost,
        status: room.status,
        title: room.title,
        description: room.description,
        language: room.language,
        scheduledAt: room.scheduledAt,
        endedAt: room.endedAt,
        duration: room.duration,
        isPrivate: room.isPrivate,
        room: room,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching room details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
