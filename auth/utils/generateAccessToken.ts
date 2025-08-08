import { SignJWT } from "jose/jwt/sign";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateAccessToken(userId: string) {
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15 minutes
    .sign(secret);
}
