import { NextResponse, NextRequest } from "next/server";
import { verifyPassword } from "@/auth/core/passwordHasher";
import { connectToMongo } from "@/lib/mongodb";
import { loginSchema } from "@/types/authTypes";
import { Collection } from "mongodb";
import { User } from "@/types/mongodbTypes";
import { sendActionToken } from "@/lib/sendActionToken";
import { getIP } from "@/lib/getIp";
import { loginLimiter } from "@/lib/rateLimiter";
import { issueRefreshSession, setAuthCookies } from "@/lib/refreshSession";

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const { success } = await loginLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try in 5 minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);
    return await handleLoginRequest(email, password);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid input data",
          fieldErrors: undefined,
          details: error.message,
        },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function authenticateUser(
  email: string,
  password: string,
  usersCollection: Collection
) {
  const result = await usersCollection.findOne({ email });
  if (!result) {
    return { success: false, error: "User not found", status: 404 };
  }

  const isMatch = await verifyPassword(password, result.passwordHash);
  if (!isMatch) {
    return {
      success: false,
      error: "Invalid password, please try again",
      status: 401,
    };
  }

  return { success: true, user: result };
}
// refresh token creation & cookie setting handled by shared util

async function handleLoginRequest(email: string, password: string) {
  const { usersCollection } = await connectToMongo();
  const authResult = await authenticateUser(email, password, usersCollection);
  if (!authResult.success) {
    return NextResponse.json(
      { ok: false, message: authResult.error },
      { status: authResult.status }
    );
  }

  if (!authResult.user) {
    return NextResponse.json(
      { ok: false, message: "User data not found" },
      { status: 500 }
    );
  }

  const user = authResult.user as User & { _id: { toString(): string } };

  // If email not verified, send a fresh verification email and block login
  if (!user.emailVerified) {
    await sendActionToken({
      action: "verification",
      userId: user._id.toString(),
      email: user.email,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "Please verify your email before logging in. We've sent you a new verification link.",
        redirect: "/check-email",
      },
      { status: 403 }
    );
  }

  const userId = authResult.user._id.toString();
  const refreshToken = await issueRefreshSession(userId, { rotate: true });

  const res = NextResponse.json({
    ok: true,
    message: "Login successful",
    user: {
      id: userId,
      name: authResult.user.name,
      email: authResult.user.email,
      avatarId: authResult.user.avatarId,
      pronouns: authResult.user.pronouns,
      role: authResult.user.role,
      dateOfBirth: authResult.user.dateOfBirth,
    },
    redirect: "/dashboard",
  });

  setAuthCookies(res, refreshToken, userId);

  // Set non-httpOnly cookie for client-side auth check
  res.cookies.set("isAuthenticated", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return res;
}
