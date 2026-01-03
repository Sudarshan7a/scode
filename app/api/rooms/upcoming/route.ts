import { NextRequest, NextResponse } from "next/server";
import { getUpcomingRooms } from "@/lib/getMongoData";
import { getAuthUserId } from "@/lib/getAuthUserId";

export async function GET(request: NextRequest) {
  try {
    // Use unified auth helper - works for both OAuth and custom auth
    const userId = await getAuthUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: not authenticated" },
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
