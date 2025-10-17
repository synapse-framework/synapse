/**
 * Web Vitals Monitor
 *
 * Monitor Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 */
export interface WebVitals {
    readonly lcp?: number;
    readonly fid?: number;
    readonly cls?: number;
    readonly fcp?: number;
    readonly ttfb?: number;
}
export declare class WebVitalsMonitor {
    private readonly vitals;
    private isRunning;
    start(): void;
    stop(): void;
    recordLCP(value: number): void;
    recordFID(value: number): void;
    recordCLS(value: number): void;
    recordFCP(value: number): void;
    recordTTFB(value: number): void;
    getVitals(): WebVitals;
    clear(): void;
}
//# sourceMappingURL=web-vitals.d.ts.map