/**
 * FCP Monitor - First Contentful Paint monitoring
 */
export interface FCPEntry {
    readonly name: string;
    readonly startTime: number;
    readonly duration: number;
}
export interface FCPMetric {
    readonly value: number;
    readonly rating: 'good' | 'needs-improvement' | 'poor';
    readonly entries: FCPEntry[];
    readonly delta: number;
    readonly id: string;
    readonly timestamp: number;
}
export declare class FCPMonitor {
    private entries;
    private observers;
    private fcpDetected;
    start(): void;
    observe(callback: (metric: FCPMetric) => void): void;
    getMetric(): FCPMetric | null;
    private handleEntry;
    private getRating;
    private notifyObservers;
    private generateId;
    reset(): void;
}
//# sourceMappingURL=fcp-monitor.d.ts.map