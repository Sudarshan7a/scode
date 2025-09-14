import { NextResponse } from "next/server";
import { getOldRooms } from "@/lib/getMongoData";

export async function GET() {
  try {
    const rooms = await getOldRooms();
    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch old rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch old rooms" },
      { status: 500 }
    );
  }
}
