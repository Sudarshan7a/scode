import { redis } from "./rateLimiter";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { generateEmailTemplate } from "./EmailTemplate";

export type ActionTokenType = "verification" | "forgotPassword";

interface SendActionTokenOptions {
  action: ActionTokenType;
  userId: string;
  email: string;
  /** TTL seconds (defaults per action) */
  ttl?: number;
  /** Optional custom token length */
  size?: number;
}

const TEN_MINUTES = 600;
const ACTION_CONFIG: Record<
  ActionTokenType,
  { prefix: string; defaultTtl: number; from: string; subject: string }
> = {
  verification: {
    prefix: "verify",
    defaultTtl: TEN_MINUTES,
    from: "verify@s-code.live",
    subject: "Confirm Your Email Address",
  },
  forgotPassword: {
    prefix: "pwreset",
    defaultTtl: TEN_MINUTES,
    from: "reset@s-code.live",
    subject: "Reset Your Password",
  },
};

export async function sendActionToken({
  action,
  userId,
  email,
  ttl,
  size = 32,
}: SendActionTokenOptions) {
  const cfg = ACTION_CONFIG[action];
  const token = nanoid(size);
  const key = `${cfg.prefix}:${token}`;
  await redis.set(key, userId, { ex: ttl ?? cfg.defaultTtl });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: cfg.from,
      to: email,
      subject: cfg.subject,
      html: generateEmailTemplate(action, token),
    });
  } catch {
    // Best-effort; do not leak details
  }

  return { token, key, expiresIn: ttl ?? cfg.defaultTtl };
}
