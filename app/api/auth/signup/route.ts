import { NextRequest, NextResponse } from "next/server";
// Implementation details split into service + message modules for clarity
import { createUser, createRefreshToken } from "./service";
import type { SignupSuccess, SignupFailure } from "./types";
import {
  MSG_RATE_LIMIT,
  MSG_EMAIL_PASSWORD_REQUIRED,
  MSG_EMAIL_REQUIRED,
  MSG_PASSWORD_REQUIRED,
  MSG_UNSUPPORTED_DOMAIN,
  MSG_ACCOUNT_EXISTS,
  MSG_EMAIL_REGISTERED,
  MSG_GENERIC_CREATE_FAIL,
  MSG_INVALID_INPUT,
  MSG_INTERNAL_ERROR,
  MSG_SIGNUP_SUCCESS,
} from "./messages";
import { signupSchema } from "@/types/authTypes";
import { generateVerifyToken } from "@/lib/verifyToken";
import {
  isEmailDomainAllowed,
  allowedEmailDomains,
} from "@/types/mogodbValidation";
import { getIP } from "@/lib/getIp";
import { signupLimiter } from "@/lib/rateLimiter";

function respond(json: SignupSuccess | SignupFailure, status = 200) {
  return NextResponse.json(json, { status });
}

async function rateLimit(req: NextRequest) {
  const ip = getIP(req);
  const { success } = await signupLimiter.limit(ip);
  if (!success) {
    return respond({ ok: false, message: MSG_RATE_LIMIT }, 429);
  }
  return null;
}

function validateParsedInput(email?: string, password?: string) {
  if (!email || !password) {
    return respond(
      {
        ok: false,
        message: MSG_EMAIL_PASSWORD_REQUIRED,
        fieldErrors: {
          email: !email ? MSG_EMAIL_REQUIRED : undefined,
          password: !password ? MSG_PASSWORD_REQUIRED : undefined,
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
        message: MSG_UNSUPPORTED_DOMAIN,
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
          message: MSG_ACCOUNT_EXISTS,
          fieldErrors: { email: MSG_EMAIL_REGISTERED },
        }
      : {
          ok: false,
          message:
            typeof userResult.error === "string"
              ? userResult.error
              : MSG_GENERIC_CREATE_FAIL,
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
      message: MSG_SIGNUP_SUCCESS,
      user: { id: userId, name: user.name },
      redirect: "/check-email",
    };
    const res = respond(success, 200);
    setAuthCookies(res, refreshToken, userId);
    return res;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return respond({ ok: false, message: MSG_INVALID_INPUT }, 400);
    }
    console.error("Signup error:", error);
    return respond({ ok: false, message: MSG_INTERNAL_ERROR }, 500);
  }
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
