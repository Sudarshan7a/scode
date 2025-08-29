import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getAccessTokenFromHeader } from "./tokenUtils";

export interface AuthValidationResult {
  success: boolean;
  userId?: string;
  error?: NextResponse;
}

export async function validateAuthToken(
  request: NextRequest
): Promise<AuthValidationResult> {
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
    };
  } catch {
    return {
      success: false,
      error: NextResponse.json(
        { error: "Token verification failed" },
        { status: 401 }
      ),
    };
  }
}

// Alternative: Higher-order function approach
export function withAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await validateAuthToken(request);

    if (!authResult.success) {
      return authResult.error!;
    }

    return handler(request, authResult.userId!);
  };
}
