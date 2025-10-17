/**
 * Rate Limiter
 * API rate limiting and throttling
 */
export class RateLimiter {
    config;
    limits = new Map();
    constructor(config) {
        this.config = {
            strategy: 'fixed',
            ...config
        };
    }
    check(identifier) {
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
    getRemainingRequests(identifier) {
        const entry = this.limits.get(identifier);
        if (!entry || entry.resetAt <= Date.now()) {
            return this.config.maxRequests;
        }
        return Math.max(0, this.config.maxRequests - entry.count);
    }
    getResetTime(identifier) {
        const entry = this.limits.get(identifier);
        if (!entry) {
            return Date.now();
        }
        return entry.resetAt;
    }
    reset(identifier) {
        this.limits.delete(identifier);
    }
    clear() {
        this.limits.clear();
    }
}
//# sourceMappingURL=rate-limiter.js.map