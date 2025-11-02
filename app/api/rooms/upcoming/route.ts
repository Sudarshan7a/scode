import { NextResponse } from "next/server";
import { getUpcomingRooms } from "@/lib/getMongoData";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: userId not found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // Validate limit parameter
    let limit: number | undefined = undefined;

    if (limitParam !== null) {
      const parsed = parseInt(limitParam, 10);

      // Check if parsing resulted in a valid integer within allowed range
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
        return NextResponse.json(
          {
            error:
              "Invalid limit parameter. Must be an integer between 1 and 100.",
            provided: limitParam,
          },
          { status: 400 }
        );
      }

      limit = parsed;
    }

    console.log("API userId from cookies:", userId, "limit:", limit);

    const rooms = await getUpcomingRooms(userId, limit);
    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch upcoming rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming rooms" },
      { status: 500 }
    );
  }
}
