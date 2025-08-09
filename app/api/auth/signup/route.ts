import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/auth/core/passwordHasher";
import { generateRefreshToken } from "@/auth/utils/generateRefreshToken";
import { connectToMongo } from "@/lib/mongodb";
import { User } from "@/types/mongodbTypes";
import { signupSchema } from "@/types/authTypes";
import { generateVerifyToken } from "@/lib/verifyToken";
import {
  isEmailDomainAllowed,
  allowedEmailDomains,
} from "@/types/mogodbValidation";
import { getIP } from "@/lib/getIp";
import { signupLimiter } from "@/lib/rateLimiter";

type SignupSuccess = {
  ok: true;
  message: string;
  redirect: string;
  user: { id: string; name: string };
};

type SignupFailure = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string | undefined>;
};

function respond(json: SignupSuccess | SignupFailure, status = 200) {
  return NextResponse.json(json, { status });
}

async function rateLimit(req: NextRequest) {
  const ip = getIP(req);
  const { success } = await signupLimiter.limit(ip);
  if (!success) {
    return respond(
      {
        ok: false,
        message: "Too many signup attempts. Please try in 10 minutes.",
      },
      429
    );
  }
  return null;
}

function validateParsedInput(email?: string, password?: string) {
  if (!email || !password) {
    return respond(
      {
        ok: false,
        message: "Email and password are required",
        fieldErrors: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
      },
      400
    );
  }
  return null;
}

function validateDomain(email: string) {
  if (!isEmailDomainAllowed(email)) {
    const domainList = allowedEmailDomains.join(", ");
    return respond(
      {
        ok: false,
        message: "We only support specific email domains",
        fieldErrors: { email: `We only support these domains: ${domainList}` },
      },
      400
    );
  }
  return null;
}

function mapUserCreationError(userResult: { error: string; status?: number }) {
  const status = userResult.status ?? 400;
  const body: SignupFailure =
    status === 409
      ? {
          ok: false,
          message: "An account with this email already exists",
          fieldErrors: { email: "Email is already registered" },
        }
      : {
          ok: false,
          message:
            typeof userResult.error === "string"
              ? userResult.error
              : "Failed to create account",
        };
  return respond(body, status);
}

export async function POST(req: NextRequest) {
  const rateLimitRes = await rateLimit(req);
  if (rateLimitRes) return rateLimitRes;

  try {
    const body = await req.json();
    const { email, password, username } = signupSchema.parse(body);

    const inputValidation = validateParsedInput(email, password);
    if (inputValidation) return inputValidation;

    const domainValidation = validateDomain(email);
    if (domainValidation) return domainValidation;

    const userResult = await createUser(email, password, username);
    if ("error" in userResult) {
      const failure = userResult as { error: string; status?: number };
      console.error("User creation error:", failure.error);
      return mapUserCreationError(failure);
    }

    const { userId, user } = userResult;
    const refreshToken = await createRefreshToken(userId);
    await generateVerifyToken(userId, user.email);

    const success: SignupSuccess = {
      ok: true,
      message:
        "Account created successfully. Please check your email to verify your account.",
      user: { id: userId, name: user.name },
      redirect: "/check-email",
    };
    const res = respond(success, 200);
    setAuthCookies(res, refreshToken, userId);
    return res;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return respond({ ok: false, message: "Invalid input data" }, 400);
    }
    console.error("Signup error:", error);
    return respond({ ok: false, message: "Internal server error" }, 500);
  }
}

async function createUser(email: string, password: string, username: string) {
  const { usersCollection } = await connectToMongo();

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return { error: "User already exists", status: 409 };
  }

  const hashedPassword = await hashPassword(password);
  // Enforce letters-only username to satisfy DB validator
  const lettersOnlyName = (username || "").replace(/[^A-Za-z]/g, "").trim();
  if (!lettersOnlyName || lettersOnlyName.length < 2) {
    return {
      error:
        "Username must contain only letters (A-Z) and be at least 2 characters",
      status: 400,
    };
  }
  const newUser: User = {
    email,
    passwordHash: hashedPassword,
    name: lettersOnlyName,
    role: "user" as const,
    emailVerified: false,
    createdAt: new Date(),
  };

  try {
    const result = await usersCollection.insertOne(newUser);
    return { userId: result.insertedId.toString(), user: newUser };
  } catch (err) {
    return {
      error: `Failed to create user ${email} due to error: ${err}`,
      status: 500,
    };
  }
}

async function createRefreshToken(userId: string) {
  const { refreshTokensCollection } = await connectToMongo();
  const refreshToken = await generateRefreshToken(userId, 12);

  const newToken = {
    userId: userId,
    token: refreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7), // 7 days
  };

  await refreshTokensCollection.insertOne(newToken);
  return refreshToken;
}

function setAuthCookies(
  response: NextResponse,
  refreshToken: string,
  userId: string
) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  };

  response.cookies.set("refreshToken", refreshToken, cookieOptions);
  response.cookies.set("userId", userId, cookieOptions);
}
