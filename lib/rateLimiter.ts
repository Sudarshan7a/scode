// lib/rateLimiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { getIP } from "./getIp";

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

/**
 * Helper function to extract userId from authenticated requests or fallback to IP
 * Used for hybrid endpoints that can be accessed by both authenticated and anonymous users
 */
export function getUserIdOrIP(req: NextRequest): string {
  // Try to get userId from cookie (set by auth middleware)
  const userId = req.cookies.get("userId")?.value;
  if (userId) {
    return `user:${userId}`;
  }
  
  // Fallback to IP address for anonymous users
  const ip = getIP(req);
  return `ip:${ip}`;
}

// ============================================================================
// TIER 1: AUTHENTICATION ENDPOINTS (Critical Security)
// ============================================================================

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
  prefix: "ratelimit:login",
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"), // 3 requests per 10 minutes
  analytics: true,
  prefix: "ratelimit:signup",
});

export const forgotPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"), // 3 requests per 15 minutes
  analytics: true,
  prefix: "ratelimit:forgot-password",
});

export const resetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 m"), // 5 requests per 30 minutes
  analytics: true,
  prefix: "ratelimit:reset-password",
});

export const verifyTokenLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"), // 10 requests per 10 minutes
  analytics: true,
  prefix: "ratelimit:verify-token",
});

// ============================================================================
// TIER 2: RESOURCE-INTENSIVE OPERATIONS (High Cost APIs)
// ============================================================================

// AI Chat - Dual-tier limiting to prevent both burst and sustained abuse
export const aiChatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "ratelimit:ai-chat:minute",
});

export const aiChatHourlyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 requests per hour
  analytics: true,
  prefix: "ratelimit:ai-chat:hourly",
});

// Code Execution - Dual-tier limiting for external API protection
export const codeExecuteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute
  analytics: true,
  prefix: "ratelimit:code-execute:minute",
});

export const codeExecuteHourlyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour
  analytics: true,
  prefix: "ratelimit:code-execute:hourly",
});

// ============================================================================
// TIER 3: ROOM OPERATIONS (Authenticated Users)
// ============================================================================

export const roomCreateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"), // 10 rooms per 10 minutes
  analytics: true,
  prefix: "ratelimit:room:create",
});

export const roomJoinLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "10 m"), // 30 joins per 10 minutes
  analytics: true,
  prefix: "ratelimit:room:join",
});

export const roomEndLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 m"), // 20 ends per 10 minutes
  analytics: true,
  prefix: "ratelimit:room:end",
});

export const roomStartLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 m"), // 20 starts per 10 minutes
  analytics: true,
  prefix: "ratelimit:room:start",
});

// ============================================================================
// TIER 3B: ROOM STATE OPERATIONS (High Priority)
// ============================================================================

export const roomUpdateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "5 m"), // 30 state updates per 5 minutes
  analytics: true,
  prefix: "ratelimit:room:update-state",
});

// ============================================================================
// TIER 4: PROFILE & EMAIL OPERATIONS (Medium Risk)
// ============================================================================

export const profileUpdateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 updates per 10 minutes
  analytics: true,
  prefix: "ratelimit:profile:update",
});

export const emailChangeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 email changes per hour
  analytics: true,
  prefix: "ratelimit:email:change",
});

export const emailVerifyChangeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 verifications per 10 minutes
  analytics: true,
  prefix: "ratelimit:email:verify-change",
});

export const videoTokenLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "5 m"), // 20 token requests per 5 minutes
  analytics: true,
  prefix: "ratelimit:video:token",
});

// ============================================================================
// TIER 5: READ OPERATIONS (Generous Limits)
// ============================================================================

// Heavy read operations (frequent client calls)
export const readHeavyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute
  analytics: true,
  prefix: "ratelimit:read:heavy",
});

// Medium read operations (less frequent)
export const readMediumLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
  analytics: true,
  prefix: "ratelimit:read:medium",
});
