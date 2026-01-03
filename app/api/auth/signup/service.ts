import { connectToMongo } from "@/lib/mongodb";
import { hashPassword } from "@/auth/core/passwordHasher";
import { generateRefreshToken } from "@/auth/utils/generateRefreshToken";
import type { User } from "@/types/mongodbTypes";

export async function createUser(
  email: string,
  password: string,
  username: string,
  hashPasswordFlag: boolean = true,
  authProvider?: string
) {
  const { usersCollection } = await connectToMongo();

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return { error: "User already exists", status: 409 } as const;
  }

  const lettersOnlyName = (username || "").replace(/[^A-Za-z]/g, "").trim();
  if (!lettersOnlyName || lettersOnlyName.length < 2) {
    return {
      error:
        "Username must contain only letters (A-Z) and be at least 2 characters",
      status: 400,
    } as const;
  }

  const newUser: User = {
    email,
    passwordHash: hashPasswordFlag
      ? await hashPassword(password)
      : authProvider
      ? authProvider
      : "",
    name: lettersOnlyName,
    role: "user" as const,
    emailVerified: authProvider ? true : false,
    createdAt: new Date(),
  };

  try {
    const result = await usersCollection.insertOne(newUser);
    return { userId: result.insertedId.toString(), user: newUser } as const;
  } catch (err) {
    return {
      error: `Failed to create user ${email} due to error: ${err}`,
      status: 500,
    } as const;
  }
}
export async function createRefreshToken(userId: string) {
  const { refreshTokensCollection } = await connectToMongo();
  const refreshToken = await generateRefreshToken();

  const newToken = {
    userId,
    token: refreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7),
  };

  await refreshTokensCollection.insertOne(newToken);
  return refreshToken;
}