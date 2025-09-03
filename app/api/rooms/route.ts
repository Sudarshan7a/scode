import { NextRequest, NextResponse } from "next/server";
import { getAllRooms } from "@/lib/getMongoData";

export const GET = async (_request: NextRequest) => {
  // Mark param used for lint
  void _request;
  // Return upcoming rooms from DB
  const rooms = await getAllRooms();
  return NextResponse.json({ rooms });
};
