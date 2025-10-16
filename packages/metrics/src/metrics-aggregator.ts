/**
 * Metrics Aggregator - Aggregate metrics over time periods
 */

import type { Metric, MetricValue } from './metrics-collector.js';

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

export class MetricsAggregator {
  private aggregations = new Map<string, AggregatedMetric[]>();

  /**
   * Aggregate a metric over a time period
   */
  public aggregate(
    metric: Metric,
    period: AggregationPeriod,
    func: AggregationFunction,
    endTime: number = Date.now()
  ): AggregatedMetric {
    const startTime = this.getStartTime(endTime, period);
    const values = this.getValuesInRange(metric, startTime, endTime);

    const value = this.calculateAggregation(values, func);

    const aggregated: AggregatedMetric = {
      name: metric.name,
      period,
      function: func,
      value,
      startTime,
      endTime,
      sampleCount: values.length
    };

    // Store aggregation
    const key = this.getAggregationKey(metric.name, period, func);
    const existing = this.aggregations.get(key) || [];
    existing.push(aggregated);

    // Keep only last 1000 aggregations
    if (existing.length > 1000) {
      existing.shift();
    }

    this.aggregations.set(key, existing);

    return aggregated;
  }

  /**
   * Aggregate multiple metrics
   */
  public aggregateMultiple(
    metrics: Metric[],
    period: AggregationPeriod,
    func: AggregationFunction,
    endTime: number = Date.now()
  ): AggregatedMetric[] {
    return metrics.map(metric => this.aggregate(metric, period, func, endTime));
  }

  /**
   * Get aggregation history for a metric
   */
  public getAggregationHistory(
    metricName: string,
    period: AggregationPeriod,
    func: AggregationFunction
  ): AggregatedMetric[] {
    const key = this.getAggregationKey(metricName, period, func);
    return this.aggregations.get(key) || [];
  }

  /**
   * Get all aggregations for a metric
   */
  public getAllAggregations(metricName: string): AggregatedMetric[] {
    const result: AggregatedMetric[] = [];

    for (const [key, aggregations] of this.aggregations.entries()) {
      if (key.startsWith(metricName + ':')) {
        result.push(...aggregations);
      }
    }

    return result;
  }

  /**
   * Calculate rolling aggregation
   */
  public calculateRolling(
    metric: Metric,
    period: AggregationPeriod,
    func: AggregationFunction,
    windowSize: number = 10
  ): AggregatedMetric[] {
    const results: AggregatedMetric[] = [];
    const now = Date.now();
    const periodMs = this.getPeriodMs(period);

    for (let i = 0; i < windowSize; i++) {
      const endTime = now - (i * periodMs);
      const aggregated = this.aggregate(metric, period, func, endTime);
      results.unshift(aggregated);
    }

    return results;
  }

  /**
   * Compare aggregations between two time periods
   */
  public compare(
    metric: Metric,
    period: AggregationPeriod,
    func: AggregationFunction,
    currentEndTime: number = Date.now(),
    previousEndTime?: number
  ): {
    readonly current: AggregatedMetric;
    readonly previous: AggregatedMetric;
    readonly difference: number;
    readonly percentageChange: number;
  } {
    const periodMs = this.getPeriodMs(period);
    const prevEnd = previousEndTime || (currentEndTime - periodMs);

    const current = this.aggregate(metric, period, func, currentEndTime);
    const previous = this.aggregate(metric, period, func, prevEnd);

    const difference = current.value - previous.value;
    const percentageChange = previous.value !== 0
      ? (difference / previous.value) * 100
      : 0;

    return {
      current,
      previous,
      difference,
      percentageChange
    };
  }

  /**
   * Get trend analysis
   */
  public analyzeTrend(
    metric: Metric,
    period: AggregationPeriod,
    func: AggregationFunction,
    dataPoints: number = 10
  ): {
    readonly trend: 'increasing' | 'decreasing' | 'stable';
    readonly slope: number;
    readonly aggregations: AggregatedMetric[];
  } {
    const aggregations = this.calculateRolling(metric, period, func, dataPoints);

    if (aggregations.length < 2) {
      return {
        trend: 'stable',
        slope: 0,
        aggregations
      };
    }

    // Calculate linear regression slope
    const slope = this.calculateSlope(aggregations.map((a, i) => ({ x: i, y: a.value })));

    const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';

    return {
      trend,
      slope,
      aggregations
    };
  }

  /**
   * Clear aggregation history
   */
  public clear(): void {
    this.aggregations.clear();
  }

  /**
   * Clear aggregations for a specific metric
   */
  public clearMetric(metricName: string): void {
    for (const key of this.aggregations.keys()) {
      if (key.startsWith(metricName + ':')) {
        this.aggregations.delete(key);
      }
    }
  }

  /**
   * Get values in time range
   */
  private getValuesInRange(metric: Metric, startTime: number, endTime: number): number[] {
    return metric.values
      .filter(v => v.timestamp >= startTime && v.timestamp <= endTime)
      .map(v => v.value);
  }

  /**
   * Calculate aggregation based on function
   */
  private calculateAggregation(values: number[], func: AggregationFunction): number {
    if (values.length === 0) {
      return 0;
    }

    switch (func) {
      case 'sum':
        return values.reduce((sum, v) => sum + v, 0);

      case 'average':
        return values.reduce((sum, v) => sum + v, 0) / values.length;

      case 'min':
        return Math.min(...values);

      case 'max':
        return Math.max(...values);

      case 'count':
        return values.length;

      case 'median':
        return this.calculatePercentile(values, 0.5);

      case 'p95':
        return this.calculatePercentile(values, 0.95);

      case 'p99':
        return this.calculatePercentile(values, 0.99);

      default:
        return 0;
    }
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)] || 0;
  }

  /**
   * Calculate linear regression slope
   */
  private calculateSlope(points: Array<{ readonly x: number; readonly y: number }>): number {
    const n = points.length;
    if (n < 2) {
      return 0;
    }

    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  /**
   * Get start time for period
   */
  private getStartTime(endTime: number, period: AggregationPeriod): number {
    const periodMs = this.getPeriodMs(period);
    return endTime - periodMs;
  }

  /**
   * Get period in milliseconds
   */
  private getPeriodMs(period: AggregationPeriod): number {
    const periods: Record<AggregationPeriod, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    return periods[period];
  }

  /**
   * Get aggregation key
   */
  private getAggregationKey(name: string, period: AggregationPeriod, func: AggregationFunction): string {
    return `${name}:${period}:${func}`;
  }

  /**
   * Get aggregation count
   */
  public getAggregationCount(): number {
    return this.aggregations.size;
  }
}
