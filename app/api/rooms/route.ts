import { NextRequest, NextResponse } from "next/server";
import { getUpcomingRooms } from "@/lib/getMongoData";

export const GET = async (_request: NextRequest) => {
  // Mark param used for lint
  void _request;
  // Return upcoming rooms from DB
  const rooms = await getUpcomingRooms();
  return NextResponse.json({ rooms });
};
