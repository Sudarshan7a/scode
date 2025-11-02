import { NextResponse } from "next/server";
import { getUpcomingRooms } from "@/lib/getMongoData";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    console.log("API userId from cookies:", userId, "limit:", limit);
    
    const rooms = await getUpcomingRooms(userId, limit);
    return NextResponse.json({ rooms, userId }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch upcoming rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming rooms" },
      { status: 500 }
    );
  }
}
