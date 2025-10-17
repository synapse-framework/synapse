/**
 * Metrics Collector
 *
 * Collect and aggregate application metrics
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export interface Metric {
    readonly name: string;
    readonly type: MetricType;
    readonly value: number;
    readonly timestamp: number;
    readonly tags?: Record<string, string>;
}
export declare class MetricsCollector {
    private readonly metrics;
    private isRunning;
    constructor();
    start(): void;
    stop(): void;
    record(name: string, type: MetricType, value: number, tags?: Record<string, string>): void;
    increment(name: string, delta?: number): void;
    gauge(name: string, value: number): void;
    histogram(name: string, value: number): void;
    get(name: string): Metric | undefined;
    getAll(): Metric[];
    clear(): void;
}
//# sourceMappingURL=metrics.d.ts.map