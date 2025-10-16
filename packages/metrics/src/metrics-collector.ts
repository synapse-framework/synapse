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

interface CounterState {
  value: number;
}

interface GaugeState {
  value: number;
}

interface HistogramState {
  buckets: Map<number, number>;
  sum: number;
  count: number;
}

interface SummaryState {
  values: number[];
  sum: number;
  count: number;
}

export class MetricsCollector {
  private metrics = new Map<string, Metric>();
  private counters = new Map<string, CounterState>();
  private gauges = new Map<string, GaugeState>();
  private histograms = new Map<string, HistogramState>();
  private summaries = new Map<string, SummaryState>();

  /**
   * Register a new metric
   */
  public registerMetric(
    name: string,
    type: MetricType,
    description: string,
    labels: string[] = [],
    unit: string = ''
  ): void {
    if (this.metrics.has(name)) {
      throw new Error(`Metric '${name}' is already registered`);
    }

    this.metrics.set(name, {
      name,
      type,
      description,
      values: [],
      labels,
      unit
    });

    // Initialize state based on type
    switch (type) {
      case 'counter':
        this.counters.set(name, { value: 0 });
        break;
      case 'gauge':
        this.gauges.set(name, { value: 0 });
        break;
      case 'histogram':
        this.histograms.set(name, {
          buckets: new Map(),
          sum: 0,
          count: 0
        });
        break;
      case 'summary':
        this.summaries.set(name, {
          values: [],
          sum: 0,
          count: 0
        });
        break;
    }
  }

  /**
   * Increment a counter
   */
  public incrementCounter(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.ensureMetricExists(name, 'counter');

    const counter = this.counters.get(name);
    if (counter !== undefined) {
      counter.value += value;
      this.recordValue(name, counter.value, labels);
    }
  }

  /**
   * Set a gauge value
   */
  public setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    this.ensureMetricExists(name, 'gauge');

