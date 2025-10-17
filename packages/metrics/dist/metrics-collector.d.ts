/**
 * Metrics Collector - Collect and store metrics
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export interface MetricValue {
    readonly value: number;
    readonly timestamp: number;
    readonly labels: Record<string, string>;
}
export interface Metric {
    readonly name: string;
    readonly type: MetricType;
    readonly description: string;
    readonly values: MetricValue[];
    readonly labels: string[];
    readonly unit: string;
}
export declare class MetricsCollector {
    private metrics;
    private counters;
    private gauges;
    private histograms;
    private summaries;
    /**
     * Register a new metric
     */
    registerMetric(name: string, type: MetricType, description: string, labels?: string[], unit?: string): void;
    /**
     * Increment a counter
     */
    incrementCounter(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Set a gauge value
     */
    setGauge(name: string, value: number, labels?: Record<string, string>): void;
    /**
     * Increment a gauge
     */
    incrementGauge(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Decrement a gauge
     */
    decrementGauge(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Observe a histogram value
     */
    observeHistogram(name: string, value: number, labels?: Record<string, string>): void;
    /**
     * Observe a summary value
     */
    observeSummary(name: string, value: number, labels?: Record<string, string>): void;
    /**
     * Get a metric by name
     */
    getMetric(name: string): Metric | undefined;
    /**
     * Get all metrics
     */
    getAllMetrics(): Metric[];
    /**
     * Get counter value
     */
    getCounterValue(name: string): number;
    /**
     * Get gauge value
     */
    getGaugeValue(name: string): number;
    /**
     * Get histogram statistics
     */
    getHistogramStats(name: string): {
        readonly sum: number;
        readonly count: number;
        readonly average: number;
        readonly buckets: ReadonlyMap<number, number>;
    };
    /**
     * Get summary statistics
     */
    getSummaryStats(name: string): {
        readonly sum: number;
        readonly count: number;
        readonly average: number;
        readonly min: number;
        readonly max: number;
        readonly percentiles: Record<number, number>;
    };
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Reset a specific metric
     */
    resetMetric(name: string): void;
    /**
     * Get metrics count
     */
    getMetricsCount(): number;
    /**
     * Check if metric exists
     */
    hasMetric(name: string): boolean;
    /**
     * Record a metric value
     */
    private recordValue;
    /**
     * Ensure metric exists and has correct type
     */
    private ensureMetricExists;
    /**
     * Get bucket key for histogram
     */
    private getBucketKey;
    /**
     * Calculate percentile from sorted values
     */
    private calculatePercentile;
}
//# sourceMappingURL=metrics-collector.d.ts.map