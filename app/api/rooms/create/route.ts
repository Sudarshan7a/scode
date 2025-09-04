import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
// import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";

export const POST = withAuth(async (request: NextRequest, userId?: string) => {
  try {
    const body = await request.json();
    //get userID from request cookies (prefer middleware userId, fallback to cookie)
    const userCookie = request.cookies.get("userId");
    const resolvedUserId = userId ?? userCookie?.value;
    // if no userId then return error
    if (!resolvedUserId) {
      console.log("No userId found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = (body.title || "").toString().trim();
    const duration = Number(body.duration || 0);

    if (!title || !duration) {
      return NextResponse.json(
        { error: "title and duration are required" },
        { status: 400 }
      );
    }

    const doc: {
      title: string;
      ownerId: ObjectId;
      isPrivate: boolean;
      createdAt: Date;
      duration: number;
      scheduledAt: Date | null;
      description: string | null;
      language: string | null;
      status: string;
    } = {
      title,
      ownerId: new ObjectId(resolvedUserId),
      isPrivate: Boolean(body.isPrivate),
      createdAt: new Date(),
      duration: duration || 30,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      description: body.description ?? null,
      language: body.language ?? null,
      status: body.status ?? "scheduled",
    };

    // now insert this to rooms collection in db
    const { roomsCollection } = await connectToMongo();

    const result = await roomsCollection.insertOne(doc);
    console.log("Inserted room with id:", Number(result.insertedId.toString()));
    // now return response with roomid as number

    return NextResponse.json(
      {
        message: "Room created successfully",
        roomId: Number(result.insertedId.toString()),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
