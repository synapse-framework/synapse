/**
 * Performance Monitor
 *
 * Tracks application performance metrics including CPU, memory, and timing
 */
export declare class PerformanceMonitor {
    private readonly startTime;
    private readonly metrics;
    constructor();
    recordMetric(name: string, value: number): void;
    getMetric(name: string): number | undefined;
    getMetrics(): Record<string, number>;
    getCPUUsage(): number;
    getMemoryUsage(): MemoryUsage;
    getUptime(): number;
    measure(name: string, fn: () => void): number;
    measureAsync(name: string, fn: () => Promise<void>): Promise<number>;
}
export interface MemoryUsage {
    readonly heapUsed: number;
    readonly heapTotal: number;
    readonly external: number;
    readonly rss: number;
}
//# sourceMappingURL=performance-monitor.d.ts.map