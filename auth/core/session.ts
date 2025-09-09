"use server";
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
