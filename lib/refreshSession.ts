import { NextResponse } from "next/server";
import { connectToMongo } from "./mongodb";
import { generateRefreshToken } from "../auth/utils/generateRefreshToken";

interface IssueOptions {
  rotate?: boolean; // delete existing tokens
  ttlDays?: number;
  saltRounds?: number; // bcrypt cost for token generation
}

export async function issueRefreshSession(
  userId: string,
  { rotate = false, ttlDays = 7, saltRounds = 12 }: IssueOptions = {}
) {
  const { refreshTokensCollection } = await connectToMongo();

  if (rotate) {
    await refreshTokensCollection.deleteMany({ userId });
  }

  const refreshToken = await generateRefreshToken(userId, saltRounds);
  const now = Date.now();
  const newToken = {
    userId,
    token: refreshToken,
    createdAt: new Date(now),
    expiresAt: new Date(now + ttlDays * 24 * 60 * 60 * 1000),
  };
  await refreshTokensCollection.insertOne(newToken);
  return refreshToken;
}

export function setAuthCookies(
  res: NextResponse,
  refreshToken: string,
  userId: string,
  ttlDays = 7
) {
  const maxAge = ttlDays * 24 * 60 * 60; // seconds
  const base = {
    httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Use 'lax' so the cookie is available on top-level navigations after login
  sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
  res.cookies.set("refreshToken", refreshToken, base);
  res.cookies.set("userId", userId, base);
}
