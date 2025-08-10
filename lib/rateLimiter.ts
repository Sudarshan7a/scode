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
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"), // 3 requests per 10 minutes
  analytics: true,
});
