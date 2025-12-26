import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getAccessTokenFromHeader } from "./tokenUtils";
import { auth } from "@/auth";

export interface AuthValidationResult {
  success: boolean;
  userId?: string;
  error?: NextResponse;
  provider?: "oauth" | "token";
}

export async function validateAuthToken(
  request: NextRequest
): Promise<AuthValidationResult> {
  // First, check for OAuth session (NextAuth)
  try {
    const session = await auth();
    if (
      session?.user?.id &&
      session?.expires &&
      new Date(session.expires) > new Date()
    ) {
      return {
        success: true,
        userId: session.user.id,
        provider: "oauth",
      };
    }
  } catch {
    // OAuth check failed, continue to token check
  }

  // Second, check for access token (custom auth)
  try {
    // Extract token from Authorization header
    const token = getAccessTokenFromHeader(request.headers);
    if (!token) {
      return {
        success: false,
        error: NextResponse.json(
          { error: "No access token found" },
          { status: 401 }
        ),
      };
    }

    // Get userId from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return {
        success: false,
        error: NextResponse.json(
          { error: "User ID not found" },
          { status: 401 }
        ),
      };
    }

    // Verify JWT token
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const verifyTokenPayload = await jwtVerify(token, secretKey);

    // Validate token payload
    if (!verifyTokenPayload || verifyTokenPayload.payload.userId !== userId) {
      return {
        success: false,
        error: NextResponse.json(
          { error: "Invalid access token" },
          { status: 401 }
        ),
      };
    }

    return {
      success: true,
      userId: userId,
      provider: "token",
    };
  } catch (err) {
    void err;
    return {
      success: false,
      error: NextResponse.json(
        { error: "Token verification failed" },
        { status: 401 }
      ),
    };
  }
}

// Higher-order function for protected routes
export function withAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await validateAuthToken(request);

    if (!authResult.success) {
      return authResult.error!;
    }

    if (!authResult.userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    return handler(request, authResult.userId);
  };
}
