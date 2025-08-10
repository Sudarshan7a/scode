import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToMongo } from "@/lib/mongodb";
import { sendActionToken } from "@/lib/sendActionToken";

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
