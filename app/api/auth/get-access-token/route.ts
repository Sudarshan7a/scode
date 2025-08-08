// app/api/auth/refresh/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateAccessToken } from "@/auth/utils/generateAccessToken";
import { connectToMongo } from "@/lib/mongodb";

export async function POST() {
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Missing refresh token" },
      { status: 401 }
    );
  }
  const { refreshTokensCollection } = await connectToMongo();

  const tokenRecord = await refreshTokensCollection.findOne({
    token: refreshToken,
  });

  if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
    return NextResponse.json(
      { message: "Refresh token expired" },
      { status: 403 }
    );
  }
  const accessToken = await generateAccessToken(tokenRecord.userId);

  return NextResponse.json({ accessToken });
}
