import "server-only";

interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
}

/**
 * Fixed-window, in-memory rate limiter.
 *
 * Good enough for a single-instance deployment. For serverless/multi-region
 * hosting, swap the Map for a shared store (Redis/Upstash) behind the same
 * `check()` signature — callers do not change.
 */
export function createRateLimiter({ limit, windowMs }: RateLimiterOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = hits.get(key);

      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        if (hits.size > 5_000) prune(now);
        return { allowed: true, retryAfterMs: 0 };
      }

      entry.count += 1;
      return entry.count > limit
        ? { allowed: false, retryAfterMs: entry.resetAt - now }
        : { allowed: true, retryAfterMs: 0 };
    },
  };

  function prune(now: number) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }
}
