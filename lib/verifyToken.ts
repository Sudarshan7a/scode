"use server";

import { redis } from "@/lib/rateLimiter";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { generateEmailTemplate } from "./EmailTemplate";

export async function generateVerifyToken(userId: string, email: string) {
  // Generate a random verification token
  const verifyToken = nanoid(32);
  console.log("Generated verification token:", verifyToken);

  const res = await redis.set(`verify:${verifyToken}`, userId, {
    ex: 600, // 600 seconds = 10 minutes
  });
  console.log("Stored verification token in Redis:", res);

  // TODO: Send verification email with token
  // await sendVerificationEmail(email, verifyToken);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailRes = await resend.emails.send({
    from: "verify@s-code.live",
    to: email,
    subject: "Confirm Your Email Address",
    html: generateEmailTemplate("verification", verifyToken),
  });
  console.log("Sent verification email:", emailRes);
}
