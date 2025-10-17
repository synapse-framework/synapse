/**
 * Network Profiler - Provides network profiling and analysis
 */
export interface NetworkTimings {
    readonly dnsLookup: number;
    readonly tcpConnection: number;
    readonly tlsHandshake: number;
    readonly firstByte: number;
    readonly contentDownload: number;
    readonly total: number;
}
export interface NetworkRequest {
    readonly id: string;
    readonly method: string;
    readonly url: string;
    readonly status: number;
    readonly requestHeaders: Record<string, string>;
    readonly responseHeaders: Record<string, string>;
    readonly requestSize: number;
    readonly responseSize: number;
    readonly timings: NetworkTimings;
    readonly timestamp: number;
    readonly error?: string;
}
export interface NetworkProfile {
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    readonly requests: NetworkRequest[];
    readonly totalRequests: number;
    readonly failedRequests: number;
    readonly totalBytesTransferred: number;
    readonly averageRequestTime: number;
    readonly slowestRequest: NetworkRequest | null;
    readonly fastestRequest: NetworkRequest | null;
    readonly metadata: Record<string, unknown>;
}
export declare class NetworkProfiler {
    private isRunning;
    private startTime;
    private endTime;
    private requests;
    private pendingRequests;
    /**
     * Start network profiling
     */
    start(): void;
    /**
     * Stop network profiling and return profile
     */
    stop(): NetworkProfile;
    /**
     * Record a network request
     */
    recordRequest(request: NetworkRequest): void;
    /**
     * Start tracking a request
     */
    startRequest(id: string, method: string, url: string): void;
    /**
     * Complete tracking a request
     */
    completeRequest(id: string, status: number, requestHeaders: Record<string, string>, responseHeaders: Record<string, string>, requestSize: number, responseSize: number, timings: NetworkTimings, error?: string): void;
    /**
     * Analyze network performance
     */
    analyzePerformance(): {
        readonly byDomain: Map<string, {
            readonly count: number;
            readonly totalTime: number;
        }>;
        readonly byMethod: Map<string, {
            readonly count: number;
            readonly totalTime: number;
        }>;
        readonly byStatus: Map<number, number>;
        readonly slowRequests: NetworkRequest[];
    };
    /**
     * Calculate bandwidth usage
     */
    calculateBandwidth(): {
        readonly totalBytes: number;
        readonly uploadBytes: number;
        readonly downloadBytes: number;
        readonly averageSpeed: number;
    };
    /**
     * Build complete network profile
     */
    private buildProfile;
    /**
     * Extract domain from URL
     */
    private extractDomain;
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning(): boolean;
    /**
     * Get current request count
     */
    getRequestCount(): number;
    /**
     * Clear all recorded requests
     */
    clearRequests(): void;
}
//# sourceMappingURL=network-profiler.d.ts.map