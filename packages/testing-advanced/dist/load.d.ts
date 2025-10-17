/**
 * Load Testing
 * Performance and stress testing
 */
export interface LoadConfig {
    readonly concurrency: number;
    readonly duration: number;
    readonly rampUp?: number;
}
export interface LoadTestResult {
    readonly totalRequests: number;
    readonly successfulRequests: number;
    readonly failedRequests: number;
    readonly averageResponseTime: number;
    readonly minResponseTime: number;
    readonly maxResponseTime: number;
    readonly requestsPerSecond: number;
    readonly percentiles: {
        readonly p50: number;
        readonly p95: number;
        readonly p99: number;
    };
}
export declare class LoadTester {
    private readonly config;
    constructor(config: LoadConfig);
    test(target: () => Promise<void>): Promise<LoadTestResult>;
}
//# sourceMappingURL=load.d.ts.map