/**
 * TTFB Monitor - Time to First Byte monitoring
 */
export interface TTFBEntry {
    readonly name: string;
    readonly startTime: number;
    readonly duration: number;
    readonly responseStart: number;
    readonly requestStart: number;
}
export interface TTFBMetric {
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
    readonly entries: TTFBEntry[];
    readonly delta: number;
    readonly id: string;
    readonly timestamp: number;
}
export declare class TTFBMonitor {
    private entries;
    private observers;
    start(): void;
    observe(callback: (metric: TTFBMetric) => void): void;
    getMetric(): TTFBMetric | null;
    private handleEntry;
    private getRating;
    private notifyObservers;
    private generateId;
    reset(): void;
}
//# sourceMappingURL=ttfb-monitor.d.ts.map