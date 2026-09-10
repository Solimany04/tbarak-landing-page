import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Created lazily rather than at module scope: `next build` imports this module
// while collecting page data for /api/contact, and constructing a Redis client
// with empty credentials there is either a hard error or a silent misconfig.
let limiter: Ratelimit | null = null;

export function isRateLimitConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Returns the shared rate limiter, or null when Upstash is not configured.
 * Callers decide what to do without one (this app logs and lets the request
 * through, since Turnstile is still in front of the handler).
 */
export function getRatelimit(): Ratelimit | null {
  if (!isRateLimitConfigured()) {
    return null;
  }

  if (!limiter) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    });

    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:contact",
      analytics: false,
    });
  }

  return limiter;
}
