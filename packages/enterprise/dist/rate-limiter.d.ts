/**
 * Rate Limiter
 * API rate limiting and throttling
 */
export interface RateLimitConfig {
    readonly windowMs: number;
    readonly maxRequests: number;
    readonly strategy?: 'fixed' | 'sliding';
}
export declare class RateLimiter {
    private readonly config;
    private readonly limits;
    constructor(config: RateLimitConfig);
    check(identifier: string): boolean;
    getRemainingRequests(identifier: string): number;
    getResetTime(identifier: string): number;
    reset(identifier: string): void;
    clear(): void;
}
//# sourceMappingURL=rate-limiter.d.ts.map