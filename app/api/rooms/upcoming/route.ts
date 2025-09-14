import { NextResponse } from "next/server";
import { getUpcomingRooms } from "@/lib/getMongoData";

export async function GET() {
  try {
    const rooms = await getUpcomingRooms();
    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch upcoming rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming rooms" },
      { status: 500 }
    );
  }
}
