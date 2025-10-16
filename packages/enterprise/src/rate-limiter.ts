/**
 * Rate Limiter
 * API rate limiting and throttling
 */

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
  readonly strategy?: 'fixed' | 'sliding';
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private readonly config: RateLimitConfig;
  private readonly limits: Map<string, RateLimitEntry> = new Map();

  public constructor(config: RateLimitConfig) {
    this.config = {
      strategy: 'fixed',
      ...config
    };
  }

  public check(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || entry.resetAt <= now) {
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + this.config.windowMs
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  public getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || entry.resetAt <= Date.now()) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  public getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) {
      return Date.now();
    }

    return entry.resetAt;
  }

  public reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  public clear(): void {
    this.limits.clear();
  }
}