    const gauge = this.gauges.get(name);
    if (gauge !== undefined) {
      gauge.value = value;
      this.recordValue(name, value, labels);
    }
  }

  /**
   * Increment a gauge
   */
  public incrementGauge(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.ensureMetricExists(name, 'gauge');

    const gauge = this.gauges.get(name);
    if (gauge !== undefined) {
      gauge.value += value;
      this.recordValue(name, gauge.value, labels);
    }
  }

  /**
   * Decrement a gauge
   */
  public decrementGauge(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.incrementGauge(name, -value, labels);
  }

  /**
   * Observe a histogram value
   */
  public observeHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
    this.ensureMetricExists(name, 'histogram');

    const histogram = this.histograms.get(name);
    if (histogram !== undefined) {
      histogram.sum += value;
      histogram.count += 1;

      // Add to appropriate bucket
      const bucketKey = this.getBucketKey(value);
      const currentCount = histogram.buckets.get(bucketKey) || 0;
      histogram.buckets.set(bucketKey, currentCount + 1);

      this.recordValue(name, value, labels);
    }
  }

  /**
   * Observe a summary value
   */
  public observeSummary(name: string, value: number, labels: Record<string, string> = {}): void {
    this.ensureMetricExists(name, 'summary');

    const summary = this.summaries.get(name);
    if (summary !== undefined) {
      summary.values.push(value);
      summary.sum += value;
      summary.count += 1;

      // Keep only recent values (last 1000)
      if (summary.values.length > 1000) {
        summary.values.shift();
      }

      this.recordValue(name, value, labels);
    }
  }

  /**
   * Get a metric by name
   */
  public getMetric(name: string): Metric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   */
  public getAllMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get counter value
   */
  public getCounterValue(name: string): number {
    const counter = this.counters.get(name);
    return counter?.value || 0;
  }

  /**
   * Get gauge value
   */
  public getGaugeValue(name: string): number {
    const gauge = this.gauges.get(name);
    return gauge?.value || 0;
  }

  /**
   * Get histogram statistics
   */
  public getHistogramStats(name: string): {
    readonly sum: number;
    readonly count: number;
    readonly average: number;
    readonly buckets: ReadonlyMap<number, number>;
  } {
    const histogram = this.histograms.get(name);
    if (histogram === undefined) {
      return { sum: 0, count: 0, average: 0, buckets: new Map() };
    }

    return {
      sum: histogram.sum,
      count: histogram.count,
      average: histogram.count > 0 ? histogram.sum / histogram.count : 0,
      buckets: new Map(histogram.buckets)
    };
  }

  /**
   * Get summary statistics
   */
  public getSummaryStats(name: string): {
    readonly sum: number;
    readonly count: number;
    readonly average: number;
    readonly min: number;
    readonly max: number;
    readonly percentiles: Record<number, number>;
  } {
    const summary = this.summaries.get(name);
    if (summary === undefined || summary.values.length === 0) {
      return {
        sum: 0,
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        percentiles: {}
      };
    }

    const sortedValues = [...summary.values].sort((a, b) => a - b);
    const percentiles: Record<number, number> = {
      50: this.calculatePercentile(sortedValues, 0.5),
      75: this.calculatePercentile(sortedValues, 0.75),
      90: this.calculatePercentile(sortedValues, 0.9),
      95: this.calculatePercentile(sortedValues, 0.95),
      99: this.calculatePercentile(sortedValues, 0.99)
    };

    return {
      sum: summary.sum,
      count: summary.count,
      average: summary.count > 0 ? summary.sum / summary.count : 0,
      min: sortedValues[0] || 0,
      max: sortedValues[sortedValues.length - 1] || 0,
      percentiles
    };
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.metrics.clear();
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.summaries.clear();
  }

  /**
   * Reset a specific metric
   */
  public resetMetric(name: string): void {
    const metric = this.metrics.get(name);
    if (metric === undefined) {
      return;
    }

    switch (metric.type) {
      case 'counter':
        this.counters.set(name, { value: 0 });
        break;
      case 'gauge':
        this.gauges.set(name, { value: 0 });
        break;
      case 'histogram':
        this.histograms.set(name, {
          buckets: new Map(),
          sum: 0,
          count: 0
        });
        break;
      case 'summary':
        this.summaries.set(name, {
          values: [],
          sum: 0,
          count: 0
        });
        break;
    }

    // Clear recorded values
    this.metrics.set(name, {
      ...metric,
      values: []
    });
  }

  /**
   * Get metrics count
   */
  public getMetricsCount(): number {
    return this.metrics.size;
  }

  /**
   * Check if metric exists
   */
  public hasMetric(name: string): boolean {
    return this.metrics.has(name);
  }

  /**
   * Record a metric value
   */
  private recordValue(name: string, value: number, labels: Record<string, string>): void {
    const metric = this.metrics.get(name);
    if (metric === undefined) {
      return;
    }

    const metricValue: MetricValue = {
      value,
      timestamp: Date.now(),
      labels
    };

    // Add to values array (keep last 10000)
    const values = [...metric.values, metricValue];
    if (values.length > 10000) {
      values.shift();
    }

    this.metrics.set(name, {
      ...metric,
      values
    });
  }

  /**
   * Ensure metric exists and has correct type
   */
  private ensureMetricExists(name: string, expectedType: MetricType): void {
    const metric = this.metrics.get(name);

    if (metric === undefined) {
      // Auto-register if it doesn't exist
      this.registerMetric(name, expectedType, `Auto-registered ${expectedType}`);
      return;
    }

    if (metric.type !== expectedType) {
      throw new Error(
        `Metric '${name}' is registered as '${metric.type}' but used as '${expectedType}'`
      );
    }
  }

  /**
   * Get bucket key for histogram
   */
  private getBucketKey(value: number): number {
    // Simple exponential buckets: 1, 2, 5, 10, 20, 50, 100, ...
    const buckets = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

    for (const bucket of buckets) {
      if (value <= bucket) {
        return bucket;
      }
    }

    return Infinity;
  }

  /**
   * Calculate percentile from sorted values
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) {
      return 0;
    }

    const index = Math.ceil(sortedValues.length * percentile) - 1;
    return sortedValues[Math.max(0, index)] || 0;
  }
}
