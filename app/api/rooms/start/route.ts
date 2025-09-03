import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();

    const { roomsCollection } = await connectToMongo();

    const update: Record<string, any> = {
      $set: {
        status: "live",
        startedAt: new Date(),
      },
    };

    if (body.title !== undefined) update.$set.title = body.title;
    if (body.isPrivate !== undefined)
      update.$set.isPrivate = Boolean(body.isPrivate);

    // const result = await roomsCollection.updateOne(
    //   { _id: new ObjectId(roomId) },
    //   update
    // );

    const result = {
      insertedId: "mockedId",
      matchedCount: 1,
      modifiedCount: 1,
    };
    return NextResponse.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
});
