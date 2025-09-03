import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
// import { connectToMongo } from "./../../../../lib/mongodb";
// import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = withAuth(async (request: NextRequest, _userId?: string) => {
  try {
    const body = await request.json();

    // DB writes are disabled during development; don't call DB helper.
    // const { roomsCollection } = await connectToMongo();

    const update: { $set: Record<string, unknown> } = {
      $set: {
        status: "live",
        startedAt: new Date(),
      },
    };

    if (body.title !== undefined) update.$set.title = body.title;
    if (body.isPrivate !== undefined)
      update.$set.isPrivate = Boolean(body.isPrivate);

    return NextResponse.json({ matched: 1, modified: 1, writeDisabled: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
