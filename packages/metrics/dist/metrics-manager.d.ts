/**
 * Metrics Manager - Main interface for metrics management
 */
import { MetricsCollector, type Metric, type MetricType } from './metrics-collector.js';
import { MetricsDashboard, type DashboardConfig, type DashboardData } from './metrics-dashboard.js';
import { MetricsAggregator, type AggregationFunction, type AggregationPeriod, type AggregatedMetric } from './metrics-aggregator.js';
import { MetricsExporter, type ExportFormat, type ExportedData } from './metrics-exporter.js';
import { MetricsRegistry, type MetricMetadata, type MetricQuery } from './metrics-registry.js';
export interface MetricsConfig {
    readonly enableAutoCollection: boolean;
    readonly collectionInterval: number;
    readonly enableDashboard: boolean;
    readonly dashboardConfig?: DashboardConfig;
    readonly enableRegistry: boolean;
    readonly defaultCategory: string;
}
export interface MetricsSnapshot {
    readonly timestamp: number;
    readonly metrics: Metric[];
    readonly aggregations: AggregatedMetric[];
    readonly metadata: Record<string, unknown>;
}
export interface MetricsStats {
    readonly totalMetrics: number;
    readonly totalValues: number;
    readonly metricsPerType: Record<MetricType, number>;
    readonly oldestTimestamp: number;
    readonly newestTimestamp: number;
    readonly registryStats?: ReturnType<MetricsRegistry['getStats']>;
}
export declare class MetricsManager {
    private readonly config;
    private readonly collector;
    private readonly aggregator;
    private readonly exporter;
    private readonly registry;
    private dashboard;
    private autoCollectionInterval;
    private systemMetricsEnabled;
    constructor(config?: Partial<MetricsConfig>);
    /**
     * Register a new metric
     */
    registerMetric(name: string, type: MetricType, description: string, options?: {
        readonly labels?: string[];
        readonly unit?: string;
        readonly category?: string;
        readonly tags?: string[];
    }): void;
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
     * Get a metric
     */
    getMetric(name: string): Metric | undefined;
    /**
     * Get all metrics
     */
    getAllMetrics(): Metric[];
    /**
     * Aggregate a metric
     */
    aggregate(metricName: string, period: AggregationPeriod, func: AggregationFunction): AggregatedMetric | null;
    /**
     * Get aggregation history
     */
    getAggregationHistory(metricName: string, period: AggregationPeriod, func: AggregationFunction): AggregatedMetric[];
    /**
     * Export metrics
     */
    export(format: ExportFormat): ExportedData;
    /**
     * Query metrics from registry
     */
    query(query: MetricQuery): MetricMetadata[];
    /**
     * Get metrics by category
     */
    getByCategory(category: string): MetricMetadata[];
    /**
     * Get dashboard data
     */
    getDashboardData(): DashboardData | null;
    /**
     * Start dashboard auto-refresh
     */
    startDashboard(): void;
    /**
     * Stop dashboard auto-refresh
     */
    stopDashboard(): void;
    /**
     * Take a snapshot of all metrics
     */
    takeSnapshot(): MetricsSnapshot;
    /**
     * Get metrics statistics
     */
    getStats(): MetricsStats;
    /**
     * Enable system metrics collection
     */
    enableSystemMetrics(): void;
    /**
     * Start auto-collection of system metrics
     */
    startAutoCollection(): void;
    /**
     * Stop auto-collection
     */
    stopAutoCollection(): void;
    /**
     * Collect system metrics
     */
    private collectSystemMetrics;
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Get configuration
     */
    getConfig(): Readonly<MetricsConfig>;
    /**
     * Get collector
     */
    getCollector(): MetricsCollector;
    /**
     * Get aggregator
     */
    getAggregator(): MetricsAggregator;
    /**
     * Get exporter
     */
    getExporter(): MetricsExporter;
    /**
     * Get registry
     */
    getRegistry(): MetricsRegistry | null;
    /**
     * Get dashboard
     */
    getDashboard(): MetricsDashboard | null;
    /**
     * Dispose and cleanup
     */
    dispose(): void;
}
//# sourceMappingURL=metrics-manager.d.ts.map