import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Instantiate Redis and Ratelimit at module scope for reuse
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "ratelimit:contact",
  analytics: false,
});
