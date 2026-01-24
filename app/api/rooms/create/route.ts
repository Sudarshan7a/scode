import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";
import { roomCreateLimiter } from "@/lib/rateLimiter";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // DEBUG: Log raw request body
    const body = await request.json();
    console.log("[DEBUG] /api/rooms/create - Raw body received:", JSON.stringify(body, null, 2));
    console.log("[DEBUG] /api/rooms/create - isPrivate value:", body.isPrivate, "type:", typeof body.isPrivate);
    console.log("[DEBUG] /api/rooms/create - roomPassword value:", body.roomPassword);

    // Rate limiting by userId
    const { success } = await roomCreateLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] Room creation blocked: user ${userId} (too many rooms)`,
      );
      return NextResponse.json(
        {
          error:
            "Too many room creations. Maximum 10 rooms per 10 minutes. Please slow down.",
        },
        { status: 429 },
      );
    }

    const createSchema = z.object({
      title: z.string().min(1),
      duration: z.number().int().positive().optional(),
      scheduledAt: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      isPrivate: z.boolean().optional(),
      privacyLevel: z.enum(["public", "private"]).optional(), // Accept privacyLevel from form
      roomPassword: z.string().optional().nullable(), // Password for private rooms
      status: z.string().optional(),
    });

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const title = payload.title;
    const duration = payload.duration ?? 30;

    // Map privacyLevel to isPrivate (privacyLevel takes precedence if provided)
    const isPrivate = payload.privacyLevel
      ? payload.privacyLevel === "private"
      : Boolean(payload.isPrivate);

    const doc = {
      title,
      ownerId: new ObjectId(userId),
      collaborators: [],
      isPrivate,
      roomPassword: isPrivate && payload.roomPassword ? payload.roomPassword : null,
      createdAt: new Date(),
      duration,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
      description: payload.description ?? null,
      language: payload.language ?? null,
      status: payload.status ?? "scheduled",
    };

    // now insert this to rooms collection in db
    const { roomsCollection } = await connectToMongo();
    const result = await roomsCollection.insertOne(doc);
    // now return response with roomid as number

    return NextResponse.json(
      {
        message: "Room created successfully",
        roomId: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
