import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  // Check for refresh token in cookies
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isLoggedIn = cookieStore.get("isLoggedIn")?.value;

  // Check for access token in Authorization header
  const authHeader = request.headers.get("Authorization");
  const hasAccessToken = authHeader && authHeader.startsWith("Bearer ");

  return NextResponse.json({
    hasRefreshToken: !!refreshToken,
    hasAccessToken: !!hasAccessToken,
    isLoggedIn: isLoggedIn === "true",
    accessToken: hasAccessToken ? authHeader.split(" ")[1] : null,
    timestamp: new Date().toISOString(),
  });
}
