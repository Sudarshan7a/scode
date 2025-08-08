// app/middleware.ts (if you're protecting routes)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function validateRefreshToken(refreshToken: string, origin: string) {
  const result = await fetch(`${origin}/api/auth/verify-refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await result.json();

  if (!data?.userId) {
    return false;
  }
  if (!data?.token || new Date(data.expiresAt) < new Date()) {
    return false;
  }

  return true;
}

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isValid = await validateRefreshToken(refreshToken, req.nextUrl.origin);

  if (!isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname, search } = req.nextUrl;
  const normalized = pathname.replace(/\/{2,}/g, "/");
  if (normalized !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(`${url.pathname}${search}`, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/room/:path*"],
};
