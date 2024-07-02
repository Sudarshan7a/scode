import bcrypt from "bcrypt";

export async function generateRefreshToken(
  userId: string,
  saltRounds: number = 12
): Promise<string> {
  try {
    return await bcrypt.hash(userId, saltRounds);
  } catch (error) {
    throw new Error(`Failed to generate refresh token: ${error}`);
  }
}
