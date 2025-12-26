import { NextRequest } from "next/server";
import { auth } from "./../auth";

/**
 * Unified helper to get authenticated user ID from request.
 * Handles both custom auth (cookies) and OAuth (NextAuth session).
 *
 * @param request - NextRequest object
 * @returns userId string or null if not authenticated
 *
 * @example
 * // In an API route:
 * const userId = await getAuthUserId(request);
 * if (!userId) {
 *   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * }
 */
export async function getAuthUserId(
  request: NextRequest
): Promise<string | null> {
  // 1. Try to get userId from cookie (works for both custom auth and OAuth)
  const cookieUserId = request.cookies.get("userId")?.value;
  if (cookieUserId) {
    return cookieUserId;
  }

  // 2. Fallback: Check NextAuth session (for OAuth users without cookie)
  const authProvider = request.cookies.get("authProvider")?.value;
  if (authProvider === "oauth") {
    try {
      const session = await auth();
      if (session?.user?.id) {
        return session.user.id;
      }
    } catch {
      // Session check failed
    }
  }

  return null;
}

/**
 * Check if user is authenticated via OAuth provider
 * @param request - NextRequest object
 * @returns boolean
 */
export function isOAuthUser(request: NextRequest): boolean {
  return request.cookies.get("authProvider")?.value === "oauth";
}
