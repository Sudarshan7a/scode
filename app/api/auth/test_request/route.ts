import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";

export const GET = withAuth(
  async (request: NextRequest, userId: string): Promise<NextResponse> => {
    return NextResponse.json(
      { message: "Token received", userId: userId },
      { status: 200 }
    );
  }
);
