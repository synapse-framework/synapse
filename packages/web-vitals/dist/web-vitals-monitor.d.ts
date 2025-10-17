/**
 * Web Vitals Monitor - Main interface for all web vitals monitoring
 */
import { type LCPMetric } from './lcp-monitor.js';
import { type FIDMetric } from './fid-monitor.js';
import { type CLSMetric } from './cls-monitor.js';
import { type FCPMetric } from './fcp-monitor.js';
import { type TTFBMetric } from './ttfb-monitor.js';
export interface WebVitalsConfig {
    readonly enableLCP: boolean;
    readonly enableFID: boolean;
    readonly enableCLS: boolean;
    readonly enableFCP: boolean;
    readonly enableTTFB: boolean;
    readonly reportInterval: number;
    readonly autoReport: boolean;
}
export interface WebVitalsReport {
    readonly lcp: LCPMetric | null;
    readonly fid: FIDMetric | null;
    readonly cls: CLSMetric | null;
    readonly fcp: FCPMetric | null;
    readonly ttfb: TTFBMetric | null;
    readonly timestamp: number;
    readonly score: WebVitalsScore;
}
export interface WebVitalsScore {
    readonly overall: number;
    readonly lcp: number;
    readonly fid: number;
    readonly cls: number;
    readonly fcp: number;
    readonly ttfb: number;
}
export declare class WebVitalsMonitor {
    private readonly config;
    private readonly lcpMonitor;
    private readonly fidMonitor;
    private readonly clsMonitor;
    private readonly fcpMonitor;
    private readonly ttfbMonitor;
    private reportInterval;
    private observers;
    constructor(config?: Partial<WebVitalsConfig>);
    start(): void;
    observe(callback: (report: WebVitalsReport) => void): void;
    getReport(): WebVitalsReport;
    private calculateScore;
    private ratingToScore;
    private triggerReport;
    private notifyObservers;
    private startAutoReport;
    stopAutoReport(): void;
    reset(): void;
    getConfig(): Readonly<WebVitalsConfig>;
    dispose(): void;
}
//# sourceMappingURL=web-vitals-monitor.d.ts.map