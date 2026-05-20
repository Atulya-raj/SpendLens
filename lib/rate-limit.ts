/**
 * Rate limiter abstraction.
 * Uses Upstash Redis when configured, otherwise allows all requests (dev mode).
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // If Upstash is not configured, allow all requests
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true, remaining: 10 };
  }

  try {
    // Dynamic import with @ts-expect-error to allow compilation when optional deps are omitted in dev
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
    });

    const result = await ratelimit.limit(identifier);
    return { success: result.success, remaining: result.remaining };
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return { success: true, remaining: 10 };
  }
}
