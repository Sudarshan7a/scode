import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getUpcomingRooms, getOldRooms } from "@/lib/getMongoData";
import { readMediumLimiter } from "@/lib/rateLimiter";

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  // Rate limiting by userId
  const { success } = await readMediumLimiter.limit(userId);

  if (!success) {
    console.warn(
      `[RateLimit] Dashboard data blocked: user ${userId} (too many requests)`
    );
    return NextResponse.json(
      {
        error:
          "Too many dashboard requests. Maximum 30 per minute. Please slow down.",
      },
      { status: 429 }
    );
  }

  // Mark req param as used to satisfy lint rules
  void _req;

  // Derive upcoming rooms and activities from MongoDB
  const allUpcoming = await getUpcomingRooms();
  const upcomingRooms = allUpcoming.slice(0, 3);

  const oldRooms = await getOldRooms();

  const activities = {
    recentJoined: oldRooms.slice(0, 4),
    hosting: allUpcoming.slice(0, 4),
    savedNotes: allUpcoming.slice(0, 4).map((room) => ({
      ...room,
      title: `${room.title} - Notes`,
      status: "saved",
    })),
  };

  return NextResponse.json({ upcomingRooms, activities });
});
