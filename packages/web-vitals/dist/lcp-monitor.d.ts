/**
 * LCP Monitor - Largest Contentful Paint monitoring
 */
export interface LCPEntry {
    readonly element: string;
    readonly url?: string;
    readonly size: number;
    readonly renderTime: number;
    readonly loadTime: number;
}
export interface LCPMetric {
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
    readonly entries: LCPEntry[];
    readonly delta: number;
    readonly id: string;
    readonly timestamp: number;
}
export declare class LCPMonitor {
    private entries;
    private observers;
    private lastValue;
    start(): void;
    observe(callback: (metric: LCPMetric) => void): void;
    getMetric(): LCPMetric | null;
    private handleEntry;
    private getRating;
    private notifyObservers;
    private generateId;
    reset(): void;
}
//# sourceMappingURL=lcp-monitor.d.ts.map