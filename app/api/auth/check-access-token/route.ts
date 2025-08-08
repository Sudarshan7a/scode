import { generateAccessToken } from "@/auth/utils/generateAccessToken";
import { connectToMongo } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
// import { redis } from "@/lib/redis";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { refreshToken } = await req.json();
  if (!refreshToken) {
    return NextResponse.json({ valid: false });
  }

  const { refreshTokensCollection } = await connectToMongo();
  const userTok = await refreshTokensCollection.findOne({
    token: refreshToken,
  });
  if (!userTok) {
    return NextResponse.json({ valid: false });
  }

  try {
    const accessToken = await generateAccessToken(userTok.userId.toString());
    return NextResponse.json({ valid: true, accessToken });
  } catch {
    // JWT validation error
    return NextResponse.json(
      { valid: false, reason: "expired" },
      { status: 403 }
    );
  }
}
