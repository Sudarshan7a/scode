import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { refreshToken } = await request.json();
  if (!refreshToken) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const { refreshTokensCollection } = await connectToMongo();
  const result = await refreshTokensCollection.findOne({ token: refreshToken });

  if (!result) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    userId: result.userId,
    token: result.token,
    expiresAt: result.expiresAt,
  });
}
