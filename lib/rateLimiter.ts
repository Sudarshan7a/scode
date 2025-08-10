// lib/rateLimiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Some platforms (or dashboard inputs) accidentally wrap env values in quotes.
// Normalize by trimming and removing surrounding single/double quotes.
const sanitizeEnv = (v?: string) => v?.trim().replace(/^['"]+|['"]+$/g, "");

const url = sanitizeEnv(process.env.UPSTASH_REDIS_REST_URL);
const token = sanitizeEnv(process.env.UPSTASH_REDIS_REST_TOKEN);

// Initialize Upstash Redis with explicit, sanitized values to avoid
// errors like: "Upstash Redis client was passed an invalid URL ... Received: ""https://..."""
export const redis = new Redis({
  url: url as string,
  token: token as string,
});

// TEMP: Raised limits for testing (restore to lower production values later)
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"), // was 5/min
  analytics: true,
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 m"), // was 3 / 10min
  analytics: true,
});
