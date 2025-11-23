import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToMongo } from "@/lib/mongodb";
import { sendActionToken } from "@/lib/sendActionToken";
import { forgotPasswordLimiter } from "@/lib/rateLimiter";
import { getIP } from "@/lib/getIp";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = getIP(req);
    const { success } = await forgotPasswordLimiter.limit(ip);

    if (!success) {
      console.warn(
        `[RateLimit] Forgot password blocked: ${ip} (too many attempts)`
      );
      return NextResponse.json(
        {
          ok: false,
          message:
            "Too many password reset attempts. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid input",
          fieldErrors: { email: "Invalid email" },
        },
        { status: 400 }
      );
    }
    const { email } = parse.data;
    const { usersCollection } = await connectToMongo();
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Email not registered",
          fieldErrors: { email: "Email not registered" },
        },
        { status: 404 }
      );
    }
    // generate + send reset token (best-effort)
    await sendActionToken({
      action: "forgotPassword",
      userId: String(user._id),
      email,
    });
    return NextResponse.json({
      ok: true,
      message: "A reset link was sent to your email address",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
