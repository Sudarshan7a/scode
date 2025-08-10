import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToMongo } from "@/lib/mongodb";
import { redis } from "@/lib/rateLimiter";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { generateEmailTemplate } from "@/lib/EmailTemplate";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(req: Request) {
  try {
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
    // generate reset token
    const token = nanoid(32);
    await redis.set(`pwreset:${token}`, String(user._id), { ex: 900 }); // 15 min
    // send email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "reset@s-code.live",
        to: email,
        subject: "Reset Your Password",
        html: generateEmailTemplate("password-reset", token),
      });
    } catch {
      // If email send fails we still respond success to avoid enumeration detail
    }
    return NextResponse.json({
      ok: true,
      message: "If that email exists, a reset link was sent",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
