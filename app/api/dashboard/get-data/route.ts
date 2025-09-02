import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { mockRoomsData } from "@/constants/mockRooms";

export const GET = withAuth(async (_req: NextRequest, _userId: string) => {
  // Mark params as used to satisfy lint rules
  void _req;
  void _userId;

  // Simple derivation of upcoming rooms and activities using mock data
  const upcomingRooms = mockRoomsData
    .filter((r) => r.status === "scheduled")
    .slice(0, 3);

  const activities = {
    recentJoined: mockRoomsData.filter((r) => r.status === "ended").slice(0, 4),
    hosting: mockRoomsData
      .filter((r) => r.status === "live" || r.status === "scheduled")
      .slice(0, 4),
    savedNotes: mockRoomsData.slice(0, 4).map((room) => ({
      ...room,
      title: `${room.title} - Notes`,
      status: "saved",
    })),
  };

  return NextResponse.json({ upcomingRooms, activities });
});
