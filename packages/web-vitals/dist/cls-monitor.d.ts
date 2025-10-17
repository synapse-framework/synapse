/**
 * CLS Monitor - Cumulative Layout Shift monitoring
 */
export interface LayoutShift {
    readonly value: number;
    readonly hadRecentInput: boolean;
    readonly startTime: number;
    readonly sources: Array<{
        readonly node?: string;
        readonly previousRect?: DOMRect;
        readonly currentRect?: DOMRect;
    }>;
}
export interface CLSEntry {
    readonly value: number;
    readonly hadRecentInput: boolean;
    readonly startTime: number;
    readonly sources: LayoutShift['sources'];
}
export interface CLSMetric {
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
    readonly entries: CLSEntry[];
    readonly delta: number;
    readonly id: string;
    readonly timestamp: number;
}
export declare class CLSMonitor {
    private entries;
    private observers;
    private sessionValue;
    private sessionEntries;
    start(): void;
    observe(callback: (metric: CLSMetric) => void): void;
    getMetric(): CLSMetric | null;
    private handleEntry;
    private getRating;
    private notifyObservers;
    private generateId;
    reset(): void;
    getCurrentValue(): number;
}
//# sourceMappingURL=cls-monitor.d.ts.map