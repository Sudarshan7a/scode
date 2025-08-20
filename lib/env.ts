/**
 * Environment variable validation utilities
 * 
 * This file demonstrates proper TypeScript patterns for validating
 * environment variables at runtime to prevent common beginner mistakes.
 */

interface EnvironmentConfig {
  MONGODB_URI: string;
  MONGODB_DB?: string;
  JWT_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  RESEND_API_KEY: string;
  MY_DOMAIN: string;
}

/**
 * Type-safe environment variable getter
 * 
 * ❌ Bad: process.env.MONGODB_URI! // Can cause runtime errors
 * ✅ Good: getRequiredEnv('MONGODB_URI') // Validates at startup
 */
export function getRequiredEnv(name: keyof EnvironmentConfig): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please check your .env.local file and ensure this variable is set.`
    );
  }
  return value;
}

/**
 * Optional environment variable getter with default
 */
export function getOptionalEnv(
  name: keyof EnvironmentConfig, 
  defaultValue: string
): string {
  return process.env[name] || defaultValue;
}

/**
 * Validate all required environment variables at startup
 * Call this in your app initialization to fail fast
 */
export function validateEnvironment(): EnvironmentConfig {
  const requiredVars: Array<keyof EnvironmentConfig> = [
    'MONGODB_URI',
    'JWT_SECRET', 
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RESEND_API_KEY',
    'MY_DOMAIN',
  ];

  const config: Partial<EnvironmentConfig> = {};
  
  for (const varName of requiredVars) {
    config[varName] = getRequiredEnv(varName);
  }

  // Optional variables
  config.MONGODB_DB = process.env.MONGODB_DB;

  return config as EnvironmentConfig;
}

/**
 * Type-safe environment config (validated once at startup)
 * 
 * Usage:
 * import { env } from '@/lib/env';
 * const uri = env.MONGODB_URI; // Guaranteed to exist
 */
export const env = validateEnvironment();

/**
 * Development helper to check which env vars are missing
 */
export function checkEnvironmentStatus(): {
  missing: string[];
  present: string[];
  hasAllRequired: boolean;
} {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET', 
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RESEND_API_KEY',
    'MY_DOMAIN',
  ];

  const missing: string[] = [];
  const present: string[] = [];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }

  return {
    missing,
    present,
    hasAllRequired: missing.length === 0,
  };
}