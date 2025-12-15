import crypto from "crypto";

/**
 * Generates a cryptographically secure refresh token
 * Uses random bytes instead of bcrypt hash for unpredictability
 */
export async function generateRefreshToken(): Promise<string> {
  return crypto.randomBytes(64).toString("hex");
}
