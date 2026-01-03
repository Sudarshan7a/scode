import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToMongo } from "@/lib/mongodb";
import { signOut } from "@/auth";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const authProvider = cookieStore.get("authProvider")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // For custom auth users - delete refresh token from DB
    if (refreshToken) {
      const { refreshTokensCollection } = await connectToMongo();
      await refreshTokensCollection.deleteOne({ token: refreshToken });
    }

    // For OAuth users - sign out from NextAuth session
    if (authProvider === "oauth") {
      try {
        await signOut({ redirect: false });
      } catch {
        // NextAuth signOut may fail if no active session, continue anyway
      }
    }

    // Build response with cleared cookies
    const res = NextResponse.json({
      message: "Logged out",
      redirect: "/login",
      clearCache: true,
      isOAuthUser: authProvider === "oauth",
    });

    // Clear all auth cookies
    const clearCookie = { maxAge: 0, path: "/" };
    res.cookies.set("refreshToken", "", clearCookie);
    res.cookies.set("userId", "", clearCookie);
    res.cookies.set("authProvider", "", clearCookie);
    res.cookies.set("isLoggedIn", "false", { maxAge: 10, path: "/" });
    res.cookies.set("isAuthenticated", "", clearCookie);

    // Clear NextAuth session cookies
    res.cookies.set("authjs.session-token", "", clearCookie);
    res.cookies.set("__Secure-authjs.session-token", "", clearCookie);

    return res;
  } catch {
    // Error handling - still clear cookies on failure
    const res = NextResponse.json({
      message: "Logged out",
      redirect: "/login",
      clearCache: true,
    });

    const clearCookie = { maxAge: 0, path: "/" };
    res.cookies.set("refreshToken", "", clearCookie);
    res.cookies.set("userId", "", clearCookie);
    res.cookies.set("authProvider", "", clearCookie);
    res.cookies.set("isLoggedIn", "false", { maxAge: 10, path: "/" });
    res.cookies.set("isAuthenticated", "", clearCookie);
    res.cookies.set("authjs.session-token", "", clearCookie);
    res.cookies.set("__Secure-authjs.session-token", "", clearCookie);

    return res;
  }
}
