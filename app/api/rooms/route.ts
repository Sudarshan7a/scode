import { NextRequest, NextResponse } from "next/server";
import { mockRoomsData } from "@/constants/mockRooms";

export const GET = async (_request: NextRequest) => {
  // Mark param used for lint
  void _request;
  // Return all rooms (mocked)
  return NextResponse.json({ rooms: mockRoomsData });
};
