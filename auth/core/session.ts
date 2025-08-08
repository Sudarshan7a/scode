"use server";
// TODO: Create JWT utility functions here:
// 1. createJWT(user) - Create and sign JWT token
// 2. verifyJWT(token) - Verify and decode JWT token
// 3. setJWTCookie(token) - Set JWT as httpOnly cookie
// 4. clearJWTCookie() - Clear the JWT cookie
// 5. getJWTFromCookies() - Extract JWT from request cookies

import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: string;
  expiresAt: string;
};

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const payload = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    // Failed to verify, Please try again
  }
}

// TODO: You may want to rename this file to jwt.ts or jwtUtils.ts
