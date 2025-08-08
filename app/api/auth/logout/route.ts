// import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToMongo } from "@/lib/mongodb";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies(); // from next/headers
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const { refreshTokensCollection } = await connectToMongo();
    if (refreshToken) {
      await refreshTokensCollection.deleteOne({ token: refreshToken });
    }
  } catch {
    // Error handling - silent fail for logout
  } finally {
    const res = NextResponse.json({
      message: "Logged out",
      redirect: "/login",
    });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("isLoggedIn", "false", { maxAge: 10, path: "/" });

    return res;
  }
}
