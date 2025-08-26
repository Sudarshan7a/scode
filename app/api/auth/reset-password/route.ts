import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToMongo } from "@/lib/mongodb";
import { hashPassword } from "@/auth/core/passwordHasher";
import { redis } from "@/lib/rateLimiter";
import { strongPassword } from "@/types/authTypes";
import { ObjectId } from "mongodb";

// Schema: token, password, confirmPassword
const resetSchema = z
  .object({
    token: z.string().min(10),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key])
          fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, message: "Invalid input", fieldErrors },
        { status: 400 }
      );
    }
    const { token, password } = parsed.data;

    // Tokens stored as prefix:token (pwreset:<token>)
    const redisKey = `pwreset:${token}`;
    const userId = await redis.get<string>(redisKey);
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "Reset link is invalid or expired" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();
    const passwordHash = await hashPassword(password);
    const update = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { passwordHash } }
    );

    if (!update.matchedCount) {
      return NextResponse.json(
        { ok: false, message: "Account not found" },
        { status: 404 }
      );
    }

    // Invalidate token (optional — still fine to delete after use)
    await redis.del(redisKey).catch(() => {});

    return NextResponse.json({
      ok: true,
      message: "Password reset successful. You can now log in.",
      redirect: "/login",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
