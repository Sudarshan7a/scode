import { NextRequest, NextResponse } from "next/server";
import { getAllRooms } from "@/lib/getMongoData";
import { readMediumLimiter, getUserIdOrIP } from "@/lib/rateLimiter";

export const GET = async (request: NextRequest) => {
  try {
    // Rate limiting by userId or IP (hybrid for authenticated/anonymous users)
    const identifier = getUserIdOrIP(request);
    const { success } = await readMediumLimiter.limit(identifier);

    if (!success) {
      console.warn(
        `[RateLimit] Rooms list blocked: ${identifier} (too many requests)`
      );
      return NextResponse.json(
        {
          error:
            "Too many requests. Maximum 30 room list requests per minute. Please slow down.",
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    // Parse and validate pagination parameters
    let page = 1;
    let pageSize = 20; // Default page size

    if (pageParam !== null) {
      const parsedPage = parseInt(pageParam, 10);
      if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return NextResponse.json(
          {
            error: "Invalid page parameter. Must be a positive integer.",
            provided: pageParam,
          },
          { status: 400 }
        );
      }
      page = parsedPage;
    }

    if (pageSizeParam !== null) {
      const parsedPageSize = parseInt(pageSizeParam, 10);
      if (
        !Number.isInteger(parsedPageSize) ||
        parsedPageSize < 1 ||
        parsedPageSize > 100
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid pageSize parameter. Must be an integer between 1 and 100.",
            provided: pageSizeParam,
          },
          { status: 400 }
        );
      }
      pageSize = parsedPageSize;
    }

    // Fetch paginated rooms
    const result = await getAllRooms(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
};
