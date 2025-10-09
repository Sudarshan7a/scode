import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";

export const GET = withAuth(
  async (request: NextRequest, userId: string): Promise<NextResponse> => {
    // get access token from headers
    const accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    // Access token validation (if needed, can add logic here)
    void accessToken;

    return NextResponse.json(
      { message: "Token received", userId: userId },
      { status: 200 }
    );
  }
);
