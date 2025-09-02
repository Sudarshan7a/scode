import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getUpcomingRooms, getOldRooms } from "@/lib/getMongoData";

export const GET = withAuth(async (_req: NextRequest, _userId: string) => {
  // Mark params as used to satisfy lint rules
  void _req;
  void _userId;

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
