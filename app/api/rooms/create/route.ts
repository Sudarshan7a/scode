import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();

    const createSchema = z.object({
      title: z.string().min(1),
      duration: z.number().int().positive().optional(),
      scheduledAt: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
      isPrivate: z.boolean().optional(),
      status: z.string().optional(),
    });

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const title = payload.title;
    const duration = payload.duration ?? 30;

    const doc = {
      title,
      ownerId: new ObjectId(userId),
      collaborators: [],
      isPrivate: Boolean(body.isPrivate),
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
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
