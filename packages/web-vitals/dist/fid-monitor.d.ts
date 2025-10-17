/**
 * FID Monitor - First Input Delay monitoring
 */
export interface FIDEntry {
    readonly name: string;
    readonly processingStart: number;
    readonly processingEnd: number;
    readonly duration: number;
    readonly startTime: number;
}
export interface FIDMetric {
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
    readonly entries: FIDEntry[];
    readonly delta: number;
    readonly id: string;
    readonly timestamp: number;
}
export declare class FIDMonitor {
    private entries;
    private observers;
    private firstInputDetected;
    start(): void;
    observe(callback: (metric: FIDMetric) => void): void;
    getMetric(): FIDMetric | null;
    private handleEntry;
    private getRating;
    private notifyObservers;
    private generateId;
    reset(): void;
}
//# sourceMappingURL=fid-monitor.d.ts.map