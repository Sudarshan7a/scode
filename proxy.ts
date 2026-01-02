// app/middleware.ts (if you're protecting routes)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

async function validateRefreshToken(refreshToken: string, origin: string) {
  try {
    const result = await fetch(`${origin}/api/auth/verify-refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    // Check if the response is ok and has JSON content type
    if (!result.ok) {
      return false;
    }

    const contentType = result.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return false;
    }

    const data = await result.json();

    if (!data?.userId) {
      return false;
    }
    if (!data?.token || new Date(data.expiresAt) < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const isLoginEvent = req.nextUrl.searchParams.get("login-signup") == "true";
  if (isLoginEvent) {
    const session = await auth();
    if (session?.expires && new Date(session.expires) > new Date()) {
      const res = NextResponse.redirect(new URL("/dashboard", req.url));
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge,
        path: "/",
      };

      if (!session?.user?.id) {
        console.error("[AUTH] No user ID in session");
        return NextResponse.redirect(new URL("/login", req.url));
      }
      res.cookies.set("userId", session.user.id, cookieOptions);
      res.cookies.set("authProvider", "oauth", cookieOptions);

      return res;
    }
  }
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    try {
      const session = await auth();
      if (session?.expires && new Date(session.expires) > new Date()) {
        return NextResponse.next();
      }
    } catch {
      // Session check failed, will redirect below
    }
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const isValid = await validateRefreshToken(refreshToken, req.nextUrl.origin);

  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/room/:path*"],
};
