/**
 * Metrics Aggregator - Aggregate metrics over time periods
 */
import type { Metric } from './metrics-collector.js';
export type AggregationFunction = 'sum' | 'average' | 'min' | 'max' | 'count' | 'median' | 'p95' | 'p99';
export type AggregationPeriod = '1m' | '5m' | '15m' | '1h' | '6h' | '24h' | '7d' | '30d';
export interface AggregatedMetric {
    readonly name: string;
    readonly period: AggregationPeriod;
    readonly function: AggregationFunction;
    readonly value: number;
    readonly startTime: number;
    readonly endTime: number;
    readonly sampleCount: number;
}
export declare class MetricsAggregator {
    private aggregations;
    /**
     * Aggregate a metric over a time period
     */
    aggregate(metric: Metric, period: AggregationPeriod, func: AggregationFunction, endTime?: number): AggregatedMetric;
    /**
     * Aggregate multiple metrics
     */
    aggregateMultiple(metrics: Metric[], period: AggregationPeriod, func: AggregationFunction, endTime?: number): AggregatedMetric[];
    /**
     * Get aggregation history for a metric
     */
    getAggregationHistory(metricName: string, period: AggregationPeriod, func: AggregationFunction): AggregatedMetric[];
    /**
     * Get all aggregations for a metric
     */
    getAllAggregations(metricName: string): AggregatedMetric[];
    /**
     * Calculate rolling aggregation
     */
    calculateRolling(metric: Metric, period: AggregationPeriod, func: AggregationFunction, windowSize?: number): AggregatedMetric[];
    /**
     * Compare aggregations between two time periods
     */
    compare(metric: Metric, period: AggregationPeriod, func: AggregationFunction, currentEndTime?: number, previousEndTime?: number): {
        readonly current: AggregatedMetric;
        readonly previous: AggregatedMetric;
        readonly difference: number;
        readonly percentageChange: number;
    };
    /**
     * Get trend analysis
     */
    analyzeTrend(metric: Metric, period: AggregationPeriod, func: AggregationFunction, dataPoints?: number): {
        readonly trend: 'increasing' | 'decreasing' | 'stable';
        readonly slope: number;
        readonly aggregations: AggregatedMetric[];
    };
    /**
     * Clear aggregation history
     */
    clear(): void;
    /**
     * Clear aggregations for a specific metric
     */
    clearMetric(metricName: string): void;
    /**
     * Get values in time range
     */
    private getValuesInRange;
    /**
     * Calculate aggregation based on function
     */
    private calculateAggregation;
    /**
     * Calculate percentile
     */
    private calculatePercentile;
    /**
     * Calculate linear regression slope
     */
    private calculateSlope;
    /**
     * Get start time for period
     */
    private getStartTime;
    /**
     * Get period in milliseconds
     */
    private getPeriodMs;
    /**
     * Get aggregation key
     */
    private getAggregationKey;
    /**
     * Get aggregation count
     */
    getAggregationCount(): number;
}
//# sourceMappingURL=metrics-aggregator.d.ts.map